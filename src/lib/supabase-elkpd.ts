// src/lib/supabase-elkpd.ts
// Supabase client KHUSUS e-LKPD — env var terpisah dari Supabase website utama

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_ELKPD_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_ELKPD_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
