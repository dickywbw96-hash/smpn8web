'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const MENU_ITEMS = [
  { label: 'Home', href: '/' },
  {
    label: 'Profil', href: '/profil',
    children: [
      { label: 'Profil Sekolah',      href: '/profil' },
      { label: 'Visi & Misi',         href: '/profil/visi-misi' },
      { label: 'Guru & TAS',          href: '/profil/guru-tas' },
      { label: 'Kurikulum',           href: '/profil/kurikulum' },
      { label: 'Struktur Organisasi', href: '/profil/struktur-organisasi' },
      { label: 'Sarana & Prasarana',  href: '/profil/sarpras' },
    ],
  },
  {
    label: 'Kesiswaan', href: '/kesiswaan',
    children: [
      { label: 'Tata Tertib',     href: '/kesiswaan/tata-tertib' },
      { label: 'Seragam',         href: '/kesiswaan/seragam' },
      { label: 'Ekstrakurikuler', href: '/kesiswaan/ekstrakurikuler' },
    ],
  },
  {
    label: 'Berita', href: '/berita',
    children: [
      { label: 'Semua Berita',        href: '/berita' },
      { label: 'Kegiatan Umum',       href: '/berita/kegiatan-umum' },
      { label: 'Prestasi',            href: '/berita/prestasi' },
      { label: 'Kegiatan Organisasi', href: '/berita/kegiatan-organisasi' },
    ],
  },
  { label: 'Kontak', href: '/kontak' },
  {
    label: 'PPID', href: '/ppid',
    children: [
      { label: 'Tentang PPID',              href: '/ppid/tentang' },
      { label: 'Alur Permohonan Informasi', href: '/ppid/alur-permohonan' },
      { label: 'MoU',                       href: '/ppid/mou' },
      { label: 'SOP PPID',                  href: '/ppid/sop' },
      { label: 'Daftar Informasi Publik',   href: '/ppid/daftar-informasi' },
    ],
  },
  { label: 'SPMB', href: '/spmb' },
  { label: 'LMS',  href: '/lms' },
]

interface NavbarProps {
  logoUrl?: string
  settings?: {
    address_street?: string
    address_city?: string
    contact_phone?: string
    contact_email?: string
    social_facebook?: string
    social_instagram?: string
    social_youtube?: string
    social_tiktok?: string
    contact_whatsapp?: string
  } | null
}

