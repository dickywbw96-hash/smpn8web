// src/app/(elkpd)/elkpd/guru/login/page.tsx
'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import PageWrapper from '@/components/elkpd/PageWrapper'
import NavbarElkpd from '@/components/elkpd/Navbar'
import { useAuth } from '@/hooks/useAuth'
import { useAdminAuth } from '@/hooks/useAdminAuth'

function WelcomeCard({ data, role, onClose }: { data: any; role: string; onClose: () => void }) {
  const [visible, setVisible] = useState(false)
  const [progress, setProgress] = useState(100)
  const isGuru = role === 'guru'
  useEffect(() => { setTimeout(() => setVisible(true), 10) }, [])
  useEffect(() => {
    const dur = 3000, interval = 30, step = (interval/dur)*100
    const timer = setInterval(() => setProgress(p => { if (p <= 0) { clearInterval(timer); return 0 } return p - step }), interval)
    const close = setTimeout(() => { setVisible(false); setTimeout(onClose, 400) }, dur)
    return () => { clearInterval(timer); clearTimeout(close) }
  }, [])
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.55)', backdropFilter:'blur(6px)', zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center', padding:16, opacity: visible ? 1 : 0, transition:'opacity 0.4s ease' }}>
      <div style={{ width:'100%', maxWidth:380, background:'linear-gradient(145deg,#0f172a,#1e3a5f)', border:'1px solid rgba(56,189,248,0.35)', borderRadius:28, padding:'32px 28px 24px', boxShadow:'0 30px 80px rgba(0,0,0,0.5)', transform: visible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)', transition:'transform 0.45s cubic-bezier(0.22,1,0.36,1)', position:'relative', overflow:'hidden' }}>
        <div style={{ textAlign:'center', marginBottom:20 }}>
          <div style={{ fontSize:48, marginBottom:12 }}>{isGuru ? '👨‍🏫' : '🛡️'}</div>
          <p style={{ color:'rgba(148,163,184,0.8)', fontSize:13, margin:'0 0 6px' }}>Selamat datang kembali 👋</p>
          <h2 style={{ color:'#f1f5f9', fontSize:22, fontWeight:900, margin:'0 0 4px' }}>{isGuru ? data.nama : data.username}</h2>
          {isGuru && <div style={{ display:'inline-flex', gap:6, background:'rgba(56,189,248,0.1)', border:'1px solid rgba(56,189,248,0.25)', borderRadius:10, padding:'5px 14px', marginTop:8 }}><span>📚</span><span style={{ color:'#7dd3fc', fontWeight:700, fontSize:13 }}>{data.mapel}</span></div>}
        </div>
        <div style={{ background:'rgba(255,255,255,0.07)', borderRadius:99, height:4, overflow:'hidden', marginBottom:12 }}>
          <div style={{ height:'100%', borderRadius:99, background: isGuru ? 'linear-gradient(90deg,#FACC15,#F59E0B)' : 'linear-gradient(90deg,#6366f1,#8b5cf6)', width:`${progress}%`, transition:'width 0.03s linear' }} />
        </div>
        <p style={{ color:'rgba(100,116,139,0.8)', fontSize:11, textAlign:'center', margin:0 }}>Mengalihkan ke dashboard...</p>
        <button onClick={() => { setVisible(false); setTimeout(onClose, 400) }} style={{ position:'absolute', top:16, right:16, background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.12)', color:'rgba(255,255,255,0.4)', borderRadius:8, width:28, height:28, cursor:'pointer', fontSize:14, display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
      </div>
    </div>
  )
}

