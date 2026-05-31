'use client'
// src/app/(elkpd)/elkpd/guru/kegiatan/page.tsx
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import PageWrapper from '@/components/elkpd/PageWrapper'
import NavbarElkpd from '@/components/elkpd/Navbar'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase-elkpd'
import { generateToken } from '@/utils/elkpd'
import { callGemini } from '@/utils/callGemini'
import { downloadLKPDPdf } from '@/utils/downloadLKPD'

// ─── Types ──────────────────────────────────────────────────
type TipeSoal = 'pilgan' | 'benar_salah' | 'menjodohkan' | 'tts' | 'drag_drop' | 'uraian'
type GayaMateri = 'ringkas' | 'detail' | 'narasi'
type LevelKesulitan = 'mudah' | 'sedang' | 'sulit'

interface PilihanItem { id: string; teks: string }
interface PasanganItem { kiri_id: string; kiri: string; kanan_id: string; kanan: string }
interface KotakItem { id: string; petunjuk: string; jawaban: string }
interface DragItem { id: string; teks: string }
interface SlotItem { id: string; label: string; jawaban_item_id: string }

interface SoalBase { id: string; tipe: TipeSoal; skor: number; pertanyaan: string }
interface SoalPilgan extends SoalBase { tipe: 'pilgan'; pilihan: PilihanItem[]; kunci: string }
interface SoalBenarSalah extends SoalBase { tipe: 'benar_salah'; kunci: string }
interface SoalMenjodohkan extends SoalBase { tipe: 'menjodohkan'; pasangan: PasanganItem[] }
interface SoalTts extends SoalBase { tipe: 'tts'; kotak: KotakItem[] }
interface SoalDragDrop extends SoalBase { tipe: 'drag_drop'; item: DragItem[]; slot: SlotItem[] }
interface SoalUraian extends SoalBase { tipe: 'uraian' }
type Soal = SoalPilgan | SoalBenarSalah | SoalMenjodohkan | SoalTts | SoalDragDrop | SoalUraian

interface AIForm {
  mapel: string; topik: string; jenjang: string; kelas: string
  keterangan: string; gaya: GayaMateri; sertakanVideo: boolean
  jumlahSoal: number; tipeSoal: TipeSoal[]; levelKesulitan: LevelKesulitan
}

interface ValidationResult { errors: string[]; warnings: string[] }

// ─── Helpers ────────────────────────────────────────────────
function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

const TIPE_SOAL: { value: TipeSoal; label: string; desc: string }[] = [
  { value: 'pilgan',      label: '🔘 Pilihan Ganda', desc: 'A/B/C/D dengan 1 jawaban benar' },
  { value: 'benar_salah', label: '✅ Benar/Salah',   desc: 'Pernyataan benar atau salah' },
  { value: 'menjodohkan', label: '🔗 Menjodohkan',   desc: 'Pasangkan kolom kiri dan kanan' },
  { value: 'tts',         label: '🔤 Isian Singkat',  desc: 'Isi jawaban pendek di kotak' },
  { value: 'drag_drop',   label: '🎯 Drag & Drop',    desc: 'Seret item ke posisi yang benar' },
  { value: 'uraian',      label: '✍ Uraian',          desc: 'Jawaban panjang, dinilai guru' },
]

const JENJANG = ['SD', 'SMP', 'SMA', 'SMK']

function createSoalBaru(tipe: TipeSoal): Soal {
  const base = { id: generateId(), tipe, skor: 10, pertanyaan: '' }
  switch (tipe) {
    case 'pilgan':
      return { ...base, tipe: 'pilgan', pilihan: [
        { id: 'a', teks: '' }, { id: 'b', teks: '' },
        { id: 'c', teks: '' }, { id: 'd', teks: '' },
      ], kunci: 'a' }
    case 'benar_salah':
      return { ...base, tipe: 'benar_salah', kunci: 'benar' }
    case 'menjodohkan':
      return { ...base, tipe: 'menjodohkan', pasangan: [
        { kiri_id: generateId(), kiri: '', kanan_id: generateId(), kanan: '' },
        { kiri_id: generateId(), kiri: '', kanan_id: generateId(), kanan: '' },
      ]}
    case 'tts':
      return { ...base, tipe: 'tts', kotak: [
        { id: generateId(), petunjuk: '', jawaban: '' },
        { id: generateId(), petunjuk: '', jawaban: '' },
      ]}
    case 'drag_drop':
      return { ...base, tipe: 'drag_drop',
        item: [{ id: generateId(), teks: '' }, { id: generateId(), teks: '' }],
        slot: [
          { id: generateId(), label: '', jawaban_item_id: '' },
          { id: generateId(), label: '', jawaban_item_id: '' },
        ],
      }
    case 'uraian':
    default:
      return { ...base, tipe: 'uraian' }
  }
}

// ─── Validasi ────────────────────────────────────────────────
function validateForm({ judul, isiMateri, youtubeUrl, fileMateri, soalList }: {
  judul: string; isiMateri: string; youtubeUrl: string
  fileMateri: File | null; soalList: Soal[]
}): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  if (!judul.trim())
    errors.push('Judul kegiatan belum diisi.')

  const adaMateri = isiMateri.trim() || youtubeUrl.trim() || fileMateri
  if (!adaMateri)
    errors.push('Belum ada materi — isi salah satu: teks materi, link YouTube, atau upload file.')

  if (soalList.length === 0)
    warnings.push('Belum ada soal LKPD. Siswa tidak bisa mengerjakan apapun.')

  if (soalList.length > 0) {
    const totalSkor = soalList.reduce((s, q) => s + (Number(q.skor) || 0), 0)
    if (totalSkor === 0) warnings.push('Total skor semua soal masih 0.')
    if (totalSkor > 100) warnings.push(`Total skor soal adalah ${totalSkor}, melebihi 100. Sesuaikan skor tiap soal.`)
    const soalKosong = soalList.filter(s => !s.pertanyaan?.trim()).length
    if (soalKosong > 0) warnings.push(`${soalKosong} soal belum memiliki teks pertanyaan.`)
  }

  return { errors, warnings }
}

