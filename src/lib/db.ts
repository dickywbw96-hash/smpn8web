/**
 * lib/db.ts
 * Helper untuk fetch data dari Supabase database
 */

import { supabase, supabaseAdmin } from './supabase'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface MediaItem {
  id: string
  url: string
  filename: string
  alt?: string
  caption?: string
  mime_type?: string
  width?: number
  height?: number
}

export interface Post {
  id: string
  title: string
  slug: string
  excerpt?: string
  content?: any
  content_html?: string
  featured_image_url?: string
  category: 'kegiatan_umum' | 'prestasi' | 'kegiatan_organisasi' | 'artikel'
  status: 'draft' | 'published' | 'archived'
  published_at?: string
  author_id?: string
  show_in_slider?: boolean
  seo_meta_title?: string
  seo_meta_description?: string
  created_at: string
  updated_at: string
  gallery?: { id: string; image_url: string; caption?: string; order_index: number }[]
  tags?: { id: string; tag: string }[]
}

export interface SliderItem {
  id: string
  title: string
  description?: string
  image_url: string
  link_type: 'none' | 'post' | 'custom'
  link_post_id?: string
  link_url?: string
  order_index: number
  is_active: boolean
}

export interface Ekstrakurikuler {
  id: string
  name: string
  slug: string
  category?: string
  cover_image_url?: string
  pembina: string
  pembina_nip?: string
  schedule_hari?: string[]
  schedule_waktu?: string
  schedule_tempat?: string
  description?: string
  description_html?: string
  is_active: boolean
  order_index: number
  gallery?: { id: string; image_url: string; caption?: string }[]
  achievements?: { id: string; title: string; year?: string; level?: string }[]
}

export interface PPIDDoc {
  id: string
  title: string
  category: string
  document_number?: string
  document_date?: string
  version?: string
  content?: string
  content_html?: string
  is_published: boolean
  order_index: number
  attachments?: { id: string; file_url: string; file_label?: string; file_description?: string }[]
  images?: { id: string; image_url: string; caption?: string }[]
}

export interface SiteSettings {
  school_name: string
  school_nss?: string
  school_npsn?: string
  school_logo_url?: string
  address_street?: string
  address_kelurahan?: string
  address_kecamatan?: string
  address_city?: string
  address_province?: string
  address_postal_code?: string
  address_maps_url?: string
  contact_phone?: string
  contact_whatsapp?: string
  contact_email?: string
  contact_website?: string
  social_facebook?: string
  social_instagram?: string
  social_youtube?: string
  social_twitter?: string
  social_tiktok?: string
  principal_name?: string
  principal_nip?: string
  principal_photo_url?: string
  principal_message?: string
  vision?: string
  motto?: string
  ticker_text?: string
  ticker_enabled?: boolean
  seo_meta_title?: string
  seo_meta_description?: string
  seo_og_image_url?: string
  google_analytics_id?: string
  mission?: { id: string; point: string; order_index: number }[]
  taglines?: { id: string; text: string; order_index: number }[]
}

export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'editor'
  is_active: boolean
  created_at: string
}

// ── NEW: Guru ─────────────────────────────────────────────────────────────────

export interface Guru {
  id: string
  name: string
  nip?: string
  position?: string
  subject?: string
  photo_url?: string
  type?: 'guru' | 'tas'
  is_active: boolean
  order_index: number
  created_at: string
  updated_at: string
}

// ── Site Settings ─────────────────────────────────────────────────────────────

export async function getSiteSettings(): Promise<any | null> {
  const { data, error } = await supabase.from('site_settings').select('*').single()
  if (error || !data) return null

  const { data: mission } = await supabase
    .from('site_settings_mission')
    .select('*')
    .order('order_index')

  const { data: taglines } = await supabase
    .from('site_settings_taglines')
    .select('*')
    .order('order_index')

  return {
    ...data,
    schoolName: data.school_name,
    schoolLogo: data.school_logo_url,
    tickerText: data.ticker_text,
    tickerEnabled: data.ticker_enabled,
    activeTheme: data.active_theme,
    heroTaglines: taglines ?? [],
    seo: {
      metaTitle: data.seo_meta_title,
      metaDescription: data.seo_meta_description,
      ogImage: data.seo_og_image_url,
    },
    mission: mission ?? [],
    taglines: taglines ?? [],
  }
}

// ── Slider ────────────────────────────────────────────────────────────────────

export async function getSliderItems(): Promise<SliderItem[]> {
  const { data, error } = await supabase
    .from('slider_dashboard')
    .select('*')
    .eq('is_active', true)
    .order('order_index')
  if (error) return []
  return data ?? []
}

// ── Posts ─────────────────────────────────────────────────────────────────────

