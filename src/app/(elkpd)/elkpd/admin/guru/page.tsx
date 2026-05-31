'use client'
// src/app/(elkpd)/elkpd/admin/guru/page.tsx
import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import PageWrapper from '@/components/elkpd/PageWrapper'
import NavbarElkpd from '@/components/elkpd/Navbar'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import { useApiKeyNotifications } from '@/hooks/useApiKeyNotifications'
import { supabase } from '@/lib/supabase-elkpd'
import { hitungSkorOtomatis } from '@/utils/elkpd'

const MAPEL_COLOR = {
  'Matematika':            { bg:'rgba(251,191,36,0.2)',  border:'rgba(251,191,36,0.5)',  text:'#fbbf24' },
  'IPA':                   { bg:'rgba(34,197,94,0.2)',   border:'rgba(34,197,94,0.5)',   text:'#22c55e' },
  'IPS':                   { bg:'rgba(251,146,60,0.2)',  border:'rgba(251,146,60,0.5)',  text:'#fb923c' },
  'Bahasa Indonesia':      { bg:'rgba(96,165,250,0.2)',  border:'rgba(96,165,250,0.5)',  text:'#60a5fa' },
  'Bahasa Inggris':        { bg:'rgba(167,139,250,0.2)', border:'rgba(167,139,250,0.5)', text:'#a78bfa' },
  'Informatika':           { bg:'rgba(34,211,238,0.2)',  border:'rgba(34,211,238,0.5)',  text:'#22d3ee' },
  'PJOK':                  { bg:'rgba(244,63,94,0.2)',   border:'rgba(244,63,94,0.5)',   text:'#f43f5e' },
  'Seni Budaya':           { bg:'rgba(232,121,249,0.2)', border:'rgba(232,121,249,0.5)', text:'#e879f9' },
  'BK':                    { bg:'rgba(20,184,166,0.2)',  border:'rgba(20,184,166,0.5)',  text:'#14b8a6' },
  'Pendidikan Pancasila':  { bg:'rgba(239,68,68,0.2)',   border:'rgba(239,68,68,0.5)',   text:'#ef4444' },
  'Pendidikan Agama Islam':{ bg:'rgba(245,158,11,0.2)',  border:'rgba(245,158,11,0.5)',  text:'#f59e0b' },
}
const defaultColor = { bg:'rgba(148,163,184,0.2)', border:'rgba(148,163,184,0.4)', text:'#94a3b8' }

