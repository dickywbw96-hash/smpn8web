import Link from 'next/link'
import Image from 'next/image'
import type { Post } from '@/lib/db'
import { getImageUrl, formatDateShort, CATEGORY_LABELS } from '@/lib/db'

interface Props {
  posts: Post[]
}

const CATEGORY_BADGE_STYLE: Record<string, { bg: string; color: string }> = {
  kegiatan_umum:       { bg: '#deeafb', color: '#1345a0' },
  prestasi:            { bg: '#fdf3d6', color: '#b45309' },
  kegiatan_organisasi: { bg: '#dcfce7', color: '#15803d' },
}

function PostCard({ post, featured = false }: { post: Post; featured?: boolean }) {
  const badge = CATEGORY_BADGE_STYLE[post.category] ?? { bg: '#f3f4f6', color: '#374151' }
  const label = CATEGORY_LABELS[post.category] ?? post.category

  return (
    <Link href={`/berita/${post.slug}`} className={`news-card${featured ? ' featured' : ''}`}>
      <div className="news-img-wrap">
        <Image
          src={getImageUrl(post.featured_image_url)}
          alt={post.title}
          fill
          sizes={featured ? '(max-width:768px) 100vw, 50vw' : '(max-width:768px) 100vw, 33vw'}
          style={{ objectFit: 'cover', transition: 'transform .4s ease' }}
          className="news-img"
        />
        <span className="news-badge" style={{ background: badge.bg, color: badge.color }}>
          {label}
        </span>
      </div>
      <div className="news-body">
        <div className="news-date">{formatDateShort(post.published_at)}</div>
        <h3 className="news-title">{post.title}</h3>
        <p className="news-excerpt">{post.excerpt}</p>
        <span className="news-read-more">Baca selengkapnya →</span>
      </div>
    </Link>
  )
}

export default function BeritaSection({ posts }: Props) {
  if (!posts.length) return null

  const [featured, ...rest] = posts

  return (
    <>
      <style>{`
        .news-section {
          padding: var(--section-py) 0;
          background: white;
        }
        .news-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 2.5rem;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .news-all-link {
          display: inline-flex;
          align-items: center;
          gap: .4rem;
          color: var(--blue-600);
          text-decoration: none;
          font-weight: 700;
          font-size: .9rem;
          transition: gap .2s;
        }
        .news-all-link:hover { gap: .7rem; color: var(--blue-700); }
        .news-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr;
          gap: 1.5rem;
        }
        .news-card {
          display: flex;
          flex-direction: column;
          text-decoration: none;
          border-radius: var(--radius-lg);
          overflow: hidden;
          background: var(--white);
          box-shadow: var(--shadow-sm);
          border: 1px solid var(--gray-100);
          transition: all .25s ease;
        }
        .news-card:hover {
          box-shadow: var(--shadow-xl);
          transform: translateY(-4px);
        }
        .news-card:hover .news-img {
          transform: scale(1.04);
        }
        .news-img-wrap {
          position: relative;
          aspect-ratio: 16/9;
          overflow: hidden;
        }
        .news-card.featured .news-img-wrap {
          aspect-ratio: 4/3;
        }
        .news-badge {
          position: absolute;
          top: .75rem;
          left: .75rem;
          padding: .25rem .7rem;
          border-radius: 100px;
          font-size: .72rem;
          font-weight: 700;
          letter-spacing: .03em;
        }
        .news-body {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: .4rem;
          flex: 1;
        }
        .news-card.featured .news-body { padding: 1.5rem; }
        .news-date {
          font-size: .75rem;
          color: var(--gray-500);
          font-weight: 500;
        }
        .news-title {
          font-family: var(--font-display);
          font-size: 1rem;
          color: var(--gray-900);
          font-weight: 600;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .news-card.featured .news-title {
          font-size: 1.3rem;
          -webkit-line-clamp: 3;
        }
        .news-excerpt {
          font-size: .84rem;
          color: var(--gray-500);
          line-height: 1.65;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .news-card.featured .news-excerpt {
          -webkit-line-clamp: 3;
          font-size: .9rem;
        }
        .news-read-more {
          font-size: .8rem;
          font-weight: 700;
          color: var(--blue-600);
          margin-top: auto;
          padding-top: .75rem;
        }
        @media (max-width: 960px) {
          .news-grid { grid-template-columns: 1fr 1fr; }
          .news-card.featured { grid-column: 1 / -1; }
          .news-card.featured .news-img-wrap { aspect-ratio: 16/9; }
        }
        @media (max-width: 560px) {
          .news-grid { grid-template-columns: 1fr; }
          .news-card.featured { grid-column: auto; }
        }
      `}</style>

      <section className="news-section">
        <div className="container">
          <div className="news-header">
            <div>
              <span className="section-label">Terkini</span>
              <h2 className="section-title">Berita & Informasi</h2>
            </div>
            <Link href="/berita" className="news-all-link">
              Semua Berita →
            </Link>
          </div>

          <div className="news-grid">
            {featured && <PostCard post={featured} featured />}
            {rest.slice(0, 4).map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
