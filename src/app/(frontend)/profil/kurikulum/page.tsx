import type { Metadata } from 'next'
import PageHero from '@/components/ui/PageHero'

export const metadata: Metadata = { title: 'Kurikulum' }
export const revalidate = 300

const MAPEL = [
  { mapel: 'Pendidikan Agama & Budi Pekerti', k7: 3, k8: 3, k9: 3 },
  { mapel: 'PPKn', k7: 3, k8: 3, k9: 3 },
  { mapel: 'Bahasa Indonesia', k7: 6, k8: 6, k9: 6 },
  { mapel: 'Matematika', k7: 5, k8: 5, k9: 5 },
  { mapel: 'IPA', k7: 5, k8: 5, k9: 5 },
  { mapel: 'IPS', k7: 4, k8: 4, k9: 4 },
  { mapel: 'Bahasa Inggris', k7: 4, k8: 4, k9: 4 },
  { mapel: 'Seni & Budaya', k7: 3, k8: 3, k9: 3 },
  { mapel: 'PJOK', k7: 3, k8: 3, k9: 3 },
  { mapel: 'Informatika', k7: 2, k8: 2, k9: 2 },
  { mapel: 'Prakarya', k7: 2, k8: 2, k9: 2 },
]

export default function KurikulumPage() {
  return (
    <>
      <style>{`
        .kur-section { padding: 4rem 0; background: var(--blue-50); }
        .kur-info-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 1.25rem; margin-bottom: 2.5rem; }
        .kur-info-card { background: white; border-radius: var(--radius-lg); padding: 1.5rem; box-shadow: var(--shadow-sm); text-align: center; border: 1px solid var(--gray-100); }
        .kur-table-wrap { background: white; border-radius: var(--radius-lg); overflow: hidden; box-shadow: var(--shadow-md); }
        .kur-table { width: 100%; border-collapse: collapse; font-size: .875rem; }
        .kur-table thead tr { background: linear-gradient(135deg, var(--blue-900), var(--blue-700)); color: white; }
        .kur-table thead th { padding: .9rem 1.25rem; text-align: left; font-weight: 700; font-size: .8rem; letter-spacing: .05em; text-transform: uppercase; }
        .kur-table thead th:not(:first-child) { text-align: center; }
        .kur-table tbody tr { border-bottom: 1px solid var(--gray-100); transition: background .15s; }
        .kur-table tbody tr:hover { background: var(--blue-50); }
        .kur-table td { padding: .85rem 1.25rem; color: var(--gray-700); }
        .kur-table td:not(:first-child) { text-align: center; font-weight: 700; color: var(--blue-700); }
        @media (max-width: 640px) { .kur-info-grid { grid-template-columns: 1fr; } }
      `}</style>

      <PageHero
        title="Kurikulum"
        subtitle="Struktur kurikulum yang diterapkan SMP Negeri 8 Probolinggo."
        breadcrumbs={[{ label: 'Profil', href: '/profil' }, { label: 'Kurikulum' }]}
        accent="📚"
      />

      <section className="kur-section">
        <div className="container">
          <div style={{ marginBottom: '1rem' }}>
            <span className="section-label">Kurikulum</span>
            <h2 className="section-title" style={{ marginBottom: '1.5rem' }}>Kurikulum Merdeka</h2>
          </div>

          <div className="kur-info-grid">
            {[
              { icon: '📖', title: 'Kurikulum Merdeka', desc: 'Implementasi penuh Kurikulum Merdeka untuk seluruh jenjang kelas' },
              { icon: '🎯', title: 'Profil Pelajar Pancasila', desc: 'Penguatan karakter dan kompetensi siswa sesuai nilai Pancasila' },
              { icon: '🔬', title: 'Projek P5', desc: 'Projek Penguatan Profil Pelajar Pancasila terintegrasi di setiap semester' },
            ].map((item, i) => (
              <div key={i} className="kur-info-card">
                <span style={{ fontSize: '2rem', display: 'block', marginBottom: '.5rem' }}>{item.icon}</span>
                <div style={{ fontWeight: 800, color: 'var(--blue-900)', fontSize: '.95rem', marginBottom: '.3rem' }}>{item.title}</div>
                <div style={{ fontSize: '.8rem', color: 'var(--gray-500)', lineHeight: 1.5 }}>{item.desc}</div>
              </div>
            ))}
          </div>

          <h3 style={{ fontFamily: 'Playfair Display,serif', color: 'var(--blue-900)', fontSize: '1.3rem', marginBottom: '1rem' }}>
            Struktur Mata Pelajaran & Jam Belajar per Minggu
          </h3>
          <div className="kur-table-wrap">
            <table className="kur-table">
              <thead>
                <tr>
                  <th>Mata Pelajaran</th>
                  <th>Kelas VII</th>
                  <th>Kelas VIII</th>
                  <th>Kelas IX</th>
                </tr>
              </thead>
              <tbody>
                {MAPEL.map((row, i) => (
                  <tr key={i}>
                    <td>{row.mapel}</td>
                    <td>{row.k7} JP</td>
                    <td>{row.k8} JP</td>
                    <td>{row.k9} JP</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '.78rem', color: 'var(--gray-400)', textAlign: 'right' }}>
            * JP = Jam Pelajaran (@40 menit). Dapat berubah sesuai kebijakan dinas pendidikan.
          </p>
        </div>
      </section>
    </>
  )
}
