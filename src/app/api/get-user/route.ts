import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''
)

export async function POST(req: NextRequest) {
  const { userId } = await req.json()

  if (!userId) return NextResponse.json(null, { status: 400 })

  const { data, error } = await supabaseAdmin
    .from('users')
    .select('role, is_active')
    .eq('id', userId)
    .single()

  if (error || !data) return NextResponse.json(null, { status: 404 })

  return NextResponse.json(data)
}