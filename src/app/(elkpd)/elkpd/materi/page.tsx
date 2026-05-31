// src/app/(elkpd)/elkpd/materi/page.tsx
'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import PageWrapper from '@/components/elkpd/PageWrapper'
import NavbarElkpd from '@/components/elkpd/Navbar'

export default function MateriPage() {
  const router = useRouter()
  const [kegiatan, setKegiatan] = useState<any>(null)
  const [siswa, setSiswa] = useState<any>(null)

  useEffect(() => {
    const k = sessionStorage.getItem('kegiatan_aktif')
    const s = sessionStorage.getItem('siswa_identitas')
    if (!k || !s) { router.push('/elkpd'); return }
    setKegiatan(JSON.parse(k))
    setSiswa(JSON.parse(s))
  }, [router])

  const getYoutubeEmbed = (url: string) => {
    if (!url) return null
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/)
    return match ? `https://www.youtube.com/embed/${match[1]}` : null
  }

  if (!kegiatan || !siswa) return null

  const embedUrl = getYoutubeEmbed(kegiatan.youtube_url)
  const soalAda = kegiatan.soal_data && kegiatan.soal_data.length > 0

  return (
    <PageWrapper>
      <NavbarElkpd showGuruBtn={false} />
      <div className="w-full min-h-screen">
        <div className="max-w-xl mx-auto px-4 py-5 space-y-4">

          {/* Salam siswa */}
          <div className="bg-white/15 backdrop-blur-lg border border-white/25 rounded-2xl p-4 flex items-center gap-3">
            <div className="text-4xl shrink-0">👋</div>
            <div>
              <p className="text-yellow-300 font-black text-base leading-tight">Halo, {siswa.nama}!</p>
              <p className="text-white/70 text-sm mt-0.5">Kelas {siswa.kelas} — {kegiatan.guru?.mapel}</p>
            </div>
          </div>

          {/* Panduan belajar */}
          <div className="bg-blue-500/25 border border-blue-400/40 rounded-2xl p-4">
            <p className="text-white font-bold text-sm mb-2">📋 Cara Belajar Hari Ini:</p>
            <ol className="text-white/85 text-sm space-y-1.5 list-decimal list-inside">
              <li>Simak materi di bawah ini dengan baik</li>
              <li>Setelah selesai, klik tombol <strong className="text-yellow-300">&quot;Mulai Kerjakan LKPD&quot;</strong></li>
              <li>Kerjakan semua soal yang ada</li>
              <li>Klik <strong className="text-yellow-300">&quot;Selesai &amp; Kirim&quot;</strong> saat sudah selesai</li>
            </ol>
          </div>

          {/* Judul */}
          <div className="text-center px-2">
            <h1 className="text-white font-black text-xl leading-tight">{kegiatan.judul || 'Materi Pembelajaran'}</h1>
            <p className="text-yellow-300/80 text-sm mt-1">Oleh: {kegiatan.guru?.nama}</p>
          </div>

          {/* Video YouTube */}
          {embedUrl && (
            <div className="rounded-2xl overflow-hidden border border-white/20 shadow-xl">
              <div className="bg-red-600 px-4 py-2.5 flex items-center gap-2">
                <span className="text-white text-lg">▶</span>
                <span className="text-white font-bold text-sm">Video Pembelajaran</span>
              </div>
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe src={embedUrl} title="Video Materi" className="absolute inset-0 w-full h-full" allowFullScreen />
              </div>
            </div>
          )}

          {/* Isi Materi */}
          {kegiatan.isi_materi && (
            <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl overflow-hidden">
              <div className="bg-white/10 px-4 py-3 flex items-center gap-2 border-b border-white/10">
                <span className="text-2xl">📖</span>
                <h2 className="text-white font-bold text-base">Ringkasan Materi</h2>
              </div>
              <div className="px-4 py-4 text-white/90 text-sm leading-relaxed whitespace-pre-wrap">
                {kegiatan.isi_materi}
              </div>
            </div>
          )}

          {/* File Materi */}
          {kegiatan.file_materi_url && (
            <div className="bg-white/10 border border-white/20 rounded-2xl overflow-hidden">
              <div className="bg-white/10 px-4 py-3 flex items-center gap-2 border-b border-white/10">
                <span className="text-2xl">📄</span>
                <h2 className="text-white font-bold text-base">File Materi</h2>
              </div>
              <div className="p-4">
                <a href={kegiatan.file_materi_url} target="_blank" rel="noreferrer"
                  className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-400 active:bg-blue-600 text-white font-bold py-3 px-4 rounded-xl text-sm transition w-full">
                  ⬇ Download / Buka Materi PDF
                </a>
              </div>
            </div>
          )}

          {/* File Tugas */}
          {kegiatan.file_tugas_url && (
            <div className="bg-white/10 border border-white/20 rounded-2xl overflow-hidden">
              <div className="bg-white/10 px-4 py-3 flex items-center gap-2 border-b border-white/10">
                <span className="text-2xl">📎</span>
                <h2 className="text-white font-bold text-base">File Tugas</h2>
              </div>
              <div className="p-4">
                <a href={kegiatan.file_tugas_url} target="_blank" rel="noreferrer"
                  className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 active:bg-orange-600 text-white font-bold py-3 px-4 rounded-xl text-sm transition w-full">
                  ⬇ Download File Tugas
                </a>
              </div>
            </div>
          )}

          {/* CTA ke LKPD */}
          {soalAda ? (
            <div className="bg-gradient-to-br from-yellow-400/25 to-orange-400/25 border-2 border-yellow-400/60 rounded-2xl p-5 text-center">
              <p className="text-white font-bold text-base mb-1">Sudah siap mengerjakan?</p>
              <p className="text-white/70 text-sm mb-4">
                Ada <strong className="text-yellow-300">{kegiatan.soal_data.length} soal</strong> yang harus dikerjakan!
              </p>
              <button onClick={() => router.push('/elkpd/lkpd')}
                className="w-full bg-yellow-400 hover:bg-yellow-300 active:bg-yellow-500 text-gray-900 font-black text-lg py-4 rounded-xl shadow-xl transition-all active:scale-95">
                📝 MULAI KERJAKAN LKPD
              </button>
            </div>
          ) : (
            <div className="bg-white/10 border border-white/20 rounded-2xl p-4 text-center">
              <p className="text-white/60 text-sm">Tidak ada LKPD untuk kegiatan ini.</p>
            </div>
          )}

          <p className="text-white/30 text-xs text-center pb-4">created by dhickz666</p>
        </div>
      </div>
    </PageWrapper>
  )
}
