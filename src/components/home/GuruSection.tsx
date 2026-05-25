'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
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

const CARD_COLORS = [
  { bg: '#dbeafe', text: '#1e40af', accent: '#3b82f6' },
  { bg: '#dcfce7', text: '#166534', accent: '#22c55e' },
  { bg: '#fef9c3', text: '#854d0e', accent: '#eab308' },
  { bg: '#fce7f3', text: '#9d174d', accent: '#ec4899' },
  { bg: '#f0fdf4', text: '#14532d', accent: '#16a34a' },
  { bg: '#ede9fe', text: '#4c1d95', accent: '#7c3aed' },
  { bg: '#ffedd5', text: '#7c2d12', accent: '#f97316' },
  { bg: '#e0f2fe', text: '#0c4a6e', accent: '#0ea5e9' },
  { bg: '#fef2f2', text: '#7f1d1d', accent: '#ef4444' },
]

function VerticalCard({ g, index, isTas }: { g: Guru; index: number; isTas: boolean }) {
  const [imgErr, setImgErr] = useState(false)
  const color = CARD_COLORS[index % CARD_COLORS.length]

  return (
    <div
      className="guru-vcard"
      style={isTas ? { borderTop: `3px solid #16a34a` } : {}}
    >
      <div className="guru-vcard-photo" style={{ background: color.bg }}>
        {/* Decorative diagonal lines */}
        <svg
          className="guru-vcard-deco"
          viewBox="0 0 200 267"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <line x1="155" y1="0" x2="210" y2="80" stroke="rgba(255,255,255,0.4)" strokeWidth="30" />
          <line x1="0" y1="190" x2="70" y2="267" stroke="rgba(255,255,255,0.25)" strokeWidth="24" />
          <line x1="140" y1="220" x2="200" y2="267" stroke="rgba(255,255,255,0.15)" strokeWidth="16" />
        </svg>

        {g.photo_url && !imgErr ? (
          <img
            src={g.photo_url}
            alt={g.name}
            loading="lazy"
            onError={() => setImgErr(true)}
            className="guru-vcard-img"
          />
        ) : (
          <span className="guru-vcard-initials" style={{ color: color.text }}>
            {getInitials(g.name)}
          </span>
        )}
      </div>

      <div className="guru-vcard-body">
        <p className="guru-vcard-name">{g.name}</p>
        {(g.subject || g.position) && (
          <span
            className="guru-vcard-tag"
            style={
              isTas
                ? { background: '#dcfce7', color: '#15803d' }
                : { background: '#dbeafe', color: '#1d4ed8' }
            }
          >
            {isTas ? g.position : g.subject}
          </span>
        )}
      </div>
    </div>
  )
}

const VISIBLE = 3

