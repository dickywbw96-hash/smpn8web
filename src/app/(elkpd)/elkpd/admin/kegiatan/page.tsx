'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import PageWrapper from '@/components/elkpd/PageWrapper'
import NavbarElkpd from '@/components/elkpd/Navbar'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import { supabase } from '@/lib/supabase-elkpd'

type Kegiatan = {
  id: string
  token: string
  judul: string
  aktif: boolean
  created_at: string
  guru?: { nama: string; mapel: string }[]
}

export default function KegiatanAdmin() {
  const router = useRouter()
  const { admin } = useAdminAuth()
  const [kegiatan, setKegiatan] = useState<Kegiatan[]>([])
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    if (!admin) { router.push('/elkpd/admin/login'); return }
    fetchKegiatan()
  }, [admin])

  const fetchKegiatan = async () => {
    setLoadingData(true)
    const { data } = await supabase
      .from('kegiatan')
      .select('id, token, judul, aktif, created_at, guru ( nama, mapel )')
      .order('created_at', { ascending: false })
    setKegiatan((data || []) as unknown as Kegiatan[])
    setLoadingData(false)
  }

  if (!admin) return null

  return (
    <PageWrapper>
      <NavbarElkpd showGuruBtn={false} />
      <div style={{ maxWidth:520, margin:'0 auto', padding:'24px 16px 48px' }}>

        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:24 }}>
          <button onClick={() => router.push('/elkpd/admin/dashboard')}
            style={{ background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.2)', color:'#fff', borderRadius:12, padding:'8px 14px', cursor:'pointer', fontWeight:700, fontSize:13 }}>
            ← Kembali
          </button>
          <div>
            <h1 style={{ color:'#fff', fontWeight:900, fontSize:20, margin:0 }}>Lihat Kegiatan</h1>
            <p style={{ color:'rgba(255,255,255,0.45)', fontSize:12, margin:0 }}>{kegiatan.length} kegiatan tersimpan</p>
          </div>
        </div>

        {loadingData && (
          <div style={{ textAlign:'center', padding:'48px 0', color:'rgba(255,255,255,0.5)' }}>
            <div style={{ width:36, height:36, border:'3px solid rgba(255,255,255,0.1)', borderTopColor:'#22d3ee', borderRadius:'50%', margin:'0 auto 12px' }} />
            Memuat data kegiatan...
          </div>
        )}

        {!loadingData && kegiatan.length === 0 && (
          <div style={{ textAlign:'center', padding:'48px 20px', color:'rgba(255,255,255,0.4)', fontSize:14 }}>
            <div style={{ fontSize:40, marginBottom:12 }}>📭</div>
            Belum ada kegiatan yang dibuat
          </div>
        )}

        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {kegiatan.map((k, i) => (
            <div key={k.id} style={{ background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.15)', borderRadius:20, padding:'18px 18px 14px', animationDelay:`${i * 0.06}s` }}>

              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:12 }}>
                <div style={{ flex:1 }}>
                  <p style={{ color:'#fff', fontWeight:800, fontSize:15, margin:'0 0 3px' }}>{k.guru?.[0]?.nama || '—'}</p>
                  <div style={{ display:'inline-flex', alignItems:'center', gap:5, background:'rgba(6,182,212,0.15)', border:'1px solid rgba(6,182,212,0.35)', borderRadius:8, padding:'2px 9px' }}>
                    <span style={{ color:'#67e8f9', fontSize:11, fontWeight:700 }}>📚 {k.guru?.[0]?.mapel || '—'}</span>
                  </div>
                </div>
                <div style={{ background: k.aktif ? 'rgba(34,197,94,0.2)' : 'rgba(148,163,184,0.2)', border: `1px solid ${k.aktif ? 'rgba(34,197,94,0.5)' : 'rgba(148,163,184,0.3)'}`, borderRadius:8, padding:'3px 10px', flexShrink:0, marginLeft:10 }}>
                  <span style={{ fontSize:11, fontWeight:700, color: k.aktif ? '#4ade80' : '#94a3b8' }}>{k.aktif ? '● Aktif' : '○ Nonaktif'}</span>
                </div>
              </div>

              <div style={{ background:'rgba(0,0,0,0.2)', borderRadius:12, padding:'10px 14px', marginBottom:12 }}>
                <p style={{ color:'rgba(255,255,255,0.5)', fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', margin:'0 0 3px' }}>Judul Kegiatan</p>
                <p style={{ color:'#fff', fontWeight:700, fontSize:14, margin:'0 0 8px' }}>{k.judul || '(Tanpa judul)'}</p>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <span style={{ color:'rgba(255,255,255,0.4)', fontSize:11 }}>TOKEN:</span>
                  <span style={{ color:'#facc15', fontFamily:'monospace', fontWeight:900, fontSize:15, letterSpacing:'0.2em' }}>{k.token}</span>
                </div>
              </div>

              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                <button onClick={() => router.push(`/elkpd/admin/detail?id=${k.id}`)}
                  style={{ width:'100%', background:'linear-gradient(135deg,rgba(6,182,212,0.3),rgba(20,184,166,0.3))', border:'1px solid rgba(6,182,212,0.5)', color:'#67e8f9', borderRadius:12, padding:'12px 0', fontWeight:800, fontSize:14, cursor:'pointer', minHeight:46 }}>
                  📖 Lihat Kegiatan
                </button>
                <button onClick={() => router.push(`/elkpd/admin/hasil?id=${k.id}`)}
                  style={{ width:'100%', background:'linear-gradient(135deg,rgba(34,197,94,0.3),rgba(16,185,129,0.3))', border:'1px solid rgba(34,197,94,0.5)', color:'#4ade80', borderRadius:12, padding:'12px 0', fontWeight:800, fontSize:14, cursor:'pointer', minHeight:46 }}>
                  📊 Lihat Hasil
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageWrapper>
  )
}