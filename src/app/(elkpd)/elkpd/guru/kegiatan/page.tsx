// src/app/(elkpd)/elkpd/guru/kegiatan/page.tsx
'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import PageWrapper from '@/components/elkpd/PageWrapper'
import NavbarElkpd from '@/components/elkpd/Navbar'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase-elkpd'
import { generateToken } from '@/utils/elkpd'

const TIPE_SOAL = [
  { value: 'pilgan',      label: '🔘 Pilihan Ganda', desc: 'A/B/C/D dengan 1 jawaban benar' },
  { value: 'benar_salah', label: '✅ Benar/Salah',   desc: 'Pernyataan benar atau salah' },
  { value: 'menjodohkan', label: '🔗 Menjodohkan',   desc: 'Pasangkan kolom kiri dan kanan' },
  { value: 'tts',         label: '🔤 Isian Singkat', desc: 'Isi jawaban pendek di kotak' },
  { value: 'drag_drop',   label: '🎯 Drag & Drop',   desc: 'Seret item ke posisi yang benar' },
  { value: 'uraian',      label: '✍ Uraian',         desc: 'Jawaban panjang, dinilai guru' },
]

function genId() { return Math.random().toString(36).substr(2, 9) }

function createSoalBaru(tipe: string): any {
  const base = { id: genId(), tipe, skor: 10, pertanyaan: '' }
  switch (tipe) {
    case 'pilgan':
      return { ...base, pilihan: [{ id: 'a', teks: '' }, { id: 'b', teks: '' }, { id: 'c', teks: '' }, { id: 'd', teks: '' }], kunci: 'a' }
    case 'benar_salah':
      return { ...base, kunci: 'benar' }
    case 'menjodohkan':
      return { ...base, pasangan: [{ kiri_id: genId(), kiri: '', kanan_id: genId(), kanan: '' }, { kiri_id: genId(), kiri: '', kanan_id: genId(), kanan: '' }] }
    case 'tts':
      return { ...base, kotak: [{ id: genId(), petunjuk: '', jawaban: '' }, { id: genId(), petunjuk: '', jawaban: '' }] }
    case 'drag_drop':
      return { ...base, item: [{ id: genId(), teks: '' }, { id: genId(), teks: '' }], slot: [{ id: genId(), label: '', jawaban_item_id: '' }, { id: genId(), label: '', jawaban_item_id: '' }] }
    default:
      return base
  }
}

