'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const [role, setRole] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      router.push('/login')
      return
    }

    const { data: userData } = await supabase
      .from('users')
      .select('name, role, is_active')
      .eq('id', session.user.id)
      .single()

    if (!userData || !userData.is_active) {
      await supabase.auth.signOut()
      router.push('/login')
      return
    }

    setUser({ ...session.user, name: userData.name })
    setRole(userData.role)
    setLoading(false)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (pathname === '/login') return <>{children}</>
  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb' }}>
      <div style={{ color: '#6b7280' }}>Memuat...</div>
    </div>
  )

  const menuItems = [
    { href: '/admin/dashboard', label: '🏠 Dashboard', roles: ['admin', 'editor'] },
    { href: '/admin/posts', label: '📰 Berita', roles: ['admin', 'editor'] },
    { href: '/admin/slider', label: '🖼️ Slider', roles: ['admin', 'editor'] },
    { href: '/admin/ekstrakurikuler', label: '⚽ Ekstrakurikuler', roles: ['admin', 'editor'] },
    { href: '/admin/ppid', label: '📋 PPID', roles: ['admin', 'editor'] },
    { href: '/admin/site-settings', label: '⚙️ Pengaturan', roles: ['admin'] },
    { href: '/admin/users', label: '👥 Kelola User', roles: ['admin'] },
    { href: '/admin/delete-requests', label: '🗑️ Permintaan Hapus', roles: ['admin'] },
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f9fafb' }}>
      {/* Sidebar */}
      <aside style={{
        width: '240px',
        background: '#030f2b',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
      }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontSize: '1rem', fontWeight: 800 }}>🏫 SMPN 8 Prob</div>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.25rem' }}>Admin Panel</div>
        </div>

        <nav style={{ flex: 1, padding: '1rem 0' }}>
          {menuItems.filter(m => m.roles.includes(role)).map(item => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'block',
                padding: '0.75rem 1.5rem',
                color: pathname.startsWith(item.href) ? 'white' : 'rgba(255,255,255,0.6)',
                background: pathname.startsWith(item.href) ? 'rgba(255,255,255,0.1)' : 'transparent',
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: pathname.startsWith(item.href) ? 700 : 400,
                borderLeft: pathname.startsWith(item.href) ? '3px solid #60a5fa' : '3px solid transparent',
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.5rem' }}>
            {user?.name} ({role})
          </div>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '0.5rem',
              background: 'rgba(255,255,255,0.1)',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.8rem',
            }}
          >
            Keluar
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, overflow: 'auto' }}>
        {children}
      </main>
    </div>
  )
}