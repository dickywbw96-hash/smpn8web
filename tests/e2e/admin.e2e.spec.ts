import { test, expect, Page, BrowserContext } from '@playwright/test'
import { login } from '../helpers/login'
import { seedTestUser, cleanupTestUser, adminUser, editorUser } from '../helpers/seedUser'

const BASE = 'http://localhost:3000'

test.describe('Admin Panel — Role: Admin', () => {
  let page: Page
  let context: BrowserContext

  test.beforeAll(async ({ browser }) => {
    await seedTestUser()
    context = await browser.newContext()
    page = await context.newPage()
    await login({ page, user: adminUser })
  })

  test.afterAll(async () => {
    await cleanupTestUser()
    await context.close()
  })

  // ── Dashboard ───────────────────────────────────────────────────────────────

  test('dapat masuk ke dashboard admin', async () => {
    await page.goto(`${BASE}/admin`)
    await expect(page).toHaveURL(`${BASE}/admin`)
    await expect(page.locator('span[title="Dashboard"]').first()).toBeVisible()
  })

  // ── Collections ─────────────────────────────────────────────────────────────

  test('dapat melihat daftar berita (posts)', async () => {
    await page.goto(`${BASE}/admin/collections/posts`)
    await expect(page).toHaveURL(`${BASE}/admin/collections/posts`)
    await expect(page.locator('h1').first()).toBeVisible()
  })

  test('dapat membuka form tambah berita', async () => {
    await page.goto(`${BASE}/admin/collections/posts/create`)
    await expect(page.locator('input[id="field-title"]').or(
      page.locator('input[name="title"]')
    )).toBeVisible()
  })

  test('dapat melihat daftar slider dashboard', async () => {
    await page.goto(`${BASE}/admin/collections/slider-dashboard`)
    await expect(page).toHaveURL(`${BASE}/admin/collections/slider-dashboard`)
  })

  test('dapat melihat daftar ekstrakurikuler', async () => {
    await page.goto(`${BASE}/admin/collections/ekstrakurikuler`)
    await expect(page).toHaveURL(`${BASE}/admin/collections/ekstrakurikuler`)
  })

  test('dapat melihat daftar PPID', async () => {
    await page.goto(`${BASE}/admin/collections/ppid`)
    await expect(page).toHaveURL(`${BASE}/admin/collections/ppid`)
  })

  test('dapat melihat permintaan hapus (delete-requests)', async () => {
    await page.goto(`${BASE}/admin/collections/delete-requests`)
    await expect(page).toHaveURL(`${BASE}/admin/collections/delete-requests`)
  })

  // ── Globals ─────────────────────────────────────────────────────────────────

  test('dapat mengakses Site Settings', async () => {
    await page.goto(`${BASE}/admin/globals/site-settings`)
    await expect(page).toHaveURL(`${BASE}/admin/globals/site-settings`)
  })

  // ── Users ───────────────────────────────────────────────────────────────────

  test('dapat melihat daftar users', async () => {
    await page.goto(`${BASE}/admin/collections/users`)
    await expect(page).toHaveURL(`${BASE}/admin/collections/users`)
    await expect(page.locator('h1').first()).toBeVisible()
  })
})

test.describe('Admin Panel — Role: Editor', () => {
  let page: Page
  let context: BrowserContext

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext()
    page = await context.newPage()
    await login({ page, user: editorUser })
  })

  test.afterAll(async () => {
    await context.close()
  })

  test('editor dapat masuk ke dashboard admin', async () => {
    await page.goto(`${BASE}/admin`)
    await expect(page).toHaveURL(`${BASE}/admin`)
    await expect(page.locator('span[title="Dashboard"]').first()).toBeVisible()
  })

  test('editor dapat melihat daftar berita', async () => {
    await page.goto(`${BASE}/admin/collections/posts`)
    await expect(page).toHaveURL(`${BASE}/admin/collections/posts`)
  })

  test('editor tidak dapat melihat delete-requests', async () => {
    await page.goto(`${BASE}/admin/collections/delete-requests`)
    // Editor seharusnya redirect atau dapat unauthorized
    await expect(page).not.toHaveURL(`${BASE}/admin/collections/delete-requests`)
  })

  test('editor dapat membuat berita baru', async () => {
    await page.goto(`${BASE}/admin/collections/posts/create`)
    await expect(page.locator('input[id="field-title"]').or(
      page.locator('input[name="title"]')
    )).toBeVisible()
  })
})