import { NextRequest, NextResponse } from 'next/server'
import { logVisitor, getTodayUniqueVisitorCount } from '@/lib/db'

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'

  const { page } = await req.json().catch(() => ({ page: '/' }))
  await logVisitor(ip, page)

  const count = await getTodayUniqueVisitorCount()
  return NextResponse.json({ count })
}

export async function GET() {
  const count = await getTodayUniqueVisitorCount()
  return NextResponse.json({ count })
}