'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

const QUICK_LINKS = [
  { label: 'Profil Sekolah',  href: '/profil' },
  { label: 'Visi & Misi',     href: '/profil/visi-misi' },
  { label: 'Guru & TAS',      href: '/profil/guru-tas' },
  { label: 'Ekstrakurikuler', href: '/kesiswaan/ekstrakurikuler' },
  { label: 'Berita',          href: '/berita' },
  { label: 'Prestasi',        href: '/berita/prestasi' },
  { label: 'PPID',            href: '/ppid' },
  { label: 'SPMB',            href: '/spmb' },
  { label: 'Kontak Kami',     href: '/kontak' },
  { label: 'LMS',             href: '/lms' },
]

interface Settings {
  school_name?: string
  address_street?: string
  address_kelurahan?: string
  address_kecamatan?: string
  address_city?: string
  address_province?: string
  address_postal_code?: string
  address_maps_url?: string
  contact_phone?: string
  contact_whatsapp?: string
  contact_email?: string
  social_facebook?: string
  social_instagram?: string
  social_youtube?: string
  social_twitter?: string
  social_tiktok?: string
}

const SOCIALS = [
  { key: 'social_facebook',  label: 'Facebook',  colorClass: 'fb',
    icon: <svg viewBox="0 0 24 24" fill="currentColor" width="17" height="17"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg> },
  { key: 'social_instagram', label: 'Instagram', colorClass: 'ig',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="17" height="17"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg> },
  { key: 'social_youtube',   label: 'YouTube',   colorClass: 'yt',
    icon: <svg viewBox="0 0 24 24" fill="currentColor" width="17" height="17"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/></svg> },
  { key: 'social_tiktok',    label: 'TikTok',    colorClass: 'tt',
    icon: <svg viewBox="0 0 24 24" fill="currentColor" width="17" height="17"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.29 6.29 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.21 8.21 0 0 0 4.8 1.53V6.75a4.85 4.85 0 0 1-1.03-.06z"/></svg> },
  { key: 'contact_whatsapp', label: 'WhatsApp',  colorClass: 'wa', isWa: true,
    icon: <svg viewBox="0 0 24 24" fill="currentColor" width="17" height="17"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg> },
]

function Clock() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  const dateStr = now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '1.9rem', fontWeight: 800, color: 'white', letterSpacing: '.05em', fontVariantNumeric: 'tabular-nums' }}>{timeStr}</div>
      <div style={{ fontSize: '.76rem', color: 'rgba(255,255,255,.45)', marginTop: '.2rem' }}>{dateStr}</div>
    </div>
  )
}

function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null)
  useEffect(() => {
    fetch('/api/visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page: window.location.pathname }),
    })
      .then(r => r.json())
      .then(d => setCount(d.count))
      .catch(() => fetch('/api/visit').then(r => r.json()).then(d => setCount(d.count)).catch(() => setCount(null)))
  }, [])
  if (count === null) return null
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '.63rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,.35)', marginBottom: '.3rem' }}>Pengunjung Hari Ini</div>
      <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#e8a31a', letterSpacing: '.05em' }}>{count.toLocaleString('id-ID')}</div>
      <div style={{ fontSize: '.68rem', color: 'rgba(255,255,255,.35)' }}>unique visitor</div>
    </div>
  )
}

// Kunang-kunang footer
function FooterFireflies() {
  return (
    <div style={{ position:'absolute', inset:0, overflow:'hidden', pointerEvents:'none' }} aria-hidden="true">
      {[...Array(8)].map((_, i) => (
        <div key={i} className={`footer-ff footer-ff-${i}`} />
      ))}
    </div>
  )
}

