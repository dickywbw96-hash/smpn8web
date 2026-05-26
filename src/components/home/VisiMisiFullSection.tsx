import type { SiteSettings } from '@/lib/db'

export default function VisiMisiFullSection({ settings }: { settings?: SiteSettings | null }) {
  if (!settings) return null

  const { vision, mission, motto } = settings

  return (
    <>
      <style>{`
        .vmf-section {
          padding: 5rem 0 5rem;
          background: linear-height(180deg, #f1f5fb 0%, white 100%);
        }

        /* ── Visi ── */
        .vmf-visi-wrap {
          background: linear-gradient(135deg, #071e4a 0%, #1a5cc8 100%);
          border-radius: 24px;
          padding: 3.5rem 4rem;
          text-align: center;
          position: relative;
          overflow: hidden;
          margin-bottom: 3rem;
        }
        .vmf-visi-wrap::before {
          content: '"';
          position: absolute;
          top: -2rem; left: 2rem;
          font-size: 14rem;
          color: rgba(255,255,255,.05);
          font-family: Georgia, serif;
          line-height: 1;
          pointer-events: none;
        }
        .vmf-visi-wrap::after {
          content: '';
          position: absolute;
          bottom: -60px; right: -60px;
          width: 200px; height: 200px;
          border-radius: 50%;
          background: rgba(255,255,255,.04);
          pointer-events: none;
        }
        .vmf-visi-label {
          display: inline-flex;
          align-items: center;
          gap: .5rem;
          font-size: .7rem;
          font-weight: 800;
          letter-spacing: .18em;
          text-transform: uppercase;
          color: #93c5fd;
          margin-bottom: 1.5rem;
          position: relative;
        }
        .vmf-visi-text {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.2rem, 2.5vw, 1.85rem);
          font-weight: 700;
          color: white;
          line-height: 1.7;
          max-width: 860px;
          margin: 0 auto;
          font-style: italic;
          position: relative;
        }
        .vmf-visi-bar {
          width: 60px; height: 4px;
          background: linear-gradient(90deg, #e8a31a, #fde68a);
          border-radius: 2px;
          margin: 2rem auto 0;
          position: relative;
        }
        .vmf-motto {
          display: inline-flex;
          align-items: center;
          gap: .5rem;
          background: rgba(232,163,26,.15);
          color: #fde68a;
          border: 1px solid rgba(232,163,26,.3);
          border-radius: 100px;
          padding: .4rem 1.1rem;
          font-size: .8rem;
          font-weight: 700;
          margin-top: 1.5rem;
          position: relative;
        }

        /* ── Misi ── */
        .vmf-misi-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }
        .vmf-misi-eyebrow {
          font-size: .7rem;
          font-weight: 800;
          letter-spacing: .18em;
          text-transform: uppercase;
          color: #1a5cc8;
          display: block;
          margin-bottom: .5rem;
        }
        .vmf-misi-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.4rem, 2.5vw, 2rem);
          font-weight: 700;
          color: #071e4a;
          margin: 0;
        }
        .vmf-misi-divider {
          width: 56px; height: 4px;
          background: linear-gradient(90deg, #1a5cc8, #e8a31a);
          border-radius: 2px;
          margin: 1rem auto 0;
        }

        .vmf-misi-list {
          list-style: none;
          margin: 0; padding: 0;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          max-width: 860px;
          margin: 0 auto;
        }
        .vmf-misi-item {
          display: flex;
          gap: 1.25rem;
          align-items: flex-start;
          background: white;
          border-radius: 14px;
          padding: 1.25rem 1.5rem;
          box-shadow: 0 2px 12px rgba(7,30,74,.07);
          border: 1px solid #e8eef8;
          transition: transform .2s ease, box-shadow .2s ease;
        }
        .vmf-misi-item:hover {
          transform: translateX(4px);
          box-shadow: 0 6px 24px rgba(7,30,74,.12);
          border-color: #bfdbfe;
        }
        .vmf-misi-num {
          flex-shrink: 0;
          width: 40px; height: 40px;
          background: linear-gradient(135deg, #1a5cc8, #3b82f6);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: .9rem;
          font-weight: 800;
          box-shadow: 0 4px 10px rgba(26,92,200,.3);
        }
        .vmf-misi-text {
          font-size: .95rem;
          color: #374151;
          line-height: 1.75;
          padding-top: .5rem;
        }

        @media (max-width: 768px) {
          .vmf-visi-wrap { padding: 2.5rem 1.75rem; border-radius: 16px; }
          .vmf-misi-item { padding: 1rem 1.25rem; gap: 1rem; }
        }
        @media (max-width: 480px) {
          .vmf-section { padding: 3rem 0; }
          .vmf-visi-text { font-size: 1.05rem; }
          .vmf-misi-num { width: 32px; height: 32px; font-size: .8rem; }
        }
      `}</style>

      <section className="vmf-section">
        <div className="container">

          {/* Visi */}
          {vision && (
            <div className="vmf-visi-wrap">
              <div className="vmf-visi-label">🎯 Visi Sekolah</div>
              <p className="vmf-visi-text">{vision}</p>
              <div className="vmf-visi-bar" />
              {motto && <div className="vmf-motto">⭐ {motto}</div>}
            </div>
          )}

          {/* Misi */}
          {mission && mission.length > 0 && (
            <>
              <div className="vmf-misi-header">
                <span className="vmf-misi-eyebrow">🚀 Misi Sekolah</span>
                <h2 className="vmf-misi-title">Misi Kami</h2>
                <div className="vmf-misi-divider" />
              </div>
              <ul className="vmf-misi-list">
                {mission.map((m, i) => (
                  <li key={i} className="vmf-misi-item">
                    <span className="vmf-misi-num">{i + 1}</span>
                    <span className="vmf-misi-text">{m.point}</span>
                  </li>
                ))}
              </ul>
            </>
          )}

        </div>
      </section>
    </>
  )
}