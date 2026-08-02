import Link from 'next/link'
import PageHero from '@/components/ui/PageHero'
import { INOVASI_LIST, type InovasiItem } from '@/app/constants/inovasi'

interface Props {
  item: InovasiItem
}

export default function InovasiDetailPage({ item }: Props) {
  const others = INOVASI_LIST.filter((i) => i.slug !== item.slug)

  return (
    <>
      <style>{`
        .inovasi-section { padding: 4rem 0; }
        .inovasi-card {
          background: white;
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-xl);
          border: 1px solid var(--gray-100);
          padding: 2.5rem;
          max-width: 760px;
          margin: 0 auto 3rem;
        }
        .inovasi-icon { font-size: 3rem; display: block; margin-bottom: 1rem; }
        .inovasi-desc { color: var(--gray-700); line-height: 1.8; margin-bottom: 1.75rem; font-size: 1rem; }
        .inovasi-highlights { display: flex; flex-direction: column; gap: .6rem; margin-bottom: .5rem; }
        .inovasi-highlight {
          display: flex; gap: .6rem; align-items: flex-start;
          font-size: .92rem; color: var(--gray-700);
        }
        .inovasi-highlight::before { content: '✓'; color: var(--green); font-weight: 800; flex-shrink: 0; }
        .inovasi-article {
          color: var(--gray-700);
          line-height: 1.85;
          font-size: 1rem;
        }
        .inovasi-article p { margin: 0 0 1.1rem; }
        .inovasi-article p:last-child { margin-bottom: 0; }
        .inovasi-article img { display: block; }
        .inovasi-article blockquote { border-radius: var(--radius-md); }
        .inovasi-others { max-width: 760px; margin: 0 auto; }
        .inovasi-others-title {
          font-size: .8rem; font-weight: 700; letter-spacing: .08em; text-transform: uppercase;
          color: var(--gray-500); margin-bottom: 1rem;
        }
        .inovasi-others-grid {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem;
        }
        .inovasi-other-link {
          display: flex; align-items: center; gap: .6rem;
          background: white; border: 1px solid var(--gray-100); border-radius: var(--radius-lg);
          padding: 1rem 1.1rem; text-decoration: none; color: var(--blue-900); font-weight: 700; font-size: .9rem;
          transition: all .2s ease;
        }
        .inovasi-other-link:hover { border-color: var(--blue-300); box-shadow: var(--shadow-lg); transform: translateY(-2px); }
      `}</style>

      <PageHero
        title={item.label}
        subtitle={item.tagline}
        breadcrumbs={[{ label: 'Inovasi', href: '/inovasi' }, { label: item.shortLabel }]}
        accent={item.icon}
      />

      <section className="inovasi-section">
        <div className="container">
          <div className="inovasi-card">
            <span className="inovasi-icon">{item.icon}</span>
            {item.content ? (
              <div
                className="inovasi-article"
                dangerouslySetInnerHTML={{ __html: item.content }}
              />
            ) : (
              <>
                <p className="inovasi-desc">{item.description}</p>
                <div className="inovasi-highlights">
                  {item.highlights.map((h) => (
                    <div key={h} className="inovasi-highlight">{h}</div>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="inovasi-others">
            <div className="inovasi-others-title">Inovasi Lainnya</div>
            <div className="inovasi-others-grid">
              {others.map((o) => (
                <Link key={o.slug} href={`/inovasi/${o.slug}`} className="inovasi-other-link">
                  <span>{o.icon}</span>
                  <span>{o.shortLabel}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}