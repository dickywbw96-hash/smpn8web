import { createClient } from '@supabase/supabase-js'

// ── Supabase client — hanya untuk Storage ────────────────────────────────────
// Database & Auth tetap ditangani Payload CMS, bukan Supabase client.
// File ini hanya dipakai jika perlu akses Supabase Storage langsung
// (misal: upload file dari frontend tanpa melalui Payload Media collection).

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY wajib diisi di .env.local',
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ── Storage helpers ───────────────────────────────────────────────────────────

/**
 * Upload file ke Supabase Storage bucket
 * @returns public URL file yang diupload
 */
export async function uploadFile(
  bucket: string,
  filePath: string,
  file: File,
): Promise<string | null> {
  const { error } = await supabase.storage.from(bucket).upload(filePath, file, {
    upsert: true,
    cacheControl: '3600',
  })

  if (error) {
    console.error('[uploadFile]', error.message)
    return null
  }

  return getPublicUrl(bucket, filePath)
}

/**
 * Ambil public URL file dari Supabase Storage
 */
export function getPublicUrl(bucket: string, filePath: string): string {
  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath)
  return data.publicUrl
}

/**
 * Hapus file dari Supabase Storage
 */
export async function deleteFile(bucket: string, filePath: string): Promise<boolean> {
  const { error } = await supabase.storage.from(bucket).remove([filePath])
  if (error) {
    console.error('[deleteFile]', error.message)
    return false
  }
  return true
}