import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''

// Client untuk frontend (public)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Client untuk server/admin (full access)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey)

// ── Storage helpers ───────────────────────────────────────────────────────────

export async function uploadFile(bucket: string, filePath: string, file: File): Promise<string | null> {
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

export function getPublicUrl(bucket: string, filePath: string): string {
  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath)
  return data.publicUrl
}

export async function deleteFile(bucket: string, filePath: string): Promise<boolean> {
  const { error } = await supabase.storage.from(bucket).remove([filePath])
  if (error) {
    console.error('[deleteFile]', error.message)
    return false
  }
  return true
}