import Link from 'next/link'

interface Crumb { label: string; href?: string }

interface Props {
  title: string
  subtitle?: string
  breadcrumbs?: Crumb[]
  accent?: string
}

export default function PageHero({ title, subtitle, breadcrumbs, accent = '📋' }: Props) {
  return (
    <>
      <style>{`
        .ph {
          background: linear-gradient(135deg, #030f2b 0%, #1345a0 60%, #071e4a 100%);
          padding: 5.5rem 0 3.5rem;
          color: white;
          position: relative;
          overflow: hidden;
        }
        .ph::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            radial-gradient(circle at 85% 50%, rgba(255,255,255,.05) 0%, transparent 50%),
            repeating-linear-gradient(
              -45deg,
              transparent,
              transparent 40px,
              rgba(255,255,255,.01) 40px,
              rgba(255,255,255,.01) 41px
            );
          pointer-events: none;
        }
        .ph-inner { position: relative; }
        .ph-accent {
          font-size: 3.5rem;
          margin-bottom: .5rem;
          display: block;
          opacity: .85;
        }
        .ph h1 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.75rem, 4vw, 2.75rem);
          font-weight: 700;
          margin-bottom: .5rem;
          line-height: 1.2;
        }
        .ph p {
          opacity: .75;
          font-size: 1.05rem;
          max-width: 560px;
          line-height: 1.65;
        }
        .ph-breadcrumb {
          display: flex;
          align-items: center;
          gap: .5rem;
          font-size: .8rem;
          color: rgba(255,255,255,.55);
          margin-top: 1.25rem;
        }
        .ph-breadcrumb a {
          color: rgba(255,255,255,.6);
          text-decoration: none;
          transition: color .15s;
        }
        .ph-breadcrumb a:hover { color: white; }
        .ph-breadcrumb span { color: rgba(255,255,255,.9); }
        .ph-breadcrumb .sep { color: rgba(255,255,255,.3); }
        .ph-deco {
          position: absolute;
          right: 0; top: 0; bottom: 0;
          width: 40%;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding-right: 3rem;
          pointer-events: none;
          overflow: hidden;
        }
        .ph-deco-circle {
          width: 300px; height: 300px;
          border-radius: 50%;
          border: 2px solid rgba(255,255,255,.06);
          position: absolute;
        }
        .ph-deco-circle:nth-child(1) { width: 200px; height: 200px; right: 4rem; top: 50%; transform: translateY(-60%); }
        .ph-deco-circle:nth-child(2) { width: 320px; height: 320px; right: -2rem; top: 50%; transform: translateY(-40%); }
        .ph-deco-circle:nth-child(3) { width: 140px; height: 140px; right: 8rem; bottom: -2rem; }
        @media (max-width: 640px) { .ph-deco { display: none; } }
      `}</style>

      <div className="ph">
        <div className="container ph-inner">
          <span className="ph-accent">{accent}</span>
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
          {breadcrumbs && breadcrumbs.length > 0 && (
            <div className="ph-breadcrumb">
              <Link href="/">Beranda</Link>
              {breadcrumbs.map((crumb, i) => (
                <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                  <span className="sep">›</span>
                  {crumb.href && i < breadcrumbs.length - 1
                    ? <Link href={crumb.href}>{crumb.label}</Link>
                    : <span>{crumb.label}</span>
                  }
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="ph-deco">
          <div className="ph-deco-circle" />
          <div className="ph-deco-circle" />
          <div className="ph-deco-circle" />
        </div>
      </div>
    </>
  )
}
