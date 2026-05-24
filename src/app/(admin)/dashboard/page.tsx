'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    posts: 0,
    ekskul: 0,
    ppid: 0,
    slider: 0,
    pendingDelete: 0,
  })
  const [recentPosts, setRecentPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  async function fetchStats() {
    const [posts, ekskul, ppid, slider, deleteReqs, recent] = await Promise.all([
      supabase.from('posts').select('id', { count: 'exact', head: true }),
      supabase.from('ekstrakurikuler').select('id', { count: 'exact', head: true }),
      supabase.from('ppid').select('id', { count: 'exact', head: true }),
      supabase.from('slider_dashboard').select('id', { count: 'exact', head: true }),
      supabase.from('delete_requests').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('posts').select('id, title, status, created_at, category').order('created_at', { ascending: false }).limit(5),
    ])

    setStats({
      posts: posts.count ?? 0,
      ekskul: ekskul.count ?? 0,
      ppid: ppid.count ?? 0,
      slider: slider.count ?? 0,
      pendingDelete: deleteReqs.count ?? 0,
    })
    setRecentPosts(recent.data ?? [])
    setLoading(false)
  }

  const cards = [
    { label: 'Total Berita', value: stats.posts, icon: '📰', href: '/admin/posts', color: '#1a5cc8' },
    { label: 'Ekstrakurikuler', value: stats.ekskul, icon: '⚽', href: '/admin/ekstrakurikuler', color: '#16a34a' },
    { label: 'Dokumen PPID', value: stats.ppid, icon: '📋', href: '/admin/ppid', color: '#b45309' },
    { label: 'Slider Aktif', value: stats.slider, icon: '🖼️', href: '/admin/slider', color: '#7c3aed' },
  ]

  if (loading) return <div style={{ padding: '2rem', color: '#6b7280' }}>Memuat...</div>

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#030f2b' }}>Dashboard</h1>
        <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Selamat datang di panel admin SMPN 8 Probolinggo</p>
      </div>

      {/* Notifikasi permintaan hapus */}
      {stats.pendingDelete > 0 && (
        <Link href="/admin/delete-requests" style={{ textDecoration: 'none' }}>
          <div style={{
            background: '#fef3c7',
            border: '1px solid #f59e0b',
            borderRadius: '10px',
            padding: '1rem 1.5rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            cursor: 'pointer',
          }}>
            <span style={{ fontSize: '1.5rem' }}>🔔</span>
            <div>
              <div style={{ fontWeight: 700, color: '#92400e' }}>
                {stats.pendingDelete} permintaan hapus menunggu persetujuan
              </div>
              <div style={{ fontSize: '0.8rem', color: '#b45309' }}>Klik untuk lihat detail</div>
            </div>
          </div>
        </Link>
      )}

      {/* Stats cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {cards.map(card => (
          <Link key={card.href} href={card.href} style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '1px solid #f3f4f6',
              cursor: 'pointer',
              transition: 'transform 0.2s',
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{card.icon}</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: card.color }}>{card.value}</div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 500 }}>{card.label}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent posts */}
      <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#030f2b' }}>Berita Terbaru</h2>
          <Link href="/admin/posts/new" style={{
            padding: '0.5rem 1rem',
            background: '#0d2a5e',
            color: 'white',
            borderRadius: '6px',
            textDecoration: 'none',
            fontSize: '0.8rem',
            fontWeight: 600,
          }}>
            + Tambah Berita
          </Link>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #f3f4f6' }}>
              <th style={{ textAlign: 'left', padding: '0.5rem', fontSize: '0.8rem', color: '#6b7280', fontWeight: 600 }}>Judul</th>
              <th style={{ textAlign: 'left', padding: '0.5rem', fontSize: '0.8rem', color: '#6b7280', fontWeight: 600 }}>Kategori</th>
              <th style={{ textAlign: 'left', padding: '0.5rem', fontSize: '0.8rem', color: '#6b7280', fontWeight: 600 }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {recentPosts.map(post => (
              <tr key={post.id} style={{ borderBottom: '1px solid #f9fafb' }}>
                <td style={{ padding: '0.75rem 0.5rem', fontSize: '0.875rem', color: '#111827' }}>
                  <Link href={`/admin/posts/${post.id}`} style={{ color: '#0d2a5e', textDecoration: 'none', fontWeight: 500 }}>
                    {post.title}
                  </Link>
                </td>
                <td style={{ padding: '0.75rem 0.5rem', fontSize: '0.8rem', color: '#6b7280' }}>{post.category}</td>
                <td style={{ padding: '0.75rem 0.5rem' }}>
                  <span style={{
                    padding: '0.2rem 0.6rem',
                    borderRadius: '100px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    background: post.status === 'published' ? '#dcfce7' : '#f3f4f6',
                    color: post.status === 'published' ? '#16a34a' : '#6b7280',
                  }}>
                    {post.status === 'published' ? 'Published' : post.status === 'draft' ? 'Draft' : 'Arsip'}
                  </span>
                </td>
              </tr>
            ))}
            {recentPosts.length === 0 && (
              <tr><td colSpan={3} style={{ padding: '1rem', textAlign: 'center', color: '#6b7280', fontSize: '0.875rem' }}>Belum ada berita</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}