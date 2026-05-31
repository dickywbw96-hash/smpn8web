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
    if (totalSkor === 0)
      warnings.push('Total skor semua soal masih 0.')
    if (totalSkor > 100)
      warnings.push(`Total skor soal adalah ${totalSkor}, melebihi 100. Sesuaikan skor tiap soal.`)

    const soalKosong = soalList.filter(s => !s.pertanyaan?.trim()).length
    if (soalKosong > 0)
      warnings.push(`${soalKosong} soal belum memiliki teks pertanyaan.`)
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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div className="bg-gray-900 border border-white/20 rounded-2xl w-full max-w-sm shadow-2xl p-5">
        <div className="text-center mb-4">
          <div className="text-4xl mb-2">{hasErrors ? '🚫' : '⚠️'}</div>
          <h3 className="text-white font-black text-base">
            {hasErrors ? 'Tidak Bisa Disimpan' : 'Ada yang Belum Lengkap'}
          </h3>
          <p className="text-white/50 text-xs mt-1">
            {hasErrors
              ? 'Perbaiki dulu sebelum menyimpan kegiatan.'
              : 'Kegiatan bisa disimpan, tapi ada beberapa hal yang perlu diperhatikan.'}
          </p>
        </div>

        {errors.length > 0 && (
          <div className="bg-red-500/20 border border-red-500/40 rounded-xl px-4 py-3 mb-3 space-y-1.5">
            {errors.map((e, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-red-400 text-xs mt-0.5 shrink-0">✕</span>
                <p className="text-red-300 text-xs">{e}</p>
              </div>
            ))}
          </div>
        )}

        {warnings.length > 0 && (
          <div className="bg-yellow-500/15 border border-yellow-400/30 rounded-xl px-4 py-3 mb-3 space-y-1.5">
            {warnings.map((w, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-yellow-400 text-xs mt-0.5 shrink-0">⚠</span>
                <p className="text-yellow-200 text-xs">{w}</p>
              </div>
            ))}
          </div>
        )}

        <div className={`grid gap-2 ${hasErrors ? 'grid-cols-1' : 'grid-cols-2'}`}>
          <button onClick={onCancel} className="py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition">
            {hasErrors ? '← Kembali Edit' : '✏️ Lengkapi Dulu'}
          </button>
          {!hasErrors && (
            <button onClick={onConfirm} className="py-3 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-black text-sm transition">
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
    mapel: mapelDefault || '',
    topik: judulDefault || '',
    jenjang: '',
    kelas: '',
    keterangan: '',
    gaya: 'ringkas',
    sertakanVideo: true,
    jumlahSoal: 5,
    tipeSoal: ['pilgan'],
    levelKesulitan: 'sedang',
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

  const inp = 'w-full bg-gray-800 border border-white/20 rounded-xl px-3 py-2 text-white text-sm placeholder-white/30 focus:outline-none focus:border-yellow-400/60 transition'

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center px-0 sm:px-4">
      <div className="bg-gray-900 border border-white/20 rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg max-h-[92vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-gray-900 border-b border-white/10 px-5 py-4 flex items-center justify-between z-10">
          <div>
            <p className="text-yellow-400 font-black text-base">
              {isMateri ? '✨ Generate Materi dengan AI' : '✨ Generate Soal LKPD dengan AI'}
            </p>
            <p className="text-white/50 text-xs mt-0.5">Isi detail agar hasil lebih akurat & hemat token</p>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white text-2xl ml-3">✕</button>
        </div>

        <div className="px-5 py-4 space-y-4">
          <div className="space-y-3">
            <p className="text-white/50 text-xs font-bold uppercase tracking-widest">📚 Informasi Dasar</p>
            <div>
              <label className="text-white/70 text-xs font-semibold">Mata Pelajaran *</label>
              <input value={form.mapel} onChange={e => set('mapel', e.target.value)}
                placeholder="cth: Matematika, IPA, Bahasa Indonesia..." className={inp + ' mt-1'} />
            </div>
            <div>
              <label className="text-white/70 text-xs font-semibold">Topik / Materi Pokok *</label>
              <input value={form.topik} onChange={e => set('topik', e.target.value)}
                placeholder="cth: Fotosintesis, SPLDV, Teks Prosedur..." className={inp + ' mt-1'} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-white/70 text-xs font-semibold">Jenjang *</label>
                <select value={form.jenjang} onChange={e => set('jenjang', e.target.value)} className={inp + ' mt-1'}>
                  <option value="" className="bg-gray-900">Pilih...</option>
                  {JENJANG.map(j => <option key={j} value={j} className="bg-gray-900">{j}</option>)}
                </select>
              </div>
              <div>
                <label className="text-white/70 text-xs font-semibold">Kelas *</label>
                <input value={form.kelas} onChange={e => set('kelas', e.target.value)}
                  placeholder="cth: 7, 10, XI..." className={inp + ' mt-1'} />
              </div>
            </div>
            <div>
              <label className="text-white/70 text-xs font-semibold">Catatan Tambahan (opsional)</label>
              <textarea value={form.keterangan} onChange={e => set('keterangan', e.target.value)}
                placeholder={isMateri
                  ? 'cth: fokus contoh sehari-hari, pakai analogi sederhana...'
                  : 'cth: soal HOTS, sesuai KD 3.2, variasi soal cerita...'}
                rows={2} className={inp + ' mt-1 resize-none'} />
            </div>
          </div>

          {isMateri && (
            <div className="space-y-3">
              <p className="text-white/50 text-xs font-bold uppercase tracking-widest">📖 Gaya Penulisan</p>
              <div className="grid grid-cols-3 gap-2">
                {([
                  { val: 'ringkas' as GayaMateri, label: '⚡ Ringkas', desc: 'Padat & to the point' },
                  { val: 'detail' as GayaMateri,  label: '📝 Detail',  desc: 'Lengkap + contoh' },
                  { val: 'narasi' as GayaMateri,  label: '🗣️ Narasi',  desc: 'Santai & bercerita' },
                ]).map(o => (
                  <button key={o.val} onClick={() => set('gaya', o.val)}
                    className={`p-2 rounded-xl border text-center text-xs transition ${form.gaya === o.val
                      ? 'bg-yellow-400/20 border-yellow-400 text-yellow-300'
                      : 'bg-gray-800 border-white/20 text-white/60 hover:border-white/40'}`}>
                    <div className="font-bold">{o.label}</div>
                    <div className="text-white/40 text-[10px] mt-0.5">{o.desc}</div>
                  </button>
                ))}
              </div>
              <label className="flex items-center gap-3 cursor-pointer"
                onClick={() => set('sertakanVideo', !form.sertakanVideo)}>
                <div className={`w-10 h-6 rounded-full flex items-center px-0.5 transition-all ${form.sertakanVideo ? 'bg-yellow-400' : 'bg-white/20'}`}>
                  <div className={`w-5 h-5 bg-white rounded-full shadow transition-all ${form.sertakanVideo ? 'translate-x-4' : ''}`} />
                </div>
                <span className="text-white/80 text-sm">Carikan link video YouTube (Bhs. Indonesia)</span>
              </label>
            </div>
          )}

          {!isMateri && (
            <div className="space-y-3">
              <p className="text-white/50 text-xs font-bold uppercase tracking-widest">📋 Pengaturan Soal</p>
              <div>
                <label className="text-white/70 text-xs font-semibold">Jumlah Soal: {form.jumlahSoal} soal</label>
                <input type="range" min={3} max={20} value={form.jumlahSoal}
                  onChange={e => set('jumlahSoal', Number(e.target.value))}
                  className="w-full accent-yellow-400 mt-1" />
                <div className="flex justify-between text-white/30 text-xs"><span>3</span><span>20</span></div>
              </div>
              <div>
                <label className="text-white/70 text-xs font-semibold">Tipe Soal (bisa lebih dari satu)</label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {TIPE_SOAL.map(o => (
                    <button key={o.value} onClick={() => toggleTipe(o.value)}
                      className={`p-2 rounded-xl border text-left text-xs transition ${form.tipeSoal.includes(o.value)
                        ? 'bg-yellow-400/20 border-yellow-400 text-yellow-300'
                        : 'bg-gray-800 border-white/20 text-white/60 hover:border-white/40'}`}>
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-white/70 text-xs font-semibold">Level Kesulitan</label>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  {([
                    { val: 'mudah' as LevelKesulitan, label: '🟢 Mudah' },
                    { val: 'sedang' as LevelKesulitan, label: '🟡 Sedang' },
                    { val: 'sulit' as LevelKesulitan, label: '🔴 Sulit' },
                  ]).map(o => (
                    <button key={o.val} onClick={() => set('levelKesulitan', o.val)}
                      className={`py-2 rounded-xl border text-xs font-bold transition ${form.levelKesulitan === o.val
                        ? 'bg-yellow-400/20 border-yellow-400 text-yellow-300'
                        : 'bg-gray-800 border-white/20 text-white/60 hover:border-white/40'}`}>
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="bg-blue-900/60 border border-blue-400/30 rounded-xl px-4 py-3">
            <p className="text-blue-300 text-xs">
              💡 <strong>Hemat token:</strong> Makin spesifik topik & catatan, makin akurat hasilnya — tanpa perlu generate ulang.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pb-2">
            <button onClick={onClose}
              className="py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition">
              Batal
            </button>
            <button onClick={submit}
              className="py-3 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-black text-sm transition shadow-lg">
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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center px-6">
      <div className="bg-gray-900 border border-white/20 rounded-2xl p-6 w-full max-w-xs text-center">
        <div className="text-4xl mb-3 animate-bounce">🤖</div>
        <p className="text-white font-bold text-sm mb-2">AI sedang bekerja...</p>
        <p className="text-yellow-300 text-xs">{status || 'Menghubungi Gemini...'}</p>
        <div className="mt-4 flex justify-center gap-1">
          {[0,1,2].map(i => (
            <div key={i} className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Canvas rounded rect helper ───────────────────────────────
function canvasRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number
) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
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

  const uploadFile = async (file: File | null, folder: string): Promise<string | null> => {
    if (!file) return null
    if (file.size > 5 * 1024 * 1024) throw new Error(`File ${file.name} terlalu besar! Maksimal 5 MB.`)
    const ext = file.name.split('.').pop()
    const path = `${folder}/${Date.now()}.${ext}`
    const { data: uploadData, error } = await supabase.storage.from('lkpd-files').upload(path, file)
    if (error) throw error
    const { data: urlData } = supabase.storage.from('lkpd-files').getPublicUrl(path)
    return urlData.publicUrl
  }

  const handleFileMateri = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileMateri(e.target.files?.[0] ?? null)
  }

  const handleFileTugas = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileTugas(e.target.files?.[0] ?? null)
  }

  const doSimpan = async () => {
    setSaving(true)
    try {
      const fileMateriUrl = await uploadFile(fileMateri, 'materi')
      const fileTugasUrl  = await uploadFile(fileTugas, 'tugas')

      const { error } = await supabase.from('kegiatan').insert({
        token,
        guru_id: guru!.id,
        judul,
        youtube_url: youtubeUrl || null,
        file_materi_url: fileMateriUrl,
        isi_materi: isiMateri || null,
        soal_data: soalList,
        file_tugas_url: fileTugasUrl,
        aktif: true,
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
    if (errors.length > 0 || warnings.length > 0) {
      setValidationData({ errors, warnings })
      return
    }
    doSimpan()
  }

  const downloadToken = () => {
    const W = 480, H = 300
    const canvas = document.createElement('canvas')
    canvas.width = W; canvas.height = H
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const grad = ctx.createLinearGradient(0, 0, W, H)
    grad.addColorStop(0, '#1e3a8a')
    grad.addColorStop(1, '#312e81')
    ctx.fillStyle = grad
    canvasRoundRect(ctx, 0, 0, W, H, 20)
    ctx.fill()

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

    ctx.fillStyle = '#facc15'
    canvasRoundRect(ctx, 60, 125, W - 120, 110, 14); ctx.fill()

    ctx.fillStyle = '#1e293b'; ctx.font = 'bold 11px Arial, sans-serif'
    ctx.fillText('TOKEN KEGIATAN', W / 2, 150)
    ctx.font = 'bold 52px "Courier New", monospace'; ctx.fillStyle = '#0f172a'
    ctx.fillText(token, W / 2, 210)

    ctx.fillStyle = '#64748b'; ctx.font = '10px Arial, sans-serif'
    ctx.fillText('Berikan token ini kepada siswa untuk mengakses kegiatan', W / 2, 265)
    ctx.fillStyle = 'rgba(255,255,255,0.2)'; ctx.font = '9px Arial, sans-serif'
    ctx.fillText('created by dhickz666', W / 2, 285)

    const link = document.createElement('a')
    link.download = `TOKEN-${token}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const handleDownloadPDF = async () => {
    setPdfLoading(true)
    try {
      await downloadLKPDPdf({ judul, guru, token, isiMateri, youtubeUrl, soalList })
    } catch (err) {
      alert('Gagal membuat PDF: ' + (err instanceof Error ? err.message : String(err)))
    } finally {
      setPdfLoading(false)
    }
  }

  const addSoal    = (tipe: TipeSoal) => setSoalList(p => [...p, createSoalBaru(tipe)])
  const removeSoal = (id: string) => setSoalList(p => p.filter(s => s.id !== id))
  const updateSoal = (id: string, fn: (s: Soal) => Soal) =>
    setSoalList(p => p.map(s => s.id === id ? fn(s) : s))

  const handleShareWA = () => {
    const pesan =
`📚 *KEGIATAN PEMBELAJARAN*
Mata Pelajaran: *${guru?.mapel || '-'}*
Guru: *${guru?.nama || '-'}*

Halo, Siswa-Siswi SMPN 8 Probolinggo! 👋
Berikut token kegiatan LKPD yang bisa kamu akses:

🔑 *Token Kegiatan:*
*${token}*

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

  const handleGenerateMateri = async (formData: AIForm) => {
    setShowAIModal(null); setAiLoading(true); setAiError('')
    try {
      const result = await callGemini(buildMateriPrompt(formData), { onStatus: setAiStatus })
      const { isiMateri: mat, youtubeUrl: ytUrl } = parseMateriResult(result, formData.sertakanVideo)
      setIsiMateri(mat)
      if (ytUrl) setYoutubeUrl(ytUrl)
      if (!judul.trim() && formData.topik) setJudul(formData.topik)
    } catch (err) {
      setAiError(err instanceof Error ? err.message : String(err))
    } finally {
      setAiLoading(false); setAiStatus('')
    }
  }

  const handleGenerateSoal = async (formData: AIForm) => {
    setShowAIModal(null); setAiLoading(true); setAiError('')
    try {
      const result = await callGemini(buildSoalPrompt(formData), { onStatus: setAiStatus })
      const soalBaru = parseSoalResult(result)
      setSoalList(prev => [...prev, ...soalBaru])
      if (!judul.trim() && formData.topik) setJudul(formData.topik)
      setTab('soal')
    } catch (err) {
      setAiError(err instanceof Error ? err.message : String(err))
    } finally {
      setAiLoading(false); setAiStatus('')
    }
  }

  if (!guru) return null

  const totalSkor = soalList.reduce((s, q) => s + (Number(q.skor) || 0), 0)
  const skorOver  = totalSkor > 100

  // ── shared input style ──────────────────────────────────────
  const inp = 'w-full bg-gray-800 border border-white/20 text-white placeholder-white/30 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 transition'

  return (
    <PageWrapper>
      <NavbarElkpd guruNama={guru.nama} onLogout={() => { logout(); router.push('/') }} showGuruBtn={false} />

      {/* ── Overlay gelap agar konten tidak tenggelam di background ── */}
      <div className="fixed inset-0 bg-black/60 -z-10 pointer-events-none" />

      {/* ── Tombol kembali ── */}
      <div className="max-w-2xl mx-auto px-4 pt-3">
        <button
          onClick={() => { window.location.href = '/elkpd/guru/dashboard' }}
          className="flex items-center gap-2 bg-gray-900/80 hover:bg-gray-800 border border-white/20 text-white/80 hover:text-white text-sm font-semibold px-4 py-2 rounded-xl transition mb-1"
        >
          ← Kembali ke Dashboard
        </button>
      </div>

      {aiLoading && <AILoading status={aiStatus} />}

      {validationData && (
        <ValidationModal
          errors={validationData.errors}
          warnings={validationData.warnings}
          onConfirm={() => { setValidationData(null); doSimpan() }}
          onCancel={() => setValidationData(null)}
        />
      )}

      {showAIModal === 'materi' && (
        <AIModal mode="materi" mapelDefault={guru.mapel} judulDefault={judul}
          onGenerate={handleGenerateMateri} onClose={() => setShowAIModal(null)} />
      )}

      {showAIModal === 'lkpd' && (
        <AIModal mode="lkpd" mapelDefault={guru.mapel} judulDefault={judul}
          onGenerate={handleGenerateSoal} onClose={() => setShowAIModal(null)} />
      )}

      <div className="max-w-2xl mx-auto px-4 py-6">

        {/* ── AI Error ── */}
        {aiError && (
          <div className="bg-red-900/80 border border-red-500/60 rounded-xl px-4 py-3 mb-4 flex items-start gap-3">
            <span className="text-red-400 text-lg">⚠️</span>
            <div>
              <p className="text-red-300 font-bold text-sm">Generate AI gagal</p>
              <p className="text-red-300/70 text-xs mt-0.5">{aiError}</p>
            </div>
            <button onClick={() => setAiError('')} className="ml-auto text-red-400 hover:text-red-200 text-lg">✕</button>
          </div>
        )}

        {/* ── Token card ── */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 border border-blue-500/50 rounded-2xl p-4 mb-5 flex items-center justify-between shadow-xl">
          <div>
            <p className="text-white/60 text-xs">Token Kegiatan Ini</p>
            <p className="text-yellow-300 font-black text-3xl tracking-[0.3em]">{token}</p>
            <p className="text-white/50 text-xs mt-1">Bagikan ke siswa setelah simpan</p>
          </div>
          <div className="text-4xl">🔑</div>
        </div>

        {/* ── Judul ── */}
        <div className="mb-4">
          <label className="text-white font-semibold text-sm block mb-2">📌 Judul Kegiatan *</label>
          <input
            type="text"
            value={judul}
            onChange={e => setJudul(e.target.value)}
            placeholder="Contoh: Bab 3 - Sistem Tata Surya"
            className={`${inp} ${!judul.trim() ? 'border-white/20' : 'border-green-500/60'}`}
          />
          {!judul.trim() && (
            <p className="text-white/40 text-xs mt-1 ml-1">* Wajib diisi</p>
          )}
        </div>

        {/* ── Tab switcher ── */}
        <div className="flex bg-gray-900/90 border border-white/10 rounded-2xl p-1 mb-5">
          <button onClick={() => setTab('materi')}
            className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition ${tab === 'materi' ? 'bg-yellow-400 text-gray-900' : 'text-white/60 hover:text-white'}`}>
            📖 Materi
          </button>
          <button onClick={() => setTab('soal')}
            className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition ${tab === 'soal' ? 'bg-yellow-400 text-gray-900' : 'text-white/60 hover:text-white'}`}>
            📝 Soal LKPD ({soalList.length})
          </button>
        </div>

        {/* ══════════════ TAB MATERI ══════════════ */}
        {tab === 'materi' && (
          <div className="space-y-4">
            <button
              onClick={() => setShowAIModal('materi')}
              className="w-full bg-gradient-to-r from-purple-800 to-blue-800 hover:from-purple-700 hover:to-blue-700 border border-purple-500/50 text-white font-black py-3 px-4 rounded-2xl flex items-center justify-center gap-2 transition shadow-lg"
            >
              <span className="text-xl">✨</span>
              <span>Buat Materi dengan AI</span>
              <span className="text-white/50 font-normal text-xs ml-1">(Gemini)</span>
            </button>

            {/* YouTube */}
            <div className="bg-gray-900/90 border border-white/15 rounded-2xl p-4 shadow">
              <label className="text-white font-bold text-sm block mb-2">▶ Link Video YouTube</label>
              <input type="url" value={youtubeUrl} onChange={e => setYoutubeUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className={inp} />
              {youtubeUrl && <p className="text-green-400 text-xs mt-2">✅ URL terisi{youtubeUrl.includes('youtube') ? ' (YouTube)' : ''}</p>}
            </div>

            {/* Upload file materi */}
            <div className="bg-gray-900/90 border border-white/15 rounded-2xl p-4 shadow">
              <label className="text-white font-bold text-sm block mb-2">📄 Upload File Materi (PDF)</label>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.ppt,.pptx"
                onChange={handleFileMateri}
                className="w-full text-white/70 text-sm file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-yellow-400 file:text-gray-900 file:font-bold file:cursor-pointer"
              />
              {fileMateri && (
                <p className="text-green-400 text-xs mt-2">
                  ✅ {fileMateri.name} <span className="text-white/40">({(fileMateri.size / 1024).toFixed(1)} KB)</span>
                </p>
              )}
            </div>

            {/* Teks materi */}
            <div className="bg-gray-900/90 border border-white/15 rounded-2xl p-4 shadow">
              <div className="flex items-center justify-between mb-2">
                <label className="text-white font-bold text-sm">📝 Materi / Ringkasan Teks</label>
                {isiMateri && <span className="text-green-400 text-xs">✅ Terisi AI</span>}
              </div>
              <textarea value={isiMateri} onChange={e => setIsiMateri(e.target.value)}
                placeholder="Tulis ringkasan materi atau klik ✨ Buat Materi dengan AI di atas..."
                rows={8}
                className={`${inp} resize-none`} />
            </div>

            {!isiMateri.trim() && !youtubeUrl.trim() && !fileMateri && (
              <div className="bg-orange-900/60 border border-orange-500/40 rounded-xl px-4 py-3 flex items-start gap-2">
                <span className="text-orange-300 text-sm shrink-0">⚠️</span>
                <p className="text-orange-200 text-xs">
                  Belum ada materi. Isi minimal salah satu: teks materi, link YouTube, atau upload file PDF.
                </p>
              </div>
            )}

            {/* Upload file tugas */}
            <div className="bg-gray-900/90 border border-white/15 rounded-2xl p-4 shadow">
              <label className="text-white font-bold text-sm block mb-2">📎 Upload File Tugas (opsional)</label>
              <input
                type="file"
                onChange={handleFileTugas}
                className="w-full text-white/70 text-sm file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-500 file:text-white file:font-bold file:cursor-pointer"
              />
              {fileTugas && (
                <p className="text-green-400 text-xs mt-2">
                  ✅ {fileTugas.name} <span className="text-white/40">({(fileTugas.size / 1024).toFixed(1)} KB)</span>
                </p>
              )}
            </div>
          </div>
        )}

        {/* ══════════════ TAB SOAL ══════════════ */}
        {tab === 'soal' && (
          <div className="space-y-4">
            <button
              onClick={() => setShowAIModal('lkpd')}
              className="w-full bg-gradient-to-r from-green-800 to-teal-800 hover:from-green-700 hover:to-teal-700 border border-green-500/50 text-white font-black py-3 px-4 rounded-2xl flex items-center justify-center gap-2 transition shadow-lg"
            >
              <span className="text-xl">✨</span>
              <span>Generate Soal LKPD dengan AI</span>
              <span className="text-white/50 font-normal text-xs ml-1">(Gemini)</span>
            </button>

            {soalList.length > 0 && (
              <div className="bg-blue-900/60 border border-blue-400/30 rounded-xl px-4 py-2.5 flex items-center gap-2">
                <span className="text-blue-300 text-sm">ℹ️</span>
                <p className="text-blue-200 text-xs">
                  Soal AI akan <strong>ditambahkan di bawah</strong> soal yang sudah ada. Hapus manual jika tidak diinginkan.
                </p>
              </div>
            )}

            {/* Tambah manual */}
            <div className="bg-gray-900/90 border border-white/15 rounded-2xl p-4 shadow">
              <p className="text-white font-bold text-sm mb-3">➕ Tambah Soal Manual:</p>
              <div className="grid grid-cols-2 gap-2">
                {TIPE_SOAL.map(t => (
                  <button key={t.value} type="button" onClick={() => addSoal(t.value)}
                    className="bg-gray-800 hover:bg-gray-700 border border-white/20 rounded-xl p-3 text-left transition">
                    <p className="text-white font-bold text-xs">{t.label}</p>
                    <p className="text-white/50 text-xs mt-0.5">{t.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Total skor */}
            {soalList.length > 0 && (
              <div className={`rounded-xl px-4 py-3 flex items-center justify-between shadow ${
                skorOver ? 'bg-red-900/80 border border-red-500/60' : 'bg-gray-900/90 border border-white/15'
              }`}>
                <div>
                  <p className={`text-xs font-semibold ${skorOver ? 'text-red-400' : 'text-white/60'}`}>Total Skor Kegiatan</p>
                  {skorOver && <p className="text-red-300 text-xs mt-0.5">⚠️ Melebihi 100! Sesuaikan skor tiap soal.</p>}
                </div>
                <span className={`font-black text-2xl tracking-tight ${skorOver ? 'text-red-400' : 'text-yellow-300'}`}>
                  {totalSkor}
                  <span className="text-sm font-normal ml-1 opacity-60">/ 100</span>
                </span>
              </div>
            )}

            {soalList.length === 0 ? (
              <div className="bg-gray-900/80 border border-white/10 rounded-2xl text-center text-white/40 py-10">
                <p className="text-3xl mb-2">📭</p>
                <p className="text-sm">Belum ada soal. Generate dengan AI atau tambah manual!</p>
              </div>
            ) : (
              soalList.map((soal, idx) => (
                <SoalEditor key={soal.id} soal={soal} nomor={idx + 1}
                  onUpdate={(fn: (s: Soal) => Soal) => updateSoal(soal.id, fn)}
                  onRemove={() => removeSoal(soal.id)} />
              ))
            )}
          </div>
        )}

        {/* ── Tombol simpan ── */}
        <div className="mt-6">
          <button
            onClick={handleSimpan}
            disabled={saving}
            className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 text-gray-900 font-black text-lg py-4 rounded-2xl shadow-xl transition-all transform hover:scale-105"
          >
            {saving ? '⏳ Menyimpan...' : '💾 SIMPAN & DAPATKAN TOKEN'}
          </button>
        </div>
      </div>

      {/* ══════════════ TOKEN MODAL ══════════════ */}
      {showTokenModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-gray-900 border border-white/20 rounded-3xl w-full max-w-sm shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-5">
              <h3 className="text-white font-black text-xl text-center mb-4">🎉 Kegiatan Tersimpan!</h3>
              <div className="bg-gradient-to-br from-blue-900 to-indigo-900 rounded-2xl p-5 text-center mb-4 border-2 border-yellow-400">
                <img src="/logo.png" alt="Logo" className="h-10 w-10 object-contain mx-auto mb-1.5" />
                <p className="text-yellow-300 font-bold text-[10px]">PLATFORM PEMBELAJARAN JARAK JAUH</p>
                <p className="text-white/80 text-[10px] mb-2">SMP NEGERI 8 PROBOLINGGO</p>
                <p className="text-white/60 text-xs mb-0.5">Mata Pelajaran: <strong className="text-white">{guru.mapel}</strong></p>
                <p className="text-white/60 text-xs mb-3">Guru: <strong className="text-white">{guru.nama}</strong></p>
                <div className="bg-yellow-400 rounded-xl py-2.5 px-4">
                  <p className="text-gray-900 text-[10px] font-semibold mb-1">TOKEN KEGIATAN</p>
                  <p className="text-gray-900 font-black text-3xl tracking-[0.3em]">{token}</p>
                </div>
                <p className="text-white/50 text-[10px] mt-2">Berikan token ini kepada siswa</p>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-2">
                <button onClick={handleShareWA}
                  className="bg-green-600 hover:bg-green-500 text-white font-bold py-2.5 rounded-xl text-sm transition flex flex-col items-center justify-center gap-0.5">
                  <span className="text-base">💬</span><span className="text-xs">Kirim WA</span>
                </button>
                <button onClick={downloadToken}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-sm transition flex flex-col items-center justify-center gap-0.5">
                  <span className="text-base">🖼</span><span className="text-xs">Token PNG</span>
                </button>
                <button onClick={handleDownloadPDF} disabled={pdfLoading}
                  className="bg-purple-700 hover:bg-purple-600 disabled:opacity-60 text-white font-bold py-2.5 rounded-xl text-sm transition flex flex-col items-center justify-center gap-0.5">
                  <span className="text-base">{pdfLoading ? '⏳' : '📄'}</span>
                  <span className="text-xs">{pdfLoading ? '...' : 'PDF'}</span>
                </button>
              </div>
              <button
                onClick={() => { setShowTokenModal(false); window.location.href = '/elkpd/guru/dashboard' }}
                className="w-full bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold py-2.5 rounded-xl text-sm transition"
              >
                ✅ Selesai
              </button>
            </div>
          </div>
        </div>
      )}

      <p className="text-white/30 text-xs text-center py-4">created by dhickz666</p>
    </PageWrapper>
  )
}

// ═══════════════════════════════════════════════════════════════
//  SOAL EDITOR
// ═══════════════════════════════════════════════════════════════
interface SoalEditorProps {
  soal: Soal
  nomor: number
  onUpdate: (fn: (s: Soal) => Soal) => void
  onRemove: () => void
}

function SoalEditor({ soal, nomor, onUpdate, onRemove }: SoalEditorProps) {
  const update = (field: string, value: unknown) =>
    onUpdate(s => ({ ...s, [field]: value } as Soal))

  const inp = 'bg-gray-800 border border-white/20 text-white placeholder-white/30 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-yellow-400 transition'

  return (
    <div className="bg-gray-900/95 border border-white/15 rounded-2xl p-4 shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="bg-yellow-400 text-gray-900 font-black text-xs px-2 py-1 rounded-lg">#{nomor}</span>
          <span className="text-white/60 text-xs font-semibold uppercase">{soal.tipe.replace('_', ' ')}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-white/50 text-xs">Skor:</span>
          <input type="number" value={soal.skor}
            onChange={e => update('skor', Number(e.target.value))}
            className="w-14 bg-gray-800 border border-white/20 text-white rounded-lg px-2 py-1 text-xs text-center focus:outline-none" />
          <button onClick={onRemove} className="text-red-400 hover:text-red-300 text-lg leading-none">✕</button>
        </div>
      </div>

      <textarea value={soal.pertanyaan} onChange={e => update('pertanyaan', e.target.value)}
        placeholder="Tulis soal / pertanyaan..." rows={2}
        className={`w-full bg-gray-800 border text-white placeholder-white/30 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none mb-3 ${
          !soal.pertanyaan?.trim() ? 'border-orange-500/50' : 'border-white/20'
        }`} />

      {!soal.pertanyaan?.trim() && (
        <p className="text-orange-400/80 text-xs -mt-2 mb-3 ml-1">⚠ Pertanyaan belum diisi</p>
      )}

      {soal.tipe === 'pilgan' && (() => {
        const s = soal as SoalPilgan
        return (
          <div className="space-y-2">
            {s.pilihan.map((p, i) => (
              <div key={p.id} className="flex items-center gap-2">
                <input type="radio" name={`kunci-${s.id}`} checked={s.kunci === p.id}
                  onChange={() => update('kunci', p.id)}
                  className="accent-yellow-400" />
                <span className="text-white/60 text-sm font-bold">{String.fromCharCode(65 + i)}.</span>
                <input type="text" value={p.teks}
                  onChange={e => update('pilihan', s.pilihan.map((x: PilihanItem) => x.id === p.id ? { ...x, teks: e.target.value } : x))}
                  placeholder={`Pilihan ${String.fromCharCode(65 + i)}`}
                  className={`flex-1 ${inp}`} />
              </div>
            ))}
            <p className="text-yellow-300 text-xs">● = Kunci Jawaban</p>
          </div>
        )
      })()}

      {soal.tipe === 'benar_salah' && (() => {
        const s = soal as SoalBenarSalah
        return (
          <div className="grid grid-cols-2 gap-2">
            {(['benar', 'salah'] as const).map(v => (
              <button key={v} type="button" onClick={() => update('kunci', v)}
                className={`py-2 rounded-xl font-bold text-sm transition ${s.kunci === v ? 'bg-yellow-400 text-gray-900' : 'bg-gray-800 border border-white/20 text-white hover:bg-gray-700'}`}>
                {v === 'benar' ? '✅ Benar' : '❌ Salah'}
              </button>
            ))}
          </div>
        )
      })()}

      {soal.tipe === 'menjodohkan' && (() => {
        const s = soal as SoalMenjodohkan
        return (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2 mb-1">
              <p className="text-white/50 text-xs font-bold text-center">Kolom Kiri</p>
              <p className="text-white/50 text-xs font-bold text-center">Kolom Kanan</p>
            </div>
            {s.pasangan.map((p, i) => (
              <div key={p.kiri_id} className="grid grid-cols-2 gap-2">
                <input value={p.kiri}
                  onChange={e => update('pasangan', s.pasangan.map((x: PasanganItem) => x.kiri_id === p.kiri_id ? { ...x, kiri: e.target.value } : x))}
                  placeholder={`Kiri ${i + 1}`} className={inp} />
                <input value={p.kanan}
                  onChange={e => update('pasangan', s.pasangan.map((x: PasanganItem) => x.kiri_id === p.kiri_id ? { ...x, kanan: e.target.value } : x))}
                  placeholder={`Kanan ${i + 1}`} className={inp} />
              </div>
            ))}
            <button type="button"
              onClick={() => update('pasangan', [...s.pasangan, { kiri_id: generateId(), kiri: '', kanan_id: generateId(), kanan: '' }])}
              className="text-yellow-300 text-xs hover:text-yellow-200">+ Tambah Pasangan</button>
          </div>
        )
      })()}

      {soal.tipe === 'tts' && (() => {
        const s = soal as SoalTts
        return (
          <div className="space-y-2">
            {s.kotak.map((k, i) => (
              <div key={k.id} className="grid grid-cols-2 gap-2">
                <input value={k.petunjuk}
                  onChange={e => update('kotak', s.kotak.map((x: KotakItem) => x.id === k.id ? { ...x, petunjuk: e.target.value } : x))}
                  placeholder={`Petunjuk ${i + 1}`} className={inp} />
                <input value={k.jawaban}
                  onChange={e => update('kotak', s.kotak.map((x: KotakItem) => x.id === k.id ? { ...x, jawaban: e.target.value } : x))}
                  placeholder={`Jawaban ${i + 1}`}
                  className={`${inp} border-green-500/50`} />
              </div>
            ))}
            <button type="button"
              onClick={() => update('kotak', [...s.kotak, { id: generateId(), petunjuk: '', jawaban: '' }])}
              className="text-yellow-300 text-xs hover:text-yellow-200">+ Tambah Kotak</button>
          </div>
        )
      })()}

      {soal.tipe === 'drag_drop' && (() => {
        const s = soal as SoalDragDrop
        return (
          <div className="space-y-3">
            <div>
              <p className="text-white/60 text-xs font-bold mb-2">Item (yang diseret siswa):</p>
              {s.item.map((it, i) => (
                <input key={it.id} value={it.teks}
                  onChange={e => update('item', s.item.map((x: DragItem) => x.id === it.id ? { ...x, teks: e.target.value } : x))}
                  placeholder={`Item ${i + 1}`} className={`w-full ${inp} mb-1`} />
              ))}
              <button type="button"
                onClick={() => update('item', [...s.item, { id: generateId(), teks: '' }])}
                className="text-yellow-300 text-xs">+ Tambah Item</button>
            </div>
            <div>
              <p className="text-white/60 text-xs font-bold mb-2">Slot (label + jawaban yang benar):</p>
              {s.slot.map((sl, i) => (
                <div key={sl.id} className="grid grid-cols-2 gap-2 mb-1">
                  <input value={sl.label}
                    onChange={e => update('slot', s.slot.map((x: SlotItem) => x.id === sl.id ? { ...x, label: e.target.value } : x))}
                    placeholder={`Label slot ${i + 1}`} className={inp} />
                  <select value={sl.jawaban_item_id}
                    onChange={e => update('slot', s.slot.map((x: SlotItem) => x.id === sl.id ? { ...x, jawaban_item_id: e.target.value } : x))}
                    className="bg-gray-800 border border-green-500/50 text-white rounded-lg px-2 py-1.5 text-sm focus:outline-none">
                    <option value="" className="bg-gray-900">-- Jawaban --</option>
                    {s.item.map((it: DragItem) => (
                      <option key={it.id} value={it.id} className="bg-gray-900">{it.teks || `Item (${it.id.slice(0, 4)})`}</option>
                    ))}
                  </select>
                </div>
              ))}
              <button type="button"
                onClick={() => update('slot', [...s.slot, { id: generateId(), label: '', jawaban_item_id: '' }])}
                className="text-yellow-300 text-xs">+ Tambah Slot</button>
            </div>
          </div>
        )
      })()}

      {soal.tipe === 'uraian' && (
        <p className="text-orange-300 text-xs">✍ Jawaban uraian akan dinilai manual oleh guru</p>
      )}
    </div>
  )
}