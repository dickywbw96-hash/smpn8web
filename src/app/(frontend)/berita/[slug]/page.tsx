import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPostBySlug, getPosts, getImageUrl, formatDate, CATEGORY_LABELS } from '@/lib/payload'

export const revalidate = 60

export async function generateStaticParams() {
  const { docs } = await getPosts({ limit: 50 })
  return docs.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPostBySlug(params.slug)
  if (!post) return { title: 'Berita tidak ditemukan' }
  return {
    title: post.seo?.metaTitle ?? post.title,
    description: post.seo?.metaDescription ?? post.excerpt,
    openGraph: {
      images: post.featuredImage ? [getImageUrl(post.featuredImage)] : [],
    },
  }
}

const BADGE_STYLE: Record<string, { bg: string; color: string }> = {
  kegiatan_umum:       { bg: '#deeafb', color: '#1345a0' },
  prestasi:            { bg: '#fdf3d6', color: '#b45309' },
  kegiatan_organisasi: { bg: '#dcfce7', color: '#15803d' },
}

export default async function BeritaDetailPage({ params }: { params: { slug: string } }) {
  const [post, { docs: relatedPosts }] = await Promise.all([
    getPostBySlug(params.slug),
    getPosts({ category: undefined, limit: 4 }),
  ])

  if (!post) notFound()

  const badge = BADGE_STYLE[post.category] ?? { bg: '#f3f4f6', color: '#374151' }
  const catLabel = CATEGORY_LABELS[post.category] ?? post.category
  const related = relatedPosts.filter((p) => p.slug !== post.slug).slice(0, 3)

  return (
    <>
      <style>{`
        /* Spacer for fixed navbar + ticker */
        .article-spacer { height: 120px; }

        .article-hero {
          position: relative;
          height: 480px;
          overflow: hidden;
          background: var(--blue-950);
        }
        .article-hero-img { object-fit: cover; transition: none; }
        .article-hero-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(180deg, rgba(3,15,43,.3) 0%, rgba(3,15,43,.85) 100%);
        }
        .article-hero-content {
          position: absolute; inset: 0;
          display: flex; flex-direction: column;
          justify-content: flex-end;
          padding-bottom: 3rem;
        }
        .article-breadcrumb {
          display: flex; align-items: center; gap: .5rem;
          font-size: .78rem; color: rgba(255,255,255,.6);
          margin-bottom: .75rem; flex-wrap: wrap;
        }
        .article-breadcrumb a { color: rgba(255,255,255,.6); text-decoration: none; }
        .article-breadcrumb a:hover { color: white; }
        .article-badge {
          padding: .25rem .8rem;
          border-radius: 100px;
          font-size: .72rem; font-weight: 700;
          display: inline-block;
          margin-bottom: .75rem;
        }
        .article-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.5rem, 3.5vw, 2.5rem);
          color: white; font-weight: 700;
          line-height: 1.3;
          max-width: 800px;
          text-shadow: 0 2px 12px rgba(0,0,0,.3);
        }
        .article-meta {
          display: flex; align-items: center; gap: 1.25rem;
          margin-top: .75rem; flex-wrap: wrap;
        }
        .article-meta span { font-size: .8rem; color: rgba(255,255,255,.65); }

        /* Body layout */
        .article-body { padding: 3rem 0 4rem; }
        .article-layout {
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 3rem;
          align-items: start;
        }
        /* Article content */
        .article-content .prose { font-size: 1.05rem; line-height: 1.85; color: var(--gray-700); }
        .article-excerpt-box {
          background: var(--blue-50);
          border-left: 5px solid var(--blue-400);
          border-radius: 0 var(--radius-md) var(--radius-md) 0;
          padding: 1.25rem 1.5rem;
          margin-bottom: 2rem;
          font-style: italic;
          color: var(--gray-600);
          font-size: 1.05rem;
          line-height: 1.75;
        }
        /* Tags */
        .article-tags {
          display: flex; gap: .5rem; flex-wrap: wrap;
          margin-top: 2.5rem; padding-top: 1.5rem;
          border-top: 1px solid var(--gray-100);
        }
        .article-tag {
          background: var(--gray-100); color: var(--gray-600);
          padding: .3rem .8rem; border-radius: 100px;
          font-size: .75rem; font-weight: 600;
        }
        /* Gallery */
        .article-gallery { margin-top: 2.5rem; }
        .article-gallery h3 { font-family: 'Playfair Display',serif; color: var(--blue-900); font-size: 1.2rem; margin-bottom: 1rem; }
        .article-gallery-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: .75rem;
        }
        .article-gallery-item {
          aspect-ratio: 4/3; border-radius: var(--radius-md);
          overflow: hidden; position: relative; cursor: pointer;
        }
        .article-gallery-item img { object-fit: cover; transition: transform .3s; }
        .article-gallery-item:hover img { transform: scale(1.06); }
        /* Sidebar */
        .article-sidebar { position: sticky; top: 100px; }
        .sidebar-card {
          background: white; border-radius: var(--radius-lg);
          padding: 1.5rem; box-shadow: var(--shadow-md);
          border: 1px solid var(--gray-100);
          margin-bottom: 1.5rem;
        }
        .sidebar-title {
          font-weight: 800; color: var(--blue-900);
          font-size: .85rem; letter-spacing: .05em;
          text-transform: uppercase; margin-bottom: 1rem;
          padding-bottom: .5rem; border-bottom: 2px solid var(--blue-100);
        }
        .sidebar-related { display: flex; flex-direction: column; gap: 1rem; }
        .sidebar-post {
          display: flex; gap: .75rem;
          text-decoration: none;
          transition: opacity .2s;
        }
        .sidebar-post:hover { opacity: .8; }
        .sidebar-post-img {
          flex-shrink: 0; width: 64px; height: 64px;
          border-radius: var(--radius-sm); overflow: hidden;
          position: relative; background: var(--blue-50);
        }
        .sidebar-post-title {
          font-size: .82rem; color: var(--gray-900);
          font-weight: 600; line-height: 1.4;
          display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
        }
        .sidebar-post-date { font-size: .72rem; color: var(--gray-400); margin-top: .2rem; }
        .share-btns { display: flex; gap: .5rem; flex-wrap: wrap; }
        .share-btn {
          flex: 1; min-width: 80px;
          padding: .55rem .75rem; border-radius: var(--radius-sm);
          font-size: .78rem; font-weight: 700; text-decoration: none;
          text-align: center; transition: opacity .2s;
        }
        .share-btn:hover { opacity: .85; }
        @media (max-width: 900px) {
          .article-layout { grid-template-columns: 1fr; }
          .article-sidebar { position: static; }
          .article-gallery-grid { grid-template-columns: repeat(2,1fr); }
        }
      `}</style>

      <div className="article-spacer" />

      {/* Hero */}
      <div className="article-hero">
        <Image src={getImageUrl(post.featuredImage)} alt={post.title} fill className="article-hero-img" priority sizes="100vw" />
        <div className="article-hero-overlay" />
        <div className="article-hero-content">
          <div className="container">
            <div className="article-breadcrumb">
              <Link href="/">Beranda</Link>
              <span>›</span>
              <Link href="/berita">Berita</Link>
              <span>›</span>
              <span>{CATEGORY_LABELS[post.category]}</span>
            </div>
            <span className="article-badge" style={{ background: badge.bg, color: badge.color }}>{catLabel}</span>
            <h1 className="article-title">{post.title}</h1>
            <div className="article-meta">
              <span>📅 {formatDate(post.publishedAt)}</span>
              {post.author && typeof post.author === 'object' && (post.author as any).name && (
                <span>✍️ {(post.author as any).name}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <section className="article-body" style={{ background: 'var(--blue-50)' }}>
        <div className="container">
          <div className="article-layout">
            {/* Content */}
            <div className="article-content">
              <div className="article-excerpt-box">{post.excerpt}</div>

              {/* Rich text — untuk production, gunakan @payloadcms/richtext-lexical RichText component */}
              <div className="prose">
                <p style={{ color: 'var(--gray-500)', fontStyle: 'italic' }}>
                  Konten berita ditampilkan di sini menggunakan RichText renderer dari Payload CMS.
                  Pastikan menginstall <code>@payloadcms/richtext-lexical</code> dan menggunakan komponen{' '}
                  <code>RichText</code> untuk merender konten.
                </p>
              </div>

              {/* Galeri */}
              {post.gallery && post.gallery.length > 0 && (
                <div className="article-gallery">
                  <h3>📸 Galeri Foto</h3>
                  <div className="article-gallery-grid">
                    {post.gallery.map((g, i) => (
                      <div key={i} className="article-gallery-item">
                        <Image src={getImageUrl(g.image)} alt={g.caption ?? `Foto ${i + 1}`} fill sizes="200px" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="article-tags">
                  <span style={{ fontSize: '.78rem', color: 'var(--gray-400)', fontWeight: 600 }}>Tags:</span>
                  {post.tags.map((t, i) => (
                    <span key={i} className="article-tag">#{t.tag}</span>
                  ))}
                </div>
              )}

              {/* Back link */}
              <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--gray-100)' }}>
                <Link href="/berita" style={{ display: 'inline-flex', alignItems: 'center', gap: '.5rem', color: 'var(--blue-600)', fontWeight: 700, textDecoration: 'none', fontSize: '.9rem' }}>
                  ← Kembali ke Daftar Berita
                </Link>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="article-sidebar">
              {/* Share */}
              <div className="sidebar-card">
                <div className="sidebar-title">Bagikan</div>
                <div className="share-btns">
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(process.env.NEXT_PUBLIC_SERVER_URL + '/berita/' + post.slug)}`}
                    target="_blank" rel="noopener"
                    className="share-btn"
                    style={{ background: '#1877f2', color: 'white' }}
                  >
                    Facebook
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(process.env.NEXT_PUBLIC_SERVER_URL + '/berita/' + post.slug)}`}
                    target="_blank" rel="noopener"
                    className="share-btn"
                    style={{ background: '#1da1f2', color: 'white' }}
                  >
                    Twitter
                  </a>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(post.title + ' ' + process.env.NEXT_PUBLIC_SERVER_URL + '/berita/' + post.slug)}`}
                    target="_blank" rel="noopener"
                    className="share-btn"
                    style={{ background: '#25d366', color: 'white' }}
                  >
                    WhatsApp
                  </a>
                </div>
              </div>

              {/* Related posts */}
              {related.length > 0 && (
                <div className="sidebar-card">
                  <div className="sidebar-title">Berita Lainnya</div>
                  <div className="sidebar-related">
                    {related.map((p) => (
                      <Link key={p.id} href={`/berita/${p.slug}`} className="sidebar-post">
                        <div className="sidebar-post-img">
                          <Image src={getImageUrl(p.featuredImage)} alt={p.title} fill sizes="64px" style={{ objectFit: 'cover' }} />
                        </div>
                        <div>
                          <div className="sidebar-post-title">{p.title}</div>
                          <div className="sidebar-post-date">{formatDate(p.publishedAt)}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>
    </>
  )
}
