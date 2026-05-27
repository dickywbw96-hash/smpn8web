import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPostBySlug, getPosts, getImageUrl, formatDate, CATEGORY_LABELS } from '@/lib/db'

export const revalidate = 60

export async function generateStaticParams() {
  const { docs } = await getPosts({ limit: 50 })
  return docs.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return { title: 'Berita tidak ditemukan' }
  return {
    title: post.seo_meta_title ?? post.title,
    description: post.seo_meta_description ?? post.excerpt,
    openGraph: {
      images: post.featured_image_url ? [getImageUrl(post.featured_image_url)] : [],
    },
  }
}

const BADGE_STYLE: Record<string, { bg: string; color: string }> = {
  kegiatan_umum:       { bg: '#deeafb', color: '#1345a0' },
  prestasi:            { bg: '#fdf3d6', color: '#b45309' },
  kegiatan_organisasi: { bg: '#dcfce7', color: '#15803d' },
  artikel:             { bg: '#f3e8ff', color: '#7c3aed' },
}

/**
 * Konversi plain text (dengan newline) ke HTML paragraf.
 * Jika konten sudah HTML (mengandung tag), langsung kembalikan apa adanya.
 */
function formatContent(content: string): string {
  if (!content) return ''

  // Jika sudah HTML, kembalikan langsung
  if (/<[a-z][\s\S]*>/i.test(content)) return content

  // Plain text: split per baris kosong (paragraf), wrap tiap paragraf ke <p>
  return content
    .split(/\n{2,}/)
    .map((para) =>
      `<p>${para
        .split(/\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .join('<br />')}</p>`
    )
    .filter((p) => p !== '<p></p>')
    .join('\n')
}

