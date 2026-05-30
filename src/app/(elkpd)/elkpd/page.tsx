// src/app/(elkpd)/elkpd/page.tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import PageWrapper from '@/components/elkpd/PageWrapper'
import NavbarElkpd from '@/components/elkpd/Navbar'
import { useToken } from '@/hooks/useToken'

export default function ElkpdDashboard() {
  const [token, setToken] = useState('')
  const [notif, setNotif] = useState<{ mapel: string; guru: string } | null>(null)
  const router = useRouter()
  const { validateToken, loading, error } = useToken()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token.trim()) return

    const data = await validateToken(token)
    if (data) {
      sessionStorage.setItem('kegiatan_aktif', JSON.stringify(data))
      sessionStorage.removeItem('siswa_identitas')
      setNotif({ mapel: data.guru?.mapel || 'Mata Pelajaran', guru: data.guru?.nama || 'Guru' })
      setTimeout(() => router.push('/elkpd/identitas'), 2200)
    }
  }

  return (
    <PageWrapper>
      <NavbarElkpd />
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-4 py-10">

        {notif && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-4 rounded-2xl shadow-2xl text-center animate-bounce-in">
            <p className="text-lg font-bold">✅ Token Valid!</p>
            <p className="text-sm mt-1">Mata Pelajaran: <strong>{notif.mapel}</strong></p>
            <p className="text-sm">Guru: <strong>{notif.guru}</strong></p>
          </div>
        )}

        <div className="bg-white/15 backdrop-blur-lg border border-white/30 rounded-3xl shadow-2xl p-8 w-full max-w-md">
          <div className="flex flex-col items-center mb-8">
            <img src="/logo.png" alt="Logo" className="h-20 w-20 object-contain mb-3" />
            <h1 className="text-white font-black text-xl text-center leading-tight">
              LAMAN PEMBELAJARAN<br />JARAK JAUH
            </h1>
            <p className="text-yellow-300 font-bold text-sm mt-1 text-center">SMP NEGERI 8 PROBOLINGGO</p>
            <div className="mt-2 h-0.5 w-24 bg-yellow-300 rounded" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-white/90 text-sm font-semibold block mb-2">🔑 Masukkan TOKEN dari Gurumu</label>
              <input type="text" value={token} onChange={(e) => setToken(e.target.value.toUpperCase())}
                placeholder="Contoh: A3B7K2X9" maxLength={8}
                className="w-full bg-white/20 border border-white/40 text-white placeholder-white/50 rounded-xl px-4 py-3 text-center text-2xl font-black tracking-[0.3em] focus:outline-none focus:ring-2 focus:ring-yellow-400 uppercase" />
            </div>
            {error && <div className="bg-red-500/80 text-white text-sm rounded-xl px-4 py-2 text-center">❌ {error}</div>}
            <button type="submit" disabled={loading || !token.trim()}
              className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 text-gray-900 font-black text-lg py-3 rounded-xl shadow-lg transition-all transform hover:scale-105 active:scale-95">
              {loading ? '⏳ Memverifikasi...' : '🚀 MASUK'}
            </button>
          </form>
          <p className="text-white/50 text-xs text-center mt-6">Token didapatkan dari guru mata pelajaran</p>
        </div>

        <p className="text-white/40 text-xs mt-8">created by dhickz666</p>
      </div>
    </PageWrapper>
  )
}
