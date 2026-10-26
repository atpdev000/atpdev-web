import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://yeeupdgjfrkkaurytyrs.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllZXVwZGdqZnJra2F1cnl0eXJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU1ODcwMjYsImV4cCI6MjEwMTE2MzAyNn0.cCfw0F5OI7S7Xxc43wA37UiTgueNwLKCF-uCsy-bxLc'

export function createClient() {
  return createBrowserClient(
    supabaseUrl,
    supabaseAnonKey
  )
}

