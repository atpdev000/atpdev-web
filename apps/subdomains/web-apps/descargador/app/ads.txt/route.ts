import { NextResponse } from 'next/server'

export async function GET() {
  return new NextResponse('AdSense disabled on web domain.', {
    status: 404,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'X-Robots-Tag': 'noindex, nofollow',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
