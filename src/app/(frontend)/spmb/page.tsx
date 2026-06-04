'use client'

import { useState, useRef } from 'react'
import PageHero from '@/components/ui/PageHero'

/* ─── DATA ─────────────────────────────────────────────────────────────── */

const TABS = [
  { id: 'beranda',  label: '🏠 Beranda & Jadwal' },
  { id: 'jalur',   label: '🚪 Jalur Penerimaan' },
  { id: 'kuota',   label: '🏫 Kuota & Wilayah' },
  { id: 'syarat',  label: '📋 Syarat & Ketentuan' },
  { id: 'tatacara',label: '📲 Tata Cara Daftar' },
  { id: 'prestasi',label: '🏆 Bobot Prestasi' },
  { id: 'larangan',label: '🚫 Larangan & Aduan' },
]

const TIMELINE = [
  {
    date: '20 Mei – 13 Juni 2026',
    phase: 'Sosialisasi SPMB kepada Masyarakat',
    desc: 'Dilaksanakan oleh Disdikbud, satuan pendidikan TK/RA, SD/MI, SMP, Kecamatan, dan Kelurahan se-Kota Probolinggo.',
    status: 'done',
    badge: '✔ Selesai',
  },
  {
    date: '17 Juni – 20 Juni 2026',
    phase: 'Pendaftaran Jalur Afirmasi, Mutasi & Prestasi',
    desc: 'Afirmasi & Prestasi: Online di spmb.probolinggokota.go.id — isi data, pilih 3 sekolah, unggah dokumen. Mutasi: Offline di sekolah tujuan — isi formulir, serahkan fotokopi dokumen.',
    status: 'now',
    badge: '⚡ Sedang Berlangsung',
  },
  {
    date: '22 Juni 2026 — Pukul 13.00 WIB',
    phase: 'Pengumuman Jalur Afirmasi, Mutasi & Prestasi',
    desc: 'Hasil diumumkan di website SPMB dan ditempel di semua SMP Negeri. Calon murid yang diterima di tahap ini tidak bisa mendaftar Jalur Domisili.',
    status: 'upcoming',
    badge: 'Online + Papan Pengumuman',
  },
  {
    date: '1 – 4 Juli 2026',
    phase: 'Pendaftaran Jalur Domisili',
    desc: 'Online di portal SPMB menggunakan NIK/NISN. Kirim softcopy Akta Lahir dan KK ke sekolah pilihan pertama. Seleksi berdasarkan wilayah kecamatan domisili.',
    status: 'upcoming',
    badge: 'Online',
  },
  {
    date: '1 – 4 Juli 2026',
    phase: 'Masa Uji Publik',
    desc: 'Disdikbud mempublikasikan hasil pendaftaran kumulatif (tanpa peringkat) secara online untuk diuji publik. Masyarakat dapat memverifikasi kebenaran data calon murid.',
    status: 'upcoming',
    badge: 'Bersamaan dg Pendaftaran Domisili',
  },
  {
    date: '6 Juli 2026 — Pukul 13.00 WIB',
    phase: 'Pengumuman Jalur Domisili',
    desc: 'Hasil seleksi Domisili diumumkan online dan ditempel di seluruh SMP Negeri. Siapkan dokumen untuk daftar ulang.',
    status: 'upcoming',
    badge: 'Online + Papan Pengumuman',
  },
  {
    date: '8 – 11 Juli 2026',
    phase: 'Daftar Ulang',
    desc: 'Wajib dilakukan secara online di portal SPMB DAN offline di sekolah tujuan. Gratis, tidak dipungut biaya apapun. Bawa dokumen lengkap (Bukti Penerimaan, SKL, NISN, Akta Lahir, KK).',
    status: 'upcoming',
    badge: 'Online + Offline',
  },
  {
    date: '13 Juli 2026',
    phase: 'Awal Tahun Ajaran 2026/2027',
    desc: 'Hari pertama masuk sekolah. Dilanjutkan Masa Pengenalan Lingkungan Sekolah (MPLS): 13–15 Juli 2026.',
    status: 'upcoming',
    badge: '🎒 MPLS: 13–15 Juli 2026',
  },
]

const JALUR = [
  {
    icon: '🤝',
    name: 'Jalur Afirmasi',
    kuota: '20%–25% kuota',
    mode: 'Online (Daring)',
    color: 'blue',
    desc: 'Untuk calon murid dari keluarga ekonomi tidak mampu (terdaftar DTSEN) dan/atau penyandang disabilitas kategori ringan yang telah diverifikasi Disdikbud & Dinsos PPPA.',
  },
  {
    icon: '🔄',
    name: 'Jalur Mutasi',
    kuota: 'Maks. 5% kuota',
    mode: 'Offline (Luring)',
    color: 'amber',
    desc: 'Untuk calon murid yang berpindah domisili karena mutasi/pindah tugas orang tua. Surat penugasan diterbitkan maksimal 1 tahun sebelum pendaftaran. Anak guru mendaftar di sekolah tempat orang tua bertugas.',
  },
  {
    icon: '🏆',
    name: 'Jalur Prestasi',
    kuota: '25%–30% kuota',
    mode: 'Online (Daring)',
    color: 'green',
    desc: 'Berdasarkan peringkat rapor (semester 7–11), nilai TKA 2026, hafalan Al-Quran min. 1 juz, atau piagam kejuaraan akademik/nonakademik berjenjang. Pilih 3 sekolah berbeda.',
  },
  {
    icon: '📍',
    name: 'Jalur Domisili',
    kuota: 'Min. 40% kuota',
    mode: 'Online (Daring)',
    color: 'red',
    desc: 'Berdasarkan wilayah kecamatan tempat tinggal sesuai KK. Dilaksanakan setelah ketiga jalur lain selesai. Sisa kuota jalur lain dialihkan ke sini, diprioritaskan keluarga tidak mampu.',
  },
]

