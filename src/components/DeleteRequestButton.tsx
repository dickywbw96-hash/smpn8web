'use client'

import { useEffect, useState } from 'react'

interface Props {
  docId: string
  collectionSlug: string
  docTitle?: string
}

export default function DeleteRequestButton({ docId, collectionSlug, docTitle }: Props) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle')
  const [alreadySent, setAlreadySent] = useState(false)

  useEffect(() => {
    const key = `delete-req-${collectionSlug}-${docId}`
    if (localStorage.getItem(key)) setAlreadySent(true)
  }, [docId, collectionSlug])

  const handleRequest = async () => {
    const label = docTitle || docId
    if (!confirm(`Kirim permintaan hapus "${label}" ke admin?`)) return

    setStatus('loading')
    try {
      const res = await fetch('/api/delete-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ docId, collectionSlug, docTitle: label }),
      })

      if (!res.ok) throw new Error('Gagal mengirim permintaan')

      localStorage.setItem(`delete-req-${collectionSlug}-${docId}`, '1')
      setStatus('sent')
      setAlreadySent(true)
    } catch {
      setStatus('error')
    }
  }

  if (alreadySent || status === 'sent') {
    return (
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 14px',
          background: 'rgba(237, 137, 54, 0.1)',
          color: '#c05621',
          border: '1px solid rgba(237, 137, 54, 0.3)',
          borderRadius: '8px',
          fontSize: '13px',
          fontWeight: 500,
        }}
      >
        ⏳ Permintaan hapus sudah dikirim ke admin
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 14px',
          background: 'rgba(229, 62, 62, 0.08)',
          color: '#c53030',
          border: '1px solid rgba(229, 62, 62, 0.25)',
          borderRadius: '8px',
          fontSize: '13px',
          fontWeight: 500,
        }}
      >
        ❌ Gagal mengirim —{' '}
        <button
          onClick={() => setStatus('idle')}
          style={{ textDecoration: 'underline', background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: 'inherit' }}
        >
          coba lagi
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={handleRequest}
      disabled={status === 'loading'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '8px 16px',
        background: 'transparent',
        color: status === 'loading' ? '#aaa' : '#e53e3e',
        border: `1.5px solid ${status === 'loading' ? '#ccc' : '#e53e3e'}`,
        borderRadius: '8px',
        fontSize: '13px',
        fontWeight: 600,
        cursor: status === 'loading' ? 'not-allowed' : 'pointer',
        transition: 'all 0.18s ease',
        opacity: status === 'loading' ? 0.6 : 1,
      }}
    >
      {status === 'loading' ? '⏳ Mengirim...' : '🗑️ Ajukan Hapus ke Admin'}
    </button>
  )
}
