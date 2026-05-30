// src/app/(elkpd)/elkpd/guru/dashboard/page.tsx
'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import PageWrapper from '@/components/elkpd/PageWrapper'
import NavbarElkpd from '@/components/elkpd/Navbar'
import { useAuth } from '@/hooks/useAuth'

export default function DashboardGuru() {
  const router = useRouter()
  const { guru, logout } = useAuth()

  useEffect(() => {
    if (!guru) router.push('/elkpd/guru/login')
  }, [guru, router])

  if (!guru) return null

  const handleLogout = () => { logout(); router.push('/elkpd') }

  return (
    <PageWrapper>
      <NavbarElkpd guruNama={guru.nama} onLogout={handleLogout} showGuruBtn={false} />
      <div className="max-w-lg mx-auto px-4 py-10 flex flex-col items-center">

        <div className="text-center mb-8">
          <div className="text-5xl mb-3">👩‍🏫</div>
          <h1 className="text-white font-black text-2xl">Halo, {guru.nama.split(',')[0]}!</h1>
          <div className="inline-flex items-center gap-2 bg-yellow-400/20 border border-yellow-400/40 rounded-full px-4 py-1.5 mt-2">
            <span className="text-yellow-300 font-bold text-sm">📚 {guru.mapel}</span>
          </div>
          <p className="text-white/50 text-sm mt-2">Selamat datang di panel guru LKPD Digital</p>
        </div>

        <div className="w-full grid grid-cols-1 gap-4">
          <button onClick={() => router.push('/elkpd/guru/kegiatan')}
            className="group bg-gradient-to-br from-yellow-400/20 to-orange-400/20 hover:from-yellow-400/40 hover:to-orange-400/40 border-2 border-yellow-400/50 rounded-3xl p-6 text-left transition-all transform hover:scale-[1.02] shadow-xl">
            <div className="flex items-center gap-4">
              <div className="bg-yellow-400/30 rounded-2xl p-3 text-3xl group-hover:scale-110 transition">📝</div>
              <div>
                <h2 className="text-white font-black text-xl">Siapkan Kegiatan</h2>
                <p className="text-white/60 text-sm mt-1">Buat materi, soal LKPD, dan dapatkan token untuk siswa</p>
              </div>
            </div>
          </button>

          <button onClick={() => router.push('/elkpd/guru/hasil')}
            className="group bg-gradient-to-br from-green-400/20 to-teal-400/20 hover:from-green-400/40 hover:to-teal-400/40 border-2 border-green-400/50 rounded-3xl p-6 text-left transition-all transform hover:scale-[1.02] shadow-xl">
            <div className="flex items-center gap-4">
              <div className="bg-green-400/30 rounded-2xl p-3 text-3xl group-hover:scale-110 transition">📊</div>
              <div>
                <h2 className="text-white font-black text-xl">Lihat Hasil</h2>
                <p className="text-white/60 text-sm mt-1">Rekap nilai siswa, beri skor uraian, dan unduh laporan</p>
              </div>
            </div>
          </button>
        </div>

        <div className="mt-8 bg-white/10 border border-white/20 rounded-2xl p-4 w-full text-center">
          <p className="text-white/60 text-xs">
            Mapel: <strong className="text-white">{guru.mapel}</strong> &nbsp;|&nbsp; Guru: <strong className="text-white">{guru.nama}</strong>
          </p>
        </div>
      </div>
      <p className="text-white/30 text-xs text-center py-4">created by dhickz666</p>
    </PageWrapper>
  )
}
