'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import Image from 'next/image'

export default function PageTransition() {
  const pathname = usePathname()
  const [loading, setLoading] = useState(false)
  const firstRender = useRef(true)

  useEffect(() => {
    // Skip saat pertama kali load
    if (firstRender.current) {
      firstRender.current = false
      return
    }

    setLoading(true)
    const t = setTimeout(() => setLoading(false), 700)
    return () => clearTimeout(t)
  }, [pathname])

  if (!loading) return null

  return (
    <>
      <style>{`
        @keyframes spin-slow {
          to { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          to { transform: rotate(-360deg); }
        }
        @keyframes pulse-logo {
          0%, 100% { transform: scale(1);    opacity: 1; }
          50%       { transform: scale(1.08); opacity: .85; }
        }
        @keyframes shimmer {
          0%   { background-position: -400px 0; }
          100% { background-position:  400px 0; }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        .pt-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 2rem;
          background: linear-gradient(135deg, #0a1628 0%, #0d2149 50%, #0a1628 100%);
          animation: fade-in .15s ease;
        }
        .pt-rings {
          position: relative;
          width: 140px;
          height: 140px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .pt-ring {
          position: absolute;
          border-radius: 50%;
          border: 3px solid transparent;
        }
        .pt-ring-1 {
          width: 140px; height: 140px;
          border-top-color: #f5c518;
          border-right-color: #f5c518;
          animation: spin-slow 1.2s linear infinite;
        }
        .pt-ring-2 {
          width: 116px; height: 116px;
          border-bottom-color: #3b82f6;
          border-left-color: #3b82f6;
          animation: spin-reverse 1.6s linear infinite;
        }
        .pt-ring-3 {
          width: 94px; height: 94px;
          border-top-color: rgba(255,255,255,.25);
          border-right-color: rgba(255,255,255,.25);
          animation: spin-slow 2s linear infinite;
        }
        .pt-logo {
          position: relative;
          width: 72px;
          height: 72px;
          border-radius: 50%;
          overflow: hidden;
          animation: pulse-logo 1.4s ease-in-out infinite;
          box-shadow: 0 0 20px rgba(245,197,24,.35), 0 0 40px rgba(59,130,246,.2);
        }
        .pt-text {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: .35rem;
        }
        .pt-title {
          font-family: sans-serif;
          font-size: 1rem;
          font-weight: 700;
          color: white;
          letter-spacing: .05em;
          text-transform: uppercase;
        }
        .pt-sub {
          font-family: sans-serif;
          font-size: .75rem;
          color: rgba(255,255,255,.5);
          letter-spacing: .08em;
          text-transform: uppercase;
        }
        .pt-bar-wrap {
          width: 160px;
          height: 3px;
          background: rgba(255,255,255,.1);
          border-radius: 99px;
          overflow: hidden;
        }
        .pt-bar {
          height: 100%;
          width: 100%;
          background: linear-gradient(
            90deg,
            rgba(255,255,255,0) 0%,
            #f5c518 40%,
            #3b82f6 60%,
            rgba(255,255,255,0) 100%
          );
          background-size: 400px 100%;
          animation: shimmer 1.2s linear infinite;
        }
      `}</style>

      <div className="pt-overlay">
        <div className="pt-rings">
          <div className="pt-ring pt-ring-1" />
          <div className="pt-ring pt-ring-2" />
          <div className="pt-ring pt-ring-3" />
          <div className="pt-logo">
            <Image src="/icon.png" alt="Logo SMPN 8" fill style={{ objectFit: 'cover' }} unoptimized />
          </div>
        </div>

        <div className="pt-text">
          <span className="pt-title">SMP Negeri 8</span>
          <span className="pt-sub">Kota Probolinggo</span>
        </div>

        <div className="pt-bar-wrap">
          <div className="pt-bar" />
        </div>
      </div>
    </>
  )
}