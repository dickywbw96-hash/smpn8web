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

function VerticalCard({ g, index, isTas }: { g: Guru; index: number; isTas: boolean }) {
  const [imgErr, setImgErr] = useState(false)
  const showInitials = !g.photo_url || imgErr

  return (
    <div className="guru-vcard">
      {/* Photo with decorative border frame */}
      <div className="guru-vcard-frame-wrap">
        <div className="guru-vcard-frame">
          {/* Corner decorative lines - top left */}
          <svg className="guru-frame-deco" viewBox="0 0 220 280" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            {/* Navy background strips - top left */}
            <polygon points="0,0 90,0 0,90" fill="#1a3a6b" opacity="0.92"/>
            {/* Gold diagonal stripe - top left */}
            <polygon points="28,0 52,0 0,52 0,28" fill="#e8a31a"/>
            <polygon points="58,0 72,0 0,72 0,58" fill="#e8a31a"/>
            {/* Navy background strips - bottom right */}
            <polygon points="220,280 130,280 220,190" fill="#1a3a6b" opacity="0.92"/>
            {/* Gold diagonal stripe - bottom right */}
            <polygon points="192,280 168,280 220,228 220,204" fill="#e8a31a"/>
            <polygon points="162,280 148,280 220,208 220,194" fill="#e8a31a"/>
          </svg>

          <div className="guru-vcard-photo">
            {showInitials ? (
              <div className="guru-vcard-initials-wrap">
                <span className="guru-vcard-initials">{getInitials(g.name)}</span>
              </div>
            ) : (
              <img
                src={g.photo_url!}
                alt={g.name}
                loading="lazy"
                onError={() => setImgErr(true)}
                className="guru-vcard-img"
              />
            )}
          </div>
        </div>
      </div>

      {/* Info below */}
      <div className="guru-vcard-body">
        <p className="guru-vcard-name">{g.name}</p>
        <p className="guru-vcard-role">
          {isTas ? (g.position ?? 'Tenaga Administrasi') : (g.subject ?? 'Guru')}
        </p>
      </div>
    </div>
  )
}

const VISIBLE = 5

