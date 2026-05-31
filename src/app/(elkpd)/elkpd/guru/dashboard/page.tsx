'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import PageWrapper from '@/components/elkpd/PageWrapper'
import NavbarElkpd from '@/components/elkpd/Navbar'
import { useAuth } from '@/hooks/useAuth'

export default function DashboardGuru() {
  const router = useRouter()
  const { guru, logout } = useAuth()
  const [hovered, setHovered] = useState<'kegiatan' | 'hasil' | null>(null)

  useEffect(() => { if (!guru) router.push('/elkpd/guru/login') }, [guru])
  if (!guru) return null

  return (
    <PageWrapper>
      <style>{`
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-15deg); }
          100% { transform: translateX(250%) skewX(-15deg); }
        }
        @keyframes floatIcon {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        .menu-card {
          position: relative;
          width: 100%;
          border-radius: 24px;
          padding: 22px 24px;
          text-align: left;
          cursor: pointer;
          overflow: hidden;
          transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s ease;
        }
        .menu-card:hover {
          transform: translateY(-3px) scale(1.01);
        }
        .menu-card .shimmer {
          position: absolute;
          top: 0; left: 0;
          width: 40%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
          animation: shimmer 0.6s ease forwards;
        }
        .menu-card .icon-wrap {
          transition: transform 0.25s ease;
        }
        .menu-card:hover .icon-wrap {
          animation: floatIcon 1.2s ease-in-out infinite;
        }
        .card-yellow {
          background: rgba(0,0,0,0.6);
          border: 2px solid rgba(250,204,21,0.5);
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
          backdrop-filter: blur(12px);
        }
        .card-yellow:hover {
          border-color: rgba(250,204,21,1);
          box-shadow:
            0 0 0 1px rgba(250,204,21,0.3),
            0 0 30px rgba(250,204,21,0.35),
            0 0 60px rgba(250,204,21,0.15),
            0 8px 32px rgba(0,0,0,0.4);
        }
        .card-green {
          background: rgba(0,0,0,0.6);
          border: 2px solid rgba(34,197,94,0.5);
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
          backdrop-filter: blur(12px);
        }
        .card-green:hover {
          border-color: rgba(34,197,94,1);
          box-shadow:
            0 0 0 1px rgba(34,197,94,0.3),
            0 0 30px rgba(34,197,94,0.35),
            0 0 60px rgba(34,197,94,0.15),
            0 8px 32px rgba(0,0,0,0.4);
        }
        .card-yellow .glow-bg {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 30% 50%, rgba(250,204,21,0.08) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .card-yellow:hover .glow-bg { opacity: 1; }
        .card-green .glow-bg {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 30% 50%, rgba(34,197,94,0.08) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .card-green:hover .glow-bg { opacity: 1; }
        .card-yellow .arrow {
          color: rgba(250,204,21,0.4);
          transition: color 0.2s, transform 0.2s;
        }
        .card-yellow:hover .arrow {
          color: rgba(250,204,21,1);
          transform: translateX(4px);
        }
        .card-green .arrow {
          color: rgba(34,197,94,0.4);
          transition: color 0.2s, transform 0.2s;
        }
        .card-green:hover .arrow {
          color: rgba(34,197,94,1);
          transform: translateX(4px);
        }
      `}</style>

      {/* Navbar dengan tombol logout */}
      <NavbarElkpd guruNama={guru.nama} onLogout={() => { logout(); router.push('/elkpd') }} showGuruBtn={false} />

      {/* Overlay gelap */}
      <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.55)', zIndex:-1, pointerEvents:'none' }} />

      <div style={{ maxWidth:480, margin:'0 auto', padding:'40px 16px', display:'flex', flexDirection:'column', alignItems:'center' }}>

        {/* Header */}
        <div style={{ textAlign:'center', marginBottom:36 }}>
          <div style={{ fontSize:52, marginBottom:12 }}>👩‍🏫</div>
          <h1 style={{ color:'#fff', fontWeight:900, fontSize:24, margin:'0 0 10px', textShadow:'0 2px 8px rgba(0,0,0,0.6)' }}>
            Halo, {guru.nama.split(',')[0]}!
          </h1>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(0,0,0,0.5)', border:'1px solid rgba(250,204,21,0.7)', borderRadius:999, padding:'6px 16px', marginBottom:8, backdropFilter:'blur(8px)' }}>
            <span style={{ color:'#fde047', fontWeight:700, fontSize:14 }}>📚 {guru.mapel}</span>
          </div>
          <p style={{ color:'rgba(255,255,255,0.75)', fontSize:14, margin:0, textShadow:'0 1px 4px rgba(0,0,0,0.6)' }}>Selamat datang di panel guru LKPD Digital</p>
        </div>

        {/* Menu */}
        <div style={{ width:'100%', display:'flex', flexDirection:'column', gap:16 }}>

          {/* Card Siapkan Kegiatan */}
          <button
            className="menu-card card-yellow"
            onClick={() => router.push('/elkpd/guru/kegiatan')}
            onMouseEnter={() => setHovered('kegiatan')}
            onMouseLeave={() => setHovered(null)}
          >
            <div className="glow-bg" />
            {hovered === 'kegiatan' && <div className="shimmer" />}
            <div style={{ position:'relative', display:'flex', alignItems:'center', gap:16 }}>
              <div
                className="icon-wrap"
                style={{ background:'rgba(250,204,21,0.2)', border:'1px solid rgba(250,204,21,0.6)', borderRadius:16, padding:'12px', fontSize:28, flexShrink:0 }}
              >
                📝
              </div>
              <div style={{ flex:1 }}>
                <h2 style={{ color:'#fff', fontWeight:900, fontSize:18, margin:'0 0 4px', textShadow:'0 1px 4px rgba(0,0,0,0.5)' }}>Siapkan Kegiatan</h2>
                <p style={{ color:'rgba(255,255,255,0.75)', fontSize:13, margin:0 }}>Buat materi, soal LKPD, dan dapatkan token untuk siswa</p>
              </div>
              <span className="arrow" style={{ fontSize:22, fontWeight:900 }}>→</span>
            </div>
          </button>

          {/* Card Lihat Hasil */}
          <button
            className="menu-card card-green"
            onClick={() => router.push('/elkpd/guru/hasil')}
            onMouseEnter={() => setHovered('hasil')}
            onMouseLeave={() => setHovered(null)}
          >
            <div className="glow-bg" />
            {hovered === 'hasil' && <div className="shimmer" />}
            <div style={{ position:'relative', display:'flex', alignItems:'center', gap:16 }}>
              <div
                className="icon-wrap"
                style={{ background:'rgba(34,197,94,0.2)', border:'1px solid rgba(34,197,94,0.6)', borderRadius:16, padding:'12px', fontSize:28, flexShrink:0 }}
              >
                📊
              </div>
              <div style={{ flex:1 }}>
                <h2 style={{ color:'#fff', fontWeight:900, fontSize:18, margin:'0 0 4px', textShadow:'0 1px 4px rgba(0,0,0,0.5)' }}>Lihat Hasil</h2>
                <p style={{ color:'rgba(255,255,255,0.75)', fontSize:13, margin:0 }}>Rekap nilai siswa, beri skor uraian, dan unduh laporan</p>
              </div>
              <span className="arrow" style={{ fontSize:22, fontWeight:900 }}>→</span>
            </div>
          </button>
        </div>

        {/* Info */}
        <div style={{ marginTop:32, background:'rgba(0,0,0,0.55)', border:'1px solid rgba(255,255,255,0.2)', borderRadius:16, padding:'14px 20px', width:'100%', textAlign:'center', boxSizing:'border-box', backdropFilter:'blur(10px)' }}>
          <p style={{ color:'rgba(255,255,255,0.75)', fontSize:12, margin:0 }}>
            Mapel: <strong style={{ color:'#fde047' }}>{guru.mapel}</strong> &nbsp;|&nbsp; Guru: <strong style={{ color:'#fff' }}>{guru.nama}</strong>
          </p>
        </div>

        <p style={{ color:'rgba(255,255,255,0.3)', fontSize:11, marginTop:24 }}>created by dhickz666</p>
      </div>
    </PageWrapper>
  )
}