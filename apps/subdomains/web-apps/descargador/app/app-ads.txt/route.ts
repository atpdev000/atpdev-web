import { NextResponse } from 'next/server'
import { getSubdomainConfig } from '@atpdev/database'

export async function GET() {
  const config = getSubdomainConfig('descargador')
  const rawPubId = config?.monetization?.adsense_client_id || 'ca-pub-5414009811868137'
  const pubId = rawPubId.replace(/^ca-/, '')
  const content = `google.com, ${pubId}, DIRECT, f08c47fec0942fa0\n`

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate',
    },
  })
}