export default async function BeritaDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [post, { docs: relatedPosts }] = await Promise.all([
    getPostBySlug(slug),
    getPosts({ category: undefined, limit: 4 }),
  ])

  if (!post) notFound()

  const badge = BADGE_STYLE[post.category] ?? { bg: '#f3f4f6', color: '#374151' }
  const catLabel = CATEGORY_LABELS[post.category] ?? post.category
  const related = relatedPosts.filter((p) => p.slug !== post.slug).slice(0, 3)
  const heroImg = getImageUrl(post.featured_image_url)

  // Proses konten: gunakan content_html jika ada, fallback ke content (plain text)
  const rawContent = post.content_html || (post as any).content || ''
  const processedContent = formatContent(rawContent)

  return (
    <>
      <style>{`
        /* ── Spacer ── */
        .article-spacer { height: 120px; }

        /* ── Hero ── */
        .article-hero {
          position: relative; height: 480px;
          overflow: hidden; background: var(--blue-950);
        }
        .article-hero-img { object-fit: cover; transition: none; }
        .article-hero-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(180deg, rgba(3,15,43,.3) 0%, rgba(3,15,43,.85) 100%);
        }
        .article-hero-content {
          position: absolute; inset: 0;
          display: flex; flex-direction: column;
          justify-content: flex-end; padding-bottom: 3rem;
        }
        .article-hero-fallback {
          width: 100%; height: 100%;
          background: linear-gradient(135deg, #0d2a6e 0%, #1a4db5 50%, #0d2a6e 100%);
          display: flex; align-items: center; justify-content: center;
        }
        .article-breadcrumb {
          display: flex; align-items: center; gap: .5rem;
          font-size: .78rem; color: rgba(255,255,255,.6);
          margin-bottom: .75rem; flex-wrap: wrap;
        }
        .article-breadcrumb a { color: rgba(255,255,255,.6); text-decoration: none; }
        .article-breadcrumb a:hover { color: white; }
        .article-badge {
          padding: .25rem .8rem; border-radius: 100px;
          font-size: .72rem; font-weight: 700;
          display: inline-block; margin-bottom: .75rem;
        }
        .article-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.5rem, 3.5vw, 2.5rem);
          color: white; font-weight: 700; line-height: 1.3;
          max-width: 800px; text-shadow: 0 2px 12px rgba(0,0,0,.3);
        }
        .article-meta {
          display: flex; align-items: center; gap: 1.25rem;
          margin-top: .75rem; flex-wrap: wrap;
        }
        .article-meta span { font-size: .8rem; color: rgba(255,255,255,.65); }

        /* ── Body layout ── */
        .article-body { padding: 3rem 0 4rem; }
        .article-layout {
          display: grid; grid-template-columns: 1fr 300px;
          gap: 3rem; align-items: start;
        }

        /* ══════════════════════════════════════
           PROSE — styling konten artikel
        ══════════════════════════════════════ */
        .article-content .prose {
          font-size: 1.05rem;
          line-height: 1.9;
          color: var(--gray-700, #374151);
          word-break: break-word;

          /* Rata kanan-kiri */
          text-align: justify;
          text-justify: inter-word;

          /* Hyphenation otomatis supaya justify tidak aneh */
          hyphens: auto;
          -webkit-hyphens: auto;
          overflow-wrap: break-word;
        }

        /* ── Paragraf ── */
        .article-content .prose p {
          margin-top: 0;
          margin-bottom: 1.6rem;   /* jarak antar paragraf */
        }
        .article-content .prose p:last-child { margin-bottom: 0; }

        /* ── Headings ── */
        .article-content .prose h1,
        .article-content .prose h2,
        .article-content .prose h3,
        .article-content .prose h4,
        .article-content .prose h5,
        .article-content .prose h6 {
          font-family: 'Playfair Display', serif;
          color: var(--blue-900, #0c2461);
          font-weight: 700;
          line-height: 1.35;
          margin-top: 2.25rem;
          margin-bottom: .85rem;
          text-align: left;  /* heading tetap left-align */
        }
        .article-content .prose h1 { font-size: 1.9rem; }
        .article-content .prose h2 { font-size: 1.55rem; }
        .article-content .prose h3 { font-size: 1.3rem; }
        .article-content .prose h4 { font-size: 1.1rem; }
        .article-content .prose h5,
        .article-content .prose h6 { font-size: 1rem; }

        /* ── List ── */
        .article-content .prose ul,
        .article-content .prose ol {
          padding-left: 1.75rem;
          margin-bottom: 1.6rem;
          text-align: left;  /* list tetap left-align supaya terlihat rapi */
        }
        .article-content .prose ul { list-style: disc; }
        .article-content .prose ol { list-style: decimal; }
        .article-content .prose li {
          margin-bottom: .55rem;
          line-height: 1.8;
        }
        .article-content .prose li > ul,
        .article-content .prose li > ol {
          margin-top: .4rem;
          margin-bottom: .4rem;
        }

        /* ── Inline ── */
        .article-content .prose strong,
        .article-content .prose b {
          font-weight: 700;
          color: var(--gray-900, #111827);
        }
        .article-content .prose em,
        .article-content .prose i { font-style: italic; }
        .article-content .prose u { text-decoration: underline; }
        .article-content .prose s { text-decoration: line-through; }

        /* ── Link ── */
        .article-content .prose a {
          color: var(--blue-600, #2563eb);
          text-decoration: underline;
          text-underline-offset: 3px;
          transition: color .2s;
        }
        .article-content .prose a:hover { color: var(--blue-800, #1e40af); }

        /* ── Blockquote ── */
        .article-content .prose blockquote {
          border-left: 4px solid var(--blue-300, #93c5fd);
          padding: .9rem 1.35rem;
          margin: 1.75rem 0;
          background: #eff6ff;
          color: var(--gray-600, #4b5563);
          font-style: italic;
          border-radius: 0 var(--radius-sm, 6px) var(--radius-sm, 6px) 0;
          text-align: left;
        }
        .article-content .prose blockquote p { margin-bottom: 0; }

        /* ── Kode ── */
        .article-content .prose code {
          background: #f1f5f9;
          color: #be185d;
          padding: .15rem .4rem;
          border-radius: 4px;
          font-size: .9em;
          font-family: 'Courier New', monospace;
        }
        .article-content .prose pre {
          background: #1e293b;
          color: #e2e8f0;
          padding: 1.25rem 1.5rem;
          border-radius: var(--radius-md, 8px);
          overflow-x: auto;
          margin-bottom: 1.6rem;
          font-size: .88rem;
          line-height: 1.7;
          text-align: left;
        }
        .article-content .prose pre code {
          background: none;
          color: inherit;
          padding: 0;
          font-size: inherit;
        }

        /* ── Gambar di dalam konten ── */
        .article-content .prose img {
          max-width: 100%;
          height: auto;
          border-radius: var(--radius-md, 8px);
          margin: 1.75rem auto;
          display: block;
          box-shadow: 0 4px 16px rgba(0,0,0,.08);
        }

        /* ── Tabel ── */
        .article-content .prose table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 1.75rem;
          font-size: .95rem;
          border-radius: var(--radius-md, 8px);
          overflow: hidden;
          text-align: left;
        }
        .article-content .prose th,
        .article-content .prose td {
          padding: .7rem 1rem;
          border: 1px solid #e2e8f0;
          text-align: left;
          vertical-align: top;
        }
        .article-content .prose th {
          background: #eff6ff;
          font-weight: 700;
          color: var(--blue-900, #0c2461);
        }
        .article-content .prose tr:nth-child(even) td {
          background: #f8fafc;
        }

        /* ── HR ── */
        .article-content .prose hr {
          border: none;
          border-top: 1px solid #e2e8f0;
          margin: 2.5rem 0;
        }

        /* ── Iframe / video embed ── */
        .article-content .prose iframe {
          max-width: 100%;
          border-radius: var(--radius-md, 8px);
          margin: 1.75rem 0;
          display: block;
        }

        /* ── Excerpt box ── */
        .article-excerpt-box {
          background: var(--blue-50, #eff6ff);
          border-left: 5px solid var(--blue-400, #60a5fa);
          border-radius: 0 var(--radius-md, 8px) var(--radius-md, 8px) 0;
          padding: 1.25rem 1.5rem; margin-bottom: 2rem;
          font-style: italic; color: var(--gray-600, #4b5563);
          font-size: 1.05rem; line-height: 1.8;
          text-align: justify;
          text-justify: inter-word;
        }

        /* ── Tags ── */
        .article-tags {
          display: flex; gap: .5rem; flex-wrap: wrap;
          margin-top: 2.5rem; padding-top: 1.5rem;
          border-top: 1px solid var(--gray-100, #f3f4f6);
        }
        .article-tag {
          background: var(--gray-100, #f3f4f6);
          color: var(--gray-600, #4b5563);
          padding: .3rem .8rem; border-radius: 100px;
          font-size: .75rem; font-weight: 600;
        }

        /* ── Gallery ── */
        .article-gallery { margin-top: 2.5rem; }
        .article-gallery h3 {
          font-family: 'Playfair Display', serif;
          color: var(--blue-900); font-size: 1.2rem; margin-bottom: 1rem;
        }
        .article-gallery-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: .75rem;
        }
        .article-gallery-item {
          aspect-ratio: 4/3; border-radius: var(--radius-md, 8px);
          overflow: hidden; position: relative; cursor: pointer;
        }
        .article-gallery-item img { object-fit: cover; transition: transform .3s; }
        .article-gallery-item:hover img { transform: scale(1.06); }

        /* ── Sidebar ── */
        .article-sidebar { position: sticky; top: 100px; }
        .sidebar-card {
          background: white; border-radius: var(--radius-lg, 12px);
          padding: 1.5rem; box-shadow: var(--shadow-md);
          border: 1px solid var(--gray-100, #f3f4f6); margin-bottom: 1.5rem;
        }
        .sidebar-title {
          font-weight: 800; color: var(--blue-900, #0c2461);
          font-size: .85rem; letter-spacing: .05em;
          text-transform: uppercase; margin-bottom: 1rem;
          padding-bottom: .5rem; border-bottom: 2px solid var(--blue-100, #dbeafe);
        }
        .sidebar-related { display: flex; flex-direction: column; gap: 1rem; }
        .sidebar-post {
          display: flex; gap: .75rem; text-decoration: none; transition: opacity .2s;
        }
        .sidebar-post:hover { opacity: .8; }
        .sidebar-post-img {
          flex-shrink: 0; width: 64px; height: 64px;
          border-radius: var(--radius-sm, 6px); overflow: hidden;
          position: relative; background: var(--blue-50, #eff6ff);
        }
        .sidebar-post-title {
          font-size: .82rem; color: var(--gray-900, #111827);
          font-weight: 600; line-height: 1.4;
          display: -webkit-box; -webkit-line-clamp: 3;
          -webkit-box-orient: vertical; overflow: hidden;
        }
        .sidebar-post-date { font-size: .72rem; color: var(--gray-400, #9ca3af); margin-top: .2rem; }
        .share-btns { display: flex; gap: .5rem; flex-wrap: wrap; }
        .share-btn {
          flex: 1; min-width: 80px; padding: .55rem .75rem;
          border-radius: var(--radius-sm, 6px); font-size: .78rem; font-weight: 700;
          text-decoration: none; text-align: center; transition: opacity .2s;
        }
        .share-btn:hover { opacity: .85; }

        /* ── Responsive ── */
        @media (max-width: 900px) {
          .article-layout { grid-template-columns: 1fr; }
          .article-sidebar { position: static; }
          .article-gallery-grid { grid-template-columns: repeat(2,1fr); }
        }
        @media (max-width: 560px) {
          .article-hero { height: 360px; }
          .article-gallery-grid { grid-template-columns: repeat(2,1fr); }

          /* Di layar sempit, justify kadang aneh — fallback ke left */
          .article-content .prose {
            text-align: left;
            hyphens: none;
          }
          .article-excerpt-box {
            text-align: left;
          }
        }
      `}</style>

      <div className="article-spacer" />

      {/* ── Hero ── */}
      <div className="article-hero">
        {heroImg && heroImg !== '/images/placeholder.jpg' ? (
          <Image
            src={heroImg}
            alt={post.title}
            fill
            className="article-hero-img"
            priority
            sizes="100vw"
            unoptimized
          />
        ) : (
          <div className="article-hero-fallback" />
        )}
        <div className="article-hero-overlay" />
        <div className="article-hero-content">
          <div className="container">
            <div className="article-breadcrumb">
              <Link href="/">Beranda</Link>
              <span>›</span>
              <Link href="/berita">Berita</Link>
              <span>›</span>
              <span>{CATEGORY_LABELS[post.category] ?? post.category}</span>
            </div>
            <span className="article-badge" style={{ background: badge.bg, color: badge.color }}>
              {catLabel}
            </span>
            <h1 className="article-title">{post.title}</h1>
            <div className="article-meta">
              <span>📅 {formatDate(post.published_at)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Article body ── */}
      <section className="article-body" style={{ background: 'var(--blue-50)' }}>
        <div className="container">
          <div className="article-layout">

            {/* Konten utama */}
            <div className="article-content">
              {post.excerpt && (
                <div className="article-excerpt-box">{post.excerpt}</div>
              )}

              {processedContent ? (
                <div
                  className="prose"
                  dangerouslySetInnerHTML={{ __html: processedContent }}
                />
              ) : (
                <div className="prose">
                  <p style={{ color: 'var(--gray-400)', fontStyle: 'italic' }}>
                    Konten belum tersedia.
                  </p>
                </div>
              )}

              {/* Gallery */}
              {post.gallery && post.gallery.length > 0 && (
                <div className="article-gallery">
                  <h3>📸 Galeri Foto</h3>
                  <div className="article-gallery-grid">
                    {post.gallery.map((g, i) => (
                      <div key={i} className="article-gallery-item">
                        <Image
                          src={getImageUrl(g.image_url)}
                          alt={g.caption ?? `Foto ${i + 1}`}
                          fill
                          sizes="200px"
                          unoptimized
                        />
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

              <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--gray-100)' }}>
                <Link
                  href="/berita"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '.5rem',
                    color: 'var(--blue-600)', fontWeight: 700, textDecoration: 'none', fontSize: '.9rem',
                  }}
                >
                  ← Kembali ke Daftar Berita
                </Link>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="article-sidebar">
              <div className="sidebar-card">
                <div className="sidebar-title">Bagikan</div>
                <div className="share-btns">
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent((process.env.NEXT_PUBLIC_SERVER_URL ?? '') + '/berita/' + post.slug)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="share-btn"
                    style={{ background: '#1877f2', color: 'white' }}
                  >Facebook</a>
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent((process.env.NEXT_PUBLIC_SERVER_URL ?? '') + '/berita/' + post.slug)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="share-btn"
                    style={{ background: '#1da1f2', color: 'white' }}
                  >Twitter</a>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(post.title + ' ' + (process.env.NEXT_PUBLIC_SERVER_URL ?? '') + '/berita/' + post.slug)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="share-btn"
                    style={{ background: '#25d366', color: 'white' }}
                  >WhatsApp</a>
                </div>
              </div>

              {related.length > 0 && (
                <div className="sidebar-card">
                  <div className="sidebar-title">Berita Lainnya</div>
                  <div className="sidebar-related">
                    {related.map((p) => (
                      <Link key={p.id} href={`/berita/${p.slug}`} className="sidebar-post">
                        <div className="sidebar-post-img">
                          <Image
                            src={getImageUrl(p.featured_image_url)}
                            alt={p.title}
                            fill
                            sizes="64px"
                            style={{ objectFit: 'cover' }}
                            unoptimized
                          />
                        </div>
                        <div>
                          <div className="sidebar-post-title">{p.title}</div>
                          <div className="sidebar-post-date">{formatDate(p.published_at)}</div>
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