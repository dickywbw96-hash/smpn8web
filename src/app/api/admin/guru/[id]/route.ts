/**
 * app/api/admin/guru/[id]/route.ts
 * GET    /api/admin/guru/:id   — detail satu guru
 * PUT    /api/admin/guru/:id   — update penuh
 * PATCH  /api/admin/guru/:id   — update sebagian (misal toggle is_active)
 * DELETE /api/admin/guru/:id   — hapus guru
 */

import { NextResponse } from 'next/server'
import { getGuruById, upsertGuru, deleteGuru } from '@/lib/db'

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const data = await getGuruById(params.id)
  if (!data) return NextResponse.json({ message: 'Tidak ditemukan' }, { status: 404 })
  return NextResponse.json(data)
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json()
  if (!body?.name?.trim()) {
    return NextResponse.json({ message: 'Nama wajib diisi' }, { status: 400 })
  }
  const result = await upsertGuru({ ...body, id: params.id })
  if (!result) return NextResponse.json({ message: 'Gagal menyimpan' }, { status: 500 })
  return NextResponse.json(result)
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json()
  const existing = await getGuruById(params.id)
  if (!existing) return NextResponse.json({ message: 'Tidak ditemukan' }, { status: 404 })
  const result = await upsertGuru({ ...existing, ...body, id: params.id })
  if (!result) return NextResponse.json({ message: 'Gagal menyimpan' }, { status: 500 })
  return NextResponse.json(result)
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const ok = await deleteGuru(params.id)
  if (!ok) return NextResponse.json({ message: 'Gagal menghapus' }, { status: 500 })
  return NextResponse.json({ success: true })
}