'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import PageWrapper from '@/components/elkpd/PageWrapper'
import NavbarElkpd from '@/components/elkpd/Navbar'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import { supabase } from '@/lib/supabase-elkpd'

type Jawaban = {
  id: string
  nama: string
  tingkat: string
  kelas: string
  skor_otomatis: number | null
  skor_uraian: number | null
  skor_total: number | null
  submitted_at: string | null
}

type Kegiatan = {
  id: string
  judul: string
  token: string
  guru?: { nama: string; mapel: string }[]
}

export default function HasilAdmin() {
  const { id } = useParams()
  const router = useRouter()
  const { admin } = useAdminAuth()
  const [kegiatan, setKegiatan] = useState<Kegiatan | null>(null)
  const [jawaban, setJawaban] = useState<Jawaban[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [sortBy, setSortBy] = useState('submitted_at')

  useEffect(() => {
    if (!admin) { router.push('/elkpd/admin/login'); return }
    fetchData()
  }, [admin])

  const fetchData = async () => {
    setLoadingData(true)
    const [kegRes, jawRes] = await Promise.all([
      supabase.from('kegiatan').select('id, judul, token, guru ( nama, mapel )').eq('id', id).single(),
      supabase.from('jawaban_siswa').select('id, nama, tingkat, kelas, skor_otomatis, skor_uraian, skor_total, submitted_at').eq('kegiatan_id', id).order('submitted_at', { ascending: false }),
    ])
    setKegiatan(kegRes.data as unknown as Kegiatan)
    setJawaban(jawRes.data || [])
    setLoadingData(false)
  }

  const sorted = [...jawaban].sort((a, b) => {
    if (sortBy === 'skor_total') return (b.skor_total ?? 0) - (a.skor_total ?? 0)
    if (sortBy === 'nama') return a.nama.localeCompare(b.nama)
    return new Date(b.submitted_at ?? 0).getTime() - new Date(a.submitted_at ?? 0).getTime()
  })

  const avg = jawaban.length
    ? (jawaban.reduce((s, j) => s + (j.skor_total ?? 0), 0) / jawaban.length).toFixed(1)
    : '—'

  const getScoreColor = (skor: number | null | undefined) => {
    if (skor === null || skor === undefined) return { color:'#94a3b8', bg:'rgba(148,163,184,0.15)', border:'rgba(148,163,184,0.3)' }
    if (skor >= 80) return { color:'#4ade80', bg:'rgba(34,197,94,0.15)', border:'rgba(34,197,94,0.4)' }
    if (skor >= 60) return { color:'#fbbf24', bg:'rgba(251,191,36,0.15)', border:'rgba(251,191,36,0.4)' }
    return { color:'#f87171', bg:'rgba(248,113,113,0.15)', border:'rgba(248,113,113,0.4)' }
  }

  if (!admin) return null

  return (
    <PageWrapper>
      <NavbarElkpd showGuruBtn={false} />
      <div style={{ maxWidth:560, margin:'0 auto', padding:'24px 16px 48px' }}>

        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
          <button onClick={() => router.push('/elkpd/admin/kegiatan')}
            style={{ background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.2)', color:'#fff', borderRadius:12, padding:'8px 14px', cursor:'pointer', fontWeight:700, fontSize:13 }}>
            ← Kembali
          </button>
          <div>
            <h1 style={{ color:'#fff', fontWeight:900, fontSize:20, margin:0 }}>Lihat Hasil</h1>
            {kegiatan && <p style={{ color:'rgba(255,255,255,0.45)', fontSize:12, margin:0 }}>{kegiatan.guru?.[0]?.nama} · {kegiatan.guru?.[0]?.mapel}</p>}
          </div>
        </div>

        {loadingData && (
          <div style={{ textAlign:'center', padding:'48px 0', color:'rgba(255,255,255,0.5)' }}>
            <div style={{ width:36, height:36, border:'3px solid rgba(255,255,255,0.1)', borderTopColor:'#4ade80', borderRadius:'50%', margin:'0 auto 12px' }} />
            Memuat data hasil...
          </div>
        )}

        {!loadingData && kegiatan && (
          <>
            <div style={{ background:'rgba(255,255,255,0.07)', borderRadius:16, padding:'14px 16px', marginBottom:16 }}>
              <p style={{ color:'rgba(255,255,255,0.45)', fontSize:11, fontWeight:700, textTransform:'uppercase', margin:'0 0 3px' }}>Kegiatan</p>
              <p style={{ color:'#fff', fontWeight:800, fontSize:15, margin:'0 0 8px' }}>{kegiatan.judul || '(Tanpa judul)'}</p>
              <span style={{ color:'#facc15', fontFamily:'monospace', fontWeight:900 }}>{kegiatan.token}</span>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, marginBottom:18 }}>
              {[
                { label:'Siswa', value:jawaban.length, icon:'👨‍🎓', color:'#60a5fa' },
                { label:'Rata-rata', value:avg, icon:'📊', color:'#4ade80' },
                { label:'Tertinggi', value: jawaban.length ? Math.max(...jawaban.map(j => j.skor_total ?? 0)) : '—', icon:'🏆', color:'#fbbf24' },
              ].map(s => (
                <div key={s.label} style={{ background:'rgba(255,255,255,0.07)', borderRadius:14, padding:'12px 10px', textAlign:'center' }}>
                  <div style={{ fontSize:20, marginBottom:4 }}>{s.icon}</div>
                  <p style={{ color:s.color, fontWeight:900, fontSize:18, margin:'0 0 2px' }}>{s.value}</p>
                  <p style={{ color:'rgba(255,255,255,0.45)', fontSize:11, margin:0 }}>{s.label}</p>
                </div>
              ))}
            </div>

            <div style={{ display:'flex', gap:8, marginBottom:14, alignItems:'center' }}>
              <span style={{ color:'rgba(255,255,255,0.45)', fontSize:12, fontWeight:700 }}>Urutkan:</span>
              {[{ key:'submitted_at', label:'Terbaru' }, { key:'skor_total', label:'Skor ↓' }, { key:'nama', label:'Nama A-Z' }].map(s => (
                <button key={s.key} onClick={() => setSortBy(s.key)}
                  style={{ background: sortBy === s.key ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.07)', border: `1px solid ${sortBy === s.key ? 'rgba(99,102,241,0.6)' : 'rgba(255,255,255,0.12)'}`, color: sortBy === s.key ? '#a5b4fc' : 'rgba(255,255,255,0.5)', borderRadius:10, padding:'8px 14px', fontSize:13, fontWeight:700, cursor:'pointer' }}>
                  {s.label}
                </button>
              ))}
            </div>

            {sorted.length === 0 ? (
              <div style={{ textAlign:'center', padding:'40px 20px', color:'rgba(255,255,255,0.4)' }}>
                <div style={{ fontSize:40, marginBottom:10 }}>📭</div>
                <p style={{ fontSize:14, margin:0 }}>Belum ada siswa yang mengerjakan</p>
              </div>
            ) : (
              <div style={{ background:'rgba(255,255,255,0.06)', borderRadius:18, overflow:'hidden' }}>
                <div style={{ display:'flex', justifyContent:'space-between', padding:'10px 14px', background:'rgba(34,197,94,0.15)', borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
                  <span style={{ color:'#4ade80', fontSize:11, fontWeight:800, textTransform:'uppercase' }}>Nama Siswa</span>
                  <span style={{ color:'#4ade80', fontSize:11, fontWeight:800, textTransform:'uppercase' }}>Skor</span>
                </div>
                {sorted.map((j, i) => {
                  const sc = getScoreColor(j.skor_total)
                  return (
                    <div key={j.id} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:10, padding:'11px 14px', borderBottom: i < sorted.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                      <div style={{ display:'flex', gap:10, alignItems:'flex-start', flex:1, minWidth:0 }}>
                        <span style={{ color:'rgba(255,255,255,0.3)', fontSize:12, fontWeight:700, flexShrink:0 }}>{i + 1}</span>
                        <div>
                          <p style={{ color:'#fff', fontWeight:700, fontSize:14, margin:'0 0 2px' }}>{j.nama}</p>
                          <p style={{ color:'rgba(255,255,255,0.45)', fontSize:11, margin:'0 0 2px' }}>{j.tingkat} {j.kelas}</p>
                          <p style={{ color:'rgba(255,255,255,0.3)', fontSize:11, margin:0 }}>
                            {j.submitted_at ? new Date(j.submitted_at).toLocaleString('id-ID', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' }) : '—'}
                          </p>
                        </div>
                      </div>
                      <div style={{ flexShrink:0, textAlign:'center' }}>
                        <span style={{ background:sc.bg, border:`1px solid ${sc.border}`, color:sc.color, borderRadius:10, padding:'5px 12px', fontWeight:900, fontSize:15, display:'inline-block', minWidth:44 }}>
                          {j.skor_total ?? '—'}
                        </span>
                        {j.skor_uraian !== null && j.skor_uraian !== undefined && (
                          <p style={{ color:'rgba(255,255,255,0.3)', fontSize:10, margin:'3px 0 0', textAlign:'center' }}>uraian: {j.skor_uraian}</p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}
      </div>
    </PageWrapper>
  )
}