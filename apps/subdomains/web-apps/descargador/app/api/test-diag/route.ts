import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import util from 'util'
import { getYtDlpWithFfmpeg } from '@/lib/server/binaries'

const execAsync = util.promisify(exec)

export async function GET(request: NextRequest) {
  const url = 'https://www.youtube.com/watch?v=QiBqFulDykU'
  const { ytDlp } = getYtDlpWithFfmpeg()

  const clients = ['android', 'ios', 'tv', 'tvhtml5', 'mweb', 'web_embedded']
  const results: any = {}

  for (const client of clients) {
    try {
      const cmd = `"${ytDlp}" --dump-json --no-warnings --extractor-args "youtube:player_client=${client}" "${url}"`
      const { stdout } = await execAsync(cmd, { timeout: 10000 })
      const json = JSON.parse(stdout)
      results[client] = { ok: true, formatsCount: json.formats?.length, title: json.title }
    } catch (e: any) {
      results[client] = { ok: false, error: e.message.split('\n')[1] || e.message }
    }
  }

  return NextResponse.json(results)
}
