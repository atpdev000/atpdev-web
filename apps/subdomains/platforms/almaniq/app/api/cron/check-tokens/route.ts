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
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: 'Configuración de Supabase incompleta' }, { status: 500 })
  }

  const warnings: string[] = []
  const checkedPlatforms: any[] = []

  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/platform_tokens?select=*`, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`
      }
    })

    const tokens = await res.json()
    const now = new Date()

    if (Array.isArray(tokens)) {
      for (const t of tokens) {
        const platform = t.platform
        const expiresAt = t.expires_at ? new Date(t.expires_at) : null

        let status = 'ok'
        let hoursLeft = 9999

        if (expiresAt) {
          hoursLeft = Math.round((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60))
          if (hoursLeft < 48) {
            status = hoursLeft <= 0 ? 'expired' : 'expiring_soon'
            warnings.push(`⚠️ Token de <b>${platform}</b> ${hoursLeft <= 0 ? 'ha expirado' : `vence en ${hoursLeft} horas`}.`)
          }
        }

        checkedPlatforms.push({ platform, status, hoursLeft })
      }
    }

    // Enviar alerta a Telegram si hay tokens por vencer
    if (warnings.length > 0 && botToken && chatId) {
      const message = `🔐 <b>Almaniq - Alerta de Autenticación de Redes</b>\n\n` + warnings.join('\n') + `\n\nPor favor revisa el panel de Vercel o reautentica en la app web.`
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'HTML'
        })
      })
    }

    const duration = Date.now() - startTime
    await logPipelineEvent({
      action: 'check_tokens',
      status: warnings.length > 0 ? 'warning' : 'success',
      duration_ms: duration,
      details: { checkedPlatforms, warningsCount: warnings.length }
    })

    return NextResponse.json({
      success: true,
      duration_ms: duration,
      checkedPlatforms,
      warnings
    })

  } catch (err: any) {
    const duration = Date.now() - startTime
    await logPipelineEvent({
      action: 'check_tokens',
      status: 'error',
      duration_ms: duration,
      details: { error: err.message }
    })

    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
