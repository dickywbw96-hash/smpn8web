/**
 * lib/payload.ts
 * Helper untuk fetch data dari Payload CMS API + caching layer
 */

import { withCache, TTL } from './cache'

const API_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

// ── Types ────────────────────────────────────────────────

export interface MediaItem {
  id: string
  url: string
  alt?: string
  width?: number
  height?: number
  filename?: string
}

export interface Post {
  id: string
  title: string
  slug: string
  excerpt: string
  content: any
  featuredImage: MediaItem
  category: 'kegiatan_umum' | 'prestasi' | 'kegiatan_organisasi'
  status: 'draft' | 'published' | 'archived'
  publishedAt: string
  gallery?: { image: MediaItem; caption?: string }[]
  tags?: { tag: string }[]
  showInSlider?: boolean
  seo?: { metaTitle?: string; metaDescription?: string }
}

export interface SliderItem {
  id: string
  title: string
  description?: string
  image: MediaItem
  isActive: boolean
  order: number
  linkTo?: { type: 'none' | 'post' | 'custom'; post?: { slug: string }; url?: string }
}

export interface Ekstrakurikuler {
  id: string
  name: string
  slug: string
  pembina: string
  description: any
  gallery?: { image: MediaItem; caption?: string }[]
  isActive: boolean
}

export interface PPIDDoc {
  id: string
  title: string
  slug: string
  category: string
  content?: any
  files?: { file: MediaItem; label?: string }[]
  publishedAt: string
}

export interface SiteSettings {
  schoolName: string
  schoolLogo?: MediaItem
  schoolNSS?: string
  schoolNPSN?: string
  address: {
    street: string
    kelurahan?: string
    kecamatan?: string
    city: string
    province: string
    postalCode?: string
    mapsUrl?: string
  }
  contact: {
    phone?: string
    whatsapp?: string
    email?: string
    website?: string
  }
  socialMedia: {
    facebook?: string
    instagram?: string
    youtube?: string
    twitter?: string
    tiktok?: string
  }
  principal: {
    name?: string
    nip?: string
    photo?: MediaItem
    message?: string
  }
  vision?: string
  mission?: { point: string }[]
  motto?: string
  tickerText?: string
  tickerEnabled?: boolean
  heroTaglines?: { text: string }[]
  seo?: {
    metaTitle?: string
    metaDescription?: string
    ogImage?: MediaItem
    googleAnalyticsId?: string
  }
}

// ── Fetch helper ─────────────────────────────────────────

async function fetchAPI<T>(endpoint: string, params?: Record<string, string>): Promise<T | null> {
  try {
    const url = new URL(`${API_URL}/api${endpoint}`)
    if (params) {
      Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
    }
    const res = await fetch(url.toString(), {
      next: { revalidate: 60 }, // Layer 1: Next.js ISR cache
    })
    if (!res.ok) return null
    return res.json() as T
  } catch {
    return null
  }
}

// ── Site Settings ─────────────────────────────────────────

export async function getSiteSettings(): Promise<SiteSettings | null> {
  return withCache(
    'site-settings',
    () => fetchAPI<SiteSettings>('/globals/site-settings'),
    TTL.SITE_SETTINGS
  )
}

// ── Slider ────────────────────────────────────────────────

export async function getSliderItems(): Promise<SliderItem[]> {
  return withCache(
    'slider-items',
    async () => {
      const data = await fetchAPI<{ docs: SliderItem[] }>('/slider-dashboard', {
        where: JSON.stringify({ isActive: { equals: true } }),
        sort: 'order',
        limit: '10',
      })
      return data?.docs ?? []
    },
    TTL.SLIDER
  )
}

// ── Posts ─────────────────────────────────────────────────

export async function getPosts(options?: {
  category?: string
  limit?: number
  page?: number
}): Promise<{ docs: Post[]; totalDocs: number; totalPages: number }> {
  const cacheKey = `posts-${options?.category ?? 'all'}-${options?.limit ?? 12}-p${options?.page ?? 1}`
  return withCache(
    cacheKey,
    async () => {
      const params: Record<string, string> = {
        where: JSON.stringify({
          and: [
            { status: { equals: 'published' } },
            ...(options?.category ? [{ category: { equals: options.category } }] : []),
          ],
        }),
        sort: '-publishedAt',
        limit: String(options?.limit ?? 12),
        page: String(options?.page ?? 1),
        depth: '1',
      }
      const data = await fetchAPI<{ docs: Post[]; totalDocs: number; totalPages: number }>('/posts', params)
      return data ?? { docs: [], totalDocs: 0, totalPages: 0 }
    },
    TTL.POSTS_LIST
  )
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  return withCache(
    `post-${slug}`,
    async () => {
      const data = await fetchAPI<{ docs: Post[] }>('/posts', {
        where: JSON.stringify({ slug: { equals: slug } }),
        depth: '2',
        limit: '1',
      })
      return data?.docs?.[0] ?? null
    },
    TTL.POST_DETAIL
  )
}

export async function getLatestPosts(limit = 4): Promise<Post[]> {
  const { docs } = await getPosts({ limit })
  return docs
}

// ── Ekstrakurikuler ───────────────────────────────────────

export async function getEkstrakurikulerList(): Promise<Ekstrakurikuler[]> {
  return withCache(
    'ekskul-list',
    async () => {
      const data = await fetchAPI<{ docs: Ekstrakurikuler[] }>('/ekstrakurikuler', {
        where: JSON.stringify({ isActive: { equals: true } }),
        sort: 'name',
        limit: '50',
      })
      return data?.docs ?? []
    },
    TTL.EKSKUL
  )
}

export async function getEkstrakurikulerBySlug(slug: string): Promise<Ekstrakurikuler | null> {
  return withCache(
    `ekskul-${slug}`,
    async () => {
      const data = await fetchAPI<{ docs: Ekstrakurikuler[] }>('/ekstrakurikuler', {
        where: JSON.stringify({ slug: { equals: slug } }),
        depth: '2',
        limit: '1',
      })
      return data?.docs?.[0] ?? null
    },
    TTL.EKSKUL
  )
}

// ── PPID ──────────────────────────────────────────────────

export async function getPPIDByCategory(category: string): Promise<PPIDDoc[]> {
  return withCache(
    `ppid-${category}`,
    async () => {
      const data = await fetchAPI<{ docs: PPIDDoc[] }>('/ppid', {
        where: JSON.stringify({ category: { equals: category } }),
        sort: '-publishedAt',
        limit: '50',
        depth: '2',
      })
      return data?.docs ?? []
    },
    TTL.PPID
  )
}

// ── Image URL helper ──────────────────────────────────────

export function getImageUrl(media?: MediaItem | null): string {
  if (!media?.url) return '/images/placeholder.jpg'
  if (media.url.startsWith('http')) return media.url
  return `${API_URL}${media.url}`
}

// ── Date formatter ────────────────────────────────────────

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

// ── Category labels ───────────────────────────────────────

export const CATEGORY_LABELS: Record<string, string> = {
  kegiatan_umum:       'Kegiatan Umum',
  prestasi:            'Prestasi',
  kegiatan_organisasi: 'Kegiatan Organisasi',
}

export const CATEGORY_COLORS: Record<string, string> = {
  kegiatan_umum:       '#1a5cc8',
  prestasi:            '#e8a31a',
  kegiatan_organisasi: '#16a34a',
}