import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''

  console.log('KEY length:', key.length)

  const supabaseAdmin = createClient(url, key)
  const { userId } = await req.json()

  if (!userId) return NextResponse.json(null, { status: 400 })

  const { data, error } = await supabaseAdmin
    .from('users')
    .select('role, is_active')
    .eq('id', userId)
    .single()

  console.log('error:', error?.message)
  console.log('data:', data)

  if (error || !data) return NextResponse.json(null, { status: 404 })
  return NextResponse.json(data)
}
