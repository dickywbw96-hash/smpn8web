import Image from 'next/image'
import type { SiteSettings } from '@/lib/db'
import { getImageUrl } from '@/lib/db'

export default function VisiMisiSection({ settings }: { settings?: SiteSettings | null }) {
  if (!settings) return null

  const { vision, motto } = settings
  const principal = {
    name:    settings.principal_name,
    nip:     settings.principal_nip,
    photo:   settings.principal_photo_url,
    message: settings.principal_message,
  }

  return (
    <>
      <style>{`
        .vm-section {
          padding: 5rem 0 4rem;
          background: linear-gradient(180deg, #f1f5fb 0%, white 100%);
          position: relative;
          overflow: hidden;
        }

        /* ── Header ── */
        .vm-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }
        .vm-divider {
          width: 56px; height: 4px;
          background: linear-gradient(90deg, #1a5cc8, #e8a31a);
          border-radius: 2px;
          margin: 1rem auto 0;
        }

        /* ── Vision Quote ── */
        .vm-quote-wrap {
          margin-bottom: 3.5rem;
          text-align: center;
          padding: 0 1rem;
        }
        .vm-quote-icon {
          font-size: 3rem;
          color: #1a5cc8;
          opacity: .25;
          line-height: 1;
          margin-bottom: -.5rem;
          font-family: Georgia, serif;
          display: block;
        }
        .vm-quote-text {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.15rem, 2.2vw, 1.65rem);
          font-weight: 700;
          color: #071e4a;
          line-height: 1.65;
          max-width: 820px;
          margin: 0 auto;
          font-style: italic;
          position: relative;
        }
        .vm-quote-bar {
          width: 48px; height: 3px;
          background: linear-gradient(90deg, #1a5cc8, #e8a31a);
          border-radius: 2px;
          margin: 1.5rem auto 0;
        }

        /* ── Kepsek ── */
        .vm-kepsek {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 3rem;
          align-items: start;
        }

        /* Foto + nama di bawah */
        .vm-kepsek-left {}
        .vm-kepsek-photo {
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          aspect-ratio: 3/4;
          box-shadow: 0 12px 40px rgba(7,30,74,.18);
          margin-bottom: 0;
        }
        .vm-kepsek-info {
          background: white;
          border-radius: 0 0 16px 16px;
          padding: 1rem 1.25rem 1.25rem;
          text-align: center;
          box-shadow: 0 6px 20px rgba(7,30,74,.1);
          border: 1px solid #e8eef8;
          border-top: none;
          margin-top: -4px;
        }
        .vm-kepsek-role {
          font-size: .65rem;
          font-weight: 800;
          letter-spacing: .12em;
          text-transform: uppercase;
          background: #1a5cc8;
          color: white;
          border-radius: 100px;
          padding: .2rem .7rem;
          display: inline-block;
          margin-bottom: .5rem;
        }
        .vm-kepsek-name {
          font-weight: 700;
          font-size: .95rem;
          color: #071e4a;
          line-height: 1.3;
        }
        .vm-kepsek-nip {
          font-size: .72rem;
          color: #94a3b8;
          margin-top: .2rem;
        }

        /* Pesan kepsek */
        .vm-kepsek-content {
          padding-top: .5rem;
        }
        .vm-kepsek-eyebrow {
          font-size: .7rem;
          font-weight: 800;
          letter-spacing: .14em;
          text-transform: uppercase;
          color: #1a5cc8;
          margin-bottom: .5rem;
        }
        .vm-kepsek-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.3rem, 2vw, 1.75rem);
          font-weight: 700;
          color: #071e4a;
          margin-bottom: 1.5rem;
          line-height: 1.35;
        }
        .vm-kepsek-message {
          font-size: .925rem;
          line-height: 1.9;
          color: #4b5563;
          border-left: 3px solid #1a5cc8;
          padding-left: 1.25rem;
          font-style: italic;
        }
        .vm-motto {
          display: inline-flex;
          align-items: center;
          gap: .5rem;
          background: #fef9c3;
          color: #92400e;
          border: 1px solid #fde68a;
          border-radius: 100px;
          padding: .35rem 1rem;
          font-size: .78rem;
          font-weight: 700;
          margin-top: 1.5rem;
        }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .vm-kepsek { grid-template-columns: 1fr; gap: 2rem; }
          .vm-kepsek-left { max-width: 280px; margin: 0 auto; width: 100%; }
        }
        @media (max-width: 480px) {
          .vm-section { padding: 3rem 0 2.5rem; }
          .vm-quote-text { font-size: 1.05rem; }
        }
      `}</style>

      <section className="vm-section">
        <div className="container">

          {/* Header */}
          <div className="vm-header">
            <span className="section-label">Tentang Kami</span>
            <h2 className="section-title">Profil Sekolah</h2>
            <div className="vm-divider" />
          </div>

          {/* Vision quote */}
          {vision && (
            <div className="vm-quote-wrap">
              <span className="vm-quote-icon">"</span>
              <p className="vm-quote-text">{vision}</p>
              <div className="vm-quote-bar" />
            </div>
          )}

          {/* Kepsek */}
          <div className="vm-kepsek">
            {/* Foto + nama */}
            <div className="vm-kepsek-left">
              <div className="vm-kepsek-photo">
                {principal.photo ? (
                  <Image
                    src={getImageUrl(principal.photo)}
                    alt={principal.name ?? 'Kepala Sekolah'}
                    fill
                    sizes="300px"
                    style={{ objectFit: 'cover', objectPosition: 'top center' }}
                  />
                ) : (
                  <div style={{
                    width: '100%', height: '100%',
                    background: 'linear-gradient(135deg, #1345a0, #4d92f0)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '5rem',
                  }}>👤</div>
                )}
              </div>
              <div className="vm-kepsek-info">
                <div className="vm-kepsek-role">Kepala Sekolah</div>
                <div className="vm-kepsek-name">{principal.name ?? 'Nama Kepala Sekolah'}</div>
                {principal.nip && <div className="vm-kepsek-nip">NIP. {principal.nip}</div>}
              </div>
            </div>

            {/* Pesan */}
            <div className="vm-kepsek-content">
              <div className="vm-kepsek-eyebrow">💬 Sambutan Kepala Sekolah</div>
              <h3 className="vm-kepsek-title">
                Selamat Datang di<br />
                {settings.school_name ?? 'SMP Negeri 8 Probolinggo'}
              </h3>
              {principal.message && (
                <div className="vm-kepsek-message">{principal.message}</div>
              )}
              {motto && (
                <div className="vm-motto">⭐ {motto}</div>
              )}
            </div>
          </div>

        </div>
      </section>
    </>
  )
}