'use client'
// src/app/(elkpd)/elkpd/admin/detail/page.tsx
import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import PageWrapper from '@/components/elkpd/PageWrapper'
import NavbarElkpd from '@/components/elkpd/Navbar'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import { useApiKeyNotifications } from '@/hooks/useApiKeyNotifications'
import { supabase } from '@/lib/supabase-elkpd'
import { hitungSkorOtomatis } from '@/utils/elkpd'

export default function DetailKegiatanAdmin() {
  
  const { id } = useParams()
  const { admin, logout } = useAdminAuth()
  const [kegiatan, setKegiatan] = useState(null)
  const [loadingData, setLoadingData] = useState(true)
  const [tab, setTab] = useState('materi') // 'materi' | 'lkpd'

  useEffect(() => {
    if (!admin) { router.push('/admin/login'); return }
    fetchKegiatan()
  }, [admin])

  const fetchKegiatan = async () => {
    setLoadingData(true)
    const { data } = await supabase
      .from('kegiatan')
      .select(`*, guru ( nama, mapel )`)
      .eq('id', id)
      .single()
    setKegiatan(data)
    setLoadingData(false)
  }

  if (!admin) return null
  
  return (
    <PageWrapper>
      <NavbarElkpd showGuruBtn={false} adminName={admin?.username} />

      <style>{`
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(16px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes spinRing { to { transform:rotate(360deg); } }
        .fade-in { animation: fadeUp 0.4s cubic-bezier(0.22,1,0.36,1) both; }
        .tab-btn { transition: all 0.2s ease; }
        .soal-item { animation: fadeUp 0.4s cubic-bezier(0.22,1,0.36,1) both; }
      `}</style>

      <div style={{ maxWidth:560, margin:'0 auto', padding:'24px 16px 48px' }}>

        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
          <button
            onClick={() => router.push('/admin/kegiatan')}
            style={{
              background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.2)',
              color:'#fff', borderRadius:12, padding:'8px 14px',
              cursor:'pointer', fontWeight:700, fontSize:13, minHeight:44, WebkitTapHighlightColor:'transparent', touchAction:'manipulation',
              display:'flex', alignItems:'center', gap:6,
              flexShrink:0, transition:'all 0.2s',
            }}
          >
            ← Kembali
          </button>
          <div>
            <h1 style={{ color:'#fff', fontWeight:900, fontSize:20, margin:0 }}>Detail Kegiatan</h1>
            {kegiatan && (
              <p style={{ color:'rgba(255,255,255,0.45)', fontSize:12, margin:0 }}>
                {kegiatan.guru?.nama} · {kegiatan.guru?.mapel}
              </p>
            )}
          </div>
        </div>

        {/* Loading */}
        {loadingData && (
          <div style={{ textAlign:'center', padding:'48px 0', color:'rgba(255,255,255,0.5)' }}>
            <div style={{
              width:36, height:36, border:'3px solid rgba(255,255,255,0.1)',
              borderTopColor:'#818cf8', borderRadius:'50%',
              animation:'spinRing 0.8s linear infinite', margin:'0 auto 12px',
            }} />
            Memuat detail kegiatan...
          </div>
        )}

        {kegiatan && (
          <div className="fade-in">
            {/* Info card */}
            <div style={{
              background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.12)',
              borderRadius:18, padding:'16px 18px', marginBottom:18,
            }}>
              <p style={{ color:'rgba(255,255,255,0.45)', fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', margin:'0 0 4px' }}>
                Judul Kegiatan
              </p>
              <p style={{ color:'#fff', fontWeight:800, fontSize:16, margin:'0 0 10px' }}>
                {kegiatan.judul || '(Tanpa judul)'}
              </p>
              <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
                <span style={{
                  background:'rgba(250,204,21,0.15)', border:'1px solid rgba(250,204,21,0.4)',
                  color:'#facc15', borderRadius:8, padding:'3px 11px',
                  fontFamily:'monospace', fontWeight:900, fontSize:14, letterSpacing:'0.15em',
                }}>
                  {kegiatan.token}
                </span>
                <span style={{
                  background: kegiatan.aktif ? 'rgba(34,197,94,0.15)' : 'rgba(148,163,184,0.15)',
                  border: `1px solid ${kegiatan.aktif ? 'rgba(34,197,94,0.4)' : 'rgba(148,163,184,0.3)'}`,
                  color: kegiatan.aktif ? '#4ade80' : '#94a3b8',
                  borderRadius:8, padding:'3px 11px', fontSize:12, fontWeight:700,
                }}>
                  {kegiatan.aktif ? '● Aktif' : '○ Nonaktif'}
                </span>
              </div>
            </div>

            {/* Tab */}
            <div style={{
              display:'grid', gridTemplateColumns:'1fr 1fr',
              gap:8, marginBottom:18,
            }}>
              {[
                { key:'materi', label:'📄 Materi' },
                { key:'lkpd',   label:'📝 LKPD / Soal' },
              ].map(t => (
                <button
                  key={t.key}
                  className="tab-btn"
                  onClick={() => setTab(t.key)}
                  style={{
                    padding:'11px 0', borderRadius:14, fontWeight:800, fontSize:14,
                    cursor:'pointer', border:'none',
                    background: tab === t.key
                      ? 'linear-gradient(135deg,#6366f1,#8b5cf6)'
                      : 'rgba(255,255,255,0.08)',
                    color: tab === t.key ? '#fff' : 'rgba(255,255,255,0.5)',
                    boxShadow: tab === t.key ? '0 4px 16px rgba(99,102,241,0.35)' : 'none',
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Tab: Materi */}
            {tab === 'materi' && (
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>

                {/* Video YouTube */}
                {kegiatan.youtube_url && (
                  <div style={{
                    background:'rgba(255,0,0,0.1)', border:'1px solid rgba(255,0,0,0.25)',
                    borderRadius:16, overflow:'hidden',
                  }}>
                    <div style={{ padding:'12px 16px 0' }}>
                      <p style={{ color:'#fca5a5', fontSize:12, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', margin:'0 0 10px' }}>
                        🎬 Video YouTube
                      </p>
                    </div>
                    <div style={{ position:'relative', paddingBottom:'56.25%', height:0 }}>
                      <iframe
                        src={`https://www.youtube.com/embed/${extractYTId(kegiatan.youtube_url)}`}
                        title="Video Materi"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        style={{ position:'absolute', top:0, left:0, width:'100%', height:'100%' }}
                      />
                    </div>
                  </div>
                )}

                {/* File Materi */}
                {kegiatan.file_materi_url && (
                  <a
                    href={kegiatan.file_materi_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display:'flex', alignItems:'center', gap:12,
                      background:'rgba(6,182,212,0.1)', border:'1px solid rgba(6,182,212,0.3)',
                      borderRadius:14, padding:'14px 16px', textDecoration:'none',
                      transition:'all 0.2s',
                    }}
                  >
                    <span style={{ fontSize:24 }}>📎</span>
                    <div>
                      <p style={{ color:'#67e8f9', fontWeight:800, fontSize:14, margin:0 }}>File Materi</p>
                      <p style={{ color:'rgba(255,255,255,0.4)', fontSize:11, margin:0 }}>Klik untuk buka / unduh</p>
                    </div>
                    <span style={{ marginLeft:'auto', color:'rgba(255,255,255,0.4)', fontSize:18 }}>↗</span>
                  </a>
                )}

                {/* Isi Materi Teks */}
                {kegiatan.isi_materi && (
                  <div style={{
                    background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.12)',
                    borderRadius:16, padding:'16px',
                  }}>
                    <p style={{ color:'rgba(255,255,255,0.5)', fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', margin:'0 0 10px' }}>
                      📄 Isi Materi
                    </p>
                    <div
                      style={{ color:'rgba(255,255,255,0.85)', fontSize:14, lineHeight:1.75 }}
                      dangerouslySetInnerHTML={{ __html: kegiatan.isi_materi }}
                    />
                  </div>
                )}

                {!kegiatan.youtube_url && !kegiatan.file_materi_url && !kegiatan.isi_materi && (
                  <div style={{ textAlign:'center', padding:'32px', color:'rgba(255,255,255,0.4)', fontSize:14 }}>
                    <div style={{ fontSize:36, marginBottom:10 }}>📭</div>
                    Tidak ada materi yang diunggah
                  </div>
                )}
              </div>
            )}

            {/* Tab: LKPD */}
            {tab === 'lkpd' && (
              <div>
                {/* File tugas */}
                {kegiatan.file_tugas_url && (
                  <a
                    href={kegiatan.file_tugas_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display:'flex', alignItems:'center', gap:12,
                      background:'rgba(250,204,21,0.1)', border:'1px solid rgba(250,204,21,0.3)',
                      borderRadius:14, padding:'14px 16px', textDecoration:'none',
                      marginBottom:14, transition:'all 0.2s',
                    }}
                  >
                    <span style={{ fontSize:24 }}>📋</span>
                    <div>
                      <p style={{ color:'#fde68a', fontWeight:800, fontSize:14, margin:0 }}>File Tugas / LKPD</p>
                      <p style={{ color:'rgba(255,255,255,0.4)', fontSize:11, margin:0 }}>Klik untuk buka / unduh</p>
                    </div>
                    <span style={{ marginLeft:'auto', color:'rgba(255,255,255,0.4)', fontSize:18 }}>↗</span>
                  </a>
                )}

                {/* Soal */}
                {kegiatan.soal_data && kegiatan.soal_data.length > 0 ? (
                  <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                    <p style={{ color:'rgba(255,255,255,0.5)', fontSize:12, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', margin:'0 0 4px' }}>
                      📝 Daftar Soal ({kegiatan.soal_data.length} soal)
                    </p>
                    {kegiatan.soal_data.map((soal, i) => (
                      <div
                        key={i}
                        className="soal-item"
                        style={{
                          background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.1)',
                          borderRadius:14, padding:'14px 16px',
                          animationDelay:`${i * 0.06}s`,
                        }}
                      >
                        <div style={{ display:'flex', gap:10, alignItems:'flex-start', marginBottom:8 }}>
                          <span style={{
                            background:'rgba(99,102,241,0.3)', border:'1px solid rgba(99,102,241,0.5)',
                            color:'#a5b4fc', borderRadius:8, padding:'2px 9px',
                            fontSize:12, fontWeight:900, flexShrink:0,
                          }}>
                            No. {i + 1}
                          </span>
                          <span style={{
                            background: soal.tipe === 'pg'
                              ? 'rgba(6,182,212,0.2)' : soal.tipe === 'essay'
                              ? 'rgba(251,146,60,0.2)' : 'rgba(34,197,94,0.2)',
                            border: `1px solid ${soal.tipe === 'pg'
                              ? 'rgba(6,182,212,0.4)' : soal.tipe === 'essay'
                              ? 'rgba(251,146,60,0.4)' : 'rgba(34,197,94,0.4)'}`,
                            color: soal.tipe === 'pg' ? '#67e8f9' : soal.tipe === 'essay' ? '#fb923c' : '#4ade80',
                            borderRadius:8, padding:'2px 9px', fontSize:11, fontWeight:700, flexShrink:0,
                          }}>
                            {soal.tipe === 'pg' ? 'Pilihan Ganda' : soal.tipe === 'essay' ? 'Uraian' : soal.tipe}
                          </span>
                        </div>
                        <p style={{ color:'#fff', fontSize:14, margin:'0 0 8px', lineHeight:1.6 }}>
                          {soal.pertanyaan}
                        </p>
                        {soal.tipe === 'pg' && soal.pilihan && (
                          <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                            {Object.entries(soal.pilihan).map(([k, v]) => (
                              <div
                                key={k}
                                style={{
                                  display:'flex', gap:8, alignItems:'flex-start',
                                  background: k === soal.kunci_jawaban
                                    ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.04)',
                                  border: `1px solid ${k === soal.kunci_jawaban ? 'rgba(34,197,94,0.4)' : 'rgba(255,255,255,0.08)'}`,
                                  borderRadius:8, padding:'8px 10px',
                                }}
                              >
                                <span style={{
                                  fontWeight:900, fontSize:13, flexShrink:0,
                                  color: k === soal.kunci_jawaban ? '#4ade80' : 'rgba(255,255,255,0.5)',
                                  minWidth:16,
                                }}>
                                  {k}.
                                </span>
                                <span style={{
                                  fontSize:13, lineHeight:1.55, flex:1, minWidth:0,
                                  wordBreak:'break-word',
                                  color: k === soal.kunci_jawaban ? '#fff' : 'rgba(255,255,255,0.7)',
                                }}>
                                  {v}
                                </span>
                                {k === soal.kunci_jawaban && (
                                  <span style={{ flexShrink:0, fontSize:12, color:'#4ade80' }}>✓</span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                        <div style={{ marginTop:8, display:'flex', alignItems:'center', gap:6 }}>
                          <span style={{ color:'rgba(255,255,255,0.35)', fontSize:11 }}>Bobot:</span>
                          <span style={{ color:'#fbbf24', fontWeight:700, fontSize:12 }}>{soal.bobot || 1} poin</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  !kegiatan.file_tugas_url && (
                    <div style={{ textAlign:'center', padding:'32px', color:'rgba(255,255,255,0.4)', fontSize:14 }}>
                      <div style={{ fontSize:36, marginBottom:10 }}>📭</div>
                      Tidak ada soal yang dibuat
                    </div>
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

function extractYTId(url) {
  if (!url) return ''
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
  return match ? match[1] : url
}
