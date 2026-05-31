'use client'
// src/app/(elkpd)/elkpd/admin/dashboard/page.tsx
import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import PageWrapper from '@/components/elkpd/PageWrapper'
import NavbarElkpd from '@/components/elkpd/Navbar'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import { useApiKeyNotifications } from '@/hooks/useApiKeyNotifications'
import { supabase } from '@/lib/supabase-elkpd'
import { hitungSkorOtomatis } from '@/utils/elkpd'

function NotifPanel({ notifications, loading, onMarkRead, onMarkAll, onReset, onClose }) {
  const [resetting, setResetting] = useState({})

  const handleReset = async (keyIndex) => {
    setResetting(p => ({ ...p, [keyIndex]: true }))
    await onReset(keyIndex)
    setResetting(p => ({ ...p, [keyIndex]: false }))
  }

  const fmt = (iso) => {
    if (!iso) return '-'
    return new Date(iso).toLocaleString('id-ID', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  }

  return (
    <div style={{
      position: 'absolute', top: 48, right: 0,
      width: 320, maxHeight: 480,
      background: '#0f172a',
      border: '1px solid rgba(255,255,255,0.15)',
      borderRadius: 18, boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
      zIndex: 999, overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{
        padding: '14px 16px 10px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <p style={{ color: '#fff', fontWeight: 800, fontSize: 13, margin: 0 }}>🔔 Notifikasi API Key</p>
        <div style={{ display: 'flex', gap: 8 }}>
          {notifications.some(n => !n.isRead) && (
            <button onClick={onMarkAll} style={{
              background: 'rgba(255,255,255,0.08)', border: 'none',
              color: 'rgba(255,255,255,0.6)', fontSize: 11, fontWeight: 700,
              borderRadius: 8, padding: '4px 10px', cursor: 'pointer',
            }}>Baca semua</button>
          )}
          <button onClick={onClose} style={{
            background: 'none', border: 'none',
            color: 'rgba(255,255,255,0.4)', fontSize: 18, cursor: 'pointer', padding: 0,
          }}>✕</button>
        </div>
      </div>

      {/* List */}
      <div style={{ overflowY: 'auto', flex: 1 }}>
        {loading && (
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, textAlign: 'center', padding: '20px 0', margin: 0 }}>
            Memuat...
          </p>
        )}

        {!loading && notifications.length === 0 && (
          <div style={{ padding: '28px 16px', textAlign: 'center' }}>
            <p style={{ fontSize: 28, margin: '0 0 8px' }}>✅</p>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, margin: 0 }}>
              Semua API key aktif, tidak ada masalah.
            </p>
          </div>
        )}

        {notifications.map(n => (
          <div key={n.id} onClick={() => !n.isRead && onMarkRead(n.id)} style={{
            padding: '12px 16px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            background: n.isRead ? 'transparent' : 'rgba(239,68,68,0.06)',
            cursor: n.isRead ? 'default' : 'pointer',
            transition: 'background 0.2s',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              {/* Dot unread */}
              <div style={{
                width: 8, height: 8, borderRadius: '50%', flexShrink: 0, marginTop: 4,
                background: n.isRead ? 'transparent' : '#ef4444',
              }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  color: n.isRead ? 'rgba(255,255,255,0.5)' : '#fca5a5',
                  fontWeight: n.isRead ? 500 : 700, fontSize: 12, margin: '0 0 3px',
                }}>
                  {n.message}
                </p>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, margin: '0 0 6px' }}>
                  {n.detail}
                </p>
                <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 10, margin: '0 0 8px' }}>
                  🕒 {fmt(n.exhaustedAt)} · {n.totalRequests || 0} request
                </p>
                <button
                  onClick={(e) => { e.stopPropagation(); handleReset(n.keyIndex) }}
                  disabled={resetting[n.keyIndex]}
                  style={{
                    background: resetting[n.keyIndex]
                      ? 'rgba(255,255,255,0.05)'
                      : 'linear-gradient(135deg, rgba(34,197,94,0.25), rgba(16,185,129,0.25))',
                    border: '1px solid rgba(34,197,94,0.4)',
                    color: resetting[n.keyIndex] ? 'rgba(255,255,255,0.3)' : '#86efac',
                    borderRadius: 8, padding: '5px 12px',
                    fontSize: 11, fontWeight: 700, cursor: resetting[n.keyIndex] ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {resetting[n.keyIndex] ? '⏳ Mengaktifkan...' : '✅ Aktifkan Kembali'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Bell Button ──────────────────────────────────────────────
function NotifBell({ unreadCount, onClick }) {
  return (
    <button onClick={onClick} style={{
      position: 'relative',
      background: unreadCount > 0
        ? 'rgba(239,68,68,0.2)'
        : 'rgba(255,255,255,0.08)',
      border: `1px solid ${unreadCount > 0 ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.15)'}`,
      borderRadius: 12, width: 40, height: 40,
      cursor: 'pointer', fontSize: 18,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      transition: 'all 0.2s',
    }}>
      🔔
      {unreadCount > 0 && (
        <span style={{
          position: 'absolute', top: -4, right: -4,
          background: '#ef4444', color: '#fff',
          fontSize: 10, fontWeight: 900,
          borderRadius: '50%', width: 18, height: 18,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '2px solid #0f172a',
        }}>
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </button>
  )
}

// ── Main ─────────────────────────────────────────────────────
export default function DashboardAdmin() {
  
  const { admin, logout } = useAdminAuth()

  const [rekalkulasi, setRekalkulasi] = useState({
    loading: false, status: '', hasil: null, error: '',
  })

  const [showNotif, setShowNotif] = useState(false)
  const notifRef = useRef(null)

  const {
    notifications, unreadCount, loading: notifLoading,
    markAsRead, markAllRead, resetKey, refresh,
  } = useApiKeyNotifications(30_000)

  // Tutup notif kalau klik di luar
  useEffect(() => {
    if (!showNotif) return
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotif(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [showNotif])

  if (!admin) return null

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const handleRekalkulasi = async () => {
    if (!window.confirm(
      'Rekalkulasi skor otomatis semua jawaban siswa?\n\nData jawaban tidak akan berubah, hanya skor_otomatis & skor_total yang diperbarui.'
    )) return

    setRekalkulasi({ loading: true, status: 'Mengambil data jawaban...', hasil: null, error: '' })

    try {
      const { data: semuaJawaban, error: errJawaban } = await supabase
        .from('jawaban_siswa')
        .select('id, kegiatan_id, jawaban_data, skor_otomatis')
      if (errJawaban) throw errJawaban

      setRekalkulasi(p => ({ ...p, status: `Memuat ${semuaJawaban.length} jawaban... mengambil data soal...` }))

      const kegiatanIds = [...new Set(semuaJawaban.map(j => j.kegiatan_id))]
      const { data: semuaKegiatan, error: errKegiatan } = await supabase
        .from('kegiatan')
        .select('id, soal_data')
        .in('id', kegiatanIds)
      if (errKegiatan) throw errKegiatan

      const kegiatanMap = Object.fromEntries(semuaKegiatan.map(k => [k.id, k]))
      let diproses = 0, diupdate = 0, gagal = 0

      for (const jawaban of semuaJawaban) {
        diproses++
        setRekalkulasi(p => ({ ...p, status: `Memproses ${diproses}/${semuaJawaban.length}...` }))

        const kegiatan = kegiatanMap[jawaban.kegiatan_id]
        if (!kegiatan?.soal_data) { gagal++; continue }

        try {
          const skorBaru = hitungSkorOtomatis(kegiatan.soal_data, jawaban.jawaban_data)
          if (skorBaru === jawaban.skor_otomatis) continue

          const { error: errUpdate } = await supabase
            .from('jawaban_siswa')
            .update({ skor_otomatis: skorBaru, skor_total: skorBaru })
            .eq('id', jawaban.id)
          if (errUpdate) { gagal++; continue }
          diupdate++
        } catch { gagal++ }
      }

      setRekalkulasi({ loading: false, status: '', hasil: { diproses, diupdate, gagal }, error: '' })
    } catch (err) {
      setRekalkulasi({ loading: false, status: '', hasil: null, error: err.message || 'Terjadi kesalahan.' })
    }
  }

  const rk = rekalkulasi

  return (
    <PageWrapper>
      <NavbarElkpd showGuruBtn={false} adminName={admin?.username} />

      <style>{`
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(24px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes float {
          0%,100% { transform:translateY(0); }
          50%     { transform:translateY(-5px); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .card-admin { animation: fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) both; }
        .card-admin:nth-child(2) { animation-delay: 0.1s; }
        .menu-card:hover {
          transform: translateY(-3px) scale(1.01);
          box-shadow: 0 16px 40px rgba(0,0,0,0.3) !important;
        }
        .spin { animation: spin 1s linear infinite; display:inline-block; }
      `}</style>

      <div style={{
        maxWidth: 480, margin: '0 auto',
        padding: '32px 16px 48px',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>

        {/* Sapaan + Bell */}
        <div style={{ textAlign: 'center', marginBottom: 32, width: '100%' }} className="card-admin">

          {/* Bell — pojok kanan */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
            <div ref={notifRef} style={{ position: 'relative' }}>
              <NotifBell unreadCount={unreadCount} onClick={() => setShowNotif(p => !p)} />
              {showNotif && (
                <NotifPanel
                  notifications={notifications}
                  loading={notifLoading}
                  onMarkRead={markAsRead}
                  onMarkAll={markAllRead}
                  onReset={async (keyIndex) => {
                    const ok = await resetKey(keyIndex)
                    if (ok) refresh()
                  }}
                  onClose={() => setShowNotif(false)}
                />
              )}
            </div>
          </div>

          <div style={{ fontSize: 52, marginBottom: 12, animation: 'float 3.5s ease-in-out infinite' }}>🛡️</div>
          <h1 style={{
            color: '#fff', fontWeight: 900, fontSize: 22,
            margin: '0 0 6px', textShadow: '0 2px 8px rgba(0,0,0,0.3)',
          }}>
            Halo, {admin.nama.split(',')[0]}!
          </h1>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.4)',
            borderRadius: 999, padding: '5px 14px', marginTop: 6,
          }}>
            <span style={{ fontSize: 12 }}>🛡️</span>
            <span style={{ color: '#a5b4fc', fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {admin.role}
            </span>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, marginTop: 8 }}>
            Selamat datang di panel administrasi LKPD Digital
          </p>
        </div>

        {/* Menu */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Data Guru */}
          <button className="menu-card card-admin" onClick={() => router.push('/admin/guru')} style={{
            background: 'linear-gradient(135deg, rgba(99,102,241,0.25) 0%, rgba(139,92,246,0.25) 100%)',
            border: '2px solid rgba(99,102,241,0.45)',
            borderRadius: 24, padding: '20px 22px',
            cursor: 'pointer', textAlign: 'left', width: '100%',
            transition: 'all 0.25s cubic-bezier(0.22,1,0.36,1)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ background: 'rgba(99,102,241,0.3)', borderRadius: 16, padding: '10px 12px', fontSize: 28 }}>👥</div>
              <div>
                <h2 style={{ color: '#fff', fontWeight: 900, fontSize: 18, margin: '0 0 4px' }}>Data Guru</h2>
                <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, margin: 0 }}>
                  Lihat daftar seluruh guru beserta mata pelajaran
                </p>
              </div>
              <span style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.4)', fontSize: 20 }}>›</span>
            </div>
          </button>

          {/* Lihat Kegiatan */}
          <button className="menu-card card-admin" onClick={() => router.push('/admin/kegiatan')} style={{
            background: 'linear-gradient(135deg, rgba(6,182,212,0.25) 0%, rgba(20,184,166,0.25) 100%)',
            border: '2px solid rgba(6,182,212,0.45)',
            borderRadius: 24, padding: '20px 22px',
            cursor: 'pointer', textAlign: 'left', width: '100%',
            transition: 'all 0.25s cubic-bezier(0.22,1,0.36,1)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ background: 'rgba(6,182,212,0.3)', borderRadius: 16, padding: '10px 12px', fontSize: 28 }}>📋</div>
              <div>
                <h2 style={{ color: '#fff', fontWeight: 900, fontSize: 18, margin: '0 0 4px' }}>Lihat Kegiatan</h2>
                <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, margin: 0 }}>
                  Monitor kegiatan LKPD, materi, dan hasil siswa
                </p>
              </div>
              <span style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.4)', fontSize: 20 }}>›</span>
            </div>
          </button>

          {/* Rekalkulasi Skor */}
          <div className="card-admin" style={{
            background: 'linear-gradient(135deg, rgba(245,158,11,0.2) 0%, rgba(234,88,12,0.2) 100%)',
            border: `2px solid ${rk.hasil ? 'rgba(34,197,94,0.5)' : 'rgba(245,158,11,0.4)'}`,
            borderRadius: 24, padding: '20px 22px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ background: 'rgba(245,158,11,0.3)', borderRadius: 16, padding: '10px 12px', fontSize: 28, flexShrink: 0 }}>🔄</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h2 style={{ color: '#fff', fontWeight: 900, fontSize: 18, margin: '0 0 4px' }}>Rekalkulasi Skor</h2>
                <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, margin: 0 }}>
                  Hitung ulang skor otomatis semua jawaban siswa
                </p>
              </div>
            </div>

            {rk.loading && (
              <div style={{
                marginTop: 14, background: 'rgba(245,158,11,0.1)',
                border: '1px solid rgba(245,158,11,0.3)',
                borderRadius: 12, padding: '10px 14px',
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <span className="spin" style={{ fontSize: 16 }}>⏳</span>
                <p style={{ color: '#fcd34d', fontSize: 13, margin: 0, fontWeight: 600 }}>{rk.status}</p>
              </div>
            )}

            {rk.hasil && !rk.loading && (
              <div style={{
                marginTop: 14, background: 'rgba(34,197,94,0.1)',
                border: '1px solid rgba(34,197,94,0.3)',
                borderRadius: 12, padding: '12px 14px',
              }}>
                <p style={{ color: '#86efac', fontWeight: 700, fontSize: 13, margin: '0 0 8px' }}>✅ Rekalkulasi selesai!</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                  {[
                    { label: 'Diproses', val: rk.hasil.diproses, color: '#93c5fd' },
                    { label: 'Diupdate', val: rk.hasil.diupdate, color: '#86efac' },
                    { label: 'Gagal',    val: rk.hasil.gagal,    color: rk.hasil.gagal > 0 ? '#fca5a5' : 'rgba(255,255,255,0.3)' },
                  ].map(item => (
                    <div key={item.label} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: '8px', textAlign: 'center' }}>
                      <p style={{ color: item.color, fontWeight: 900, fontSize: 22, margin: 0 }}>{item.val}</p>
                      <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, margin: 0 }}>{item.label}</p>
                    </div>
                  ))}
                </div>
                {rk.hasil.diupdate === 0 && rk.hasil.gagal === 0 && (
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 8, textAlign: 'center' }}>
                    Semua skor sudah up-to-date, tidak ada yang perlu diubah.
                  </p>
                )}
              </div>
            )}

            {rk.error && !rk.loading && (
              <div style={{
                marginTop: 14, background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: 12, padding: '10px 14px',
              }}>
                <p style={{ color: '#fca5a5', fontSize: 13, margin: 0 }}>⚠️ {rk.error}</p>
              </div>
            )}

            <button onClick={handleRekalkulasi} disabled={rk.loading} style={{
              marginTop: 14, width: '100%',
              background: rk.loading ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #f59e0b, #ea580c)',
              border: 'none', borderRadius: 14, padding: '12px',
              cursor: rk.loading ? 'not-allowed' : 'pointer',
              color: rk.loading ? 'rgba(255,255,255,0.4)' : '#fff',
              fontWeight: 900, fontSize: 14, transition: 'all 0.2s',
              opacity: rk.loading ? 0.7 : 1,
            }}>
              {rk.loading ? '⏳ Sedang memproses...' : '🔄 Jalankan Rekalkulasi'}
            </button>
          </div>

        </div>

        {/* Info NIP */}
        <div style={{
          marginTop: 28, background: 'rgba(255,255,255,0.07)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: 16, padding: '12px 20px', width: '100%', textAlign: 'center',
        }}>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, margin: 0 }}>
            NIP: <strong style={{ color: 'rgba(255,255,255,0.7)' }}>{admin.username}</strong>
          </p>
        </div>
      </div>

      <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11, textAlign: 'center', paddingBottom: 16, letterSpacing: '0.1em' }}>
        created by dhickz666
      </p>
    </PageWrapper>
  )
}
