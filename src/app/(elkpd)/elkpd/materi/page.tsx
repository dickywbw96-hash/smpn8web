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
    const match = url?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/)
    return match ? `https://www.youtube.com/embed/${match[1]}` : null
  }

  if (!kegiatan || !siswa) return null

  const embedUrl = getYoutubeEmbed(kegiatan.youtube_url)
  const soalAda = kegiatan.soal_data && kegiatan.soal_data.length > 0

  return (
    <PageWrapper>
      <NavbarElkpd showGuruBtn={false} />
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">

        {/* Salam siswa */}
        <div className="bg-white/15 backdrop-blur-lg border border-white/30 rounded-2xl p-4 flex items-center gap-3">
          <div className="text-3xl">👋</div>
          <div>
            <p className="text-yellow-300 font-bold text-sm">Halo, {siswa.nama}!</p>
            <p className="text-white/70 text-xs">Kelas {siswa.kelas} — {kegiatan.guru?.mapel}</p>
          </div>
        </div>

        {/* Petunjuk */}
        <div className="bg-blue-500/30 border border-blue-400/50 rounded-2xl p-4">
          <p className="text-white font-bold text-sm">📋 Cara Belajar Hari Ini:</p>
          <ol className="text-white/80 text-xs mt-2 space-y-1 list-decimal list-inside">
            <li>Simak materi di bawah ini dengan baik</li>
            <li>Setelah selesai, klik tombol <strong>"Mulai Kerjakan LKPD"</strong></li>
            <li>Kerjakan semua soal yang ada</li>
            <li>Klik <strong>"Selesai & Kirim"</strong> saat sudah selesai</li>
          </ol>
        </div>

        <div className="text-center">
          <h1 className="text-white font-black text-xl">{kegiatan.judul || 'Materi Pembelajaran'}</h1>
          <p className="text-yellow-300 text-sm mt-1">Oleh: {kegiatan.guru?.nama}</p>
        </div>

        {/* Video YouTube */}
        {embedUrl && (
          <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl overflow-hidden">
            <div className="bg-red-600/80 px-4 py-2 flex items-center gap-2">
              <span className="text-white font-bold text-sm">▶ Video Pembelajaran</span>
            </div>
            <div className="relative pb-[56.25%] h-0">
              <iframe src={embedUrl} title="Video Materi" className="absolute top-0 left-0 w-full h-full" allowFullScreen />
            </div>
          </div>
        )}

        {/* Materi Teks */}
        {kegiatan.isi_materi && (
          <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">📖</span>
              <h2 className="text-white font-bold">Ringkasan Materi</h2>
            </div>
            <div className="text-white/90 text-sm leading-relaxed whitespace-pre-wrap">{kegiatan.isi_materi}</div>
          </div>
        )}

        {/* File Materi */}
        {kegiatan.file_materi_url && (
          <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3"><span className="text-2xl">📄</span><h2 className="text-white font-bold">File Materi</h2></div>
            <a href={kegiatan.file_materi_url} target="_blank" rel="noreferrer"
              className="block bg-blue-500 hover:bg-blue-400 text-white font-bold py-2.5 px-4 rounded-xl text-center text-sm transition">
              ⬇ Download / Buka Materi PDF
            </a>
          </div>
        )}

        {/* File Tugas */}
        {kegiatan.file_tugas_url && (
          <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3"><span className="text-2xl">📎</span><h2 className="text-white font-bold">File Tugas</h2></div>
            <a href={kegiatan.file_tugas_url} target="_blank" rel="noreferrer"
              className="block bg-orange-500 hover:bg-orange-400 text-white font-bold py-2.5 px-4 rounded-xl text-center text-sm transition">
              ⬇ Download File Tugas
            </a>
          </div>
        )}

        {/* CTA ke LKPD */}
        {soalAda ? (
          <div className="bg-gradient-to-r from-yellow-400/30 to-orange-400/30 border-2 border-yellow-400/60 rounded-2xl p-5 text-center">
            <p className="text-white font-bold mb-1">Sudah siap?</p>
            <p className="text-white/70 text-sm mb-4">Ada <strong>{kegiatan.soal_data.length} soal</strong> LKPD yang harus kamu kerjakan!</p>
            <button onClick={() => router.push('/elkpd/lkpd')}
              className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-black text-lg px-8 py-3 rounded-xl shadow-xl transition-all transform hover:scale-105 active:scale-95">
              📝 MULAI KERJAKAN LKPD
            </button>
          </div>
        ) : (
          <div className="bg-white/10 border border-white/20 rounded-2xl p-4 text-center">
            <p className="text-white/60 text-sm">Tidak ada LKPD untuk kegiatan ini.</p>
          </div>
        )}
      </div>
      <p className="text-white/30 text-xs text-center py-4">created by dhickz666</p>
    </PageWrapper>
  )
}
