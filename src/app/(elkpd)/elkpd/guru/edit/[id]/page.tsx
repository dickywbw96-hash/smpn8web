// src/app/(elkpd)/elkpd/guru/edit/[id]/page.tsx
// Edit kegiatan yang sudah ada — sama persis dengan halaman SiapkanKegiatan
// tapi data awal di-load dari Supabase berdasarkan id

'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import PageWrapper from '@/components/elkpd/PageWrapper'
import NavbarElkpd from '@/components/elkpd/Navbar'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase-elkpd'
import { callGemini } from '@/utils/callGemini'
import { downloadLKPDPdf } from '@/utils/downloadLKPD'
import AIModal from '@/components/ai/AIModal'
import {
  generateId, createSoalBaru,
  buildMateriPrompt, buildSoalPrompt,
  parseMateriResult, parseSoalResult,
} from '@/utils/elkpd'

const TIPE_SOAL = [
  { value: 'pilgan',      label: '🔘 Pilihan Ganda', desc: 'A/B/C/D dengan 1 jawaban benar' },
  { value: 'benar_salah', label: '✅ Benar/Salah',   desc: 'Pernyataan benar atau salah' },
  { value: 'menjodohkan', label: '🔗 Menjodohkan',   desc: 'Pasangkan kolom kiri dan kanan' },
  { value: 'tts',         label: '🔤 Isian Singkat',  desc: 'Isi jawaban di kotak' },
  { value: 'drag_drop',   label: '🎯 Drag & Drop',    desc: 'Seret item ke posisi benar' },
  { value: 'uraian',      label: '✍ Uraian',          desc: 'Jawaban panjang, dinilai guru' },
]

