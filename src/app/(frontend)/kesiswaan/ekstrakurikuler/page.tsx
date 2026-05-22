import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import PageHero from '@/components/ui/PageHero'
import { getEkstrakurikulerList, getImageUrl } from '@/lib/payload'

export const metadata: Metadata = { title: 'Ekstrakurikuler' }
export const revalidate = 300

export default async function EkstrakurikulerPage() {
  const list = await getEkstrakurikulerList()

  return (
    <>
      <style>{`
        .ekskul-section { padding: 4rem 0; background: var(--blue-50); }
        .ekskul-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          margin-top: 2.5rem;
        }
        .ekskul-card {
          background: white;
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          border: 1px solid var(--gray-100);
          text-decoration: none;
          transition: all .25s ease;
          display: flex;
          flex-direction: column;
        }
        .ekskul-card:hover {
          box-shadow: var(--shadow-xl);
          transform: translateY(-4px);
          border-color: var(--blue-200);
        }
        .ekskul-img {
          aspect-ratio: 16/9;
          position: relative;
          overflow: hidden;
          background: var(--blue-100);
        }
        .ekskul-img-placeholder {
          width: 100%; height: 100%;
          display: flex; align-items: center; justify-content: center;
          background: linear-gradient(135deg, var(--blue-100), var(--blue-200));
          font-size: 3rem;
        }
        .ekskul-body {
          padding: 1.25rem;
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .ekskul-name {
          font-weight: 800;
          color: var(--blue-900);
          font-size: 1rem;
          margin-bottom: .3rem;
          font-family: 'Playfair Display', serif;
        }
        .ekskul-pembina {
          font-size: .8rem;
          color: var(--gray-500);
          margin-bottom: .75rem;
        }
        .ekskul-link {
          margin-top: auto;
          font-size: .8rem;
          font-weight: 700;
          color: var(--blue-600);
        }
        .empty-state {
          text-align: center; padding: 4rem 2rem;
          color: var(--gray-500);
          background: white;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-sm);
        }
        @media (max-width: 900px) { .ekskul-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 560px) { .ekskul-grid { grid-template-columns: 1fr; } }
      `}</style>

      <PageHero
        title="Ekstrakurikuler"
        subtitle="Berbagai kegiatan pengembangan bakat dan minat siswa di luar jam pelajaran."
        breadcrumbs={[{ label: 'Kesiswaan' }, { label: 'Ekstrakurikuler' }]}
        accent="⭐"
      />

      <section className="ekskul-section">
        <div className="container">
          <span className="section-label">Kegiatan Siswa</span>
          <h2 className="section-title">Daftar Ekstrakurikuler</h2>
          <p className="section-subtitle">Temukan ekstrakurikuler yang sesuai dengan minat dan bakatmu.</p>

          {list.length === 0 ? (
            <div className="empty-state" style={{ marginTop: '2rem' }}>
              <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>⭐</span>
              <p>Belum ada data ekstrakurikuler. Data akan ditampilkan setelah diisi oleh administrator.</p>
            </div>
          ) : (
            <div className="ekskul-grid">
              {list.map((ekskul) => (
                <Link key={ekskul.id} href={`/kesiswaan/ekstrakurikuler/${ekskul.slug}`} className="ekskul-card">
                  <div className="ekskul-img">
                    {ekskul.gallery?.[0]?.image ? (
                      <Image
                        src={getImageUrl(ekskul.gallery[0].image)}
                        alt={ekskul.name}
                        fill
                        sizes="33vw"
                        style={{ objectFit: 'cover', transition: 'transform .4s' }}
                      />
                    ) : (
                      <div className="ekskul-img-placeholder">🎯</div>
                    )}
                  </div>
                  <div className="ekskul-body">
                    <div className="ekskul-name">{ekskul.name}</div>
                    <div className="ekskul-pembina">👩‍🏫 Pembina: {ekskul.pembina}</div>
                    <span className="ekskul-link">Lihat Detail →</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
