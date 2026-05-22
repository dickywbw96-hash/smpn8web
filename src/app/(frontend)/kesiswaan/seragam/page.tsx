import type { Metadata } from 'next'
import PageHero from '@/components/ui/PageHero'

export const metadata: Metadata = { title: 'Seragam Sekolah' }

const SERAGAM = [
  { hari: 'Senin – Selasa', baju: 'Putih lengan pendek', celana_rok: 'Putih', keterangan: 'Dilengkapi dasi merah dan topi', warna: '#deeafb' },
  { hari: 'Rabu – Kamis', baju: 'Batik khas SMPN 8', celana_rok: 'Putih', keterangan: 'Seragam batik identitas sekolah', warna: '#fdf3d6' },
  { hari: "Jum'at", baju: 'Pramuka cokelat', celana_rok: 'Cokelat', keterangan: 'Seragam pramuka lengkap', warna: '#fef9c3' },
  { hari: 'Sabtu', baju: 'Olahraga / Seragam Ekskul', celana_rok: 'Sesuai seragam ekskul', keterangan: 'Seragam olahraga/ekskul', warna: '#dcfce7' },
]

export default function SeragamPage() {
  return (
    <>
      <style>{`
        .seragam-section { padding: 4rem 0; background: var(--blue-50); }
        .seragam-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.25rem;
          margin-top: 2rem;
        }
        .seragam-card {
          background: white;
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          box-shadow: var(--shadow-sm);
          border: 1px solid var(--gray-100);
        }
        .seragam-hari {
          font-weight: 800;
          color: var(--blue-900);
          font-size: 1rem;
          margin-bottom: .75rem;
          padding-bottom: .5rem;
          border-bottom: 2px solid var(--gray-100);
        }
        .seragam-detail { display: flex; flex-direction: column; gap: .4rem; }
        .seragam-row { display: flex; gap: .5rem; font-size: .875rem; }
        .seragam-label { color: var(--gray-500); min-width: 90px; }
        .seragam-val { color: var(--gray-900); font-weight: 600; }
        .seragam-note {
          margin-top: 1rem;
          padding: .6rem 1rem;
          border-radius: var(--radius-sm);
          font-size: .8rem;
          font-style: italic;
          color: var(--gray-600);
        }
        @media (max-width: 600px) { .seragam-grid { grid-template-columns: 1fr; } }
      `}</style>

      <PageHero
        title="Seragam Sekolah"
        subtitle="Ketentuan seragam yang berlaku di SMP Negeri 8 Probolinggo."
        breadcrumbs={[{ label: 'Kesiswaan' }, { label: 'Seragam' }]}
        accent="👕"
      />

      <section className="seragam-section">
        <div className="container">
          <span className="section-label">Penampilan</span>
          <h2 className="section-title">Ketentuan Seragam Siswa</h2>
          <p className="section-subtitle">Seragam mencerminkan identitas dan kedisiplinan siswa SMPN 8 Probolinggo.</p>

          <div className="seragam-grid">
            {SERAGAM.map((s, i) => (
              <div key={i} className="seragam-card">
                <div className="seragam-hari">📅 {s.hari}</div>
                <div className="seragam-detail">
                  <div className="seragam-row">
                    <span className="seragam-label">Baju</span>
                    <span className="seragam-val">{s.baju}</span>
                  </div>
                  <div className="seragam-row">
                    <span className="seragam-label">Celana/Rok</span>
                    <span className="seragam-val">{s.celana_rok}</span>
                  </div>
                </div>
                <div className="seragam-note" style={{ background: s.warna }}>💡 {s.keterangan}</div>
              </div>
            ))}
          </div>

          <div style={{
            background: 'white', borderRadius: 'var(--radius-lg)', padding: '1.75rem',
            boxShadow: 'var(--shadow-sm)', marginTop: '2rem',
            borderLeft: '5px solid var(--blue-600)'
          }}>
            <h4 style={{ color: 'var(--blue-900)', marginBottom: '.75rem', fontWeight: 700 }}>📌 Ketentuan Umum Seragam</h4>
            <ul style={{ paddingLeft: '1.25rem', color: 'var(--gray-700)', fontSize: '.875rem', lineHeight: 2 }}>
              <li>Seragam harus bersih, rapi, dan tidak kusut</li>
              <li>Baju dimasukkan ke dalam celana/rok</li>
              <li>Atribut lengkap (nama, OSIS, bendera)</li>
              <li>Sepatu hitam dan kaos kaki putih (hari Senin-Kamis)</li>
              <li>Ikat pinggang hitam untuk putra</li>
              <li>Rambut rapi tidak melebihi kerah baju (putra)</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}
