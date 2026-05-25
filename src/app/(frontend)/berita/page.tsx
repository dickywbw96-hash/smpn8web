import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import PageHero from '@/components/ui/PageHero'
import { getPosts, getImageUrl, formatDateShort, CATEGORY_LABELS } from '@/lib/db'

export const metadata: Metadata = { title: 'Berita' }
export const revalidate = 60

const CATEGORIES = [
  { slug: '', label: 'Semua Berita', href: '/berita', icon: '📰' },
  { slug: 'kegiatan_umum', label: 'Kegiatan Umum', href: '/berita/kegiatan-umum', icon: '🗓️' },
  { slug: 'prestasi', label: 'Prestasi', href: '/berita/prestasi', icon: '🏆' },
  { slug: 'kegiatan_organisasi', label: 'Kegiatan Organisasi', href: '/berita/kegiatan-organisasi', icon: '🎯' },
  { slug: 'artikel', label: 'Artikel', href: '/berita/artikel', icon: '✍️' }, // ← tambah
]

const BADGE_STYLE: Record<string, { bg: string; color: string }> = {
  kegiatan_umum:       { bg: '#deeafb', color: '#1345a0' },
  prestasi:            { bg: '#fdf3d6', color: '#b45309' },
  kegiatan_organisasi: { bg: '#dcfce7', color: '#15803d' },
  artikel:             { bg: '#f3e8ff', color: '#7c3aed' }, // ← tambah
}

export default async function BeritaPage() {
  const { docs: posts, totalDocs } = await getPosts({ limit: 12 })

  return (
    <>
      <style>{`
        .berita-section { padding: 4rem 0; background: var(--blue-50); }
        .berita-cat-tabs {
          display: flex; gap: .5rem; flex-wrap: wrap;
          margin-bottom: 2.5rem;
        }
        .berita-cat-tab {
          display: inline-flex; align-items: center; gap: .4rem;
          padding: .55rem 1.1rem;
          border-radius: 100px;
          font-size: .82rem; font-weight: 700;
          text-decoration: none;
          border: 2px solid var(--gray-200);
          color: var(--gray-600);
          background: white;
          transition: all .2s ease;
        }
        .berita-cat-tab:hover, .berita-cat-tab.active {
          background: var(--blue-700);
          color: white;
          border-color: var(--blue-700);
        }
        .berita-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }
        .berita-card {
          background: white;
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          border: 1px solid var(--gray-100);
          text-decoration: none;
          display: flex; flex-direction: column;
          transition: all .25s ease;
        }
        .berita-card:hover {
          box-shadow: var(--shadow-xl);
          transform: translateY(-4px);
        }
        .berita-card:hover .bc-img { transform: scale(1.04); }
        .bc-img-wrap { aspect-ratio: 16/9; overflow: hidden; position: relative; }
        .bc-img { object-fit: cover; transition: transform .4s; }
        .bc-badge {
          position: absolute; top: .6rem; left: .6rem;
          padding: .2rem .65rem; border-radius: 100px;
          font-size: .7rem; font-weight: 700;
        }
        .bc-body { padding: 1.1rem; flex: 1; display: flex; flex-direction: column; gap: .35rem; }
        .bc-date { font-size: .72rem; color: var(--gray-400); font-weight: 500; }
        .bc-title {
          font-family: 'Playfair Display', serif;
          color: var(--gray-900); font-size: .95rem; font-weight: 600;
          line-height: 1.4;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
        }
        .bc-excerpt {
          font-size: .8rem; color: var(--gray-500); line-height: 1.6;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
        }
        .bc-more { font-size: .78rem; font-weight: 700; color: var(--blue-600); margin-top: auto; padding-top: .6rem; }
        .empty-state { text-align: center; padding: 4rem; color: var(--gray-500); background: white; border-radius: var(--radius-lg); }
        @media (max-width: 900px) { .berita-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 560px) { .berita-grid { grid-template-columns: 1fr; } }
      `}</style>

      <PageHero
        title="Berita & Informasi"
        subtitle={`${totalDocs} berita tersedia dari berbagai kategori kegiatan sekolah.`}
        breadcrumbs={[{ label: 'Berita' }]}
        accent="📰"
      />

      <section className="berita-section">
        <div className="container">
          {/* Category tabs */}
          <div className="berita-cat-tabs">
            {CATEGORIES.map((c) => (
              <Link key={c.href} href={c.href} className={`berita-cat-tab${c.slug === '' ? ' active' : ''}`}>
                {c.icon} {c.label}
              </Link>
            ))}
          </div>

          {posts.length === 0 ? (
            <div className="empty-state">
              <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>📰</span>
              <p>Belum ada berita yang dipublikasikan.</p>
            </div>
          ) : (
            <div className="berita-grid">
              {posts.map((post) => {
                const badge = BADGE_STYLE[post.category] ?? { bg: '#f3f4f6', color: '#374151' }
                return (
                  <Link key={post.id} href={`/berita/${post.slug}`} className="berita-card">
                    <div className="bc-img-wrap">
                      <Image
                        src={getImageUrl(post.featured_image_url)}
                        alt={post.title}
                        fill sizes="(max-width:900px) 50vw, 33vw"
                        className="bc-img"
                      />
                      <span className="bc-badge" style={{ background: badge.bg, color: badge.color }}>
                        {CATEGORY_LABELS[post.category]}
                      </span>
                    </div>
                    <div className="bc-body">
                      <div className="bc-date">{formatDateShort(post.published_at)}</div>
                      <h3 className="bc-title">{post.title}</h3>
                      <p className="bc-excerpt">{post.excerpt}</p>
                      <span className="bc-more">Baca selengkapnya →</span>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
