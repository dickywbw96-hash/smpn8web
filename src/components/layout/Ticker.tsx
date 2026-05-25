'use client'

import { useEffect, useState } from 'react'

export default function Ticker({ text, enabled = true }: { text?: string; enabled?: boolean }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  if (!enabled || !text) return null

  const displayText = text || 'Selamat datang di website resmi SMP Negeri 8 Probolinggo'

  return (
    <>
      <style>{`
        .ticker-bar {
          background: linear-gradient(90deg, #071e4a 0%, #0d2a5e 50%, #071e4a 100%);
          border-top: 1px solid rgba(255,255,255,.08);
          border-bottom: 1px solid rgba(77,146,240,.25);
          color: white;
          padding: .4rem 0;
          overflow: hidden;
          position: fixed;
          left: 0; right: 0;
          z-index: 998;
          box-shadow: 0 2px 12px rgba(0,0,0,.2);
          transition: top .35s ease;
        }
        .ticker-inner {
          display: flex;
          align-items: center;
        }
        .ticker-label {
          background: linear-gradient(135deg, #e8a31a, #f5b830);
          color: #030f2b;
          font-size: .7rem;
          font-weight: 800;
          letter-spacing: .08em;
          text-transform: uppercase;
          padding: .3rem .85rem;
          white-space: nowrap;
          flex-shrink: 0;
          border-right: 2px solid rgba(255,255,255,.15);
        }
        .ticker-track {
          flex: 1;
          overflow: hidden;
          mask-image: linear-gradient(90deg, transparent 0%, black 4%, black 96%, transparent 100%);
        }
        .ticker-content {
          display: flex;
          width: max-content;
          animation: ticker-scroll 35s linear infinite;
        }
        .ticker-content:hover { animation-play-state: paused; }
        .ticker-text {
          white-space: nowrap;
          font-size: .8rem;
          font-weight: 500;
          padding: 0 2.5rem;
          opacity: .9;
          letter-spacing: .01em;
        }
        .ticker-sep {
          color: #e8a31a;
          font-size: .9rem;
          opacity: .6;
        }
        @keyframes ticker-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      <div className="ticker-bar" style={{ top: scrolled ? '72px' : '109px' }}>
        <div className="ticker-inner">
          <div className="ticker-label">📢 Info</div>
          <div className="ticker-track">
            <div className="ticker-content">
              {[...Array(4)].map((_, i) => (
                <span key={i} className="ticker-text">
                  {displayText}
                  <span className="ticker-sep"> ✦ </span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}