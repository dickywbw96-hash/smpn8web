import Image from 'next/image'
import Link from 'next/link'
import PageHero from '@/components/ui/PageHero'
import { getPosts, getImageUrl, formatDateShort, CATEGORY_LABELS } from '@/lib/db'

const BADGE_STYLE: Record<string, { bg: string; color: string }> = {
  kegiatan_umum:       { bg: '#deeafb', color: '#1345a0' },
  prestasi:            { bg: '#fdf3d6', color: '#b45309' },
  kegiatan_organisasi: { bg: '#dcfce7', color: '#15803d' },
  artikel: { bg: '#fce7f3', color: '#9d174d' },
}

const CAT_META: Record<string, { title: string; subtitle: string; icon: string }> = {
  kegiatan_umum: {
    title: 'Kegiatan Umum',
    subtitle: 'Liputan berbagai kegiatan dan program sekolah.',
    icon: '🗓️',
  },
  prestasi: {
    title: 'Prestasi',
    subtitle: 'Pencapaian dan penghargaan yang diraih siswa dan sekolah.',
    icon: '🏆',
  },
  kegiatan_organisasi: {
    title: 'Kegiatan Organisasi',
    subtitle: 'Kegiatan OSIS dan organisasi siswa lainnya.',
    icon: '🎯',
  },
  artikel: {
  title: 'Artikel',
  subtitle: 'Tulisan dan artikel informatif seputar dunia pendidikan.',
  icon: '📝',
},
}

export default async function BeritaKategoriPage({ category }: { category: string }) {
  const meta = CAT_META[category]
  const { docs: posts, totalDocs } = await getPosts({ category, limit: 12 })
  const badge = BADGE_STYLE[category] ?? { bg: '#f3f4f6', color: '#374151' }

  return (
    <>
      <style>{`
        .bk-section { padding: 4rem 0; background: var(--blue-50); }
        .bk-back { display: inline-flex; align-items: center; gap: .4rem; color: var(--blue-600); text-decoration: none; font-size: .85rem; font-weight: 600; margin-bottom: 1.5rem; }
        .bk-back:hover { color: var(--blue-800); }
        .bk-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 1.5rem; }
        .bk-card { background: white; border-radius: var(--radius-lg); overflow: hidden; box-shadow: var(--shadow-sm); border: 1px solid var(--gray-100); text-decoration: none; display: flex; flex-direction: column; transition: all .25s ease; }
        .bk-card:hover { box-shadow: var(--shadow-xl); transform: translateY(-4px); }
        .bk-card:hover .bk-img { transform: scale(1.04); }
        .bk-img-wrap { aspect-ratio: 16/9; overflow: hidden; position: relative; }
        .bk-img { object-fit: cover; transition: transform .4s; }
        .bk-body { padding: 1.1rem; flex: 1; display: flex; flex-direction: column; gap: .35rem; }
        .bk-date { font-size: .72rem; color: var(--gray-400); font-weight: 500; }
        .bk-title { font-family: 'Playfair Display',serif; color: var(--gray-900); font-size: .95rem; font-weight: 600; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .bk-excerpt { font-size: .8rem; color: var(--gray-500); line-height: 1.6; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .bk-more { font-size: .78rem; font-weight: 700; color: var(--blue-600); margin-top: auto; padding-top: .6rem; }
        .empty-state { text-align: center; padding: 4rem; color: var(--gray-500); background: white; border-radius: var(--radius-lg); }
        @media (max-width: 900px) { .bk-grid { grid-template-columns: repeat(2,1fr); } }
        @media (max-width: 560px) { .bk-grid { grid-template-columns: 1fr; } }
      `}</style>

      <PageHero
        title={meta.title}
        subtitle={`${totalDocs} berita — ${meta.subtitle}`}
        breadcrumbs={[{ label: 'Berita', href: '/berita' }, { label: meta.title }]}
        accent={meta.icon}
      />

      <section className="bk-section">
        <div className="container">
          <Link href="/berita" className="bk-back">← Semua Berita</Link>

          {posts.length === 0 ? (
            <div className="empty-state">
              <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>{meta.icon}</span>
              <p>Belum ada berita pada kategori ini.</p>
            </div>
          ) : (
            <div className="bk-grid">
              {posts.map((post) => (
                <Link key={post.id} href={`/berita/${post.slug}`} className="bk-card">
                  <div className="bk-img-wrap">
                    <Image src={getImageUrl(post.featured_image_url)} alt={post.title} fill sizes="33vw" className="bk-img" />
                    <span style={{ position: 'absolute', top: '.6rem', left: '.6rem', background: badge.bg, color: badge.color, padding: '.2rem .65rem', borderRadius: '100px', fontSize: '.7rem', fontWeight: 700 }}>
                      {CATEGORY_LABELS[post.category]}
                    </span>
                  </div>
                  <div className="bk-body">
                    <div className="bk-date">{formatDateShort(post.published_at)}</div>
                    <h3 className="bk-title">{post.title}</h3>
                    <p className="bk-excerpt">{post.excerpt}</p>
                    <span className="bk-more">Baca selengkapnya →</span>
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
