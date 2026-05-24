import Link from 'next/link'

const NAV_ITEMS = [
  { label: 'Tentang PPID', href: '/ppid/tentang' },
  { label: 'Alur Permohonan Informasi', href: '/ppid/alur-permohonan' },
  { label: 'MoU', href: '/ppid/mou' },
  { label: 'SOP PPID', href: '/ppid/sop' },
  { label: 'Daftar Informasi Publik', href: '/ppid/daftar-informasi' },
]

interface PPIDLayoutProps {
  children: React.ReactNode
  currentHref: string
}

export default function PPIDLayout({ children, currentHref }: PPIDLayoutProps) {
  const activeLabel = NAV_ITEMS.find((n) => n.href === currentHref)?.label ?? ''

  return (
    <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      {/* Breadcrumb + Judul */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.4rem' }}>
          <Link href="/" style={{ color: '#6b7280', textDecoration: 'none' }}>
            Beranda
          </Link>
          {' › '}
          <Link href="/ppid/tentang" style={{ color: '#6b7280', textDecoration: 'none' }}>
            PPID
          </Link>
          {' › '}
          <span style={{ color: '#0d2a5e' }}>{activeLabel}</span>
        </div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#030f2b', margin: 0 }}>
          {activeLabel}
        </h1>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '240px 1fr',
          gap: '2rem',
          alignItems: 'start',
        }}
      >
        {/* Sidebar Navigasi */}
        <div
          style={{
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
            overflow: 'hidden',
            position: 'sticky',
            top: '5rem',
          }}
        >
          <div
            style={{
              padding: '0.75rem 1rem',
              background: '#0d2a5e',
              color: 'white',
              fontWeight: 700,
              fontSize: '0.85rem',
              letterSpacing: '0.04em',
            }}
          >
            MENU PPID
          </div>
          <nav>
            {NAV_ITEMS.map((item) => {
              const isActive = item.href === currentHref
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    display: 'block',
                    padding: '0.75rem 1rem',
                    fontSize: '0.875rem',
                    fontWeight: isActive ? 700 : 400,
                    color: isActive ? '#0d2a5e' : '#374151',
                    background: isActive ? '#eff6ff' : 'transparent',
                    borderLeft: isActive ? '3px solid #0d2a5e' : '3px solid transparent',
                    textDecoration: 'none',
                  }}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Konten Utama */}
        <div>{children}</div>
      </div>
    </section>
  )
}
