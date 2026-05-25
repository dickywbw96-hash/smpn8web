'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getSupabaseBrowser } from '@/lib/supabase-browser'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = getSupabaseBrowser()
  const [user, setUser] = useState<any>(null)
  const [role, setRole] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => { checkAuth() }, [])
  useEffect(() => { setSidebarOpen(false) }, [pathname])

  async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { router.push('/login'); return }

    const res = await fetch('/api/get-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: session.user.id }),
    })
    const userData = res.ok ? await res.json() : null

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
    { href: '/dashboard',       label: '🏠 Dashboard',         roles: ['admin', 'editor'] },
    { href: '/posts',           label: '📰 Berita',            roles: ['admin', 'editor'] },
    { href: '/slider',          label: '🖼️ Slider',           roles: ['admin', 'editor'] },
    { href: '/ekstrakurikuler', label: '⚽ Ekstrakurikuler',   roles: ['admin'] },
    { href: '/guru',            label: '👨‍🏫 Guru & TAS',      roles: ['admin'] },
    { href: '/ppid',            label: '📋 PPID',              roles: ['admin'] },
    { href: '/site-settings',   label: '⚙️ Pengaturan',       roles: ['admin'] },
    { href: '/users',           label: '👥 Kelola User',       roles: ['admin'] },
    { href: '/delete-requests', label: '🗑️ Permintaan Hapus', roles: ['admin'] },
  ]

  const panelLabel = role === 'admin' ? 'Admin Panel' : 'Editor Panel'

  // Sidebar dijadikan function biasa (bukan komponen nested)
  // supaya tidak di-mount ulang dan menyebabkan dobel render
  function renderSidebar() {
    return (
      <aside style={{
        width: '240px',
        background: 'linear-gradient(180deg, #030f2b 0%, #071e4a 100%)',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        height: '100vh',
        position: 'sticky',
        top: 0,
      }}>
        {/* Logo */}
        <div style={{
          padding: '1.5rem 1.25rem',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.875rem',
        }}>
          <div style={{
            width: '44px', height: '44px',
            borderRadius: '12px',
            background: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          }}>
            <Image src="/icon.png" alt="Logo SMPN 8" width={40} height={40} style={{ objectFit: 'contain' }} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'white', lineHeight: 1.2 }}>
              SMP Negeri 8
            </div>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.15rem' }}>
              Kota Probolinggo
            </div>
            <div style={{
              fontSize: '0.6rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase' as const,
              marginTop: '0.25rem',
              color: role === 'admin' ? '#60a5fa' : '#34d399',
              background: role === 'admin' ? 'rgba(96,165,250,0.12)' : 'rgba(52,211,153,0.12)',
              borderRadius: '4px',
              padding: '0.1rem 0.4rem',
              display: 'inline-block',
            }}>
              {panelLabel}
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '0.75rem 0', overflowY: 'auto' }}>
          {menuItems.filter(m => m.roles.includes(role)).map(item => {
            // Aktif: exact match untuk /dashboard, startsWith untuk lainnya
            const active = item.href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(item.href)
            return (
              <Link key={item.href} href={item.href} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.7rem 1.25rem',
                color: active ? 'white' : 'rgba(255,255,255,0.55)',
                background: active ? 'rgba(255,255,255,0.1)' : 'transparent',
                textDecoration: 'none',
                fontSize: '0.845rem',
                fontWeight: active ? 700 : 400,
                borderLeft: active ? '3px solid #60a5fa' : '3px solid transparent',
                transition: 'all 0.15s ease',
              }}>
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* User + logout */}
        <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.85rem', fontWeight: 700, color: 'white', flexShrink: 0,
            }}>
              {user?.name?.[0]?.toUpperCase() ?? '?'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.name}
              </div>
              <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.45)' }}>{role}</div>
            </div>
          </div>
          <button onClick={handleLogout} style={{
            width: '100%',
            padding: '0.5rem',
            background: 'rgba(255,255,255,0.08)',
            color: 'rgba(255,255,255,0.7)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '0.78rem',
            fontWeight: 600,
            transition: 'all 0.15s',
          }}>
            🚪 Keluar
          </button>
        </div>
      </aside>
    )
  }

  return (
    <>
      <style>{`
        .admin-wrapper { display: flex; min-height: 100vh; background: #f9fafb; }
        .admin-sidebar-desktop { display: flex; }
        .admin-topbar { display: none; }
        .admin-overlay { display: none; }

        @media (max-width: 768px) {
          .admin-sidebar-desktop { display: none; }
          .admin-topbar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0.75rem 1rem;
            background: #030f2b;
            position: sticky;
            top: 0;
            z-index: 100;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          }
          .admin-topbar-logo { display: flex; align-items: center; gap: 0.6rem; }
          .admin-topbar-logo span { font-size: 0.875rem; font-weight: 800; color: white; }
          .admin-hamburger {
            background: none; border: none; cursor: pointer;
            display: flex; flex-direction: column; gap: 5px; padding: 4px;
          }
          .admin-hamburger span {
            display: block; width: 22px; height: 2px;
            background: white; border-radius: 2px; transition: all 0.3s ease;
          }
          .admin-hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
          .admin-hamburger.open span:nth-child(2) { opacity: 0; }
          .admin-hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
          .admin-sidebar-mobile {
            display: none;
            position: fixed;
            top: 0; left: 0; bottom: 0;
            width: 260px;
            z-index: 200;
            transform: translateX(-100%);
            transition: transform 0.3s ease;
          }
          .admin-sidebar-mobile.open { display: block; transform: translateX(0); }
          .admin-overlay {
            display: block;
            position: fixed; inset: 0;
            background: rgba(0,0,0,0.5);
            z-index: 199;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s;
          }
          .admin-overlay.open { opacity: 1; pointer-events: auto; }
        }
      `}</style>

      <div className="admin-wrapper">
        {/* Desktop sidebar — render langsung, bukan komponen */}
        <div className="admin-sidebar-desktop">
          {renderSidebar()}
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {/* Mobile topbar */}
          <div className="admin-topbar">
            <div className="admin-topbar-logo">
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'white', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Image src="/icon.png" alt="Logo" width={28} height={28} style={{ objectFit: 'contain' }} />
              </div>
              <span>SMPN 8 Probolinggo</span>
            </div>
            <button
              className={`admin-hamburger${sidebarOpen ? ' open' : ''}`}
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle menu"
            >
              <span /><span /><span />
            </button>
          </div>

          <main style={{ flex: 1, overflow: 'auto' }}>
            {children}
          </main>
        </div>

        {/* Mobile sidebar — render langsung, bukan komponen */}
        <div className={`admin-sidebar-mobile${sidebarOpen ? ' open' : ''}`}>
          {renderSidebar()}
        </div>

        {/* Overlay */}
        <div
          className={`admin-overlay${sidebarOpen ? ' open' : ''}`}
          onClick={() => setSidebarOpen(false)}
        />
      </div>
    </>
  )
}