// src/app/(elkpd)/elkpd/guru/preview/[id]/page.tsx
'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import PageWrapper from '@/components/elkpd/PageWrapper'
import NavbarElkpd from '@/components/elkpd/Navbar'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase-elkpd'

// ─── Card preview soal (read-only) ──────────────────────────
function SoalPreviewCard({ soal, nomor }: { soal: any; nomor: number }) {
  const getTipeLabel = (tipe: string) => ({
    pilgan: '🔘 Pilihan Ganda', uraian: '✍ Uraian',
    benar_salah: '✅ Benar/Salah', menjodohkan: '🔗 Menjodohkan',
    drag_drop: '🎯 Drag & Drop', tts: '🔤 Isian Singkat',
  }[tipe] || tipe)

  return (
    <div className="bg-white/10 border border-white/20 rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="bg-yellow-400 text-gray-900 font-black text-xs px-2 py-1 rounded-lg">#{nomor}</span>
        <span className="bg-white/10 text-white/60 text-xs px-2 py-1 rounded-lg font-semibold">{getTipeLabel(soal.tipe)}</span>
        <span className="ml-auto text-white/40 text-xs">Skor: {soal.skor}</span>
      </div>

      <p className="text-white font-semibold text-sm leading-relaxed mb-3">
        {soal.pertanyaan || <span className="text-white/30 italic">Belum ada pertanyaan</span>}
      </p>

      {/* Pilgan */}
      {soal.tipe === 'pilgan' && soal.pilihan && (
        <div className="space-y-1.5">
          {soal.pilihan.map((p: any, i: number) => (
            <div key={p.id} className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm ${soal.kunci === p.id ? 'bg-green-500/20 border border-green-400/40 text-green-300' : 'bg-white/5 border border-white/10 text-white/70'}`}>
              <span className="font-bold text-xs w-4">{String.fromCharCode(65 + i)}.</span>
              <span className="flex-1">{p.teks || <span className="italic opacity-40">kosong</span>}</span>
              {soal.kunci === p.id && <span className="text-green-400 text-xs font-bold">✓ Kunci</span>}
            </div>
          ))}
        </div>
      )}

      {/* Benar/Salah */}
      {soal.tipe === 'benar_salah' && (
        <div className="grid grid-cols-2 gap-2">
          {['benar', 'salah'].map(v => (
            <div key={v} className={`py-2 rounded-xl text-center text-sm font-bold ${soal.kunci === v ? 'bg-green-500/20 border border-green-400/40 text-green-300' : 'bg-white/5 border border-white/10 text-white/40'}`}>
              {v === 'benar' ? '✅ Benar' : '❌ Salah'}{soal.kunci === v && <span className="text-xs ml-1">(Kunci)</span>}
            </div>
          ))}
        </div>
      )}

      {/* Menjodohkan */}
      {soal.tipe === 'menjodohkan' && soal.pasangan && (
        <div className="space-y-1.5">
          <div className="grid grid-cols-2 gap-2 mb-1">
            <p className="text-white/40 text-xs text-center font-bold">KIRI</p>
            <p className="text-white/40 text-xs text-center font-bold">KANAN (Pasangan)</p>
          </div>
          {soal.pasangan.map((p: any) => (
            <div key={p.kiri_id} className="grid grid-cols-2 gap-2">
              <div className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white/70 text-sm">{p.kiri || <span className="italic opacity-40">kosong</span>}</div>
              <div className="bg-green-500/10 border border-green-400/20 rounded-lg px-3 py-1.5 text-green-300 text-sm">{p.kanan || <span className="italic opacity-40">kosong</span>}</div>
            </div>
          ))}
        </div>
      )}

      {/* TTS / Isian */}
      {soal.tipe === 'tts' && soal.kotak && (
        <div className="space-y-1.5">
          {soal.kotak.map((k: any) => (
            <div key={k.id} className="grid grid-cols-2 gap-2">
              <div className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white/70 text-sm">{k.petunjuk || <span className="italic opacity-40">petunjuk kosong</span>}</div>
              <div className="bg-green-500/10 border border-green-400/20 rounded-lg px-3 py-1.5 text-green-300 text-sm font-bold">{k.jawaban || <span className="italic opacity-40 font-normal">jawaban kosong</span>}</div>
            </div>
          ))}
        </div>
      )}

      {/* Drag & Drop */}
      {soal.tipe === 'drag_drop' && (
        <div className="space-y-3">
          {soal.item && (
            <div>
              <p className="text-white/40 text-xs font-bold mb-1.5">ITEM:</p>
              <div className="flex flex-wrap gap-2">
                {soal.item.map((it: any) => (
                  <span key={it.id} className="bg-white/10 border border-white/20 text-white/70 text-xs px-3 py-1.5 rounded-lg">{it.teks}</span>
                ))}
              </div>
            </div>
          )}
          {soal.slot && (
            <div>
              <p className="text-white/40 text-xs font-bold mb-1.5">SLOT → JAWABAN:</p>
              <div className="space-y-1.5">
                {soal.slot.map((sl: any) => {
                  const itemJawab = soal.item?.find((it: any) => it.id === sl.jawaban_item_id)
                  return (
                    <div key={sl.id} className="flex items-center gap-2 text-sm">
                      <span className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white/70 flex-1">{sl.label}</span>
                      <span className="text-white/30">→</span>
                      <span className="bg-green-500/10 border border-green-400/20 rounded-lg px-3 py-1.5 text-green-300 flex-1">{itemJawab?.teks || '?'}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Uraian */}
      {soal.tipe === 'uraian' && (
        <div className="bg-orange-500/10 border border-orange-400/20 rounded-xl px-3 py-2">
          <p className="text-orange-300 text-xs">✍ Jawaban uraian — dinilai manual oleh guru</p>
        </div>
      )}
    </div>
  )
}

// ─── Main Page ───────────────────────────────────────────────
export default function PreviewLKPDPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string
  const { guru, logout } = useAuth()
  const [kegiatan, setKegiatan] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'materi' | 'soal'>('materi')

  useEffect(() => {
    if (!guru) { router.push('/elkpd/guru/login'); return }
    if (id) fetchKegiatan()
  }, [guru, id])

  const fetchKegiatan = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('kegiatan').select('*').eq('id', id).eq('guru_id', guru!.id).single()
    if (error || !data) {
      alert('Kegiatan tidak ditemukan.')
      router.push('/elkpd/guru/hasil')
      return
    }
    setKegiatan(data)
    setLoading(false)
  }

  const getYoutubeEmbed = (url: string) => {
    if (!url) return null
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/)
    return match ? `https://www.youtube.com/embed/${match[1]}` : null
  }

  const handleShareWA = () => {
    if (!kegiatan) return
    const pesan = `📚 *KEGIATAN PEMBELAJARAN*\nMata Pelajaran: *${guru?.mapel || '-'}*\nGuru: *${guru?.nama || '-'}*\n\nHalo, Siswa-Siswi SMPN 8 Probolinggo! 👋\nBerikut token kegiatan LKPD yang bisa kamu akses:\n\n🔑 *Token Kegiatan:*\n*${kegiatan.token}*\n\n🌐 *Link LKPD:*\nhttps://smpn8prob.sch.id/elkpd\n\nLangkah-langkah:\n1️⃣ Buka link di atas\n2️⃣ Masukkan token kegiatan\n3️⃣ Kerjakan LKPD dengan semangat! 💪\n\n_Selamat belajar!_ 🎓`
    navigator.clipboard.writeText(pesan).catch(() => {})
    window.open(`https://wa.me/?text=${encodeURIComponent(pesan)}`, '_blank')
  }

  if (!guru) return null

  if (loading) {
    return (
      <PageWrapper>
        <NavbarElkpd guruNama={guru?.nama} onLogout={() => { logout(); router.push('/elkpd') }} showGuruBtn={false} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="text-4xl mb-3 animate-bounce">⏳</div>
            <p className="text-white/60">Memuat kegiatan...</p>
          </div>
        </div>
      </PageWrapper>
    )
  }

  const embedUrl = getYoutubeEmbed(kegiatan.youtube_url)
  const soalList = kegiatan.soal_data || []

  return (
    <PageWrapper>
      <NavbarElkpd guruNama={guru.nama} onLogout={() => { logout(); router.push('/elkpd') }} showGuruBtn={false} />
      <div className="max-w-2xl mx-auto px-4 py-6">

        {/* Back */}
        <div className="mb-4">
          <button onClick={() => router.push('/elkpd/guru/hasil')} className="flex items-center gap-2 text-white/60 hover:text-white text-sm transition">
            ← Kembali ke Hasil
          </button>
        </div>

        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-white font-black text-xl leading-tight">{kegiatan.judul}</h1>
            <p className="text-white/50 text-sm mt-0.5">{guru.mapel} — Preview Mode</p>
          </div>
          <button onClick={() => router.push(`/elkpd/guru/edit/${id}`)}
            className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-black text-sm px-4 py-2 rounded-xl transition shadow-lg flex items-center gap-1.5 flex-shrink-0">
            ✏️ Edit
          </button>
        </div>

        {/* Banner token */}
        <div className="bg-blue-500/20 border border-blue-400/30 rounded-2xl px-4 py-3 mb-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-blue-300 text-sm shrink-0">👁</span>
              <p className="text-blue-200 text-xs leading-relaxed">
                Tampilan seperti yang dilihat siswa. Token:{' '}
                <strong className="text-yellow-300 tracking-widest">{kegiatan.token}</strong>
              </p>
            </div>
            <button onClick={handleShareWA}
              className="bg-green-500/80 hover:bg-green-400/90 text-white font-black text-xs px-3 py-2 rounded-xl transition flex items-center gap-1.5 shrink-0 shadow">
              💬 <span>Bagikan WA</span>
            </button>
          </div>
        </div>

        {/* Tab */}
        <div className="flex bg-white/10 rounded-2xl p-1 mb-5">
          {(['materi', 'soal'] as const).map(t => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition ${activeTab === t ? 'bg-yellow-400 text-gray-900' : 'text-white/60 hover:text-white'}`}>
              {t === 'materi' ? '📖 Materi' : `📝 Soal LKPD (${soalList.length})`}
            </button>
          ))}
        </div>

        {/* ══ TAB MATERI ══ */}
        {activeTab === 'materi' && (
          <div className="space-y-4">
            <div className="bg-white/15 border border-white/25 rounded-2xl p-4 flex items-center gap-3">
              <div className="text-4xl shrink-0">👋</div>
              <div>
                <p className="text-yellow-300 font-black text-base">Halo, [Nama Siswa]!</p>
                <p className="text-white/70 text-sm">[Kelas] — {guru.mapel}</p>
              </div>
            </div>
            <div className="bg-blue-500/25 border border-blue-400/40 rounded-2xl p-4">
              <p className="text-white font-bold text-sm mb-2">📋 Cara Belajar Hari Ini:</p>
              <ol className="text-white/85 text-sm space-y-1.5 list-decimal list-inside">
                <li>Simak materi di bawah ini dengan baik</li>
                <li>Setelah selesai, klik <strong className="text-yellow-300">&quot;Mulai Kerjakan LKPD&quot;</strong></li>
                <li>Kerjakan semua soal yang ada</li>
                <li>Klik <strong className="text-yellow-300">&quot;Selesai &amp; Kirim&quot;</strong> saat sudah selesai</li>
              </ol>
            </div>
            <div className="text-center px-2">
              <h1 className="text-white font-black text-xl leading-tight">{kegiatan.judul}</h1>
              <p className="text-yellow-300/80 text-sm mt-1">Oleh: {guru.nama}</p>
            </div>

            {embedUrl && (
              <div className="rounded-2xl overflow-hidden border border-white/20 shadow-xl">
                <div className="bg-red-600 px-4 py-2.5 flex items-center gap-2">
                  <span className="text-white text-lg">▶</span>
                  <span className="text-white font-bold text-sm">Video Pembelajaran</span>
                </div>
                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                  <iframe src={embedUrl} title="Video Materi" className="absolute inset-0 w-full h-full" allowFullScreen />
                </div>
              </div>
            )}

            {kegiatan.isi_materi ? (
              <div className="bg-white/10 border border-white/20 rounded-2xl overflow-hidden">
                <div className="bg-white/10 px-4 py-3 flex items-center gap-2 border-b border-white/10">
                  <span className="text-2xl">📖</span>
                  <h2 className="text-white font-bold text-base">Ringkasan Materi</h2>
                </div>
                <div className="px-4 py-4 text-white/90 text-sm leading-relaxed whitespace-pre-wrap">{kegiatan.isi_materi}</div>
              </div>
            ) : (
              <div className="bg-white/5 border border-dashed border-white/20 rounded-2xl p-6 text-center">
                <p className="text-3xl mb-2">📭</p>
                <p className="text-white/40 text-sm">Belum ada materi teks</p>
                <button onClick={() => router.push(`/elkpd/guru/edit/${id}`)} className="mt-3 text-yellow-300 text-xs underline">+ Tambah materi</button>
              </div>
            )}

            {kegiatan.file_materi_url && (
              <div className="bg-white/10 border border-white/20 rounded-2xl overflow-hidden">
                <div className="bg-white/10 px-4 py-3 flex items-center gap-2 border-b border-white/10">
                  <span className="text-2xl">📄</span><h2 className="text-white font-bold text-base">File Materi</h2>
                </div>
                <div className="p-4">
                  <a href={kegiatan.file_materi_url} target="_blank" rel="noreferrer"
                    className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-400 text-white font-bold py-3 px-4 rounded-xl text-sm transition w-full">
                    ⬇ Download / Buka Materi PDF
                  </a>
                </div>
              </div>
            )}

            {kegiatan.file_tugas_url && (
              <div className="bg-white/10 border border-white/20 rounded-2xl overflow-hidden">
                <div className="bg-white/10 px-4 py-3 flex items-center gap-2 border-b border-white/10">
                  <span className="text-2xl">📎</span><h2 className="text-white font-bold text-base">File Tugas</h2>
                </div>
                <div className="p-4">
                  <a href={kegiatan.file_tugas_url} target="_blank" rel="noreferrer"
                    className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-bold py-3 px-4 rounded-xl text-sm transition w-full">
                    ⬇ Download File Tugas
                  </a>
                </div>
              </div>
            )}

            {soalList.length > 0 ? (
              <div className="bg-gradient-to-br from-yellow-400/25 to-orange-400/25 border-2 border-yellow-400/60 rounded-2xl p-5 text-center">
                <p className="text-white font-bold text-base mb-1">Ada {soalList.length} soal LKPD</p>
                <p className="text-white/60 text-sm mb-4">Klik tab &quot;Soal LKPD&quot; untuk lihat soal-soalnya</p>
                <button onClick={() => setActiveTab('soal')}
                  className="w-full bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-black text-base py-3 rounded-xl transition">
                  📝 Lihat Soal LKPD
                </button>
              </div>
            ) : (
              <div className="bg-white/10 border border-white/20 rounded-2xl p-4 text-center">
                <p className="text-white/40 text-sm">Tidak ada soal LKPD untuk kegiatan ini.</p>
              </div>
            )}
          </div>
        )}

        {/* ══ TAB SOAL ══ */}
        {activeTab === 'soal' && (
          <div className="space-y-4">
            {soalList.length === 0 ? (
              <div className="text-center text-white/40 py-8">
                <p className="text-3xl mb-2">📭</p>
                <p className="text-sm">Belum ada soal</p>
                <button onClick={() => router.push(`/elkpd/guru/edit/${id}`)} className="mt-3 text-yellow-300 text-xs underline">+ Tambah soal</button>
              </div>
            ) : (
              soalList.map((soal: any, idx: number) => (
                <SoalPreviewCard key={soal.id} soal={soal} nomor={idx + 1} />
              ))
            )}
          </div>
        )}

        {/* Bottom actions */}
        <div className="mt-8 pb-6 grid grid-cols-2 gap-3">
          <button onClick={handleShareWA}
            className="bg-green-500 hover:bg-green-400 text-white font-black text-base py-4 rounded-2xl shadow-xl transition flex items-center justify-center gap-2">
            💬 Bagikan WA
          </button>
          <button onClick={() => router.push(`/elkpd/guru/edit/${id}`)}
            className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-black text-base py-4 rounded-2xl shadow-xl transition flex items-center justify-center gap-2">
            ✏️ Edit Kegiatan
          </button>
        </div>
      </div>
      <p className="text-white/30 text-xs text-center py-4">created by dhickz666</p>
    </PageWrapper>
  )
}
