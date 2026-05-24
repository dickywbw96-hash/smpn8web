import Link from 'next/link'
import PageHero from '@/components/ui/PageHero'
import { getPPIDByCategory, formatDate, getImageUrl } from '@/lib/db'

const PPID_MENU = [
  { label: 'Tentang PPID',              href: '/ppid/tentang',            icon: 'ℹ️' },
  { label: 'Alur Permohonan Informasi', href: '/ppid/alur-permohonan',    icon: '🔄' },
  { label: 'MoU',                       href: '/ppid/mou',                 icon: '🤝' },
  { label: 'SOP PPID',                  href: '/ppid/sop',                 icon: '📋' },
  { label: 'Daftar Informasi Publik',   href: '/ppid/daftar-informasi',   icon: '📂' },
]

const CAT_META: Record<string, { title: string; subtitle: string; icon: string }> = {
  tentang:           { title: 'Tentang PPID',              subtitle: 'Informasi umum mengenai PPID SMP Negeri 8 Probolinggo.', icon: 'ℹ️' },
  alur_permohonan:   { title: 'Alur Permohonan Informasi', subtitle: 'Prosedur dan alur pengajuan permohonan informasi publik.',  icon: '🔄' },
  mou:               { title: 'MoU',                        subtitle: 'Daftar Memorandum of Understanding sekolah.',             icon: '🤝' },
  sop:               { title: 'SOP PPID',                   subtitle: 'Standar Operasional Prosedur PPID.',                      icon: '📋' },
  daftar_informasi:  { title: 'Daftar Informasi Publik',   subtitle: 'Dokumen-dokumen informasi publik yang tersedia.',          icon: '📂' },
}

export default async function PPIDSubPage({
  category,
  currentHref,
}: {
  category: string
  currentHref: string
}) {
  const meta = CAT_META[category] ?? { title: 'PPID', subtitle: '', icon: '📂' }
  const docs = await getPPIDByCategory(category)

  return (
    <>
      <style>{`
        .ppid-layout { display: grid; grid-template-columns: 260px 1fr; gap: 2.5rem; padding: 3rem 0 4rem; }
        /* Sidebar nav */
        .ppid-nav { background: white; border-radius: var(--radius-lg); padding: 1.25rem; box-shadow: var(--shadow-md); border: 1px solid var(--gray-100); position: sticky; top: 100px; height: fit-content; }
        .ppid-nav-title { font-size: .72rem; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; color: var(--gray-400); padding: .25rem .5rem .75rem; border-bottom: 1px solid var(--gray-100); margin-bottom: .5rem; }
        .ppid-nav-link { display: flex; align-items: center; gap: .6rem; padding: .65rem .9rem; border-radius: var(--radius-sm); text-decoration: none; font-size: .875rem; font-weight: 600; color: var(--gray-600); transition: all .15s ease; }
        .ppid-nav-link:hover { background: var(--blue-50); color: var(--blue-700); }
        .ppid-nav-link.active { background: var(--blue-700); color: white; }
        /* Docs */
        .ppid-docs { display: flex; flex-direction: column; gap: 1rem; }
        .ppid-doc-card { background: white; border-radius: var(--radius-lg); padding: 1.5rem; box-shadow: var(--shadow-sm); border: 1px solid var(--gray-100); }
        .ppid-doc-title { font-family: 'Playfair Display',serif; font-size: 1.1rem; color: var(--blue-900); font-weight: 700; margin-bottom: .5rem; }
        .ppid-doc-date { font-size: .75rem; color: var(--gray-400); margin-bottom: .75rem; }
        .ppid-doc-content { font-size: .9rem; color: var(--gray-600); line-height: 1.7; margin-bottom: 1rem; }
        .ppid-file-list { display: flex; flex-wrap: wrap; gap: .5rem; }
        .ppid-file-btn {
          display: inline-flex; align-items: center; gap: .4rem;
          background: var(--blue-50); color: var(--blue-700);
          border: 1px solid var(--blue-200);
          padding: .4rem .9rem; border-radius: var(--radius-sm);
          font-size: .78rem; font-weight: 700;
          text-decoration: none; transition: all .15s ease;
        }
        .ppid-file-btn:hover { background: var(--blue-700); color: white; border-color: var(--blue-700); }
        .ppid-empty { text-align: center; padding: 4rem 2rem; color: var(--gray-400); background: white; border-radius: var(--radius-lg); }
        @media (max-width: 768px) {
          .ppid-layout { grid-template-columns: 1fr; }
          .ppid-nav { position: static; display: flex; flex-wrap: wrap; gap: .3rem; }
          .ppid-nav-title { width: 100%; }
        }
      `}</style>

      <PageHero
        title={meta.title}
        subtitle={meta.subtitle}
        breadcrumbs={[{ label: 'PPID', href: '/ppid/tentang' }, { label: meta.title }]}
        accent={meta.icon}
      />

      <div className="container">
        <div className="ppid-layout">
          {/* Sidebar nav */}
          <nav className="ppid-nav">
            <div className="ppid-nav-title">Menu PPID</div>
            {PPID_MENU.map((m) => (
              <Link key={m.href} href={m.href} className={`ppid-nav-link${m.href === currentHref ? ' active' : ''}`}>
                {m.icon} {m.label}
              </Link>
            ))}
          </nav>

          {/* Content */}
          <div>
            <h2 style={{ fontFamily: 'Playfair Display,serif', color: 'var(--blue-900)', fontSize: '1.5rem', marginBottom: '1.5rem' }}>
              {meta.title}
            </h2>

            {docs.length === 0 ? (
              <div className="ppid-empty">
                <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>{meta.icon}</span>
                <p>Konten belum tersedia. Silakan hubungi admin untuk mengisi halaman ini.</p>
              </div>
            ) : (
              <div className="ppid-docs">
                {docs.map((doc) => (
                  <div key={doc.id} className="ppid-doc-card">
                    <div className="ppid-doc-title">{doc.title}</div>
                    <div className="ppid-doc-date">📅 {formatDate(doc.publishedAt)}</div>
                    {doc.content && (
                      <div className="ppid-doc-content">
                        <p style={{ fontStyle: 'italic', color: 'var(--gray-400)' }}>Konten tersedia — render menggunakan RichText renderer.</p>
                      </div>
                    )}
                    {doc.files && doc.files.length > 0 && (
                      <div className="ppid-file-list">
                        {doc.files.map((f, i) => (
                          <a
                            key={i}
                            href={getImageUrl(f.file)}
                            target="_blank"
                            rel="noopener"
                            className="ppid-file-btn"
                            download
                          >
                            📥 {f.label ?? `Unduh Dokumen ${i + 1}`}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
