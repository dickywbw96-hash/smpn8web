'use client'
// src/app/(elkpd)/elkpd/guru/hasil/page.tsx
import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import PageWrapper from '@/components/elkpd/PageWrapper'
import NavbarElkpd from '@/components/elkpd/Navbar'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase-elkpd'
import { downloadLKPDPdf } from '@/utils/downloadLKPD'
import { downloadExcel } from '@/utils/downloadExcel'
import Swal from 'sweetalert2'

// ─── Types ──────────────────────────────────────────────────
interface Kegiatan {
  id: number
  judul: string
  token: string
  created_at: string
  guru_id: number
  soal_data: SoalItem[] | null
  isi_materi?: string
  youtube_url?: string
  [key: string]: unknown
}

interface SoalItem {
  id: string
  tipe: string
  pertanyaan: string
  skor: number
  [key: string]: unknown
}

interface Jawaban {
  id: number
  nama: string
  kelas: string
  skor_otomatis: number
  skor_uraian: number | null
  skor_total: number | null
  kegiatan_id: number
  jawaban_data: Record<string, string> | null
  [key: string]: unknown
}

// ─── DeleteConfirmModal ──────────────────────────────────────
interface DeleteConfirmModalProps {
  kegiatan: Kegiatan
  onConfirm: () => void
  onCancel: () => void
  loading: boolean
}