export default function GuruSection({ guru }: Props) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [current, setCurrent] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const guruList = guru.filter((g) => g.type === 'guru' || !g.type)
  const tasList = guru.filter((g) => g.type === 'tas')

  // Merge all cards: guru first, then tas
  const allCards: { g: Guru; isTas: boolean }[] = [
    ...guruList.map((g) => ({ g, isTas: false })),
    ...tasList.map((g) => ({ g, isTas: true })),
  ]

  const total = allCards.length
  const steps = Math.max(0, total - VISIBLE + 1)

  const goTo = useCallback(
    (idx: number) => {
      const next = Math.max(0, Math.min(idx, steps - 1))
      setCurrent(next)
      const el = trackRef.current
      if (!el) return
      const cardEl = el.children[0] as HTMLElement
      if (!cardEl) return
      const cardW = cardEl.offsetWidth + 16 // gap: 16px
      el.style.transform = `translateX(-${next * cardW}px)`
    },
    [steps]
  )

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setCurrent((prev) => {
        const next = prev < steps - 1 ? prev + 1 : 0
        const el = trackRef.current
        if (el) {
          const cardEl = el.children[0] as HTMLElement
          if (cardEl) {
            const cardW = cardEl.offsetWidth + 16
            el.style.transform = `translateX(-${next * cardW}px)`
          }
        }
        return next
      })
    }, 5000)
  }, [steps])

  useEffect(() => {
    goTo(0)
    resetTimer()
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [goTo, resetTimer])

  const handleGoTo = (idx: number) => {
    goTo(idx)
    resetTimer()
  }

  if (!guru.length) return null

  return (
    <>
      <style>{`
        .guru-section {
          padding: 5rem 0 4rem;
          background: #f1f5f9;
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

        /* Slider */
        .guru-slider-outer {
          position: relative;
          padding: 0 3rem;
          overflow: hidden;
        }
        .guru-track-clip {
          overflow: hidden;
          border-radius: 0;
        }
        .guru-track {
          display: flex;
          gap: 16px;
          transition: transform .5s cubic-bezier(.4, 0, .2, 1);
          padding-bottom: 6px;
        }

        /* Vertical Card */
        .guru-vcard {
          flex: 0 0 calc(33.333% - 11px);
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(7,30,74,.07);
          transition: transform .2s ease, box-shadow .2s ease;
        }
        .guru-vcard:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 30px rgba(7,30,74,.13);
        }
        .guru-vcard-photo {
          width: 100%;
          aspect-ratio: 3 / 4;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .guru-vcard-deco {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }
        .guru-vcard-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          position: relative;
          z-index: 1;
        }
        .guru-vcard-initials {
          font-size: 3rem;
          font-weight: 700;
          position: relative;
          z-index: 1;
          user-select: none;
          letter-spacing: -.02em;
        }
        .guru-vcard-body {
          padding: 14px 14px 16px;
        }
        .guru-vcard-name {
          font-size: .85rem;
          font-weight: 700;
          color: #071e4a;
          margin: 0 0 8px;
          line-height: 1.35;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .guru-vcard-tag {
          font-size: .7rem;
          font-weight: 600;
          border-radius: 100px;
          padding: .2rem .7rem;
          display: inline-block;
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        /* Arrows */
        .guru-arrow {
          position: absolute;
          top: 35%;
          transform: translateY(-50%);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: white;
          border: none;
          box-shadow: 0 2px 12px rgba(7,30,74,.15);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
          transition: all .2s ease;
          color: #071e4a;
        }
        .guru-arrow:hover:not(:disabled) {
          background: #1a5cc8;
          color: white;
          box-shadow: 0 4px 16px rgba(26,92,200,.35);
        }
        .guru-arrow:disabled {
          opacity: .3;
          pointer-events: none;
        }
        .guru-arrow-left  { left: 0; }
        .guru-arrow-right { right: 0; }

        /* Dots */
        .guru-dots {
          display: flex;
          justify-content: center;
          gap: 6px;
          margin-top: 1.25rem;
        }
        .guru-dot {
          width: 28px;
          height: 4px;
          border-radius: 2px;
          border: none;
          background: #cbd5e1;
          cursor: pointer;
          padding: 0;
          transition: background .3s, width .3s;
        }
        .guru-dot.active {
          background: #1a5cc8;
          width: 40px;
        }

        /* Footer label */
        .guru-section-label {
          font-size: .68rem;
          font-weight: 800;
          letter-spacing: .1em;
          text-transform: uppercase;
          color: #94a3b8;
          text-align: center;
          margin-top: 1rem;
        }

        /* Progress bar */
        .guru-progress-bar {
          height: 3px;
          background: #e2e8f0;
          border-radius: 2px;
          margin: .75rem 3rem 0;
          overflow: hidden;
        }
        .guru-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #1a5cc8, #16a34a);
          border-radius: 2px;
          transition: width .5s cubic-bezier(.4,0,.2,1);
        }

        @media (max-width: 640px) {
          .guru-vcard {
            flex: 0 0 calc(80% - 8px);
          }
          .guru-slider-outer {
            padding: 0 1.5rem;
          }
        }
      `}</style>

      <section className="guru-section">
        <div className="container">
          <div className="guru-header">
            <span className="guru-eyebrow">👨‍🏫 Tenaga Pendidik &amp; Kependidikan</span>
            <h2 className="guru-title">Guru &amp; Staff Sekolah</h2>
          </div>
        </div>

        <div className="guru-slider-outer">
          {/* Left arrow */}
          <button
            className="guru-arrow guru-arrow-left"
            disabled={current === 0}
            onClick={() => handleGoTo(current - 1)}
            aria-label="Geser kiri"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <div className="guru-track-clip">
            <div className="guru-track" ref={trackRef}>
              {allCards.map(({ g, isTas }, i) => (
                <VerticalCard key={g.id} g={g} index={i} isTas={isTas} />
              ))}
            </div>
          </div>

          {/* Right arrow */}
          <button
            className="guru-arrow guru-arrow-right"
            disabled={current >= steps - 1}
            onClick={() => handleGoTo(current + 1)}
            aria-label="Geser kanan"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        {/* Progress bar */}
        <div className="guru-progress-bar">
          <div
            className="guru-progress-fill"
            style={{ width: `${steps > 1 ? (current / (steps - 1)) * 100 : 100}%` }}
          />
        </div>

        {/* Dots */}
        <div className="guru-dots">
          {Array.from({ length: steps }).map((_, i) => (
            <button
              key={i}
              className={`guru-dot${i === current ? ' active' : ''}`}
              onClick={() => handleGoTo(i)}
              aria-label={`Halaman ${i + 1}`}
            />
          ))}
        </div>

        <p className="guru-section-label">
          {guruList.length} Guru &nbsp;·&nbsp; {tasList.length} Tenaga Administrasi
        </p>
      </section>
    </>
  )
}