import type { Metadata } from 'next'
import PageHero from '@/components/ui/PageHero'
import { getSiteSettings } from '@/lib/db'

export const metadata: Metadata = { title: 'Kontak' }
export const revalidate = 300

export default async function KontakPage() {
  const settings = await getSiteSettings()
  const s = settings

  return (
    <>
      <style>{`
        .kontak-section { padding: 4rem 0; background: var(--blue-50); }
        .kontak-grid {
          display: grid;
          grid-template-columns: 1fr 1.4fr;
          gap: 3rem;
          align-items: start;
        }
        .kontak-info-list { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 2rem; }
        .kontak-info-item {
          display: flex; gap: 1rem; align-items: flex-start;
          background: white; padding: 1.25rem;
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-sm);
          border: 1px solid var(--gray-100);
        }
        .kontak-info-icon {
          width: 42px; height: 42px;
          background: var(--blue-100); border-radius: var(--radius-sm);
          display: flex; align-items: center; justify-content: center;
          font-size: 1.2rem; flex-shrink: 0;
        }
        .kontak-info-label { font-size: .75rem; color: var(--gray-400); font-weight: 600; text-transform: uppercase; letter-spacing: .08em; }
        .kontak-info-val { font-size: .92rem; color: var(--gray-900); font-weight: 600; margin-top: .15rem; line-height: 1.5; }
        .kontak-info-val a { color: var(--blue-600); text-decoration: none; }
        .kontak-info-val a:hover { text-decoration: underline; }
        /* Form */
        .kontak-form-card {
          background: white; border-radius: var(--radius-lg);
          padding: 2rem; box-shadow: var(--shadow-md);
          border: 1px solid var(--gray-100);
        }
        .form-group { margin-bottom: 1.25rem; }
        .form-label { display: block; font-size: .82rem; font-weight: 700; color: var(--gray-700); margin-bottom: .45rem; }
        .form-input, .form-textarea {
          width: 100%; padding: .7rem 1rem;
          border: 2px solid var(--gray-200);
          border-radius: var(--radius-sm);
          font-family: var(--font-body);
          font-size: .9rem; color: var(--gray-900);
          transition: border-color .2s ease;
          outline: none; background: white;
        }
        .form-input:focus, .form-textarea:focus { border-color: var(--blue-400); }
        .form-textarea { min-height: 140px; resize: vertical; }
        .form-submit {
          width: 100%;
          background: var(--blue-700);
          color: white; font-weight: 700; font-size: .95rem;
          padding: .85rem;
          border: none; border-radius: var(--radius-md);
          cursor: pointer; transition: all .2s ease;
          font-family: var(--font-body);
        }
        .form-submit:hover { background: var(--blue-800); transform: translateY(-1px); }
        /* Map */
        .kontak-map {
          border-radius: var(--radius-lg); overflow: hidden;
          box-shadow: var(--shadow-md); margin-top: 1.5rem;
          border: 2px solid var(--gray-100);
          height: 300px;
          background: var(--blue-50);
          display: flex; align-items: center; justify-content: center;
          color: var(--gray-400);
        }
        .kontak-map iframe { width: 100%; height: 100%; border: none; }
        @media (max-width: 768px) { .kontak-grid { grid-template-columns: 1fr; } }
      `}</style>

      <PageHero
        title="Hubungi Kami"
        subtitle="Kami siap membantu. Jangan ragu untuk menghubungi sekolah kami."
        breadcrumbs={[{ label: 'Kontak' }]}
        accent="📞"
      />

      <section className="kontak-section">
        <div className="container">
          <div className="kontak-grid">
            {/* Info */}
            <div>
              <span className="section-label">Informasi</span>
              <h2 className="section-title" style={{ marginBottom: '1.5rem' }}>Informasi Kontak</h2>

              <div className="kontak-info-list">
                <div className="kontak-info-item">
                  <div className="kontak-info-icon">📍</div>
                  <div>
                    <div className="kontak-info-label">Alamat</div>
                    <div className="kontak-info-val">
                      {s?.address?.street ?? 'Alamat belum diisi'}<br />
                      {s?.address?.kelurahan && `Kel. ${s.address.kelurahan}, `}
                      {s?.address?.kecamatan && `Kec. ${s.address.kecamatan}`}<br />
                      {s?.address?.city ?? 'Probolinggo'}, {s?.address?.province ?? 'Jawa Timur'} {s?.address?.postalCode}
                    </div>
                  </div>
                </div>
                <div className="kontak-info-item">
                  <div className="kontak-info-icon">📞</div>
                  <div>
                    <div className="kontak-info-label">Telepon</div>
                    <div className="kontak-info-val">
                      <a href={`tel:${s?.contact?.phone}`}>{s?.contact?.phone ?? 'Belum diisi'}</a>
                    </div>
                  </div>
                </div>
                <div className="kontak-info-item">
                  <div className="kontak-info-icon">✉️</div>
                  <div>
                    <div className="kontak-info-label">Email</div>
                    <div className="kontak-info-val">
                      <a href={`mailto:${s?.contact?.email}`}>{s?.contact?.email ?? 'Belum diisi'}</a>
                    </div>
                  </div>
                </div>
                {s?.contact?.whatsapp && (
                  <div className="kontak-info-item">
                    <div className="kontak-info-icon">💬</div>
                    <div>
                      <div className="kontak-info-label">WhatsApp</div>
                      <div className="kontak-info-val">
                        <a href={`https://wa.me/${s.contact.whatsapp}`} target="_blank" rel="noopener">
                          Chat via WhatsApp
                        </a>
                      </div>
                    </div>
                  </div>
                )}
                <div className="kontak-info-item">
                  <div className="kontak-info-icon">🕐</div>
                  <div>
                    <div className="kontak-info-label">Jam Operasional</div>
                    <div className="kontak-info-val">Senin – Jumat: 07.00 – 15.00 WIB</div>
                  </div>
                </div>
              </div>

              {/* Google Maps */}
              <div className="kontak-map">
                {s?.address?.mapsUrl ? (
                  <iframe
                    src={s.address.mapsUrl}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Lokasi SMPN 8 Probolinggo"
                  />
                ) : (
                  <div style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: '2rem', display: 'block', marginBottom: '.5rem' }}>🗺️</span>
                    <p style={{ fontSize: '.85rem' }}>Tambahkan URL Google Maps di pengaturan admin</p>
                  </div>
                )}
              </div>
            </div>

            {/* Form */}
            <div className="kontak-form-card">
              <h3 style={{ fontFamily: 'Playfair Display,serif', color: 'var(--blue-900)', fontSize: '1.3rem', marginBottom: '.5rem' }}>
                Kirim Pesan
              </h3>
              <p style={{ color: 'var(--gray-500)', fontSize: '.875rem', marginBottom: '1.75rem' }}>
                Isi formulir di bawah ini dan kami akan segera merespons pesan Anda.
              </p>
              <form>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Nama Lengkap *</label>
                    <input type="text" className="form-input" placeholder="Nama Anda" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email *</label>
                    <input type="email" className="form-input" placeholder="email@contoh.com" required />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Nomor Telepon</label>
                  <input type="tel" className="form-input" placeholder="08xxxxxxxxxx" />
                </div>
                <div className="form-group">
                  <label className="form-label">Subjek *</label>
                  <input type="text" className="form-input" placeholder="Perihal pesan" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Pesan *</label>
                  <textarea className="form-textarea" placeholder="Tulis pesan Anda di sini..." required />
                </div>
                <button type="submit" className="form-submit">Kirim Pesan →</button>
                <p style={{ textAlign: 'center', fontSize: '.75rem', color: 'var(--gray-400)', marginTop: '.75rem' }}>
                  * Wajib diisi. Data Anda aman dan tidak akan disebarkan.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
