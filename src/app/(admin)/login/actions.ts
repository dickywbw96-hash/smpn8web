'use server'

import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''
)

export async function getUserData(userId: string) {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('role, is_active')
    .eq('id', userId)
    .single()

  if (error || !data) return null
  return data
}