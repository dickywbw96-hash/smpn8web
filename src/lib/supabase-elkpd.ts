// src/lib/supabase-elkpd.ts
// Supabase client KHUSUS e-LKPD — lazy init agar tidak error saat build Vercel

import { createClient, SupabaseClient } from '@supabase/supabase-js'

let _client: SupabaseClient | null = null

function getClient() {
  if (!_client) {
    const url = process.env.NEXT_PUBLIC_ELKPD_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_ELKPD_SUPABASE_ANON_KEY
    if (!url || !key) throw new Error('ELKPD Supabase env vars missing')
    _client = createClient(url, key)
  }
  return _client
}

// Proxy supaya semua file yang import `supabase` tidak perlu diubah
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return (getClient() as any)[prop]
  },
})