import Link from 'next/link'
import type { SiteSettings } from '@/lib/db'

const QUICK_LINKS = [
  { label: 'Profil Sekolah',   href: '/profil' },
  { label: 'Visi & Misi',      href: '/profil/visi-misi' },
  { label: 'Guru & TAS',       href: '/profil/guru-tas' },
  { label: 'Ekstrakurikuler',  href: '/kesiswaan/ekstrakurikuler' },
  { label: 'Berita',           href: '/berita' },
  { label: 'Prestasi',         href: '/berita/prestasi' },
  { label: 'PPID',             href: '/ppid' },
  { label: 'SPMB',             href: '/spmb' },
]

function SocialIcon({ type }: { type: string }) {
  const icons: Record<string, JSX.Element> = {
    facebook: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
      </svg>
    ),
    instagram: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
      </svg>
    ),
    youtube: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/>
      </svg>
    ),
    twitter: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
    tiktok: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.29 6.29 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.21 8.21 0 0 0 4.8 1.53V6.75a4.85 4.85 0 0 1-1.03-.06z"/>
      </svg>
    ),
  }
  return icons[type] ?? null
}

export default function Footer({ settings }: { settings?: SiteSettings | null }) {
  const year = new Date().getFullYear()
  const socials = settings?.socialMedia ?? {}
  const socialEntries = Object.entries(socials).filter(([, v]) => !!v) as [string, string][]

  return (
    <>
      <style>{`
        .footer {
          background: linear-gradient(180deg, #071e4a 0%, #030f2b 100%);
          color: rgba(255,255,255,.75);
          padding: 4rem 0 0;
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 1.6fr 1fr 1fr;
          gap: 3rem;
          padding-bottom: 3rem;
        }
        .footer-brand-name {
          font-family: 'Playfair Display', serif;
          color: white;
          font-size: 1.3rem;
          font-weight: 700;
          margin-bottom: .25rem;
        }
        .footer-brand-sub {
          font-size: .8rem;
          color: rgba(255,255,255,.5);
          margin-bottom: 1.25rem;
        }
        .footer-address {
          font-size: .85rem;
          line-height: 1.8;
        }
        .footer-address span { display: block; }
        .footer-contact {
          margin-top: 1rem;
          display: flex;
          flex-direction: column;
          gap: .4rem;
          font-size: .83rem;
        }
        .footer-contact a {
          color: rgba(255,255,255,.65);
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: .5rem;
          transition: color .15s;
        }
        .footer-contact a:hover { color: #7fb3f5; }
        .footer-socials {
          display: flex;
          gap: .6rem;
          margin-top: 1.25rem;
          flex-wrap: wrap;
        }
        .social-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px; height: 36px;
          border-radius: 50%;
          background: rgba(255,255,255,.08);
          color: rgba(255,255,255,.7);
          text-decoration: none;
          transition: all .2s ease;
        }
        .social-btn:hover {
          background: #1a5cc8;
          color: white;
          transform: translateY(-2px);
        }
        .footer-col-title {
          color: white;
          font-weight: 700;
          font-size: .9rem;
          letter-spacing: .05em;
          text-transform: uppercase;
          margin-bottom: 1.25rem;
          padding-bottom: .6rem;
          border-bottom: 2px solid rgba(255,255,255,.1);
        }
        .footer-links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: .6rem;
        }
        .footer-links a {
          color: rgba(255,255,255,.65);
          text-decoration: none;
          font-size: .85rem;
          display: flex;
          align-items: center;
          gap: .5rem;
          transition: all .15s ease;
        }
        .footer-links a::before {
          content: '›';
          color: #4d92f0;
          font-size: 1rem;
          line-height: 1;
        }
        .footer-links a:hover { color: white; padding-left: .3rem; }
        .footer-bottom {
          border-top: 1px solid rgba(255,255,255,.08);
          padding: 1.25rem 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
          font-size: .78rem;
        }
        .footer-bottom-links {
          display: flex;
          gap: 1.5rem;
        }
        .footer-bottom-links a {
          color: rgba(255,255,255,.45);
          text-decoration: none;
          transition: color .15s;
        }
        .footer-bottom-links a:hover { color: rgba(255,255,255,.8); }
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr; gap: 2rem; }
          .footer-bottom { flex-direction: column; text-align: center; }
        }
      `}</style>

      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            {/* Brand + Address */}
            <div>
              <div className="footer-brand-name">SMP Negeri 8 Probolinggo</div>
              <div className="footer-brand-sub">Website Resmi Sekolah</div>
              {settings?.address && (
                <div className="footer-address">
                  <span>📍 {settings.address.street}</span>
                  {settings.address.kelurahan && <span>Kel. {settings.address.kelurahan}, Kec. {settings.address.kecamatan}</span>}
                  <span>{settings.address.city}, {settings.address.province} {settings.address.postalCode}</span>
                </div>
              )}
              <div className="footer-contact">
                {settings?.contact?.phone && (
                  <a href={`tel:${settings.contact.phone}`}>📞 {settings.contact.phone}</a>
                )}
                {settings?.contact?.email && (
                  <a href={`mailto:${settings.contact.email}`}>✉️ {settings.contact.email}</a>
                )}
                {settings?.contact?.whatsapp && (
                  <a href={`https://wa.me/${settings.contact.whatsapp}`} target="_blank" rel="noopener">
                    💬 WhatsApp
                  </a>
                )}
              </div>
              {socialEntries.length > 0 && (
                <div className="footer-socials">
                  {socialEntries.map(([type, url]) => (
                    <a key={type} href={url} target="_blank" rel="noopener noreferrer" className="social-btn" aria-label={type}>
                      <SocialIcon type={type} />
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Links */}
            <div>
              <div className="footer-col-title">Tautan Cepat</div>
              <ul className="footer-links">
                {QUICK_LINKS.slice(0, 5).map((l) => (
                  <li key={l.href}><Link href={l.href}>{l.label}</Link></li>
                ))}
              </ul>
            </div>

            {/* More Links */}
            <div>
              <div className="footer-col-title">Layanan</div>
              <ul className="footer-links">
                {QUICK_LINKS.slice(5).map((l) => (
                  <li key={l.href}><Link href={l.href}>{l.label}</Link></li>
                ))}
                <li><Link href="/kontak">Kontak Kami</Link></li>
                <li><Link href="/lms">LMS</Link></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <span>© {year} SMP Negeri 8 Probolinggo. Hak cipta dilindungi.</span>
            <div className="footer-bottom-links">
              <a href="/ppid">PPID</a>
              <a href="/kontak">Kontak</a>
              <a href="/sitemap.xml">Sitemap</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
