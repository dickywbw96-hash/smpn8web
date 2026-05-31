// src/app/(elkpd)/elkpd/page.tsx
'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import PageWrapper from '@/components/elkpd/PageWrapper'
import NavbarElkpd from '@/components/elkpd/Navbar'
import { useToken } from '@/hooks/useToken'

function LoadingOverlay({ visible }: { visible: boolean }) {
  if (!visible) return null
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'fadeInOverlay 0.35s ease',
      }}
    >
      <style>{`
        @keyframes fadeInOverlay { from { opacity:0; } to { opacity:1; } }
        @keyframes spinRing { 0% { transform:rotate(0deg); } 100% { transform:rotate(360deg); } }
        @keyframes pulse-dot { 0%,80%,100% { transform:scale(0.6); opacity:0.4; } 40% { transform:scale(1); opacity:1; } }
      `}</style>
      <div style={{ position: 'relative', width: 72, height: 72, marginBottom: 24 }}>
        <div style={{ position:'absolute', inset:0, border:'3px solid rgba(255,255,255,0.1)', borderTopColor:'#FACC15', borderRadius:'50%', animation:'spinRing 0.9s linear infinite' }} />
        <div style={{ position:'absolute', inset:8, border:'2px solid rgba(255,255,255,0.05)', borderBottomColor:'#60A5FA', borderRadius:'50%', animation:'spinRing 1.3s linear infinite reverse' }} />
        <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24 }}>🎒</div>
      </div>
      <div style={{ display:'flex', gap:8, marginBottom:16 }}>
        {[0,1,2].map(i => (
          <div key={i} style={{ width:8, height:8, borderRadius:'50%', background:'#FACC15', animation:`pulse-dot 1.2s ease-in-out infinite`, animationDelay:`${i*0.2}s` }} />
        ))}
      </div>
      <p style={{ color:'rgba(255,255,255,0.85)', fontSize:15, fontWeight:600, letterSpacing:'0.05em' }}>Menyiapkan sesi belajarmu...</p>
      <p style={{ color:'rgba(255,255,255,0.45)', fontSize:12, marginTop:6 }}>Mohon tunggu sebentar</p>
    </div>
  )
}

