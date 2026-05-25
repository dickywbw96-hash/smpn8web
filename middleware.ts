import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

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

  let response = NextResponse.next({
    request: { headers: request.headers },
  })

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

  // Pakai getUser() bukan getSession() — lebih reliable untuk SSR
  const { data: { user } } = await supabase.auth.getUser()

  // Belum login → redirect ke /login
  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Cek apakah route ini admin-only
  const isAdminOnly = ADMIN_ONLY.some((route) => pathname.startsWith(route))

  if (isAdminOnly) {
    const { data: userData } = await supabase
      .from('users')
      .select('role, is_active')
      .eq('id', user.id)
      .single()

    if (!userData || !userData.is_active) {
      await supabase.auth.signOut()
      return NextResponse.redirect(new URL('/login', request.url))
    }

    if (userData.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/posts/:path*',
    '/slider/:path*',
    '/ekstrakurikuler/:path*',
    '/guru/:path*',
    '/ppid/:path*',
    '/site-settings/:path*',
    '/users/:path*',
    '/delete-requests/:path*',
  ],
}