import Image from 'next/image'
import type { SiteSettings } from '@/lib/db'
import { getImageUrl } from '@/lib/db'

export default function VisiMisiSection({ settings }: { settings?: SiteSettings | null }) {
  if (!settings) return null

  const { vision, mission, motto } = settings
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
        .vm-section::before {
          content: '';
          position: absolute;
          top: -80px; right: -80px;
          width: 360px; height: 360px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(26,92,200,.06) 0%, transparent 70%);
          pointer-events: none;
        }

        /* ── Header ── */
        .vm-header {
          text-align: center;
          margin-bottom: 3rem;
        }
        .vm-divider {
          width: 56px; height: 4px;
          background: linear-gradient(90deg, #1a5cc8, #e8a31a);
          border-radius: 2px;
          margin: 1rem auto 0;
        }

        /* ── Visi Misi Block ── */
        .vm-block {
          background: linear-gradient(135deg, #071e4a 0%, #1a5cc8 100%);
          border-radius: 20px;
          padding: 2.5rem 3rem;
          color: white;
          margin-bottom: 3rem;
          position: relative;
          overflow: hidden;
        }
        .vm-block::before {
          content: '"';
          position: absolute;
          top: -1rem; left: 1.5rem;
          font-size: 10rem;
          color: rgba(255,255,255,.06);
          font-family: Georgia, serif;
          line-height: 1;
          pointer-events: none;
        }
        .vm-block-inner {
          display: grid;
          grid-template-columns: 1fr 1.6fr;
          gap: 2.5rem;
          align-items: start;
          position: relative;
        }
        .vm-visi-side {}
        .vm-visi-label {
          font-size: .7rem;
          font-weight: 800;
          letter-spacing: .14em;
          text-transform: uppercase;
          color: #93c5fd;
          margin-bottom: .75rem;
        }
        .vm-visi-text {
          font-size: 1rem;
          line-height: 1.8;
          font-style: italic;
          color: rgba(255,255,255,.9);
        }
        .vm-divider-v {
          width: 1px;
          background: rgba(255,255,255,.15);
          align-self: stretch;
          display: none;
        }
        .vm-misi-side {}
        .vm-misi-label {
          font-size: .7rem;
          font-weight: 800;
          letter-spacing: .14em;
          text-transform: uppercase;
          color: #fde68a;
          margin-bottom: 1rem;
        }
        .vm-misi-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: .65rem;
          margin: 0; padding: 0;
        }
        .vm-misi-item {
          display: flex;
          gap: .75rem;
          align-items: flex-start;
        }
        .vm-misi-num {
          flex-shrink: 0;
          width: 24px; height: 24px;
          background: rgba(255,255,255,.15);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: .7rem;
          font-weight: 800;
          color: #fde68a;
          margin-top: .15rem;
        }
        .vm-misi-text {
          font-size: .875rem;
          line-height: 1.65;
          color: rgba(255,255,255,.85);
        }

        /* ── Kepsek Block ── */
        .vm-kepsek {
          display: grid;
          grid-template-columns: 260px 1fr;
          gap: 2.5rem;
          align-items: start;
        }
        .vm-kepsek-photo {
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          aspect-ratio: 3/4;
          box-shadow: 0 8px 32px rgba(7,30,74,.18);
        }
        .vm-kepsek-photo::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 55%, rgba(7,30,74,.65) 100%);
        }
        .vm-kepsek-badge {
          position: absolute;
          bottom: 1rem;
          left: 1rem;
          right: 1rem;
          z-index: 2;
          background: rgba(255,255,255,.12);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,.2);
          border-radius: 10px;
          padding: .75rem 1rem;
          color: white;
        }
        .vm-kepsek-role {
          font-size: .65rem;
          font-weight: 800;
          letter-spacing: .12em;
          text-transform: uppercase;
          background: #e8a31a;
          color: #030f2b;
          border-radius: 100px;
          padding: .15rem .55rem;
          display: inline-block;
          margin-bottom: .4rem;
        }
        .vm-kepsek-name {
          font-weight: 700;
          font-size: .9rem;
          line-height: 1.3;
        }
        .vm-kepsek-nip {
          font-size: .72rem;
          opacity: .7;
          margin-top: .15rem;
        }

        /* Pesan kepsek */
        .vm-kepsek-content {}
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
          font-size: clamp(1.2rem, 2vw, 1.6rem);
          font-weight: 700;
          color: #071e4a;
          margin-bottom: 1.25rem;
          line-height: 1.35;
        }
        .vm-kepsek-message {
          font-size: .9rem;
          line-height: 1.85;
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
          margin-top: 1.25rem;
        }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .vm-block { padding: 1.75rem 1.5rem; border-radius: 14px; margin-bottom: 2rem; }
          .vm-block-inner { grid-template-columns: 1fr; gap: 1.5rem; }
          .vm-kepsek { grid-template-columns: 1fr; gap: 1.5rem; }
          .vm-kepsek-photo { max-width: 240px; margin: 0 auto; aspect-ratio: 3/4; }
        }
        @media (max-width: 480px) {
          .vm-section { padding: 3rem 0 2.5rem; }
          .vm-block { padding: 1.5rem 1.25rem; }
        }
      `}</style>

      <section className="vm-section">
        <div className="container">

          {/* Header */}
          <div className="vm-header">
            <span className="section-label">Tentang Kami</span>
            <h2 className="section-title">Visi &amp; Misi Sekolah</h2>
            <div className="vm-divider" />
          </div>

          {/* Visi + Misi block */}
          {(vision || (mission && mission.length > 0)) && (
            <div className="vm-block">
              <div className="vm-block-inner">
                {vision && (
                  <div className="vm-visi-side">
                    <div className="vm-visi-label">🎯 Visi Sekolah</div>
                    <div className="vm-visi-text">{vision}</div>
                  </div>
                )}
                {mission && mission.length > 0 && (
                  <div className="vm-misi-side">
                    <div className="vm-misi-label">🚀 Misi Sekolah</div>
                    <ul className="vm-misi-list">
                      {mission.map((m, i) => (
                        <li key={i} className="vm-misi-item">
                          <span className="vm-misi-num">{i + 1}</span>
                          <span className="vm-misi-text">{m.point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Kepsek */}
          <div className="vm-kepsek">
            {/* Foto */}
            <div className="vm-kepsek-photo">
              {principal.photo ? (
                <Image
                  src={getImageUrl(principal.photo)}
                  alt={principal.name ?? 'Kepala Sekolah'}
                  fill
                  sizes="260px"
                  style={{ objectFit: 'cover', objectPosition: 'top center' }}
                />
              ) : (
                <div style={{
                  width: '100%', height: '100%',
                  background: 'linear-gradient(135deg, #1345a0, #4d92f0)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '4rem',
                }}>👤</div>
              )}
              <div className="vm-kepsek-badge">
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