export default function Footer({ settings }: { settings?: Settings | null }) {
  const year = new Date().getFullYear()

  const addressParts = [
    settings?.address_street,
    settings?.address_kelurahan ? `Kel. ${settings.address_kelurahan}` : null,
    settings?.address_kecamatan ? `Kec. ${settings.address_kecamatan}` : null,
  ].filter(Boolean)

  const cityLine = [settings?.address_city, settings?.address_province, settings?.address_postal_code].filter(Boolean).join(', ')

  const mapsUrl = settings?.address_maps_url
    ?? (settings?.address_street ? `https://maps.google.com/?q=${encodeURIComponent([settings.address_street, settings.address_city].filter(Boolean).join(', '))}` : null)

  const embedSrc = `https://maps.google.com/maps?q=${encodeURIComponent([settings?.address_street, settings?.address_city].filter(Boolean).join(', ') || 'SMP Negeri 8 Probolinggo')}&output=embed`

  return (
    <>
      <style>{`
        /* Kunang-kunang footer */
        .footer-ff {
          position: absolute;
          width: 2px; height: 2px;
          border-radius: 50%;
          background: #e8a31a;
          box-shadow: 0 0 5px 2px rgba(232,163,26,.5);
          animation: ff-float 10s ease-in-out infinite, ff-glow 2.5s ease-in-out infinite alternate;
        }
        .footer-ff-0 { left: 5%;  top: 20%; animation-delay: 0s,   0s;   animation-duration: 11s, 2s; }
        .footer-ff-1 { left: 18%; top: 60%; animation-delay: 1.5s, 0.7s; animation-duration: 9s,  2.3s; }
        .footer-ff-2 { left: 32%; top: 35%; animation-delay: 3s,   1.2s; animation-duration: 12s, 1.8s; }
        .footer-ff-3 { left: 48%; top: 70%; animation-delay: 0.8s, 0.4s; animation-duration: 10s, 2.1s; }
        .footer-ff-4 { left: 60%; top: 25%; animation-delay: 2.2s, 1s;   animation-duration: 11s, 2.4s; }
        .footer-ff-5 { left: 73%; top: 55%; animation-delay: 1s,   0.2s; animation-duration: 9s,  1.9s; }
        .footer-ff-6 { left: 85%; top: 40%; animation-delay: 3.5s, 1.5s; animation-duration: 13s, 2.2s; }
        .footer-ff-7 { left: 93%; top: 75%; animation-delay: 2s,   0.8s; animation-duration: 10s, 2s; }

        .footer {
          background: linear-gradient(180deg, #071e4a 0%, #030f2b 100%);
          color: rgba(255,255,255,.75);
          padding: 0;
          position: relative;
          overflow: hidden;
        }

        /* Border mewah atas footer */
        .footer::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent 0%, rgba(232,163,26,.2) 20%, rgba(232,163,26,.6) 50%, rgba(232,163,26,.2) 80%, transparent 100%);
          z-index: 2;
        }

        .footer-maps { width: 100%; height: 260px; border: none; display: block; filter: grayscale(.4) brightness(.8); }
        .footer-maps-wrap { position: relative; overflow: hidden; }
        .footer-maps-wrap::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(180deg, transparent 50%, #071e4a 100%);
          pointer-events: none;
        }
        .footer-maps-btn {
          position: absolute;
          bottom: 1.25rem; left: 50%; transform: translateX(-50%);
          background: #1a5cc8; color: white;
          font-size: .78rem; font-weight: 700;
          padding: .55rem 1.3rem; border-radius: 100px;
          text-decoration: none; z-index: 2;
          display: flex; align-items: center; gap: .45rem;
          box-shadow: 0 4px 16px rgba(0,0,0,.4);
          transition: all .2s; white-space: nowrap;
          border: 1px solid rgba(255,255,255,.15);
        }
        .footer-maps-btn:hover { background: #1450b0; transform: translateX(-50%) translateY(-2px); }

        .footer-main { padding: 3rem 0 0; position: relative; z-index: 1; }
        .footer-grid {
          display: grid;
          grid-template-columns: 1.8fr 1fr 1fr;
          gap: 3rem;
          padding-bottom: 2.5rem;
        }

        /* Border mewah pemisah kolom */
        .footer-grid > div:not(:first-child) {
          padding-left: 2rem;
          border-left: 1px solid rgba(232,163,26,.08);
        }

        .footer-brand-name { color: white; font-size: 1.15rem; font-weight: 800; margin-bottom: .2rem; letter-spacing: .01em; }
        .footer-brand-sub { font-size: .73rem; color: rgba(255,255,255,.35); margin-bottom: 1.2rem; letter-spacing: .04em; text-transform: uppercase; }
        .footer-address { font-size: .8rem; line-height: 1.9; color: rgba(255,255,255,.55); }
        .footer-address a { color: rgba(255,255,255,.55); text-decoration: none; display: flex; align-items: flex-start; gap: .4rem; transition: color .15s; }
        .footer-address a:hover { color: #f5c842; }
        .footer-contact { margin-top: .8rem; display: flex; flex-direction: column; gap: .4rem; font-size: .8rem; }
        .footer-contact a { color: rgba(255,255,255,.55); text-decoration: none; display: flex; align-items: center; gap: .5rem; transition: color .15s; }
        .footer-contact a:hover { color: #7fb3f5; }
        .footer-socials { display: flex; gap: .45rem; margin-top: 1.1rem; flex-wrap: wrap; }
        .social-btn {
          display: flex; align-items: center; justify-content: center;
          width: 34px; height: 34px; border-radius: 9px;
          background: rgba(255,255,255,.05);
          border: 1px solid rgba(255,255,255,.08);
          color: rgba(255,255,255,.6);
          text-decoration: none; transition: all .2s ease;
        }
        .social-btn:hover { transform: translateY(-2px); border-color: transparent; }
        .social-btn.fb:hover { background: #1877f2; color: white; }
        .social-btn.ig:hover { background: linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366); color: white; }
        .social-btn.yt:hover { background: #ff0000; color: white; }
        .social-btn.tt:hover { background: #010101; color: white; border-color: #333; }
        .social-btn.wa:hover { background: #25d366; color: white; }

        .footer-col-title {
          color: white; font-weight: 700; font-size: .75rem;
          letter-spacing: .1em; text-transform: uppercase;
          margin-bottom: 1rem; padding-bottom: .6rem;
          position: relative;
        }
        .footer-col-title::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0;
          width: 2rem; height: 1px;
          background: linear-gradient(90deg, rgba(232,163,26,.7), transparent);
        }
        .footer-links { list-style: none; display: flex; flex-direction: column; gap: .45rem; }
        .footer-links a {
          color: rgba(255,255,255,.5); text-decoration: none; font-size: .8rem;
          display: flex; align-items: center; gap: .4rem; transition: all .15s ease;
        }
        .footer-links a::before { content: '›'; color: rgba(232,163,26,.5); font-size: .9rem; line-height: 1; }
        .footer-links a:hover { color: #f5c842; padding-left: .2rem; }
        .footer-links a:hover::before { color: #e8a31a; }

        /* Strip jam & counter */
        .footer-strip {
          border-top: 1px solid rgba(255,255,255,.05);
          border-bottom: 1px solid rgba(255,255,255,.05);
          background: rgba(0,0,0,.15);
          padding: 1.4rem 0;
          display: flex; align-items: center; justify-content: center;
          gap: 4rem; flex-wrap: wrap;
          position: relative;
        }
        .footer-strip::before {
          content: '';
          position: absolute;
          top: 0; left: 20%; right: 20%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(232,163,26,.3), transparent);
        }
        .footer-strip-divider { width: 1px; height: 44px; background: rgba(255,255,255,.08); }

        .footer-bottom {
          padding: 1rem 0;
          display: flex; align-items: center; justify-content: space-between;
          gap: 1rem; flex-wrap: wrap; font-size: .73rem;
        }
        .footer-bottom-links { display: flex; gap: 1.25rem; }
        .footer-bottom-links a { color: rgba(255,255,255,.3); text-decoration: none; transition: color .15s; }
        .footer-bottom-links a:hover { color: rgba(255,255,255,.7); }

        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr; gap: 1.75rem; }
          .footer-grid > div:not(:first-child) { padding-left: 0; border-left: none; border-top: 1px solid rgba(232,163,26,.08); padding-top: 1.75rem; }
          .footer-bottom { flex-direction: column; text-align: center; }
          .footer-strip { gap: 2rem; }
          .footer-strip-divider { display: none; }
        }
      `}</style>

      <footer className="footer">
        <FooterFireflies />

        {/* Maps */}
        <div className="footer-maps-wrap">
          <iframe className="footer-maps" src={embedSrc} allowFullScreen loading="lazy"
            referrerPolicy="no-referrer-when-downgrade" title="Lokasi SMP Negeri 8 Probolinggo" />
          {mapsUrl && (
            <a href={mapsUrl} target="_blank" rel="noopener" className="footer-maps-btn">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              Buka di Google Maps
            </a>
          )}
        </div>

        <div className="footer-main">
          <div className="container">
            <div className="footer-grid">
              <div>
                <div className="footer-brand-name">{settings?.school_name ?? 'SMP Negeri 8 Probolinggo'}</div>
                <div className="footer-brand-sub">Website Resmi Sekolah</div>
                <div className="footer-address">
                  {addressParts.length > 0 && (
                    <a href={mapsUrl ?? '#'} target={mapsUrl ? '_blank' : undefined} rel="noopener">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink:0, marginTop:'3px' }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      <span>{addressParts.join(', ')}{cityLine ? `, ${cityLine}` : ''}</span>
                    </a>
                  )}
                </div>
                <div className="footer-contact">
                  {settings?.contact_phone && (
                    <a href={`tel:${settings.contact_phone}`}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                      {settings.contact_phone}
                    </a>
                  )}
                  {settings?.contact_email && (
                    <a href={`mailto:${settings.contact_email}`}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                      {settings.contact_email}
                    </a>
                  )}
                  {settings?.contact_whatsapp && (
                    <a href={`https://wa.me/${settings.contact_whatsapp}`} target="_blank" rel="noopener">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
                      WhatsApp
                    </a>
                  )}
                </div>
                <div className="footer-socials">
                  {SOCIALS.map(s => {
                    const raw = (settings as any)?.[s.key] as string | undefined
                    const url = s.isWa ? (raw ? `https://wa.me/${raw}` : undefined) : raw
                    if (!url) return null
                    return (
                      <a key={s.key} href={url} target="_blank" rel="noopener noreferrer"
                        className={`social-btn ${s.colorClass}`} aria-label={s.label}>
                        {s.icon}
                      </a>
                    )
                  })}
                </div>
              </div>

              <div>
                <div className="footer-col-title">Tautan Cepat</div>
                <ul className="footer-links">
                  {QUICK_LINKS.slice(0, 5).map(l => (
                    <li key={l.href}><Link href={l.href}>{l.label}</Link></li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="footer-col-title">Layanan</div>
                <ul className="footer-links">
                  {QUICK_LINKS.slice(5).map(l => (
                    <li key={l.href}><Link href={l.href}>{l.label}</Link></li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="footer-strip">
              <Clock />
              <div className="footer-strip-divider" />
              <VisitorCounter />
            </div>

            <div className="footer-bottom">
              <span style={{ color: 'rgba(255,255,255,.3)' }}>
                © {year} {settings?.school_name ?? 'SMP Negeri 8 Probolinggo'}. Hak cipta dilindungi.
              </span>
              <div className="footer-bottom-links">
                <a href="/ppid">PPID</a>
                <a href="/kontak">Kontak</a>
                <a href="/sitemap.xml">Sitemap</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}