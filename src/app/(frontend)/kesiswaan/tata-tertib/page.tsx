import type { Metadata } from 'next'
import PageHero from '@/components/ui/PageHero'

export const metadata: Metadata = { title: 'Tata Tertib' }

const PERATURAN = [
  { no: 1, kategori: 'Kehadiran', poin: 'Siswa wajib hadir di sekolah sebelum pukul 07.00 WIB.' },
  { no: 2, kategori: 'Kehadiran', poin: 'Siswa yang terlambat wajib melapor kepada guru piket.' },
  { no: 3, kategori: 'Pakaian', poin: 'Siswa wajib mengenakan seragam sesuai ketentuan sekolah.' },
  { no: 4, kategori: 'Pakaian', poin: 'Seragam harus bersih, rapi, dan dilengkapi atribut lengkap.' },
  { no: 5, kategori: 'Perilaku', poin: 'Siswa wajib bersikap sopan dan santun kepada seluruh warga sekolah.' },
  { no: 6, kategori: 'Perilaku', poin: 'Dilarang membawa dan menggunakan HP saat jam pelajaran berlangsung.' },
  { no: 7, kategori: 'Kebersihan', poin: 'Siswa wajib menjaga kebersihan lingkungan sekolah.' },
  { no: 8, kategori: 'Akademik', poin: 'Siswa wajib mengerjakan dan mengumpulkan tugas tepat waktu.' },
]

const KATEGORI_STYLE: Record<string, { bg: string; color: string }> = {
  Kehadiran: { bg: '#deeafb', color: '#1345a0' },
  Pakaian:   { bg: '#fdf3d6', color: '#b45309' },
  Perilaku:  { bg: '#dcfce7', color: '#15803d' },
  Kebersihan:{ bg: '#f0fdf4', color: '#166534' },
  Akademik:  { bg: '#faf5ff', color: '#7e22ce' },
}

export default function TataTertibPage() {
  return (
    <>
      <style>{`
        .tt-section { padding: 4rem 0; background: var(--blue-50); }
        .tt-list { display: flex; flex-direction: column; gap: .75rem; margin-top: 2rem; }
        .tt-item {
          display: flex; align-items: flex-start; gap: 1rem;
          background: white;
          padding: 1rem 1.25rem;
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-sm);
          border: 1px solid var(--gray-100);
        }
        .tt-num {
          flex-shrink: 0; width: 32px; height: 32px;
          background: var(--blue-900); color: white;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: .8rem; font-weight: 800;
        }
        .tt-badge {
          padding: .2rem .6rem;
          border-radius: 100px;
          font-size: .7rem; font-weight: 700;
          flex-shrink: 0; margin-top: .1rem;
        }
        .tt-text { font-size: .9rem; color: var(--gray-700); line-height: 1.6; }
      `}</style>

      <PageHero
        title="Tata Tertib Sekolah"
        subtitle="Peraturan yang berlaku bagi seluruh warga sekolah SMP Negeri 8 Probolinggo."
        breadcrumbs={[{ label: 'Kesiswaan', href: '/kesiswaan/ekstrakurikuler' }, { label: 'Tata Tertib' }]}
        accent="📜"
      />

      <section className="tt-section">
        <div className="container">
          <span className="section-label">Peraturan</span>
          <h2 className="section-title">Tata Tertib Siswa</h2>
          <p className="section-subtitle">Semua siswa wajib mematuhi peraturan berikut demi terciptanya lingkungan belajar yang kondusif.</p>
          <div className="tt-list">
            {PERATURAN.map((p) => {
              const style = KATEGORI_STYLE[p.kategori] ?? { bg: '#f3f4f6', color: '#374151' }
              return (
                <div key={p.no} className="tt-item">
                  <span className="tt-num">{p.no}</span>
                  <span className="tt-badge" style={{ background: style.bg, color: style.color }}>{p.kategori}</span>
                  <span className="tt-text">{p.poin}</span>
                </div>
              )
            })}
          </div>
          <p style={{ marginTop: '2rem', color: 'var(--gray-500)', fontSize: '.85rem', textAlign: 'center' }}>
            * Tata tertib lengkap tersedia di administrasi sekolah.
          </p>
        </div>
      </section>
    </>
  )
}