// ─── Modal Validasi ──────────────────────────────────────────
interface ValidationModalProps {
  errors: string[]; warnings: string[]
  onConfirm: () => void; onCancel: () => void
}
function ValidationModal({ errors, warnings, onConfirm, onCancel }: ValidationModalProps) {
  const hasErrors = errors.length > 0
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.85)', backdropFilter:'blur(6px)', zIndex:50, display:'flex', alignItems:'center', justifyContent:'center', padding:'0 16px' }}>
      <div style={{ background:'#111827', border:'1px solid rgba(255,255,255,0.15)', borderRadius:20, width:'100%', maxWidth:360, padding:20, boxShadow:'0 25px 50px rgba(0,0,0,0.6)' }}>
        <div style={{ textAlign:'center', marginBottom:16 }}>
          <div style={{ fontSize:40, marginBottom:8 }}>{hasErrors ? '🚫' : '⚠️'}</div>
          <h3 style={{ color:'#fff', fontWeight:900, fontSize:15, margin:'0 0 4px' }}>
            {hasErrors ? 'Tidak Bisa Disimpan' : 'Ada yang Belum Lengkap'}
          </h3>
          <p style={{ color:'rgba(255,255,255,0.45)', fontSize:12, margin:0 }}>
            {hasErrors ? 'Perbaiki dulu sebelum menyimpan kegiatan.' : 'Kegiatan bisa disimpan, tapi ada beberapa hal yang perlu diperhatikan.'}
          </p>
        </div>

        {errors.length > 0 && (
          <div style={{ background:'rgba(239,68,68,0.15)', border:'1px solid rgba(239,68,68,0.35)', borderRadius:12, padding:'12px 16px', marginBottom:12 }}>
            {errors.map((e, i) => (
              <div key={i} style={{ display:'flex', gap:8, marginBottom: i < errors.length - 1 ? 6 : 0 }}>
                <span style={{ color:'#f87171', fontSize:11, marginTop:1, flexShrink:0 }}>✕</span>
                <p style={{ color:'#fca5a5', fontSize:12, margin:0 }}>{e}</p>
              </div>
            ))}
          </div>
        )}

        {warnings.length > 0 && (
          <div style={{ background:'rgba(250,204,21,0.1)', border:'1px solid rgba(250,204,21,0.25)', borderRadius:12, padding:'12px 16px', marginBottom:12 }}>
            {warnings.map((w, i) => (
              <div key={i} style={{ display:'flex', gap:8, marginBottom: i < warnings.length - 1 ? 6 : 0 }}>
                <span style={{ color:'#fbbf24', fontSize:11, marginTop:1, flexShrink:0 }}>⚠</span>
                <p style={{ color:'#fde68a', fontSize:12, margin:0 }}>{w}</p>
              </div>
            ))}
          </div>
        )}

        <div style={{ display:'grid', gridTemplateColumns: hasErrors ? '1fr' : '1fr 1fr', gap:8 }}>
          <button onClick={onCancel} style={{ padding:'12px', borderRadius:12, background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.15)', color:'#fff', fontWeight:700, fontSize:13, cursor:'pointer' }}>
            {hasErrors ? '← Kembali Edit' : '✏️ Lengkapi Dulu'}
          </button>
          {!hasErrors && (
            <button onClick={onConfirm} style={{ padding:'12px', borderRadius:12, background:'#facc15', border:'none', color:'#111827', fontWeight:900, fontSize:13, cursor:'pointer' }}>
              💾 Simpan Saja
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Prompt builders ─────────────────────────────────────────
function buildMateriPrompt(f: AIForm): string {
  return `Kamu adalah guru ${f.mapel} jenjang ${f.jenjang} kelas ${f.kelas}.
Buat ringkasan materi pembelajaran dengan ketentuan:
- Topik: ${f.topik}
- Gaya: ${f.gaya === 'ringkas' ? 'padat dan to the point' : f.gaya === 'detail' ? 'lengkap dengan penjelasan dan contoh' : 'narasi santai dan mudah dipahami siswa'}
- Bahasa Indonesia yang baik dan sesuai usia siswa
${f.keterangan ? `- Catatan dari guru: ${f.keterangan}` : ''}
${f.sertakanVideo ? `- Di AKHIR teks, tambahkan baris khusus persis seperti ini:
VIDEO_URL: [tulis URL YouTube bahasa Indonesia yang paling relevan dengan topik ini, pastikan benar-benar ada]` : ''}

Format output: teks materi langsung tanpa heading/markdown berlebihan. Maksimal 400 kata.`
}

function buildSoalPrompt(f: AIForm): string {
  const tipeLabel = f.tipeSoal.map(t => TIPE_SOAL.find(x => x.value === t)?.label).join(', ')
  return `Kamu adalah guru ${f.mapel} jenjang ${f.jenjang} kelas ${f.kelas}.
Buat ${f.jumlahSoal} soal LKPD tentang: ${f.topik}
Tipe soal yang dipakai: ${tipeLabel}
Level kesulitan: ${f.levelKesulitan}
${f.keterangan ? `Catatan: ${f.keterangan}` : ''}

WAJIB output JSON array valid, tanpa markdown, tanpa komentar. Setiap soal sesuai struktur ini:

Pilihan ganda: {"id":"<uid>","tipe":"pilgan","skor":10,"pertanyaan":"...","pilihan":[{"id":"a","teks":"..."},{"id":"b","teks":"..."},{"id":"c","teks":"..."},{"id":"d","teks":"..."}],"kunci":"a"}
Benar/Salah: {"id":"<uid>","tipe":"benar_salah","skor":10,"pertanyaan":"...","kunci":"benar"}
Menjodohkan: {"id":"<uid>","tipe":"menjodohkan","skor":10,"pertanyaan":"...","pasangan":[{"kiri_id":"<uid>","kiri":"...","kanan_id":"<uid>","kanan":"..."}]}
Isian singkat: {"id":"<uid>","tipe":"tts","skor":10,"pertanyaan":"...","kotak":[{"id":"<uid>","petunjuk":"...","jawaban":"..."}]}
Drag & Drop: {"id":"<uid>","tipe":"drag_drop","skor":10,"pertanyaan":"...","item":[{"id":"<uid>","teks":"..."}],"slot":[{"id":"<uid>","label":"...","jawaban_item_id":"<id item yang benar>"}]}
Uraian: {"id":"<uid>","tipe":"uraian","skor":20,"pertanyaan":"..."}

Ganti <uid> dengan string acak 9 karakter huruf+angka.
Distribusikan tipe soal secara merata dari daftar: ${f.tipeSoal.join(',')}.
Output HANYA array JSON, mulai dari [ dan akhiri dengan ].`
}

function parseMateriResult(text: string, sertakanVideo: boolean): { isiMateri: string; youtubeUrl: string } {
  let isiMateri = text.trim()
  let youtubeUrl = ''
  if (sertakanVideo) {
    const videoMatch = text.match(/VIDEO_URL:\s*(https?:\/\/[^\s\n]+)/i)
    if (videoMatch) {
      youtubeUrl = videoMatch[1].trim()
      isiMateri = text.replace(/VIDEO_URL:\s*https?:\/\/[^\s\n]+/i, '').trim()
    }
  }
  return { isiMateri, youtubeUrl }
}

function parseSoalResult(text: string): Soal[] {
  const cleaned = text.replace(/```json|```/gi, '').trim()
  const match = cleaned.match(/\[[\s\S]*\]/)
  if (!match) throw new Error('Format soal dari AI tidak valid.')
  const arr = JSON.parse(match[0]) as Soal[]
  if (!Array.isArray(arr)) throw new Error('AI tidak mengembalikan array soal.')
  return arr.map(s => ({ ...s, id: s.id || generateId() }))
}

// ─── AI Modal ────────────────────────────────────────────────
interface AIModalProps {
  mode: 'materi' | 'lkpd'
  mapelDefault: string
  judulDefault: string
  onGenerate: (form: AIForm) => void
  onClose: () => void
}
function AIModal({ mode, mapelDefault, judulDefault, onGenerate, onClose }: AIModalProps) {
  const isMateri = mode === 'materi'
  const [form, setForm] = useState<AIForm>({
    mapel: mapelDefault || '', topik: judulDefault || '',
    jenjang: '', kelas: '', keterangan: '', gaya: 'ringkas',
    sertakanVideo: true, jumlahSoal: 5, tipeSoal: ['pilgan'], levelKesulitan: 'sedang',
  })

  const set = <K extends keyof AIForm>(k: K, v: AIForm[K]) => setForm(p => ({ ...p, [k]: v }))
  const toggleTipe = (v: TipeSoal) => setForm(p => {
    const has = p.tipeSoal.includes(v)
    if (has && p.tipeSoal.length === 1) return p
    return { ...p, tipeSoal: has ? p.tipeSoal.filter(t => t !== v) : [...p.tipeSoal, v] }
  })

  const submit = () => {
    if (!form.mapel.trim() || !form.topik.trim() || !form.jenjang || !form.kelas.trim()) {
      alert('Lengkapi: Mata Pelajaran, Topik, Jenjang, dan Kelas!')
      return
    }
    onGenerate(form)
  }

  const inp: React.CSSProperties = {
    width: '100%', background: '#1f2937', border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 10, padding: '8px 12px', color: '#fff', fontSize: 13,
    outline: 'none', boxSizing: 'border-box',
  }

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.85)', backdropFilter:'blur(6px)', zIndex:50, display:'flex', alignItems:'flex-end', justifyContent:'center' }}>
      <div style={{ background:'#0f172a', border:'1px solid rgba(255,255,255,0.12)', borderRadius:'24px 24px 0 0', width:'100%', maxWidth:520, maxHeight:'92vh', overflowY:'auto', boxShadow:'0 -20px 60px rgba(0,0,0,0.7)' }}>
        {/* Header */}
        <div style={{ position:'sticky', top:0, background:'#0f172a', borderBottom:'1px solid rgba(255,255,255,0.08)', padding:'16px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', zIndex:10 }}>
          <div>
            <p style={{ color:'#facc15', fontWeight:900, fontSize:15, margin:0 }}>
              {isMateri ? '✨ Generate Materi dengan AI' : '✨ Generate Soal LKPD dengan AI'}
            </p>
            <p style={{ color:'rgba(255,255,255,0.4)', fontSize:11, margin:'2px 0 0' }}>Isi detail agar hasil lebih akurat & hemat token</p>
          </div>
          <button onClick={onClose} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.4)', fontSize:22, cursor:'pointer', padding:4 }}>✕</button>
        </div>

        <div style={{ padding:'16px 20px', display:'flex', flexDirection:'column', gap:16 }}>
          {/* Informasi Dasar */}
          <div>
            <p style={{ color:'rgba(255,255,255,0.35)', fontSize:10, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', margin:'0 0 10px' }}>📚 Informasi Dasar</p>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              <div>
                <label style={{ color:'rgba(255,255,255,0.6)', fontSize:11, fontWeight:600, display:'block', marginBottom:4 }}>Mata Pelajaran *</label>
                <input value={form.mapel} onChange={e => set('mapel', e.target.value)} placeholder="cth: Matematika, IPA, Bahasa Indonesia..." style={inp} />
              </div>
              <div>
                <label style={{ color:'rgba(255,255,255,0.6)', fontSize:11, fontWeight:600, display:'block', marginBottom:4 }}>Topik / Materi Pokok *</label>
                <input value={form.topik} onChange={e => set('topik', e.target.value)} placeholder="cth: Fotosintesis, SPLDV, Teks Prosedur..." style={inp} />
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                <div>
                  <label style={{ color:'rgba(255,255,255,0.6)', fontSize:11, fontWeight:600, display:'block', marginBottom:4 }}>Jenjang *</label>
                  <select value={form.jenjang} onChange={e => set('jenjang', e.target.value)} style={{ ...inp, appearance:'none' as const }}>
                    <option value="" style={{ background:'#1f2937' }}>Pilih...</option>
                    {JENJANG.map(j => <option key={j} value={j} style={{ background:'#1f2937' }}>{j}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ color:'rgba(255,255,255,0.6)', fontSize:11, fontWeight:600, display:'block', marginBottom:4 }}>Kelas *</label>
                  <input value={form.kelas} onChange={e => set('kelas', e.target.value)} placeholder="cth: 7, 10, XI..." style={inp} />
                </div>
              </div>
              <div>
                <label style={{ color:'rgba(255,255,255,0.6)', fontSize:11, fontWeight:600, display:'block', marginBottom:4 }}>Catatan Tambahan (opsional)</label>
                <textarea value={form.keterangan} onChange={e => set('keterangan', e.target.value)}
                  placeholder={isMateri ? 'cth: fokus contoh sehari-hari, pakai analogi sederhana...' : 'cth: soal HOTS, sesuai KD 3.2, variasi soal cerita...'}
                  rows={2} style={{ ...inp, resize:'none' as const }} />
              </div>
            </div>
          </div>

          {isMateri && (
            <div>
              <p style={{ color:'rgba(255,255,255,0.35)', fontSize:10, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', margin:'0 0 10px' }}>📖 Gaya Penulisan</p>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8, marginBottom:12 }}>
                {([
                  { val: 'ringkas' as GayaMateri, label: '⚡ Ringkas', desc: 'Padat & to the point' },
                  { val: 'detail' as GayaMateri,  label: '📝 Detail',  desc: 'Lengkap + contoh' },
                  { val: 'narasi' as GayaMateri,  label: '🗣️ Narasi',  desc: 'Santai & bercerita' },
                ]).map(o => (
                  <button key={o.val} onClick={() => set('gaya', o.val)} style={{
                    padding:'8px 4px', borderRadius:12, cursor:'pointer', textAlign:'center',
                    background: form.gaya === o.val ? 'rgba(250,204,21,0.15)' : '#1f2937',
                    border: form.gaya === o.val ? '1.5px solid #facc15' : '1px solid rgba(255,255,255,0.12)',
                    transition:'all 0.15s',
                  }}>
                    <div style={{ color: form.gaya === o.val ? '#fde047' : 'rgba(255,255,255,0.7)', fontSize:12, fontWeight:700 }}>{o.label}</div>
                    <div style={{ color:'rgba(255,255,255,0.35)', fontSize:10, marginTop:2 }}>{o.desc}</div>
                  </button>
                ))}
              </div>
              <div onClick={() => set('sertakanVideo', !form.sertakanVideo)} style={{ display:'flex', alignItems:'center', gap:12, cursor:'pointer' }}>
                <div style={{ width:40, height:24, borderRadius:999, background: form.sertakanVideo ? '#facc15' : 'rgba(255,255,255,0.15)', display:'flex', alignItems:'center', padding:'0 2px', transition:'background 0.2s', flexShrink:0 }}>
                  <div style={{ width:20, height:20, background:'#fff', borderRadius:'50%', boxShadow:'0 1px 3px rgba(0,0,0,0.3)', transform: form.sertakanVideo ? 'translateX(16px)' : 'translateX(0)', transition:'transform 0.2s' }} />
                </div>
                <span style={{ color:'rgba(255,255,255,0.8)', fontSize:13 }}>Carikan link video YouTube (Bhs. Indonesia)</span>
              </div>
            </div>
          )}

          {!isMateri && (
            <div>
              <p style={{ color:'rgba(255,255,255,0.35)', fontSize:10, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', margin:'0 0 10px' }}>📋 Pengaturan Soal</p>
              <div style={{ marginBottom:12 }}>
                <label style={{ color:'rgba(255,255,255,0.6)', fontSize:11, fontWeight:600, display:'block', marginBottom:6 }}>Jumlah Soal: <span style={{ color:'#facc15' }}>{form.jumlahSoal} soal</span></label>
                <input type="range" min={3} max={20} value={form.jumlahSoal} onChange={e => set('jumlahSoal', Number(e.target.value))} style={{ width:'100%', accentColor:'#facc15' }} />
                <div style={{ display:'flex', justifyContent:'space-between', color:'rgba(255,255,255,0.25)', fontSize:11, marginTop:2 }}><span>3</span><span>20</span></div>
              </div>
              <div style={{ marginBottom:12 }}>
                <label style={{ color:'rgba(255,255,255,0.6)', fontSize:11, fontWeight:600, display:'block', marginBottom:6 }}>Tipe Soal (bisa lebih dari satu)</label>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                  {TIPE_SOAL.map(o => (
                    <button key={o.value} onClick={() => toggleTipe(o.value)} style={{
                      padding:'8px 10px', borderRadius:10, cursor:'pointer', textAlign:'left',
                      background: form.tipeSoal.includes(o.value) ? 'rgba(250,204,21,0.15)' : '#1f2937',
                      border: form.tipeSoal.includes(o.value) ? '1.5px solid #facc15' : '1px solid rgba(255,255,255,0.12)',
                      color: form.tipeSoal.includes(o.value) ? '#fde047' : 'rgba(255,255,255,0.6)',
                      fontSize:12, fontWeight:600, transition:'all 0.15s',
                    }}>{o.label}</button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ color:'rgba(255,255,255,0.6)', fontSize:11, fontWeight:600, display:'block', marginBottom:6 }}>Level Kesulitan</label>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8 }}>
                  {([
                    { val: 'mudah' as LevelKesulitan, label: '🟢 Mudah' },
                    { val: 'sedang' as LevelKesulitan, label: '🟡 Sedang' },
                    { val: 'sulit' as LevelKesulitan, label: '🔴 Sulit' },
                  ]).map(o => (
                    <button key={o.val} onClick={() => set('levelKesulitan', o.val)} style={{
                      padding:'8px', borderRadius:10, cursor:'pointer', textAlign:'center',
                      background: form.levelKesulitan === o.val ? 'rgba(250,204,21,0.15)' : '#1f2937',
                      border: form.levelKesulitan === o.val ? '1.5px solid #facc15' : '1px solid rgba(255,255,255,0.12)',
                      color: form.levelKesulitan === o.val ? '#fde047' : 'rgba(255,255,255,0.6)',
                      fontSize:12, fontWeight:700, transition:'all 0.15s',
                    }}>{o.label}</button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div style={{ background:'rgba(59,130,246,0.1)', border:'1px solid rgba(59,130,246,0.25)', borderRadius:12, padding:'10px 14px' }}>
            <p style={{ color:'#93c5fd', fontSize:12, margin:0 }}>
              💡 <strong>Hemat token:</strong> Makin spesifik topik & catatan, makin akurat hasilnya — tanpa perlu generate ulang.
            </p>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, paddingBottom:8 }}>
            <button onClick={onClose} style={{ padding:'12px', borderRadius:12, background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.12)', color:'#fff', fontWeight:700, fontSize:13, cursor:'pointer' }}>
              Batal
            </button>
            <button onClick={submit} style={{ padding:'12px', borderRadius:12, background:'#facc15', border:'none', color:'#111827', fontWeight:900, fontSize:13, cursor:'pointer', boxShadow:'0 4px 15px rgba(250,204,21,0.3)' }}>
              ✨ Generate Sekarang
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Loading overlay ──────────────────────────────────────────
function AILoading({ status }: { status: string }) {
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.85)', backdropFilter:'blur(6px)', zIndex:50, display:'flex', alignItems:'center', justifyContent:'center', padding:'0 24px' }}>
      <div style={{ background:'#111827', border:'1px solid rgba(255,255,255,0.12)', borderRadius:20, padding:24, width:'100%', maxWidth:280, textAlign:'center' }}>
        <div style={{ fontSize:40, marginBottom:12, animation:'bounce 1s infinite' }}>🤖</div>
        <p style={{ color:'#fff', fontWeight:700, fontSize:14, margin:'0 0 6px' }}>AI sedang bekerja...</p>
        <p style={{ color:'#fde047', fontSize:12, margin:0 }}>{status || 'Menghubungi Gemini...'}</p>
        <div style={{ marginTop:16, display:'flex', justifyContent:'center', gap:6 }}>
          {[0,1,2].map(i => (
            <div key={i} style={{ width:8, height:8, background:'#facc15', borderRadius:'50%', animation:`bounce 1s ${i * 0.15}s infinite` }} />
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Canvas rounded rect helper ───────────────────────────────
function canvasRoundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

// ═══════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function SiapkanKegiatan() {
  const router = useRouter()
  const { guru, logout } = useAuth()

  const [tab, setTab] = useState<'materi' | 'soal'>('materi')
  const [token] = useState<string>(generateToken)
  const [judul, setJudul] = useState('')
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [isiMateri, setIsiMateri] = useState('')
  const [fileMateri, setFileMateri] = useState<File | null>(null)
  const [fileTugas, setFileTugas] = useState<File | null>(null)
  const [soalList, setSoalList] = useState<Soal[]>([])
  const [saving, setSaving] = useState(false)
  const [showTokenModal, setShowTokenModal] = useState(false)
  const [pdfLoading, setPdfLoading] = useState(false)
  const [validationData, setValidationData] = useState<ValidationResult | null>(null)
  const [showAIModal, setShowAIModal] = useState<'materi' | 'lkpd' | null>(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiStatus, setAiStatus] = useState('')
  const [aiError, setAiError] = useState('')

  // hover states untuk glow effect
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [shimmerCard, setShimmerCard] = useState<string | null>(null)

  const uploadFile = async (file: File | null, folder: string): Promise<string | null> => {
    if (!file) return null
    if (file.size > 5 * 1024 * 1024) throw new Error(`File ${file.name} terlalu besar! Maksimal 5 MB.`)
    const ext = file.name.split('.').pop()
    const path = `${folder}/${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('lkpd-files').upload(path, file)
    if (error) throw error
    const { data: urlData } = supabase.storage.from('lkpd-files').getPublicUrl(path)
    return urlData.publicUrl
  }

  const doSimpan = async () => {
    setSaving(true)
    try {
      const fileMateriUrl = await uploadFile(fileMateri, 'materi')
      const fileTugasUrl  = await uploadFile(fileTugas, 'tugas')
      const { error } = await supabase.from('kegiatan').insert({
        token, guru_id: guru!.id, judul,
        youtube_url: youtubeUrl || null, file_materi_url: fileMateriUrl,
        isi_materi: isiMateri || null, soal_data: soalList,
        file_tugas_url: fileTugasUrl, aktif: true,
      })
      if (error) throw error
      setShowTokenModal(true)
    } catch (err) {
      alert('Gagal menyimpan: ' + (err instanceof Error ? err.message : String(err)))
    } finally {
      setSaving(false)
    }
  }

  const handleSimpan = () => {
    const { errors, warnings } = validateForm({ judul, isiMateri, youtubeUrl, fileMateri, soalList })
    if (errors.length > 0 || warnings.length > 0) { setValidationData({ errors, warnings }); return }
    doSimpan()
  }

  const downloadToken = () => {
    const W = 480, H = 300
    const canvas = document.createElement('canvas')
    canvas.width = W; canvas.height = H
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const grad = ctx.createLinearGradient(0, 0, W, H)
    grad.addColorStop(0, '#1e3a8a'); grad.addColorStop(1, '#312e81')
    ctx.fillStyle = grad; canvasRoundRect(ctx, 0, 0, W, H, 20); ctx.fill()
    ctx.strokeStyle = '#facc15'; ctx.lineWidth = 3
    canvasRoundRect(ctx, 2, 2, W - 4, H - 4, 18); ctx.stroke()
    ctx.textAlign = 'center'
    ctx.fillStyle = '#fde68a'; ctx.font = 'bold 12px Arial, sans-serif'
    ctx.fillText('PLATFORM PEMBELAJARAN JARAK JAUH', W / 2, 38)
    ctx.fillStyle = '#93c5fd'; ctx.font = '11px Arial, sans-serif'
    ctx.fillText('SMP NEGERI 8 PROBOLINGGO', W / 2, 58)
    ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 1
    ctx.beginPath(); ctx.moveTo(40, 70); ctx.lineTo(W - 40, 70); ctx.stroke()
    ctx.fillStyle = '#94a3b8'; ctx.font = '11px Arial, sans-serif'
    ctx.fillText(`Mata Pelajaran: ${guru?.mapel || '-'}`, W / 2, 90)
    ctx.fillText(`Guru: ${guru?.nama || '-'}`, W / 2, 108)
    ctx.fillStyle = '#facc15'; canvasRoundRect(ctx, 60, 125, W - 120, 110, 14); ctx.fill()
    ctx.fillStyle = '#1e293b'; ctx.font = 'bold 11px Arial, sans-serif'
    ctx.fillText('TOKEN KEGIATAN', W / 2, 150)
    ctx.font = 'bold 52px "Courier New", monospace'; ctx.fillStyle = '#0f172a'
    ctx.fillText(token, W / 2, 210)
    ctx.fillStyle = '#64748b'; ctx.font = '10px Arial, sans-serif'
    ctx.fillText('Berikan token ini kepada siswa untuk mengakses kegiatan', W / 2, 265)
    const link = document.createElement('a')
    link.download = `TOKEN-${token}.png`; link.href = canvas.toDataURL('image/png'); link.click()
  }

  const handleDownloadPDF = async () => {
    setPdfLoading(true)
    try { await downloadLKPDPdf({ judul, guru, token, isiMateri, youtubeUrl, soalList }) }
    catch (err) { alert('Gagal membuat PDF: ' + (err instanceof Error ? err.message : String(err))) }
    finally { setPdfLoading(false) }
  }

  const handleShareWA = () => {
    const pesan = `📚 *KEGIATAN PEMBELAJARAN*\nMata Pelajaran: *${guru?.mapel || '-'}*\nGuru: *${guru?.nama || '-'}*\n\nHalo, Siswa-Siswi SMPN 8 Probolinggo! 👋\nBerikut token kegiatan LKPD yang bisa kamu akses:\n\n🔑 *Token Kegiatan:*\n*${token}*\n\n🌐 *Link LKPD:*\nhttps://lkpd-smpn8.vercel.app\n\nLangkah-langkah:\n1️⃣ Buka link di atas\n2️⃣ Masukkan token kegiatan\n3️⃣ Kerjakan LKPD dengan semangat! 💪\n\n_Selamat belajar!_ 🎓`
    navigator.clipboard.writeText(pesan).catch(() => {})
    window.open(`https://wa.me/?text=${encodeURIComponent(pesan)}`, '_blank')
  }

  const handleGenerateMateri = async (formData: AIForm) => {
    setShowAIModal(null); setAiLoading(true); setAiError('')
    try {
      const result = await callGemini(buildMateriPrompt(formData), { onStatus: setAiStatus })
      const { isiMateri: mat, youtubeUrl: ytUrl } = parseMateriResult(result, formData.sertakanVideo)
      setIsiMateri(mat); if (ytUrl) setYoutubeUrl(ytUrl)
      if (!judul.trim() && formData.topik) setJudul(formData.topik)
    } catch (err) { setAiError(err instanceof Error ? err.message : String(err)) }
    finally { setAiLoading(false); setAiStatus('') }
  }

  const handleGenerateSoal = async (formData: AIForm) => {
    setShowAIModal(null); setAiLoading(true); setAiError('')
    try {
      const result = await callGemini(buildSoalPrompt(formData), { onStatus: setAiStatus })
      const soalBaru = parseSoalResult(result)
      setSoalList(prev => [...prev, ...soalBaru])
      if (!judul.trim() && formData.topik) setJudul(formData.topik)
      setTab('soal')
    } catch (err) { setAiError(err instanceof Error ? err.message : String(err)) }
    finally { setAiLoading(false); setAiStatus('') }
  }

  if (!guru) return null

  const totalSkor = soalList.reduce((s, q) => s + (Number(q.skor) || 0), 0)
  const skorOver  = totalSkor > 100

  // ── Glow card helper ─────────────────────────────────────────
  const glowCard = (id: string, color: string) => ({
    position: 'relative' as const,
    background: '#0f172a',
    border: hoveredCard === id ? `2px solid ${color}` : '2px solid rgba(255,255,255,0.08)',
    borderRadius: 20,
    padding: 16,
    cursor: 'pointer' as const,
    overflow: 'hidden' as const,
    transition: 'transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s ease, border-color 0.2s',
    transform: hoveredCard === id ? 'translateY(-2px)' : 'translateY(0)',
    boxShadow: hoveredCard === id
      ? `0 0 0 1px ${color}33, 0 0 28px ${color}55, 0 0 55px ${color}22, 0 8px 30px rgba(0,0,0,0.5)`
      : '0 4px 16px rgba(0,0,0,0.4)',
  })

  const inp: React.CSSProperties = {
    width: '100%', background: '#1f2937', border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 12, padding: '10px 14px', color: '#fff', fontSize: 13,
    outline: 'none', boxSizing: 'border-box',
  }

  return (
    <PageWrapper>
      <style>{`
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes shimmer { 0%{transform:translateX(-100%) skewX(-15deg)} 100%{transform:translateX(300%) skewX(-15deg)} }
        @keyframes floatIcon { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
        .shimmer-overlay { position:absolute; top:0; left:0; width:35%; height:100%; background:linear-gradient(90deg,transparent,rgba(255,255,255,0.07),transparent); animation:shimmer 0.55s ease forwards; pointer-events:none; }
        .hover-icon-float { animation:floatIcon 1.4s ease-in-out infinite; }
      `}</style>

      {/* Overlay gelap */}
      <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:-1, pointerEvents:'none' }} />

      <NavbarElkpd guruNama={guru.nama} onLogout={() => { logout(); router.push('/') }} showGuruBtn={false} />

      {aiLoading && <AILoading status={aiStatus} />}
      {validationData && (
        <ValidationModal errors={validationData.errors} warnings={validationData.warnings}
          onConfirm={() => { setValidationData(null); doSimpan() }}
          onCancel={() => setValidationData(null)} />
      )}
      {showAIModal === 'materi' && (
        <AIModal mode="materi" mapelDefault={guru.mapel} judulDefault={judul}
          onGenerate={handleGenerateMateri} onClose={() => setShowAIModal(null)} />
      )}
      {showAIModal === 'lkpd' && (
        <AIModal mode="lkpd" mapelDefault={guru.mapel} judulDefault={judul}
          onGenerate={handleGenerateSoal} onClose={() => setShowAIModal(null)} />
      )}

      <div style={{ maxWidth:600, margin:'0 auto', padding:'12px 16px 40px' }}>

        {/* Tombol kembali */}
        <button
          onClick={() => { window.location.href = '/elkpd/guru/dashboard' }}
          style={{ display:'flex', alignItems:'center', gap:8, background:'rgba(0,0,0,0.5)', border:'1px solid rgba(255,255,255,0.15)', borderRadius:12, padding:'8px 14px', color:'rgba(255,255,255,0.75)', fontSize:13, fontWeight:600, cursor:'pointer', marginBottom:16, backdropFilter:'blur(8px)', transition:'all 0.15s' }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.1)'; (e.currentTarget as HTMLButtonElement).style.color = '#fff' }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,0,0,0.5)'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.75)' }}
        >
          ← Kembali ke Dashboard
        </button>

        {/* AI Error */}
        {aiError && (
          <div style={{ background:'rgba(127,29,29,0.8)', border:'1px solid rgba(239,68,68,0.5)', borderRadius:14, padding:'12px 16px', marginBottom:16, display:'flex', alignItems:'flex-start', gap:12 }}>
            <span style={{ fontSize:16 }}>⚠️</span>
            <div style={{ flex:1 }}>
              <p style={{ color:'#fca5a5', fontWeight:700, fontSize:13, margin:'0 0 2px' }}>Generate AI gagal</p>
              <p style={{ color:'rgba(252,165,165,0.6)', fontSize:12, margin:0 }}>{aiError}</p>
            </div>
            <button onClick={() => setAiError('')} style={{ background:'none', border:'none', color:'#f87171', fontSize:18, cursor:'pointer', padding:0 }}>✕</button>
          </div>
        )}

        {/* Token card */}
        <div style={{ background:'linear-gradient(135deg, #1e3a8a, #312e81)', border:'1px solid rgba(99,102,241,0.5)', borderRadius:20, padding:'16px 20px', marginBottom:20, display:'flex', alignItems:'center', justifyContent:'space-between', boxShadow:'0 8px 32px rgba(0,0,0,0.5), 0 0 30px rgba(99,102,241,0.2)' }}>
          <div>
            <p style={{ color:'rgba(255,255,255,0.5)', fontSize:11, margin:'0 0 4px' }}>Token Kegiatan Ini</p>
            <p style={{ color:'#fde047', fontWeight:900, fontSize:28, letterSpacing:'0.3em', margin:'0 0 4px', textShadow:'0 0 20px rgba(253,224,71,0.5)' }}>{token}</p>
            <p style={{ color:'rgba(255,255,255,0.4)', fontSize:11, margin:0 }}>Bagikan ke siswa setelah simpan</p>
          </div>
          <div style={{ fontSize:36 }}>🔑</div>
        </div>

        {/* Judul */}
        <div style={{ marginBottom:16 }}>
          <label style={{ color:'rgba(255,255,255,0.85)', fontSize:13, fontWeight:700, display:'block', marginBottom:8 }}>📌 Judul Kegiatan *</label>
          <input
            type="text" value={judul} onChange={e => setJudul(e.target.value)}
            placeholder="Contoh: Bab 3 - Sistem Tata Surya"
            style={{ ...inp, borderColor: judul.trim() ? 'rgba(34,197,94,0.5)' : 'rgba(255,255,255,0.15)', fontSize:14, padding:'12px 16px' }}
          />
          {!judul.trim() && <p style={{ color:'rgba(255,255,255,0.35)', fontSize:11, margin:'4px 0 0 4px' }}>* Wajib diisi</p>}
        </div>

        {/* Tab switcher */}
        <div style={{ display:'flex', background:'rgba(0,0,0,0.4)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, padding:4, marginBottom:20, backdropFilter:'blur(8px)' }}>
          {(['materi', 'soal'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex:1, padding:'10px', borderRadius:12, fontWeight:700, fontSize:13, cursor:'pointer',
              background: tab === t ? '#facc15' : 'transparent',
              color: tab === t ? '#111827' : 'rgba(255,255,255,0.5)',
              border: 'none', transition:'all 0.2s',
            }}>
              {t === 'materi' ? '📖 Materi' : `📝 Soal LKPD (${soalList.length})`}
            </button>
          ))}
        </div>

        {/* ══ TAB MATERI ══ */}
        {tab === 'materi' && (
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>

            {/* AI Button */}
            <button
              onClick={() => setShowAIModal('materi')}
              onMouseEnter={e => { (e.currentTarget).style.transform = 'translateY(-2px)'; (e.currentTarget).style.boxShadow = '0 8px 25px rgba(139,92,246,0.4)' }}
              onMouseLeave={e => { (e.currentTarget).style.transform = 'translateY(0)'; (e.currentTarget).style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)' }}
              style={{ width:'100%', background:'linear-gradient(135deg,#4c1d95,#1e3a8a)', border:'1.5px solid rgba(139,92,246,0.5)', borderRadius:16, padding:'14px 20px', color:'#fff', fontWeight:900, fontSize:14, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, transition:'all 0.2s', boxShadow:'0 4px 15px rgba(0,0,0,0.3)' }}
            >
              <span style={{ fontSize:18 }}>✨</span>
              <span>Buat Materi dengan AI</span>
              <span style={{ color:'rgba(255,255,255,0.4)', fontWeight:400, fontSize:11 }}>(Gemini)</span>
            </button>

            {/* YouTube */}
            <div
              style={glowCard('yt', '#ef4444')}
              onMouseEnter={() => { setHoveredCard('yt'); setShimmerCard('yt') }}
              onMouseLeave={() => { setHoveredCard(null); setShimmerCard(null) }}
            >
              {shimmerCard === 'yt' && <div className="shimmer-overlay" />}
              <div style={{ position:'relative' }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
                  <span className={hoveredCard === 'yt' ? 'hover-icon-float' : ''} style={{ fontSize:20 }}>▶️</span>
                  <label style={{ color:'#fff', fontWeight:700, fontSize:13 }}>Link Video YouTube</label>
                </div>
                <input type="url" value={youtubeUrl} onChange={e => setYoutubeUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..." style={inp} />
                {youtubeUrl && <p style={{ color:'#4ade80', fontSize:11, margin:'6px 0 0' }}>✅ URL terisi{youtubeUrl.includes('youtube') ? ' (YouTube)' : ''}</p>}
              </div>
            </div>

            {/* Upload Materi */}
            <div
              style={glowCard('fmateri', '#f59e0b')}
              onMouseEnter={() => { setHoveredCard('fmateri'); setShimmerCard('fmateri') }}
              onMouseLeave={() => { setHoveredCard(null); setShimmerCard(null) }}
            >
              {shimmerCard === 'fmateri' && <div className="shimmer-overlay" />}
              <div style={{ position:'relative' }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
                  <span className={hoveredCard === 'fmateri' ? 'hover-icon-float' : ''} style={{ fontSize:20 }}>📄</span>
                  <label style={{ color:'#fff', fontWeight:700, fontSize:13 }}>Upload File Materi (PDF)</label>
                </div>
                <input type="file" accept=".pdf,.doc,.docx,.ppt,.pptx" onChange={e => setFileMateri(e.target.files?.[0] ?? null)}
                  style={{ width:'100%', color:'rgba(255,255,255,0.6)', fontSize:12 }}
                  className="file:mr-3 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:bg-yellow-400 file:text-gray-900 file:font-bold file:cursor-pointer file:text-xs" />
                {fileMateri && <p style={{ color:'#4ade80', fontSize:11, margin:'6px 0 0' }}>✅ {fileMateri.name} ({(fileMateri.size/1024).toFixed(1)} KB)</p>}
              </div>
            </div>

            {/* Teks Materi */}
            <div
              style={glowCard('teks', '#3b82f6')}
              onMouseEnter={() => { setHoveredCard('teks'); setShimmerCard('teks') }}
              onMouseLeave={() => { setHoveredCard(null); setShimmerCard(null) }}
            >
              {shimmerCard === 'teks' && <div className="shimmer-overlay" />}
              <div style={{ position:'relative' }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <span className={hoveredCard === 'teks' ? 'hover-icon-float' : ''} style={{ fontSize:20 }}>📝</span>
                    <label style={{ color:'#fff', fontWeight:700, fontSize:13 }}>Materi / Ringkasan Teks</label>
                  </div>
                  {isiMateri && <span style={{ color:'#4ade80', fontSize:11, background:'rgba(74,222,128,0.1)', border:'1px solid rgba(74,222,128,0.3)', borderRadius:999, padding:'2px 8px' }}>✅ Terisi AI</span>}
                </div>
                <textarea value={isiMateri} onChange={e => setIsiMateri(e.target.value)}
                  placeholder="Tulis ringkasan materi atau klik ✨ Buat Materi dengan AI di atas..."
                  rows={8} style={{ ...inp, resize:'none' }} />
              </div>
            </div>

            {!isiMateri.trim() && !youtubeUrl.trim() && !fileMateri && (
              <div style={{ background:'rgba(120,53,15,0.6)', border:'1px solid rgba(245,158,11,0.35)', borderRadius:12, padding:'10px 14px', display:'flex', alignItems:'flex-start', gap:10 }}>
                <span style={{ fontSize:14, flexShrink:0 }}>⚠️</span>
                <p style={{ color:'#fde68a', fontSize:12, margin:0 }}>Belum ada materi. Isi minimal salah satu: teks materi, link YouTube, atau upload file PDF.</p>
              </div>
            )}

            {/* Upload Tugas */}
            <div
              style={glowCard('ftugas', '#6366f1')}
              onMouseEnter={() => { setHoveredCard('ftugas'); setShimmerCard('ftugas') }}
              onMouseLeave={() => { setHoveredCard(null); setShimmerCard(null) }}
            >
              {shimmerCard === 'ftugas' && <div className="shimmer-overlay" />}
              <div style={{ position:'relative' }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
                  <span className={hoveredCard === 'ftugas' ? 'hover-icon-float' : ''} style={{ fontSize:20 }}>📎</span>
                  <label style={{ color:'#fff', fontWeight:700, fontSize:13 }}>Upload File Tugas <span style={{ color:'rgba(255,255,255,0.35)', fontWeight:400 }}>(opsional)</span></label>
                </div>
                <input type="file" onChange={e => setFileTugas(e.target.files?.[0] ?? null)}
                  style={{ width:'100%', color:'rgba(255,255,255,0.6)', fontSize:12 }}
                  className="file:mr-3 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-500 file:text-white file:font-bold file:cursor-pointer file:text-xs" />
                {fileTugas && <p style={{ color:'#4ade80', fontSize:11, margin:'6px 0 0' }}>✅ {fileTugas.name} ({(fileTugas.size/1024).toFixed(1)} KB)</p>}
              </div>
            </div>
          </div>
        )}

        {/* ══ TAB SOAL ══ */}
        {tab === 'soal' && (
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>

            {/* AI Button */}
            <button
              onClick={() => setShowAIModal('lkpd')}
              onMouseEnter={e => { (e.currentTarget).style.transform = 'translateY(-2px)'; (e.currentTarget).style.boxShadow = '0 8px 25px rgba(16,185,129,0.4)' }}
              onMouseLeave={e => { (e.currentTarget).style.transform = 'translateY(0)'; (e.currentTarget).style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)' }}
              style={{ width:'100%', background:'linear-gradient(135deg,#064e3b,#0f766e)', border:'1.5px solid rgba(16,185,129,0.5)', borderRadius:16, padding:'14px 20px', color:'#fff', fontWeight:900, fontSize:14, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, transition:'all 0.2s', boxShadow:'0 4px 15px rgba(0,0,0,0.3)' }}
            >
              <span style={{ fontSize:18 }}>✨</span>
              <span>Generate Soal LKPD dengan AI</span>
              <span style={{ color:'rgba(255,255,255,0.4)', fontWeight:400, fontSize:11 }}>(Gemini)</span>
            </button>

            {soalList.length > 0 && (
              <div style={{ background:'rgba(30,58,138,0.5)', border:'1px solid rgba(59,130,246,0.3)', borderRadius:12, padding:'10px 14px', display:'flex', gap:10 }}>
                <span style={{ fontSize:14, flexShrink:0 }}>ℹ️</span>
                <p style={{ color:'#93c5fd', fontSize:12, margin:0 }}>Soal AI akan <strong>ditambahkan di bawah</strong> soal yang sudah ada. Hapus manual jika tidak diinginkan.</p>
              </div>
            )}

            {/* Tambah Manual */}
            <div
              style={glowCard('manual', '#facc15')}
              onMouseEnter={() => { setHoveredCard('manual'); setShimmerCard('manual') }}
              onMouseLeave={() => { setHoveredCard(null); setShimmerCard(null) }}
            >
              {shimmerCard === 'manual' && <div className="shimmer-overlay" />}
              <div style={{ position:'relative' }}>
                <p style={{ color:'#fff', fontWeight:700, fontSize:13, margin:'0 0 10px' }}>➕ Tambah Soal Manual:</p>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                  {TIPE_SOAL.map(t => (
                    <button key={t.value} onClick={() => setSoalList(p => [...p, createSoalBaru(t.value)])}
                      style={{ background:'#1f2937', border:'1px solid rgba(255,255,255,0.12)', borderRadius:12, padding:'10px 12px', textAlign:'left', cursor:'pointer', transition:'all 0.15s' }}
                      onMouseEnter={e => { (e.currentTarget).style.background = '#374151'; (e.currentTarget).style.borderColor = 'rgba(250,204,21,0.4)' }}
                      onMouseLeave={e => { (e.currentTarget).style.background = '#1f2937'; (e.currentTarget).style.borderColor = 'rgba(255,255,255,0.12)' }}
                    >
                      <p style={{ color:'#fff', fontWeight:700, fontSize:12, margin:'0 0 2px' }}>{t.label}</p>
                      <p style={{ color:'rgba(255,255,255,0.4)', fontSize:11, margin:0 }}>{t.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Total skor */}
            {soalList.length > 0 && (
              <div style={{
                background: skorOver ? 'rgba(127,29,29,0.8)' : 'rgba(0,0,0,0.5)',
                border: skorOver ? '1px solid rgba(239,68,68,0.5)' : '1px solid rgba(255,255,255,0.1)',
                borderRadius:14, padding:'12px 16px', display:'flex', alignItems:'center', justifyContent:'space-between',
                boxShadow: skorOver ? '0 0 20px rgba(239,68,68,0.2)' : 'none',
              }}>
                <div>
                  <p style={{ color: skorOver ? '#f87171' : 'rgba(255,255,255,0.5)', fontSize:12, fontWeight:600, margin:'0 0 2px' }}>Total Skor Kegiatan</p>
                  {skorOver && <p style={{ color:'#fca5a5', fontSize:11, margin:0 }}>⚠️ Melebihi 100! Sesuaikan skor tiap soal.</p>}
                </div>
                <span style={{ color: skorOver ? '#f87171' : '#fde047', fontWeight:900, fontSize:26 }}>
                  {totalSkor}<span style={{ fontSize:13, fontWeight:400, opacity:0.5 }}> / 100</span>
                </span>
              </div>
            )}

            {soalList.length === 0 ? (
              <div style={{ background:'rgba(0,0,0,0.4)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, padding:'40px 20px', textAlign:'center' }}>
                <p style={{ fontSize:32, margin:'0 0 8px' }}>📭</p>
                <p style={{ color:'rgba(255,255,255,0.35)', fontSize:13, margin:0 }}>Belum ada soal. Generate dengan AI atau tambah manual!</p>
              </div>
            ) : (
              soalList.map((soal, idx) => (
                <SoalEditor key={soal.id} soal={soal} nomor={idx + 1}
                  onUpdate={(fn: (s: Soal) => Soal) => setSoalList(p => p.map(s => s.id === soal.id ? fn(s) : s))}
                  onRemove={() => setSoalList(p => p.filter(s => s.id !== soal.id))} />
              ))
            )}
          </div>
        )}

        {/* Tombol simpan */}
        <div style={{ marginTop:24 }}>
          <button
            onClick={handleSimpan} disabled={saving}
            onMouseEnter={e => { if (!saving) { (e.currentTarget).style.transform = 'translateY(-2px) scale(1.01)'; (e.currentTarget).style.boxShadow = '0 12px 30px rgba(250,204,21,0.4)' }}}
            onMouseLeave={e => { (e.currentTarget).style.transform = 'translateY(0) scale(1)'; (e.currentTarget).style.boxShadow = '0 6px 20px rgba(250,204,21,0.25)' }}
            style={{ width:'100%', background: saving ? '#9ca3af' : '#facc15', border:'none', borderRadius:18, padding:'16px', color:'#111827', fontWeight:900, fontSize:17, cursor: saving ? 'not-allowed' : 'pointer', transition:'all 0.2s', boxShadow:'0 6px 20px rgba(250,204,21,0.25)' }}
          >
            {saving ? '⏳ Menyimpan...' : '💾 SIMPAN & DAPATKAN TOKEN'}
          </button>
        </div>
      </div>

      {/* Token Modal */}
      {showTokenModal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.85)', backdropFilter:'blur(6px)', zIndex:50, display:'flex', alignItems:'center', justifyContent:'center', padding:'0 16px' }}>
          <div style={{ background:'#111827', border:'1px solid rgba(255,255,255,0.12)', borderRadius:24, width:'100%', maxWidth:360, maxHeight:'90vh', overflowY:'auto', boxShadow:'0 25px 60px rgba(0,0,0,0.7)' }}>
            <div style={{ padding:20 }}>
              <h3 style={{ color:'#fff', fontWeight:900, fontSize:20, textAlign:'center', margin:'0 0 16px' }}>🎉 Kegiatan Tersimpan!</h3>
              <div style={{ background:'linear-gradient(135deg,#1e3a8a,#312e81)', borderRadius:18, padding:20, textAlign:'center', marginBottom:16, border:'2px solid #facc15' }}>
                <img src="/logo.png" alt="Logo" style={{ height:40, width:40, objectFit:'contain', margin:'0 auto 6px', display:'block' }} />
                <p style={{ color:'#fde047', fontWeight:700, fontSize:10, margin:'0 0 2px' }}>PLATFORM PEMBELAJARAN JARAK JAUH</p>
                <p style={{ color:'rgba(255,255,255,0.7)', fontSize:10, margin:'0 0 10px' }}>SMP NEGERI 8 PROBOLINGGO</p>
                <p style={{ color:'rgba(255,255,255,0.55)', fontSize:12, margin:'0 0 2px' }}>Mata Pelajaran: <strong style={{ color:'#fff' }}>{guru.mapel}</strong></p>
                <p style={{ color:'rgba(255,255,255,0.55)', fontSize:12, margin:'0 0 14px' }}>Guru: <strong style={{ color:'#fff' }}>{guru.nama}</strong></p>
                <div style={{ background:'#facc15', borderRadius:12, padding:'10px 16px' }}>
                  <p style={{ color:'#111827', fontSize:10, fontWeight:600, margin:'0 0 4px' }}>TOKEN KEGIATAN</p>
                  <p style={{ color:'#111827', fontWeight:900, fontSize:28, letterSpacing:'0.3em', margin:0 }}>{token}</p>
                </div>
                <p style={{ color:'rgba(255,255,255,0.4)', fontSize:10, margin:'8px 0 0' }}>Berikan token ini kepada siswa</p>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8, marginBottom:10 }}>
                {[
                  { label:'Kirim WA', icon:'💬', bg:'#16a34a', fn: handleShareWA },
                  { label:'Token PNG', icon:'🖼', bg:'#2563eb', fn: downloadToken },
                  { label: pdfLoading ? '...' : 'PDF', icon: pdfLoading ? '⏳' : '📄', bg:'#7c3aed', fn: handleDownloadPDF, disabled: pdfLoading },
                ].map(b => (
                  <button key={b.label} onClick={b.fn} disabled={b.disabled}
                    style={{ background: b.disabled ? '#6b7280' : b.bg, border:'none', borderRadius:12, padding:'10px 4px', color:'#fff', fontWeight:700, fontSize:12, cursor: b.disabled ? 'not-allowed' : 'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:4, transition:'all 0.15s' }}
                    onMouseEnter={e => { if (!b.disabled) (e.currentTarget).style.opacity = '0.85' }}
                    onMouseLeave={e => { (e.currentTarget).style.opacity = '1' }}
                  >
                    <span style={{ fontSize:18 }}>{b.icon}</span>
                    <span>{b.label}</span>
                  </button>
                ))}
              </div>
              <button
                onClick={() => { setShowTokenModal(false); window.location.href = '/elkpd/guru/dashboard' }}
                style={{ width:'100%', background:'#facc15', border:'none', borderRadius:12, padding:'12px', color:'#111827', fontWeight:700, fontSize:14, cursor:'pointer' }}
              >
                ✅ Selesai
              </button>
            </div>
          </div>
        </div>
      )}

      <p style={{ color:'rgba(255,255,255,0.25)', fontSize:11, textAlign:'center', padding:'12px 0 24px' }}>created by dhickz666</p>
    </PageWrapper>
  )
}

// ═══════════════════════════════════════════════════════════════
//  SOAL EDITOR
// ═══════════════════════════════════════════════════════════════
interface SoalEditorProps {
  soal: Soal; nomor: number
  onUpdate: (fn: (s: Soal) => Soal) => void
  onRemove: () => void
}

function SoalEditor({ soal, nomor, onUpdate, onRemove }: SoalEditorProps) {
  const [hov, setHov] = useState(false)
  const update = (field: string, value: unknown) => onUpdate(s => ({ ...s, [field]: value } as Soal))

  const inp: React.CSSProperties = {
    background:'#1f2937', border:'1px solid rgba(255,255,255,0.12)',
    borderRadius:10, padding:'8px 12px', color:'#fff', fontSize:13,
    outline:'none', boxSizing:'border-box',
  }

  return (
    <div
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background:'#0f172a', border: hov ? '2px solid rgba(250,204,21,0.6)' : '2px solid rgba(255,255,255,0.08)',
        borderRadius:18, padding:16, transition:'all 0.2s',
        boxShadow: hov ? '0 0 25px rgba(250,204,21,0.2), 0 6px 20px rgba(0,0,0,0.4)' : '0 4px 14px rgba(0,0,0,0.35)',
        transform: hov ? 'translateY(-1px)' : 'translateY(0)',
      }}
    >
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ background:'#facc15', color:'#111827', fontWeight:900, fontSize:11, padding:'3px 8px', borderRadius:8 }}>#{nomor}</span>
          <span style={{ color:'rgba(255,255,255,0.45)', fontSize:11, fontWeight:600, textTransform:'uppercase' }}>{soal.tipe.replace('_',' ')}</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ color:'rgba(255,255,255,0.4)', fontSize:12 }}>Skor:</span>
          <input type="number" value={soal.skor} onChange={e => update('skor', Number(e.target.value))}
            style={{ ...inp, width:52, textAlign:'center', padding:'4px 6px', fontSize:13 }} />
          <button onClick={onRemove} style={{ background:'none', border:'none', color:'#f87171', fontSize:18, cursor:'pointer', padding:0, lineHeight:1 }}>✕</button>
        </div>
      </div>

      {/* Pertanyaan */}
      <textarea value={soal.pertanyaan} onChange={e => update('pertanyaan', e.target.value)}
        placeholder="Tulis soal / pertanyaan..." rows={2}
        style={{ ...inp, width:'100%', resize:'none', marginBottom: soal.pertanyaan?.trim() ? 12 : 4, borderColor: soal.pertanyaan?.trim() ? 'rgba(255,255,255,0.12)' : 'rgba(249,115,22,0.5)' }} />
      {!soal.pertanyaan?.trim() && (
        <p style={{ color:'rgba(251,146,60,0.7)', fontSize:11, margin:'0 0 12px 2px' }}>⚠ Pertanyaan belum diisi</p>
      )}

      {/* Pilgan */}
      {soal.tipe === 'pilgan' && (() => {
        const s = soal as SoalPilgan
        return (
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {s.pilihan.map((p, i) => (
              <div key={p.id} style={{ display:'flex', alignItems:'center', gap:8 }}>
                <input type="radio" name={`kunci-${s.id}`} checked={s.kunci === p.id} onChange={() => update('kunci', p.id)} style={{ accentColor:'#facc15', flexShrink:0 }} />
                <span style={{ color:'rgba(255,255,255,0.5)', fontSize:13, fontWeight:700, minWidth:16 }}>{String.fromCharCode(65+i)}.</span>
                <input type="text" value={p.teks}
                  onChange={e => update('pilihan', s.pilihan.map((x: PilihanItem) => x.id === p.id ? { ...x, teks: e.target.value } : x))}
                  placeholder={`Pilihan ${String.fromCharCode(65+i)}`} style={{ ...inp, flex:1 }} />
              </div>
            ))}
            <p style={{ color:'#fde047', fontSize:11, margin:'2px 0 0' }}>● = Kunci Jawaban</p>
          </div>
        )
      })()}

      {/* Benar Salah */}
      {soal.tipe === 'benar_salah' && (() => {
        const s = soal as SoalBenarSalah
        return (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
            {(['benar','salah'] as const).map(v => (
              <button key={v} onClick={() => update('kunci', v)} style={{
                padding:'10px', borderRadius:12, fontWeight:700, fontSize:13, cursor:'pointer',
                background: s.kunci === v ? '#facc15' : '#1f2937',
                border: s.kunci === v ? 'none' : '1px solid rgba(255,255,255,0.12)',
                color: s.kunci === v ? '#111827' : 'rgba(255,255,255,0.7)',
                transition:'all 0.15s',
              }}>
                {v === 'benar' ? '✅ Benar' : '❌ Salah'}
              </button>
            ))}
          </div>
        )
      })()}

      {/* Menjodohkan */}
      {soal.tipe === 'menjodohkan' && (() => {
        const s = soal as SoalMenjodohkan
        return (
          <div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:6 }}>
              <p style={{ color:'rgba(255,255,255,0.4)', fontSize:11, fontWeight:700, textAlign:'center', margin:0 }}>Kolom Kiri</p>
              <p style={{ color:'rgba(255,255,255,0.4)', fontSize:11, fontWeight:700, textAlign:'center', margin:0 }}>Kolom Kanan</p>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
              {s.pasangan.map((p, i) => (
                <div key={p.kiri_id} style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                  <input value={p.kiri} onChange={e => update('pasangan', s.pasangan.map((x: PasanganItem) => x.kiri_id === p.kiri_id ? { ...x, kiri: e.target.value } : x))} placeholder={`Kiri ${i+1}`} style={inp} />
                  <input value={p.kanan} onChange={e => update('pasangan', s.pasangan.map((x: PasanganItem) => x.kiri_id === p.kiri_id ? { ...x, kanan: e.target.value } : x))} placeholder={`Kanan ${i+1}`} style={inp} />
                </div>
              ))}
            </div>
            <button onClick={() => update('pasangan', [...s.pasangan, { kiri_id: generateId(), kiri:'', kanan_id: generateId(), kanan:'' }])}
              style={{ background:'none', border:'none', color:'#fde047', fontSize:12, cursor:'pointer', marginTop:6, padding:0 }}>+ Tambah Pasangan</button>
          </div>
        )
      })()}

      {/* TTS */}
      {soal.tipe === 'tts' && (() => {
        const s = soal as SoalTts
        return (
          <div>
            <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
              {s.kotak.map((k, i) => (
                <div key={k.id} style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                  <input value={k.petunjuk} onChange={e => update('kotak', s.kotak.map((x: KotakItem) => x.id === k.id ? { ...x, petunjuk: e.target.value } : x))} placeholder={`Petunjuk ${i+1}`} style={inp} />
                  <input value={k.jawaban} onChange={e => update('kotak', s.kotak.map((x: KotakItem) => x.id === k.id ? { ...x, jawaban: e.target.value } : x))} placeholder={`Jawaban ${i+1}`} style={{ ...inp, borderColor:'rgba(34,197,94,0.4)' }} />
                </div>
              ))}
            </div>
            <button onClick={() => update('kotak', [...s.kotak, { id: generateId(), petunjuk:'', jawaban:'' }])}
              style={{ background:'none', border:'none', color:'#fde047', fontSize:12, cursor:'pointer', marginTop:6, padding:0 }}>+ Tambah Kotak</button>
          </div>
        )
      })()}

      {/* Drag Drop */}
      {soal.tipe === 'drag_drop' && (() => {
        const s = soal as SoalDragDrop
        return (
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            <div>
              <p style={{ color:'rgba(255,255,255,0.5)', fontSize:12, fontWeight:700, margin:'0 0 6px' }}>Item (yang diseret siswa):</p>
              <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                {s.item.map((it, i) => (
                  <input key={it.id} value={it.teks} onChange={e => update('item', s.item.map((x: DragItem) => x.id === it.id ? { ...x, teks: e.target.value } : x))} placeholder={`Item ${i+1}`} style={{ ...inp, width:'100%' }} />
                ))}
              </div>
              <button onClick={() => update('item', [...s.item, { id: generateId(), teks:'' }])}
                style={{ background:'none', border:'none', color:'#fde047', fontSize:12, cursor:'pointer', marginTop:4, padding:0 }}>+ Tambah Item</button>
            </div>
            <div>
              <p style={{ color:'rgba(255,255,255,0.5)', fontSize:12, fontWeight:700, margin:'0 0 6px' }}>Slot (label + jawaban yang benar):</p>
              <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                {s.slot.map((sl, i) => (
                  <div key={sl.id} style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                    <input value={sl.label} onChange={e => update('slot', s.slot.map((x: SlotItem) => x.id === sl.id ? { ...x, label: e.target.value } : x))} placeholder={`Label slot ${i+1}`} style={inp} />
                    <select value={sl.jawaban_item_id} onChange={e => update('slot', s.slot.map((x: SlotItem) => x.id === sl.id ? { ...x, jawaban_item_id: e.target.value } : x))}
                      style={{ ...inp, borderColor:'rgba(34,197,94,0.4)' }}>
                      <option value="" style={{ background:'#1f2937' }}>-- Jawaban --</option>
                      {s.item.map((it: DragItem) => (
                        <option key={it.id} value={it.id} style={{ background:'#1f2937' }}>{it.teks || `Item (${it.id.slice(0,4)})`}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
              <button onClick={() => update('slot', [...s.slot, { id: generateId(), label:'', jawaban_item_id:'' }])}
                style={{ background:'none', border:'none', color:'#fde047', fontSize:12, cursor:'pointer', marginTop:4, padding:0 }}>+ Tambah Slot</button>
            </div>
          </div>
        )
      })()}

      {soal.tipe === 'uraian' && (
        <p style={{ color:'#fdba74', fontSize:12, margin:0 }}>✍ Jawaban uraian akan dinilai manual oleh guru</p>
      )}
    </div>
  )
}