export async function getPosts(options?: {
  category?: string
  limit?: number
  page?: number
}): Promise<{ docs: Post[]; totalDocs: number; totalPages: number }> {
  const limit = options?.limit ?? 12
  const page = options?.page ?? 1
  const offset = (page - 1) * limit

  let query = supabase
    .from('posts')
    .select('*, posts_gallery(*), posts_tags(*)', { count: 'exact' })
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (options?.category) {
    query = query.eq('category', options.category)
  }

  const { data, error, count } = await query
  if (error) return { docs: [], totalDocs: 0, totalPages: 0 }

  const totalDocs = count ?? 0
  return {
    docs: data ?? [],
    totalDocs,
    totalPages: Math.ceil(totalDocs / limit),
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const { data, error } = await supabase
    .from('posts')
    .select('*, posts_gallery(*), posts_tags(*)')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()
  if (error) return null
  return data
}

export async function getLatestPosts(limit = 4): Promise<Post[]> {
  const { docs } = await getPosts({ limit })
  return docs
}

export async function getRandomPosts(limit = 4, excludeSlug?: string): Promise<Post[]> {
  // Ambil lebih banyak lalu shuffle di sisi client — Supabase belum support ORDER BY RANDOM() langsung
  let query = supabase
    .from('posts')
    .select('id, title, slug, excerpt, featured_image_url, category, published_at')
    .eq('status', 'published')
    .limit(40)

  if (excludeSlug) {
    query = query.neq('slug', excludeSlug)
  }

  const { data, error } = await query
  if (error || !data) return []

  // Shuffle
  const shuffled = [...data].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, limit) as Post[]
}

// ── Ekstrakurikuler ───────────────────────────────────────────────────────────

export async function getEkstrakurikulerList(): Promise<Ekstrakurikuler[]> {
  const { data, error } = await supabase
    .from('ekstrakurikuler')
    .select('*')
    .eq('is_active', true)
    .order('order_index')
  if (error) return []
  return data ?? []
}

export async function getEkstrakurikulerBySlug(slug: string): Promise<Ekstrakurikuler | null> {
  const { data, error } = await supabase
    .from('ekstrakurikuler')
    .select('*, ekstrakurikuler_gallery(*), ekstrakurikuler_achievements(*)')
    .eq('slug', slug)
    .single()
  if (error) return null
  return data
}

// ── PPID ──────────────────────────────────────────────────────────────────────

export async function getPPIDByCategory(category: string): Promise<PPIDDoc[]> {
  const { data, error } = await supabase
    .from('ppid')
    .select('*, ppid_attachments(*), ppid_images(*)')
    .eq('category', category)
    .eq('is_published', true)
    .order('order_index')
  if (error) return []
  return data ?? []
}

// ── Guru ──────────────────────────────────────────────────────────────────────

export async function getGuruList(): Promise<Guru[]> {
  const { data, error } = await supabase
    .from('guru')
    .select('*')
    .eq('is_active', true)
    .order('order_index')
  if (error) return []
  return data ?? []
}

export async function getGuruById(id: string): Promise<Guru | null> {
  const { data, error } = await supabaseAdmin
    .from('guru')
    .select('*')
    .eq('id', id)
    .single()
  if (error) return null
  return data
}

// Admin: semua guru termasuk non-aktif
export async function getAllGuruAdmin(): Promise<Guru[]> {
  const { data, error } = await supabaseAdmin
    .from('guru')
    .select('*')
    .order('order_index')
  if (error) return []
  return data ?? []
}

export async function upsertGuru(guru: Partial<Guru> & { name: string }): Promise<Guru | null> {
  const payload = { ...guru, updated_at: new Date().toISOString() }
  const { data, error } = await supabaseAdmin
    .from('guru')
    .upsert(payload)
    .select()
    .single()
  if (error) return null
  return data
}

export async function deleteGuru(id: string): Promise<boolean> {
  const { error } = await supabaseAdmin.from('guru').delete().eq('id', id)
  return !error
}

// ── Helpers ───────────────────────────────────────────────────────────────────

export function getImageUrl(url?: string | null): string {
  if (!url) return '/images/placeholder.jpg'
  return url
}

export function formatDate(dateStr?: string): string {
  if (!dateStr) return ''
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric',
  }).format(new Date(dateStr))
}

export function formatDateShort(dateStr?: string): string {
  if (!dateStr) return ''
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric',
  }).format(new Date(dateStr))
}

export const CATEGORY_LABELS: Record<string, string> = {
  kegiatan_umum: 'Kegiatan Umum',
  prestasi: 'Prestasi',
  kegiatan_organisasi: 'Kegiatan Organisasi',
  artikel: 'Artikel', // ← tambah
}

export const CATEGORY_COLORS: Record<string, string> = {
  kegiatan_umum: '#1a5cc8',
  prestasi: '#e8a31a',
  kegiatan_organisasi: '#16a34a',
  artikel: '#7c3aed', // ← tambah
}

// ── Visitor Counter ───────────────────────────────────────────────────────────

export async function logVisitor(ip: string, page = '/'): Promise<void> {
  await supabase.from('visitor_logs').insert({ ip_address: ip, page })
}

export async function getTodayVisitorCount(): Promise<number> {
  const today = new Date().toISOString().split('T')[0]
  const { count } = await supabase
    .from('visitor_logs')
    .select('*', { count: 'exact', head: true })
    .gte('visited_at', `${today}T00:00:00`)
    .lte('visited_at', `${today}T23:59:59`)
  return count ?? 0
}

export async function getTodayUniqueVisitorCount(): Promise<number> {
  const today = new Date().toISOString().split('T')[0]
  const { data } = await supabase
    .from('visitor_logs')
    .select('ip_address')
    .gte('visited_at', `${today}T00:00:00`)
    .lte('visited_at', `${today}T23:59:59`)
  if (!data) return 0
  return new Set(data.map(r => r.ip_address)).size
}