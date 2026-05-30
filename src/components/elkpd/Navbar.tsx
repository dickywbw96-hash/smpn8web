// src/components/elkpd/Navbar.tsx
'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface NavbarProps {
  showGuruBtn?: boolean
  guruNama?: string | null
  onLogout?: () => void
}

export default function NavbarElkpd({ showGuruBtn = true, guruNama = null, onLogout }: NavbarProps) {
  const router = useRouter()

  return (
    <nav className="w-full px-4 py-3 flex items-center justify-between bg-white/10 backdrop-blur-md border-b border-white/20">
      {/* Logo + Judul */}
      <Link href="/elkpd" className="flex items-center gap-3">
        <img src="/logo.png" alt="Logo SMPN 8" className="h-10 w-10 object-contain" />
        <div className="hidden sm:block">
          <p className="text-white font-bold text-sm leading-tight">LAMAN PEMBELAJARAN JARAK JAUH</p>
          <p className="text-yellow-300 font-semibold text-xs">SMP NEGERI 8 PROBOLINGGO</p>
        </div>
      </Link>

      {/* Tombol Login Guru / Info Guru */}
      {guruNama ? (
        <div className="flex items-center gap-2">
          <span className="text-white text-sm hidden sm:block">👤 {guruNama}</span>
          <button
            onClick={onLogout}
            className="bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition"
          >
            Keluar
          </button>
        </div>
      ) : showGuruBtn ? (
        <button
          onClick={() => router.push('/elkpd/guru/login')}
          className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold text-sm px-5 py-2 rounded-xl shadow-lg transition-all transform hover:scale-105"
        >
          🔐 Login Guru
        </button>
      ) : null}
    </nav>
  )
}
