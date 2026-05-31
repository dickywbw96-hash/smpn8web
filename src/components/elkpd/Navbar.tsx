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
    <nav style={{
      width: '100%',
      padding: '12px 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: 'rgba(255,255,255,0.1)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255,255,255,0.2)',
      boxSizing: 'border-box',
    }}>
      {/* Logo + Judul */}
      <Link href="/elkpd" style={{ display:'flex', alignItems:'center', gap:12, textDecoration:'none' }}>
        <img src="/logo.png" alt="Logo SMPN 8" style={{ height:40, width:40, objectFit:'contain' }} />
        <div>
          <p style={{ color:'#fff', fontWeight:700, fontSize:13, lineHeight:1.3, margin:0 }}>LAMAN PEMBELAJARAN JARAK JAUH</p>
          <p style={{ color:'#fde047', fontWeight:600, fontSize:11, margin:0 }}>SMP NEGERI 8 PROBOLINGGO</p>
        </div>
      </Link>

      {/* Tombol kanan */}
      {guruNama ? (
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ color:'#fff', fontSize:13 }}>👤 {guruNama}</span>
          <button onClick={onLogout}
            style={{ background:'#ef4444', color:'#fff', fontSize:13, fontWeight:600, padding:'8px 16px', borderRadius:12, border:'none', cursor:'pointer' }}>
            Keluar
          </button>
        </div>
      ) : showGuruBtn ? (
        <button
          onClick={() => router.push('/elkpd/guru/login')}
          style={{ background:'#facc15', color:'#1a1a1a', fontWeight:700, fontSize:13, padding:'9px 18px', borderRadius:12, border:'none', cursor:'pointer', boxShadow:'0 4px 12px rgba(250,204,21,0.4)' }}>
          🔐 Login Guru
        </button>
      ) : null}
    </nav>
  )
}