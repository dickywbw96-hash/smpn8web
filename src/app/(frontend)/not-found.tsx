import Link from 'next/link'

export default function NotFound() {
  return (
    <>
      <style>{`
        .notfound {
          min-height: 80vh;
          display: flex; align-items: center; justify-content: center;
          background: linear-gradient(135deg, var(--blue-50) 0%, white 100%);
          padding: 4rem 1.5rem;
        }
        .notfound-inner { text-align: center; max-width: 480px; }
        .notfound-code {
          font-family: 'Playfair Display', serif;
          font-size: 8rem; font-weight: 700;
          color: var(--blue-200); line-height: 1;
          margin-bottom: 0;
        }
        .notfound-title { font-family: 'Playfair Display', serif; color: var(--blue-900); font-size: 1.75rem; margin-bottom: .75rem; font-weight: 700; }
        .notfound-desc { color: var(--gray-500); margin-bottom: 2rem; line-height: 1.7; }
        .notfound-links { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
        .notfound-btn-primary {
          background: var(--blue-700); color: white;
          padding: .75rem 1.75rem; border-radius: 100px;
          text-decoration: none; font-weight: 700; font-size: .9rem;
          transition: all .2s;
        }
        .notfound-btn-primary:hover { background: var(--blue-800); transform: translateY(-1px); }
        .notfound-btn-outline {
          border: 2px solid var(--blue-300); color: var(--blue-700);
          padding: .75rem 1.75rem; border-radius: 100px;
          text-decoration: none; font-weight: 700; font-size: .9rem;
          transition: all .2s;
        }
        .notfound-btn-outline:hover { background: var(--blue-50); }
      `}</style>

      <div className="notfound">
        <div className="notfound-inner">
          <div className="notfound-code">404</div>
          <h1 className="notfound-title">Halaman Tidak Ditemukan</h1>
          <p className="notfound-desc">
            Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.
            Coba kembali ke beranda atau gunakan menu navigasi.
          </p>
          <div className="notfound-links">
            <Link href="/" className="notfound-btn-primary">← Ke Beranda</Link>
            <Link href="/berita" className="notfound-btn-outline">Lihat Berita</Link>
          </div>
        </div>
      </div>
    </>
  )
}
