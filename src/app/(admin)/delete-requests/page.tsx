'use client'

import { useEffect, useState } from 'react'
import { getSupabaseBrowser } from '@/lib/supabase-browser'
import Link from 'next/link'

// ── Types ─────────────────────────────────────────────────────────────────────

interface DeleteRequest {
  id: string
  collection_slug: string
  doc_id: string
  doc_title?: string
  notes?: string
  status: 'pending' | 'approved' | 'rejected'
  requested_by: string
  requested_at?: string
  reviewed_by?: string
  reviewed_at?: string
  // joined
  requester_name?: string
  reviewer_name?: string
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const TABLE_LABELS: Record<string, string> = {
  posts: '📰 Berita',
  slider_dashboard: '🖼️ Slider',
  ekstrakurikuler: '⚽ Ekskul',
  ppid: '📋 PPID',
}

const TABLE_LINKS: Record<string, (id: string) => string> = {
  posts: id => `/admin/posts/${id}`,
  slider_dashboard: id => `/admin/slider/${id}`,
  ekstrakurikuler: id => `/admin/ekstrakurikuler/${id}`,
  ppid: id => `/admin/ppid/${id}`,
}

function StatusBadge({ status }: { status: DeleteRequest['status'] }) {
  const styles: Record<string, { bg: string; color: string; label: string }> = {
    pending: { bg: '#fef3c7', color: '#92400e', label: '⏳ Menunggu' },
    approved: { bg: '#dcfce7', color: '#16a34a', label: '✅ Disetujui' },
    rejected: { bg: '#fee2e2', color: '#dc2626', label: '❌ Ditolak' },
  }
  const s = styles[status]
  return (
    <span style={{ padding: '0.25rem 0.75rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 700, background: s.bg, color: s.color }}>
      {s.label}
    </span>
  )
}

function formatDate(d?: string) {
  if (!d) return '-'
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(d))
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function DeleteRequestsPage() {
  const supabase = getSupabaseBrowser()
  const [requests, setRequests] = useState<DeleteRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending')
  const [processing, setProcessing] = useState<string | null>(null)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)
  const [detailReq, setDetailReq] = useState<DeleteRequest | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [showRejectModal, setShowRejectModal] = useState<DeleteRequest | null>(null)
  const [currentUserId, setCurrentUserId] = useState<string>('')

  useEffect(() => {
    fetchCurrent()
    fetchRequests()
  }, [filterStatus])

  async function fetchCurrent() {
    const { data: { session } } = await supabase.auth.getSession()
    if (session) setCurrentUserId(session.user.id)
  }

  async function fetchRequests() {
    setLoading(true)

    let query = supabase
      .from('delete_requests')
      .select('id, doc_title, collection_slug, doc_id, status, notes, requested_by, requested_at, reviewed_by, reviewed_at')
      .order('requested_at', { ascending: false })

    if (filterStatus !== 'all') {
      query = query.eq('status', filterStatus)
    }

    const { data, error } = await query
    if (error) { setLoading(false); return }

    // Fetch user names
    const userIds = [...new Set([...(data ?? []).map(r => r.requested_by), ...(data ?? []).map(r => r.reviewed_by).filter(Boolean)])]
    const { data: usersData } = await supabase.from('users').select('id, name').in('id', userIds)
    const userMap: Record<string, string> = {}
    usersData?.forEach(u => { userMap[u.id] = u.name })

    setRequests((data ?? []).map(r => ({
      ...r,
      requester_name: userMap[r.requested_by] ?? r.requested_by,
      reviewer_name: r.reviewed_by ? (userMap[r.reviewed_by] ?? r.reviewed_by) : undefined,
    })))
    setLoading(false)
  }

  function showToast(msg: string, type: 'success' | 'error' = 'success') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  async function handleApprove(req: DeleteRequest) {
    if (!confirm(`Setujui penghapusan "${req.doc_title ?? req.doc_id}"?\n\nData akan dihapus permanen dan tidak bisa dikembalikan.`)) return

    setProcessing(req.id)
    try {
      // 1. Hapus data asli
      const { error: deleteError } = await supabase
        .from(req.collection_slug)
        .delete()
        .eq('id', req.doc_id)

      if (deleteError) throw deleteError

      // 2. Update status request
      const { error: updateError } = await supabase
        .from('delete_requests')
        .update({
          status: 'approved',
          reviewed_by: currentUserId,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', req.id)

      if (updateError) throw updateError

      showToast(`"${req.doc_title ?? 'Data'}" berhasil dihapus`)
      setDetailReq(null)
      fetchRequests()
    } catch (err: any) {
      showToast(err.message ?? 'Gagal menghapus data', 'error')
    } finally {
      setProcessing(null)
    }
  }

  async function handleReject(req: DeleteRequest) {
    setProcessing(req.id)
    try {
      const { error } = await supabase
        .from('delete_requests')
        .update({
          status: 'rejected',
          reviewed_by: currentUserId,
          reviewed_at: new Date().toISOString(),
          notes: rejectReason || req.notes,
        })
        .eq('id', req.id)

      if (error) throw error

      showToast('Permintaan hapus ditolak')
      setShowRejectModal(null)
      setRejectReason('')
      setDetailReq(null)
      fetchRequests()
    } catch (err: any) {
      showToast(err.message ?? 'Gagal menolak permintaan', 'error')
    } finally {
      setProcessing(null)
    }
  }

  const pendingCount = requests.filter(r => r.status === 'pending').length

  return (
    <div style={{ padding: '2rem' }}>
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: '1.5rem', right: '1.5rem', zIndex: 9999,
          padding: '0.75rem 1.25rem', borderRadius: '10px', fontWeight: 600, fontSize: '0.875rem',
          background: toast.type === 'success' ? '#dcfce7' : '#fee2e2',
          color: toast.type === 'success' ? '#16a34a' : '#dc2626',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}>
          {toast.type === 'success' ? '✅' : '❌'} {toast.msg}
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#030f2b' }}>Permintaan Hapus</h1>
        <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.25rem' }}>
          Review dan approve/reject permintaan penghapusan data dari editor
        </p>
      </div>

      {/* Alert pending */}
      {filterStatus !== 'pending' && pendingCount > 0 && (
        <div
          onClick={() => setFilterStatus('pending')}
          style={{ background: '#fef3c7', border: '1px solid #f59e0b', borderRadius: '10px', padding: '0.875rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
        >
          <span style={{ fontSize: '1.25rem' }}>🔔</span>
          <div>
            <div style={{ fontWeight: 700, color: '#92400e' }}>{pendingCount} permintaan menunggu persetujuan</div>
            <div style={{ fontSize: '0.8rem', color: '#b45309' }}>Klik untuk lihat</div>
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {(['pending', 'all', 'approved', 'rejected'] as const).map(s => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            style={{
              padding: '0.5rem 1rem', border: 'none', borderRadius: '8px', cursor: 'pointer',
              fontSize: '0.8rem', fontWeight: filterStatus === s ? 700 : 500,
              background: filterStatus === s ? '#0d2a5e' : '#f3f4f6',
              color: filterStatus === s ? 'white' : '#6b7280',
            }}
          >
            {s === 'pending' ? `⏳ Pending${pendingCount > 0 ? ` (${pendingCount})` : ''}` :
              s === 'all' ? '📋 Semua' :
              s === 'approved' ? '✅ Disetujui' : '❌ Ditolak'}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af' }}>Memuat...</div>
      ) : requests.length === 0 ? (
        <div style={{ background: 'white', borderRadius: '12px', padding: '3rem', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>✅</div>
          <div style={{ fontWeight: 600, color: '#374151' }}>Tidak ada permintaan {filterStatus === 'all' ? '' : filterStatus}</div>
          <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: '0.25rem' }}>Semua bersih!</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {requests.map(req => (
            <div
              key={req.id}
              style={{
                background: 'white', borderRadius: '12px', padding: '1.25rem 1.5rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                border: req.status === 'pending' ? '1px solid #fde68a' : '1px solid #f3f4f6',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                {/* Left */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                    <StatusBadge status={req.status} />
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#6b7280' }}>
                      {TABLE_LABELS[req.collection_slug] ?? req.collection_slug}
                    </span>
                  </div>
                  <div style={{ fontWeight: 700, color: '#111827', fontSize: '0.9375rem', marginBottom: '0.25rem' }}>
                    {req.doc_title ?? `ID: ${req.doc_id}`}
                  </div>
                  {req.notes && (
                    <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: 600 }}>Alasan:</span> {req.notes}
                    </div>
                  )}
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <span>Diminta oleh: <strong style={{ color: '#6b7280' }}>{req.requester_name}</strong></span>
                    <span>{formatDate(req.requested_at)}</span>
                    {req.reviewer_name && (
                      <span>Direview oleh: <strong style={{ color: '#6b7280' }}>{req.reviewer_name}</strong> · {formatDate(req.reviewed_at)}</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                  {TABLE_LINKS[req.collection_slug] && (
                    <Link
                      href={TABLE_LINKS[req.collection_slug](req.doc_id)}
                      target="_blank"
                      style={{
                        padding: '0.4rem 0.875rem', background: '#f3f4f6', color: '#374151',
                        borderRadius: '6px', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 600,
                        display: 'flex', alignItems: 'center', gap: '0.25rem',
                      }}
                    >
                      🔍 Lihat
                    </Link>
                  )}
                  {req.status === 'pending' && (
                    <>
                      <button
                        onClick={() => setShowRejectModal(req)}
                        disabled={!!processing}
                        style={{
                          padding: '0.4rem 0.875rem', background: '#fee2e2', color: '#dc2626',
                          border: 'none', borderRadius: '6px', cursor: processing ? 'not-allowed' : 'pointer',
                          fontSize: '0.8rem', fontWeight: 700, opacity: processing ? 0.5 : 1,
                        }}
                      >
                        ❌ Tolak
                      </button>
                      <button
                        onClick={() => handleApprove(req)}
                        disabled={!!processing}
                        style={{
                          padding: '0.4rem 0.875rem', background: '#dc2626', color: 'white',
                          border: 'none', borderRadius: '6px', cursor: processing ? 'not-allowed' : 'pointer',
                          fontSize: '0.8rem', fontWeight: 700, opacity: processing ? 0.5 : 1,
                        }}
                      >
                        {processing === req.id ? 'Memproses...' : '🗑️ Setujui & Hapus'}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reject modal */}
      {showRejectModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
        }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '440px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#030f2b', marginBottom: '0.5rem' }}>Tolak Permintaan Hapus</h2>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1.25rem' }}>
              Permintaan untuk: <strong style={{ color: '#111827' }}>{showRejectModal.doc_title ?? showRejectModal.doc_id}</strong>
            </p>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.4rem' }}>
                Alasan penolakan (opsional)
              </label>
              <textarea
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                placeholder="Berikan alasan mengapa permintaan ini ditolak..."
                style={{
                  width: '100%', padding: '0.6rem 0.75rem', border: '1px solid #e5e7eb',
                  borderRadius: '8px', fontSize: '0.875rem', minHeight: '100px', resize: 'vertical',
                  boxSizing: 'border-box', outline: 'none',
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => { setShowRejectModal(null); setRejectReason('') }}
                style={{ padding: '0.6rem 1.25rem', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' }}
              >
                Batal
              </button>
              <button
                onClick={() => handleReject(showRejectModal)}
                disabled={!!processing}
                style={{
                  padding: '0.6rem 1.5rem', background: '#dc2626', color: 'white',
                  border: 'none', borderRadius: '8px', cursor: processing ? 'not-allowed' : 'pointer',
                  fontWeight: 700, fontSize: '0.875rem', opacity: processing ? 0.5 : 1,
                }}
              >
                {processing ? 'Memproses...' : 'Tolak Permintaan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info how it works */}
      <div style={{ marginTop: '2rem', background: 'white', borderRadius: '12px', padding: '1.25rem 1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#030f2b', marginBottom: '0.75rem' }}>ℹ️ Cara Kerja Permintaan Hapus</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {[
            { step: '1', label: 'Editor mengajukan', desc: 'Editor menekan tombol "Ajukan Hapus" pada data yang ingin dihapus dan mengisi alasan.' },
            { step: '2', label: 'Admin mereview', desc: 'Admin menerima notifikasi dan dapat melihat detail data yang ingin dihapus sebelum memutuskan.' },
            { step: '3', label: 'Approve atau Tolak', desc: 'Jika disetujui, data dihapus permanen. Jika ditolak, data tetap ada dengan catatan alasan.' },
          ].map(s => (
            <div key={s.step} style={{ display: 'flex', gap: '0.75rem' }}>
              <div style={{ width: '28px', height: '28px', background: '#0d2a5e', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, flexShrink: 0 }}>{s.step}</div>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#374151' }}>{s.label}</div>
                <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.2rem', lineHeight: 1.5 }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