function DeleteConfirmModal({ kegiatan, onConfirm, onCancel, loading }: DeleteConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-gray-900 border border-red-500/40 rounded-2xl p-6 max-w-sm w-full shadow-2xl shadow-red-900/30">
        <div className="flex justify-center mb-4">
          <div className="bg-red-500/20 border border-red-500/40 rounded-full w-16 h-16 flex items-center justify-center text-3xl">🗑️</div>
        </div>
        <h2 className="text-white font-black text-center text-lg mb-2">Hapus Kegiatan?</h2>
        <p className="text-yellow-300 font-bold text-center text-sm mb-4 bg-white/5 rounded-xl py-2 px-3">"{kegiatan.judul}"</p>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-5 space-y-1.5">
          <p className="text-red-300 font-bold text-sm flex items-center gap-2">⚠️ <span>Tindakan ini tidak bisa dibatalkan!</span></p>
          <p className="text-red-200/70 text-xs leading-relaxed">
            Menghapus kegiatan akan menghapus <strong className="text-red-200">semua data jawaban siswa</strong> yang telah mengerjakan, termasuk skor dan hasil mereka secara permanen.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={onCancel} disabled={loading} className="bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl transition text-sm">Batal</button>
          <button onClick={onConfirm} disabled={loading} className="bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-black py-3 rounded-xl transition text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-900/40">
            {loading ? <>⏳ Menghapus...</> : <>🗑️ Ya, Hapus</>}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function LihatHasil() {
  const router = useRouter()
  const { guru, logout } = useAuth()
  const [kegiatanList, setKegiatanList] = useState<Kegiatan[]>([])
  const [selected, setSelected] = useState<Kegiatan | null>(null)
  const [jawabanList, setJawabanList] = useState<Jawaban[]>([])
  const [loadingK, setLoadingK] = useState(true)
  const [loadingJ, setLoadingJ] = useState(false)
  const [editSkor, setEditSkor] = useState<Record<number, string>>({})
  const [pdfLoading, setPdfLoading] = useState<number | null>(null)
  const [excelLoading, setExcelLoading] = useState(false)

  const [deleteTarget, setDeleteTarget] = useState<Kegiatan | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const [showScrollTop, setShowScrollTop] = useState(false)
  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  const [hiddenIds, setHiddenIds] = useState<Set<number>>(new Set())
  const [savingIds, setSavingIds] = useState<Set<number>>(new Set())
  const [showDinilai, setShowDinilai] = useState(false)
  const saveTimers = useRef<Record<number, ReturnType<typeof setTimeout>>>({})
  const inputRefs = useRef<Record<number, HTMLInputElement | null>>({})

  const [editInlineId, setEditInlineId] = useState<number | null>(null)
  const [editInlineSkor, setEditInlineSkor] = useState('')
  const [editInlineSaving, setEditInlineSaving] = useState<number | null>(null)

  useEffect(() => {
    if (!selected?.id) return
    try {
      const saved = sessionStorage.getItem(`hiddenIds_${selected.id}`)
      setHiddenIds(saved ? new Set(JSON.parse(saved)) : new Set())
    } catch {
      setHiddenIds(new Set())
    }
    setSavingIds(new Set())
    setShowDinilai(false)
    setEditInlineId(null)
    setEditInlineSkor('')
    setEditInlineSaving(null)
    inputRefs.current = {}
    return () => { Object.values(saveTimers.current).forEach(clearTimeout) }
  }, [selected?.id])

  useEffect(() => {
    if (!guru) return router.push('/guru/login')
    fetchKegiatan()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guru])

  const fetchKegiatan = async () => {
    setLoadingK(true)
    const { data } = await supabase
      .from('kegiatan')
      .select('*')
      .eq('guru_id', guru!.id)
      .order('created_at', { ascending: false })
    setKegiatanList((data as Kegiatan[]) || [])
    setLoadingK(false)
  }

  const fetchJawaban = async (kegiatan: Kegiatan) => {
    setSelected(kegiatan)
    setLoadingJ(true)
    const { data } = await supabase
      .from('jawaban_siswa')
      .select('*')
      .eq('kegiatan_id', kegiatan.id)
      .order('kelas', { ascending: true })
      .order('nama', { ascending: true })
    setJawabanList((data as Jawaban[]) || [])
    setEditSkor({})
    setLoadingJ(false)
  }

  const setHiddenIdsPersist = useCallback((updater: ((prev: Set<number>) => Set<number>) | Set<number>) => {
    setHiddenIds((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      if (selected?.id) {
        try {
          sessionStorage.setItem(`hiddenIds_${selected.id}`, JSON.stringify([...next]))
        } catch {}
      }
      return next
    })
  }, [selected?.id])

  const focusNextInput = useCallback((currentId: number) => {
    setJawabanList((prevList) => {
      setHiddenIds((prevHidden) => {
        const visibleIds = prevList
          .filter((j) => !prevHidden.has(j.id))
          .map((j) => j.id)
        const currentIndex = visibleIds.indexOf(currentId)
        const nextId = visibleIds[currentIndex + 1]
        if (nextId && inputRefs.current[nextId]) {
          setTimeout(() => {
            inputRefs.current[nextId]?.focus()
            inputRefs.current[nextId]?.select()
          }, 50)
        }
        return prevHidden
      })
      return prevList
    })
  }, [])

  const handleSimpanSkor = useCallback(async (jawaban: Jawaban) => {
    if (editSkor[jawaban.id] === undefined) return

    const skorUraian = Number(editSkor[jawaban.id] || 0)
    const total = (jawaban.skor_otomatis || 0) + skorUraian

    await supabase
      .from('jawaban_siswa')
      .update({ skor_uraian: skorUraian, skor_total: total })
      .eq('id', jawaban.id)

    setJawabanList((prev) =>
      prev.map((j) =>
        j.id === jawaban.id ? { ...j, skor_uraian: skorUraian, skor_total: total } : j
      )
    )

    setSavingIds((prev) => new Set([...prev, jawaban.id]))
    if (saveTimers.current[jawaban.id]) clearTimeout(saveTimers.current[jawaban.id])

    saveTimers.current[jawaban.id] = setTimeout(() => {
      setSavingIds((prev) => {
        const next = new Set(prev)
        next.delete(jawaban.id)
        return next
      })
      setHiddenIdsPersist((prev) => new Set([...prev, jawaban.id]))
    }, 1500)
  }, [editSkor, setHiddenIdsPersist])

  const handleSimpanEditInline = async (jawaban: Jawaban) => {
    if (editInlineSkor === '' || editInlineSaving) return
    setEditInlineSaving(jawaban.id)

    const skorUraian = Number(editInlineSkor || 0)
    const total = (jawaban.skor_otomatis || 0) + skorUraian

    try {
      await supabase
        .from('jawaban_siswa')
        .update({ skor_uraian: skorUraian, skor_total: total })
        .eq('id', jawaban.id)

      setJawabanList((prev) =>
        prev.map((j) =>
          j.id === jawaban.id ? { ...j, skor_uraian: skorUraian, skor_total: total } : j
        )
      )
      setEditInlineId(null)
      setEditInlineSkor('')
    } catch (err) {
      alert('Gagal menyimpan: ' + (err instanceof Error ? err.message : String(err)))
    } finally {
      setEditInlineSaving(null)
    }
  }

  const getUraianSoal = (soalData: SoalItem[] | null | undefined) =>
    soalData?.filter((s) => s.tipe === 'uraian') || []

  const handleDownloadPDF = async (kegiatan: Kegiatan) => {
    setPdfLoading(kegiatan.id)
    try {
      await downloadLKPDPdf({
        judul: kegiatan.judul,
        guru,
        token: kegiatan.token,
        isiMateri: kegiatan.isi_materi,
        youtubeUrl: kegiatan.youtube_url,
        soalList: kegiatan.soal_data,
      })
    } catch (err) {
      alert('Gagal membuat PDF: ' + (err instanceof Error ? err.message : String(err)))
    } finally {
      setPdfLoading(null)
    }
  }

  const handleDownloadExcel = async () => {
    if (!selected) return
    setExcelLoading(true)
    try {
      await downloadExcel({ judul: selected.judul, guru, jawabanList })
    } catch (err) {
      alert('Gagal mendownload Excel: ' + (err instanceof Error ? err.message : String(err)))
    } finally {
      setExcelLoading(false)
    }
  }

  const handleHapusKegiatan = async () => {
    if (!deleteTarget) return
    setDeleteLoading(true)
    // capture judul before clearing deleteTarget
    const targetJudul = deleteTarget.judul
    const targetId = deleteTarget.id
    try {
      const { error: errJawaban } = await supabase
        .from('jawaban_siswa')
        .delete()
        .eq('kegiatan_id', targetId)
      if (errJawaban) throw errJawaban

      const { error: errKegiatan } = await supabase
        .from('kegiatan')
        .delete()
        .eq('id', targetId)
        .eq('guru_id', guru!.id)
      if (errKegiatan) throw errKegiatan

      const { data: cekData, error: errCek } = await supabase
        .from('kegiatan')
        .select('id')
        .eq('id', targetId)
        .maybeSingle()
      if (errCek) throw errCek

      if (cekData !== null) {
        setDeleteTarget(null)
        await Swal.fire({
          icon: 'error',
          title: '❌ Hapus Gagal!',
          html: `<p style="color:#f87171;font-size:14px;margin-bottom:8px;">Data kegiatan <strong>"${targetJudul}"</strong> masih ditemukan di database.</p><p style="color:#9ca3af;font-size:12px;">Kemungkinan penyebab: izin RLS belum diatur atau ada foreign key yang belum terhapus.</p>`,
          background: '#1f2937', color: '#f3f4f6',
          confirmButtonColor: '#dc2626', confirmButtonText: 'Tutup',
        })
        return
      }

      try { sessionStorage.removeItem(`hiddenIds_${targetId}`) } catch {}

      setKegiatanList((prev) => prev.filter((k) => k.id !== targetId))
      if (selected?.id === targetId) { setSelected(null); setJawabanList([]) }
      setDeleteTarget(null)

      await Swal.fire({
        icon: 'success',
        title: '🗑️ Kegiatan Dihapus!',
        html: `<p style="color:#86efac;font-size:15px;font-weight:600;margin-bottom:6px;">"${targetJudul}"</p><p style="color:#9ca3af;font-size:13px;">Semua data siswa dan jawaban telah dihapus secara permanen.</p>`,
        background: '#111827', color: '#f9fafb',
        confirmButtonColor: '#16a34a', confirmButtonText: '✅ Oke, Mengerti',
        timer: 3000, timerProgressBar: true,
      })
    } catch (err) {
      setDeleteTarget(null)
      await Swal.fire({
        icon: 'error', title: '⚠️ Terjadi Kesalahan',
        html: `<p style="color:#fca5a5;font-size:13px;">${err instanceof Error ? err.message : String(err)}</p>`,
        background: '#1f2937', color: '#f3f4f6',
        confirmButtonColor: '#dc2626', confirmButtonText: 'Tutup',
      })
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleShareWA = (kegiatan: Kegiatan) => {
    const pesan =
`📚 *KEGIATAN PEMBELAJARAN*
Mata Pelajaran: *${guru?.mapel || '-'}*
Guru: *${guru?.nama || '-'}*

Halo, Siswa-Siswi SMPN 8 Probolinggo! 👋
Berikut token kegiatan LKPD yang bisa kamu akses:

🔑 *Token Kegiatan:*
*${kegiatan.token}*

🌐 *Link LKPD:*
https://lkpd-smpn8.vercel.app

Langkah-langkah:
1️⃣ Buka link di atas
2️⃣ Masukkan token kegiatan
3️⃣ Kerjakan LKPD dengan semangat! 💪

_Selamat belajar!_ 🎓`

    navigator.clipboard.writeText(pesan).catch(() => {})
    window.open(`https://wa.me/?text=${encodeURIComponent(pesan)}`, '_blank')
  }

  if (!guru) return null

  const sudahDinilaiCount = hiddenIds.size
  const semuaSudahDinilai = jawabanList.length > 0 &&
    jawabanList.every((j) => hiddenIds.has(j.id)) &&
    savingIds.size === 0

  return (
    <PageWrapper>
      <NavbarElkpd guruNama={guru.nama} onLogout={() => { logout(); router.push('/') }} showGuruBtn={false} />

      {deleteTarget && (
        <DeleteConfirmModal
          kegiatan={deleteTarget}
          onConfirm={handleHapusKegiatan}
          onCancel={() => !deleteLoading && setDeleteTarget(null)}
          loading={deleteLoading}
        />
      )}

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-5 z-40 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white rounded-2xl w-12 h-12 flex items-center justify-center shadow-xl shadow-blue-900/50 transition-all duration-200 border border-blue-400/30"
          title="Kembali ke atas"
        >
          ↑
        </button>
      )}

      <div className="max-w-2xl mx-auto px-4 py-6">

        <div className="flex items-center gap-3 mb-5">
          <button
            onClick={() => selected ? setSelected(null) : router.push('/guru/dashboard')}
            className="bg-white/20 hover:bg-white/30 text-white rounded-xl px-3 py-2 text-sm transition"
          >
            ←
          </button>
          <div>
            <h1 className="text-white font-black text-xl">
              {selected ? `Hasil: ${selected.judul}` : 'Lihat Hasil'}
            </h1>
            <p className="text-white/50 text-sm">{guru.mapel}</p>
          </div>
        </div>

        {/* ══ Daftar Kegiatan ══ */}
        {!selected && (
          <div className="space-y-4">
            {loadingK && <div className="text-center text-white/50 py-8">⏳ Memuat data...</div>}
            {!loadingK && kegiatanList.length === 0 && (
              <div className="text-center text-white/40 py-8">
                <p className="text-3xl mb-2">📭</p>
                <p>Belum ada kegiatan yang dibuat</p>
              </div>
            )}
            {kegiatanList.map((k) => (
              <div key={k.id} className="w-full bg-white/10 hover:bg-white/[0.13] border border-white/20 rounded-2xl p-4 transition">
                <button onClick={() => fetchJawaban(k)} className="w-full text-left mb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0 pr-2">
                      <p className="text-white font-bold text-base">{k.judul}</p>
                      <p className="text-white/50 text-xs mt-1">
                        Token: <strong className="text-yellow-300 tracking-widest">{k.token}</strong>
                        <span className="mx-2">·</span>
                        {new Date(k.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <div className="text-white/30 flex-shrink-0 mt-0.5 text-sm">▶</div>
                  </div>
                </button>

                <div className="grid grid-cols-2 gap-2 mb-2">
                  <button onClick={() => fetchJawaban(k)} className="bg-blue-600/70 hover:bg-blue-500/70 text-white font-bold text-sm px-3 py-3 rounded-xl transition flex items-center justify-center gap-2">
                    📊 <span>Hasil Siswa</span>
                  </button>
                  <button onClick={() => handleShareWA(k)} className="bg-green-600/80 hover:bg-green-500/80 text-white font-bold text-sm px-3 py-3 rounded-xl transition flex items-center justify-center gap-2">
                    💬 <span>Bagikan WA</span>
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  <button onClick={() => router.push(`/guru/preview/${k.id}`)} className="bg-white/15 hover:bg-white/25 text-white font-bold text-sm px-2 py-3 rounded-xl transition flex items-center justify-center gap-1">
                    👁 <span>Preview</span>
                  </button>
                  <button onClick={() => router.push(`/guru/edit/${k.id}`)} className="bg-yellow-500/70 hover:bg-yellow-400/70 text-white font-bold text-sm px-2 py-3 rounded-xl transition flex items-center justify-center gap-1">
                    ✏️ <span>Edit</span>
                  </button>
                  <button onClick={() => handleDownloadPDF(k)} disabled={pdfLoading === k.id} className="bg-purple-600/80 hover:bg-purple-500/80 disabled:opacity-50 text-white font-bold text-sm px-2 py-3 rounded-xl transition flex items-center justify-center gap-1">
                    {pdfLoading === k.id ? '⏳' : '📄'} <span>{pdfLoading === k.id ? '...' : 'PDF'}</span>
                  </button>
                  <button onClick={() => setDeleteTarget(k)} className="bg-red-600/70 hover:bg-red-500/80 text-white font-bold text-sm px-2 py-3 rounded-xl transition flex items-center justify-center gap-1">
                    🗑️ <span>Hapus</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ══ Detail Jawaban Siswa ══ */}
        {selected && (
          <div className="space-y-4">
            <div className="bg-blue-500/20 border border-blue-400/30 rounded-2xl p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-white font-bold">{selected.judul}</p>
                  <p className="text-blue-300 text-sm mt-1">
                    Token: <strong>{selected.token}</strong> — {jawabanList.length} siswa mengerjakan
                  </p>
                </div>
                {jawabanList.length > 0 && (
                  <button
                    onClick={handleDownloadExcel}
                    disabled={excelLoading}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm px-4 py-2 rounded-xl transition shadow-lg flex items-center gap-2"
                  >
                    {excelLoading ? '⏳...' : '📊 Unduh Excel'}
                  </button>
                )}
              </div>
              <div className="grid grid-cols-4 gap-2">
                <button onClick={() => handleShareWA(selected)} className="bg-green-600/70 hover:bg-green-500/70 text-white font-bold text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-1">
                  💬 <span>Bagikan</span>
                </button>
                <button onClick={() => router.push(`/guru/preview/${selected.id}`)} className="bg-white/10 hover:bg-white/20 text-white/80 font-bold text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-1">
                  👁 <span>Preview</span>
                </button>
                <button onClick={() => router.push(`/guru/edit/${selected.id}`)} className="bg-yellow-500/30 hover:bg-yellow-400/40 text-yellow-200 font-bold text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-1">
                  ✏️ <span>Edit</span>
                </button>
                <button onClick={() => setDeleteTarget(selected)} className="bg-red-600/60 hover:bg-red-500/70 text-red-200 font-bold text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-1">
                  🗑️ <span>Hapus</span>
                </button>
              </div>
            </div>

            {loadingJ && <div className="text-center text-white/50 py-8">⏳ Memuat...</div>}

            {!loadingJ && jawabanList.length === 0 && (
              <div className="text-center text-white/40 py-10">
                <p className="text-4xl mb-3">📭</p>
                <p className="font-bold text-white/50">Belum ada siswa yang mengerjakan LKPD</p>
                <p className="text-xs mt-1">Bagikan token ke siswa agar mereka bisa mulai</p>
              </div>
            )}

            {!loadingJ && semuaSudahDinilai && (
              <div className="text-center py-10">
                <p className="text-4xl mb-3">🎉</p>
                <p className="font-black text-green-400 text-lg">Semua siswa sudah dinilai!</p>
                <p className="text-white/40 text-xs mt-1">
                  {jawabanList.length} siswa · Klik "Tampilkan" di atas untuk review atau edit nilai
                </p>
                <button
                  onClick={handleDownloadExcel}
                  disabled={excelLoading}
                  className="mt-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm px-6 py-2.5 rounded-xl transition shadow-lg flex items-center gap-2 mx-auto"
                >
                  {excelLoading ? '⏳...' : '📊 Unduh Rekap Excel'}
                </button>
              </div>
            )}

            {!loadingJ && sudahDinilaiCount > 0 && (
              <button
                onClick={() => setShowDinilai((v) => !v)}
                className="w-full bg-green-500/15 hover:bg-green-500/25 border border-green-500/30 rounded-2xl px-4 py-3 flex items-center justify-between transition"
              >
                <div className="flex items-center gap-2">
                  <span className="text-green-400 text-lg">✅</span>
                  <span className="text-green-300 font-bold text-sm">{sudahDinilaiCount} siswa sudah dinilai</span>
                  <span className="text-green-400/60 text-xs">(disembunyikan)</span>
                </div>
                <span className="text-green-400 text-sm font-bold">
                  {showDinilai ? '▲ Sembunyikan' : '▼ Tampilkan'}
                </span>
              </button>
            )}

            {!loadingJ && showDinilai && sudahDinilaiCount > 0 && (
              <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <div className="px-4 py-2.5 border-b border-white/10 bg-white/5">
                  <p className="text-white/60 text-xs font-bold uppercase tracking-wider">Daftar Sudah Dinilai</p>
                </div>
                <div className="divide-y divide-white/5">
                  {jawabanList
                    .filter((j) => hiddenIds.has(j.id))
                    .map((j) => {
                      const isEditOpen = editInlineId === j.id
                      const isSavingThis = editInlineSaving === j.id
                      return (
                        <div key={j.id}>
                          <div className="flex items-center justify-between px-4 py-2.5">
                            <div className="flex-1 min-w-0">
                              <span className="text-white/80 text-sm font-semibold">{j.nama}</span>
                              <span className="text-white/40 text-xs ml-2">Kelas {j.kelas}</span>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <div className="text-right">
                                <p className="text-white/40 text-[9px] uppercase tracking-wider">Otomatis</p>
                                <p className="text-white/60 font-bold text-sm">{j.skor_otomatis || 0}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-orange-300/60 text-[9px] uppercase tracking-wider">Uraian</p>
                                <p className="text-orange-300 font-bold text-sm">{j.skor_uraian ?? 0}</p>
                              </div>
                              <div className="text-right border-l border-white/10 pl-2">
                                <p className="text-yellow-400/60 text-[9px] uppercase tracking-wider">Total</p>
                                <p className="text-yellow-400 font-black text-base">{j.skor_total ?? j.skor_otomatis}</p>
                              </div>
                              <button
                                onClick={() => {
                                  if (isEditOpen) {
                                    setEditInlineId(null)
                                    setEditInlineSkor('')
                                  } else {
                                    setEditInlineId(j.id)
                                    setEditInlineSkor(String(j.skor_uraian ?? 0))
                                  }
                                }}
                                className={`ml-1 text-xs px-2 py-1.5 rounded-lg font-bold transition ${
                                  isEditOpen
                                    ? 'bg-white/20 text-white'
                                    : 'bg-orange-500/20 hover:bg-orange-500/40 text-orange-300'
                                }`}
                                title="Edit skor uraian"
                              >
                                {isEditOpen ? '✕' : '✏️'}
                              </button>
                            </div>
                          </div>

                          {isEditOpen && (
                            <div className="px-4 pb-3 bg-orange-500/5 border-t border-orange-500/10">
                              <p className="text-orange-300/70 text-[10px] uppercase font-bold tracking-wider mt-2.5 mb-1.5">
                                Edit Skor Uraian
                              </p>
                              <div className="flex items-center gap-2">
                                <div className="flex-1 bg-white/5 rounded-lg px-3 py-1.5 text-xs text-white/50">
                                  Skor otomatis: <strong className="text-white/70">{j.skor_otomatis || 0}</strong>
                                  <span className="mx-1.5 text-white/20">+</span>
                                  Uraian baru: <strong className="text-orange-300">{editInlineSkor !== '' ? Number(editInlineSkor) : '?'}</strong>
                                  <span className="mx-1.5 text-white/20">=</span>
                                  Total: <strong className="text-yellow-400">{editInlineSkor !== '' ? (j.skor_otomatis || 0) + Number(editInlineSkor) : '?'}</strong>
                                </div>
                              </div>
                              <div className="flex gap-2 mt-2">
                                <input
                                  type="number"
                                  min={0}
                                  autoFocus
                                  value={editInlineSkor}
                                  onChange={(e) => setEditInlineSkor(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleSimpanEditInline(j)
                                    if (e.key === 'Escape') { setEditInlineId(null); setEditInlineSkor('') }
                                  }}
                                  placeholder="Masukkan skor uraian..."
                                  className="flex-1 bg-white/15 border border-orange-400/40 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 font-bold placeholder:text-white/30"
                                />
                                <button
                                  onClick={() => handleSimpanEditInline(j)}
                                  disabled={isSavingThis || editInlineSkor === ''}
                                  className="bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-white font-black text-sm px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-lg shadow-orange-900/30"
                                >
                                  {isSavingThis ? '⏳' : '💾'} <span>{isSavingThis ? 'Menyimpan...' : 'Simpan'}</span>
                                </button>
                              </div>
                              <p className="text-white/20 text-[9px] mt-1.5">Enter = simpan · Esc = batal</p>
                            </div>
                          )}
                        </div>
                      )
                    })}
                </div>
              </div>
            )}

            {jawabanList.map((j, idx) => {
              const uraianSoal = getUraianSoal(selected.soal_data)
              const isHidden = hiddenIds.has(j.id)
              const isSaving = savingIds.has(j.id)

              if (isHidden && !isSaving) return null

              return (
                <div
                  key={j.id}
                  className={`bg-white/10 border border-white/20 rounded-2xl p-4 flex gap-4 transition-all duration-500 ${
                    isSaving ? 'opacity-40 scale-[0.97] pointer-events-none' : 'opacity-100 scale-100'
                  }`}
                >
                  <div className="flex-1">
                    <p className="text-white font-bold text-lg mb-1">
                      {idx + 1}. {j.nama}
                      {isSaving && <span className="ml-2 text-green-400 text-xs font-normal animate-pulse">✅ Tersimpan...</span>}
                      <span className="font-normal text-white/50 text-sm ml-2 bg-white/10 px-2 py-0.5 rounded-md">Kelas {j.kelas}</span>
                    </p>

                    {uraianSoal.length > 0 ? (
                      <div className="mt-3 space-y-2">
                        {uraianSoal.map((soal, i) => {
                          const jawSiswa = j.jawaban_data?.[soal.id] || '(tidak dijawab)'
                          return (
                            <div key={soal.id} className="bg-white/5 rounded-lg px-3 py-2 text-sm text-white/80">
                              <span className="text-orange-300 font-bold text-xs mr-2">Uraian {i + 1}:</span>
                              {jawSiswa}
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <p className="text-white/40 text-xs mt-2 italic">Tidak ada soal uraian.</p>
                    )}
                  </div>

                  <div className="w-32 flex flex-col justify-between border-l border-white/10 pl-4 py-1">
                    <div className="text-right">
                      <p className="text-white/50 text-[10px] uppercase font-bold tracking-wider">Skor Sementara</p>
                      <p className="text-white font-bold text-xl">{j.skor_otomatis || 0}</p>
                    </div>

                    {uraianSoal.length > 0 && (
                      <div className="text-right mt-3">
                        <p className="text-orange-300 text-[10px] uppercase font-bold tracking-wider mb-1">+ Skor Uraian</p>
                        <input
                          ref={(el) => { inputRefs.current[j.id] = el }}
                          type="number"
                          min={0}
                          value={editSkor[j.id] ?? j.skor_uraian ?? ''}
                          onChange={(e) => setEditSkor((prev) => ({ ...prev, [j.id]: e.target.value }))}
                          onBlur={() => handleSimpanSkor(j)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              focusNextInput(j.id)
                              handleSimpanSkor(j)
                            }
                          }}
                          placeholder="0"
                          className="w-full bg-white/20 border border-white/30 text-white rounded-lg px-2 py-1.5 text-center focus:outline-none focus:ring-2 focus:ring-orange-400 font-bold"
                          title="Ketik angka lalu tekan Enter untuk lanjut ke siswa berikutnya"
                        />
                        <p className="text-white/30 text-[9px] mt-1">Enter = lanjut siswa berikutnya</p>
                      </div>
                    )}

                    <div className="text-right mt-3 pt-3 border-t border-white/10">
                      <p className="text-yellow-400 text-[10px] uppercase font-bold tracking-wider">Total Akhir</p>
                      <p className="text-yellow-400 font-black text-2xl">{j.skor_total ?? j.skor_otomatis}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <p className="text-white/30 text-xs text-center py-4">created by dhickz666</p>
    </PageWrapper>
  )
}
