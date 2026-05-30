// src/app/(elkpd)/elkpd/guru/login/page.tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import PageWrapper from '@/components/elkpd/PageWrapper'
import { useAuth } from '@/hooks/useAuth'

export default function LoginGuru() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const { login, loading, error } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const ok = await login(username, password)
    if (ok) router.push('/elkpd/guru/dashboard')
  }

  return (
    <PageWrapper>
      <div className="flex flex-col items-center justify-center min-h-screen px-4 py-10">
        <div className="bg-white/15 backdrop-blur-lg border border-white/30 rounded-3xl shadow-2xl p-8 w-full max-w-sm">
          <div className="flex flex-col items-center mb-8">
            <img src="/logo.png" alt="Logo" className="h-16 w-16 object-contain mb-3" />
            <h1 className="text-white font-black text-xl text-center">Login Guru</h1>
            <p className="text-white/50 text-sm text-center mt-1">SMP Negeri 8 Probolinggo</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-white/80 text-sm font-semibold block mb-2">Username</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username..." required
                className="w-full bg-white/20 border border-white/30 text-white placeholder-white/40 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400" />
            </div>
            <div>
              <label className="text-white/80 text-sm font-semibold block mb-2">Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password..." required
                  className="w-full bg-white/20 border border-white/30 text-white placeholder-white/40 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-yellow-400" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white">
                  {showPass ? '🙈' : '👁'}
                </button>
              </div>
            </div>
            {error && <div className="bg-red-500/80 text-white text-sm rounded-xl px-4 py-2 text-center">❌ {error}</div>}
            <button type="submit" disabled={loading}
              className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 text-gray-900 font-black text-lg py-3 rounded-xl shadow-lg transition-all transform hover:scale-105">
              {loading ? '⏳ Masuk...' : '🔐 MASUK'}
            </button>
          </form>

          <button onClick={() => router.push('/elkpd')}
            className="w-full mt-4 text-white/50 hover:text-white text-sm text-center transition">
            ← Kembali ke Halaman Siswa
          </button>
        </div>
        <p className="text-white/30 text-xs mt-6">created by dhickz666</p>
      </div>
    </PageWrapper>
  )
}
