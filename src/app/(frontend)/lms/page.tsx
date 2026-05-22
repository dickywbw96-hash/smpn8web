import type { Metadata } from 'next'
import PageHero from '@/components/ui/PageHero'

export const metadata: Metadata = { title: 'LMS — Learning Management System' }

export default function LMSPage() {
  return (
    <>
      <style>{`
        .lms-section { padding: 5rem 0; background: var(--blue-50); text-align: center; }
        .lms-card {
          max-width: 600px; margin: 0 auto;
          background: white; border-radius: var(--radius-xl);
          padding: 3rem; box-shadow: var(--shadow-xl);
          border: 1px solid var(--gray-100);
        }
        .lms-icon { font-size: 4rem; display: block; margin-bottom: 1.25rem; }
        .lms-title { font-family: 'Playfair Display',serif; color: var(--blue-900); font-size: 1.75rem; margin-bottom: .75rem; font-weight: 700; }
        .lms-desc { color: var(--gray-500); line-height: 1.75; margin-bottom: 2rem; }
        .lms-features { display: grid; grid-template-columns: 1fr 1fr; gap: .75rem; text-align: left; margin-bottom: 2rem; }
        .lms-feature { display: flex; gap: .5rem; font-size: .85rem; color: var(--gray-700); align-items: flex-start; }
        .lms-feature::before { content: '✓'; color: var(--green); font-weight: 800; flex-shrink: 0; }
        .lms-btn {
          display: inline-flex; align-items: center; gap: .5rem;
          background: var(--blue-700); color: white;
          padding: .85rem 2rem; border-radius: 100px;
          font-weight: 800; font-size: 1rem; text-decoration: none;
          transition: all .2s ease;
          box-shadow: 0 4px 16px rgba(26,92,200,.35);
        }
        .lms-btn:hover { background: var(--blue-800); transform: translateY(-2px); }
      `}</style>

      <PageHero
        title="Learning Management System"
        subtitle="Platform pembelajaran digital SMP Negeri 8 Probolinggo."
        breadcrumbs={[{ label: 'LMS' }]}
        accent="💻"
      />

      <section className="lms-section">
        <div className="container">
          <div className="lms-card">
            <span className="lms-icon">🎓</span>
            <h2 className="lms-title">Portal Pembelajaran Digital</h2>
            <p className="lms-desc">
              Akses materi pelajaran, tugas, ujian, dan komunikasi dengan guru melalui platform LMS
              SMP Negeri 8 Probolinggo. Login menggunakan akun yang diberikan oleh sekolah.
            </p>
            <div className="lms-features">
              <span className="lms-feature">Materi pelajaran online</span>
              <span className="lms-feature">Tugas & pengumpulan digital</span>
              <span className="lms-feature">Ujian berbasis komputer</span>
              <span className="lms-feature">Forum diskusi</span>
              <span className="lms-feature">Nilai & raport online</span>
              <span className="lms-feature">Komunikasi guru–siswa</span>
            </div>
            <a
              href="https://lms.smpn8prob.sch.id"
              target="_blank"
              rel="noopener noreferrer"
              className="lms-btn"
            >
              🚀 Masuk ke LMS
            </a>
            <p style={{ marginTop: '1rem', fontSize: '.78rem', color: 'var(--gray-400)' }}>
              Belum punya akun? Hubungi wali kelas atau administrasi sekolah.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
