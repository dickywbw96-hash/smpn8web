/**
 * lib/cache.ts
 * Multi-layer caching:
 *   Layer 1 — Next.js built-in fetch cache (ISR, sudah ada di payload.ts)
 *   Layer 2 — In-memory cache (per server instance, gratis & cepat)
 *   Layer 3 — Supabase cache table (shared antar instance, untuk data berat)
 */

// ── Layer 2: In-Memory Cache ──────────────────────────────────
// Simpan di RAM server, reset saat deploy. Cocok untuk data yang sering dibaca.

interface CacheEntry<T> {
  value: T
  expiresAt: number
}

const memoryCache = new Map<string, CacheEntry<unknown>>()

export function memGet<T>(key: string): T | null {
  const entry = memoryCache.get(key) as CacheEntry<T> | undefined
  if (!entry) return null
  if (Date.now() > entry.expiresAt) {
    memoryCache.delete(key)
    return null
  }
  return entry.value
}

export function memSet<T>(key: string, value: T, ttlSeconds = 60): void {
  memoryCache.set(key, {
    value,
    expiresAt: Date.now() + ttlSeconds * 1000,
  })
}

export function memDel(key: string): void {
  memoryCache.delete(key)
}

export function memClear(prefix?: string): void {
  if (!prefix) {
    memoryCache.clear()
    return
  }
  for (const key of memoryCache.keys()) {
    if (key.startsWith(prefix)) memoryCache.delete(key)
  }
}

// ── Cache wrapper — gunakan ini di komponen ───────────────────
/**
 * Bungkus fungsi fetch apapun dengan cache otomatis.
 *
 * Contoh penggunaan:
 *   const settings = await withCache('site-settings', getSiteSettings, 300)
 *   const slider   = await withCache('slider', getSliderItems, 60)
 */
export async function withCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlSeconds = 60
): Promise<T> {
  // Cek memory cache dulu
  const cached = memGet<T>(key)
  if (cached !== null) return cached

  // Fetch dari sumber
  const value = await fetcher()

  // Simpan ke memory cache
  if (value !== null && value !== undefined) {
    memSet(key, value, ttlSeconds)
  }

  return value
}

// ── TTL constants (detik) ─────────────────────────────────────
export const TTL = {
  SITE_SETTINGS: 300,   //  5 menit — jarang berubah
  SLIDER:         60,   //  1 menit — bisa update kapan saja
  POSTS_LIST:     60,   //  1 menit
  POST_DETAIL:   120,   //  2 menit
  EKSKUL:        300,   //  5 menit
  PPID:          300,   //  5 menit
  PROFIL:        600,   // 10 menit — sangat jarang berubah
} as const
