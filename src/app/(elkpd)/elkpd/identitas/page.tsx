// src/app/(elkpd)/elkpd/identitas/page.tsx
'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import PageWrapper from '@/components/elkpd/PageWrapper'

const KELAS_OPTIONS: Record<string, string[]> = {
  '7': ['7.1', '7.2', '7.3', '7.4', '7.5', '7.6'],
  '8': ['8.1', '8.2', '8.3', '8.4', '8.5', '8.6'],
  '9': ['9.1', '9.2', '9.3', '9.4', '9.5', '9.6'],
}

export default function IdentitasSiswa() {
  const router = useRouter()
  const [kegiatan, setKegiatan] = useState<any>(null)
  const [tingkat, setTingkat] = useState('')
  const [kelas, setKelas] = useState('')
  const [nama, setNama] = useState('')

  useEffect(() => {
    const saved = sessionStorage.getItem('kegiatan_aktif')
    if (!saved) { router.push('/elkpd'); return }
    setKegiatan(JSON.parse(saved))
  }, [router])

  const handleTingkat = (t: string) => { setTingkat(t); setKelas('') }
  const handleKelas = (k: string) => setKelas(k)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!nama.trim()) return
    sessionStorage.setItem('siswa_identitas', JSON.stringify({ tingkat, kelas, nama: nama.trim() }))
    router.push('/elkpd/materi')
  }

  if (!kegiatan) return null

  return (
    <PageWrapper>
      <div className="flex flex-col items-center justify-center min-h-screen px-4 py-10">
        <div className="bg-white/15 backdrop-blur-lg border border-white/30 rounded-3xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-green-500/30 border border-green-400/50 rounded-full px-4 py-1 mb-3">
              <span className="text-green-300 text-sm font-bold">📚 {kegiatan.guru?.mapel}</span>
            </div>
            <h2 className="text-white font-black text-xl">Siapa kamu?</h2>
            <p className="text-white/60 text-sm mt-1">Isi datamu sebelum mulai belajar</p>
          </div>

          {/* Pilih Tingkat */}
          <div className="mb-4">
            <label className="text-white/80 text-sm font-semibold block mb-2">Tingkat Kelas</label>
            <div className="grid grid-cols-3 gap-3">
              {['7', '8', '9'].map((t) => (
                <button key={t} type="button" onClick={() => handleTingkat(t)}
                  className={`py-3 rounded-xl font-black text-lg transition-all ${tingkat === t ? 'bg-yellow-400 text-gray-900 shadow-lg scale-105' : 'bg-white/20 text-white hover:bg-white/30'}`}>
                  Kelas {t}
                </button>
              ))}
            </div>
          </div>

          {/* Pilih Kelas */}
          {tingkat && (
            <div className="mb-4 animate-fade-in">
              <label className="text-white/80 text-sm font-semibold block mb-2">Pilih Kelas</label>
              <div className="grid grid-cols-3 gap-2">
                {KELAS_OPTIONS[tingkat].map((k) => (
                  <button key={k} type="button" onClick={() => handleKelas(k)}
                    className={`py-2.5 rounded-xl font-bold text-sm transition-all ${kelas === k ? 'bg-yellow-400 text-gray-900 shadow-lg scale-105' : 'bg-white/20 text-white hover:bg-white/30'}`}>
                    {k}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Nama */}
          {kelas && (
            <form onSubmit={handleSubmit} className="animate-fade-in">
              <div className="mb-4">
                <label className="text-white/80 text-sm font-semibold block mb-2">Nama Lengkapmu</label>
                <input type="text" value={nama} onChange={(e) => setNama(e.target.value)}
                  placeholder="Tulis nama lengkapmu di sini..." autoFocus
                  className="w-full bg-white/20 border border-white/40 text-white placeholder-white/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400" />
              </div>
              <button type="submit" disabled={!nama.trim()}
                className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 text-gray-900 font-black text-lg py-3 rounded-xl shadow-lg transition-all transform hover:scale-105">
                ✅ MULAI BELAJAR!
              </button>
            </form>
          )}

          <div className="mt-4 bg-blue-500/20 border border-blue-400/30 rounded-xl p-3 text-center">
            <p className="text-blue-200 text-xs">👨‍🏫 Guru: <strong>{kegiatan.guru?.nama}</strong></p>
          </div>
        </div>
        <p className="text-white/40 text-xs mt-6">created by dhickz666</p>
      </div>
    </PageWrapper>
  )
}