export default function SiapkanKegiatan() {
  const router = useRouter()
  const { guru, logout } = useAuth()
  const [tab, setTab] = useState<'materi' | 'soal'>('materi')
  const [token] = useState(generateToken)
  const [judul, setJudul] = useState('')
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [isiMateri, setIsiMateri] = useState('')
  const [fileMateri, setFileMateri] = useState<File | null>(null)
  const [fileTugas, setFileTugas] = useState<File | null>(null)
  const [soalList, setSoalList] = useState<any[]>([])
  const [saving, setSaving] = useState(false)
  const [showTokenModal, setShowTokenModal] = useState(false)
  const tokenCardRef = useRef<HTMLDivElement>(null)

  useEffect(() => { if (!guru) router.push('/elkpd/guru/login') }, [guru, router])

  const uploadFile = async (file: File, folder: string) => {
    const ext = file.name.split('.').pop()
    const path = `${folder}/${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('lkpd-files').upload(path, file)
    if (error) throw error
    const { data } = supabase.storage.from('lkpd-files').getPublicUrl(path)
    return data.publicUrl
  }

  const handleSimpan = async () => {
    if (!judul.trim()) return alert('Isi judul kegiatan dulu!')
    setSaving(true)
    try {
      const fileMateriUrl = fileMateri ? await uploadFile(fileMateri, 'materi') : null
      const fileTugasUrl = fileTugas ? await uploadFile(fileTugas, 'tugas') : null
      const { error } = await supabase.from('kegiatan').insert({
        token, guru_id: guru.id, judul,
        youtube_url: youtubeUrl || null,
        file_materi_url: fileMateriUrl,
        isi_materi: isiMateri || null,
        soal_data: soalList,
        file_tugas_url: fileTugasUrl,
        aktif: true,
      })
      if (error) throw error
      setShowTokenModal(true)
    } catch (err: any) {
      alert('Gagal menyimpan: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  const downloadToken = async () => {
    if (!tokenCardRef.current) return
    const { default: html2canvas } = await import('html2canvas')
    const canvas = await html2canvas(tokenCardRef.current, { backgroundColor: '#1e3a5f' })
    const link = document.createElement('a')
    link.download = `TOKEN-${token}.png`
    link.href = canvas.toDataURL()
    link.click()
  }

  const addSoal = (tipe: string) => setSoalList((prev) => [...prev, createSoalBaru(tipe)])
  const removeSoal = (id: string) => setSoalList((prev) => prev.filter((s) => s.id !== id))
  const updateSoal = (id: string, updater: (s: any) => any) => setSoalList((prev) => prev.map((s) => s.id === id ? updater(s) : s))

  if (!guru) return null

  return (
    <PageWrapper>
      <NavbarElkpd guruNama={guru.nama} onLogout={() => { logout(); router.push('/elkpd') }} showGuruBtn={false} />
      <div className="max-w-2xl mx-auto px-4 py-6">

        {/* Header Token */}
        <div className="bg-gradient-to-r from-blue-600/40 to-purple-600/40 border border-blue-400/50 rounded-2xl p-4 mb-5 flex items-center justify-between">
          <div>
            <p className="text-white/60 text-xs">Token Kegiatan Ini</p>
            <p className="text-yellow-300 font-black text-3xl tracking-[0.3em]">{token}</p>
            <p className="text-white/50 text-xs mt-1">Bagikan ke siswa setelah simpan</p>
          </div>
          <div className="text-4xl">🔑</div>
        </div>

        {/* Judul */}
        <div className="mb-4">
          <label className="text-white/80 text-sm font-semibold block mb-2">📌 Judul Kegiatan</label>
          <input type="text" value={judul} onChange={(e) => setJudul(e.target.value)} placeholder="Contoh: Bab 3 - Sistem Tata Surya"
            className="w-full bg-white/20 border border-white/30 text-white placeholder-white/40 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400" />
        </div>

        {/* Tab */}
        <div className="flex bg-white/10 rounded-2xl p-1 mb-5">
          {(['materi', 'soal'] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition ${tab === t ? 'bg-yellow-400 text-gray-900' : 'text-white/60 hover:text-white'}`}>
              {t === 'materi' ? '📖 Materi' : `📝 Soal LKPD (${soalList.length})`}
            </button>
          ))}
        </div>

        {/* TAB MATERI */}
        {tab === 'materi' && (
          <div className="space-y-4">
            <div className="bg-white/10 border border-white/20 rounded-2xl p-4">
              <label className="text-white font-bold text-sm block mb-2">▶ Link Video YouTube</label>
              <input type="url" value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full bg-white/20 border border-white/30 text-white placeholder-white/40 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400" />
            </div>
            <div className="bg-white/10 border border-white/20 rounded-2xl p-4">
              <label className="text-white font-bold text-sm block mb-2">📄 Upload File Materi (PDF)</label>
              <input type="file" accept=".pdf,.doc,.docx,.ppt,.pptx" onChange={(e) => setFileMateri(e.target.files?.[0] || null)}
                className="w-full text-white/70 text-sm file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-yellow-400 file:text-gray-900 file:font-bold file:cursor-pointer" />
              {fileMateri && <p className="text-green-300 text-xs mt-2">✅ {fileMateri.name}</p>}
            </div>
            <div className="bg-white/10 border border-white/20 rounded-2xl p-4">
              <label className="text-white font-bold text-sm block mb-2">📝 Materi / Ringkasan Teks</label>
              <textarea value={isiMateri} onChange={(e) => setIsiMateri(e.target.value)}
                placeholder="Tulis ringkasan materi atau pengantar pelajaran di sini..." rows={6}
                className="w-full bg-white/20 border border-white/30 text-white placeholder-white/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none" />
            </div>
            <div className="bg-white/10 border border-white/20 rounded-2xl p-4">
              <label className="text-white font-bold text-sm block mb-2">📎 Upload File Tugas (opsional)</label>
              <input type="file" onChange={(e) => setFileTugas(e.target.files?.[0] || null)}
                className="w-full text-white/70 text-sm file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-400 file:text-white file:font-bold file:cursor-pointer" />
              {fileTugas && <p className="text-green-300 text-xs mt-2">✅ {fileTugas.name}</p>}
            </div>
          </div>
        )}

        {/* TAB SOAL */}
        {tab === 'soal' && (
          <div className="space-y-4">
            <div className="bg-white/10 border border-white/20 rounded-2xl p-4">
              <p className="text-white font-bold text-sm mb-3">➕ Tambah Soal Baru:</p>
              <div className="grid grid-cols-2 gap-2">
                {TIPE_SOAL.map((t) => (
                  <button key={t.value} type="button" onClick={() => addSoal(t.value)}
                    className="bg-white/15 hover:bg-white/30 border border-white/20 rounded-xl p-3 text-left transition">
                    <p className="text-white font-bold text-xs">{t.label}</p>
                    <p className="text-white/50 text-xs mt-0.5">{t.desc}</p>
                  </button>
                ))}
              </div>
            </div>
            {soalList.length === 0 && (
              <div className="text-center text-white/40 py-8"><p className="text-3xl mb-2">📭</p><p className="text-sm">Belum ada soal. Tambahkan di atas!</p></div>
            )}
            {soalList.map((soal, idx) => (
              <SoalEditor key={soal.id} soal={soal} nomor={idx + 1}
                onUpdate={(updater) => updateSoal(soal.id, updater)}
                onRemove={() => removeSoal(soal.id)} />
            ))}
          </div>
        )}

        <div className="mt-6">
          <button onClick={handleSimpan} disabled={saving}
            className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 text-gray-900 font-black text-lg py-4 rounded-2xl shadow-xl transition-all transform hover:scale-105">
            {saving ? '⏳ Menyimpan...' : '💾 SIMPAN & DAPATKAN TOKEN'}
          </button>
        </div>
      </div>

      {/* Modal Token */}
      {showTokenModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-gray-900/98 border border-white/20 rounded-3xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-white font-black text-xl text-center mb-4">🎉 Kegiatan Tersimpan!</h3>
            <div ref={tokenCardRef}
              className="bg-gradient-to-br from-blue-800 to-indigo-900 rounded-2xl p-6 text-center mb-4 border-2 border-yellow-400">
              <img src="/logo.png" alt="Logo" className="h-12 w-12 object-contain mx-auto mb-2" />
              <p className="text-yellow-300 font-bold text-xs">LAMAN PEMBELAJARAN JARAK JAUH</p>
              <p className="text-white/80 text-xs mb-3">SMP NEGERI 8 PROBOLINGGO</p>
              <p className="text-white/60 text-sm mb-1">Mata Pelajaran: <strong className="text-white">{guru.mapel}</strong></p>
              <p className="text-white/60 text-sm mb-3">Guru: <strong className="text-white">{guru.nama}</strong></p>
              <div className="bg-yellow-400 rounded-xl py-3 px-4">
                <p className="text-gray-900 text-xs font-semibold mb-1">TOKEN KEGIATAN</p>
                <p className="text-gray-900 font-black text-4xl tracking-[0.3em]">{token}</p>
              </div>
              <p className="text-white/50 text-xs mt-3">Berikan token ini kepada siswa</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={downloadToken} className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-3 rounded-xl text-sm transition">⬇ Download PNG</button>
              <button onClick={() => { setShowTokenModal(false); router.push('/elkpd/guru/dashboard') }}
                className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold py-3 rounded-xl text-sm transition">✅ Selesai</button>
            </div>
          </div>
        </div>
      )}

      <p className="text-white/30 text-xs text-center py-4">created by dhickz666</p>
    </PageWrapper>
  )
}

