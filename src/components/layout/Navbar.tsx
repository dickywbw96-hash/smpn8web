'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

const MENU_ITEMS = [
  { label: 'Home', href: '/' },
  {
    label: 'Profil',
    href: '/profil',
    children: [
      { label: 'Profil Sekolah',       href: '/profil' },
      { label: 'Visi & Misi',          href: '/profil/visi-misi' },
      { label: 'Guru & TAS',           href: '/profil/guru-tas' },
      { label: 'Kurikulum',            href: '/profil/kurikulum' },
      { label: 'Struktur Organisasi',  href: '/profil/struktur-organisasi' },
      { label: 'Sarana & Prasarana',   href: '/profil/sarpras' },
    ],
  },
  {
    label: 'Kesiswaan',
    href: '/kesiswaan',
    children: [
      { label: 'Tata Tertib',      href: '/kesiswaan/tata-tertib' },
      { label: 'Seragam',          href: '/kesiswaan/seragam' },
      { label: 'Ekstrakurikuler',  href: '/kesiswaan/ekstrakurikuler' },
    ],
  },
  {
    label: 'Berita',
    href: '/berita',
    children: [
      { label: 'Semua Berita',        href: '/berita' },
      { label: 'Kegiatan Umum',       href: '/berita/kegiatan-umum' },
      { label: 'Prestasi',            href: '/berita/prestasi' },
      { label: 'Kegiatan Organisasi', href: '/berita/kegiatan-organisasi' },
    ],
  },
  { label: 'Kontak', href: '/kontak' },
  {
    label: 'PPID',
    href: '/ppid',
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

export default function Navbar({ logoUrl }: { logoUrl?: string }) {
  const [scrolled, setScrolled]   = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const pathname = usePathname()
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Close mobile on route change
  useEffect(() => {
    setMobileOpen(false)
    setOpenDropdown(null)
  }, [pathname])

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <>
      <style>{`
        .navbar {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 1000;
          transition: all .3s ease;
        }
        .navbar.scrolled {
          background: rgba(7,30,74,.97);
          backdrop-filter: blur(12px);
          box-shadow: 0 4px 24px rgba(0,0,0,.25);
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
          display: flex;
          align-items: center;
          gap: .75rem;
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
        .nav-logo-name {
          font-weight: 800;
          font-size: .95rem;
          line-height: 1.2;
          letter-spacing: .02em;
        }
        .nav-logo-sub {
          font-size: .7rem;
          opacity: .75;
          font-weight: 400;
        }
        .nav-menu {
          display: flex;
          align-items: center;
          gap: .25rem;
          list-style: none;
        }
        .nav-item { position: relative; }
        .nav-link {
          display: flex;
          align-items: center;
          gap: .3rem;
          padding: .5rem .75rem;
          color: rgba(255,255,255,.88);
          text-decoration: none;
          font-size: .82rem;
          font-weight: 600;
          border-radius: 8px;
          transition: all .2s ease;
          background: none;
          border: none;
          cursor: pointer;
          white-space: nowrap;
        }
        .nav-link:hover, .nav-link.active {
          color: #fff;
          background: rgba(255,255,255,.12);
        }
        .nav-link .chevron {
          width: 14px; height: 14px;
          transition: transform .2s ease;
        }
        .nav-link.open .chevron { transform: rotate(180deg); }
        .dropdown {
          position: absolute;
          top: calc(100% + 8px);
          left: 50%;
          transform: translateX(-50%);
          background: white;
          border-radius: 14px;
          box-shadow: 0 16px 48px rgba(7,30,74,.2);
          min-width: 220px;
          padding: .5rem;
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
          transition: all .2s ease;
          transform: translateX(-50%) translateY(-6px);
        }
        .dropdown.open {
          opacity: 1;
          visibility: visible;
          pointer-events: auto;
          transform: translateX(-50%) translateY(0);
        }
        .dropdown-link {
          display: block;
          padding: .6rem 1rem;
          color: #374151;
          text-decoration: none;
          font-size: .85rem;
          font-weight: 500;
          border-radius: 9px;
          transition: all .15s ease;
        }
        .dropdown-link:hover, .dropdown-link.active {
          background: #f0f7ff;
          color: #1a5cc8;
          padding-left: 1.25rem;
        }
        .nav-hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          padding: .5rem;
          background: none;
          border: none;
          cursor: pointer;
        }
        .nav-hamburger span {
          display: block;
          width: 24px; height: 2px;
          background: white;
          border-radius: 2px;
          transition: all .3s ease;
        }
        .nav-hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .nav-hamburger.open span:nth-child(2) { opacity: 0; }
        .nav-hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
        /* Mobile */
        .mobile-menu {
          display: none;
          position: fixed;
          top: 72px; left: 0; right: 0; bottom: 0;
          background: #071e4a;
          overflow-y: auto;
          padding: 1rem 1.5rem 2rem;
          transform: translateX(100%);
          transition: transform .3s ease;
        }
        .mobile-menu.open {
          transform: translateX(0);
        }
        .mobile-item { border-bottom: 1px solid rgba(255,255,255,.08); }
        .mobile-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: .9rem 0;
          color: rgba(255,255,255,.9);
          text-decoration: none;
          font-weight: 600;
          font-size: .95rem;
          background: none;
          border: none;
          width: 100%;
          cursor: pointer;
        }
        .mobile-sub {
          padding-bottom: .5rem;
        }
        .mobile-sub-link {
          display: block;
          padding: .6rem 0 .6rem 1rem;
          color: rgba(255,255,255,.65);
          text-decoration: none;
          font-size: .875rem;
          border-left: 2px solid rgba(255,255,255,.15);
          margin-left: .5rem;
          transition: all .15s ease;
        }
        .mobile-sub-link:hover { color: white; border-color: #4d92f0; }
        @media (max-width: 900px) {
          .nav-menu { display: none; }
          .nav-hamburger { display: flex; }
          .mobile-menu { display: block; }
        }
      `}</style>

      <nav ref={navRef} className={`navbar${scrolled ? ' scrolled' : ''}`}>
        <div className="nav-inner">
          {/* Logo */}
          <Link href="/" className="nav-logo">
            {logoUrl ? (
              <Image src={logoUrl} alt="Logo SMPN 8" width={44} height={44} className="nav-logo-img" />
            ) : (
              <div style={{
                width: 44, height: 44, borderRadius: '50%',
                background: 'white', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '1.1rem', fontWeight: 800,
                color: '#071e4a', flexShrink: 0
              }}>8</div>
            )}
            <div className="nav-logo-text">
              <div className="nav-logo-name">SMP Negeri 8</div>
              <div className="nav-logo-sub">Kota Probolinggo</div>
            </div>
          </Link>

          {/* Desktop Menu */}
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
                      <svg className="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="m6 9 6 6 6-6"/>
                      </svg>
                    </button>
                    <div
                      className={`dropdown${openDropdown === item.href ? ' open' : ''}`}
                      onMouseLeave={() => setOpenDropdown(null)}
                    >
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={`dropdown-link${isActive(child.href) ? ' active' : ''}`}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link href={item.href} className={`nav-link${isActive(item.href) ? ' active' : ''}`}>
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          {/* Hamburger */}
          <button
            className={`nav-hamburger${mobileOpen ? ' open' : ''}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <span/><span/><span/>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu${mobileOpen ? ' open' : ''}`}>
        {MENU_ITEMS.map((item) => (
          <div key={item.href} className="mobile-item">
            {item.children ? (
              <>
                <button
                  className="mobile-link"
                  onClick={() => setOpenDropdown(openDropdown === item.href ? null : item.href)}
                >
                  {item.label}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                    style={{ transform: openDropdown === item.href ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>
                    <path d="m6 9 6 6 6-6"/>
                  </svg>
                </button>
                {openDropdown === item.href && (
                  <div className="mobile-sub">
                    {item.children.map((child) => (
                      <Link key={child.href} href={child.href} className="mobile-sub-link">
                        {child.label}
                      </Link>
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
