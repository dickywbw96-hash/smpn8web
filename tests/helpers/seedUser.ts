import { getPayload } from 'payload'
import config from '../../src/payload.config.js'
import type { User } from '../../src/payload-types.js'

// ── Test users ────────────────────────────────────────────────────────────────

export const adminUser = {
  email: 'admin@smpn8prob.sch.id',
  password: 'TestAdmin123!',
  role: 'admin' as User['role'],
  name: 'Admin Test',
}

export const editorUser = {
  email: 'editor@smpn8prob.sch.id',
  password: 'TestEditor123!',
  role: 'editor' as User['role'],
  name: 'Editor Test',
}

export const testUser = adminUser

// ── Helpers ───────────────────────────────────────────────────────────────────

async function deleteUserIfExists(
  payload: Awaited<ReturnType<typeof getPayload>>,
  email: string,
) {
  await payload.delete({
    collection: 'users',
    where: { email: { equals: email } },
  })
}

export async function seedTestUser(): Promise<void> {
  const payload = await getPayload({ config })

  await deleteUserIfExists(payload, adminUser.email)
  await deleteUserIfExists(payload, editorUser.email)

  await payload.create({
    collection: 'users',
    draft: false,
    data: { ...adminUser, collection: 'users' },
  })

  await payload.create({
    collection: 'users',
    draft: false,
    data: { ...editorUser, collection: 'users' },
  })
}

export async function cleanupTestUser(): Promise<void> {
  const payload = await getPayload({ config })

  await deleteUserIfExists(payload, adminUser.email)
  await deleteUserIfExists(payload, editorUser.email)
}