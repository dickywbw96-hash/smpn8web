'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import PageWrapper from '@/components/elkpd/PageWrapper'
import NavbarElkpd from '@/components/elkpd/Navbar'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase-elkpd'
import { downloadLKPDPdf } from '@/utils/downloadLKPD'
import { downloadExcel } from '@/utils/downloadExcel'
import Swal from 'sweetalert2'

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

function DeleteConfirmModal({ kegiatan, onConfirm, onCancel, loading }: { kegiatan: Kegiatan; onConfirm: () => void; onCancel: () => void; loading: boolean }) {
  return (
    <div style={{ position:'fixed', inset:0, zIndex:50, display:'flex', alignItems:'center', justifyContent:'center', padding:'0 16px' }}>
      <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.6)', backdropFilter:'blur(4px)' }} onClick={onCancel} />
      <div style={{ position:'relative', background:'#111827', border:'1px solid rgba(239,68,68,0.4)', borderRadius:20, padding:24, maxWidth:360, width:'100%', boxShadow:'0 25px 50px rgba(0,0,0,0.5)' }}>
        <div style={{ display:'flex', justifyContent:'center', marginBottom:16 }}>
          <div style={{ background:'rgba(239,68,68,0.2)', border:'1px solid rgba(239,68,68,0.4)', borderRadius:'50%', width:64, height:64, display:'flex', alignItems:'center', justifyContent:'center', fontSize:28 }}>🗑️</div>
        </div>
        <h2 style={{ color:'#fff', fontWeight:900, textAlign:'center', fontSize:18, margin:'0 0 8px' }}>Hapus Kegiatan?</h2>
        <p style={{ color:'#fde047', fontWeight:700, textAlign:'center', fontSize:14, margin:'0 0 16px', background:'rgba(255,255,255,0.05)', borderRadius:12, padding:'8px 12px' }}>"{kegiatan.judul}"</p>
        <div style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:12, padding:12, marginBottom:20 }}>
          <p style={{ color:'#fca5a5', fontWeight:700, fontSize:14, margin:'0 0 6px' }}>⚠️ Tindakan ini tidak bisa dibatalkan!</p>
          <p style={{ color:'rgba(252,165,165,0.7)', fontSize:12, margin:0, lineHeight:1.6 }}>Menghapus kegiatan akan menghapus <strong>semua data jawaban siswa</strong> secara permanen.</p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          <button onClick={onCancel} disabled={loading} style={{ background:'rgba(255,255,255,0.1)', color:'#fff', fontWeight:700, padding:'12px', borderRadius:12, border:'none', cursor:'pointer', fontSize:14 }}>Batal</button>
          <button onClick={onConfirm} disabled={loading} style={{ background:'#dc2626', color:'#fff', fontWeight:900, padding:'12px', borderRadius:12, border:'none', cursor:'pointer', fontSize:14, opacity: loading ? 0.5 : 1 }}>
            {loading ? '⏳ Menghapus...' : '🗑️ Ya, Hapus'}
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
  const [hiddenIds, setHiddenIds] = useState<Set<number>>(new Set())
  const [savingIds, setSavingIds] = useState<Set<number>>(new Set())
  const [showDinilai, setShowDinilai] = useState(false)
  const [editInlineId, setEditInlineId] = useState<number | null>(null)
  const [editInlineSkor, setEditInlineSkor] = useState('')
  const [editInlineSaving, setEditInlineSaving] = useState<number | null>(null)
  const saveTimers = useRef<Record<number, ReturnType<typeof setTimeout>>>({})
  const inputRefs = useRef<Record<number, HTMLInputElement | null>>({})

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!selected?.id) return
    try {
      const saved = sessionStorage.getItem(`hiddenIds_${selected.id}`)
      setHiddenIds(saved ? new Set(JSON.parse(saved)) : new Set())
    } catch { setHiddenIds(new Set()) }
    setSavingIds(new Set())
    setShowDinilai(false)
    setEditInlineId(null)
    setEditInlineSkor('')
    setEditInlineSaving(null)
    inputRefs.current = {}
    return () => { Object.values(saveTimers.current).forEach(clearTimeout) }
  }, [selected?.id])

  useEffect(() => {
    if (!guru) return router.push('/elkpd/guru/login')
    fetchKegiatan()
  }, [guru])

  const fetchKegiatan = async () => {
    setLoadingK(true)
    const { data } = await supabase.from('kegiatan').select('*').eq('guru_id', guru!.id).order('created_at', { ascending: false })
    setKegiatanList((data as Kegiatan[]) || [])
    setLoadingK(false)
  }

  const fetchJawaban = async (kegiatan: Kegiatan) => {
    setSelected(kegiatan)
    setLoadingJ(true)
    const { data } = await supabase.from('jawaban_siswa').select('*').eq('kegiatan_id', kegiatan.id).order('kelas', { ascending: true }).order('nama', { ascending: true })
    setJawabanList((data as Jawaban[]) || [])
    setEditSkor({})
    setLoadingJ(false)
  }

  const setHiddenIdsPersist = useCallback((updater: ((prev: Set<number>) => Set<number>) | Set<number>) => {
    setHiddenIds((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      if (selected?.id) { try { sessionStorage.setItem(`hiddenIds_${selected.id}`, JSON.stringify([...next])) } catch {} }
      return next
    })
  }, [selected?.id])

  const focusNextInput = useCallback((currentId: number) => {
    setJawabanList((prevList) => {
      setHiddenIds((prevHidden) => {
        const visibleIds = prevList.filter((j) => !prevHidden.has(j.id)).map((j) => j.id)
        const nextId = visibleIds[visibleIds.indexOf(currentId) + 1]
        if (nextId && inputRefs.current[nextId]) setTimeout(() => { inputRefs.current[nextId]?.focus(); inputRefs.current[nextId]?.select() }, 50)
        return prevHidden
      })
      return prevList
    })
  }, [])

  const handleSimpanSkor = useCallback(async (jawaban: Jawaban) => {
    if (editSkor[jawaban.id] === undefined) return
    const skorUraian = Number(editSkor[jawaban.id] || 0)
    const total = (jawaban.skor_otomatis || 0) + skorUraian
    await supabase.from('jawaban_siswa').update({ skor_uraian: skorUraian, skor_total: total }).eq('id', jawaban.id)
    setJawabanList((prev) => prev.map((j) => j.id === jawaban.id ? { ...j, skor_uraian: skorUraian, skor_total: total } : j))
    setSavingIds((prev) => new Set([...prev, jawaban.id]))
    if (saveTimers.current[jawaban.id]) clearTimeout(saveTimers.current[jawaban.id])
    saveTimers.current[jawaban.id] = setTimeout(() => {
      setSavingIds((prev) => { const next = new Set(prev); next.delete(jawaban.id); return next })
      setHiddenIdsPersist((prev) => new Set([...prev, jawaban.id]))
    }, 1500)
  }, [editSkor, setHiddenIdsPersist])

  const handleSimpanEditInline = async (jawaban: Jawaban) => {
    if (editInlineSkor === '' || editInlineSaving) return
    setEditInlineSaving(jawaban.id)
    const skorUraian = Number(editInlineSkor || 0)
    const total = (jawaban.skor_otomatis || 0) + skorUraian
    try {
      await supabase.from('jawaban_siswa').update({ skor_uraian: skorUraian, skor_total: total }).eq('id', jawaban.id)
      setJawabanList((prev) => prev.map((j) => j.id === jawaban.id ? { ...j, skor_uraian: skorUraian, skor_total: total } : j))
      setEditInlineId(null); setEditInlineSkor('')
    } catch (err) { alert('Gagal menyimpan: ' + (err instanceof Error ? err.message : String(err))) }
    finally { setEditInlineSaving(null) }
  }

  const getUraianSoal = (soalData: SoalItem[] | null | undefined) => soalData?.filter((s) => s.tipe === 'uraian') || []

  const handleDownloadPDF = async (kegiatan: Kegiatan) => {
    setPdfLoading(kegiatan.id)
    try { await downloadLKPDPdf({ judul: kegiatan.judul, guru, token: kegiatan.token, isiMateri: kegiatan.isi_materi, youtubeUrl: kegiatan.youtube_url, soalList: kegiatan.soal_data }) }
    catch (err) { alert('Gagal membuat PDF: ' + (err instanceof Error ? err.message : String(err))) }
    finally { setPdfLoading(null) }
  }

  const handleDownloadExcel = async () => {
    if (!selected) return
    setExcelLoading(true)
    try { await downloadExcel({ judul: selected.judul, guru, jawabanList }) }
    catch (err) { alert('Gagal download Excel: ' + (err instanceof Error ? err.message : String(err))) }
    finally { setExcelLoading(false) }
  }

  const handleHapusKegiatan = async () => {
    if (!deleteTarget) return
    setDeleteLoading(true)
    const targetJudul = deleteTarget.judul
    const targetId = deleteTarget.id
    try {
      const { error: e1 } = await supabase.from('jawaban_siswa').delete().eq('kegiatan_id', targetId)
      if (e1) throw e1
      const { error: e2 } = await supabase.from('kegiatan').delete().eq('id', targetId).eq('guru_id', guru!.id)
      if (e2) throw e2
      const { data: cek } = await supabase.from('kegiatan').select('id').eq('id', targetId).maybeSingle()
      if (cek !== null) { setDeleteTarget(null); await Swal.fire({ icon:'error', title:'❌ Hapus Gagal!', background:'#1f2937', color:'#f3f4f6', confirmButtonColor:'#dc2626' }); return }
      try { sessionStorage.removeItem(`hiddenIds_${targetId}`) } catch {}
      setKegiatanList((prev) => prev.filter((k) => k.id !== targetId))
      if (selected?.id === targetId) { setSelected(null); setJawabanList([]) }
      setDeleteTarget(null)
      await Swal.fire({ icon:'success', title:'🗑️ Kegiatan Dihapus!', html:`<p style="color:#86efac">"${targetJudul}"</p>`, background:'#111827', color:'#f9fafb', confirmButtonColor:'#16a34a', timer:3000, timerProgressBar:true })
    } catch (err) {
      setDeleteTarget(null)
      await Swal.fire({ icon:'error', title:'⚠️ Terjadi Kesalahan', html:`<p style="color:#fca5a5;font-size:13px">${err instanceof Error ? err.message : String(err)}</p>`, background:'#1f2937', color:'#f3f4f6', confirmButtonColor:'#dc2626' })
    } finally { setDeleteLoading(false) }
  }

  const handleShareWA = (kegiatan: Kegiatan) => {
    const pesan = `📚 *KEGIATAN PEMBELAJARAN*\nMata Pelajaran: *${guru?.mapel || '-'}*\nGuru: *${guru?.nama || '-'}*\n\n🔑 *Token:* *${kegiatan.token}*\n🌐 https://smpn8prob.sch.id/elkpd`
    navigator.clipboard.writeText(pesan).catch(() => {})
    window.open(`https://wa.me/?text=${encodeURIComponent(pesan)}`, '_blank')
  }

  if (!guru) return null

  const sudahDinilaiCount = hiddenIds.size
  const semuaSudahDinilai = jawabanList.length > 0 && jawabanList.every((j) => hiddenIds.has(j.id)) && savingIds.size === 0

  const btnBase: React.CSSProperties = { fontWeight:700, fontSize:13, borderRadius:12, border:'none', cursor:'pointer', padding:'10px 12px', display:'flex', alignItems:'center', justifyContent:'center', gap:6, transition:'all 0.2s' }

  return (
    <PageWrapper>
      <NavbarElkpd guruNama={guru.nama} onLogout={() => { logout(); router.push('/elkpd') }} showGuruBtn={false} />

      {deleteTarget && <DeleteConfirmModal kegiatan={deleteTarget} onConfirm={handleHapusKegiatan} onCancel={() => !deleteLoading && setDeleteTarget(null)} loading={deleteLoading} />}

      {showScrollTop && (
        <button onClick={() => window.scrollTo({ top:0, behavior:'smooth' })}
          style={{ position:'fixed', bottom:24, right:20, zIndex:40, background:'#2563eb', color:'#fff', borderRadius:16, width:48, height:48, display:'flex', alignItems:'center', justifyContent:'center', border:'none', cursor:'pointer', fontSize:18, boxShadow:'0 8px 24px rgba(37,99,235,0.4)' }}>
          ↑
        </button>
      )}

      <div style={{ maxWidth:680, margin:'0 auto', padding:'24px 16px' }}>

        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
          <button onClick={() => selected ? setSelected(null) : router.push('/elkpd/guru/dashboard')}
            style={{ background:'rgba(255,255,255,0.2)', color:'#fff', borderRadius:12, padding:'8px 14px', border:'none', cursor:'pointer', fontWeight:700, fontSize:16 }}>
            ←
          </button>
          <div>
            <h1 style={{ color:'#fff', fontWeight:900, fontSize:20, margin:0 }}>{selected ? `Hasil: ${selected.judul}` : 'Lihat Hasil'}</h1>
            <p style={{ color:'rgba(255,255,255,0.5)', fontSize:13, margin:0 }}>{guru.mapel}</p>
          </div>
        </div>

        {/* Daftar Kegiatan */}
        {!selected && (
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            {loadingK && <div style={{ textAlign:'center', color:'rgba(255,255,255,0.5)', padding:'32px 0' }}>⏳ Memuat data...</div>}
            {!loadingK && kegiatanList.length === 0 && (
              <div style={{ textAlign:'center', color:'rgba(255,255,255,0.4)', padding:'32px 0' }}>
                <div style={{ fontSize:36, marginBottom:8 }}>📭</div>
                <p>Belum ada kegiatan yang dibuat</p>
              </div>
            )}
            {kegiatanList.map((k) => (
              <div key={k.id} style={{ background:'rgba(0,0,0,0.5)', border:'1px solid rgba(255,255,255,0.2)', borderRadius:20, padding:16, backdropFilter:'blur(10px)' }}>
                <button onClick={() => fetchJawaban(k)} style={{ width:'100%', textAlign:'left', background:'none', border:'none', cursor:'pointer', marginBottom:12 }}>
                  <p style={{ color:'#fff', fontWeight:700, fontSize:15, margin:'0 0 4px' }}>{k.judul}</p>
                  <p style={{ color:'rgba(255,255,255,0.5)', fontSize:12, margin:0 }}>
                    Token: <strong style={{ color:'#fde047', letterSpacing:'0.15em' }}>{k.token}</strong>
                    <span style={{ margin:'0 8px' }}>·</span>
                    {new Date(k.created_at).toLocaleDateString('id-ID', { day:'numeric', month:'short', year:'numeric' })}
                  </p>
                </button>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:8 }}>
                  <button onClick={() => fetchJawaban(k)} style={{ ...btnBase, background:'rgba(37,99,235,0.7)', color:'#fff' }}>📊 Hasil Siswa</button>
                  <button onClick={() => handleShareWA(k)} style={{ ...btnBase, background:'rgba(22,163,74,0.8)', color:'#fff' }}>💬 Bagikan WA</button>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:8 }}>
                  <button onClick={() => router.push(`/elkpd/guru/preview/${k.id}`)} style={{ ...btnBase, background:'rgba(255,255,255,0.15)', color:'#fff' }}>👁 Preview</button>
                  <button onClick={() => router.push(`/elkpd/guru/edit/${k.id}`)} style={{ ...btnBase, background:'rgba(234,179,8,0.7)', color:'#fff' }}>✏️ Edit</button>
                  <button onClick={() => handleDownloadPDF(k)} disabled={pdfLoading === k.id} style={{ ...btnBase, background:'rgba(124,58,237,0.8)', color:'#fff', opacity: pdfLoading === k.id ? 0.5 : 1 }}>{pdfLoading === k.id ? '⏳' : '📄'} PDF</button>
                  <button onClick={() => setDeleteTarget(k)} style={{ ...btnBase, background:'rgba(220,38,38,0.7)', color:'#fff' }}>🗑️ Hapus</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Detail Jawaban */}
        {selected && (
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <div style={{ background:'rgba(37,99,235,0.2)', border:'1px solid rgba(96,165,250,0.3)', borderRadius:20, padding:16 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
                <div>
                  <p style={{ color:'#fff', fontWeight:700, margin:'0 0 4px' }}>{selected.judul}</p>
                  <p style={{ color:'#93c5fd', fontSize:13, margin:0 }}>Token: <strong>{selected.token}</strong> — {jawabanList.length} siswa</p>
                </div>
                {jawabanList.length > 0 && (
                  <button onClick={handleDownloadExcel} disabled={excelLoading}
                    style={{ ...btnBase, background:'#059669', color:'#fff', opacity: excelLoading ? 0.5 : 1, fontSize:12 }}>
                    {excelLoading ? '⏳...' : '📊 Unduh Excel'}
                  </button>
                )}
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:8 }}>
                <button onClick={() => handleShareWA(selected)} style={{ ...btnBase, background:'rgba(22,163,74,0.7)', color:'#fff', fontSize:12 }}>💬 Bagikan</button>
                <button onClick={() => router.push(`/elkpd/guru/preview/${selected.id}`)} style={{ ...btnBase, background:'rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.8)', fontSize:12 }}>👁 Preview</button>
                <button onClick={() => router.push(`/elkpd/guru/edit/${selected.id}`)} style={{ ...btnBase, background:'rgba(234,179,8,0.3)', color:'#fde047', fontSize:12 }}>✏️ Edit</button>
                <button onClick={() => setDeleteTarget(selected)} style={{ ...btnBase, background:'rgba(220,38,38,0.6)', color:'#fca5a5', fontSize:12 }}>🗑️ Hapus</button>
              </div>
            </div>

            {loadingJ && <div style={{ textAlign:'center', color:'rgba(255,255,255,0.5)', padding:'32px 0' }}>⏳ Memuat...</div>}

            {!loadingJ && jawabanList.length === 0 && (
              <div style={{ textAlign:'center', color:'rgba(255,255,255,0.4)', padding:'40px 0' }}>
                <div style={{ fontSize:40, marginBottom:12 }}>📭</div>
                <p style={{ fontWeight:700, color:'rgba(255,255,255,0.5)' }}>Belum ada siswa yang mengerjakan</p>
              </div>
            )}

            {!loadingJ && semuaSudahDinilai && (
              <div style={{ textAlign:'center', padding:'40px 0' }}>
                <div style={{ fontSize:40, marginBottom:12 }}>🎉</div>
                <p style={{ color:'#4ade80', fontWeight:900, fontSize:18, margin:'0 0 4px' }}>Semua siswa sudah dinilai!</p>
                <button onClick={handleDownloadExcel} disabled={excelLoading}
                  style={{ ...btnBase, background:'#059669', color:'#fff', margin:'16px auto 0', padding:'10px 24px' }}>
                  {excelLoading ? '⏳...' : '📊 Unduh Rekap Excel'}
                </button>
              </div>
            )}

            {!loadingJ && sudahDinilaiCount > 0 && (
              <button onClick={() => setShowDinilai(v => !v)}
                style={{ width:'100%', background:'rgba(34,197,94,0.15)', border:'1px solid rgba(34,197,94,0.3)', borderRadius:16, padding:'12px 16px', display:'flex', alignItems:'center', justifyContent:'space-between', cursor:'pointer' }}>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <span style={{ color:'#4ade80', fontSize:18 }}>✅</span>
                  <span style={{ color:'#86efac', fontWeight:700, fontSize:14 }}>{sudahDinilaiCount} siswa sudah dinilai</span>
                </div>
                <span style={{ color:'#4ade80', fontSize:13, fontWeight:700 }}>{showDinilai ? '▲ Sembunyikan' : '▼ Tampilkan'}</span>
              </button>
            )}

            {!loadingJ && showDinilai && sudahDinilaiCount > 0 && (
              <div style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:16, overflow:'hidden' }}>
                <div style={{ padding:'10px 16px', borderBottom:'1px solid rgba(255,255,255,0.1)', background:'rgba(255,255,255,0.05)' }}>
                  <p style={{ color:'rgba(255,255,255,0.6)', fontSize:11, fontWeight:700, textTransform:'uppercase', margin:0 }}>Daftar Sudah Dinilai</p>
                </div>
                {jawabanList.filter((j) => hiddenIds.has(j.id)).map((j) => {
                  const isEditOpen = editInlineId === j.id
                  return (
                    <div key={j.id} style={{ borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 16px' }}>
                        <div>
                          <span style={{ color:'rgba(255,255,255,0.8)', fontSize:14, fontWeight:600 }}>{j.nama}</span>
                          <span style={{ color:'rgba(255,255,255,0.4)', fontSize:12, marginLeft:8 }}>Kelas {j.kelas}</span>
                        </div>
                        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                          <div style={{ textAlign:'right' }}>
                            <p style={{ color:'rgba(255,255,255,0.4)', fontSize:9, textTransform:'uppercase', margin:'0 0 2px' }}>Otomatis</p>
                            <p style={{ color:'rgba(255,255,255,0.6)', fontWeight:700, fontSize:14, margin:0 }}>{j.skor_otomatis || 0}</p>
                          </div>
                          <div style={{ textAlign:'right' }}>
                            <p style={{ color:'rgba(251,146,60,0.6)', fontSize:9, textTransform:'uppercase', margin:'0 0 2px' }}>Uraian</p>
                            <p style={{ color:'#fb923c', fontWeight:700, fontSize:14, margin:0 }}>{j.skor_uraian ?? 0}</p>
                          </div>
                          <div style={{ textAlign:'right', borderLeft:'1px solid rgba(255,255,255,0.1)', paddingLeft:12 }}>
                            <p style={{ color:'rgba(250,204,21,0.6)', fontSize:9, textTransform:'uppercase', margin:'0 0 2px' }}>Total</p>
                            <p style={{ color:'#facc15', fontWeight:900, fontSize:18, margin:0 }}>{j.skor_total ?? j.skor_otomatis}</p>
                          </div>
                          <button onClick={() => { if (isEditOpen) { setEditInlineId(null); setEditInlineSkor('') } else { setEditInlineId(j.id); setEditInlineSkor(String(j.skor_uraian ?? 0)) } }}
                            style={{ background: isEditOpen ? 'rgba(255,255,255,0.2)' : 'rgba(251,146,60,0.2)', color: isEditOpen ? '#fff' : '#fb923c', border:'none', borderRadius:8, padding:'6px 8px', cursor:'pointer', fontSize:13, fontWeight:700 }}>
                            {isEditOpen ? '✕' : '✏️'}
                          </button>
                        </div>
                      </div>
                      {isEditOpen && (
                        <div style={{ padding:'12px 16px', background:'rgba(251,146,60,0.05)', borderTop:'1px solid rgba(251,146,60,0.1)' }}>
                          <div style={{ display:'flex', gap:8 }}>
                            <input type="number" min={0} autoFocus value={editInlineSkor} onChange={(e) => setEditInlineSkor(e.target.value)}
                              onKeyDown={(e) => { if (e.key === 'Enter') handleSimpanEditInline(j); if (e.key === 'Escape') { setEditInlineId(null); setEditInlineSkor('') } }}
                              placeholder="Skor uraian..."
                              style={{ flex:1, background:'rgba(255,255,255,0.15)', border:'1px solid rgba(251,146,60,0.4)', color:'#fff', borderRadius:12, padding:'8px 12px', fontSize:14, fontWeight:700 }} />
                            <button onClick={() => handleSimpanEditInline(j)} disabled={editInlineSaving === j.id || editInlineSkor === ''}
                              style={{ ...btnBase, background:'#f97316', color:'#fff', opacity: editInlineSaving === j.id || editInlineSkor === '' ? 0.5 : 1 }}>
                              {editInlineSaving === j.id ? '⏳' : '💾'} Simpan
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {jawabanList.map((j, idx) => {
              const uraianSoal = getUraianSoal(selected.soal_data)
              const isHidden = hiddenIds.has(j.id)
              const isSaving = savingIds.has(j.id)
              if (isHidden && !isSaving) return null
              return (
                <div key={j.id} style={{ background:'rgba(0,0,0,0.5)', border:'1px solid rgba(255,255,255,0.2)', borderRadius:20, padding:16, display:'flex', gap:16, backdropFilter:'blur(8px)', opacity: isSaving ? 0.4 : 1, transition:'all 0.5s' }}>
                  <div style={{ flex:1 }}>
                    <p style={{ color:'#fff', fontWeight:700, fontSize:16, margin:'0 0 4px' }}>
                      {idx + 1}. {j.nama}
                      {isSaving && <span style={{ color:'#4ade80', fontSize:12, fontWeight:400, marginLeft:8 }}>✅ Tersimpan...</span>}
                      <span style={{ color:'rgba(255,255,255,0.5)', fontSize:13, fontWeight:400, marginLeft:8, background:'rgba(255,255,255,0.1)', padding:'2px 8px', borderRadius:8 }}>Kelas {j.kelas}</span>
                    </p>
                    {uraianSoal.length > 0 ? (
                      <div style={{ marginTop:12, display:'flex', flexDirection:'column', gap:8 }}>
                        {uraianSoal.map((soal, i) => (
                          <div key={soal.id} style={{ background:'rgba(255,255,255,0.05)', borderRadius:10, padding:'8px 12px', fontSize:13, color:'rgba(255,255,255,0.8)' }}>
                            <span style={{ color:'#fb923c', fontWeight:700, fontSize:11, marginRight:8 }}>Uraian {i + 1}:</span>
                            {j.jawaban_data?.[soal.id] || '(tidak dijawab)'}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p style={{ color:'rgba(255,255,255,0.4)', fontSize:12, marginTop:8, fontStyle:'italic' }}>Tidak ada soal uraian.</p>
                    )}
                  </div>
                  <div style={{ width:120, display:'flex', flexDirection:'column', justifyContent:'space-between', borderLeft:'1px solid rgba(255,255,255,0.1)', paddingLeft:16 }}>
                    <div style={{ textAlign:'right' }}>
                      <p style={{ color:'rgba(255,255,255,0.5)', fontSize:9, textTransform:'uppercase', fontWeight:700, margin:'0 0 2px' }}>Skor Sementara</p>
                      <p style={{ color:'#fff', fontWeight:700, fontSize:22, margin:0 }}>{j.skor_otomatis || 0}</p>
                    </div>
                    {uraianSoal.length > 0 && (
                      <div style={{ textAlign:'right', marginTop:12 }}>
                        <p style={{ color:'#fb923c', fontSize:9, textTransform:'uppercase', fontWeight:700, margin:'0 0 4px' }}>+ Skor Uraian</p>
                        <input ref={(el) => { inputRefs.current[j.id] = el }} type="number" min={0}
                          value={editSkor[j.id] ?? j.skor_uraian ?? ''}
                          onChange={(e) => setEditSkor((prev) => ({ ...prev, [j.id]: e.target.value }))}
                          onBlur={() => handleSimpanSkor(j)}
                          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); focusNextInput(j.id); handleSimpanSkor(j) } }}
                          placeholder="0"
                          style={{ width:'100%', background:'rgba(255,255,255,0.2)', border:'1px solid rgba(255,255,255,0.3)', color:'#fff', borderRadius:10, padding:'6px 8px', textAlign:'center', fontWeight:700, fontSize:14, boxSizing:'border-box' }} />
                      </div>
                    )}
                    <div style={{ textAlign:'right', marginTop:12, paddingTop:12, borderTop:'1px solid rgba(255,255,255,0.1)' }}>
                      <p style={{ color:'rgba(250,204,21,0.7)', fontSize:9, textTransform:'uppercase', fontWeight:700, margin:'0 0 2px' }}>Total Akhir</p>
                      <p style={{ color:'#facc15', fontWeight:900, fontSize:26, margin:0 }}>{j.skor_total ?? j.skor_otomatis}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
      <p style={{ color:'rgba(255,255,255,0.3)', fontSize:11, textAlign:'center', padding:'16px 0' }}>created by dhickz666</p>
    </PageWrapper>
  )
}