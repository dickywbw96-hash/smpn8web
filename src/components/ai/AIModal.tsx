'use client'
// src/components/ai/AIModal.tsx — port dari AIModal.jsx
import { useState } from 'react'

const TIPE_SOAL_OPTIONS = [
  { value: 'pilgan', label: '🔘 Pilihan Ganda' },
  { value: 'benar_salah', label: '✅ Benar/Salah' },
  { value: 'menjodohkan', label: '🔗 Menjodohkan' },
  { value: 'uraian', label: '✍️ Uraian' },
  { value: 'drag_drop', label: '🖱️ Drag & Drop' },
  { value: 'tts', label: '🔤 TTS / Isian' },
]
const JENJANG_OPTIONS = ['SD', 'SMP', 'SMA', 'SMK']

interface Props {
  mode?: 'materi' | 'lkpd'
  kegiatanData?: any
  mapelDefault?: string
  judulDefault?: string
  onGenerate: (form: any) => void
  onClose: () => void
}

export default function AIModal({ mode = 'materi', kegiatanData, mapelDefault, judulDefault, onGenerate, onClose }: Props) {
  const isMateri = mode === 'materi'
  const [form, setForm] = useState({
    mapel: mapelDefault || kegiatanData?.guru?.mapel || '',
    topik: judulDefault || kegiatanData?.judul || '',
    jenjang: '', kelas: '', keterangan: '',
    gaya: 'ringkas', sertakanVideo: true,
    jumlahSoal: 5, tipeSoal: ['pilgan'], levelKesulitan: 'sedang',
  })
  const set = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }))
  const toggleTipe = (v: string) => setForm(p => {
    const has = p.tipeSoal.includes(v)
    if (has && p.tipeSoal.length === 1) return p
    return { ...p, tipeSoal: has ? p.tipeSoal.filter(t => t !== v) : [...p.tipeSoal, v] }
  })
  const submit = () => {
    if (!form.mapel.trim() || !form.topik.trim() || !form.jenjang || !form.kelas.trim()) {
      alert('Lengkapi: Mata Pelajaran, Topik, Jenjang, dan Kelas!'); return
    }
    onGenerate(form)
  }
  const inp = 'w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white text-sm placeholder-white/30 focus:outline-none focus:border-yellow-400/60 transition'
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center px-0 sm:px-4">
      <div className="bg-gray-900 border border-white/20 rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg max-h-[92vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-gray-900/98 border-b border-white/10 px-5 py-4 flex items-center justify-between z-10">
          <div>
            <p className="text-yellow-400 font-black text-base">{isMateri ? '✨ Generate Materi dengan AI' : '✨ Generate Soal LKPD dengan AI'}</p>
            <p className="text-white/40 text-xs mt-0.5">Isi detail agar hasil lebih akurat & hemat token</p>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white text-2xl ml-3">✕</button>
        </div>
        <div className="px-5 py-4 space-y-4">
          <div className="space-y-3">
            <p className="text-white/40 text-xs font-bold uppercase tracking-widest">📚 Informasi Dasar</p>
            <div><label className="text-white/60 text-xs font-semibold">Mata Pelajaran *</label>
              <input value={form.mapel} onChange={e => set('mapel', e.target.value)} placeholder="cth: Matematika, IPA..." className={inp + ' mt-1'} /></div>
            <div><label className="text-white/60 text-xs font-semibold">Topik / Materi Pokok *</label>
              <input value={form.topik} onChange={e => set('topik', e.target.value)} placeholder="cth: Fotosintesis, SPLDV..." className={inp + ' mt-1'} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-white/60 text-xs font-semibold">Jenjang *</label>
                <select value={form.jenjang} onChange={e => set('jenjang', e.target.value)} className={inp + ' mt-1'}>
                  <option value="">Pilih...</option>{JENJANG_OPTIONS.map(j => <option key={j} value={j}>{j}</option>)}</select></div>
              <div><label className="text-white/60 text-xs font-semibold">Kelas *</label>
                <input value={form.kelas} onChange={e => set('kelas', e.target.value)} placeholder="cth: 7, 8, 9..." className={inp + ' mt-1'} /></div>
            </div>
            <div><label className="text-white/60 text-xs font-semibold">Catatan Tambahan (opsional)</label>
              <textarea value={form.keterangan} onChange={e => set('keterangan', e.target.value)} rows={2} className={inp + ' mt-1 resize-none'} /></div>
          </div>
          {isMateri && (
            <div className="space-y-3">
              <p className="text-white/40 text-xs font-bold uppercase tracking-widest">📖 Gaya Penulisan</p>
              <div className="grid grid-cols-3 gap-2">
                {[{val:'ringkas',label:'⚡ Ringkas',desc:'Padat'},{val:'detail',label:'📝 Detail',desc:'Lengkap'},{val:'narasi',label:'🗣️ Narasi',desc:'Santai'}].map(o => (
                  <button key={o.val} onClick={() => set('gaya', o.val)} className={`p-2 rounded-xl border text-center transition text-xs ${form.gaya === o.val ? 'bg-yellow-400/20 border-yellow-400 text-yellow-300' : 'bg-white/5 border-white/20 text-white/60'}`}>
                    <div className="font-bold">{o.label}</div><div className="text-white/40 text-[10px]">{o.desc}</div>
                  </button>
                ))}
              </div>
              <label className="flex items-center gap-3 cursor-pointer" onClick={() => set('sertakanVideo', !form.sertakanVideo)}>
                <div className={`w-10 h-6 rounded-full flex items-center px-0.5 transition-all ${form.sertakanVideo ? 'bg-yellow-400' : 'bg-white/20'}`}>
                  <div className={`w-5 h-5 bg-white rounded-full shadow transition-all ${form.sertakanVideo ? 'translate-x-4' : ''}`} />
                </div>
                <span className="text-white/80 text-sm">Carikan link video YouTube (Bhs. Indonesia)</span>
              </label>
            </div>
          )}
          {!isMateri && (
            <div className="space-y-3">
              <p className="text-white/40 text-xs font-bold uppercase tracking-widest">📋 Pengaturan Soal</p>
              <div><label className="text-white/60 text-xs font-semibold">Jumlah Soal: {form.jumlahSoal} soal</label>
                <input type="range" min={3} max={20} value={form.jumlahSoal} onChange={e => set('jumlahSoal', Number(e.target.value))} className="w-full accent-yellow-400 mt-1" />
                <div className="flex justify-between text-white/30 text-xs"><span>3</span><span>20</span></div></div>
              <div><label className="text-white/60 text-xs font-semibold">Tipe Soal</label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {TIPE_SOAL_OPTIONS.map(o => (
                    <button key={o.value} onClick={() => toggleTipe(o.value)} className={`p-2 rounded-xl border text-left text-xs transition ${form.tipeSoal.includes(o.value) ? 'bg-yellow-400/20 border-yellow-400 text-yellow-300' : 'bg-white/5 border-white/20 text-white/60'}`}>{o.label}</button>
                  ))}</div></div>
              <div><label className="text-white/60 text-xs font-semibold">Level Kesulitan</label>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  {[{val:'mudah',label:'🟢 Mudah'},{val:'sedang',label:'🟡 Sedang'},{val:'sulit',label:'🔴 Sulit'}].map(o => (
                    <button key={o.val} onClick={() => set('levelKesulitan', o.val)} className={`py-2 rounded-xl border text-xs font-bold transition ${form.levelKesulitan === o.val ? 'bg-yellow-400/20 border-yellow-400 text-yellow-300' : 'bg-white/5 border-white/20 text-white/60'}`}>{o.label}</button>
                  ))}</div></div>
            </div>
          )}
          <div className="bg-blue-500/10 border border-blue-400/30 rounded-xl px-4 py-3">
            <p className="text-blue-300 text-xs">💡 <strong>Hemat token:</strong> Makin spesifik topik & catatan, makin akurat hasilnya.</p>
          </div>
          <div className="grid grid-cols-2 gap-3 pb-2">
            <button onClick={onClose} className="py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition">Batal</button>
            <button onClick={submit} className="py-3 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-black text-sm transition shadow-lg">✨ Generate Sekarang</button>
          </div>
        </div>
      </div>
    </div>
  )
}
