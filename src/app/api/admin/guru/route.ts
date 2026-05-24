/**
 * app/api/admin/guru/route.ts
 * GET  /api/admin/guru        — semua guru (admin)
 * POST /api/admin/guru        — tambah guru baru
 */

import { NextResponse } from 'next/server'
import { getAllGuruAdmin, upsertGuru } from '@/lib/db'

export async function GET() {
  const data = await getAllGuruAdmin()
  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const body = await req.json()
  if (!body?.name?.trim()) {
    return NextResponse.json({ message: 'Nama wajib diisi' }, { status: 400 })
  }
  const result = await upsertGuru(body)
  if (!result) return NextResponse.json({ message: 'Gagal menyimpan' }, { status: 500 })
  return NextResponse.json(result, { status: 201 })
}