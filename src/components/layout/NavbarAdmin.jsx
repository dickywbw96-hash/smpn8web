// components/layout/NavbarAdmin.jsx
import { useNavigate } from 'react-router-dom'
import NotificationBell from './NotificationBell'

export default function NavbarAdmin({ adminName = null }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('admin_session')
    navigate('/login')
  }

  return (
    <nav className="w-full px-4 py-3 flex items-center justify-between bg-white/10 backdrop-blur-md border-b border-white/20">
      <div className="flex items-center gap-3">
        <img src="/logo.png" alt="Logo SMPN 8" className="h-10 w-10 object-contain" />
        <div className="hidden sm:block">
          <p className="text-white font-bold text-sm leading-tight">LAMAN PEMBELAJARAN JARAK JAUH</p>
          <p className="text-yellow-300 font-semibold text-xs">SMP NEGERI 8 PROBOLINGGO</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {adminName && (
          <span className="text-white text-sm hidden sm:block">👤 {adminName}</span>
        )}

        {/* 🔔 Notifikasi API Key */}
        <NotificationBell />

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition"
        >
          Keluar
        </button>
      </div>
    </nav>
  )
}