/**
 * lib/logger.ts — Logger estructurado para Vercel Serverless Functions
 */

export interface LogEventOptions {
  action: string
  status: 'success' | 'error' | 'in_progress' | 'warning'
  duration_ms?: number
  details?: any
  date?: string
}

export async function logPipelineEvent({ action, status, duration_ms = 0, details = undefined, date = undefined }: LogEventOptions) {
  const timestamp = new Date().toISOString()
  const icon = status === 'success' ? '✅' : (status === 'error' ? '❌' : 'ℹ️')
  
  console.log(`[${timestamp}] ${icon} [${action}] (${duration_ms}ms) ${details ? (typeof details === 'object' ? JSON.stringify(details) : details) : ''}`)

  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) return

  try {
    const payload = {
      action,
      status,
      duration_ms,
      details: typeof details === 'object' ? details : { message: String(details || '') },
      date: date || new Date().toISOString().split('T')[0],
      created_at: timestamp
    }

    await fetch(`${supabaseUrl}/rest/v1/pipeline_logs`, {
      method: 'POST',
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal'
      },
      body: JSON.stringify(payload)
    })
  } catch (err: any) {
    console.warn(`[Logger] Warning guardando evento en pipeline_logs: ${err.message}`)
  }
}
