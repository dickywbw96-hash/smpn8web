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

export default function LKPDPage() {
  const router = useRouter()
  const [kegiatan, setKegiatan] = useState<any>(null)
  const [siswa, setSiswa] = useState<any>(null)
  const [jawaban, setJawaban] = useState<Record<string, any>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [skor, setSkor] = useState(0)
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    const k = sessionStorage.getItem('kegiatan_aktif')
    const s = sessionStorage.getItem('siswa_identitas')
    if (!k || !s) { router.push('/elkpd'); return }
    setKegiatan(JSON.parse(k))
    setSiswa(JSON.parse(s))
  }, [router])

  const handleJawaban = (soalId: string, nilai: any) => setJawaban((prev) => ({ ...prev, [soalId]: nilai }))

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
        kegiatan_id: kegiatan.id, token: kegiatan.token,
        tingkat: siswa.tingkat, kelas: siswa.kelas, nama: siswa.nama,
        jawaban_data: jawaban, skor_otomatis: skorOtomatis, skor_total: skorOtomatis,
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

  if (submitted) {
    return (
      <PageWrapper>
        <div className="flex flex-col items-center justify-center min-h-screen px-4 py-10">
          <div className="bg-white/15 backdrop-blur-lg border border-white/30 rounded-3xl shadow-2xl p-8 w-full max-w-md text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-white font-black text-2xl mb-2">Selesai!</h2>
            <p className="text-white/70 text-sm mb-4">Jawabanmu sudah terkirim ke {kegiatan.guru?.nama}</p>
            <div className="bg-yellow-400/20 border border-yellow-400/50 rounded-2xl p-4 mb-6">
              <p className="text-yellow-300 text-sm">Skor Otomatis Kamu</p>
              <p className="text-white font-black text-5xl mt-1">{skor}</p>
              <p className="text-white/50 text-xs mt-1">(Soal uraian akan dinilai guru secara terpisah)</p>
            </div>
            <p className="text-white/60 text-sm mb-6">Halo <strong className="text-white">{siswa.nama}</strong>, kelas {siswa.kelas}!<br />Kerja bagus! 👏</p>
            <button onClick={() => { sessionStorage.removeItem('kegiatan_aktif'); sessionStorage.removeItem('siswa_identitas'); router.push('/elkpd') }}
              className="w-full bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-black text-lg py-3 rounded-xl shadow-xl transition-all">
              🔑 Masukkan Token Baru
            </button>
          </div>
          <p className="text-white/30 text-xs mt-6">created by dhickz666</p>
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <NavbarElkpd showGuruBtn={false} />

      {/* Progress bar sticky */}
      <div className="sticky top-0 z-20 bg-gray-900/80 backdrop-blur border-b border-white/10 px-4 py-2">
        <div className="flex items-center justify-between text-xs text-white/70 mb-1">
          <span>📝 LKPD — {kegiatan.guru?.mapel}</span>
          <span>{progress}% terjawab</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-2">
          <div className="bg-yellow-400 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        <div className="bg-white/10 border border-white/20 rounded-2xl p-4">
          <p className="text-yellow-300 font-bold text-sm">📋 Lembar Kerja Peserta Didik</p>
          <h1 className="text-white font-black text-lg">{kegiatan.judul || 'LKPD'}</h1>
          <p className="text-white/60 text-xs mt-1">{siswa.nama} — Kelas {siswa.kelas}</p>
        </div>

        {soalList.map((soal: any, idx: number) => {
          const nomor = idx + 1
          const j = jawaban[soal.id]
          switch (soal.tipe) {
            case 'pilgan':     return <PilganSoal key={soal.id} soal={soal} nomor={nomor} jawaban={j} onChange={handleJawaban} />
            case 'benar_salah': return <BenarSalahSoal key={soal.id} soal={soal} nomor={nomor} jawaban={j} onChange={handleJawaban} />
            case 'menjodohkan': return <MenjodohkanSoal key={soal.id} soal={soal} nomor={nomor} jawaban={j || {}} onChange={handleJawaban} />
            case 'tts':        return <TTSSoal key={soal.id} soal={soal} nomor={nomor} jawaban={j || {}} onChange={handleJawaban} />
            case 'drag_drop':  return <DragDropSoal key={soal.id} soal={soal} nomor={nomor} jawaban={j || {}} onChange={handleJawaban} />
            case 'uraian':     return <UraianSoal key={soal.id} soal={soal} nomor={nomor} jawaban={j || ''} onChange={handleJawaban} />
            default:           return null
          }
        })}

        <div className="bg-gradient-to-r from-green-500/30 to-teal-500/30 border-2 border-green-400/50 rounded-2xl p-5 text-center">
          <p className="text-white font-bold mb-1">Sudah selesai mengerjakan?</p>
          <p className="text-white/60 text-sm mb-4">Pastikan semua soal sudah dijawab sebelum mengirim!</p>
          <button onClick={() => setShowConfirm(true)}
            className="w-full bg-green-400 hover:bg-green-300 text-gray-900 font-black text-lg py-3 rounded-xl shadow-xl transition-all transform hover:scale-105">
            ✅ SELESAI & KIRIM
          </button>
        </div>
      </div>

      {/* Modal Konfirmasi */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-gray-900/95 border border-white/20 rounded-3xl p-6 w-full max-w-sm text-center shadow-2xl">
            <div className="text-4xl mb-3">⚠️</div>
            <h3 className="text-white font-black text-lg mb-2">Yakin sudah selesai?</h3>
            <p className="text-white/60 text-sm mb-6">Jawaban yang sudah dikirim <strong>tidak bisa diubah</strong> lagi.</p>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setShowConfirm(false)} className="bg-white/20 hover:bg-white/30 text-white font-bold py-3 rounded-xl transition">Belum</button>
              <button onClick={() => { setShowConfirm(false); handleSubmit() }} disabled={submitting}
                className="bg-green-400 hover:bg-green-300 text-gray-900 font-black py-3 rounded-xl transition">
                {submitting ? 'Mengirim...' : 'Ya, Kirim!'}
              </button>
            </div>
          </div>
        </div>
      )}

      <p className="text-white/30 text-xs text-center py-4">created by dhickz666</p>
    </PageWrapper>
  )
}
