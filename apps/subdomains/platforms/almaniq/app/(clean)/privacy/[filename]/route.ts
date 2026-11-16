import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  const filename = params.filename
  if (filename.includes('JGXGiulhVYOKMW3bi8HPOix6rlt8eCZO')) {
    return new NextResponse('tiktok-developers-site-verification=JGXGiulhVYOKMW3bi8HPOix6rlt8eCZO', {
      headers: { 'Content-Type': 'text/plain' },
    })
  }
  if (filename.includes('Qq66dckswJpYzK34sEu9UQr13qj4x74s')) {
    return new NextResponse('tiktok-developers-site-verification=Qq66dckswJpYzK34sEu9UQr13qj4x74s', {
      headers: { 'Content-Type': 'text/plain' },
    })
  }
  const match = filename.match(/^tiktok([A-Za-z0-9]+)\.txt$/)
  if (match && match[1]) {
    return new NextResponse(`tiktok-developers-site-verification=${match[1]}`, {
      headers: { 'Content-Type': 'text/plain' },
    })
  }
  return new NextResponse('Not found', { status: 404 })
}
