// components/layout/NotificationBell.jsx
import { useState, useRef, useEffect } from 'react'
import { useApiKeyNotifications } from '../../hooks/useApiKeyNotifications'

/* ─── helpers ─────────────────────────────────────── */
const fmtTime = (iso) => {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

/* ─── sub-komponen kartu notifikasi ──────────────── */
function NotifCard({ notif, onMarkRead, onReset }) {
  const [resetting, setResetting] = useState(false)
  const [done, setDone]           = useState(false)

  const handleReset = async () => {
    setResetting(true)
    const ok = await onReset(notif.keyIndex)
    if (ok) setDone(true)
    setResetting(false)
  }

  const isExhausted = notif.status === 'exhausted'
  const accent = isExhausted ? '#f59e0b' : '#ef4444'
  const accentSoft = isExhausted ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)'
  const icon = isExhausted ? '⚡' : '❌'

  return (
    <div
      style={{
        background: notif.isRead
          ? 'rgba(255,255,255,0.04)'
          : 'rgba(255,255,255,0.09)',
        border: `1px solid ${notif.isRead ? 'rgba(255,255,255,0.1)' : accentSoft}`,
        borderLeft: `3px solid ${notif.isRead ? 'rgba(255,255,255,0.15)' : accent}`,
        borderRadius: 14,
        padding: '14px 16px',
        marginBottom: 10,
        transition: 'all 0.25s ease',
        opacity: done ? 0.4 : 1,
      }}
    >
      {/* header baris */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        {/* ikon status */}
        <div style={{
          background: accentSoft,
          borderRadius: 10,
          padding: '6px 8px',
          fontSize: 18,
          flexShrink: 0,
          lineHeight: 1,
        }}>
          {icon}
        </div>

        {/* teks */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
            marginBottom: 4,
          }}>
            <span style={{
              color: '#fff', fontWeight: 800, fontSize: 14, lineHeight: 1.2,
            }}>
              {notif.message}
            </span>
            {!notif.isRead && (
              <span style={{
                background: accent, color: '#000',
                fontWeight: 900, fontSize: 9, borderRadius: 999,
                padding: '2px 7px', textTransform: 'uppercase', letterSpacing: '0.06em',
                flexShrink: 0,
              }}>
                Baru
              </span>
            )}
          </div>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, margin: '0 0 6px', lineHeight: 1.5 }}>
            {notif.detail}
          </p>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, margin: 0 }}>
            🕐 {fmtTime(notif.exhaustedAt)} · {notif.totalRequests ?? 0} request
          </p>
        </div>
      </div>

      {/* tombol aksi */}
      {!done && (
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <button
            onClick={handleReset}
            disabled={resetting}
            style={{
              flex: 1,
              background: resetting
                ? 'rgba(255,255,255,0.1)'
                : `linear-gradient(135deg, ${accent}, ${isExhausted ? '#d97706' : '#dc2626'})`,
              border: 'none', borderRadius: 10,
              color: resetting ? 'rgba(255,255,255,0.4)' : '#fff',
              fontWeight: 800, fontSize: 12, padding: '8px 0',
              cursor: resetting ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            {resetting ? '⏳ Mereset...' : '🔄 Reset Key ke Active'}
          </button>
          {!notif.isRead && (
            <button
              onClick={() => onMarkRead(notif.id)}
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 10, color: 'rgba(255,255,255,0.6)',
                fontWeight: 700, fontSize: 12, padding: '8px 12px',
                cursor: 'pointer', whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
              }}
            >
              ✓ Tandai Dibaca
            </button>
          )}
        </div>
      )}
      {done && (
        <p style={{
          marginTop: 10, textAlign: 'center', fontSize: 12,
          color: '#34d399', fontWeight: 700,
        }}>
          ✅ Key berhasil diaktifkan kembali!
        </p>
      )}
    </div>
  )
}

