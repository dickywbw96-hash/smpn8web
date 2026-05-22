import { test, expect, Page, BrowserContext } from '@playwright/test'

const BASE = 'http://localhost:3000'

test.describe('Frontend — Halaman Publik', () => {
  let page: Page
  let context: BrowserContext

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext()
    page = await context.newPage()
  })

  test.afterAll(async () => {
    await context.close()
  })

  // ── Homepage ─────────────────────────────────────────────────────────────────

  test('homepage dapat diakses', async () => {
    await page.goto(BASE)
    await expect(page).toHaveURL(BASE + '/')
    await expect(page).toHaveTitle(/SMP Negeri 8 Probolinggo/i)
  })

  test('ticker berjalan tampil di homepage', async () => {
    await page.goto(BASE)
    const ticker = page.locator('.ticker-content').or(
      page.locator('[class*="ticker"]')
    ).first()
    await expect(ticker).toBeVisible()
  })

  test('navbar tampil dengan menu utama', async () => {
    await page.goto(BASE)
    await expect(page.locator('nav')).toBeVisible()
    await expect(page.getByRole('link', { name: /Home/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /Profil/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /Berita/i })).toBeVisible()
  })

  test('hero slider tampil di homepage', async () => {
    await page.goto(BASE)
    const slider = page.locator('[class*="slider"]').or(
      page.locator('[class*="hero"]')
    ).first()
    await expect(slider).toBeVisible()
  })

  test('section visi misi tampil', async () => {
    await page.goto(BASE)
    const visiMisi = page.getByText(/visi/i).first()
    await expect(visiMisi).toBeVisible()
  })

  test('footer tampil', async () => {
    await page.goto(BASE)
    await expect(page.locator('footer')).toBeVisible()
  })

  // ── Navigasi Menu ─────────────────────────────────────────────────────────────

  test('halaman profil dapat diakses', async () => {
    await page.goto(`${BASE}/profil`)
    await expect(page).toHaveURL(`${BASE}/profil`)
    await expect(page.locator('h1').first()).toBeVisible()
  })

  test('halaman berita dapat diakses', async () => {
    await page.goto(`${BASE}/berita`)
    await expect(page).toHaveURL(`${BASE}/berita`)
  })

  test('halaman berita kegiatan umum dapat diakses', async () => {
    await page.goto(`${BASE}/berita/kegiatan-umum`)
    await expect(page).toHaveURL(`${BASE}/berita/kegiatan-umum`)
  })

  test('halaman berita prestasi dapat diakses', async () => {
    await page.goto(`${BASE}/berita/prestasi`)
    await expect(page).toHaveURL(`${BASE}/berita/prestasi`)
  })

  test('halaman kesiswaan dapat diakses', async () => {
    await page.goto(`${BASE}/kesiswaan`)
    await expect(page).toHaveURL(`${BASE}/kesiswaan`)
  })

  test('halaman ekstrakurikuler dapat diakses', async () => {
    await page.goto(`${BASE}/kesiswaan/ekstrakurikuler`)
    await expect(page).toHaveURL(`${BASE}/kesiswaan/ekstrakurikuler`)
  })

  test('halaman kontak dapat diakses', async () => {
    await page.goto(`${BASE}/kontak`)
    await expect(page).toHaveURL(`${BASE}/kontak`)
  })

  test('halaman PPID dapat diakses', async () => {
    await page.goto(`${BASE}/ppid`)
    await expect(page).toHaveURL(`${BASE}/ppid`)
  })

  test('halaman SPMB dapat diakses', async () => {
    await page.goto(`${BASE}/spmb`)
    await expect(page).toHaveURL(`${BASE}/spmb`)
  })

  // ── Login redirect ────────────────────────────────────────────────────────────

  test('halaman login admin dapat diakses di /admin', async () => {
    await page.goto(`${BASE}/admin`)
    // Redirect ke login jika belum login
    await expect(page).toHaveURL(/\/admin(\/login)?/)
  })
})