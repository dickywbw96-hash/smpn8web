import type { Metadata } from 'next'
import PageHero from '@/components/ui/PageHero'
import { getSiteSettings, getImageUrl } from '@/lib/payload'
import Image from 'next/image'

export const metadata: Metadata = { title: 'Profil Sekolah' }
export const revalidate = 300

export default async function ProfilPage() {
  const settings = await getSiteSettings()
  const s = settings

  return (
    <>
      <style>{`
        .profil-section { padding: 4rem 0; }
        .profil-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          align-items: start;
          margin-bottom: 3rem;
        }
        .info-table { width: 100%; border-collapse: collapse; }
        .info-table tr { border-bottom: 1px solid var(--gray-100); }
        .info-table tr:last-child { border-bottom: none; }
        .info-table td { padding: .85rem .5rem; font-size: .9rem; vertical-align: top; }
        .info-table td:first-child { color: var(--gray-500); font-weight: 500; width: 45%; }
        .info-table td:last-child { color: var(--gray-900); font-weight: 600; }
        .profil-logo-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
        }
        .profil-logo-img {
          width: 180px; height: 180px;
          border-radius: 50%;
          border: 4px solid var(--blue-100);
          box-shadow: var(--shadow-lg);
          object-fit: contain;
          background: white;
          padding: 1rem;
        }
        .sejarah-card {
          background: var(--blue-50);
          border-radius: var(--radius-lg);
          padding: 2.5rem;
          border-left: 5px solid var(--blue-600);
        }
        @media (max-width: 768px) { .profil-grid { grid-template-columns: 1fr; } }
      `}</style>

      <PageHero
        title="Profil Sekolah"
        subtitle="SMP Negeri 8 Kota Probolinggo"
        breadcrumbs={[{ label: 'Profil Sekolah' }]}
        accent="🏫"
      />

      <section className="profil-section">
        <div className="container">
          <div className="profil-grid">
            {/* Logo + Identitas */}
            <div>
              <div className="profil-logo-wrap" style={{ marginBottom: '2rem' }}>
                {s?.schoolLogo ? (
                  <Image
                    src={getImageUrl(s.schoolLogo)}
                    alt="Logo SMPN 8"
                    width={180} height={180}
                    className="profil-logo-img"
                    style={{ objectFit: 'contain' }}
                  />
                ) : (
                  <div className="profil-logo-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem' }}>🏫</div>
                )}
                <h2 style={{ fontFamily: 'Playfair Display, serif', color: 'var(--blue-900)', textAlign: 'center' }}>
                  {s?.schoolName ?? 'SMP Negeri 8 Probolinggo'}
                </h2>
              </div>
            </div>

            {/* Identitas Sekolah */}
            <div>
              <span className="section-label">Identitas Sekolah</span>
              <h3 className="section-title" style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Data Sekolah</h3>
              <table className="info-table">
                <tbody>
                  <tr><td>Nama Sekolah</td><td>{s?.schoolName ?? 'SMP Negeri 8 Probolinggo'}</td></tr>
                  {s?.schoolNPSN && <tr><td>NPSN</td><td>{s.schoolNPSN}</td></tr>}
                  {s?.schoolNSS && <tr><td>NSS</td><td>{s.schoolNSS}</td></tr>}
                  <tr><td>Jenjang</td><td>SMP (Sekolah Menengah Pertama)</td></tr>
                  <tr><td>Status</td><td>Negeri</td></tr>
                  {s?.address?.street && <tr><td>Alamat</td><td>{s.address.street}</td></tr>}
                  {s?.address?.city && <tr><td>Kota</td><td>{s.address.city}, {s.address.province}</td></tr>}
                  {s?.contact?.phone && <tr><td>Telepon</td><td>{s.contact.phone}</td></tr>}
                  {s?.contact?.email && <tr><td>Email</td><td>{s.contact.email}</td></tr>}
                  {s?.contact?.website && <tr><td>Website</td><td>{s.contact.website}</td></tr>}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sejarah placeholder */}
          <div className="sejarah-card">
            <span className="section-label">Sejarah</span>
            <h3 className="section-title" style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>Sejarah Singkat Sekolah</h3>
            <p style={{ color: 'var(--gray-700)', lineHeight: 1.8, fontSize: '.95rem' }}>
              SMP Negeri 8 Probolinggo merupakan sekolah menengah pertama negeri yang berkomitmen
              menghadirkan pendidikan berkualitas bagi generasi penerus bangsa di Kota Probolinggo.
              Dengan pengalaman panjang dan dedikasi seluruh civitas akademika, sekolah ini telah
              mencetak banyak alumni berprestasi di berbagai bidang.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
