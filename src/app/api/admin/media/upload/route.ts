/**
 * app/api/admin/media/upload/route.ts
 * POST /api/admin/media/upload
 */

import { NextResponse } from 'next/server'
import { supabaseAdmin, getPublicUrl } from '@/lib/supabase'

const BUCKET = 'media'
const MAX_SIZE = 5 * 1024 * 1024 // 5 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get('file') as File | null

  if (!file) {
    return NextResponse.json({ message: 'File tidak ditemukan' }, { status: 400 })
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { message: 'Format tidak didukung. Gunakan JPG, PNG, WebP, atau GIF.' },
      { status: 400 },
    )
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ message: 'Ukuran file maksimal 5 MB' }, { status: 400 })
  }

  // Path unik: 2025-06/abc12345.jpg
  const ext = file.name.split('.').pop()
  const yearMonth = new Date().toISOString().slice(0, 7)
  const unique = crypto.randomUUID().slice(0, 8)
  const storagePath = `${yearMonth}/${unique}.${ext}`

  // Upload ke Supabase Storage
  const bytes = await file.arrayBuffer()
  const { error: uploadError } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(storagePath, bytes, { contentType: file.type, upsert: false })

  if (uploadError) {
    console.error('[media/upload] storage error:', uploadError.message)
    return NextResponse.json({ message: 'Gagal mengunggah file' }, { status: 500 })
  }

  const publicUrl = getPublicUrl(BUCKET, storagePath)

  // Simpan metadata ke tabel media
  const { data, error: dbError } = await supabaseAdmin
    .from('media')
    .insert({
      filename: file.name,
      url: publicUrl,
      mime_type: file.type,
      size: file.size,
    })
    .select()
    .single()

  if (dbError) {
    console.error('[media/upload] db error:', dbError.message)
    // File sudah terupload — kembalikan URL supaya tidak hilang
    return NextResponse.json(
      { message: 'File terupload tapi metadata gagal disimpan', url: publicUrl },
      { status: 207 },
    )
  }

  return NextResponse.json(data, { status: 201 })
}