export default function GuruSection({ guru }: Props) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [current, setCurrent] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const guruList = guru.filter((g) => g.type === 'guru' || !g.type)
  const tasList  = guru.filter((g) => g.type === 'tas')

  const allCards: { g: Guru; isTas: boolean }[] = [
    ...guruList.map((g) => ({ g, isTas: false })),
    ...tasList.map((g)  => ({ g, isTas: true })),
  ]

  const total = allCards.length
  const steps = Math.max(0, total - VISIBLE + 1)

  const goTo = useCallback((idx: number) => {
    const next = Math.max(0, Math.min(idx, steps - 1))
    setCurrent(next)
    const el = trackRef.current
    if (!el) return
    const cardEl = el.children[0] as HTMLElement
    if (!cardEl) return
    const cardW = cardEl.offsetWidth + 15
    el.style.transform = `translateX(-${next * cardW}px)`
  }, [steps])

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setCurrent((prev) => {
        const next = prev < steps - 1 ? prev + 1 : 0
        const el = trackRef.current
        if (el) {
          const cardEl = el.children[0] as HTMLElement
          if (cardEl) {
            const cardW = cardEl.offsetWidth + 15
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
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [goTo, resetTimer])

  const handleGoTo = (idx: number) => { goTo(idx); resetTimer() }

  if (!guru.length) return null

  return (
    <>
      <style>{`
        .guru-section {
          padding: 4rem 0 3.5rem;
          background: #f8f9fc;
          position: relative;
          overflow: hidden;
        }
        .guru-section::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 4px;
          background: linear-gradient(90deg, #1a3a6b, #e8a31a, #1a3a6b);
        }
        .guru-header {
          text-align: center;
          margin-bottom: 2.5rem;
          padding: 0 1rem;
        }
        .guru-main-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.5rem, 2.5vw, 2rem);
          font-weight: 700;
          color: #1a3a6b;
          margin: 0;
        }

        /* Slider */
        .guru-slider-outer {
          position: relative;
          padding: 0 3rem;
          max-width: 1100px;
          margin: 0 auto;
        }
        .guru-track-clip {
          overflow: hidden;
        }
        .guru-track {
          display: flex;
          gap: 14px;
          transition: transform .55s cubic-bezier(.4, 0, .2, 1);
          padding: 6px 2px 10px;
        }

        /* Card */
        .guru-vcard {
          flex: 0 0 calc(20% - 12px);
          background: white;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 2px 12px rgba(26,58,107,.09);
          transition: transform .2s ease, box-shadow .2s ease;
        }
        .guru-vcard:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 26px rgba(26,58,107,.14);
        }

        /* Frame */
        .guru-vcard-frame-wrap {
          padding: 10px 10px 0;
        }
        .guru-vcard-frame {
          position: relative;
          border-radius: 6px;
          overflow: hidden;
          border: 2px solid #1a3a6b;
        }
        .guru-frame-deco {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 2;
        }
        .guru-vcard-photo {
          width: 100%;
          aspect-ratio: 2 / 3;
          overflow: hidden;
          position: relative;
          background: #e8eef8;
        }
        .guru-vcard-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top center;
          display: block;
        }
        .guru-vcard-initials-wrap {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #1a3a6b 0%, #2a5298 100%);
        }
        .guru-vcard-initials {
          font-size: 3.5rem;
          font-weight: 700;
          color: #e8a31a;
          letter-spacing: -.02em;
          user-select: none;
        }

        /* Info */
        .guru-vcard-body {
          padding: 10px 12px 14px;
          text-align: center;
        }
        .guru-vcard-name {
          font-size: .8rem;
          font-weight: 700;
          color: #1a3a6b;
          margin: 0 0 5px;
          line-height: 1.35;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .guru-vcard-role {
          font-size: .72rem;
          color: #64748b;
          margin: 0;
          font-weight: 500;
        }

        /* Arrows */
        .guru-arrow {
          position: absolute;
          top: 40%;
          transform: translateY(-50%);
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #1a3a6b;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
          transition: all .2s ease;
          color: white;
          box-shadow: 0 4px 14px rgba(26,58,107,.35);
        }
        .guru-arrow:hover:not(:disabled) {
          background: #e8a31a;
          box-shadow: 0 4px 18px rgba(232,163,26,.45);
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
          width: 8px;
          height: 8px;
          border-radius: 50%;
          border: none;
          background: #cbd5e1;
          cursor: pointer;
          padding: 0;
          transition: all .3s;
        }
        .guru-dot.active {
          background: #1a3a6b;
          width: 24px;
          border-radius: 4px;
        }

        .guru-section-label {
          font-size: .68rem;
          font-weight: 700;
          letter-spacing: .1em;
          text-transform: uppercase;
          color: #94a3b8;
          text-align: center;
          margin-top: .9rem;
        }

        @media (max-width: 768px) {
          .guru-slider-outer { max-width: 100%; padding: 0 2.5rem; }
        }
        @media (max-width: 640px) {
          .guru-vcard { flex: 0 0 calc(45% - 8px); }
          .guru-slider-outer { padding: 0 2rem; }
        }
      `}</style>

      <section className="guru-section">
        <div className="container">
          <div className="guru-header">
            <h2 className="guru-main-title">Pendidik &amp; Tenaga Kependidikan</h2>
          </div>
        </div>

        <div className="guru-slider-outer">
          <button
            className="guru-arrow guru-arrow-left"
            disabled={current === 0}
            onClick={() => handleGoTo(current - 1)}
            aria-label="Geser kiri"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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

          <button
            className="guru-arrow guru-arrow-right"
            disabled={current >= steps - 1}
            onClick={() => handleGoTo(current + 1)}
            aria-label="Geser kanan"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

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