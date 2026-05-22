'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { SliderItem, SiteSettings } from '@/lib/payload'
import { getImageUrl } from '@/lib/payload'

interface Props {
  slides: SliderItem[]
  taglines?: { text: string }[]
  schoolName?: string
}

export default function HeroSlider({ slides, taglines = [], schoolName = 'SMP Negeri 8 Probolinggo' }: Props) {
  const [current, setCurrent]     = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isPaused, setIsPaused]   = useState(false)

  const goTo = useCallback((index: number) => {
    if (isAnimating || index === current) return
    setIsAnimating(true)
    setTimeout(() => {
      setCurrent(index)
      setIsAnimating(false)
    }, 400)
  }, [current, isAnimating])

  const next = useCallback(() => {
    goTo((current + 1) % slides.length)
  }, [current, slides.length, goTo])

  useEffect(() => {
    if (slides.length <= 1 || isPaused) return
    const interval = setInterval(next, 5000)
    return () => clearInterval(interval)
  }, [next, slides.length, isPaused])

  if (!slides.length) return <HeroFallback taglines={taglines} schoolName={schoolName} />

  const slide = slides[current]
  const linkHref = slide.linkTo?.type === 'post' && slide.linkTo.post?.slug
    ? `/berita/${slide.linkTo.post.slug}`
    : slide.linkTo?.type === 'custom' && slide.linkTo.url
    ? slide.linkTo.url
    : null

  return (
    <>
      <style>{`
        .hero {
          position: relative;
          height: 92vh;
          min-height: 560px;
          max-height: 820px;
          overflow: hidden;
          background: #030f2b;
        }
        .hero-img {
          position: absolute;
          inset: 0;
          transition: opacity .5s ease;
        }
        .hero-img.fading { opacity: 0; }
        .hero-img img {
          object-fit: cover;
          object-position: center;
        }
        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            rgba(3,15,43,.85) 0%,
            rgba(7,30,74,.65) 40%,
            rgba(3,15,43,.3) 100%
          );
        }
        .hero-content {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding-bottom: 5rem;
        }
        .hero-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
          width: 100%;
        }
        .hero-taglines {
          display: flex;
          flex-wrap: wrap;
          gap: .6rem;
          margin-bottom: 1.25rem;
          animation: fadeUp .6s ease both;
        }
        .hero-tag {
          background: rgba(255,255,255,.1);
          backdrop-filter: blur(6px);
          border: 1px solid rgba(255,255,255,.2);
          color: white;
          padding: .35rem .9rem;
          border-radius: 100px;
          font-size: .8rem;
          font-weight: 600;
        }
        .hero-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.75rem, 4vw, 3rem);
          color: white;
          font-weight: 700;
          line-height: 1.25;
          margin-bottom: .75rem;
          text-shadow: 0 2px 12px rgba(0,0,0,.3);
          animation: fadeUp .6s .1s ease both;
          max-width: 700px;
        }
        .hero-desc {
          font-size: 1rem;
          color: rgba(255,255,255,.82);
          max-width: 560px;
          line-height: 1.7;
          margin-bottom: 1.5rem;
          animation: fadeUp .6s .2s ease both;
        }
        .hero-cta {
          animation: fadeUp .6s .3s ease both;
        }
        .hero-btn {
          display: inline-flex;
          align-items: center;
          gap: .5rem;
          background: #e8a31a;
          color: #030f2b;
          font-weight: 700;
          padding: .7rem 1.6rem;
          border-radius: 100px;
          text-decoration: none;
          font-size: .9rem;
          transition: all .2s ease;
          box-shadow: 0 4px 16px rgba(232,163,26,.4);
        }
        .hero-btn:hover {
          background: #f5b830;
          transform: translateY(-2px);
          box-shadow: 0 6px 24px rgba(232,163,26,.5);
        }
        /* Dots */
        .hero-dots {
          position: absolute;
          bottom: 1.5rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: .5rem;
          z-index: 10;
        }
        .dot {
          width: 8px; height: 8px;
          border-radius: 100px;
          background: rgba(255,255,255,.4);
          border: none;
          cursor: pointer;
          transition: all .3s ease;
          padding: 0;
        }
        .dot.active {
          background: white;
          width: 24px;
        }
        /* Arrows */
        .hero-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255,255,255,.12);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,.2);
          color: white;
          width: 44px; height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all .2s ease;
          z-index: 10;
        }
        .hero-arrow:hover { background: rgba(255,255,255,.25); }
        .hero-arrow.prev { left: 1.5rem; }
        .hero-arrow.next { right: 1.5rem; }
        /* Counter */
        .hero-counter {
          position: absolute;
          top: 50%;
          right: 1.5rem;
          transform: translateY(-50%);
          writing-mode: vertical-rl;
          font-size: .75rem;
          color: rgba(255,255,255,.5);
          letter-spacing: .15em;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 640px) {
          .hero-arrow { display: none; }
          .hero-counter { display: none; }
        }
      `}</style>

      <section
        className="hero"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Background image */}
        <div className={`hero-img${isAnimating ? ' fading' : ''}`}>
          <Image
            src={getImageUrl(slide.image)}
            alt={slide.title}
            fill
            priority
            sizes="100vw"
          />
        </div>
        <div className="hero-overlay" />

        {/* Content */}
        <div className="hero-content">
          <div className="hero-inner">
            {taglines.length > 0 && (
              <div className="hero-taglines" key={`tags-${current}`}>
                {taglines.map((t, i) => (
                  <span key={i} className="hero-tag">{t.text}</span>
                ))}
              </div>
            )}
            <h1 className="hero-title" key={`title-${current}`}>{slide.title}</h1>
            {slide.description && (
              <p className="hero-desc" key={`desc-${current}`}>{slide.description}</p>
            )}
            {linkHref && (
              <div className="hero-cta" key={`cta-${current}`}>
                <Link href={linkHref} className="hero-btn">
                  Selengkapnya →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Arrows */}
        {slides.length > 1 && (
          <>
            <button className="hero-arrow prev" onClick={() => goTo((current - 1 + slides.length) % slides.length)} aria-label="Prev">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <button className="hero-arrow next" onClick={() => goTo((current + 1) % slides.length)} aria-label="Next">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </>
        )}

        {/* Dots */}
        {slides.length > 1 && (
          <div className="hero-dots">
            {slides.map((_, i) => (
              <button key={i} className={`dot${i === current ? ' active' : ''}`} onClick={() => goTo(i)} aria-label={`Slide ${i + 1}`} />
            ))}
          </div>
        )}
      </section>
    </>
  )
}

