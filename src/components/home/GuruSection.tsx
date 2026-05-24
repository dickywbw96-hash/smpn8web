'use client'

import { useRef, useState, useEffect } from 'react'
import type { Guru } from '@/lib/db'

interface Props {
  guru: Guru[]
}

function getInitials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

function Card({ g }: { g: Guru }) {
  const [imgErr, setImgErr] = useState(false)
  return (
    <div className="guru-card">
      <div className="guru-avatar-wrap">
        {g.photo_url && !imgErr ? (
          <img src={g.photo_url} alt={g.name} loading="lazy" onError={() => setImgErr(true)} />
        ) : (
          <span className="guru-avatar-initials">{getInitials(g.name)}</span>
        )}
      </div>
      <p className="guru-name">{g.name}</p>
      {g.subject && <span className="guru-subject">{g.subject}</span>}
    </div>
  )
}

function TasCard({ g }: { g: Guru }) {
  const [imgErr, setImgErr] = useState(false)
  return (
    <div className="guru-card tas-card">
      <div className="guru-avatar-wrap tas-avatar">
        {g.photo_url && !imgErr ? (
          <img src={g.photo_url} alt={g.name} loading="lazy" onError={() => setImgErr(true)} />
        ) : (
          <span className="guru-avatar-initials" style={{ color: '#16a34a' }}>{getInitials(g.name)}</span>
        )}
      </div>
      <p className="guru-name">{g.name}</p>
      {g.position && <span className="guru-subject" style={{ background: '#dcfce7', color: '#15803d' }}>{g.position}</span>}
    </div>
  )
}

