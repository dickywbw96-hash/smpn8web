'use server'

import { createClient } from '@supabase/supabase-js'

export async function getUserData(userId: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''

  console.log('URL length:', url.length)
  console.log('KEY length:', key.length)
  console.log('KEY starts with:', key.substring(0, 20))

  const supabaseAdmin = createClient(url, key)

  const { data, error } = await supabaseAdmin
    .from('users')
    .select('role, is_active')
    .eq('id', userId)
    .single()

  console.log('QUERY error:', error?.message)
  console.log('QUERY data:', data)

  if (error || !data) return null
  return data
}