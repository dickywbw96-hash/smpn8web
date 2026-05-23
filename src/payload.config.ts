import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

// ── Collections ──────────────────────────────────────
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Posts } from './collections/Posts'
import { SliderDashboard } from './collections/SliderDashboard'
import { Ekstrakurikuler } from './collections/Ekstrakurikuler'
import { PPID } from './collections/PPID'
import DeleteRequests from './collections/DeleteRequests'

// ── Globals ──────────────────────────────────────────
import { SiteSettings } from './collections/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  // ── Admin Panel Config ────────────────────────────
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: '— SMPN 8 Probolinggo',
      icons: [
        {
          rel: 'icon',
          type: 'image/x-icon',
          url: '/favicon.ico',
        },
      ],
    },
    components: {
      afterNavLinks: [
        '@/app/(payload)/components/AdminNotificationBell#default',
      ],
    },
  },

  // ── Editor ─────────────────────────────────────────
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
    ],
  }),

    // ── GraphQL ────────────────────────────────────────
  graphQL: {
    disable: true,
  },

  // ── Secret ─────────────────────────────────────────
  secret: process.env.PAYLOAD_SECRET || 'payload-secret-GANTI-DI-PRODUCTION',

  // ── TypeScript ─────────────────────────────────────
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  // ── Database — Supabase PostgreSQL ─────────────────
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
    },
  }),

  // ── Collections ────────────────────────────────────
  collections: [
    Users,
    Media,
    Posts,
    SliderDashboard,
    Ekstrakurikuler,
    PPID,
    DeleteRequests,
  ],

  // ── Globals ────────────────────────────────────────
  globals: [
    SiteSettings,
  ],

  // ── Sharp (image optimization) ─────────────────────
  sharp,

  // ── Upload / Storage ───────────────────────────────
  // plugins: [
  //   uploadthingStorage({
  //     collections: {
  //       media: true,
  //     },
  //   }),
  // ],

  // ── CORS ───────────────────────────────────────────
  cors: [
    process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
    'https://smpn8prob.sch.id',
  ],

  // ── CSRF ───────────────────────────────────────────
  csrf: [
    process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
    'https://smpn8prob.sch.id',
  ],
})