// ─── SoalEditor (komponen lokal) ─────────────────────────────────────────────
function SoalEditor({ soal, nomor, onUpdate, onRemove }: { soal: any; nomor: number; onUpdate: (u: (s: any) => any) => void; onRemove: () => void }) {
  const update = (field: string, value: any) => onUpdate((s) => ({ ...s, [field]: value }))

  return (
    <div className="bg-white/10 border border-white/20 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="bg-yellow-400 text-gray-900 font-black text-xs px-2 py-1 rounded-lg">#{nomor}</span>
          <span className="text-white/60 text-xs font-semibold uppercase">{soal.tipe.replace('_', ' ')}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <span className="text-white/50 text-xs">Skor:</span>
            <input type="number" value={soal.skor} onChange={(e) => update('skor', Number(e.target.value))}
              className="w-14 bg-white/20 border border-white/30 text-white rounded-lg px-2 py-1 text-xs text-center focus:outline-none" />
          </div>
          <button onClick={onRemove} className="text-red-400 hover:text-red-300 text-lg leading-none">✕</button>
        </div>
      </div>

      <textarea value={soal.pertanyaan} onChange={(e) => update('pertanyaan', e.target.value)}
        placeholder="Tulis soal / pertanyaan..." rows={2}
        className="w-full bg-white/20 border border-white/30 text-white placeholder-white/40 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none mb-3" />

      {/* PILGAN */}
      {soal.tipe === 'pilgan' && (
        <div className="space-y-2">
          {soal.pilihan?.map((p: any, i: number) => (
            <div key={p.id} className="flex items-center gap-2">
              <input type="radio" name={`kunci-${soal.id}`} checked={soal.kunci === p.id} onChange={() => update('kunci', p.id)} className="accent-yellow-400" />
              <span className="text-white/60 text-sm font-bold">{String.fromCharCode(65 + i)}.</span>
              <input type="text" value={p.teks}
                onChange={(e) => update('pilihan', soal.pilihan.map((x: any) => x.id === p.id ? { ...x, teks: e.target.value } : x))}
                placeholder={`Pilihan ${String.fromCharCode(65 + i)}`}
                className="flex-1 bg-white/20 border border-white/30 text-white placeholder-white/40 rounded-lg px-3 py-1.5 text-sm focus:outline-none" />
            </div>
          ))}
          <p className="text-yellow-300 text-xs">● = Kunci Jawaban</p>
        </div>
      )}

      {/* BENAR SALAH */}
      {soal.tipe === 'benar_salah' && (
        <div className="grid grid-cols-2 gap-2">
          {['benar', 'salah'].map((v) => (
            <button key={v} type="button" onClick={() => update('kunci', v)}
              className={`py-2 rounded-xl font-bold text-sm transition ${soal.kunci === v ? 'bg-yellow-400 text-gray-900' : 'bg-white/20 text-white'}`}>
              {v === 'benar' ? '✅ Benar' : '❌ Salah'}
            </button>
          ))}
        </div>
      )}

      {/* MENJODOHKAN */}
      {soal.tipe === 'menjodohkan' && (
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2 mb-1">
            <p className="text-white/50 text-xs font-bold text-center">Kolom Kiri</p>
            <p className="text-white/50 text-xs font-bold text-center">Kolom Kanan</p>
          </div>
          {soal.pasangan?.map((p: any, i: number) => (
            <div key={p.kiri_id} className="grid grid-cols-2 gap-2">
              <input value={p.kiri} onChange={(e) => update('pasangan', soal.pasangan.map((x: any) => x.kiri_id === p.kiri_id ? { ...x, kiri: e.target.value } : x))}
                placeholder={`Kiri ${i + 1}`} className="bg-white/20 border border-white/30 text-white placeholder-white/40 rounded-lg px-3 py-1.5 text-sm focus:outline-none" />
              <input value={p.kanan} onChange={(e) => update('pasangan', soal.pasangan.map((x: any) => x.kiri_id === p.kiri_id ? { ...x, kanan: e.target.value } : x))}
                placeholder={`Kanan ${i + 1}`} className="bg-white/20 border border-white/30 text-white placeholder-white/40 rounded-lg px-3 py-1.5 text-sm focus:outline-none" />
            </div>
          ))}
          <button type="button" onClick={() => update('pasangan', [...soal.pasangan, { kiri_id: genId(), kiri: '', kanan_id: genId(), kanan: '' }])}
            className="text-yellow-300 text-xs hover:text-yellow-200">+ Tambah Pasangan</button>
        </div>
      )}

      {/* TTS */}
      {soal.tipe === 'tts' && (
        <div className="space-y-2">
          {soal.kotak?.map((k: any, i: number) => (
            <div key={k.id} className="grid grid-cols-2 gap-2">
              <input value={k.petunjuk} onChange={(e) => update('kotak', soal.kotak.map((x: any) => x.id === k.id ? { ...x, petunjuk: e.target.value } : x))}
                placeholder={`Petunjuk ${i + 1}`} className="bg-white/20 border border-white/30 text-white placeholder-white/40 rounded-lg px-3 py-1.5 text-sm focus:outline-none" />
              <input value={k.jawaban} onChange={(e) => update('kotak', soal.kotak.map((x: any) => x.id === k.id ? { ...x, jawaban: e.target.value } : x))}
                placeholder={`Jawaban ${i + 1}`} className="bg-white/20 border border-green-500/50 text-white placeholder-white/40 rounded-lg px-3 py-1.5 text-sm focus:outline-none" />
            </div>
          ))}
          <button type="button" onClick={() => update('kotak', [...soal.kotak, { id: genId(), petunjuk: '', jawaban: '' }])}
            className="text-yellow-300 text-xs hover:text-yellow-200">+ Tambah Kotak</button>
        </div>
      )}

      {/* DRAG DROP */}
      {soal.tipe === 'drag_drop' && (
        <div className="space-y-3">
          <div>
            <p className="text-white/60 text-xs font-bold mb-2">Item (yang diseret siswa):</p>
            {soal.item?.map((it: any, i: number) => (
              <input key={it.id} value={it.teks}
                onChange={(e) => update('item', soal.item.map((x: any) => x.id === it.id ? { ...x, teks: e.target.value } : x))}
                placeholder={`Item ${i + 1}`}
                className="w-full bg-white/20 border border-white/30 text-white placeholder-white/40 rounded-lg px-3 py-1.5 text-sm focus:outline-none mb-1" />
            ))}
            <button type="button" onClick={() => update('item', [...soal.item, { id: genId(), teks: '' }])} className="text-yellow-300 text-xs">+ Tambah Item</button>
          </div>
          <div>
            <p className="text-white/60 text-xs font-bold mb-2">Slot (label + jawaban yang benar):</p>
            {soal.slot?.map((sl: any, i: number) => (
              <div key={sl.id} className="grid grid-cols-2 gap-2 mb-1">
                <input value={sl.label} onChange={(e) => update('slot', soal.slot.map((x: any) => x.id === sl.id ? { ...x, label: e.target.value } : x))}
                  placeholder={`Label slot ${i + 1}`} className="bg-white/20 border border-white/30 text-white placeholder-white/40 rounded-lg px-3 py-1.5 text-sm focus:outline-none" />
                <select value={sl.jawaban_item_id} onChange={(e) => update('slot', soal.slot.map((x: any) => x.id === sl.id ? { ...x, jawaban_item_id: e.target.value } : x))}
                  className="bg-white/20 border border-green-500/50 text-white rounded-lg px-2 py-1.5 text-sm focus:outline-none">
                  <option value="" className="bg-gray-800">-- Jawaban --</option>
                  {soal.item?.map((it: any) => (
                    <option key={it.id} value={it.id} className="bg-gray-800">{it.teks || `Item (${it.id.slice(0, 4)})`}</option>
                  ))}
                </select>
              </div>
            ))}
            <button type="button" onClick={() => update('slot', [...soal.slot, { id: genId(), label: '', jawaban_item_id: '' }])} className="text-yellow-300 text-xs">+ Tambah Slot</button>
          </div>
        </div>
      )}

      {soal.tipe === 'uraian' && <p className="text-orange-300 text-xs">✍ Jawaban uraian akan dinilai manual oleh guru</p>}
    </div>
  )
}
