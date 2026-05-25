import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Route yang hanya boleh diakses admin
const ADMIN_ONLY = [
  '/ekstrakurikuler',
  '/guru',
  '/ppid',
  '/site-settings',
  '/users',
  '/delete-requests',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Buat response dulu (diperlukan Supabase SSR untuk refresh cookie)
  const response = NextResponse.next({
    request: { headers: request.headers },
  })

  // Init Supabase client pakai cookie
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // Ambil session
  const { data: { session } } = await supabase.auth.getSession()

  // Belum login → redirect ke /login
  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Cek apakah route ini admin-only
  const isAdminOnly = ADMIN_ONLY.some((route) => pathname.startsWith(route))

  if (isAdminOnly) {
    // Ambil role dari tabel users
    const { data: userData } = await supabase
      .from('users')
      .select('role, is_active')
      .eq('id', session.user.id)
      .single()

    // User tidak ditemukan / nonaktif → logout
    if (!userData || !userData.is_active) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Bukan admin → redirect ke dashboard
    if (userData.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match semua path di bawah ini kecuali:
     * - /login
     * - /_next (static files)
     * - /api (API routes punya proteksi sendiri)
     * - file statis (.ico, .png, dll)
     */
    '/((?!login|_next/static|_next/image|favicon.ico|images|api).*)',
  ],
}