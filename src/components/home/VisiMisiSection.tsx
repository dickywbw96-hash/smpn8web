import Image from 'next/image'
import type { SiteSettings } from '@/lib/payload'
import { getImageUrl } from '@/lib/payload'

export default function VisiMisiSection({ settings }: { settings?: SiteSettings | null }) {
  if (!settings) return null

  const { vision, mission, principal, motto } = settings

  return (
    <>
      <style>{`
        .vm-section {
          padding: var(--section-py) 0;
          background: linear-gradient(180deg, var(--blue-50) 0%, white 100%);
          position: relative;
          overflow: hidden;
        }
        .vm-section::before {
          content: '';
          position: absolute;
          top: -100px; right: -100px;
          width: 400px; height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(26,92,200,.06) 0%, transparent 70%);
          pointer-events: none;
        }
        .vm-grid {
          display: grid;
          grid-template-columns: 1fr 1.4fr;
          gap: 4rem;
          align-items: start;
        }
        /* Principal card */
        .principal-card {
          position: relative;
        }
        .principal-img-wrap {
          position: relative;
          aspect-ratio: 3/4;
          border-radius: var(--radius-xl);
          overflow: hidden;
          box-shadow: var(--shadow-xl);
          max-width: 360px;
        }
        .principal-img-wrap::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 50%, rgba(7,30,74,.6) 100%);
        }
        .principal-badge {
          position: absolute;
          bottom: 1.5rem;
          left: 1.5rem;
          right: 1.5rem;
          z-index: 2;
          background: rgba(255,255,255,.12);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,.25);
          border-radius: var(--radius-md);
          padding: 1rem 1.25rem;
          color: white;
        }
        .principal-name {
          font-weight: 700;
          font-size: 1.05rem;
          line-height: 1.3;
          margin-bottom: .2rem;
        }
        .principal-nip {
          font-size: .78rem;
          opacity: .75;
        }
        .principal-title {
          font-size: .72rem;
          text-transform: uppercase;
          letter-spacing: .1em;
          background: var(--gold);
          color: var(--blue-950);
          padding: .2rem .6rem;
          border-radius: 100px;
          font-weight: 700;
          display: inline-block;
          margin-bottom: .5rem;
        }
        /* Deco accent */
        .principal-deco {
          position: absolute;
          top: -1rem;
          right: -1rem;
          width: 80px; height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--blue-300), var(--blue-500));
          opacity: .2;
        }
        .principal-deco-2 {
          position: absolute;
          bottom: -1.5rem;
          right: 2rem;
          width: 120px; height: 120px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--gold), transparent);
          opacity: .15;
        }
        /* Content */
        .vm-content {}
        .vm-motto {
          display: inline-flex;
          align-items: center;
          gap: .5rem;
          background: var(--gold-lt);
          color: var(--gold);
          border: 1px solid rgba(232,163,26,.3);
          padding: .4rem 1rem;
          border-radius: 100px;
          font-size: .82rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
        }
        .vm-vision {
          background: linear-gradient(135deg, var(--blue-900), var(--blue-700));
          border-radius: var(--radius-lg);
          padding: 2rem;
          color: white;
          margin-bottom: 2rem;
          position: relative;
          overflow: hidden;
        }
        .vm-vision::before {
          content: '"';
          position: absolute;
          top: -.5rem; left: 1rem;
          font-family: var(--font-display);
          font-size: 8rem;
          color: rgba(255,255,255,.08);
          line-height: 1;
          pointer-events: none;
        }
        .vm-vision-label {
          font-size: .72rem;
          text-transform: uppercase;
          letter-spacing: .12em;
          color: var(--blue-300);
          font-weight: 700;
          margin-bottom: .75rem;
        }
        .vm-vision p {
          font-size: 1.05rem;
          line-height: 1.75;
          font-style: italic;
          position: relative;
        }
        .vm-mission-label {
          font-size: .72rem;
          text-transform: uppercase;
          letter-spacing: .12em;
          color: var(--blue-600);
          font-weight: 700;
          margin-bottom: 1rem;
        }
        .vm-mission-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: .75rem;
        }
        .vm-mission-item {
          display: flex;
          gap: .75rem;
          align-items: flex-start;
        }
        .vm-mission-num {
          flex-shrink: 0;
          width: 28px; height: 28px;
          background: var(--blue-100);
          color: var(--blue-700);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: .75rem;
          font-weight: 800;
          margin-top: .1rem;
        }
        .vm-mission-text {
          font-size: .9rem;
          color: var(--gray-700);
          line-height: 1.65;
        }
        .principal-message {
          background: var(--blue-50);
          border-left: 4px solid var(--blue-400);
          border-radius: 0 var(--radius-md) var(--radius-md) 0;
          padding: 1rem 1.25rem;
          font-style: italic;
          color: var(--gray-500);
          font-size: .9rem;
          line-height: 1.7;
          margin-top: 1.5rem;
        }
        @media (max-width: 768px) {
          .vm-grid { grid-template-columns: 1fr; }
          .principal-img-wrap { max-width: 280px; margin: 0 auto; }
          .principal-card { display: flex; flex-direction: column; align-items: center; }
        }
      `}</style>

      <section className="vm-section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="section-label">Tentang Kami</span>
            <h2 className="section-title">Visi & Misi Sekolah</h2>
            <div className="divider" style={{ margin: '1rem auto 0' }} />
          </div>

          <div className="vm-grid">
            {/* Principal */}
            <div className="principal-card">
              <div className="principal-deco" />
              <div className="principal-deco-2" />
              <div className="principal-img-wrap">
                {principal?.photo ? (
                  <Image
                    src={getImageUrl(principal.photo)}
                    alt={principal.name ?? 'Kepala Sekolah'}
                    fill
                    sizes="360px"
                    style={{ objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{
                    width: '100%', height: '100%',
                    background: 'linear-gradient(135deg, #1345a0, #4d92f0)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '4rem'
                  }}>👤</div>
                )}
                <div className="principal-badge">
                  <div className="principal-title">Kepala Sekolah</div>
                  <div className="principal-name">{principal?.name ?? 'Nama Kepala Sekolah'}</div>
                  {principal?.nip && <div className="principal-nip">NIP. {principal.nip}</div>}
                </div>
              </div>
              {principal?.message && (
                <div className="principal-message">{principal.message}</div>
              )}
            </div>

            {/* Vision & Mission */}
            <div className="vm-content">
              {motto && (
                <div className="vm-motto">⭐ {motto}</div>
              )}

              {vision && (
                <div className="vm-vision">
                  <div className="vm-vision-label">🎯 Visi Sekolah</div>
                  <p>{vision}</p>
                </div>
              )}

              {mission && mission.length > 0 && (
                <>
                  <div className="vm-mission-label">🚀 Misi Sekolah</div>
                  <ul className="vm-mission-list">
                    {mission.map((m, i) => (
                      <li key={i} className="vm-mission-item">
                        <span className="vm-mission-num">{i + 1}</span>
                        <span className="vm-mission-text">{m.point}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