export default function LoginPage() {
  const router = useRouter()
  const [tab, setTab] = useState<'guru' | 'admin'>('guru')
  const [welcome, setWelcome] = useState<{ data: any; role: string; dest: string } | null>(null)
  const [showGuruPass, setShowGuruPass] = useState(false)
  const [showAdminPass, setShowAdminPass] = useState(false)
  const [guruU, setGuruU] = useState(''); const [guruP, setGuruP] = useState('')
  const [adminU, setAdminU] = useState(''); const [adminP, setAdminP] = useState('')

  const { guru, login: guruLogin, loading: gL, error: gE } = useAuth()
  const { admin, login: adminLogin, loading: aL, error: aE } = useAdminAuth()

  useEffect(() => { if (guru && !welcome) router.push('/elkpd/guru/dashboard') }, [guru])
  useEffect(() => { if (admin && !welcome) router.push('/elkpd/admin/dashboard') }, [admin])

  const handleGuru = async (e: React.FormEvent) => {
    e.preventDefault()
    const ok = await guruLogin(guruU, guruP)
    if (ok) {
      const s = JSON.parse(localStorage.getItem('guru_session') || '{}')
      setWelcome({ data: s, role: 'guru', dest: '/elkpd/guru/dashboard' })
    }
  }
  const handleAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    const ok = await adminLogin(adminU, adminP)
    if (ok) {
      const s = JSON.parse(localStorage.getItem('admin_session') || '{}')
      setWelcome({ data: s, role: 'admin', dest: '/elkpd/admin/dashboard' })
    }
  }

  const inp = { width:'100%', boxSizing:'border-box' as const, background:'rgba(0,0,0,0.25)', border:'2px solid rgba(255,255,255,0.15)', color:'#fff', borderRadius:14, padding:'13px 16px', fontSize:15, fontWeight:600, transition:'all 0.2s ease', caretColor:'#FACC15', outline:'none' }

  return (
    <PageWrapper>
      {welcome && <WelcomeCard data={welcome.data} role={welcome.role} onClose={() => { setWelcome(null); router.push(welcome.dest) }} />}
      <NavbarElkpd showGuruBtn={false} />
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}@keyframes spinRing{to{transform:rotate(360deg)}}.card-enter{animation:fadeUp 0.55s cubic-bezier(0.22,1,0.36,1) both}.logo-float{animation:float 3.5s ease-in-out infinite}`}</style>
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'calc(100vh - 64px)', padding:'20px 16px 40px', boxSizing:'border-box' }}>
        <div className="main-card card-enter" style={{ background:'rgba(255,255,255,0.12)', backdropFilter:'blur(20px)', border:'1px solid rgba(255,255,255,0.25)', borderRadius:28, padding:'32px 24px', width:'100%', maxWidth:400, boxSizing:'border-box', boxShadow:'0 20px 60px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)' }}>

          {/* Logo */}
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', marginBottom:24 }}>
            <div className="logo-float" style={{ marginBottom:14 }}>
              <img src="/logo.png" alt="Logo" style={{ width:72, height:72, objectFit:'contain', filter:'drop-shadow(0 4px 16px rgba(0,0,0,0.3))' }} />
            </div>
            <h1 style={{ color:'#fff', fontWeight:900, fontSize:17, textAlign:'center', lineHeight:1.35, margin:'0 0 6px' }}>LKPD DIGITAL</h1>
            <p style={{ color:'#FACC15', fontWeight:800, fontSize:12, textAlign:'center', margin:'0 0 12px', letterSpacing:'0.08em' }}>SMP NEGERI 8 PROBOLINGGO</p>
            <div style={{ width:48, height:3, borderRadius:4, background:'linear-gradient(90deg,#FACC15,#F59E0B)' }} />
          </div>

          {/* Tab */}
          <div style={{ display:'flex', gap:6, background:'rgba(0,0,0,0.2)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:16, padding:4, marginBottom:20 }}>
            {(['guru','admin'] as const).map(t => (
              <button key={t} type="button" onClick={() => setTab(t)} style={{ flex:1, padding:'10px 8px', borderRadius:12, border:'none', background: tab===t ? (t==='guru' ? 'linear-gradient(135deg,#FACC15,#F59E0B)' : 'linear-gradient(135deg,#6366f1,#8b5cf6)') : 'transparent', color: tab===t ? (t==='guru' ? '#1a1a00' : '#fff') : 'rgba(255,255,255,0.5)', fontWeight:800, fontSize:13, cursor:'pointer', transition:'all 0.22s', display:'flex', alignItems:'center', justifyContent:'center', gap:6, WebkitTapHighlightColor:'transparent' }}>
                {t === 'guru' ? '📚 Login Guru' : '🛡️ Login Admin'}
              </button>
            ))}
          </div>

          {/* Panel Guru */}
          {tab === 'guru' && (
            <form onSubmit={handleGuru} noValidate style={{ animation:'fadeUp 0.3s ease both' }}>
              <label style={{ color:'rgba(255,255,255,0.85)', fontSize:13, fontWeight:700, display:'block', marginBottom:8 }}>👤 Username</label>
              <input {...inp as any} value={guruU} onChange={e => setGuruU(e.target.value)} placeholder="Masukkan username..." style={{ ...inp, marginBottom:14 }} />
              <label style={{ color:'rgba(255,255,255,0.85)', fontSize:13, fontWeight:700, display:'block', marginBottom:8 }}>🔒 Password</label>
              <div style={{ position:'relative', marginBottom:16 }}>
                <input type={showGuruPass?'text':'password'} value={guruP} onChange={e => setGuruP(e.target.value)} placeholder="Masukkan password..." style={{ ...inp, paddingRight:48 }} />
                <button type="button" onClick={() => setShowGuruPass(p=>!p)} style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', fontSize:18, color:'rgba(255,255,255,0.5)' }}>{showGuruPass ? '🙈' : '👁️'}</button>
              </div>
              {gE && <div style={{ background:'rgba(239,68,68,0.85)', color:'#fff', fontSize:13, borderRadius:12, padding:'10px 14px', textAlign:'center', marginBottom:14, fontWeight:600 }}>❌ {gE}</div>}
              <button type="submit" disabled={gL || !guruU.trim() || !guruP.trim()} style={{ width:'100%', background: gL ? 'rgba(250,204,21,0.7)' : 'linear-gradient(135deg,#FACC15,#F59E0B)', color:'#1a1a1a', fontWeight:900, fontSize:17, padding:15, borderRadius:16, border:'none', cursor:'pointer', transition:'all 0.2s', opacity: (gL || !guruU.trim() || !guruP.trim()) ? 0.5 : 1 }}>
                {gL ? '⏳ Memverifikasi...' : '🔐 MASUK SEBAGAI GURU'}
              </button>
            </form>
          )}

          {/* Panel Admin */}
          {tab === 'admin' && (
            <form onSubmit={handleAdmin} noValidate style={{ animation:'fadeUp 0.3s ease both' }}>
              <label style={{ color:'rgba(255,255,255,0.85)', fontSize:13, fontWeight:700, display:'block', marginBottom:8 }}>👤 NIP Admin</label>
              <input inputMode="numeric" value={adminU} onChange={e => setAdminU(e.target.value.replace(/\D/g,''))} placeholder="Masukkan NIP" style={{ ...inp, marginBottom:14, letterSpacing:'0.05em' }} />
              <label style={{ color:'rgba(255,255,255,0.85)', fontSize:13, fontWeight:700, display:'block', marginBottom:8 }}>🔒 Password</label>
              <div style={{ position:'relative', marginBottom:16 }}>
                <input type={showAdminPass?'text':'password'} value={adminP} onChange={e => setAdminP(e.target.value)} placeholder="Masukkan password" style={{ ...inp, paddingRight:48 }} />
                <button type="button" onClick={() => setShowAdminPass(p=>!p)} style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', fontSize:18, color:'rgba(255,255,255,0.5)' }}>{showAdminPass ? '🙈' : '👁️'}</button>
              </div>
              {aE && <div style={{ background:'rgba(239,68,68,0.85)', color:'#fff', fontSize:13, borderRadius:12, padding:'10px 14px', textAlign:'center', marginBottom:14, fontWeight:600 }}>❌ {aE}</div>}
              <button type="submit" disabled={aL || !adminU.trim() || !adminP.trim()} style={{ width:'100%', background: aL ? 'rgba(99,102,241,0.7)' : 'linear-gradient(135deg,#6366f1,#8b5cf6)', color:'#fff', fontWeight:900, fontSize:17, padding:15, borderRadius:16, border:'none', cursor:'pointer', transition:'all 0.2s', opacity: (aL || !adminU.trim() || !adminP.trim()) ? 0.5 : 1 }}>
                {aL ? '⏳ Memverifikasi...' : '🛡️ MASUK SEBAGAI ADMIN'}
              </button>
            </form>
          )}
        </div>
        <p style={{ color:'rgba(255,255,255,0.2)', fontSize:11, marginTop:24 }}>created by dhickz666</p>
      </div>
    </PageWrapper>
  )
}
