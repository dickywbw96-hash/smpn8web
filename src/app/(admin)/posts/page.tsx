'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const CATEGORY_LABELS: Record<string, string> = {
  kegiatan_umum: 'Kegiatan Umum',
  prestasi: 'Prestasi',
  kegiatan_organisasi: 'Kegiatan Organisasi',
}

const STATUS_LABELS: Record<string, string> = {
  published: 'Published',
  draft: 'Draft',
  archived: 'Arsip',
}

export default function PostsPage() {
  const router = useRouter()
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [role, setRole] = useState('')
  const [userId, setUserId] = useState('')
  const [totalCount, setTotalCount] = useState(0)
  const [page, setPage] = useState(1)
  const PER_PAGE = 15

  useEffect(() => {
    getRole()
  }, [])

  useEffect(() => {
    fetchPosts()
  }, [page, filterCategory, filterStatus])

  async function getRole() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return
    setUserId(session.user.id)
    const { data } = await supabase.from('users').select('role').eq('id', session.user.id).single()
    setRole(data?.role ?? '')
  }

  async function fetchPosts() {
    setLoading(true)
    let query = supabase
      .from('posts')
      .select('id, title, category, status, published_at, created_at, author_id', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range((page - 1) * PER_PAGE, page * PER_PAGE - 1)

    if (filterCategory) query = query.eq('category', filterCategory)
    if (filterStatus) query = query.eq('status', filterStatus)

    const { data, count } = await query
    setPosts(data ?? [])
    setTotalCount(count ?? 0)
    setLoading(false)
  }

  const filtered = posts.filter(p =>
    search === '' || p.title.toLowerCase().includes(search.toLowerCase())
  )

  async function handleDelete(id: string) {
    if (!confirm('Yakin ingin meminta penghapusan berita ini?')) return
    // Editor hanya bisa request delete, Admin langsung hapus
    if (role === 'admin') {
      await supabase.from('posts').delete().eq('id', id)
      fetchPosts()
    } else {
      await supabase.from('delete_requests').insert({
        table_name: 'posts',
        record_id: id,
        requested_by: userId,
        status: 'pending',
      })
      alert('Permintaan hapus telah dikirim ke admin.')
    }
  }

  const totalPages = Math.ceil(totalCount / PER_PAGE)

  return (
    <div style={{ padding: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#030f2b', margin: 0 }}>Manajemen Berita</h1>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: '0.25rem 0 0' }}>{totalCount} total berita</p>
        </div>
        <Link href="/admin/posts/new" style={{
          padding: '0.625rem 1.25rem',
          background: '#0d2a5e',
          color: 'white',
          borderRadius: '8px',
          textDecoration: 'none',
          fontSize: '0.875rem',
          fontWeight: 600,
        }}>
          + Tambah Berita
        </Link>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Cari judul berita..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={inputStyle}
        />
        <select value={filterCategory} onChange={e => { setFilterCategory(e.target.value); setPage(1) }} style={selectStyle}>
          <option value="">Semua Kategori</option>
          {Object.entries(CATEGORY_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1) }} style={selectStyle}>
          <option value="">Semua Status</option>
          {Object.entries(STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      </div>

      {/* Table */}
      <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e5e7eb' }}>
              <th style={thStyle}>Judul</th>
              <th style={thStyle}>Kategori</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Tanggal</th>
              <th style={thStyle}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: '#9ca3af' }}>Memuat...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: '#9ca3af' }}>Tidak ada berita ditemukan</td></tr>
            ) : filtered.map(post => (
              <tr key={post.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ ...tdStyle, maxWidth: '350px' }}>
                  <div style={{ fontWeight: 600, color: '#111827', fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {post.title}
                  </div>
                </td>
                <td style={tdStyle}>
                  <span style={{ fontSize: '0.775rem', color: '#6b7280', background: '#f3f4f6', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                    {CATEGORY_LABELS[post.category] ?? post.category}
                  </span>
                </td>
                <td style={tdStyle}>
                  <span style={{
                    padding: '0.2rem 0.6rem',
                    borderRadius: '100px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    background: post.status === 'published' ? '#dcfce7' : post.status === 'draft' ? '#f3f4f6' : '#fef3c7',
                    color: post.status === 'published' ? '#16a34a' : post.status === 'draft' ? '#6b7280' : '#b45309',
                  }}>
                    {STATUS_LABELS[post.status]}
                  </span>
                </td>
                <td style={{ ...tdStyle, fontSize: '0.8rem', color: '#9ca3af' }}>
                  {post.published_at
                    ? new Date(post.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
                    : new Date(post.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Link href={`/admin/posts/${post.id}`} style={btnEdit}>Edit</Link>
                    <button onClick={() => handleDelete(post.id)} style={btnDelete}>
                      {role === 'admin' ? 'Hapus' : 'Request Hapus'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.25rem', justifyContent: 'center' }}>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={btnPage}>‹ Prev</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)} style={{ ...btnPage, background: p === page ? '#0d2a5e' : 'white', color: p === page ? 'white' : '#374151' }}>
              {p}
            </button>
          ))}
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={btnPage}>Next ›</button>
        </div>
      )}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  padding: '0.5rem 0.875rem',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  fontSize: '0.875rem',
  outline: 'none',
  minWidth: '240px',
  background: 'white',
}
const selectStyle: React.CSSProperties = {
  padding: '0.5rem 0.875rem',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  fontSize: '0.875rem',
  outline: 'none',
  background: 'white',
  cursor: 'pointer',
}
const thStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: '0.75rem 1rem',
  fontSize: '0.775rem',
  color: '#6b7280',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
}
const tdStyle: React.CSSProperties = {
  padding: '0.875rem 1rem',
  fontSize: '0.875rem',
  color: '#374151',
  verticalAlign: 'middle',
}
const btnEdit: React.CSSProperties = {
  padding: '0.35rem 0.75rem',
  background: '#eff6ff',
  color: '#1d4ed8',
  borderRadius: '6px',
  textDecoration: 'none',
  fontSize: '0.775rem',
  fontWeight: 600,
}
const btnDelete: React.CSSProperties = {
  padding: '0.35rem 0.75rem',
  background: '#fef2f2',
  color: '#dc2626',
  border: 'none',
  borderRadius: '6px',
  fontSize: '0.775rem',
  fontWeight: 600,
  cursor: 'pointer',
}
const btnPage: React.CSSProperties = {
  padding: '0.4rem 0.75rem',
  border: '1px solid #e5e7eb',
  borderRadius: '6px',
  background: 'white',
  color: '#374151',
  fontSize: '0.8rem',
  cursor: 'pointer',
}