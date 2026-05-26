import type { SiteSettings } from '@/lib/db'

const ICONS = ['✦', '❋', '◈', '✿', '❖', '⬡', '✺', '◉']
const COLORS = [
  { bg: 'linear-gradient(135deg, #071e4a 0%, #1a5cc8 100%)', accent: '#e8a31a', text: 'white' },
  { bg: 'linear-gradient(135deg, #7c2d12 0%, #c2410c 100%)', accent: '#fde68a', text: 'white' },
  { bg: 'linear-gradient(135deg, #14532d 0%, #16a34a 100%)', accent: '#bbf7d0', text: 'white' },
  { bg: 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 100%)', accent: '#ddd6fe', text: 'white' },
  { bg: 'linear-gradient(135deg, #0c4a6e 0%, #0ea5e9 100%)', accent: '#bae6fd', text: 'white' },
  { bg: 'linear-gradient(135deg, #713f12 0%, #d97706 100%)', accent: '#fef3c7', text: 'white' },
]

export default function TaglinesSection({ settings }: { settings?: SiteSettings | null }) {
  const taglines = settings?.taglines ?? []
  if (!taglines.length) return null

  return (
    <>
      <style>{`
        .tl-section {
          background: #f8f9fc;
          padding: 3rem 0 3.5rem;
          position: relative;
          overflow: hidden;
        }
        .tl-section::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, #1a5cc8 0%, #e8a31a 50%, #16a34a 100%);
        }
        .tl-header {
          text-align: center;
          margin-bottom: 2.25rem;
        }
        .tl-eyebrow {
          display: inline-block;
          font-size: .7rem;
          font-weight: 800;
          letter-spacing: .18em;
          text-transform: uppercase;
          color: #1a5cc8;
          margin-bottom: .5rem;
        }
        .tl-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.4rem, 2.5vw, 1.9rem);
          font-weight: 700;
          color: #071e4a;
          margin: 0;
        }

        /* Grid */
        .tl-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.25rem;
        }

        /* Card */
        .tl-card {
          border-radius: 18px;
          padding: 1.75rem 1.5rem 1.5rem;
          position: relative;
          overflow: hidden;
          transition: transform .25s ease, box-shadow .25s ease;
          cursor: default;
        }
        .tl-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 40px rgba(0,0,0,.18);
        }
        /* Decorative circle */
        .tl-card-deco {
          position: absolute;
          top: -28px; right: -28px;
          width: 100px; height: 100px;
          border-radius: 50%;
          background: rgba(255,255,255,.08);
          pointer-events: none;
        }
        .tl-card-deco2 {
          position: absolute;
          bottom: -40px; left: -20px;
          width: 120px; height: 120px;
          border-radius: 50%;
          background: rgba(255,255,255,.05);
          pointer-events: none;
        }
        .tl-card-icon {
          font-size: 1.5rem;
          margin-bottom: .9rem;
          position: relative;
        }
        .tl-card-text {
          font-size: 1.05rem;
          font-weight: 700;
          line-height: 1.4;
          position: relative;
        }
        .tl-card-bar {
          width: 32px;
          height: 3px;
          border-radius: 2px;
          margin-top: 1rem;
          opacity: .5;
        }

        @media (max-width: 640px) {
          .tl-grid { grid-template-columns: repeat(2, 1fr); gap: .875rem; }
          .tl-card { padding: 1.25rem 1.1rem 1.1rem; }
          .tl-card-text { font-size: .9rem; }
        }
        @media (max-width: 360px) {
          .tl-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <section className="tl-section">
        <div className="container">
          <div className="tl-header">
            <span className="tl-eyebrow">⭐ Keunggulan Kami</span>
            <h2 className="tl-title">Mengapa SMP Negeri 8 Probolinggo?</h2>
          </div>

          <div className="tl-grid">
            {taglines.map((t, i) => {
              const c = COLORS[i % COLORS.length]
              const icon = ICONS[i % ICONS.length]
              return (
                <div
                  key={i}
                  className="tl-card"
                  style={{ background: c.bg, color: c.text, boxShadow: '0 4px 20px rgba(0,0,0,.13)' }}
                >
                  <div className="tl-card-deco" />
                  <div className="tl-card-deco2" />
                  <div className="tl-card-icon" style={{ color: c.accent }}>{icon}</div>
                  <div className="tl-card-text">{t.text}</div>
                  <div className="tl-card-bar" style={{ background: c.accent }} />
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}