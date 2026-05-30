// src/app/(elkpd)/elkpd/guru/hasil/page.tsx
'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import PageWrapper from '@/components/elkpd/PageWrapper'
import NavbarElkpd from '@/components/elkpd/Navbar'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase-elkpd'

export default function LihatHasil() {
  const router = useRouter()
  const { guru, logout } = useAuth()
  const [kegiatanList, setKegiatanList] = useState<any[]>([])
  const [selected, setSelected] = useState<any>(null)
  const [jawabanList, setJawabanList] = useState<any[]>([])
  const [loadingK, setLoadingK] = useState(true)
  const [loadingJ, setLoadingJ] = useState(false)
  const [editSkor, setEditSkor] = useState<Record<string, any>>({})

  useEffect(() => {
    if (!guru) { router.push('/elkpd/guru/login'); return }
    fetchKegiatan()
  }, [guru, router])

  const fetchKegiatan = async () => {
    setLoadingK(true)
    const { data } = await supabase.from('kegiatan').select('*').eq('guru_id', guru.id).order('created_at', { ascending: false })
    setKegiatanList(data || [])
    setLoadingK(false)
  }

  const fetchJawaban = async (kegiatan: any) => {
    setSelected(kegiatan); setLoadingJ(true)
    const { data } = await supabase.from('jawaban_siswa').select('*').eq('kegiatan_id', kegiatan.id).order('submitted_at', { ascending: false })
    setJawabanList(data || []); setEditSkor({}); setLoadingJ(false)
  }

  const simpanSkorUraian = async (jawaban: any) => {
    const skorUraian = Number(editSkor[jawaban.id] ?? jawaban.skor_uraian ?? 0)
    const total = (jawaban.skor_otomatis || 0) + skorUraian
    await supabase.from('jawaban_siswa').update({ skor_uraian: skorUraian, skor_total: total }).eq('id', jawaban.id)
    fetchJawaban(selected)
  }

  const getUraianSoal = (soalData: any[]) => soalData?.filter((s) => s.tipe === 'uraian') || []

  if (!guru) return null

  return (
    <PageWrapper>
      <NavbarElkpd guruNama={guru.nama} onLogout={() => { logout(); router.push('/elkpd') }} showGuruBtn={false} />
      <div className="max-w-2xl mx-auto px-4 py-6">

        <div className="flex items-center gap-3 mb-5">
          <button onClick={() => selected ? setSelected(null) : router.push('/elkpd/guru/dashboard')}
            className="bg-white/20 hover:bg-white/30 text-white rounded-xl px-3 py-2 text-sm transition">←</button>
          <div>
            <h1 className="text-white font-black text-xl">{selected ? `Hasil: ${selected.judul}` : 'Lihat Hasil'}</h1>
            <p className="text-white/50 text-sm">{guru.mapel}</p>
          </div>
        </div>

        {/* Daftar Kegiatan */}
        {!selected && (
          <div className="space-y-3">
            {loadingK && <div className="text-center text-white/50 py-8">⏳ Memuat data...</div>}
            {!loadingK && kegiatanList.length === 0 && (
              <div className="text-center text-white/40 py-8"><p className="text-3xl mb-2">📭</p><p>Belum ada kegiatan yang dibuat</p></div>
            )}
            {kegiatanList.map((k) => (
              <button key={k.id} onClick={() => fetchJawaban(k)}
                className="w-full bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl p-4 text-left transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-bold">{k.judul}</p>
                    <p className="text-white/50 text-xs mt-1">Token: <strong className="text-yellow-300">{k.token}</strong> — {new Date(k.created_at).toLocaleDateString('id-ID')}</p>
                  </div>
                  <div className="text-white/40">▶</div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Detail Jawaban */}
        {selected && (
          <div className="space-y-4">
            <div className="bg-blue-500/20 border border-blue-400/30 rounded-2xl p-4">
              <p className="text-white font-bold">{selected.judul}</p>
              <p className="text-blue-300 text-sm mt-1">Token: <strong>{selected.token}</strong> — {jawabanList.length} siswa mengerjakan</p>
            </div>
            {loadingJ && <div className="text-center text-white/50 py-8">⏳ Memuat...</div>}
            {!loadingJ && jawabanList.length === 0 && (
              <div className="text-center text-white/40 py-8"><p className="text-3xl mb-2">📭</p><p>Belum ada siswa yang mengerjakan</p></div>
            )}
            {jawabanList.map((j, idx) => {
              const uraianSoal = getUraianSoal(selected.soal_data)
              return (
                <div key={j.id} className="bg-white/10 border border-white/20 rounded-2xl p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-white font-bold">{idx + 1}. {j.nama}</p>
                      <p className="text-white/50 text-xs">Kelas {j.kelas}</p>
                      <p className="text-white/40 text-xs">{new Date(j.submitted_at).toLocaleString('id-ID')}</p>
                    </div>
                    <div className="text-right">
                      <div className="bg-yellow-400/20 border border-yellow-400/40 rounded-xl px-3 py-1">
                        <p className="text-yellow-300 text-xs">Total Skor</p>
                        <p className="text-white font-black text-2xl">{j.skor_total ?? j.skor_otomatis}</p>
                      </div>
                      <p className="text-white/40 text-xs mt-1">Otomatis: {j.skor_otomatis}</p>
                    </div>
                  </div>
                  {uraianSoal.length > 0 && (
                    <div className="mt-3 space-y-3 border-t border-white/10 pt-3">
                      <p className="text-orange-300 text-xs font-bold">✍ Soal Uraian — Beri Nilai:</p>
                      {uraianSoal.map((soal: any) => (
                        <div key={soal.id} className="bg-white/10 rounded-xl p-3">
                          <p className="text-white/70 text-xs font-bold mb-1">{soal.pertanyaan}</p>
                          <p className="text-white text-sm bg-white/10 rounded-lg p-2 mb-2">{j.jawaban_data?.[soal.id] || '(kosong)'}</p>
                        </div>
                      ))}
                      <div className="flex items-center gap-3">
                        <label className="text-white/70 text-xs">Skor Uraian:</label>
                        <input type="number" min={0} value={editSkor[j.id] ?? j.skor_uraian ?? ''}
                          onChange={(e) => setEditSkor((prev) => ({ ...prev, [j.id]: e.target.value }))}
                          placeholder="0"
                          className="w-20 bg-white/20 border border-white/30 text-white rounded-lg px-3 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-orange-400" />
                        <button onClick={() => simpanSkorUraian(j)}
                          className="bg-orange-400 hover:bg-orange-300 text-gray-900 font-bold text-xs px-4 py-1.5 rounded-lg transition">
                          💾 Simpan
                        </button>
                      </div>
                    </div>
                  )}
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
