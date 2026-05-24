'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminNotificationBell() {
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const fetchPendingCount = useCallback(async () => {
    try {
      const res = await fetch(
        '/api/delete-requests?where[status][equals]=pending&limit=0',
        { cache: 'no-store' },
      )
      if (!res.ok) return
      const data = await res.json()
      setCount(data.totalDocs ?? 0)
    } catch {
      // silent fail — bell tidak crash halaman
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPendingCount()
    const interval = setInterval(fetchPendingCount, 30_000)
    return () => clearInterval(interval)
  }, [fetchPendingCount])

  // Jangan render apapun selagi loading — hindari layout shift
  if (loading) return null

  return (
    <button
      onClick={() => router.push('/admin/collections/delete-requests')}
      title={
        count > 0
          ? `${count} permintaan hapus menunggu persetujuan`
          : 'Tidak ada permintaan hapus pending'
      }
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '36px',
        height: '36px',
        background: 'transparent',
        border: '1.5px solid rgba(255,255,255,0.15)',
        borderRadius: '8px',
        cursor: 'pointer',
        marginRight: '8px',
        flexShrink: 0,
      }}
    >
      <span style={{ fontSize: '17px', lineHeight: 1 }}>🔔</span>

      {count > 0 && (
        <span
          style={{
            position: 'absolute',
            top: '-6px',
            right: '-6px',
            background: '#e53e3e',
            color: '#fff',
            fontSize: '10px',
            fontWeight: 700,
            minWidth: '18px',
            height: '18px',
            borderRadius: '999px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 4px',
            border: '2px solid #0d2a5e',
            lineHeight: 1,
          }}
        >
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  )
}
