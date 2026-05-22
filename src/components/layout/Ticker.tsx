'use client'

export default function Ticker({ text, enabled = true }: { text?: string; enabled?: boolean }) {
  if (!enabled || !text) return null

  const displayText = text || 'Selamat datang di website resmi SMP Negeri 8 Probolinggo'

  return (
    <>
      <style>{`
        .ticker-bar {
          background: linear-gradient(90deg, #0d3278 0%, #1a5cc8 50%, #0d3278 100%);
          color: white;
          padding: .45rem 0;
          overflow: hidden;
          position: relative;
          z-index: 999;
          margin-top: 72px; /* navbar height */
        }
        .ticker-inner {
          display: flex;
          align-items: center;
          gap: 0;
        }
        .ticker-label {
          background: #e8a31a;
          color: #030f2b;
          font-size: .72rem;
          font-weight: 800;
          letter-spacing: .08em;
          text-transform: uppercase;
          padding: .25rem .75rem;
          white-space: nowrap;
          flex-shrink: 0;
          z-index: 2;
        }
        .ticker-track {
          flex: 1;
          overflow: hidden;
          mask-image: linear-gradient(90deg, transparent 0%, black 5%, black 95%, transparent 100%);
        }
        .ticker-content {
          display: flex;
          width: max-content;
          animation: ticker-scroll 30s linear infinite;
        }
        .ticker-content:hover { animation-play-state: paused; }
        .ticker-text {
          white-space: nowrap;
          font-size: .82rem;
          font-weight: 500;
          padding: 0 3rem;
          opacity: .95;
        }
        .ticker-sep {
          color: #e8a31a;
          font-size: 1rem;
          padding: 0 1rem;
          opacity: .7;
        }
        @keyframes ticker-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      <div className="ticker-bar">
        <div className="ticker-inner">
          <div className="ticker-label">📢 Info</div>
          <div className="ticker-track">
            <div className="ticker-content">
              {/* Duplikat untuk seamless loop */}
              {[...Array(4)].map((_, i) => (
                <span key={i} className="ticker-text">
                  {displayText}
                  <span className="ticker-sep">✦</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
