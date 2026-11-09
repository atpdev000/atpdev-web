import { NextResponse } from 'next/server';

export async function GET() {
  const content = 'google.com, pub-5414009811868137, DIRECT, f08c47fec0942fa0\n';
  return new NextResponse(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
