import { NextRequest, NextResponse } from 'next/server'

interface ProgressItem {
  percent: number
  speed?: string
  eta?: string
  status: 'starting' | 'downloading' | 'merging' | 'completed' | 'error'
  updatedAt: number
}

declare global {
  var __downloadProgressMap: Map<string, ProgressItem> | undefined
}

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id')

  if (!id || !globalThis.__downloadProgressMap) {
    return NextResponse.json({
      percent: 0,
      status: 'unknown'
    })
  }

  const progress = globalThis.__downloadProgressMap.get(id) || {
    percent: 0,
    status: 'unknown',
    updatedAt: Date.now()
  }

  return NextResponse.json(progress, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  })
}
