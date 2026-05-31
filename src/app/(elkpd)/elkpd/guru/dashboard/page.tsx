'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import PageWrapper from '@/components/elkpd/PageWrapper'
import NavbarElkpd from '@/components/elkpd/Navbar'
import { useAuth } from '@/hooks/useAuth'

export default function DashboardGuru() {
  const router = useRouter()
  const { guru, logout } = useAuth()

  useEffect(() => { if (!guru) router.push('/elkpd/guru/login') }, [guru])
  if (!guru) return null

  return (
    <PageWrapper>
      <NavbarElkpd guruNama={guru.nama} onLogout={() => { logout(); router.push('/elkpd') }} showGuruBtn={false} />

      <div style={{ maxWidth:480, margin:'0 auto', padding:'40px 16px', display:'flex', flexDirection:'column', alignItems:'center' }}>

        {/* Header */}
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{ fontSize:52, marginBottom:12 }}>👩‍🏫</div>
          <h1 style={{ color:'#fff', fontWeight:900, fontSize:24, margin:'0 0 10px' }}>
            Halo, {guru.nama.split(',')[0]}!
          </h1>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(250,204,21,0.2)', border:'1px solid rgba(250,204,21,0.4)', borderRadius:999, padding:'6px 16px', marginBottom:8 }}>
            <span style={{ color:'#fde047', fontWeight:700, fontSize:14 }}>📚 {guru.mapel}</span>
          </div>
          <p style={{ color:'rgba(255,255,255,0.5)', fontSize:14, margin:0 }}>Selamat datang di panel guru LKPD Digital</p>
        </div>

        {/* Menu */}
        <div style={{ width:'100%', display:'flex', flexDirection:'column', gap:16 }}>
          <button
            onClick={() => router.push('/elkpd/guru/kegiatan')}
            style={{ width:'100%', background:'linear-gradient(135deg,rgba(250,204,21,0.2),rgba(251,146,60,0.2))', border:'2px solid rgba(250,204,21,0.5)', borderRadius:24, padding:'20px 24px', textAlign:'left', cursor:'pointer', transition:'all 0.2s' }}>
            <div style={{ display:'flex', alignItems:'center', gap:16 }}>
              <div style={{ background:'rgba(250,204,21,0.3)', borderRadius:16, padding:'12px', fontSize:28, flexShrink:0 }}>📝</div>
              <div>
                <h2 style={{ color:'#fff', fontWeight:900, fontSize:18, margin:'0 0 4px' }}>Siapkan Kegiatan</h2>
                <p style={{ color:'rgba(255,255,255,0.6)', fontSize:13, margin:0 }}>Buat materi, soal LKPD, dan dapatkan token untuk siswa</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => router.push('/elkpd/guru/hasil')}
            style={{ width:'100%', background:'linear-gradient(135deg,rgba(34,197,94,0.2),rgba(20,184,166,0.2))', border:'2px solid rgba(34,197,94,0.5)', borderRadius:24, padding:'20px 24px', textAlign:'left', cursor:'pointer', transition:'all 0.2s' }}>
            <div style={{ display:'flex', alignItems:'center', gap:16 }}>
              <div style={{ background:'rgba(34,197,94,0.3)', borderRadius:16, padding:'12px', fontSize:28, flexShrink:0 }}>📊</div>
              <div>
                <h2 style={{ color:'#fff', fontWeight:900, fontSize:18, margin:'0 0 4px' }}>Lihat Hasil</h2>
                <p style={{ color:'rgba(255,255,255,0.6)', fontSize:13, margin:0 }}>Rekap nilai siswa, beri skor uraian, dan unduh laporan</p>
              </div>
            </div>
          </button>
        </div>

        {/* Info */}
        <div style={{ marginTop:32, background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.2)', borderRadius:16, padding:'14px 20px', width:'100%', textAlign:'center', boxSizing:'border-box' }}>
          <p style={{ color:'rgba(255,255,255,0.6)', fontSize:12, margin:0 }}>
            Mapel: <strong style={{ color:'#fff' }}>{guru.mapel}</strong> &nbsp;|&nbsp; Guru: <strong style={{ color:'#fff' }}>{guru.nama}</strong>
          </p>
        </div>

        <p style={{ color:'rgba(255,255,255,0.3)', fontSize:11, marginTop:24 }}>created by dhickz666</p>
      </div>
    </PageWrapper>
  )
}