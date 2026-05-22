import type { Media } from '@/payload-types'

// ── Date Formatting ───────────────────────────────────────────────────────────

export function formatDate(dateString: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    ...options,
  })
}

export function formatDateShort(dateString: string | Date): string {
  return formatDate(dateString, { day: 'numeric', month: 'short', year: 'numeric' })
}

export function timeAgo(dateString: string | Date): string {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)
  const diffWeek = Math.floor(diffDay / 7)
  const diffMonth = Math.floor(diffDay / 30)

  if (diffSec < 60) return 'Baru saja'
  if (diffMin < 60) return `${diffMin} menit yang lalu`
  if (diffHour < 24) return `${diffHour} jam yang lalu`
  if (diffDay < 7) return `${diffDay} hari yang lalu`
  if (diffWeek < 4) return `${diffWeek} minggu yang lalu`
  if (diffMonth < 12) return `${diffMonth} bulan yang lalu`
  return formatDateShort(date)
}

// ── Slug ─────────────────────────────────────────────────────────────────────

export function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[àáâãäå]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

// ── Text ─────────────────────────────────────────────────────────────────────

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trimEnd() + '...'
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
}

export function getExcerpt(content: unknown, maxLength = 160): string {
  if (!content) return ''
  if (typeof content === 'string') return truncate(stripHtml(content), maxLength)

  try {
    const extractText = (node: Record<string, unknown>): string => {
      if (typeof node.text === 'string') return node.text
      if (Array.isArray(node.children)) return node.children.map(extractText).join(' ')
      return ''
    }
    const root = (content as Record<string, unknown>).root as Record<string, unknown> | undefined
    const children = root?.children
    if (!Array.isArray(children)) return ''
    const raw = children.map(extractText).join(' ')
    return truncate(raw.replace(/\s+/g, ' ').trim(), maxLength)
  } catch {
    return ''
  }
}

// ── Media / Image ─────────────────────────────────────────────────────────────

/**
 * Ambil URL gambar dari field Media Payload.
 * Menggunakan type assertion karena Payload generate `sizes` secara dinamis
 * berdasarkan imageSizes config — tidak selalu ada di generated types.
 */
export function getImageUrl(
  media: Media | string | null | undefined,
  fallback = '/images/placeholder.jpg',
): string {
  if (!media) return fallback
  if (typeof media === 'string') return media

  // Payload meng-generate sizes secara dinamis, cast ke any untuk akses
  const sizes = (media as Media & { sizes?: Record<string, { url?: string }> }).sizes
  if (sizes?.webp?.url) return sizes.webp.url
  if (sizes?.thumbnail?.url) return sizes.thumbnail.url
  if (media.url) return media.url

  return fallback
}

export function getImageAlt(media: Media | string | null | undefined, fallback = ''): string {
  if (!media || typeof media === 'string') return fallback
  return (media as Media & { alt?: string }).alt || fallback
}

// ── Category ──────────────────────────────────────────────────────────────────

const CATEGORY_LABELS: Record<string, string> = {
  kegiatan_umum: 'Kegiatan Umum',
  prestasi: 'Prestasi',
  kegiatan_organisasi: 'Kegiatan Organisasi',
}

const CATEGORY_COLORS: Record<string, string> = {
  kegiatan_umum: '#1e4080',
  prestasi: '#f0b429',
  kegiatan_organisasi: '#2a9d8f',
}

export function getCategoryLabel(slug: string): string {
  return CATEGORY_LABELS[slug] ?? slug
}

export function getCategoryColor(slug: string): string {
  return CATEGORY_COLORS[slug] ?? '#1e4080'
}

// ── URL ───────────────────────────────────────────────────────────────────────

export function getServerUrl(): string {
  if (typeof window !== 'undefined') return window.location.origin
  return process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
}

export function absoluteUrl(path: string): string {
  return `${getServerUrl()}${path.startsWith('/') ? path : `/${path}`}`
}

export function supabaseStorageUrl(bucket: string, filePath: string): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!supabaseUrl) return ''
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${filePath}`
}

// ── Number ────────────────────────────────────────────────────────────────────

export function formatNumber(num: number): string {
  return num.toLocaleString('id-ID')
}

// ── Class Names ───────────────────────────────────────────────────────────────

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

// ── File Size ─────────────────────────────────────────────────────────────────

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`
}