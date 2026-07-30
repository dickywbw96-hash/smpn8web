import type { Metadata } from 'next'
import PageHero from '@/components/ui/PageHero'

// Halaman ini sengaja TIDAK dimunculkan di menu navbar.
// Diakses langsung lewat URL: smpn8prob.sch.id/jurnalistik
// TODO: nanti dihubungkan ke halaman admin untuk pengisian konten.

export const metadata: Metadata = { title: 'Jurnalistik' }

export default function JurnalistikPage() {
  return (
    <>
      <style>{`
        .jurnalistik-section { padding: 5rem 0; background: var(--blue-50); text-align: center; }
        .jurnalistik-card {
          max-width: 560px; margin: 0 auto;
          background: white; border-radius: var(--radius-xl);
          padding: 3rem; box-shadow: var(--shadow-xl);
          border: 1px solid var(--gray-100);
        }
        .jurnalistik-icon { font-size: 4rem; display: block; margin-bottom: 1.25rem; }
        .jurnalistik-badge {
          display: inline-block;
          background: var(--blue-100); color: var(--blue-700);
          font-weight: 700; font-size: .75rem; letter-spacing: .08em; text-transform: uppercase;
          padding: .4rem 1rem; border-radius: 100px; margin-bottom: 1rem;
        }
        .jurnalistik-title { font-family: 'Playfair Display', serif; color: var(--blue-900); font-size: 1.85rem; margin-bottom: .75rem; font-weight: 700; }
        .jurnalistik-desc { color: var(--gray-500); line-height: 1.75; }
      `}</style>

      <PageHero
        title="Jurnalistik"
        subtitle="Ruang karya jurnalistik siswa SMP Negeri 8 Kota Probolinggo."
        breadcrumbs={[{ label: 'Jurnalistik' }]}
        accent="📰"
      />

      <section className="jurnalistik-section">
        <div className="container">
          <div className="jurnalistik-card">
            <span className="jurnalistik-icon">🛠️</span>
            <span className="jurnalistik-badge">Coming Soon</span>
            <h2 className="jurnalistik-title">Segera Hadir</h2>
            <p className="jurnalistik-desc">
              Halaman Jurnalistik SMP Negeri 8 Kota Probolinggo sedang dalam
              tahap pengembangan. Nantikan karya-karya jurnalistik siswa
              segera tayang di sini.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
