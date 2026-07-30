import type { Metadata } from 'next'
import Link from 'next/link'
import PageHero from '@/components/ui/PageHero'
import { INOVASI_LIST } from '@/app/constants/inovasi'

export const metadata: Metadata = { title: 'Inovasi Sekolah' }

export default function InovasiIndexPage() {
  return (
    <>
      <style>{`
        .inovasi-index-section { padding: 4rem 0; }
        .inovasi-index-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
          gap: 1.5rem;
        }
        .inovasi-index-card {
          display: block;
          background: white;
          border: 1px solid var(--gray-100);
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-lg);
          padding: 2rem 1.5rem;
          text-align: center;
          text-decoration: none;
          transition: all .2s ease;
        }
        .inovasi-index-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-xl);
          border-color: var(--blue-300);
        }
        .inovasi-index-icon { font-size: 2.75rem; display: block; margin-bottom: .75rem; }
        .inovasi-index-label {
          font-family: 'Playfair Display', serif;
          color: var(--blue-900);
          font-weight: 700;
          font-size: 1.05rem;
          margin-bottom: .4rem;
        }
        .inovasi-index-tagline { color: var(--gray-500); font-size: .85rem; line-height: 1.6; }
      `}</style>

      <PageHero
        title="Inovasi Sekolah"
        subtitle="Berbagai program inovasi unggulan SMP Negeri 8 Kota Probolinggo."
        breadcrumbs={[{ label: 'Inovasi' }]}
        accent="💡"
      />

      <section className="inovasi-index-section">
        <div className="container">
          <div className="inovasi-index-grid">
            {INOVASI_LIST.map((item) => (
              <Link key={item.slug} href={`/inovasi/${item.slug}`} className="inovasi-index-card">
                <span className="inovasi-index-icon">{item.icon}</span>
                <div className="inovasi-index-label">{item.label}</div>
                <p className="inovasi-index-tagline">{item.tagline}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
