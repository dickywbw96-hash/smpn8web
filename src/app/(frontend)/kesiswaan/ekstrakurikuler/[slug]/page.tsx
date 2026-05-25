import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import PageHero from '@/components/ui/PageHero'
import { getEkstrakurikulerBySlug, getEkstrakurikulerList, getImageUrl } from '@/lib/db'

export const revalidate = 300

export async function generateStaticParams() {
  const list = await getEkstrakurikulerList()
  return list.map((e) => ({ slug: e.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const ekskul = await getEkstrakurikulerBySlug(slug)
  return { title: ekskul?.name ?? 'Ekstrakurikuler' }
}

export default async function EkstrakurikulerDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const ekskul = await getEkstrakurikulerBySlug(slug)
  if (!ekskul) notFound()

  return (
    <>
      <style>{`
        .ekskul-detail { padding: 4rem 0; }
        .ekskul-detail-grid {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 3rem;
          align-items: start;
        }
        .ekskul-info-card {
          background: white;
          border-radius: var(--radius-lg);
          padding: 2rem;
          box-shadow: var(--shadow-md);
          border: 1px solid var(--gray-100);
          position: sticky;
          top: 100px;
        }
        .ekskul-cover {
          aspect-ratio: 4/3;
          border-radius: var(--radius-md);
          overflow: hidden;
          position: relative;
          background: var(--blue-100);
          margin-bottom: 1.5rem;
        }
        .ekskul-meta-row {
          display: flex; align-items: center; gap: .75rem;
          padding: .75rem 0;
          border-bottom: 1px solid var(--gray-100);
          font-size: .875rem;
        }
        .ekskul-meta-row:last-child { border-bottom: none; }
        .ekskul-meta-label { color: var(--gray-500); min-width: 80px; }
        .ekskul-meta-val { color: var(--gray-900); font-weight: 600; }
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: .75rem;
          margin-top: 1.5rem;
        }
        .gallery-item {
          aspect-ratio: 1;
          border-radius: var(--radius-md);
          overflow: hidden;
          position: relative;
          background: var(--blue-50);
          cursor: pointer;
        }
        .gallery-item img { object-fit: cover; transition: transform .3s; }
        .gallery-item:hover img { transform: scale(1.06); }
        @media (max-width: 768px) {
          .ekskul-detail-grid { grid-template-columns: 1fr; }
          .ekskul-info-card { position: static; }
        }
      `}</style>

      <PageHero
        title={ekskul.name}
        subtitle={`Pembina: ${ekskul.pembina}`}
        breadcrumbs={[
          { label: 'Kesiswaan' },
          { label: 'Ekstrakurikuler', href: '/kesiswaan/ekstrakurikuler' },
          { label: ekskul.name },
        ]}
      />

      <section className="ekskul-detail">
        <div className="container">
          <div className="ekskul-detail-grid">
            {/* Info Card */}
            <div className="ekskul-info-card">
              {ekskul.cover_image_url && (
  <div className="ekskul-cover">
    <Image
      src={getImageUrl(ekskul.cover_image_url)}
                    alt={ekskul.name}
                    fill
                    sizes="400px"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              )}
              <div className="ekskul-meta-row">
                <span className="ekskul-meta-label">Pembina</span>
                <span className="ekskul-meta-val">{ekskul.pembina}</span>
              </div>
              <div className="ekskul-meta-row">
                <span className="ekskul-meta-label">Status</span>
                <span style={{ background: 'var(--blue-100)', color: 'var(--blue-700)', padding: '.2rem .7rem', borderRadius: '100px', fontSize: '.75rem', fontWeight: 700 }}>
                  {ekskul.is_active ? 'Aktif' : 'Tidak Aktif'}
                </span>
              </div>
            </div>

            {/* Konten */}
            <div>
              <span className="section-label">Tentang Ekskul</span>
              <h2 className="section-title" style={{ marginBottom: '1.5rem' }}>{ekskul.name}</h2>

              <div className="prose" style={{ marginBottom: '2.5rem' }}>
                <p style={{ color: 'var(--gray-500)', fontStyle: 'italic' }}>
                  Deskripsi kegiatan ekstrakurikuler {ekskul.name} akan ditampilkan di sini.
                </p>
              </div>

              {ekskul.gallery && ekskul.gallery.length > 0 && (
                <>
                  <h3 style={{ fontFamily: 'Playfair Display,serif', color: 'var(--blue-900)', marginBottom: '1rem', fontSize: '1.2rem' }}>
                    Galeri Foto
                  </h3>
                  <div className="gallery-grid">
                    {ekskul.gallery.map((g: any, i: number) => (
                      <div key={i} className="gallery-item">
                        <Image src={getImageUrl(g.image)} alt={g.caption ?? `Foto ${i + 1}`} fill sizes="200px" />
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}