export default function ElkpdDashboard() {
  const [token, setToken] = useState('')
  const [loadingOverlay, setLoadingOverlay] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const { validateToken, loading, error } = useToken()

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50)
    return () => clearTimeout(t)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token.trim()) return

    const data = await validateToken(token)
    if (data) {
      sessionStorage.setItem('kegiatan_aktif', JSON.stringify(data))
      sessionStorage.removeItem('siswa_identitas')
      setLoadingOverlay(true)
      setTimeout(() => router.push('/elkpd/identitas'), 800)
    }
  }

  const chars = token.padEnd(8, '').split('')

  return (
    <PageWrapper>
      <LoadingOverlay visible={loadingOverlay} />
      <NavbarElkpd />

      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
        @keyframes shimmer { 0% { background-position:-200% center; } 100% { background-position:200% center; } }
        @keyframes float { 0%,100% { transform:translateY(0px); } 50% { transform:translateY(-6px); } }
        @keyframes spinRing { 0% { transform:rotate(0deg); } 100% { transform:rotate(360deg); } }
        .token-input:focus { outline:none; border-color:rgba(250,204,21,0.8) !important; box-shadow:0 0 0 3px rgba(250,204,21,0.2), 0 0 20px rgba(250,204,21,0.1) !important; }
        .submit-btn:not(:disabled):hover { transform:translateY(-2px); box-shadow:0 8px 25px rgba(250,204,21,0.4) !important; }
        .submit-btn:not(:disabled):active { transform:translateY(0) scale(0.98); }
        .submit-btn:disabled { opacity:0.5; cursor:not-allowed; }
        .card-enter { animation: fadeUp 0.55s cubic-bezier(0.22,1,0.36,1) both; }
        .logo-float { animation: float 3.5s ease-in-out infinite; }
      `}</style>

      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'calc(100vh - 64px)', padding:'20px 16px 40px', boxSizing:'border-box' }}>
        <div className="main-card card-enter" style={{ background:'rgba(255,255,255,0.12)', backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)', border:'1px solid rgba(255,255,255,0.25)', borderRadius:28, padding:'32px 24px', width:'100%', maxWidth:400, boxSizing:'border-box', boxShadow:'0 20px 60px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)' }}>

          {/* Header */}
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', marginBottom:28 }}>
            <div className="logo-float" style={{ marginBottom:14 }}>
              <img src="/logo.png" alt="Logo SMP Negeri 8 Probolinggo" style={{ width:80, height:80, objectFit:'contain', filter:'drop-shadow(0 4px 16px rgba(0,0,0,0.3))' }} />
            </div>
            <h1 style={{ color:'#fff', fontWeight:900, fontSize:18, textAlign:'center', lineHeight:1.35, margin:'0 0 6px', letterSpacing:'0.02em', textShadow:'0 2px 8px rgba(0,0,0,0.3)' }}>
              LAMAN PEMBELAJARAN<br />JARAK JAUH
            </h1>
            <p style={{ background:'linear-gradient(90deg,#FACC15,#FDE68A,#FACC15)', backgroundSize:'200% auto', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', animation:'shimmer 3s linear infinite', fontWeight:800, fontSize:13, textAlign:'center', margin:'0 0 12px', letterSpacing:'0.08em' }}>
              SMP NEGERI 8 PROBOLINGGO
            </p>
            <div style={{ width:48, height:3, borderRadius:4, background:'linear-gradient(90deg,#FACC15,#F59E0B)' }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate>
            <label style={{ color:'rgba(255,255,255,0.9)', fontSize:13, fontWeight:700, display:'block', marginBottom:10, letterSpacing:'0.03em' }}>
              🔑 Masukkan TOKEN dari Gurumu
            </label>

            <input
              type="text"
              inputMode="text"
              autoCapitalize="characters"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              className="token-input"
              value={token}
              onChange={(e) => setToken(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8))}
              placeholder="Contoh: A3B7K2X9"
              maxLength={8}
              style={{ width:'100%', boxSizing:'border-box', background:'rgba(0,0,0,0.25)', border:'2px solid rgba(255,255,255,0.2)', color:'#fff', borderRadius:16, padding:'14px 16px', textAlign:'center', fontSize:28, fontWeight:900, letterSpacing:'0.35em', transition:'all 0.2s ease', caretColor:'#FACC15' }}
            />

            {/* Karakter progress */}
            <div style={{ display:'flex', gap:5, justifyContent:'center', marginTop:10, marginBottom:16 }}>
              {chars.map((c, i) => (
                <div key={i} style={{ width:28, height:4, borderRadius:4, background: c.trim() ? 'rgba(250,204,21,0.9)' : 'rgba(255,255,255,0.15)', transition:'background 0.2s ease', flexShrink:0 }} />
              ))}
            </div>

            {error && (
              <div style={{ background:'rgba(239,68,68,0.85)', backdropFilter:'blur(8px)', color:'#fff', fontSize:13, borderRadius:12, padding:'10px 14px', textAlign:'center', marginBottom:14, fontWeight:600, border:'1px solid rgba(239,68,68,0.5)', animation:'fadeUp 0.25s ease both' }}>
                ❌ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || token.trim().length < 1}
              className="submit-btn"
              style={{ width:'100%', background: loading ? 'rgba(250,204,21,0.7)' : 'linear-gradient(135deg,#FACC15 0%,#F59E0B 100%)', color:'#1a1a1a', fontWeight:900, fontSize:17, padding:'15px', borderRadius:16, border:'none', cursor:'pointer', transition:'all 0.2s cubic-bezier(0.22,1,0.36,1)', boxShadow:'0 4px 20px rgba(250,204,21,0.3)', letterSpacing:'0.05em', display:'flex', alignItems:'center', justifyContent:'center', gap:8, WebkitTapHighlightColor:'transparent', touchAction:'manipulation' }}
            >
              {loading ? (
                <>
                  <span style={{ display:'inline-block', width:18, height:18, border:'2.5px solid rgba(0,0,0,0.2)', borderTopColor:'#1a1a1a', borderRadius:'50%', animation:'spinRing 0.7s linear infinite' }} />
                  Memverifikasi...
                </>
              ) : <>🚀 MASUK</>}
            </button>
          </form>

          <p style={{ color:'rgba(255,255,255,0.4)', fontSize:12, textAlign:'center', marginTop:20, marginBottom:0, lineHeight:1.5 }}>
            Token didapatkan dari guru mata pelajaran
          </p>
        </div>

        <p style={{ color:'rgba(255,255,255,0.25)', fontSize:11, marginTop:24, letterSpacing:'0.1em' }}>created by dhickz666</p>
      </div>
    </PageWrapper>
  )
}