export default function GuruSection({ guru }: Props) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [canLeft, setCanLeft]   = useState(false)
  const [canRight, setCanRight] = useState(true)

  const guruList = guru.filter((g) => g.type === 'guru' || !g.type)
  const tasList  = guru.filter((g) => g.type === 'tas')

  function updateArrows() {
    const el = trackRef.current
    if (!el) return
    setCanLeft(el.scrollLeft > 8)
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8)
  }

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    updateArrows()
    el.addEventListener('scroll', updateArrows, { passive: true })
    return () => el.removeEventListener('scroll', updateArrows)
  }, [])

  function scroll(dir: 'left' | 'right') {
    const el = trackRef.current
    if (!el) return
    el.scrollBy({ left: dir === 'left' ? -320 : 320, behavior: 'smooth' })
  }

  if (!guru.length) return null

  return (
    <>
      <style>{`
        .guru-section {
          padding: 5rem 0 4rem;
          background: #f8f9fc;
          position: relative;
          overflow: hidden;
        }
        .guru-section::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 4px;
          background: linear-gradient(90deg, #1a5cc8, #e8a31a, #16a34a);
        }
        .guru-header {
          text-align: center;
          margin-bottom: 2.5rem;
          padding: 0 1rem;
        }
        .guru-eyebrow {
          display: inline-block;
          font-size: .72rem;
          font-weight: 700;
          letter-spacing: .14em;
          text-transform: uppercase;
          color: #1a5cc8;
          margin-bottom: .6rem;
        }
        .guru-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.6rem, 2.5vw, 2.2rem);
          font-weight: 700;
          color: #071e4a;
          margin: 0;
        }
        .guru-slider-wrap {
          position: relative;
          padding: 0 1rem;
        }
        .guru-track {
          display: flex;
          gap: 1.25rem;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          padding: .5rem 3rem .75rem;
          scrollbar-width: none;
          align-items: flex-start;
        }
        .guru-track::-webkit-scrollbar { display: none; }

        .track-divider {
          flex: 0 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: .5rem;
          padding: 0 .5rem;
          scroll-snap-align: start;
          min-height: 160px;
        }
        .track-divider-line {
          width: 2px;
          flex: 1;
          background: linear-gradient(180deg, transparent, #cbd5e1, transparent);
        }
        .track-divider-label {
          font-size: .65rem;
          font-weight: 800;
          letter-spacing: .12em;
          text-transform: uppercase;
          color: #16a34a;
          background: #dcfce7;
          border-radius: 100px;
          padding: .3rem .7rem;
          white-space: nowrap;
          writing-mode: vertical-rl;
          text-orientation: mixed;
        }

        .guru-card {
          flex: 0 0 160px;
          scroll-snap-align: start;
          background: white;
          border-radius: 16px;
          padding: 1.5rem 1rem 1.25rem;
          text-align: center;
          box-shadow: 0 2px 12px rgba(7,30,74,.07);
          transition: transform .2s ease, box-shadow .2s ease;
        }
        .guru-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 28px rgba(7,30,74,.12);
        }
        .tas-card { border-top: 3px solid #16a34a; }

        .guru-avatar-wrap {
          width: 76px;
          height: 76px;
          border-radius: 50%;
          margin: 0 auto 1rem;
          overflow: hidden;
          background: #e8eef8;
          border: 3px solid #e8eef8;
          transition: border-color .2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .guru-card:hover .guru-avatar-wrap { border-color: #1a5cc8; }
        .tas-card:hover .guru-avatar-wrap  { border-color: #16a34a; }
        .tas-avatar { background: #f0fdf4; border-color: #f0fdf4; }
        .guru-avatar-wrap img { width: 100%; height: 100%; object-fit: cover; }
        .guru-avatar-initials {
          font-size: 1.4rem;
          font-weight: 700;
          color: #1a5cc8;
          user-select: none;
        }
        .guru-name {
          font-size: .83rem;
          font-weight: 700;
          color: #071e4a;
          line-height: 1.35;
          margin-bottom: .4rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .guru-subject {
          font-size: .72rem;
          color: #1a5cc8;
          font-weight: 600;
          background: #e8f0fb;
          border-radius: 100px;
          padding: .2rem .65rem;
          display: inline-block;
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .guru-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 40px; height: 40px;
          border-radius: 50%;
          background: white;
          border: none;
          box-shadow: 0 2px 12px rgba(7,30,74,.15);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 2;
          transition: all .2s ease;
          color: #071e4a;
        }
        .guru-arrow:hover:not(:disabled) {
          background: #1a5cc8;
          color: white;
          box-shadow: 0 4px 16px rgba(26,92,200,.35);
        }
        .guru-arrow:disabled { opacity: 0; pointer-events: none; }
        .guru-arrow-left  { left: 0; }
        .guru-arrow-right { right: 0; }
        .guru-section-label {
          font-size: .68rem;
          font-weight: 800;
          letter-spacing: .1em;
          text-transform: uppercase;
          color: #94a3b8;
          text-align: center;
          margin-top: 1.25rem;
        }
      `}</style>

      <section className="guru-section">
        <div className="container">
          <div className="guru-header">
            <span className="guru-eyebrow">👨‍🏫 Tenaga Pendidik &amp; Kependidikan</span>
            <h2 className="guru-title">Guru &amp; Staff Sekolah</h2>
          </div>
        </div>

        <div className="guru-slider-wrap">
          <button
            className="guru-arrow guru-arrow-left"
            disabled={!canLeft}
            onClick={() => scroll('left')}
            aria-label="Geser kiri"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <div className="guru-track" ref={trackRef}>
            {guruList.map((g) => <Card key={g.id} g={g} />)}

            {tasList.length > 0 && (
              <div className="track-divider">
                <div className="track-divider-line" />
                <span className="track-divider-label">TAS</span>
                <div className="track-divider-line" />
              </div>
            )}

            {tasList.map((g) => <TasCard key={g.id} g={g} />)}
          </div>

          <button
            className="guru-arrow guru-arrow-right"
            disabled={!canRight}
            onClick={() => scroll('right')}
            aria-label="Geser kanan"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        <p className="guru-section-label">
          {guruList.length} Guru &nbsp;·&nbsp; {tasList.length} Tenaga Administrasi
        </p>
      </section>
    </>
  )
}