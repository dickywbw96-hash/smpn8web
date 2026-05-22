import type { Metadata } from 'next'
import { getSiteSettings, getSliderItems, getLatestPosts } from '@/lib/payload'
import HeroSlider from '@/components/home/HeroSlider'
import VisiMisiSection from '@/components/home/VisiMisiSection'
import BeritaSection from '@/components/home/BeritaSection'
import StatsSection from '@/components/home/StatsSection'

export const metadata: Metadata = {
  title: 'Beranda',
  description: 'Website resmi SMP Negeri 8 Kota Probolinggo — Sekolah berkualitas, adiwiyata, dan berprestasi.',
}

export const revalidate = 60

export default async function HomePage() {
  const [settings, slides, posts] = await Promise.all([
    getSiteSettings(),
    getSliderItems(),
    getLatestPosts(5),
  ])

  return (
    <>
      {/* Hero Slider */}
      <HeroSlider
        slides={slides}
        taglines={settings?.heroTaglines ?? []}
        schoolName={settings?.schoolName}
      />

      {/* Stats strip */}
      <StatsSection />

      {/* Visi Misi + Kepsek */}
      <VisiMisiSection settings={settings} />

      {/* Berita Terbaru */}
      <BeritaSection posts={posts} />

      {/* CTA SPMB */}
      <SpmbCTA />
    </>
  )
}

// ── SPMB Call-to-action ──────────────────────────────────
function SpmbCTA() {
  return (
    <>
      <style>{`
        .spmb-cta {
          background: linear-gradient(135deg, #071e4a 0%, #1a5cc8 100%);
          padding: 5rem 0;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .spmb-cta::before {
          content: '';
          position: absolute;
          top: -50%; left: -20%;
          width: 60%; height: 200%;
          background: rgba(255,255,255,.03);
          transform: rotate(15deg);
          pointer-events: none;
        }
        .spmb-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.75rem, 3vw, 2.5rem);
          color: white;
          font-weight: 700;
          margin-bottom: .75rem;
        }
        .spmb-sub {
          color: rgba(255,255,255,.75);
          font-size: 1.05rem;
          margin-bottom: 2rem;
          max-width: 500px;
          margin-left: auto;
          margin-right: auto;
        }
        .spmb-btns {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }
        .spmb-btn-gold {
          background: #e8a31a;
          color: #030f2b;
          font-weight: 800;
          padding: .85rem 2rem;
          border-radius: 100px;
          text-decoration: none;
          font-size: 1rem;
          transition: all .2s ease;
          box-shadow: 0 4px 16px rgba(232,163,26,.4);
        }
        .spmb-btn-gold:hover {
          background: #f5b830;
          transform: translateY(-2px);
          box-shadow: 0 6px 24px rgba(232,163,26,.5);
        }
        .spmb-btn-white {
          background: rgba(255,255,255,.12);
          color: white;
          border: 2px solid rgba(255,255,255,.3);
          font-weight: 700;
          padding: .85rem 2rem;
          border-radius: 100px;
          text-decoration: none;
          font-size: 1rem;
          transition: all .2s ease;
          backdrop-filter: blur(4px);
        }
        .spmb-btn-white:hover {
          background: rgba(255,255,255,.22);
          border-color: rgba(255,255,255,.5);
          transform: translateY(-2px);
        }
      `}</style>
      <section className="spmb-cta">
        <div className="container" style={{ position: 'relative' }}>
          <p style={{ color: '#e8a31a', fontWeight: 700, fontSize: '.8rem', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: '.75rem' }}>
            🎓 Penerimaan Peserta Didik Baru
          </p>
          <h2 className="spmb-title">Bergabunglah Bersama Kami</h2>
          <p className="spmb-sub">Daftarkan putra-putri Anda di SMP Negeri 8 Probolinggo. Sekolah berkualitas, berkarakter, dan berprestasi.</p>
          <div className="spmb-btns">
            <a href="/spmb" className="spmb-btn-gold">Informasi SPMB →</a>
            <a href="/kontak" className="spmb-btn-white">Hubungi Kami</a>
          </div>
        </div>
      </section>
    </>
  )
}