const SCHOOLS = [
  { no: 1,  name: 'SMP Negeri 1',    addr: 'Jl. Imam Bonjol No. 49',       kec: 'Mayangan',  rombel: 7, kuota: 224, border: false },
  { no: 2,  name: 'SMP Negeri 2',    addr: 'Jl. Dr. Moch Saleh No. 7',     kec: 'Kanigaran', rombel: 5, kuota: 160, border: false },
  { no: 3,  name: 'SMP Negeri 3 ✦',  addr: 'Jl. Hayam Wuruk No. 155',      kec: 'Mayangan',  rombel: 7, kuota: 224, border: true  },
  { no: 4,  name: 'SMP Negeri 4 ✦',  addr: 'Jl. Sunan Ampel No. 253',      kec: 'Kedopok',   rombel: 8, kuota: 256, border: true  },
  { no: 5,  name: 'SMP Negeri 5',    addr: 'Jl. Cokroaminoto No. 26',      kec: 'Kanigaran', rombel: 7, kuota: 224, border: false },
  { no: 6,  name: 'SMP Negeri 6 ✦',  addr: 'Jl. Kedondong No. 4',         kec: 'Kedopok',   rombel: 6, kuota: 192, border: true  },
  { no: 7,  name: 'SMP Negeri 7',    addr: 'Jl. Wali Kota Gatot No. 181',  kec: 'Kanigaran', rombel: 7, kuota: 224, border: false },
  { no: 8,  name: 'SMP Negeri 8 ✦',  addr: 'Jl. Salak No. 137',           kec: 'Wonoasih',  rombel: 6, kuota: 192, border: true  },
  { no: 9,  name: 'SMP Negeri 9',    addr: 'Jl. Cokroaminoto No. 11',      kec: 'Kanigaran', rombel: 8, kuota: 256, border: false },
  { no: 10, name: 'SMP Negeri 10 ✦', addr: 'Jl. Soekarno Hatta No. 263Q', kec: 'Kanigaran', rombel: 7, kuota: 224, border: true  },
]

const DOMISILI = [
  { school: 'SMP N 1',    areas: [{ kec:'Mayangan', pct:60 },{ kec:'Kanigaran', pct:35 }] },
  { school: 'SMP N 2',    areas: [{ kec:'Mayangan', pct:55 },{ kec:'Kanigaran', pct:45 }] },
  { school: 'SMP N 3 ✦', areas: [{ kec:'Mayangan', pct:60 },{ kec:'Kanigaran', pct:30 },{ kec:'Kedopok', pct:5 },{ kec:'Luar Kota', pct:5 }] },
  { school: 'SMP N 4 ✦', areas: [{ kec:'Kedopok', pct:30 },{ kec:'Kanigaran', pct:30 },{ kec:'Wonoasih', pct:35 },{ kec:'Luar Kota', pct:5 }] },
  { school: 'SMP N 5',    areas: [{ kec:'Kanigaran', pct:60 },{ kec:'Kedopok', pct:25 },{ kec:'Mayangan', pct:10 },{ kec:'Wonoasih', pct:5 }] },
  { school: 'SMP N 6 ✦', areas: [{ kec:'Kedopok', pct:60 },{ kec:'Wonoasih', pct:20 },{ kec:'Kademangan', pct:15 },{ kec:'Luar Kota', pct:5 }] },
  { school: 'SMP N 7',    areas: [{ kec:'Kanigaran', pct:50 },{ kec:'Kademangan', pct:15 },{ kec:'Kedopok', pct:35 }] },
  { school: 'SMP N 8 ✦', areas: [{ kec:'Wonoasih', pct:65 },{ kec:'Kedopok', pct:30 },{ kec:'Luar Kota', pct:5 }] },
  { school: 'SMP N 9',    areas: [{ kec:'Kanigaran', pct:70 },{ kec:'Mayangan', pct:25 },{ kec:'Kedopok', pct:5 }] },
  { school: 'SMP N 10 ✦',areas: [{ kec:'Kanigaran', pct:40 },{ kec:'Mayangan', pct:30 },{ kec:'Kademangan', pct:25 },{ kec:'Luar Kota', pct:5 }] },
]

const SYARAT_UMUM = [
  'Usia maksimal 15 tahun per 1 Juli 2026 (kecuali penyandang disabilitas)',
  'Telah menyelesaikan kelas 6 SD/MI atau Paket A — dibuktikan Ijazah atau SKL',
  'Akta Kelahiran atau surat keterangan lahir yang sah dan dilegalisasi',
  'Kartu Keluarga yang mencantumkan nama calon murid, terbit sebelum/pada 30 Juni 2025',
  'Nama orang tua/wali di KK harus sama dengan yang ada di ijazah/akta lahir',
  'Calon murid dari keluarga tidak mampu wajib terdaftar dalam DTSEN',
  'KK yang terbit setelah 30 Juni 2025 tetap berlaku jika perubahannya bukan karena perpindahan domisili — disertai KK lama atau surat kepolisian',
  'Bila KK tidak ada karena bencana alam/sosial: ganti dengan SUKET dari Kepala Kelurahan + surat keputusan BPBD',
]

const DAFTAR_ULANG_DOCS = [
  'Bukti Pendaftaran / Bukti Penerimaan',
  'Surat Keterangan Lulus dari jenjang sebelumnya',
  'Fotokopi NISN (tunjukkan asli)',
  'Fotokopi Akta Lahir (tunjukkan asli)',
  'Fotokopi Kartu Keluarga (tunjukkan asli)',
  'Fotokopi Surat Keterangan DTSEN (jika ada)',
  'Fotokopi Piagam Prestasi (jika ada)',
  'Surat Rekomendasi dari Dinas Pendidikan asal (bagi murid dari luar kota)',
]

/* ─── HELPERS ───────────────────────────────────────────────────────────── */

function CheckList({ items, cross = false }: { items: string[]; cross?: boolean }) {
  return (
    <ul className="spmb-checklist">
      {items.map((item, i) => (
        <li key={i} className={cross ? 'cross' : ''}>
          <span className="mark">{cross ? '✗' : '✓'}</span>
          <span dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') }} />
        </li>
      ))}
    </ul>
  )
}

function Alert({ type, children }: { type: 'blue' | 'amber' | 'green' | 'red'; children: React.ReactNode }) {
  return <div className={`spmb-alert spmb-alert-${type}`}>{children}</div>
}

function SectionHead({ icon, title }: { icon: string; title: string }) {
  return (
    <div className="spmb-sh">
      <span className="spmb-sh-icon">{icon}</span>
      <h3 className="spmb-sh-title">{title}</h3>
    </div>
  )
}

/* ─── TAB CONTENT COMPONENTS ───────────────────────────────────────────── */

