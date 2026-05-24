'use client'

import type { Post } from '@/lib/db'
import { formatDateShort, CATEGORY_LABELS, CATEGORY_COLORS } from '@/lib/db'
import Link from 'next/link'

interface Props {
  posts: Post[]
}

export default function TimelineSection({ posts }: Props) {
  if (!posts.length) return null

  return (
    <>
      <style>{`
        .timeline-section {
          padding: 5rem 0;
          background: white;
        }
        .timeline-header {
          text-align: center;
          margin-bottom: 3rem;
        }
        .timeline-eyebrow {
          display: inline-block;
          font-size: .72rem;
          font-weight: 700;
          letter-spacing: .14em;
          text-transform: uppercase;
          color: #1a5cc8;
          margin-bottom: .6rem;
        }
        .timeline-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.6rem, 2.5vw, 2.2rem);
          font-weight: 700;
          color: #071e4a;
          margin: 0;
        }
        .timeline-wrap {
          position: relative;
          max-width: 760px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }
        /* garis vertikal tengah */
        .timeline-wrap::before {
          content: '';
          position: absolute;
          left: 50%;
          top: 0; bottom: 0;
          width: 2px;
          background: linear-gradient(180deg, #1a5cc8 0%, #e8a31a 50%, #16a34a 100%);
          transform: translateX(-50%);
        }
        .timeline-item {
          display: grid;
          grid-template-columns: 1fr 40px 1fr;
          gap: 0 1rem;
          margin-bottom: 2rem;
          align-items: start;
        }
        /* alternating: genap = info kanan, ganjil = info kiri */
        .timeline-item:nth-child(even) .timeline-content { order: 3; text-align: left; }
        .timeline-item:nth-child(even) .timeline-dot    { order: 2; }
        .timeline-item:nth-child(even) .timeline-date   { order: 1; text-align: right; padding-top: .6rem; }

        .timeline-item:nth-child(odd) .timeline-content { order: 1; text-align: right; }
        .timeline-item:nth-child(odd) .timeline-dot     { order: 2; }
        .timeline-item:nth-child(odd) .timeline-date    { order: 3; text-align: left; padding-top: .6rem; }

        .timeline-dot {
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding-top: .5rem;
        }
        .timeline-dot-inner {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border: 3px solid white;
          background: #1a5cc8;
          box-shadow: 0 0 0 3px #1a5cc830;
          flex-shrink: 0;
          transition: transform .2s;
        }
        .timeline-item:hover .timeline-dot-inner {
          transform: scale(1.3);
        }
        .timeline-content {
          background: #f8f9fc;
          border-radius: 12px;
          padding: 1rem 1.1rem;
          transition: box-shadow .2s, transform .2s;
        }
        .timeline-item:hover .timeline-content {
          box-shadow: 0 6px 20px rgba(7,30,74,.1);
          transform: translateY(-2px);
        }
        .timeline-cat {
          display: inline-block;
          font-size: .65rem;
          font-weight: 700;
          letter-spacing: .08em;
          text-transform: uppercase;
          border-radius: 100px;
          padding: .15rem .6rem;
          margin-bottom: .4rem;
          color: white;
        }
        .timeline-post-title {
          font-size: .9rem;
          font-weight: 700;
          color: #071e4a;
          line-height: 1.4;
          text-decoration: none;
          display: block;
        }
        .timeline-post-title:hover { color: #1a5cc8; }
        .timeline-excerpt {
          font-size: .78rem;
          color: #64748b;
          margin-top: .3rem;
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .timeline-date-text {
          font-size: .75rem;
          color: #94a3b8;
          font-weight: 600;
        }

        /* Mobile: single column */
        @media (max-width: 600px) {
          .timeline-wrap::before { left: 20px; transform: none; }
          .timeline-item {
            grid-template-columns: 40px 1fr;
          }
          .timeline-item:nth-child(even) .timeline-content,
          .timeline-item:nth-child(odd)  .timeline-content { order: 2; text-align: left; }
          .timeline-item:nth-child(even) .timeline-dot,
          .timeline-item:nth-child(odd)  .timeline-dot     { order: 1; }
          .timeline-item:nth-child(even) .timeline-date,
          .timeline-item:nth-child(odd)  .timeline-date    { display: none; }
        }

        .timeline-cta {
          text-align: center;
          margin-top: 2.5rem;
        }
        .timeline-cta a {
          display: inline-block;
          background: #071e4a;
          color: white;
          font-weight: 700;
          font-size: .875rem;
          padding: .75rem 2rem;
          border-radius: 100px;
          text-decoration: none;
          transition: background .2s, transform .2s;
        }
        .timeline-cta a:hover {
          background: #1a5cc8;
          transform: translateY(-2px);
        }
      `}</style>

      <section className="timeline-section">
        <div className="container">
          <div className="timeline-header">
            <span className="timeline-eyebrow">📅 Rekam Jejak</span>
            <h2 className="timeline-title">Timeline Kegiatan</h2>
          </div>

          <div className="timeline-wrap">
            {posts.map((post) => {
              const color = CATEGORY_COLORS[post.category] ?? '#1a5cc8'
              const label = CATEGORY_LABELS[post.category] ?? post.category
              return (
                <div className="timeline-item" key={post.id}>
                  <div className="timeline-content">
                    <span className="timeline-cat" style={{ background: color }}>{label}</span>
                    <Link href={`/berita/${post.slug}`} className="timeline-post-title">
                      {post.title}
                    </Link>
                    {post.excerpt && <p className="timeline-excerpt">{post.excerpt}</p>}
                  </div>
                  <div className="timeline-dot">
                    <span className="timeline-dot-inner" style={{ background: color }} />
                  </div>
                  <div className="timeline-date">
                    <span className="timeline-date-text">
                      {formatDateShort(post.published_at ?? post.created_at)}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="timeline-cta">
            <Link href="/berita">Lihat Semua Kegiatan →</Link>
          </div>
        </div>
      </section>
    </>
  )
}