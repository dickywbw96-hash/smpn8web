import type { Metadata } from 'next'
import PageHero from '@/components/ui/PageHero'
import { getGuruList } from '@/lib/db'
import type { Guru } from '@/lib/db'

export const metadata: Metadata = { title: 'Guru & TAS' }
export const revalidate = 300

export default async function GuruTASPage() {
  const all  = await getGuruList()
  const guru = all.filter((g) => g.type === 'guru' || !g.type)
  const tas  = all.filter((g) => g.type === 'tas')

  return (
    <>
      <style>{`
        .guru-section { padding: 4rem 0; }
        .guru-tabs {
          display: flex;
          gap: .5rem;
          margin-bottom: 2rem;
          border-bottom: 2px solid var(--gray-100);
        }
        .guru-tab {
          padding: .65rem 1.5rem;
          font-weight: 700;
          font-size: .875rem;
          color: var(--gray-500);
          border: none;
          background: none;
          cursor: pointer;
          border-bottom: 3px solid transparent;
          margin-bottom: -2px;
          transition: all .2s ease;
          text-decoration: none;
        }
        .guru-tab.active { color: var(--blue-700); border-bottom-color: var(--blue-600); }
        .guru-tab:hover  { color: var(--blue-600); }
        .guru-table-wrap {
          background: white;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-md);
          overflow: hidden;
        }
        .guru-table {
          width: 100%;
          border-collapse: collapse;
          font-size: .875rem;
        }
        .guru-table thead tr {
          background: linear-gradient(135deg, var(--blue-900), var(--blue-700));
          color: white;
        }
        .guru-table thead th {
          padding: 1rem 1.25rem;
          text-align: left;
          font-weight: 700;
          font-size: .8rem;
          letter-spacing: .05em;
          text-transform: uppercase;
        }
        .guru-table tbody tr {
          border-bottom: 1px solid var(--gray-100);
          transition: background .15s;
        }
        .guru-table tbody tr:hover { background: var(--blue-50); }
        .guru-table tbody tr:last-child { border-bottom: none; }
        .guru-table td { padding: .9rem 1.25rem; color: var(--gray-700); }
        .guru-table td:first-child { color: var(--gray-400); font-size: .8rem; width: 48px; text-align: center; }
        .guru-table td:nth-child(2) { font-weight: 600; color: var(--gray-900); }
        .guru-badge {
          background: var(--blue-100);
          color: var(--blue-800);
          padding: .2rem .65rem;
          border-radius: 100px;
          font-size: .72rem;
          font-weight: 700;
        }
        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          color: var(--gray-500);
        }
        .empty-state .icon { font-size: 3rem; margin-bottom: 1rem; display: block; }
        .section-title {
          font-family: 'Playfair Display', serif;
          color: var(--blue-900);
          font-size: 1.3rem;
          margin-bottom: 1.25rem;
        }
        .guru-count {
          display: inline-block;
          background: var(--blue-100);
          color: var(--blue-700);
          font-size: .72rem;
          font-weight: 700;
          padding: .15rem .65rem;
          border-radius: 100px;
          margin-left: .6rem;
          vertical-align: middle;
        }
      `}</style>

      <PageHero
        title="Guru & Tenaga Administrasi Sekolah"
        subtitle="Daftar tenaga pendidik dan kependidikan SMP Negeri 8 Probolinggo."
        breadcrumbs={[{ label: 'Profil', href: '/profil' }, { label: 'Guru & TAS' }]}
        accent="👩‍🏫"
      />

      <section className="guru-section">
        <div className="container">
          <div className="guru-tabs">
            <a href="#guru" className="guru-tab active">Guru / Pendidik</a>
            <a href="#tas" className="guru-tab">Tenaga Administrasi</a>
          </div>

          {/* ── Tabel Guru ── */}
          <div id="guru">
            <h3 className="section-title">
              Daftar Guru
              <span className="guru-count">{guru.length} orang</span>
            </h3>
            <div className="guru-table-wrap">
              {guru.length === 0 ? (
                <div className="empty-state">
                  <span className="icon">📋</span>
                  <p>Data guru akan ditampilkan setelah diisi oleh administrator.</p>
                </div>
              ) : (
                <table className="guru-table">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Nama</th>
                      <th>Mata Pelajaran</th>
                      <th>Jabatan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {guru.map((g, i) => (
                      <tr key={g.id}>
                        <td>{i + 1}</td>
                        <td>{g.name}</td>
                        <td>
                          {g.subject
                            ? <span className="guru-badge">{g.subject}</span>
                            : <span style={{ color: 'var(--gray-300)' }}>—</span>
                          }
                        </td>
                        <td>{g.position ?? <span style={{ color: 'var(--gray-300)' }}>—</span>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* ── Tabel TAS ── */}
          <div id="tas" style={{ marginTop: '3rem' }}>
            <h3 className="section-title">
              Tenaga Administrasi Sekolah
              <span className="guru-count">{tas.length} orang</span>
            </h3>
            <div className="guru-table-wrap">
              {tas.length === 0 ? (
                <div className="empty-state">
                  <span className="icon">📋</span>
                  <p>Data TAS akan ditampilkan setelah diisi oleh administrator.</p>
                </div>
              ) : (
                <table className="guru-table">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Nama</th>
                      <th>Jabatan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tas.map((t, i) => (
                      <tr key={t.id}>
                        <td>{i + 1}</td>
                        <td>{t.name}</td>
                        <td>{t.position ?? <span style={{ color: 'var(--gray-300)' }}>—</span>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

        </div>
      </section>
    </>
  )
}