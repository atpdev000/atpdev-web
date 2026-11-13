import { NextResponse } from 'next/server'
import { getSubdomainConfig } from '@atpdev/database'

export async function GET() {
  const config = getSubdomainConfig('descargador')
  const adsenseEnabled = config?.modules?.adsense_enabled !== false && config?.monetization?.adsense_enabled !== false
  if (!adsenseEnabled) {
    return new NextResponse('# AdSense disabled on this subdomain\n', {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  }
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

