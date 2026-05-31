
'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import PageWrapper from '@/components/elkpd/PageWrapper'
import NavbarElkpd from '@/components/elkpd/Navbar'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import { supabase } from '@/lib/supabase-elkpd'

type Soal = {
  tipe: string
  pertanyaan: string
  pilihan?: Record<string, string>
  kunci_jawaban?: string
  bobot?: number
}

type Kegiatan = {
  id: string
  judul: string
  token: string
  aktif: boolean
  youtube_url?: string
  file_materi_url?: string
  isi_materi?: string
  file_tugas_url?: string
  soal_data?: Soal[]
  guru?: { nama: string; mapel: string }
}

export default function DetailKegiatanAdmin() {
  const { id } = useParams()
  const router = useRouter()
  const { admin } = useAdminAuth()
  const [kegiatan, setKegiatan] = useState<Kegiatan | null>(null)
  const [loadingData, setLoadingData] = useState(true)
  const [tab, setTab] = useState('materi')

  useEffect(() => {
    if (!admin) { router.push('/elkpd/admin/login'); return }
    fetchKegiatan()
  }, [admin])

  const fetchKegiatan = async () => {
    setLoadingData(true)
    const { data } = await supabase
      .from('kegiatan')
      .select('*, guru ( nama, mapel )')
      .eq('id', id)
      .single()
    setKegiatan(data as Kegiatan)
    setLoadingData(false)
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
            <h1 style={{ color:'#fff', fontWeight:900, fontSize:20, margin:0 }}>Detail Kegiatan</h1>
            {kegiatan && <p style={{ color:'rgba(255,255,255,0.45)', fontSize:12, margin:0 }}>{kegiatan.guru?.nama} · {kegiatan.guru?.mapel}</p>}
          </div>
        </div>

        {loadingData && <div style={{ textAlign:'center', padding:'48px 0', color:'rgba(255,255,255,0.5)' }}>Memuat...</div>}

        {kegiatan && (
          <div>
            <div style={{ background:'rgba(255,255,255,0.08)', borderRadius:18, padding:'16px 18px', marginBottom:18 }}>
              <p style={{ color:'#fff', fontWeight:800, fontSize:16, margin:'0 0 10px' }}>{kegiatan.judul || '(Tanpa judul)'}</p>
              <div style={{ display:'flex', gap:10 }}>
                <span style={{ color:'#facc15', fontFamily:'monospace', fontWeight:900 }}>{kegiatan.token}</span>
                <span style={{ color: kegiatan.aktif ? '#4ade80' : '#94a3b8' }}>{kegiatan.aktif ? '● Aktif' : '○ Nonaktif'}</span>
              </div>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:18 }}>
              {[{ key:'materi', label:'📄 Materi' }, { key:'lkpd', label:'📝 LKPD / Soal' }].map(t => (
                <button key={t.key} onClick={() => setTab(t.key)}
                  style={{ padding:'11px 0', borderRadius:14, fontWeight:800, fontSize:14, cursor:'pointer', border:'none',
                    background: tab === t.key ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'rgba(255,255,255,0.08)',
                    color: tab === t.key ? '#fff' : 'rgba(255,255,255,0.5)' }}>
                  {t.label}
                </button>
              ))}
            </div>

            {tab === 'materi' && (
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                {kegiatan.youtube_url && (
                  <div style={{ background:'rgba(255,0,0,0.1)', borderRadius:16, overflow:'hidden' }}>
                    <p style={{ color:'#fca5a5', fontSize:12, fontWeight:700, padding:'12px 16px 0' }}>🎬 Video YouTube</p>
                    <div style={{ position:'relative', paddingBottom:'56.25%', height:0 }}>
                      <iframe src={`https://www.youtube.com/embed/${extractYTId(kegiatan.youtube_url)}`}
                        title="Video Materi" frameBorder="0" allowFullScreen
                        style={{ position:'absolute', top:0, left:0, width:'100%', height:'100%' }} />
                    </div>
                  </div>
                )}
                {kegiatan.file_materi_url && (
                  <a href={kegiatan.file_materi_url} target="_blank" rel="noopener noreferrer"
                    style={{ display:'flex', alignItems:'center', gap:12, background:'rgba(6,182,212,0.1)', borderRadius:14, padding:'14px 16px', textDecoration:'none' }}>
                    <span style={{ fontSize:24 }}>📎</span>
                    <div>
                      <p style={{ color:'#67e8f9', fontWeight:800, fontSize:14, margin:0 }}>File Materi</p>
                      <p style={{ color:'rgba(255,255,255,0.4)', fontSize:11, margin:0 }}>Klik untuk buka / unduh</p>
                    </div>
                    <span style={{ marginLeft:'auto', color:'rgba(255,255,255,0.4)' }}>↗</span>
                  </a>
                )}
                {kegiatan.isi_materi && (
                  <div style={{ background:'rgba(255,255,255,0.07)', borderRadius:16, padding:'16px' }}>
                    <p style={{ color:'rgba(255,255,255,0.5)', fontSize:11, fontWeight:700, margin:'0 0 10px' }}>📄 Isi Materi</p>
                    <div style={{ color:'rgba(255,255,255,0.85)', fontSize:14, lineHeight:1.75 }} dangerouslySetInnerHTML={{ __html: kegiatan.isi_materi }} />
                  </div>
                )}
                {!kegiatan.youtube_url && !kegiatan.file_materi_url && !kegiatan.isi_materi && (
                  <div style={{ textAlign:'center', padding:'32px', color:'rgba(255,255,255,0.4)' }}>📭 Tidak ada materi</div>
                )}
              </div>
            )}

            {tab === 'lkpd' && (
              <div>
                {kegiatan.file_tugas_url && (
                  <a href={kegiatan.file_tugas_url} target="_blank" rel="noopener noreferrer"
                    style={{ display:'flex', alignItems:'center', gap:12, background:'rgba(250,204,21,0.1)', borderRadius:14, padding:'14px 16px', textDecoration:'none', marginBottom:14 }}>
                    <span style={{ fontSize:24 }}>📋</span>
                    <div>
                      <p style={{ color:'#fde68a', fontWeight:800, fontSize:14, margin:0 }}>File Tugas / LKPD</p>
                      <p style={{ color:'rgba(255,255,255,0.4)', fontSize:11, margin:0 }}>Klik untuk buka / unduh</p>
                    </div>
                    <span style={{ marginLeft:'auto', color:'rgba(255,255,255,0.4)' }}>↗</span>
                  </a>
                )}
                {kegiatan.soal_data && kegiatan.soal_data.length > 0 ? (
                  <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                    <p style={{ color:'rgba(255,255,255,0.5)', fontSize:12, fontWeight:700, margin:'0 0 4px' }}>📝 Daftar Soal ({kegiatan.soal_data.length} soal)</p>
                    {kegiatan.soal_data.map((soal: Soal, i: number) => (
                      <div key={i} style={{ background:'rgba(255,255,255,0.07)', borderRadius:14, padding:'14px 16px' }}>
                        <div style={{ display:'flex', gap:10, marginBottom:8 }}>
                          <span style={{ color:'#a5b4fc', fontWeight:900, fontSize:12 }}>No. {i + 1}</span>
                          <span style={{ color: soal.tipe === 'pg' ? '#67e8f9' : '#fb923c', fontSize:11, fontWeight:700 }}>
                            {soal.tipe === 'pg' ? 'Pilihan Ganda' : 'Uraian'}
                          </span>
                        </div>
                        <p style={{ color:'#fff', fontSize:14, margin:'0 0 8px' }}>{soal.pertanyaan}</p>
                        {soal.tipe === 'pg' && soal.pilihan && (
                          <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                            {Object.entries(soal.pilihan).map(([k, v]: [string, string]) => (
                              <div key={k} style={{ display:'flex', gap:8, background: k === soal.kunci_jawaban ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.04)', borderRadius:8, padding:'8px 10px' }}>
                                <span style={{ color: k === soal.kunci_jawaban ? '#4ade80' : 'rgba(255,255,255,0.5)', fontWeight:900 }}>{k}.</span>
                                <span style={{ color: k === soal.kunci_jawaban ? '#fff' : 'rgba(255,255,255,0.7)', fontSize:13 }}>{v}</span>
                                {k === soal.kunci_jawaban && <span style={{ color:'#4ade80', marginLeft:'auto' }}>✓</span>}
                              </div>
                            ))}
                          </div>
                        )}
                        <p style={{ color:'#fbbf24', fontSize:12, margin:'8px 0 0' }}>Bobot: {soal.bobot || 1} poin</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  !kegiatan.file_tugas_url && (
                    <div style={{ textAlign:'center', padding:'32px', color:'rgba(255,255,255,0.4)' }}>📭 Tidak ada soal</div>
                  )
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </PageWrapper>
  )
}

function extractYTId(url: string): string {
  if (!url) return ''
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
  return match ? match[1] : url
}