import type { Metadata } from 'next'
import PageHero from '@/components/ui/PageHero'

export const metadata: Metadata = { title: 'Sarana & Prasarana' }

const FASILITAS = [
  { icon: '🏫', name: 'Ruang Kelas',      desc: 'Ruang belajar yang nyaman dan kondusif' },
  { icon: '📚', name: 'Perpustakaan',     desc: 'Koleksi buku lengkap untuk mendukung pembelajaran' },
  { icon: '🔬', name: 'Lab. IPA',         desc: 'Laboratorium ilmu pengetahuan alam terlengkap' },
  { icon: '💻', name: 'Lab. Komputer',    desc: 'Fasilitas komputer untuk pembelajaran TIK' },
  { icon: '⚽', name: 'Lapangan Olahraga',desc: 'Fasilitas olahraga untuk kegiatan jasmani' },
  { icon: '🎨', name: 'Ruang Kesenian',   desc: 'Ruang khusus untuk pengembangan bakat seni' },
  { icon: '🏥', name: 'UKS',             desc: 'Unit Kesehatan Sekolah untuk layanan kesehatan siswa' },
  { icon: '🕌', name: 'Musholla',         desc: 'Fasilitas ibadah bagi warga sekolah' },
]

export default function SarprasPage() {
  return (
    <>
      <style>{`
        .sarpras-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.25rem;
          margin-top: 2.5rem;
        }
        .sarpras-card {
          background: white;
          border-radius: var(--radius-lg);
          padding: 1.75rem 1.5rem;
          box-shadow: var(--shadow-sm);
          border: 1px solid var(--gray-100);
          text-align: center;
          transition: all .25s ease;
        }
        .sarpras-card:hover {
          box-shadow: var(--shadow-xl);
          transform: translateY(-4px);
          border-color: var(--blue-200);
        }
        .sarpras-icon { font-size: 2.25rem; margin-bottom: .75rem; display: block; }
        .sarpras-name { font-weight: 700; color: var(--blue-900); font-size: .95rem; margin-bottom: .4rem; }
        .sarpras-desc { font-size: .8rem; color: var(--gray-500); line-height: 1.5; }
        @media (max-width: 900px) { .sarpras-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 480px) { .sarpras-grid { grid-template-columns: 1fr; } }
      `}</style>

      <PageHero
        title="Sarana & Prasarana"
        subtitle="Fasilitas lengkap untuk mendukung kegiatan belajar mengajar yang optimal."
        breadcrumbs={[{ label: 'Profil', href: '/profil' }, { label: 'Sarana & Prasarana' }]}
        accent="🏗️"
      />

      <section style={{ padding: '4rem 0', background: 'var(--blue-50)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <span className="section-label">Fasilitas</span>
            <h2 className="section-title">Sarana & Prasarana Sekolah</h2>
          </div>
          <div className="sarpras-grid">
            {FASILITAS.map((f, i) => (
              <div key={i} className="sarpras-card">
                <span className="sarpras-icon">{f.icon}</span>
                <div className="sarpras-name">{f.name}</div>
                <div className="sarpras-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
