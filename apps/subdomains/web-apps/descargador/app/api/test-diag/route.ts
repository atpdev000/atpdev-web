import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import util from 'util'
import { getYtDlpWithFfmpeg } from '@/lib/server/binaries'

const execAsync = util.promisify(exec)

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url') || 'https://www.youtube.com/watch?v=QiBqFulDykU'
  const { ytDlp, ffmpeg, binDir } = getYtDlpWithFfmpeg()

  const results: any = {
    ytDlpBin: ytDlp,
    ffmpegBin: ffmpeg,
    binDir,
    envPlatform: process.platform,
    envArch: process.arch
  }

  // Test 1: yt-dlp dump-json SIN force-ipv4
  try {
    const cmd1 = `"${ytDlp}" --dump-json --no-warnings --extractor-args "youtube:player_client=visionos,ios" "${url}"`
    const { stdout } = await execAsync(cmd1, { timeout: 15000 })
    const json = JSON.parse(stdout)
    const f = json.formats?.find((x: any) => x.url && x.itag)
    results.test1_no_ipv4 = {
      ok: true,
      title: json.title,
      formatsCount: json.formats?.length,
      sampleFormat: f ? { itag: f.format_id, ip: f.url?.match(/ip=([^&]+)/)?.[1] } : null
    }
  } catch (e: any) {
    results.test1_no_ipv4 = { ok: false, error: e.message }
  }

  // Test 2: yt-dlp download 5s / 100k SIN force-ipv4
  try {
    const cmd2 = `"${ytDlp}" --no-warnings --extractor-args "youtube:player_client=visionos,ios" -f "160+140/best" --max-filesize 5M -o "/tmp/test_render_no_ipv4.%(ext)s" "${url}"`
    const { stdout, stderr } = await execAsync(cmd2, { timeout: 25000 })
    results.test2_download_no_ipv4 = {
      ok: true,
      stdout: stdout.slice(-300),
      stderr: stderr.slice(-300)
    }
  } catch (e: any) {
    results.test2_download_no_ipv4 = { ok: false, error: e.message }
  }

  // Test 3: yt-dlp download CON force-ipv4
  try {
    const cmd3 = `"${ytDlp}" --force-ipv4 --no-warnings --extractor-args "youtube:player_client=visionos,ios" -f "160+140/best" --max-filesize 5M -o "/tmp/test_render_ipv4.%(ext)s" "${url}"`
    const { stdout, stderr } = await execAsync(cmd3, { timeout: 25000 })
    results.test3_download_ipv4 = {
      ok: true,
      stdout: stdout.slice(-300),
      stderr: stderr.slice(-300)
    }
  } catch (e: any) {
    results.test3_download_ipv4 = { ok: false, error: e.message }
  }

  return NextResponse.json(results)
}
