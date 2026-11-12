import { NextResponse } from 'next/server'
import { supabaseServer as supabase } from '@/lib/supabase-server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const dateParam = searchParams.get('date')
    
    const offset = -5;
    const localDate = new Date(new Date().getTime() + offset * 3600 * 1000);
    const calendarDate = dateParam || localDate.toISOString().split('T')[0];

    // 1. Fetch Ephemeris
    const { data: ephemerides } = await supabase
      .from('ephemerides')
      .select('*')
      .eq('display_date', calendarDate)
      .limit(1)
    
    const ephemeris = ephemerides?.[0] || null

    // 2. Fetch pending trends
    const { data: pendingTrends } = await supabase
      .from('trends')
      .select('*')
      .eq('status', 'pending')
      .order('detected_at', { ascending: false })
      .limit(15)

    // 3. Fetch curation
    const { data: curationRes } = await supabase
      .from('trend_curation')
      .select('*, trends(*)')

    // 4. Process curation data
    const yesterday = new Date(new Date().getTime() - 24 * 3600 * 1000)
    
    const allCuration = (curationRes || [])
      .filter(t => t.trends?.detected_at && new Date(t.trends.detected_at) >= yesterday)
      .sort((a, b) => {
        const timeA = new Date(a.trends.detected_at).getTime()
        const timeB = new Date(b.trends.detected_at).getTime()
        return timeB - timeA
      })

    const approvedTrends = allCuration
      .filter(t => t.is_approved)
      .map(t => ({
        id: t.trends.id,
        topic: t.trends.topic,
        score: t.originality_score,
        reason: t.curation_reason
      }))

    const rejectedTrends = allCuration
      .filter(t => !t.is_approved)
      .map(t => ({
        id: t.trends.id,
        topic: t.trends.topic,
        reason: t.curation_reason
      }))

    const pendingFormatted = (pendingTrends || []).map(t => ({
      id: t.id,
      topic: t.topic,
      source: t.source
    }))

    return NextResponse.json({
      date: calendarDate,
      ephemeris: ephemeris ? {
        year: ephemeris.historical_year,
        event: ephemeris.event
      } : null,
      approvedTrends,
      rejectedTrends,
      pendingTrends: pendingFormatted
    })
  } catch (error: any) {
    console.error('Error fetching trends catalog:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
