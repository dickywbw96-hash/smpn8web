import type { Metadata } from 'next'
import PageHero from '@/components/ui/PageHero'

export const metadata: Metadata = { title: 'SPMB' }
export const revalidate = 300

const JALUR = [
  { icon: '📍', name: 'Jalur Zonasi', desc: 'Penerimaan berdasarkan jarak tempat tinggal calon siswa dengan sekolah.' },
  { icon: '🏆', name: 'Jalur Prestasi', desc: 'Penerimaan berdasarkan prestasi akademik dan non-akademik.' },
  { icon: '💼', name: 'Jalur Afirmasi', desc: 'Penerimaan untuk calon siswa dari keluarga tidak mampu.' },
  { icon: '🔄', name: 'Jalur Mutasi', desc: 'Penerimaan untuk calon siswa yang berpindah domisili.' },
]

const TIMELINE = [
  { fase: 'Pendaftaran Online', tanggal: 'Lihat pengumuman resmi', status: 'coming' },
  { fase: 'Verifikasi Berkas', tanggal: 'Lihat pengumuman resmi', status: 'coming' },
  { fase: 'Pengumuman Hasil', tanggal: 'Lihat pengumuman resmi', status: 'coming' },
  { fase: 'Daftar Ulang', tanggal: 'Lihat pengumuman resmi', status: 'coming' },
]

export default function SpmbPage() {
  return (
    <>
      <style>{`
        .spmb-section { padding: 4rem 0; background: var(--blue-50); }
        .spmb-jalur-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.25rem; margin-top: 2rem; }
        .spmb-jalur-card {
          background: white; border-radius: var(--radius-lg);
          padding: 1.75rem; box-shadow: var(--shadow-sm); border: 1px solid var(--gray-100);
          display: flex; gap: 1rem; align-items: flex-start;
          transition: all .25s; cursor: default;
        }
        .spmb-jalur-card:hover { box-shadow: var(--shadow-xl); transform: translateY(-3px); border-color: var(--blue-200); }
        .spmb-jalur-icon { font-size: 2rem; flex-shrink: 0; }
        .spmb-jalur-name { font-weight: 800; color: var(--blue-900); font-size: 1rem; margin-bottom: .3rem; }
        .spmb-jalur-desc { font-size: .85rem; color: var(--gray-500); line-height: 1.6; }
        .spmb-timeline { margin-top: 2rem; display: flex; flex-direction: column; gap: 0; }
        .spmb-timeline-item {
          display: flex; gap: 1.25rem; align-items: flex-start;
          padding: 1.25rem 0; border-bottom: 1px solid var(--gray-100);
          position: relative;
        }
        .spmb-timeline-item:last-child { border-bottom: none; }
        .spmb-tl-dot {
          width: 14px; height: 14px; border-radius: 50%;
          background: var(--gray-200); border: 3px solid var(--gray-300);
          flex-shrink: 0; margin-top: .35rem;
        }
        .spmb-tl-dot.active { background: var(--blue-600); border-color: var(--blue-300); }
        .spmb-tl-fase { font-weight: 700; color: var(--gray-900); font-size: .9rem; }
        .spmb-tl-date { font-size: .8rem; color: var(--gray-400); margin-top: .2rem; }
        .syarat-list { list-style: none; display: flex; flex-direction: column; gap: .6rem; margin-top: 1rem; }
        .syarat-item { display: flex; gap: .75rem; font-size: .875rem; color: var(--gray-700); align-items: flex-start; }
        .syarat-item::before { content: '✓'; color: var(--green); font-weight: 800; margin-top: .05rem; flex-shrink: 0; }
        .spmb-cta-box {
          background: linear-gradient(135deg, var(--blue-900), var(--blue-700));
          border-radius: var(--radius-lg); padding: 2.5rem;
          text-align: center; color: white; margin-top: 2.5rem;
        }
        @media (max-width: 640px) { .spmb-jalur-grid { grid-template-columns: 1fr; } }
      `}</style>

      <PageHero
        title="SPMB"
        subtitle="Sistem Penerimaan Murid Baru SMP Negeri 8 Probolinggo."
        breadcrumbs={[{ label: 'SPMB' }]}
        accent="🎓"
      />

      <section className="spmb-section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
            {/* Jalur */}
            <div>
              <span className="section-label">Pendaftaran</span>
              <h2 className="section-title" style={{ fontSize: '1.5rem', marginBottom: '.5rem' }}>Jalur Penerimaan</h2>
              <p className="section-subtitle">Tersedia 4 jalur penerimaan sesuai kebijakan pemerintah.</p>
              <div className="spmb-jalur-grid">
                {JALUR.map((j, i) => (
                  <div key={i} className="spmb-jalur-card">
                    <span className="spmb-jalur-icon">{j.icon}</span>
                    <div>
                      <div className="spmb-jalur-name">{j.name}</div>
                      <div className="spmb-jalur-desc">{j.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline + Syarat */}
            <div>
              <span className="section-label">Jadwal</span>
              <h2 className="section-title" style={{ fontSize: '1.5rem', marginBottom: '.5rem' }}>Tahapan SPMB</h2>
              <div className="spmb-timeline">
                {TIMELINE.map((t, i) => (
                  <div key={i} className="spmb-timeline-item">
                    <div className={`spmb-tl-dot${t.status === 'active' ? ' active' : ''}`} />
                    <div>
                      <div className="spmb-tl-fase">{t.fase}</div>
                      <div className="spmb-tl-date">📅 {t.tanggal}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '2rem' }}>
                <h4 style={{ color: 'var(--blue-900)', fontWeight: 800, marginBottom: '.75rem' }}>📋 Persyaratan Umum</h4>
                <ul className="syarat-list">
                  <li className="syarat-item">Ijazah / Surat Keterangan Lulus SD/MI</li>
                  <li className="syarat-item">Akta Kelahiran</li>
                  <li className="syarat-item">Kartu Keluarga</li>
                  <li className="syarat-item">Pas foto 3×4 (berwarna)</li>
                  <li className="syarat-item">Surat keterangan domisili (jalur zonasi)</li>
                  <li className="syarat-item">Piagam/sertifikat prestasi (jalur prestasi)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="spmb-cta-box">
            <h3 style={{ fontFamily: 'Playfair Display,serif', fontSize: '1.5rem', marginBottom: '.5rem' }}>
              Butuh Informasi Lebih Lanjut?
            </h3>
            <p style={{ opacity: .8, marginBottom: '1.5rem', fontSize: '.95rem' }}>
              Hubungi panitia SPMB atau kunjungi langsung kantor administrasi sekolah.
            </p>
            <a href="/kontak" style={{
              background: '#e8a31a', color: '#030f2b',
              padding: '.8rem 2rem', borderRadius: '100px',
              textDecoration: 'none', fontWeight: 800, fontSize: '.95rem',
              display: 'inline-block',
            }}>
              Hubungi Kami →
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