/* ─── komponen utama ─────────────────────────────── */
export default function NotificationBell() {
  const { notifications, unreadCount, loading, markAsRead, markAllRead, resetKey, refresh }
    = useApiKeyNotifications(20_000)

  const [open, setOpen] = useState(false)
  const panelRef        = useRef(null)
  const bellRef         = useRef(null)

  /* tutup panel kalau klik di luar */
  useEffect(() => {
    const handler = (e) => {
      if (
        panelRef.current && !panelRef.current.contains(e.target) &&
        bellRef.current  && !bellRef.current.contains(e.target)
      ) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const hasAlert = unreadCount > 0

  return (
    <div style={{ position: 'relative' }}>

      {/* ── tombol lonceng ── */}
      <button
        ref={bellRef}
        onClick={() => setOpen((v) => !v)}
        title="Notifikasi API Key"
        style={{
          position: 'relative',
          background: open
            ? 'rgba(245,158,11,0.2)'
            : 'rgba(255,255,255,0.08)',
          border: open
            ? '1px solid rgba(245,158,11,0.5)'
            : '1px solid rgba(255,255,255,0.15)',
          borderRadius: 14,
          padding: '8px 10px',
          cursor: 'pointer',
          fontSize: 20,
          lineHeight: 1,
          transition: 'all 0.2s ease',
          /* animasi goyang saat ada notif baru */
          animation: hasAlert && !open ? 'bellRing 2s ease-in-out infinite' : 'none',
        }}
      >
        🔔
        {/* badge angka */}
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute', top: -5, right: -5,
            background: '#ef4444',
            color: '#fff', fontWeight: 900, fontSize: 10,
            borderRadius: 999, minWidth: 18, height: 18,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '0 4px',
            boxShadow: '0 0 0 2px rgba(0,0,0,0.5)',
          }}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* animasi goyang */}
      <style>{`
        @keyframes bellRing {
          0%,100% { transform: rotate(0deg);  }
          10%      { transform: rotate(-15deg); }
          20%      { transform: rotate(15deg);  }
          30%      { transform: rotate(-10deg); }
          40%      { transform: rotate(10deg);  }
          50%      { transform: rotate(0deg);  }
        }
        @keyframes panelSlide {
          from { opacity:0; transform:translateY(-8px) scale(0.97); }
          to   { opacity:1; transform:translateY(0)    scale(1);    }
        }
        .notif-panel-scroll::-webkit-scrollbar { width:4px; }
        .notif-panel-scroll::-webkit-scrollbar-track { background:transparent; }
        .notif-panel-scroll::-webkit-scrollbar-thumb {
          background:rgba(255,255,255,0.2); border-radius:999px;
        }
      `}</style>

      {/* ── panel dropdown ── */}
      {open && (
        <div
          ref={panelRef}
          style={{
            position: 'absolute',
            top: 'calc(100% + 10px)',
            right: 0,
            width: 340,
            background: 'linear-gradient(160deg, rgba(20,20,35,0.98) 0%, rgba(10,10,25,0.98) 100%)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 20,
            boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
            zIndex: 9999,
            animation: 'panelSlide 0.25s cubic-bezier(0.22,1,0.36,1) both',
            overflow: 'hidden',
          }}
        >
          {/* header panel */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '16px 18px 12px',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
          }}>
            <div>
              <h3 style={{ color: '#fff', fontWeight: 900, fontSize: 15, margin: 0 }}>
                🔔 Notifikasi API Key
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, margin: '3px 0 0' }}>
                {loading
                  ? 'Memuat...'
                  : notifications.length === 0
                  ? 'Semua key berjalan normal ✅'
                  : `${notifications.length} key bermasalah`}
              </p>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {/* tombol refresh */}
              <button
                onClick={refresh}
                title="Refresh"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 10, padding: '5px 9px',
                  color: 'rgba(255,255,255,0.6)', fontSize: 14,
                  cursor: 'pointer',
                }}
              >↻</button>
              {/* tandai semua dibaca */}
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: 10, padding: '5px 10px',
                    color: 'rgba(255,255,255,0.6)', fontSize: 11, fontWeight: 700,
                    cursor: 'pointer', whiteSpace: 'nowrap',
                  }}
                >
                  Baca Semua
                </button>
              )}
            </div>
          </div>

          {/* isi notifikasi */}
          <div
            className="notif-panel-scroll"
            style={{
              maxHeight: 380,
              overflowY: 'auto',
              padding: '14px 14px 10px',
            }}
          >
            {loading && (
              <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', fontSize: 13, padding: '20px 0' }}>
                ⏳ Memuat notifikasi...
              </p>
            )}

            {!loading && notifications.length === 0 && (
              <div style={{ textAlign: 'center', padding: '28px 0' }}>
                <div style={{ fontSize: 40, marginBottom: 10 }}>✅</div>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, margin: 0 }}>
                  Semua API key aktif & normal!
                </p>
              </div>
            )}

            {!loading && notifications.map((notif) => (
              <NotifCard
                key={notif.id}
                notif={notif}
                onMarkRead={markAsRead}
                onReset={resetKey}
              />
            ))}
          </div>

          {/* footer */}
          {!loading && notifications.length > 0 && (
            <div style={{
              padding: '10px 16px',
              borderTop: '1px solid rgba(255,255,255,0.08)',
              textAlign: 'center',
            }}>
              <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, margin: 0 }}>
                Auto-refresh setiap 20 detik
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}