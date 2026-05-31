// src/app/(elkpd)/elkpd/lkpd/page.tsx
'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import PageWrapper from '@/components/elkpd/PageWrapper'
import NavbarElkpd from '@/components/elkpd/Navbar'
import PilganSoal from '@/components/elkpd/soal/PilganSoal'
import BenarSalahSoal from '@/components/elkpd/soal/BenarSalahSoal'
import MenjodohkanSoal from '@/components/elkpd/soal/MenjodohkanSoal'
import TTSSoal from '@/components/elkpd/soal/TTSSoal'
import DragDropSoal from '@/components/elkpd/soal/DragDropSoal'
import UraianSoal from '@/components/elkpd/soal/UraianSoal'
import { supabase } from '@/lib/supabase-elkpd'
import { hitungSkorOtomatis } from '@/utils/elkpd'

function ProgressRing({ pct }: { pct: number }) {
  const r = 14, circ = 2 * Math.PI * r
  const dash = (pct / 100) * circ
  return (
    <svg width="36" height="36" className="-rotate-90">
      <circle cx="18" cy="18" r={r} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="3" />
      <circle cx="18" cy="18" r={r} fill="none" stroke="#facc15" strokeWidth="3"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 0.4s ease' }} />
    </svg>
  )
}

export default function LKPDPage() {
  const router = useRouter()
  const [kegiatan, setKegiatan] = useState<any>(null)
  const [siswa, setSiswa] = useState<any>(null)
  const [jawaban, setJawaban] = useState<Record<string, any>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [skor, setSkor] = useState(0)
  const [showConfirm, setShowConfirm] = useState(false)
  const [showKembali, setShowKembali] = useState(false)

  useEffect(() => {
    const k = sessionStorage.getItem('kegiatan_aktif')
    const s = sessionStorage.getItem('siswa_identitas')
    if (!k || !s) { router.push('/elkpd'); return }
    setKegiatan(JSON.parse(k))
    setSiswa(JSON.parse(s))
  }, [router])

  const handleJawaban = (soalId: string, nilai: any) =>
    setJawaban((prev) => ({ ...prev, [soalId]: nilai }))

  const hitungProgress = () => {
    if (!kegiatan?.soal_data) return 0
    const terjawab = kegiatan.soal_data.filter((s: any) => {
      const j = jawaban[s.id]
      if (['menjodohkan', 'tts', 'drag_drop'].includes(s.tipe)) return j && Object.keys(j).length > 0
      return j !== undefined && j !== null && j !== ''
    }).length
    return Math.round((terjawab / kegiatan.soal_data.length) * 100)
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      const skorOtomatis = hitungSkorOtomatis(kegiatan.soal_data, jawaban)
      setSkor(skorOtomatis)
      await supabase.from('jawaban_siswa').insert({
        kegiatan_id: kegiatan.id,
        token: kegiatan.token,
        tingkat: siswa.tingkat,
        kelas: siswa.kelas,
        nama: siswa.nama,
        jawaban_data: jawaban,
        skor_otomatis: skorOtomatis,
        skor_total: skorOtomatis,
      })
      setSubmitted(true)
    } catch {
      alert('Gagal mengirim. Coba lagi.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!kegiatan || !siswa) return null

  const soalList = kegiatan.soal_data || []
  const progress = hitungProgress()
  const terjawab = soalList.filter((s: any) => {
    const j = jawaban[s.id]
    if (['menjodohkan', 'tts', 'drag_drop'].includes(s.tipe)) return j && Object.keys(j).length > 0
    return j !== undefined && j !== null && j !== ''
  }).length

  // ── Halaman selesai ──
  if (submitted) {
    return (
      <PageWrapper>
        <div className="w-full min-h-screen flex flex-col items-center justify-center px-4 py-10">
          <div className="w-full max-w-sm space-y-4">
            <div className="bg-white/10 backdrop-blur border border-white/20 rounded-3xl p-6 text-center">
              <div className="text-5xl mb-3">🎉</div>
              <h2 className="text-white font-black text-xl mb-1">LKPD Selesai!</h2>
              <p className="text-white/60 text-sm mb-5">Terkirim ke <strong className="text-white">{kegiatan.guru?.nama}</strong></p>
              <div className="bg-yellow-400/15 border border-yellow-400/30 rounded-2xl p-5 mb-4">
                <p className="text-yellow-300/80 text-xs font-semibold mb-1 uppercase tracking-wide">Skor Otomatis</p>
                <p className="text-white font-black" style={{ fontSize: 64, lineHeight: 1.1 }}>{skor}</p>
                <p className="text-white/40 text-xs mt-2">Soal uraian dinilai guru terpisah</p>
              </div>
              <div className="bg-white/5 rounded-2xl p-3 text-left">
                <p className="text-white/50 text-xs">Nama</p>
                <p className="text-white font-bold text-sm">{siswa.nama}</p>
                <p className="text-white/50 text-xs mt-1">Kelas</p>
                <p className="text-white font-bold text-sm">{siswa.kelas}</p>
              </div>
            </div>
            <button onClick={() => { sessionStorage.removeItem('kegiatan_aktif'); sessionStorage.removeItem('siswa_identitas'); router.push('/elkpd') }}
              className="w-full bg-yellow-400 active:bg-yellow-500 text-gray-900 font-black text-base py-4 rounded-2xl shadow-lg transition active:scale-95">
              🔑 Masukkan Token Baru
            </button>
          </div>
          <p className="text-white/20 text-xs mt-6">created by dhickz666</p>
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      {/* Sticky header */}
      <div className="sticky top-0 z-20 bg-gray-950/95 backdrop-blur-md border-b border-white/10">
        <div className="px-4 pt-3 pb-2">
          <div className="flex items-center gap-2 mb-2">
            <button onClick={() => setShowKembali(true)}
              className="flex items-center gap-1 text-white/60 active:text-white text-xs font-semibold py-1 pr-2 -ml-1">
              <span className="text-base leading-none">←</span>
              <span>Materi</span>
            </button>
            <div className="flex-1 min-w-0 flex items-center justify-center gap-1.5">
              <span className="text-white/50 text-xs truncate">{kegiatan.guru?.mapel}</span>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <div className="relative flex-shrink-0">
                <ProgressRing pct={progress} />
                <span className="absolute inset-0 flex items-center justify-center text-yellow-300 font-black" style={{ fontSize: 9 }}>
                  {progress}%
                </span>
              </div>
              <span className="text-white/40 text-xs">{terjawab}/{soalList.length}</span>
            </div>
          </div>
          <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
            <div className="bg-yellow-400 h-full rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      {/* Konten soal */}
      <div className="w-full">
        <div className="px-3 py-4 space-y-3 max-w-lg mx-auto">
          <div className="bg-white/8 border border-white/15 rounded-2xl px-4 py-3">
            <div className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0">📋</span>
              <div className="min-w-0">
                <p className="text-yellow-300 text-xs font-bold uppercase tracking-wide mb-0.5">Lembar Kerja Peserta Didik</p>
                <h1 className="text-white font-black text-base leading-tight">{kegiatan.judul || 'LKPD'}</h1>
                <p className="text-white/50 text-xs mt-1">{siswa.nama} · Kelas {siswa.kelas}</p>
              </div>
            </div>
          </div>

          {soalList.map((soal: any, idx: number) => {
            const nomor = idx + 1
            const j = jawaban[soal.id]
            switch (soal.tipe) {
              case 'pilgan':      return <PilganSoal      key={soal.id} soal={soal} nomor={nomor} jawaban={j}        onChange={handleJawaban} />
              case 'benar_salah': return <BenarSalahSoal  key={soal.id} soal={soal} nomor={nomor} jawaban={j}        onChange={handleJawaban} />
              case 'menjodohkan': return <MenjodohkanSoal key={soal.id} soal={soal} nomor={nomor} jawaban={j}        onChange={handleJawaban} />
              case 'tts':         return <TTSSoal         key={soal.id} soal={soal} nomor={nomor} jawaban={j}        onChange={handleJawaban} />
              case 'drag_drop':   return <DragDropSoal    key={soal.id} soal={soal} nomor={nomor} jawaban={j}        onChange={handleJawaban} />
              case 'uraian':      return <UraianSoal      key={soal.id} soal={soal} nomor={nomor} jawaban={j || ''} onChange={handleJawaban} />
              default: return null
            }
          })}

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
            <p className="text-white font-bold text-sm mb-0.5">Sudah selesai?</p>
            <p className="text-white/50 text-xs mb-3">
              {terjawab} dari {soalList.length} soal terjawab
              {progress < 100 && <span className="text-orange-300"> · belum semua</span>}
            </p>
            <button onClick={() => setShowConfirm(true)}
              className="w-full bg-emerald-500 active:bg-emerald-600 text-white font-black text-base py-4 rounded-xl shadow transition active:scale-95">
              ✅ Selesai &amp; Kirim
            </button>
          </div>

          <p className="text-white/20 text-xs text-center pb-2">created by dhickz666</p>
        </div>
      </div>

      {/* Modal konfirmasi kirim */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end justify-center">
          <div className="bg-gray-900 border-t border-white/15 rounded-t-3xl p-6 w-full max-w-lg shadow-2xl">
            <div className="w-10 h-1 bg-white/30 rounded-full mx-auto mb-4" />
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">⚠️</div>
              <h3 className="text-white font-black text-lg">Yakin sudah selesai?</h3>
              <p className="text-white/60 text-sm mt-1">
                {terjawab}/{soalList.length} terjawab — <span className="text-yellow-300 font-bold">{progress}%</span>
              </p>
              <p className="text-white/40 text-xs mt-2">
                Jawaban yang sudah dikirim <strong className="text-white/60">tidak bisa diubah</strong>.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setShowConfirm(false)}
                className="bg-white/10 active:bg-white/20 text-white font-bold py-4 rounded-2xl text-sm transition">
                ← Kembali
              </button>
              <button onClick={() => { setShowConfirm(false); handleSubmit() }} disabled={submitting}
                className="bg-emerald-500 active:bg-emerald-600 disabled:opacity-60 text-white font-black py-4 rounded-2xl text-sm transition">
                {submitting ? '⏳ Mengirim...' : 'Ya, Kirim! ✅'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal konfirmasi kembali ke materi */}
      {showKembali && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end justify-center">
          <div className="bg-gray-900 border-t border-white/15 rounded-t-3xl p-6 w-full max-w-lg shadow-2xl">
            <div className="w-10 h-1 bg-white/30 rounded-full mx-auto mb-4" />
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">📖</div>
              <h3 className="text-white font-black text-lg">Kembali ke Materi?</h3>
              <p className="text-white/60 text-sm mt-2">
                Jawabanmu <strong className="text-yellow-300">tidak hilang</strong> — kamu bisa balik lagi ke LKPD setelah baca materi.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setShowKembali(false)}
                className="bg-white/10 active:bg-white/20 text-white font-bold py-4 rounded-2xl text-sm transition">
                Tetap di sini
              </button>
              <button onClick={() => router.push('/elkpd/materi')}
                className="bg-blue-500 active:bg-blue-600 text-white font-black py-4 rounded-2xl text-sm transition">
                📖 Lihat Materi
              </button>
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  )
}