export default function Navbar({ logoUrl, settings }: NavbarProps) {
  const [scrolled, setScrolled]         = useState(false)
  const [mobileOpen, setMobileOpen]     = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const pathname = usePathname()
  const navRef   = useRef<HTMLElement>(null)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenDropdown(null)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => { setMobileOpen(false); setOpenDropdown(null) }, [pathname])

  const isActive = (href: string) => href === '/' ? pathname === '/' : pathname.startsWith(href)

  const socials = [
    { key: 'facebook',  url: settings?.social_facebook,  label: 'Facebook',  icon: <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg> },
    { key: 'instagram', url: settings?.social_instagram, label: 'Instagram', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg> },
    { key: 'youtube',   url: settings?.social_youtube,   label: 'YouTube',   icon: <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/></svg> },
    { key: 'tiktok',    url: settings?.social_tiktok,    label: 'TikTok',    icon: <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.29 6.29 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.21 8.21 0 0 0 4.8 1.53V6.75a4.85 4.85 0 0 1-1.03-.06z"/></svg> },
    { key: 'whatsapp',  url: settings?.contact_whatsapp ? `https://wa.me/${settings.contact_whatsapp}` : undefined, label: 'WhatsApp', icon: <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg> },
  ].filter(s => !!s.url)

  const addressText = [settings?.address_street, settings?.address_city].filter(Boolean).join(', ')
  const mapsUrl = (settings as any)?.address_maps_url

  return (
    <>
      <style>{`
        /* ── Topbar ── */
        .nav-topbar {
          background: #030f2b;
          border-bottom: 1px solid rgba(255,255,255,.07);
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 1001;
        }
        .nav-topbar-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: .45rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }
        .nav-topbar-left {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          font-size: .72rem;
          color: rgba(255,255,255,.55);
        }
        .nav-topbar-left a {
          color: rgba(255,255,255,.55);
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: .35rem;
          transition: color .15s;
        }
        .nav-topbar-left a:hover { color: rgba(255,255,255,.9); }
        .nav-topbar-divider {
          width: 1px; height: 14px;
          background: rgba(255,255,255,.15);
        }
        .nav-topbar-socials {
          display: flex;
          align-items: center;
          gap: .3rem;
        }
        .nav-topbar-social {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px; height: 28px;
          border-radius: 6px;
          color: rgba(255,255,255,.5);
          text-decoration: none;
          transition: all .15s ease;
        }
        .nav-topbar-social:hover { background: rgba(255,255,255,.1); color: white; }
        .nav-topbar-social.fb:hover    { background: #1877f2; color: white; }
        .nav-topbar-social.ig:hover    { background: linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888); color: white; }
        .nav-topbar-social.yt:hover    { background: #ff0000; color: white; }
        .nav-topbar-social.tt:hover    { background: #010101; color: white; }
        .nav-topbar-social.wa:hover    { background: #25d366; color: white; }

        /* ── Navbar (turun karena topbar) ── */
        .navbar {
          position: fixed;
          top: 37px; left: 0; right: 0;
          z-index: 1000;
          transition: all .3s ease;
        }
        .navbar.scrolled {
          background: rgba(7,30,74,.97);
          backdrop-filter: blur(12px);
          box-shadow: 0 4px 24px rgba(0,0,0,.25);
          top: 0;
        }
        .navbar:not(.scrolled) {
          background: linear-gradient(180deg, rgba(7,30,74,.9) 0%, rgba(7,30,74,.4) 100%);
        }
        .nav-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: .85rem 1.5rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        .nav-logo {
          display: flex; align-items: center; gap: .75rem;
          text-decoration: none;
        }
        .nav-logo-img {
          width: 44px; height: 44px;
          border-radius: 50%;
          object-fit: contain;
          background: white;
          padding: 2px;
        }
        .nav-logo-text { color: white; }
        .nav-logo-name { font-weight: 800; font-size: .95rem; line-height: 1.2; letter-spacing: .02em; }
        .nav-logo-sub  { font-size: .7rem; opacity: .75; font-weight: 400; }
        .nav-menu { display: flex; align-items: center; gap: .25rem; list-style: none; }
        .nav-item { position: relative; }
        .nav-link {
          display: flex; align-items: center; gap: .3rem;
          padding: .5rem .75rem;
          color: rgba(255,255,255,.88);
          text-decoration: none; font-size: .82rem; font-weight: 600;
          border-radius: 8px; transition: all .2s ease;
          background: none; border: none; cursor: pointer; white-space: nowrap;
        }
        .nav-link:hover, .nav-link.active { color: #fff; background: rgba(255,255,255,.12); }
        .nav-link .chevron { width: 14px; height: 14px; transition: transform .2s ease; }
        .nav-link.open .chevron { transform: rotate(180deg); }
        .dropdown {
          position: absolute;
          top: calc(100% + 8px); left: 50%;
          background: white; border-radius: 14px;
          box-shadow: 0 16px 48px rgba(7,30,74,.2);
          min-width: 220px; padding: .5rem;
          opacity: 0; visibility: hidden; pointer-events: none;
          transition: all .2s ease;
          transform: translateX(-50%) translateY(-6px);
        }
        .dropdown.open {
          opacity: 1; visibility: visible; pointer-events: auto;
          transform: translateX(-50%) translateY(0);
        }
        .dropdown-link {
          display: block; padding: .6rem 1rem;
          color: #374151; text-decoration: none;
          font-size: .85rem; font-weight: 500;
          border-radius: 9px; transition: all .15s ease;
        }
        .dropdown-link:hover, .dropdown-link.active {
          background: #f0f7ff; color: #1a5cc8; padding-left: 1.25rem;
        }
        .nav-hamburger {
          display: none; flex-direction: column; gap: 5px;
          padding: .5rem; background: none; border: none; cursor: pointer;
        }
        .nav-hamburger span {
          display: block; width: 24px; height: 2px;
          background: white; border-radius: 2px; transition: all .3s ease;
        }
        .nav-hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .nav-hamburger.open span:nth-child(2) { opacity: 0; }
        .nav-hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
        .mobile-menu {
          display: none;
          position: fixed;
          top: 109px; left: 0; right: 0; bottom: 0;
          background: #071e4a; overflow-y: auto;
          padding: 1rem 1.5rem 2rem;
          transform: translateX(100%);
          transition: transform .3s ease;
          z-index: 999;
        }
        .mobile-menu.open { transform: translateX(0); }
        .navbar.scrolled ~ .mobile-menu { top: 72px; }
        .mobile-item { border-bottom: 1px solid rgba(255,255,255,.08); }
        .mobile-link {
          display: flex; align-items: center; justify-content: space-between;
          padding: .9rem 0; color: rgba(255,255,255,.9);
          text-decoration: none; font-weight: 600; font-size: .95rem;
          background: none; border: none; width: 100%; cursor: pointer;
        }
        .mobile-sub { padding-bottom: .5rem; }
        .mobile-sub-link {
          display: block; padding: .6rem 0 .6rem 1rem;
          color: rgba(255,255,255,.65); text-decoration: none; font-size: .875rem;
          border-left: 2px solid rgba(255,255,255,.15); margin-left: .5rem;
          transition: all .15s ease;
        }
        .mobile-sub-link:hover { color: white; border-color: #4d92f0; }
        @media (max-width: 900px) {
          .nav-menu { display: none; }
          .nav-hamburger { display: flex; }
          .mobile-menu { display: block; }
          .nav-topbar-left .topbar-address { display: none; }
          .nav-topbar-divider { display: none; }
        }
      `}</style>

      {/* ── Topbar ── */}
      {!scrolled && (
        <div className="nav-topbar">
          <div className="nav-topbar-inner">
            <div className="nav-topbar-left">
              {addressText && (
                <a
                  href={mapsUrl ?? `https://maps.google.com/?q=${encodeURIComponent(addressText)}`}
                  target="_blank" rel="noopener"
                  className="topbar-address"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  {addressText}
                </a>
              )}
              {settings?.contact_phone && (
                <>
                  <div className="nav-topbar-divider" />
                  <a href={`tel:${settings.contact_phone}`}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    {settings.contact_phone}
                  </a>
                </>
              )}
            </div>
            <div className="nav-topbar-socials">
              {socials.map(s => (
                <a key={s.key} href={s.url} target="_blank" rel="noopener noreferrer"
                  className={`nav-topbar-social ${s.key.substring(0,2)}`}
                  aria-label={s.label}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Navbar ── */}
      <nav ref={navRef} className={`navbar${scrolled ? ' scrolled' : ''}`}>
        <div className="nav-inner">
          <Link href="/" className="nav-logo">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo SMPN 8" width={44} height={44} className="nav-logo-img" />
            ) : (
              <div style={{ width:44, height:44, borderRadius:'50%', background:'white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.1rem', fontWeight:800, color:'#071e4a', flexShrink:0 }}>8</div>
            )}
            <div className="nav-logo-text">
              <div className="nav-logo-name">SMP Negeri 8</div>
              <div className="nav-logo-sub">Kota Probolinggo</div>
            </div>
          </Link>

          <ul className="nav-menu">
            {MENU_ITEMS.map((item) => (
              <li key={item.href} className="nav-item">
                {item.children ? (
                  <>
                    <button
                      className={`nav-link${openDropdown === item.href ? ' open' : ''}${isActive(item.href) ? ' active' : ''}`}
                      onClick={() => setOpenDropdown(openDropdown === item.href ? null : item.href)}
                      onMouseEnter={() => setOpenDropdown(item.href)}
                    >
                      {item.label}
                      <svg className="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m6 9 6 6 6-6"/></svg>
                    </button>
                    <div className={`dropdown${openDropdown === item.href ? ' open' : ''}`} onMouseLeave={() => setOpenDropdown(null)}>
                      {item.children.map((child) => (
                        <Link key={child.href} href={child.href} className={`dropdown-link${isActive(child.href) ? ' active' : ''}`}>
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link href={item.href} className={`nav-link${isActive(item.href) ? ' active' : ''}`}>{item.label}</Link>
                )}
              </li>
            ))}
          </ul>

          <button className={`nav-hamburger${mobileOpen ? ' open' : ''}`} onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
            <span/><span/><span/>
          </button>
        </div>
      </nav>

      {/* ── Mobile Menu ── */}
      <div className={`mobile-menu${mobileOpen ? ' open' : ''}`}>
        {MENU_ITEMS.map((item) => (
          <div key={item.href} className="mobile-item">
            {item.children ? (
              <>
                <button className="mobile-link" onClick={() => setOpenDropdown(openDropdown === item.href ? null : item.href)}>
                  {item.label}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                    style={{ transform: openDropdown === item.href ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>
                    <path d="m6 9 6 6 6-6"/>
                  </svg>
                </button>
                {openDropdown === item.href && (
                  <div className="mobile-sub">
                    {item.children.map((child) => (
                      <Link key={child.href} href={child.href} className="mobile-sub-link">{child.label}</Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <Link href={item.href} className="mobile-link">{item.label}</Link>
            )}
          </div>
        ))}
      </div>
    </>
  )
}