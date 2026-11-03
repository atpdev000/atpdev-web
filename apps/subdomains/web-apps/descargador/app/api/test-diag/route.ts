import { NextRequest, NextResponse } from 'next/server'
import { spawn } from 'child_process'
import { getYtDlpWithFfmpeg } from '@/lib/server/binaries'
import fs from 'fs'
import os from 'os'

export async function GET(request: NextRequest) {
  const { ffmpeg } = getYtDlpWithFfmpeg()
  const ffmpegBin = ffmpeg || 'ffmpeg'

  // 1. Extraer URLs frescas usando Invidious
  let videoUrl = ''
  let audioUrl = ''
  let hostUsed = ''

  const hosts = [
    'https://yt.chocolatemoo53.com',
    'https://inv.nadeko.net',
    'https://invidious.nerdvpn.de'
  ]

  for (const h of hosts) {
    try {
      const res = await fetch(`${h}/api/v1/videos/QiBqFulDykU`, { signal: AbortSignal.timeout(5000) })
      if (!res.ok) continue
      const data = await res.json()
      const v = data.adaptiveFormats?.find((x: any) => x.type?.startsWith('video/') && x.url)
      const a = data.adaptiveFormats?.find((x: any) => x.type?.startsWith('audio/') && x.url)
      if (v && a) {
        videoUrl = v.url
        audioUrl = a.url
        hostUsed = h
        break
      }
    } catch {}
  }

  const results: any = {
    ffmpegBin,
    hostUsed,
    hasVideoUrl: !!videoUrl,
    hasAudioUrl: !!audioUrl
  }

  if (!videoUrl || !audioUrl) {
    return NextResponse.json({ error: 'No se pudieron extraer URLs de prueba', results })
  }

  // Test 1: Node fetch directo desde Render al videoUrl
  try {
    const t0 = Date.now()
    const fRes = await fetch(videoUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Referer': 'https://www.youtube.com/'
      },
      signal: AbortSignal.timeout(6000)
    })
    results.nodeFetchVideo = {
      status: fRes.status,
      contentLength: fRes.headers.get('content-length'),
      elapsedMs: Date.now() - t0
    }
  } catch (e: any) {
    results.nodeFetchVideo = { error: e.message }
  }

  // Test 2: FFmpeg directo a URLs en Render (lo que hace /api/download/proxy)
  try {
    const tempOut = `${os.tmpdir()}/test_merge_${Date.now()}.mp4`
    const ffmpegArgs = [
      '-headers', 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36\r\nReferer: https://www.youtube.com/\r\n',
      '-i', videoUrl,
      '-headers', 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36\r\nReferer: https://www.youtube.com/\r\n',
      '-i', audioUrl,
      '-t', '2',
      '-c:v', 'copy',
      '-c:a', 'aac',
      '-y', tempOut
    ]

    const procRes = await new Promise<{ code: number | null, stderr: string }>((resolve) => {
      const p = spawn(ffmpegBin, ffmpegArgs, { windowsHide: true })
      let stderr = ''
      p.stderr.on('data', d => { stderr += d.toString() })
      p.on('close', code => resolve({ code, stderr }))
      p.on('error', err => resolve({ code: -1, stderr: err.message }))
    })

    results.ffmpegTest = {
      code: procRes.code,
      stderr: procRes.stderr.slice(-400)
    }
    try { if (fs.existsSync(tempOut)) fs.unlinkSync(tempOut) } catch {}
  } catch (e: any) {
    results.ffmpegTest = { error: e.message }
  }

  return NextResponse.json(results)
}