function TabBeranda() {
  return (
    <div>
      <a href="https://spmb.probolinggokota.go.id" className="spmb-portal-btn" target="_blank" rel="noreferrer">
        <span>🌐</span>
        <span>Buka Portal Pendaftaran SPMB</span>
        <span className="arrow">→</span>
      </a>
      <Alert type="amber">
        <strong>⏰ Jam Layanan Panitia: 07.00 – 14.30 WIB</strong> (Senin–Jumat hari kerja). Pendaftaran online dapat dilakukan kapan saja melalui portal di atas.
      </Alert>

      <div className="spmb-qstrip">
        {[
          { icon:'📅', label:'Daftar Afirmasi/Mutasi/Prestasi', val:'17–20 Jun 2026', gold:true },
          { icon:'📣', label:'Pengumuman Jalur Awal',           val:'22 Jun 2026' },
          { icon:'📍', label:'Daftar Jalur Domisili',           val:'1–4 Jul 2026' },
          { icon:'📋', label:'Daftar Ulang',                    val:'8–11 Jul 2026' },
          { icon:'🎒', label:'Masuk Sekolah',                   val:'13 Jul 2026' },
        ].map((q, i) => (
          <div key={i} className="spmb-qbox">
            <span className="spmb-qbox-icon">{q.icon}</span>
            <span className="spmb-qbox-label">{q.label}</span>
            <span className={`spmb-qbox-val${q.gold ? ' gold' : ''}`}>{q.val}</span>
          </div>
        ))}
      </div>

      <SectionHead icon="📅" title="Jadwal & Tahapan SPMB" />
      <div className="spmb-card" style={{ padding: '1.5rem' }}>
        <div className="spmb-tl">
          {TIMELINE.map((t, i) => (
            <div key={i} className="spmb-tli">
              <span className={`spmb-tldot ${t.status}`} />
              <div>
                <div className={`spmb-tldate ${t.status === 'now' ? 'now' : t.status === 'done' ? '' : 'gray'}`}>{t.date}</div>
                <div className="spmb-tlphase">{t.phase}</div>
                <div className="spmb-tldesc">{t.desc}</div>
                <span className={`spmb-tlbadge ${t.status === 'now' ? 'gold' : t.status === 'done' ? 'gray' : 'blue'}`}>{t.badge}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Alert type="blue">
        <strong>ℹ️</strong> Jika kuota belum terpenuhi, pendaftaran dapat diperpanjang sesuai peraturan yang berlaku.
      </Alert>
    </div>
  )
}

function TabJalur() {
  return (
    <div>
      <SectionHead icon="🚪" title="4 Jalur Penerimaan SMP" />
      <div className="spmb-grid2">
        {JALUR.map((j, i) => (
          <div key={i} className={`spmb-jalur-card color-${j.color}`}>
            <div className="spmb-jalur-top">
              <span className="spmb-jalur-emoji">{j.icon}</span>
              <span className="spmb-jalur-name">{j.name}</span>
            </div>
            <p className="spmb-jalur-desc">{j.desc}</p>
            <div className="spmb-pills">
              <span className={`spmb-pill pill-${j.color}`}>{j.kuota}</span>
              <span className={`spmb-pill pill-${j.color}`}>{j.mode}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '1.75rem' }}>
        <SectionHead icon="⚙️" title="Ketentuan Penting Antar Jalur" />
        <div className="spmb-card">
          <CheckList items={[
            'Calon murid yang sudah **diterima** di Jalur Afirmasi, Mutasi, atau Prestasi **tidak boleh** mendaftar lagi di Jalur Domisili',
            'Calon murid yang sudah diterima di Satuan Pendidikan **Swasta** tidak dapat mengikuti SPMB Satuan Pendidikan Negeri',
            'Sisa kuota Jalur Afirmasi/Mutasi/Prestasi yang tidak terisi **dialihkan ke Jalur Domisili**, diprioritaskan calon murid tidak mampu yang belum diterima',
            'Calon murid wajib memilih **3 Satuan Pendidikan berbeda** (berurutan prioritas) pada jalur Afirmasi, Prestasi, dan Domisili',
            'Setiap Satuan Pendidikan dapat menerima paling banyak **5 calon murid tanpa seleksi** (hafidz ≥3 juz / juara prestasi istimewa)',
          ]} />
        </div>
      </div>

      <Alert type="blue">
        <strong>💡 Pendampingan Digital:</strong> Pemerintah Daerah wajib menyediakan layanan pendampingan bagi calon murid yang memiliki keterbatasan akses internet. Datangi langsung sekolah atau Disdikbud Kota Probolinggo.
      </Alert>
    </div>
  )
}

function TabKuota() {
  return (
    <div>
      <SectionHead icon="🏫" title="Kuota Rombongan Belajar SMP Negeri" />
      <div className="spmb-table-wrap">
        <table className="spmb-table">
          <thead>
            <tr><th>No</th><th>Nama Sekolah</th><th>Alamat</th><th>Kecamatan</th><th>Rombel</th><th>Kuota</th></tr>
          </thead>
          <tbody>
            {SCHOOLS.map((s) => (
              <tr key={s.no} className={s.border ? 'highlight' : ''}>
                <td>{s.no}</td>
                <td className="td-name">{s.name}</td>
                <td>{s.addr}</td>
                <td>{s.kec}</td>
                <td>{s.rombel}</td>
                <td className="td-q">{s.kuota}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Alert type="blue">
        <strong>✦</strong> Satuan Pendidikan Perbatasan — menerima 5% kuota dari luar Kota Probolinggo. Kuota per rombongan belajar = <strong>32 murid</strong>.
      </Alert>

      <div style={{ marginTop: '1.75rem' }}>
        <SectionHead icon="🗺️" title="Pembagian Wilayah Domisili per Sekolah" />
        <div className="spmb-table-wrap">
          <table className="spmb-table">
            <thead>
              <tr><th>Sekolah</th><th>Kecamatan / Asal Domisili</th><th style={{ textAlign:'right' }}>% Kuota</th></tr>
            </thead>
            <tbody>
              {DOMISILI.flatMap((d) =>
                d.areas.map((a, ai) => (
                  <tr key={`${d.school}-${ai}`}>
                    {ai === 0 && <td className="td-name" rowSpan={d.areas.length}>{d.school}</td>}
                    <td>{a.kec}</td>
                    <td className="td-q" style={{ textAlign:'right' }}>{a.pct}%</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function TabSyarat() {
  return (
    <div>
      <SectionHead icon="📌" title="Persyaratan Umum (Semua Jalur)" />
      <div className="spmb-card"><CheckList items={SYARAT_UMUM} /></div>

      <div style={{ marginTop: '1.75rem' }}>
        <SectionHead icon="📂" title="Persyaratan Khusus per Jalur" />
        <div className="spmb-grid2">
          {[
            {
              title: '🤝 Afirmasi',
              items: [
                'Surat Keterangan Terdaftar DTSEN dari Dinas Sosial',
                'Telah diverifikasi Disdikbud dan Dinsos PPPA',
                'Penyandang disabilitas: surat dokter/psikolog ATAU Kartu Disabilitas dari instansi sosial',
                'Kategori yang diterima: disabilitas ringan (fisik, intelektual, mental, sensorik)',
              ],
            },
            {
              title: '🔄 Mutasi',
              items: [
                'Surat penugasan dari instansi/perusahaan orang tua (diterbitkan maks. 1 tahun sebelum daftar)',
                'Fotokopi Akta Kelahiran calon murid',
                'Kartu Keluarga terbaru',
                'Anak guru: **hanya boleh** di sekolah tempat orang tua bertugas',
              ],
            },
            {
              title: '🏆 Prestasi',
              items: [
                'Surat Keterangan Peringkat Rapor (semester 7–11) dari sekolah asal',
                'Sertifikat TKA kelas VI Tahun 2026',
                'Piagam/Sertifikat kejuaraan terbit **1 Jan 2023 – 31 Des 2025**',
                'Sertifikat Tahfidz Al-Quran dari lembaga **berlisensi Kemenag**',
                'Legalitas piagam harus ditandatangani pejabat berwenang sesuai jenjang kejuaraan',
              ],
            },
            {
              title: '📍 Domisili',
              items: [
                'KK terbit ≤ 30 Juni 2025 yang mencantumkan nama calon murid',
                'NIK dan/atau NISN untuk login portal',
                'Softcopy Akta Lahir dan KK dikirim ke sekolah pilihan pertama',
                'Calon dari luar kota: wajib Surat Rekomendasi dari Dinas Pendidikan asal (kecuali Kab. Probolinggo)',
              ],
            },
          ].map((s, i) => (
            <div key={i} className="spmb-card">
              <div className="spmb-card-title">{s.title}</div>
              <CheckList items={s.items} />
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '1.75rem' }}>
        <SectionHead icon="📝" title="Dokumen Daftar Ulang (Semua Jalur)" />
        <div className="spmb-card"><CheckList items={DAFTAR_ULANG_DOCS} /></div>
        <Alert type="green">
          <strong>✅ Daftar ulang GRATIS</strong> — tidak dipungut biaya apapun. Wajib dilakukan online DAN offline di sekolah.
        </Alert>
      </div>

      <div style={{ marginTop: '1.75rem' }}>
        <SectionHead icon="👥" title="Ketentuan Khusus" />
        <div className="spmb-card">
          <CheckList items={[
            'Calon murid dari **pondok pesantren/panti asuhan/asrama**: domisili mengikuti tempat kedudukan lembaga, dibuktikan surat keterangan lembaga',
            'Calon murid belum punya KTP/KK Probolinggo karena pindah tugas orang tua: cukup Surat Keterangan dari Kelurahan',
            'Perpindahan domisili yang hanya melibatkan calon murid seorang diri (tanpa keluarga) untuk mendapat sekolah tertentu **tidak diakui**',
            'Calon murid yang diterima tapi tidak daftar ulang sesuai jadwal dinyatakan **gugur**',
          ]} />
        </div>
      </div>
    </div>
  )
}

function TabTataCara() {
  const steps = [
    { n:'1', lbl:'Langkah 1', title:'Buka Portal',    desc:'Kunjungi spmb.probolinggokota.go.id melalui HP atau komputer.' },
    { n:'2', lbl:'Langkah 2', title:'Isi Data Diri',  desc:'Masukkan NIK, NISN, dan data calon murid sesuai KK dan akta lahir.' },
    { n:'3', lbl:'Langkah 3', title:'Pilih Sekolah',  desc:'Isi urutan maksimal 3 pilihan Satuan Pendidikan sesuai prioritas.' },
    { n:'4', lbl:'Langkah 4', title:'Unggah Dokumen', desc:'Upload softcopy Akta Lahir, KK, dan dokumen khusus jalur masing-masing.' },
    { n:'5', lbl:'Langkah 5', title:'Pantau Status',  desc:'Cek berkala di website dan papan pengumuman sekolah sesuai jadwal.' },
  ]

  return (
    <div>
      <SectionHead icon="📲" title="Pendaftaran Online (Jalur Afirmasi, Prestasi & Domisili)" />
      <div className="spmb-steps">
        {steps.map((s) => (
          <div key={s.n} className="spmb-step">
            <span className="spmb-step-n">{s.n}</span>
            <div className="spmb-step-lbl">{s.lbl}</div>
            <div className="spmb-step-title">{s.title}</div>
            <div className="spmb-step-desc">{s.desc}</div>
          </div>
        ))}
      </div>
      <Alert type="blue">
        <strong>💡 Butuh bantuan?</strong> Dinas Pendidikan dan Satuan Pendidikan wajib menyediakan layanan pendampingan bagi yang keterbatasan akses internet — termasuk bantuan login, buat akun, dan unggah dokumen.
      </Alert>

      <div style={{ marginTop: '1.75rem' }}>
        <SectionHead icon="📋" title="Pendaftaran Offline (Jalur Mutasi)" />
        <div className="spmb-card">
          <CheckList items={[
            'Datang ke sekolah tujuan membawa formulir pendaftaran yang telah diisi',
            'Tunjukkan Akta Kelahiran calon murid dan serahkan fotokopinya',
            'Tunjukkan surat penugasan dari instansi/perusahaan orang tua dan serahkan fotokopinya',
            'Tunjukkan Kartu Keluarga terbaru dan serahkan fotokopinya',
            'Panitia sekolah akan mengunggah hasil pendaftaran ke portal SPMB',
          ]} />
        </div>
      </div>

      <div style={{ marginTop: '1.75rem' }}>
        <SectionHead icon="🔍" title="Mekanisme Seleksi" />
        <div className="spmb-grid2">
          <div className="spmb-card">
            <div className="spmb-card-title">📍 Seleksi Jalur Domisili</div>
            <CheckList items={[
              'Usia maksimal 15 tahun per 1 Juli 2026',
              'Berdasarkan wilayah kecamatan sesuai porsi kuota masing-masing sekolah',
              'Jika penuh: prioritas berdasarkan jarak domisili terdekat ke sekolah',
            ]} />
          </div>
          <div className="spmb-card">
            <div className="spmb-card-title">🏆 Seleksi Jalur Prestasi</div>
            <CheckList items={[
              'Berdasarkan akumulasi skor prestasi (lihat tab Bobot Prestasi)',
              'Jika skor sama: jarak domisili terdekat ke sekolah',
              'Jika jarak sama: usia lebih tua didahulukan',
              'Jika usia sama: waktu pendaftaran lebih awal',
            ]} />
          </div>
        </div>
        <Alert type="amber">
          <strong>📣 Pengumuman resmi</strong> ditempel di seluruh SMP Negeri dan dapat diakses online di portal SPMB sesuai jadwal yang telah ditetapkan.
        </Alert>
      </div>
    </div>
  )
}

function TabPrestasi() {
  return (
    <div>
      <SectionHead icon="📿" title="Skor Hafalan Al-Quran" />
      <div className="spmb-table-wrap">
        <table className="spmb-table">
          <thead><tr><th>Hafalan</th><th>Skor</th><th>Keterangan</th></tr></thead>
          <tbody>
            <tr><td>Hafal 1 Juz</td><td className="td-q">10,00</td><td>Sertifikat dari lembaga Tahfidz berlisensi Kemenag</td></tr>
            <tr><td>Hafal 2 Juz</td><td className="td-q">20,00</td><td>Sertifikat dari lembaga Tahfidz berlisensi Kemenag</td></tr>
            <tr><td>Hafal ≥ 3 Juz</td><td className="td-q">Tanpa Seleksi</td><td>Diterima langsung di sekolah berprogram Al-Quran</td></tr>
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        <SectionHead icon="📊" title="Skor Peringkat Rapor (Semester 7–11)" />
        <div className="spmb-grid2" style={{ alignItems:'start' }}>
          <div className="spmb-table-wrap">
            <table className="spmb-table">
              <thead><tr><th>Peringkat Paralel</th><th>Skor</th></tr></thead>
              <tbody>
                {[['Peringkat 1','10,00'],['Peringkat 2','8,50'],['Peringkat 3','7,00'],['Peringkat 4','5,50'],['Peringkat 5','4,00']].map(([p,s])=>(
                  <tr key={p}><td>{p}</td><td className="td-q">{s}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <Alert type="blue">
            Pemeringkatan dilakukan secara <strong>paralel</strong> (membandingkan nilai seluruh rombel). Murid dengan rerata nilai sama mendapat peringkat yang sama. TKA: skor = <strong>50%</strong> dari rata-rata Bahasa Indonesia dan Matematika.
          </Alert>
        </div>
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        <SectionHead icon="🥇" title="Skor Kejuaraan" />
        <div className="spmb-grid2">
          <div>
            <div className="spmb-sub-label">Perorangan / Ganda</div>
            <div className="spmb-table-wrap">
              <table className="spmb-table">
                <thead><tr><th>Jenjang</th><th>I</th><th>II</th><th>III</th></tr></thead>
                <tbody>
                  {[['Kota/Kab','10,00','7,50','5,00'],['Provinsi','17,50','15,00','12,50'],['Nasional','25,00','22,50','20,00'],['Internasional','32,50','30,00','27,50']].map(([j,...v])=>(
                    <tr key={j}><td>{j}</td>{v.map((x,i)=><td key={i} className="td-q">{x}</td>)}</tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <div className="spmb-sub-label">Beregu</div>
            <div className="spmb-table-wrap">
              <table className="spmb-table">
                <thead><tr><th>Jenjang</th><th>I</th><th>II</th><th>III</th></tr></thead>
                <tbody>
                  {[['Kota/Kab','5,00','3,50','2,00'],['Provinsi','9,50','8,00','6,50'],['Nasional','14,00','12,50','11,00'],['Internasional','18,50','17,00','15,50']].map(([j,...v])=>(
                    <tr key={j}><td>{j}</td>{v.map((x,i)=><td key={i} className="td-q">{x}</td>)}</tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        <SectionHead icon="⚠️" title="Ketentuan Prestasi Penting" />
        <div className="spmb-card">
          <CheckList items={[
            'Piagam/sertifikat kejuaraan harus terbit antara **1 Januari 2023 – 31 Desember 2025** (kecuali hasil TKA boleh tahun 2026)',
            'Jika punya beberapa piagam dari **satu kejuaraan**: diambil yang paling tinggi pencapaiannya saja',
            'Jika punya piagam berjenjang dari **satu penyelenggara** (misal OSN): diambil jenjang tertinggi saja',
            'Jika punya piagam dari **penyelenggara berbeda**: semua dapat diunggah setelah verifikasi Tim SPMB',
            'Piagam beregu tanpa nama anggota: wajib lampirkan surat keterangan dari sekolah atau panitia',
            'Jika tanda tangan pejabat tidak sesuai jenjang: skor disesuaikan level pejabat penanda tangan',
            'Juara I Tingkat Provinsi / Juara I-II-III Nasional/Internasional: **diterima tanpa seleksi**',
          ]} />
        </div>
      </div>
    </div>
  )
}

function TabLarangan() {
  return (
    <div>
      <SectionHead icon="🚫" title="Larangan dalam Pelaksanaan SPMB" />
      <Alert type="red">Sekolah Negeri dan sekolah penerima BOSP <strong>dilarang keras</strong> melakukan hal-hal berikut:</Alert>
      <div className="spmb-card">
        <CheckList cross items={[
          'Melakukan pungutan dan/atau meminta sumbangan yang dikaitkan dengan proses SPMB atau perpindahan murid',
          'Memungut biaya untuk pembelian seragam atau buku tertentu yang dikaitkan dengan SPMB',
          'Memproses perpindahan domisili yang hanya melibatkan calon murid saja (tanpa keluarga) untuk mendapatkan sekolah tertentu',
          'Menerima pendaftaran dari calon murid yang sudah diterima di jalur lain untuk mendaftar ulang di Jalur Domisili',
        ]} />
      </div>
      <Alert type="red"><strong>⚖️ Sanksi:</strong> Semua pelanggaran dikenai sanksi sesuai ketentuan peraturan perundang-undangan yang berlaku.</Alert>

      <div style={{ marginTop: '1.75rem' }}>
        <SectionHead icon="📣" title="Cara Menyampaikan Pengaduan" />
        <div className="spmb-card">
          <CheckList items={[
            'Melalui satuan pendidikan tempat mendaftar untuk mendapat layanan pengaduan langsung',
            'Secara online melalui website: **spmb.probolinggokota.go.id**',
            'Pengawasan SPMB dilakukan oleh Inspektorat Daerah melalui audit, pemantauan, evaluasi, dan reviu',
          ]} />
        </div>
      </div>

      <div style={{ marginTop: '1.75rem' }}>
        <SectionHead icon="📞" title="Kontak Panitia SPMB" />
        <div className="spmb-grid2">
          {[
            { label: 'Contact Person 1', number: '0852-5729-9389', wa: 'https://wa.me/6285257299389?text=Halo%20Admin%20SPMB%20SMP%20Negeri%208%20Probolinggo%2C%20saya%20ingin%20bertanya%20terkait%20SPMB...' },
            { label: 'Contact Person 2', number: '0833-1131-886',  wa: 'https://wa.me/628331131886?text=Halo%20Admin%20SPMB%20SMP%20Negeri%208%20Probolinggo%2C%20saya%20ingin%20bertanya%20terkait%20SPMB...'  },
          ].map((cp, i) => (
            <a key={i} href={cp.wa} className="spmb-cp-card" target="_blank" rel="noreferrer">
              <div className="spmb-cp-avatar">
                <svg viewBox="0 0 24 24" fill="white" width="22" height="22">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </div>
              <div>
                <div className="spmb-cp-label">{cp.label}</div>
                <div className="spmb-cp-number">{cp.number}</div>
              </div>
            </a>
          ))}
        </div>
        <Alert type="amber">
          <strong>⏰ Jam Layanan: 07.00 – 14.30 WIB</strong> (Senin–Jumat, hari kerja). Di luar jam layanan, silakan kirim pesan WhatsApp.
        </Alert>
      </div>
    </div>
  )
}

/* ─── FLOATING WA BUTTON ────────────────────────────────────────────────── */

function FloatingWA() {
  const [open, setOpen] = useState(false)
  return (
    <div className="spmb-wa-fab">
      {open && (
        <div className="spmb-wa-menu">
          <div className="spmb-wa-hour">⏰ Layanan: 07.00 – 14.30 WIB</div>
          {[
            { label: 'Contact Person 1', number: '0852-5729-9389', wa: 'https://wa.me/6285257299389?text=Halo%20Admin%20SPMB%20SMP%20Negeri%208%20Probolinggo%2C%20saya%20ingin%20bertanya%20terkait%20SPMB...' },
            { label: 'Contact Person 2', number: '0833-1131-886',  wa: 'https://wa.me/628331131886?text=Halo%20Admin%20SPMB%20SMP%20Negeri%208%20Probolinggo%2C%20saya%20ingin%20bertanya%20terkait%20SPMB...'  },
          ].map((cp, i) => (
            <a key={i} href={cp.wa} className="spmb-wa-c" target="_blank" rel="noreferrer">
              <div className="spmb-wa-cdot">
                <svg viewBox="0 0 24 24" fill="white" width="15" height="15">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </div>
              <div>
                <div className="spmb-wa-clabel">{cp.label}</div>
                <div className="spmb-wa-cname">{cp.number}</div>
              </div>
            </a>
          ))}
        </div>
      )}
      <button className="spmb-wa-btn" onClick={() => setOpen(o => !o)} title="Hubungi Panitia SPMB via WhatsApp">
        <svg viewBox="0 0 24 24" fill="white" width="26" height="26">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </button>
    </div>
  )
}

/* ─── PAGE ──────────────────────────────────────────────────────────────── */

export default function SpmbPage() {
  const [activeTab, setActiveTab] = useState('beranda')
  const navRef = useRef<HTMLDivElement>(null)

  const activeIdx = TABS.findIndex(t => t.id === activeTab)
  const isFirst   = activeIdx === 0
  const isLast    = activeIdx === TABS.length - 1

  function goTo(id: string) {
    setActiveTab(id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setTimeout(() => {
      const el = document.getElementById(`tab-${id}`)
      el?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' })
    }, 30)
  }

  function goPrev() { if (!isFirst) goTo(TABS[activeIdx - 1].id) }
  function goNext() { if (!isLast)  goTo(TABS[activeIdx + 1].id) }

  const tabContent: Record<string, React.ReactNode> = {
    beranda:  <TabBeranda />,
    jalur:    <TabJalur />,
    kuota:    <TabKuota />,
    syarat:   <TabSyarat />,
    tatacara: <TabTataCara />,
    prestasi: <TabPrestasi />,
    larangan: <TabLarangan />,
  }

  return (
    <>
      <style>{`
        /* ── Nav wrapper: flex row with arrow buttons ── */
        .spmb-nav-wrap {
          position: sticky; top: 0; z-index: 50;
          background: var(--blue-950, #020c1f);
          padding: .5rem .6rem;
          border-bottom: 1px solid rgba(255,255,255,.08);
          display: flex; align-items: center; gap: .4rem;
        }

        /* ── Arrow buttons ── */
        .spmb-nav-arrow {
          flex-shrink: 0;
          width: 34px; height: 34px; border-radius: 8px;
          background: rgba(255,255,255,.09);
          border: 1px solid rgba(255,255,255,.14);
          color: #fff; font-size: 1.1rem; line-height: 1;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          transition: background .15s, opacity .15s;
          font-family: inherit;
        }
        .spmb-nav-arrow:hover:not(:disabled) { background: rgba(255,255,255,.18); }
        .spmb-nav-arrow:disabled { opacity: .25; cursor: default; }

        /* ── Scrollable tab strip ── */
        .spmb-nav {
          flex: 1; display: flex; gap: .35rem;
          overflow-x: auto; scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
          scroll-behavior: smooth;
        }
        .spmb-nav::-webkit-scrollbar { display: none; }

        /* ── Tab buttons ── */
        .spmb-nav-btn {
          flex-shrink: 0;
          background: rgba(255,255,255,.06);
          border: 1px solid rgba(255,255,255,.1);
          color: rgba(255,255,255,.65);
          padding: .4rem 1rem; border-radius: 100px;
          font-size: .78rem; font-weight: 600; cursor: pointer;
          transition: all .18s; white-space: nowrap;
          font-family: inherit;
        }
        .spmb-nav-btn:hover { background: rgba(255,255,255,.12); color: #fff; }
        .spmb-nav-btn.active {
          background: var(--blue-500, #1e72d4);
          border-color: var(--blue-400, #4a92e8);
          color: #fff;
          box-shadow: 0 2px 10px rgba(30,114,212,.4);
        }

        /* ── Page indicator dots (mobile) ── */
        .spmb-dots {
          display: none;
          justify-content: center; gap: .3rem;
          padding: .45rem 0 .15rem;
          background: var(--blue-950, #020c1f);
        }
        .spmb-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: rgba(255,255,255,.25); transition: background .2s, width .2s;
        }
        .spmb-dot.active { background: #1e72d4; width: 18px; border-radius: 3px; }

        @media (max-width: 600px) {
          .spmb-dots { display: flex; }
        }

        /* ── Outer bg ── */
        .spmb-section {
          background: var(--gray-50, #f9fafb);
          border-radius: 20px 20px 0 0;
          margin-top: -1.5rem;
          position: relative; z-index: 2;
          min-height: 60vh;
        }

        /* ── Section header ── */
        .spmb-sh { display: flex; align-items: center; gap: .6rem; margin-bottom: 1rem; }
        .spmb-sh-icon { font-size: 1.1rem; }
        .spmb-sh-title { font-family: 'Playfair Display', Georgia, serif; font-size: 1.15rem; font-weight: 700; color: var(--blue-900, #0a1f3d); }

        /* ── Portal button ── */
        .spmb-portal-btn {
          display: flex; align-items: center; justify-content: center; gap: .65rem;
          background: linear-gradient(135deg, var(--blue-500, #1e72d4), var(--blue-700, #10407f));
          color: #fff; text-decoration: none;
          border-radius: 14px; padding: 1.1rem 1.75rem;
          font-weight: 800; font-size: 1rem;
          box-shadow: 0 4px 18px rgba(30,114,212,.3);
          transition: box-shadow .2s, transform .2s;
          margin-bottom: .85rem;
        }
        .spmb-portal-btn:hover { box-shadow: 0 6px 26px rgba(30,114,212,.45); transform: translateY(-2px); }
        .spmb-portal-btn .arrow { font-size: 1.2rem; transition: transform .2s; }
        .spmb-portal-btn:hover .arrow { transform: translateX(4px); }

        /* ── Alerts ── */
        .spmb-alert {
          border-radius: 8px; padding: .75rem 1rem;
          font-size: .82rem; line-height: 1.6;
          margin-bottom: 1rem; border-left: 3px solid;
        }
        .spmb-alert-blue  { background: #eaf4fd; border-color: #1e72d4; color: #0d2d5e; }
        .spmb-alert-amber { background: #faeeda; border-color: #d4930a; color: #854f0b; }
        .spmb-alert-green { background: #e1f5ee; border-color: #0f6e56; color: #0f6e56; }
        .spmb-alert-red   { background: #fcebeb; border-color: #a32d2d; color: #a32d2d; }

        /* ── Quick strip ── */
        .spmb-qstrip {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(130px,1fr));
          gap: .7rem; margin-bottom: 1.75rem;
        }
        .spmb-qbox {
          background: #fff; border: 1px solid #e8e8e8;
          border-radius: 12px; padding: .9rem .75rem;
          text-align: center; display: flex; flex-direction: column; gap: .2rem;
        }
        .spmb-qbox-icon  { font-size: 1.25rem; }
        .spmb-qbox-label { font-size: .68rem; color: #666; font-weight: 600; }
        .spmb-qbox-val   { font-size: .85rem; font-weight: 800; color: var(--blue-900, #0a1f3d); line-height: 1.25; }
        .spmb-qbox-val.gold { color: #d4930a; }

        /* ── Timeline ── */
        .spmb-tl { position: relative; padding-left: 1.85rem; }
        .spmb-tl::before {
          content: ''; position: absolute; left: .55rem; top: 0; bottom: 0;
          width: 2px; background: linear-gradient(to bottom, #1e72d4, #a8cef5);
        }
        .spmb-tli { position: relative; padding-bottom: 1.3rem; }
        .spmb-tli:last-child { padding-bottom: 0; }
        .spmb-tldot {
          position: absolute; left: -1.37rem; top: .2rem;
          width: 16px; height: 16px; border-radius: 50%;
          border: 3px solid #f9fafb; z-index: 1;
        }
        .spmb-tldot.done     { background: #0f6e56; box-shadow: 0 0 0 2px #0f6e56; }
        .spmb-tldot.now      { background: #d4930a; box-shadow: 0 0 0 2px #d4930a, 0 0 10px rgba(212,147,10,.4); animation: spmbPulse 2s ease-in-out infinite; }
        .spmb-tldot.upcoming { background: #ccc; box-shadow: 0 0 0 2px #ccc; }
        @keyframes spmbPulse { 0%,100%{ box-shadow:0 0 0 2px #d4930a,0 0 8px rgba(212,147,10,.3);} 50%{box-shadow:0 0 0 3px #d4930a,0 0 16px rgba(212,147,10,.5);} }
        .spmb-tldate      { font-size: .7rem; font-weight: 700; color: var(--blue-600,#1558a8); text-transform: uppercase; letter-spacing: .04em; margin-bottom: .12rem; }
        .spmb-tldate.now  { color: #d4930a; }
        .spmb-tldate.gray { color: #888; }
        .spmb-tlphase     { font-size: .9rem; font-weight: 700; color: #0a1f3d; margin-bottom: .2rem; }
        .spmb-tldesc      { font-size: .8rem; color: #666; line-height: 1.55; }
        .spmb-tlbadge     { display: inline-block; font-size: .67rem; font-weight: 700; padding: .15rem .5rem; border-radius: 100px; margin-top: .3rem; }
        .spmb-tlbadge.done { background: #f4f4f4; color: #666; }
        .spmb-tlbadge.now  { background: #faeeda; color: #854f0b; }
        .spmb-tlbadge.blue,.spmb-tlbadge.upcoming { background: #eaf4fd; color: #10407f; }
        .spmb-tlbadge.gray { background: #f4f4f4; color: #666; }

        /* ── Cards ── */
        .spmb-card {
          background: #fff; border: 1px solid #e8e8e8;
          border-radius: 12px; padding: 1.15rem 1.25rem;
          margin-bottom: .85rem;
        }
        .spmb-card-title { font-size: .88rem; font-weight: 700; color: #0a1f3d; margin-bottom: .65rem; }

        /* ── Grids ── */
        .spmb-grid2 { display: grid; grid-template-columns: repeat(auto-fit,minmax(220px,1fr)); gap: 1rem; margin-bottom: .85rem; }

        /* ── Jalur cards ── */
        .spmb-jalur-card { background: #fff; border: 1px solid #e8e8e8; border-radius: 12px; padding: 1.15rem; transition: box-shadow .2s, transform .2s; }
        .spmb-jalur-card:hover { box-shadow: 0 4px 18px rgba(0,0,0,.07); transform: translateY(-2px); }
        .spmb-jalur-top { display: flex; align-items: center; gap: .6rem; margin-bottom: .55rem; }
        .spmb-jalur-emoji { font-size: 1.35rem; }
        .spmb-jalur-name  { font-weight: 800; font-size: .92rem; color: #0a1f3d; }
        .spmb-jalur-desc  { font-size: .8rem; color: #666; line-height: 1.5; margin-bottom: .65rem; }
        .spmb-pills { display: flex; flex-wrap: wrap; gap: .3rem; }
        .spmb-pill  { display: inline-block; padding: .18rem .55rem; border-radius: 100px; font-size: .7rem; font-weight: 700; }
        .pill-blue  { background: #eaf4fd; color: #10407f; }
        .pill-amber { background: #faeeda; color: #854f0b; }
        .pill-green { background: #e1f5ee; color: #0f6e56; }
        .pill-red   { background: #fcebeb; color: #a32d2d; }

        /* ── Checklist ── */
        .spmb-checklist { list-style: none; display: flex; flex-direction: column; gap: 0; }
        .spmb-checklist li {
          font-size: .8rem; color: #555; padding: .3rem 0 .3rem 1.1rem;
          border-bottom: 1px dashed #eee; position: relative; line-height: 1.5;
        }
        .spmb-checklist li:last-child { border-bottom: none; }
        .spmb-checklist .mark { position: absolute; left: 0; font-weight: 700; font-size: .72rem; top: .35rem; }
        .spmb-checklist li:not(.cross) .mark { color: #0f6e56; }
        .spmb-checklist li.cross .mark { color: #a32d2d; }

        /* ── Table ── */
        .spmb-table-wrap { background: #fff; border: 1px solid #e8e8e8; border-radius: 12px; overflow: hidden; margin-bottom: .85rem; overflow-x: auto; }
        .spmb-table { width: 100%; border-collapse: collapse; font-size: .78rem; }
        .spmb-table thead { background: #0a1f3d; }
        .spmb-table thead th { color: #a8cef5; font-weight: 700; padding: .6rem .75rem; text-align: left; white-space: nowrap; }
        .spmb-table tbody tr { border-bottom: 1px solid #f0f0f0; }
        .spmb-table tbody tr:last-child { border-bottom: none; }
        .spmb-table tbody tr:hover { background: #eaf4fd; }
        .spmb-table tbody tr.highlight { background: #eaf4fd; }
        .spmb-table tbody tr.highlight td { color: #10407f; font-weight: 700; }
        .spmb-table td { padding: .55rem .75rem; color: #555; vertical-align: middle; }
        .spmb-table .td-name { font-weight: 700; color: #0a1f3d; }
        .spmb-table .td-q { font-weight: 800; color: #1558a8; }

        /* ── Steps ── */
        .spmb-steps { display: grid; grid-template-columns: repeat(auto-fit,minmax(150px,1fr)); gap: .85rem; margin-bottom: 1rem; }
        .spmb-step { background: #fff; border: 1px solid #e8e8e8; border-radius: 12px; padding: 1rem; position: relative; overflow: hidden; }
        .spmb-step-n { font-family: 'Playfair Display',serif; font-size: 2.5rem; font-weight: 700; color: #eaf4fd; position: absolute; bottom: -.4rem; right: .6rem; line-height: 1; user-select: none; }
        .spmb-step-lbl   { font-size: .65rem; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; color: #4a92e8; margin-bottom: .25rem; }
        .spmb-step-title { font-size: .86rem; font-weight: 700; color: #0a1f3d; margin-bottom: .25rem; }
        .spmb-step-desc  { font-size: .76rem; color: #666; line-height: 1.5; }

        /* ── Sub label ── */
        .spmb-sub-label { font-size: .72rem; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: .06em; margin-bottom: .45rem; }

        /* ── Contact cards ── */
        .spmb-cp-card {
          display: flex; align-items: center; gap: .75rem;
          background: #fff; border: 1px solid #e8e8e8; border-radius: 12px;
          padding: 1rem 1.15rem; text-decoration: none;
          transition: box-shadow .18s, transform .18s;
        }
        .spmb-cp-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,.08); transform: translateY(-2px); }
        .spmb-cp-avatar { width: 42px; height: 42px; border-radius: 50%; background: #25D366; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .spmb-cp-label  { font-size: .68rem; color: #888; font-weight: 700; }
        .spmb-cp-number { font-size: .95rem; font-weight: 800; color: #0a1f3d; }

        /* ── Floating WA ── */
        .spmb-wa-fab { position: fixed; bottom: 1.5rem; right: 1.5rem; z-index: 999; }
        .spmb-wa-btn {
          width: 54px; height: 54px; border-radius: 50%; background: #25D366;
          border: none; cursor: pointer;
          box-shadow: 0 4px 16px rgba(37,211,102,.4);
          display: flex; align-items: center; justify-content: center;
          transition: transform .2s, box-shadow .2s;
        }
        .spmb-wa-btn:hover { transform: scale(1.08); box-shadow: 0 6px 22px rgba(37,211,102,.55); }
        .spmb-wa-menu {
          position: absolute; bottom: 62px; right: 0;
          display: flex; flex-direction: column; gap: .45rem;
          animation: spmbFadeUp .18s ease;
        }
        @keyframes spmbFadeUp { from{ opacity:0; transform:translateY(6px);} to{ opacity:1; transform:none;} }
        .spmb-wa-c {
          display: flex; align-items: center; gap: .5rem;
          background: #fff; border-radius: 100px;
          padding: .4rem .85rem .4rem .45rem;
          box-shadow: 0 2px 12px rgba(0,0,0,.12);
          text-decoration: none; white-space: nowrap;
          border: 1px solid #e8e8e8; transition: box-shadow .18s;
        }
        .spmb-wa-c:hover { box-shadow: 0 4px 16px rgba(0,0,0,.16); }
        .spmb-wa-cdot  { width: 28px; height: 28px; border-radius: 50%; background: #25D366; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .spmb-wa-clabel{ font-size: .64rem; font-weight: 700; color: #888; }
        .spmb-wa-cname { font-size: .8rem; font-weight: 700; color: #111; }
        .spmb-wa-hour  { text-align: center; background: #fff; border: 1px solid #eee; border-radius: 100px; padding: .25rem .85rem; font-size: .68rem; font-weight: 700; color: #854f0b; }

        @media (max-width: 600px) {
          .spmb-grid2, .spmb-steps { grid-template-columns: 1fr; }
          .spmb-table thead th, .spmb-table td { font-size: .72rem; padding: .4rem .5rem; }
          .spmb-qstrip { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>

      <PageHero
        title="SPMB 2026/2027"
        subtitle="Sistem Penerimaan Murid Baru SMP Negeri Kota Probolinggo. Kepwk. No. 100.3.3.3/151/KEP/425.012/2026"
        breadcrumbs={[{ label: 'SPMB' }]}
        accent="🎓"
      />

      {/* ── Sticky nav: arrow + scrollable tabs + arrow ── */}
      <nav className="spmb-nav-wrap">
        <button
          className="spmb-nav-arrow"
          onClick={goPrev}
          disabled={isFirst}
          aria-label="Tab sebelumnya"
        >‹</button>

        <div className="spmb-nav" ref={navRef}>
          {TABS.map((t) => (
            <button
              key={t.id}
              id={`tab-${t.id}`}
              className={`spmb-nav-btn${activeTab === t.id ? ' active' : ''}`}
              onClick={() => goTo(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <button
          className="spmb-nav-arrow"
          onClick={goNext}
          disabled={isLast}
          aria-label="Tab berikutnya"
        >›</button>
      </nav>

      {/* ── Dot indicator (mobile only) ── */}
      <div className="spmb-dots" aria-hidden="true">
        {TABS.map((t) => (
          <div key={t.id} className={`spmb-dot${activeTab === t.id ? ' active' : ''}`} />
        ))}
      </div>

      {/* Content */}
      <section className="spmb-section">
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
          {tabContent[activeTab]}
        </div>
      </section>

      <FloatingWA />
    </>
  )
}