// Fallback saat belum ada data slider
function HeroFallback({ taglines, schoolName }: { taglines: { text: string }[]; schoolName: string }) {
  return (
    <>
      <style>{`
        .hero-fallback {
          height: 92vh;
          min-height: 560px;
          max-height: 820px;
          background: linear-gradient(135deg, #030f2b 0%, #1345a0 60%, #071e4a 100%);
          display: flex;
          align-items: flex-end;
          padding-bottom: 5rem;
          position: relative;
          overflow: hidden;
        }
        .hero-fallback::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            radial-gradient(circle at 20% 80%, rgba(26,92,200,.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(77,146,240,.2) 0%, transparent 50%);
        }
        .hero-fallback-inner {
          position: relative;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
          width: 100%;
        }
        .hero-school-name {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          color: white;
          font-weight: 700;
          line-height: 1.15;
          margin-bottom: 1rem;
          animation: fadeUp .8s ease both;
        }
        .hero-school-name em {
          display: block;
          font-style: normal;
          color: #e8a31a;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div className="hero-fallback">
        <div className="hero-fallback-inner">
          {taglines.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.6rem', marginBottom: '1.25rem' }}>
              {taglines.map((t, i) => (
                <span key={i} style={{
                  background: 'rgba(255,255,255,.1)', backdropFilter: 'blur(6px)',
                  border: '1px solid rgba(255,255,255,.2)', color: 'white',
                  padding: '.35rem .9rem', borderRadius: '100px', fontSize: '.8rem', fontWeight: 600
                }}>{t.text}</span>
              ))}
            </div>
          )}
          <h1 className="hero-school-name">
            <em>Selamat Datang</em>
            di {schoolName}
          </h1>
        </div>
      </div>
    </>
  )
}
