import { NextResponse } from 'next/server'
import { logPipelineEvent } from '@/lib/logger'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const startTime = Date.now()
  const url = new URL(request.url)
  const authHeader = request.headers.get('authorization')
  const secretHeader = request.headers.get('x-cron-secret')
  const secretQuery = url.searchParams.get('secret')

  const expectedSecret = process.env.CRON_SECRET || 'almaniq_cron_secret_2026'
  const isAuthorized =
    authHeader === `Bearer ${expectedSecret}` ||
    secretHeader === expectedSecret ||
    secretQuery === expectedSecret

  if (!isAuthorized && process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: 'Configuración de Supabase incompleta' }, { status: 500 })
  }

  try {
    // Obtener los últimos 20 posts publicados
    const res = await fetch(`${supabaseUrl}/rest/v1/daily_content?select=date,post_type,ephemeris_text,created_at&order=created_at.desc&limit=20`, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`
      }
    })

    const posts = await res.json()
    const analyticsRecords: any[] = []

    if (Array.isArray(posts)) {
      for (const p of posts) {
        // En una etapa avanzada, aquí se consulta la API de YouTube Analytics / TikTok API / FB Graph Insights
        // Por ahora registramos la estructura base para almacenar vistas, likes, retención y score de engagement
        const record = {
          date: p.date,
          post_type: p.post_type || 'trend',
          views_count: 0,
          likes_count: 0,
          shares_count: 0,
          updated_at: new Date().toISOString()
        }

        // Upsert a Supabase content_analytics
        await fetch(`${supabaseUrl}/rest/v1/content_analytics`, {
          method: 'POST',
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
            Prefer: 'resolution=merge-duplicates'
          },
          body: JSON.stringify(record)
        }).catch(() => {})

        analyticsRecords.push(record)
      }
    }

    const duration = Date.now() - startTime
    await logPipelineEvent({
      action: 'sync_analytics',
      status: 'success',
      duration_ms: duration,
      details: { processedPosts: analyticsRecords.length }
    })

    return NextResponse.json({
      success: true,
      duration_ms: duration,
      processedPosts: analyticsRecords.length
    })
  } catch (err: any) {
    const duration = Date.now() - startTime
    await logPipelineEvent({
      action: 'sync_analytics',
      status: 'error',
      duration_ms: duration,
      details: { error: err.message }
    })

    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