export default function DataGuru() {
  
  const { admin, logout } = useAdminAuth()
  const [guruList, setGuruList] = useState([])
  const [loadingData, setLoadingData] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (!admin) { router.push('/admin/login'); return }
    fetchGuru()
  }, [admin])

  const fetchGuru = async () => {
    setLoadingData(true)
    const { data } = await supabase
      .from('guru')
      .select('id, nama, username, mapel')
      .order('nama', { ascending: true })
    setGuruList(data || [])
    setLoadingData(false)
  }

  const filtered = guruList.filter(g =>
    g.nama.toLowerCase().includes(search.toLowerCase()) ||
    g.mapel.toLowerCase().includes(search.toLowerCase()) ||
    g.username.includes(search)
  )

  if (!admin) return null

  return (
    <PageWrapper>
      <NavbarElkpd showGuruBtn={false} adminName={admin?.username} />

      <style>{`
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes spinRing { to { transform:rotate(360deg); } }
        .guru-row { animation: fadeUp 0.4s cubic-bezier(0.22,1,0.36,1) both; }
        .guru-row:active { background: rgba(255,255,255,0.05); }
        .search-input:focus {
          outline:none;
          border-color:rgba(99,102,241,0.7) !important;
          box-shadow:0 0 0 3px rgba(99,102,241,0.2) !important;
        }
        .back-btn:active { opacity:0.7; transform:scale(0.97); }
      `}</style>

      <div style={{ maxWidth:520, margin:'0 auto', padding:'24px 16px 48px', boxSizing:'border-box', width:'100%' }}>

        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
          <button
            className="back-btn"
            onClick={() => router.push('/admin/dashboard')}
            style={{
              background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.2)',
              color:'#fff', borderRadius:12, padding:'10px 14px',
              cursor:'pointer', fontWeight:700, fontSize:13,
              display:'flex', alignItems:'center', gap:6,
              transition:'all 0.2s ease', flexShrink:0,
              minHeight:44, WebkitTapHighlightColor:'transparent',
              touchAction:'manipulation',
            }}
          >
            ← Kembali
          </button>
          <div style={{ minWidth:0 }}>
            <h1 style={{ color:'#fff', fontWeight:900, fontSize:20, margin:0 }}>Data Guru</h1>
            <p style={{ color:'rgba(255,255,255,0.45)', fontSize:12, margin:0 }}>
              {guruList.length} guru terdaftar
            </p>
          </div>
        </div>

        {/* Search */}
        <input
          type="text"
          className="search-input"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="🔍 Cari nama, NIP, atau mapel..."
          style={{
            width:'100%', boxSizing:'border-box',
            background:'rgba(0,0,0,0.25)',
            border:'2px solid rgba(255,255,255,0.15)',
            color:'#fff', borderRadius:14,
            padding:'12px 16px', fontSize:16,
            marginBottom:16, transition:'all 0.2s ease',
            caretColor:'#818cf8',
          }}
        />

        {/* Loading */}
        {loadingData && (
          <div style={{ textAlign:'center', padding:'40px 0', color:'rgba(255,255,255,0.5)' }}>
            <div style={{
              width:32, height:32, border:'3px solid rgba(255,255,255,0.1)',
              borderTopColor:'#818cf8', borderRadius:'50%',
              animation:'spinRing 0.8s linear infinite', margin:'0 auto 12px',
            }} />
            Memuat data guru...
          </div>
        )}

        {/* List — flex row per item, tidak pakai fixed grid */}
        {!loadingData && (
          <div style={{
            background:'rgba(255,255,255,0.07)',
            border:'1px solid rgba(255,255,255,0.12)',
            borderRadius:20, overflow:'hidden',
          }}>
            {/* Header */}
            <div style={{
              background:'rgba(99,102,241,0.2)',
              padding:'11px 16px',
              borderBottom:'1px solid rgba(255,255,255,0.1)',
              display:'flex', justifyContent:'space-between', alignItems:'center',
            }}>
              <span style={{ color:'#a5b4fc', fontSize:11, fontWeight:800, textTransform:'uppercase', letterSpacing:'0.08em' }}>
                Nama Guru &amp; NIP
              </span>
              <span style={{ color:'#a5b4fc', fontSize:11, fontWeight:800, textTransform:'uppercase', letterSpacing:'0.08em' }}>
                Mapel
              </span>
            </div>

            {filtered.length === 0 && (
              <div style={{ padding:'32px 16px', textAlign:'center', color:'rgba(255,255,255,0.4)', fontSize:13 }}>
                Tidak ada data yang cocok
              </div>
            )}

            {filtered.map((g, i) => {
              const c = MAPEL_COLOR[g.mapel] || defaultColor
              return (
                <div
                  key={g.id}
                  className="guru-row"
                  style={{
                    display:'flex',
                    alignItems:'center',
                    justifyContent:'space-between',
                    gap:10,
                    padding:'12px 16px',
                    borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none',
                    animationDelay:`${i * 0.04}s`,
                  }}
                >
                  {/* Kiri: nomor + nama + NIP */}
                  <div style={{ display:'flex', alignItems:'flex-start', gap:10, minWidth:0, flex:1 }}>
                    <span style={{
                      color:'rgba(255,255,255,0.3)', fontSize:12,
                      fontWeight:700, paddingTop:3, flexShrink:0, minWidth:20,
                    }}>
                      {i + 1}
                    </span>
                    <div style={{ minWidth:0 }}>
                      <p style={{
                        color:'#fff', fontWeight:700, fontSize:14,
                        margin:'0 0 3px', lineHeight:1.35,
                        wordBreak:'break-word',
                      }}>
                        {g.nama}
                      </p>
                      <p style={{
                        color:'rgba(255,255,255,0.38)', fontSize:11,
                        margin:0, fontFamily:'monospace',
                        letterSpacing:'0.04em', wordBreak:'break-all',
                      }}>
                        {g.username}
                      </p>
                    </div>
                  </div>

                  {/* Kanan: badge mapel */}
                  <div style={{ flexShrink:0, maxWidth:'38%' }}>
                    <span style={{
                      background:c.bg, border:`1px solid ${c.border}`,
                      color:c.text, borderRadius:8,
                      padding:'4px 8px', fontSize:11, fontWeight:700,
                      lineHeight:1.4, display:'block', textAlign:'center',
                      wordBreak:'break-word',
                    }}>
                      {g.mapel}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {!loadingData && search && (
          <p style={{ color:'rgba(255,255,255,0.35)', fontSize:12, textAlign:'center', marginTop:12 }}>
            Menampilkan {filtered.length} dari {guruList.length} guru
          </p>
        )}
      </div>
    </PageWrapper>
  )
}