// ── Soal editor per tipe ─────────────────────────────────────
function SoalEditor({ soal, onChange, onDelete }: { soal: any; onChange: (s: any) => void; onDelete: () => void }) {
  const set = (k: string, v: any) => onChange({ ...soal, [k]: v })

  const inp = 'w-full bg-white/15 border border-white/25 rounded-xl px-3 py-2 text-white placeholder-white/35 text-sm focus:outline-none focus:border-yellow-400/60 transition'

  return (
    <div style={{ background:'rgba(0,0,0,0.35)', border:'1px solid rgba(255,255,255,0.15)', borderRadius:18, padding:16, marginBottom:12 }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
        <span style={{ background:'#1e3a8a', color:'#fff', fontWeight:900, fontSize:12, padding:'3px 10px', borderRadius:8 }}>
          {TIPE_SOAL.find(t => t.value === soal.tipe)?.label || soal.tipe}
        </span>
        <label style={{ color:'rgba(255,255,255,0.5)', fontSize:11 }}>Skor:</label>
        <input type="number" min={1} value={soal.skor || 10} onChange={e => set('skor', Number(e.target.value))}
          style={{ width:56, background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.2)', color:'#fff', borderRadius:8, padding:'4px 8px', textAlign:'center', fontSize:13 }} />
        <button onClick={onDelete} style={{ marginLeft:'auto', background:'rgba(239,68,68,0.3)', border:'1px solid rgba(239,68,68,0.4)', color:'#fca5a5', borderRadius:8, padding:'4px 10px', fontSize:11, fontWeight:700, cursor:'pointer' }}>🗑 Hapus</button>
      </div>

      {/* Pertanyaan */}
      <textarea value={soal.pertanyaan} onChange={e => set('pertanyaan', e.target.value)}
        placeholder="Tulis pertanyaan / pernyataan..." rows={2}
        className={inp + ' resize-none mb-3'} />

      {/* Pilgan */}
      {soal.tipe === 'pilgan' && (
        <div className="space-y-2">
          {soal.pilihan?.map((p: any, i: number) => (
            <div key={p.id} className="flex items-center gap-2">
              <span className="text-white/50 font-bold text-sm w-5">{String.fromCharCode(65+i)}.</span>
              <input value={p.teks} onChange={e => set('pilihan', soal.pilihan.map((x: any, xi: number) => xi === i ? { ...x, teks: e.target.value } : x))}
                placeholder={`Pilihan ${String.fromCharCode(65+i)}`} className={inp + ' flex-1'} />
              <input type="radio" name={`kunci_${soal.id}`} checked={soal.kunci === p.id} onChange={() => set('kunci', p.id)} />
              <span className="text-white/40 text-xs">Kunci</span>
            </div>
          ))}
        </div>
      )}

      {/* Benar/Salah */}
      {soal.tipe === 'benar_salah' && (
        <div className="flex gap-3">
          {['benar', 'salah'].map(v => (
            <button key={v} onClick={() => set('kunci', v)}
              className={`flex-1 py-2 rounded-xl font-bold text-sm transition ${soal.kunci === v ? (v==='benar' ? 'bg-green-500 text-white' : 'bg-red-500 text-white') : 'bg-white/10 text-white/50'}`}>
              {v === 'benar' ? '✅ BENAR' : '❌ SALAH'}
            </button>
          ))}
        </div>
      )}

      {/* Menjodohkan */}
      {soal.tipe === 'menjodohkan' && (
        <div className="space-y-2">
          {soal.pasangan?.map((p: any, i: number) => (
            <div key={p.kiri_id} className="grid grid-cols-2 gap-2">
              <input value={p.kiri} onChange={e => set('pasangan', soal.pasangan.map((x: any, xi: number) => xi===i ? {...x, kiri: e.target.value} : x))} placeholder={`Kiri ${i+1}`} className={inp} />
              <input value={p.kanan} onChange={e => set('pasangan', soal.pasangan.map((x: any, xi: number) => xi===i ? {...x, kanan: e.target.value} : x))} placeholder={`Kanan ${i+1}`} className={inp} />
            </div>
          ))}
          <button onClick={() => set('pasangan', [...soal.pasangan, { kiri_id: generateId(), kiri: '', kanan_id: generateId(), kanan: '' }])}
            className="text-yellow-300 text-xs underline mt-1">+ Tambah pasangan</button>
        </div>
      )}

      {/* TTS */}
      {soal.tipe === 'tts' && (
        <div className="space-y-2">
          {soal.kotak?.map((k: any, i: number) => (
            <div key={k.id} className="grid grid-cols-2 gap-2">
              <input value={k.petunjuk} onChange={e => set('kotak', soal.kotak.map((x: any, xi: number) => xi===i ? {...x, petunjuk: e.target.value} : x))} placeholder={`Petunjuk ${i+1}`} className={inp} />
              <input value={k.jawaban} onChange={e => set('kotak', soal.kotak.map((x: any, xi: number) => xi===i ? {...x, jawaban: e.target.value} : x))} placeholder={`Jawaban ${i+1}`} className={inp} />
            </div>
          ))}
          <button onClick={() => set('kotak', [...soal.kotak, { id: generateId(), petunjuk: '', jawaban: '' }])}
            className="text-yellow-300 text-xs underline mt-1">+ Tambah kotak</button>
        </div>
      )}

      {/* Drag & Drop */}
      {soal.tipe === 'drag_drop' && (
        <div className="space-y-3">
          <div>
            <p className="text-white/50 text-xs mb-2 font-bold">ITEM:</p>
            {soal.item?.map((it: any, i: number) => (
              <input key={it.id} value={it.teks} onChange={e => set('item', soal.item.map((x: any, xi: number) => xi===i ? {...x, teks: e.target.value} : x))}
                placeholder={`Item ${i+1}`} className={inp + ' mb-2'} />
            ))}
            <button onClick={() => set('item', [...soal.item, { id: generateId(), teks: '' }])} className="text-yellow-300 text-xs underline">+ Tambah item</button>
          </div>
          <div>
            <p className="text-white/50 text-xs mb-2 font-bold">SLOT:</p>
            {soal.slot?.map((sl: any, i: number) => (
              <div key={sl.id} className="flex gap-2 mb-2">
                <input value={sl.label} onChange={e => set('slot', soal.slot.map((x: any, xi: number) => xi===i ? {...x, label: e.target.value} : x))}
                  placeholder={`Label slot ${i+1}`} className={inp + ' flex-1'} />
                <select value={sl.jawaban_item_id} onChange={e => set('slot', soal.slot.map((x: any, xi: number) => xi===i ? {...x, jawaban_item_id: e.target.value} : x))}
                  className="bg-white/10 border border-white/20 text-white rounded-xl px-2 py-2 text-xs">
                  <option value="">-- Jawaban --</option>
                  {soal.item?.map((it: any) => <option key={it.id} value={it.id}>{it.teks || `Item ${soal.item.indexOf(it)+1}`}</option>)}
                </select>
              </div>
            ))}
            <button onClick={() => set('slot', [...soal.slot, { id: generateId(), label: '', jawaban_item_id: '' }])} className="text-yellow-300 text-xs underline">+ Tambah slot</button>
          </div>
        </div>
      )}

      {/* Uraian */}
      {soal.tipe === 'uraian' && (
        <div className="bg-orange-500/10 border border-orange-400/20 rounded-xl p-3 text-orange-300 text-xs">
          ✍ Siswa mengetik jawaban panjang — dinilai manual oleh guru
        </div>
      )}
    </div>
  )
}

// ── Main ─────────────────────────────────────────────────────
export default function EditKegiatanPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string
  const { guru, logout } = useAuth()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [pdfLoading, setPdfLoading] = useState(false)

  // Form state
  const [judul, setJudul] = useState('')
  const [isiMateri, setIsiMateri] = useState('')
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [soalList, setSoalList] = useState<any[]>([])
  const [token, setToken] = useState('')

  // AI state
  const [showAIModal, setShowAIModal] = useState(false)
  const [aiMode, setAiMode] = useState<'materi' | 'lkpd'>('materi')
  const [aiStatus, setAiStatus] = useState('')
  const [aiLoading, setAiLoading] = useState(false)

  useEffect(() => {
    if (!guru) { router.push('/elkpd/guru/login'); return }
    if (id) fetchKegiatan()
  }, [guru, id])

  const fetchKegiatan = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('kegiatan').select('*').eq('id', id).eq('guru_id', guru!.id).single()
    if (error || !data) { alert('Kegiatan tidak ditemukan.'); router.push('/elkpd/guru/hasil'); return }
    setJudul(data.judul || '')
    setIsiMateri(data.isi_materi || '')
    setYoutubeUrl(data.youtube_url || '')
    setSoalList(data.soal_data || [])
    setToken(data.token || '')
    setLoading(false)
  }

  const handleSave = async () => {
    if (!judul.trim()) { alert('Judul tidak boleh kosong!'); return }
    setSaving(true)
    const { error } = await supabase.from('kegiatan').update({
      judul: judul.trim(), isi_materi: isiMateri, youtube_url: youtubeUrl, soal_data: soalList,
    }).eq('id', id).eq('guru_id', guru!.id)
    setSaving(false)
    if (error) { alert('Gagal menyimpan: ' + error.message); return }
    alert('✅ Kegiatan berhasil disimpan!')
    router.push('/elkpd/guru/hasil')
  }

  const handleAIGenerate = async (form: any) => {
    setShowAIModal(false)
    setAiLoading(true)
    setAiStatus('Memulai AI...')
    try {
      if (aiMode === 'materi') {
        const prompt = buildMateriPrompt({ ...form, mapel: guru!.mapel })
        const text = await callGemini(prompt, { onStatus: setAiStatus })
        const { isiMateri: mat, youtubeUrl: yt } = parseMateriResult(text, form.sertakanVideo)
        setIsiMateri(mat)
        if (yt) setYoutubeUrl(yt)
        setAiStatus('✅ Materi berhasil di-generate!')
      } else {
        const prompt = buildSoalPrompt({ ...form, mapel: guru!.mapel })
        const text = await callGemini(prompt, { onStatus: setAiStatus })
        const soal = parseSoalResult(text)
        setSoalList(soal)
        setAiStatus(`✅ ${soal.length} soal berhasil di-generate!`)
      }
    } catch (err: any) {
      setAiStatus('❌ ' + (err.message || 'Gagal generate'))
    } finally {
      setAiLoading(false)
      setTimeout(() => setAiStatus(''), 4000)
    }
  }

  const addSoal = (tipe: string) => setSoalList(prev => [...prev, createSoalBaru(tipe)])
  const updateSoal = (i: number, s: any) => setSoalList(prev => prev.map((x, xi) => xi === i ? s : x))
  const deleteSoal = (i: number) => setSoalList(prev => prev.filter((_, xi) => xi !== i))

  const handleDownloadPDF = async () => {
    setPdfLoading(true)
    try {
      await downloadLKPDPdf({ judul, guru, token, isiMateri, youtubeUrl, soalList })
    } catch (err: any) { alert('Gagal: ' + err.message) }
    finally { setPdfLoading(false) }
  }

  if (!guru) return null

  if (loading) {
    return (
      <PageWrapper>
        <NavbarElkpd guruNama={guru.nama} onLogout={() => { logout(); router.push('/elkpd') }} showGuruBtn={false} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center"><div className="text-4xl mb-3 animate-bounce">⏳</div><p className="text-white/60">Memuat kegiatan...</p></div>
        </div>
      </PageWrapper>
    )
  }

  const btnBase = { fontWeight: 700, fontSize: 13, borderRadius: 12, border: 'none', cursor: 'pointer', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s' } as React.CSSProperties

  return (
    <PageWrapper>
      {showAIModal && (
        <AIModal mode={aiMode} mapelDefault={guru.mapel} judulDefault={judul}
          onGenerate={handleAIGenerate} onClose={() => setShowAIModal(false)} />
      )}
      <NavbarElkpd guruNama={guru.nama} onLogout={() => { logout(); router.push('/elkpd') }} showGuruBtn={false} />
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '24px 16px 48px' }}>

        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
          <button onClick={() => router.push('/elkpd/guru/hasil')}
            style={{ background:'rgba(255,255,255,0.15)', color:'#fff', borderRadius:12, padding:'8px 14px', border:'none', cursor:'pointer', fontWeight:700, fontSize:15 }}>←</button>
          <div>
            <h1 style={{ color:'#fff', fontWeight:900, fontSize:18, margin:0 }}>✏️ Edit Kegiatan</h1>
            <p style={{ color:'rgba(255,255,255,0.4)', fontSize:12, margin:0 }}>Token: <strong style={{ color:'#fde047', letterSpacing:'0.15em' }}>{token}</strong></p>
          </div>
          <div style={{ marginLeft:'auto', display:'flex', gap:8 }}>
            <button onClick={handleDownloadPDF} disabled={pdfLoading}
              style={{ ...btnBase, background:'rgba(124,58,237,0.8)', color:'#fff', opacity: pdfLoading ? 0.5 : 1 }}>
              {pdfLoading ? '⏳' : '📄'} PDF
            </button>
            <button onClick={handleSave} disabled={saving}
              style={{ ...btnBase, background:'linear-gradient(135deg,#16a34a,#15803d)', color:'#fff', opacity: saving ? 0.6 : 1 }}>
              {saving ? '⏳ Menyimpan...' : '💾 Simpan'}
            </button>
          </div>
        </div>

        {/* AI Status */}
        {(aiLoading || aiStatus) && (
          <div style={{ background: aiStatus.startsWith('❌') ? 'rgba(239,68,68,0.2)' : 'rgba(34,197,94,0.15)', border: `1px solid ${aiStatus.startsWith('❌') ? 'rgba(239,68,68,0.4)' : 'rgba(34,197,94,0.3)'}`, borderRadius:14, padding:'12px 16px', marginBottom:16, display:'flex', alignItems:'center', gap:10 }}>
            {aiLoading && <div style={{ width:16, height:16, border:'2px solid rgba(255,255,255,0.2)', borderTopColor:'#facc15', borderRadius:'50%', animation:'spin 0.7s linear infinite', flexShrink:0 }} />}
            <p style={{ color:aiStatus.startsWith('❌') ? '#fca5a5' : '#86efac', fontSize:13, fontWeight:600, margin:0 }}>{aiStatus}</p>
          </div>
        )}

        {/* Judul */}
        <div style={{ background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.15)', borderRadius:20, padding:20, marginBottom:16 }}>
          <label style={{ color:'rgba(255,255,255,0.7)', fontSize:13, fontWeight:700, display:'block', marginBottom:8 }}>📌 Judul Kegiatan</label>
          <input value={judul} onChange={e => setJudul(e.target.value)} placeholder="cth: Fotosintesis dan Respirasi Tumbuhan"
            style={{ width:'100%', boxSizing:'border-box', background:'rgba(0,0,0,0.3)', border:'2px solid rgba(255,255,255,0.2)', color:'#fff', borderRadius:14, padding:'12px 16px', fontSize:15, fontWeight:600 }} />
        </div>

        {/* Materi */}
        <div style={{ background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.15)', borderRadius:20, padding:20, marginBottom:16 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
            <label style={{ color:'rgba(255,255,255,0.7)', fontSize:13, fontWeight:700 }}>📖 Materi</label>
            <button onClick={() => { setAiMode('materi'); setShowAIModal(true) }}
              style={{ ...btnBase, background:'rgba(250,204,21,0.2)', color:'#fde047', border:'1px solid rgba(250,204,21,0.4)', padding:'6px 12px', fontSize:12 }}>
              ✨ Generate AI
            </button>
          </div>
          <input value={youtubeUrl} onChange={e => setYoutubeUrl(e.target.value)} placeholder="URL YouTube (opsional)"
            style={{ width:'100%', boxSizing:'border-box', background:'rgba(0,0,0,0.3)', border:'1px solid rgba(255,255,255,0.2)', color:'#fff', borderRadius:12, padding:'10px 14px', fontSize:13, marginBottom:10 }} />
          <textarea value={isiMateri} onChange={e => setIsiMateri(e.target.value)} rows={6}
            placeholder="Tulis ringkasan materi di sini, atau klik 'Generate AI'..."
            style={{ width:'100%', boxSizing:'border-box', background:'rgba(0,0,0,0.3)', border:'1px solid rgba(255,255,255,0.2)', color:'#fff', borderRadius:12, padding:'10px 14px', fontSize:13, resize:'vertical' }} />
        </div>

        {/* Soal */}
        <div style={{ background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.15)', borderRadius:20, padding:20, marginBottom:16 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
            <label style={{ color:'rgba(255,255,255,0.7)', fontSize:13, fontWeight:700 }}>📝 Soal LKPD ({soalList.length})</label>
            <button onClick={() => { setAiMode('lkpd'); setShowAIModal(true) }}
              style={{ ...btnBase, background:'rgba(250,204,21,0.2)', color:'#fde047', border:'1px solid rgba(250,204,21,0.4)', padding:'6px 12px', fontSize:12 }}>
              ✨ Generate AI
            </button>
          </div>

          {soalList.map((s, i) => (
            <SoalEditor key={s.id} soal={s} onChange={updated => updateSoal(i, updated)} onDelete={() => deleteSoal(i)} />
          ))}

          <div style={{ marginTop:12 }}>
            <p style={{ color:'rgba(255,255,255,0.5)', fontSize:11, fontWeight:700, marginBottom:8, textTransform:'uppercase' }}>+ Tambah soal manual:</p>
            <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
              {TIPE_SOAL.map(t => (
                <button key={t.value} onClick={() => addSoal(t.value)}
                  style={{ background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.2)', color:'#fff', borderRadius:10, padding:'7px 14px', fontSize:12, fontWeight:600, cursor:'pointer', transition:'all 0.2s' }}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Save bottom */}
        <button onClick={handleSave} disabled={saving}
          style={{ width:'100%', background:'linear-gradient(135deg,#16a34a,#15803d)', color:'#fff', fontWeight:900, fontSize:16, padding:16, borderRadius:16, border:'none', cursor:'pointer', opacity: saving ? 0.6 : 1 }}>
          {saving ? '⏳ Menyimpan...' : '💾 Simpan Perubahan'}
        </button>
      </div>

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </PageWrapper>
  )
}
