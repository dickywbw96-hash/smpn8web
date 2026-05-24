import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''
  return NextResponse.json({ status: 'ok', keyLength: key.length })
}

export async function POST(req: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''

  const supabaseAdmin = createClient(url, key)
  const { userId } = await req.json()

  if (!userId) return NextResponse.json(null, { status: 400 })

  const { data, error } = await supabaseAdmin
    .from('users')
    .select('role, is_active')
    .eq('id', userId)
    .single()

  if (error || !data) return NextResponse.json({ error: error?.message }, { status: 404 })
  return NextResponse.json(data)
}