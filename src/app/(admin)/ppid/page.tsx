'use client'

import { useEffect, useState } from 'react'
import { getSupabaseBrowser } from '@/lib/supabase-browser'
import Link from 'next/link'

const PPID_STRUCTURE: Record<string, string[]> = {
  'Tentang PPID': ['Profil PPID', 'SK', 'Tugas dan Fungsi', 'Maklumat Pelayanan Publik', 'Jam Layanan'],
  'Alur Permohonan Informasi': [],
  'MoU': [],
  'SOP PPID': [],
  'Daftar Informasi Publik': [],
}
const PPID_CATEGORIES = Object.keys(PPID_STRUCTURE)

export default function PPIDPage() {
  const supabase = getSupabaseBrowser()
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [role, setRole] = useState('')
  const [userId, setUserId] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setUserId(session.user.id)
        const { data } = await supabase.from('users').select('role').eq('id', session.user.id).single()
        setRole(data?.role ?? '')
      }
      fetchItems()
    }
    init()
  }, [])

  async function fetchItems() {
    const { data } = await supabase.from('ppid').select('*').order('order_index')
    setItems(data ?? [])
    setLoading(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Hapus dokumen PPID ini?')) return
    if (role === 'admin') {
      await supabase.from('ppid').delete().eq('id', id)
      fetchItems()
    } else {
      await supabase.from('delete_requests').insert({ collection_slug: 'ppid', doc_id: id, requested_by: userId, status: 'pending' })
      alert('Permintaan hapus dikirim.')
    }
  }

  async function togglePublish(id: string, val: boolean) {
    await supabase.from('ppid').update({ is_published: val }).eq('id', id)
    setItems(items.map(i => i.id === id ? { ...i, is_published: val } : i))
  }

  const filtered = items.filter(i => {
    const matchCat = filterCategory === '' || i.category === filterCategory
    const matchSearch = search === '' || i.title.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  // Kelompokkan per kategori sesuai urutan PPID_STRUCTURE
  const grouped = PPID_CATEGORIES.reduce((acc, cat) => {
    const catItems = filtered.filter(i => i.category === cat)
    if (catItems.length > 0) acc[cat] = catItems
    return acc
  }, {} as Record<string, any[]>)

  // Item yang tidak termasuk kategori manapun
  const uncategorized = filtered.filter(i => !PPID_CATEGORIES.includes(i.category))
  if (uncategorized.length > 0) grouped['Lainnya'] = uncategorized

  return (
    <div style={{ padding: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#030f2b', margin: 0 }}>Dokumen PPID</h1>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: '0.25rem 0 0' }}>{items.length} dokumen</p>
        </div>
        <Link href="/ppid/new" style={btnPrimary}>+ Tambah Dokumen</Link>
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Cari judul dokumen..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ padding: '0.5rem 0.875rem', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '0.875rem', outline: 'none', minWidth: '240px', background: 'white' }}
        />
        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} style={{ padding: '0.5rem 0.875rem', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '0.875rem', background: 'white' }}>
          <option value="">Semua Kategori</option>
          {PPID_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Konten */}
      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#9ca3af' }}>Memuat...</div>
      ) : filtered.length === 0 ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#9ca3af' }}>Tidak ada dokumen</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {Object.entries(grouped).map(([cat, catItems]) => (
            <div key={cat} style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
              {/* Header Kategori */}
              <div style={{ padding: '0.75rem 1rem', background: '#f0f4ff', borderBottom: '2px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontWeight: 700, color: '#0d2a5e', fontSize: '0.9rem' }}>{cat}</span>
                <span style={{ fontSize: '0.75rem', color: '#6b7280', background: '#e5e7eb', borderRadius: '100px', padding: '0.1rem 0.5rem' }}>{catItems.length} dok</span>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e5e7eb' }}>
                    <th style={thStyle}>Judul</th>
                    <th style={thStyle}>Sub-kategori</th>
                    <th style={thStyle}>No. Dokumen</th>
                    <th style={thStyle}>Status</th>
                    <th style={thStyle}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {catItems.map(item => (
                    <tr key={item.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ ...tdStyle, maxWidth: '300px' }}>
                        <div style={{ fontWeight: 600, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</div>
                        {item.document_date && (
                          <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.2rem' }}>
                            {new Date(item.document_date).toLocaleDateString('id-ID')}
                          </div>
                        )}
                      </td>
                      <td style={tdStyle}>
                        {item.subcategory
                          ? <span style={{ fontSize: '0.775rem', background: '#f0fdf4', color: '#15803d', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 600 }}>{item.subcategory}</span>
                          : <span style={{ color: '#d1d5db' }}>—</span>}
                      </td>
                      <td style={{ ...tdStyle, color: '#6b7280', fontSize: '0.8rem' }}>{item.document_number || '—'}</td>
                      <td style={tdStyle}>
                        <span style={{ padding: '0.2rem 0.6rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 600, background: item.is_published ? '#dcfce7' : '#f3f4f6', color: item.is_published ? '#16a34a' : '#6b7280' }}>
                          {item.is_published ? 'Dipublikasikan' : 'Draft'}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                          <Link href={`/ppid/${item.id}`} style={btnEdit}>Edit</Link>
                          <button onClick={() => togglePublish(item.id, !item.is_published)} style={btnSecondary}>
                            {item.is_published ? 'Sembunyikan' : 'Publikasikan'}
                          </button>
                          <button onClick={() => handleDelete(item.id)} style={btnDelete}>Hapus</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const thStyle: React.CSSProperties = { textAlign: 'left', padding: '0.75rem 1rem', fontSize: '0.775rem', color: '#6b7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }
const tdStyle: React.CSSProperties = { padding: '0.875rem 1rem', fontSize: '0.875rem', color: '#374151', verticalAlign: 'middle' }
const btnPrimary: React.CSSProperties = { padding: '0.625rem 1.25rem', background: '#0d2a5e', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', textDecoration: 'none', display: 'inline-block' }
const btnSecondary: React.CSSProperties = { padding: '0.3rem 0.6rem', background: 'white', color: '#374151', border: '1px solid #e5e7eb', borderRadius: '6px', fontWeight: 600, fontSize: '0.775rem', cursor: 'pointer' }
const btnEdit: React.CSSProperties = { padding: '0.3rem 0.6rem', background: '#eff6ff', color: '#1d4ed8', borderRadius: '6px', textDecoration: 'none', fontSize: '0.775rem', fontWeight: 600 }
const btnDelete: React.CSSProperties = { padding: '0.3rem 0.6rem', background: '#fef2f2', color: '#dc2626', border: 'none', borderRadius: '6px', fontSize: '0.775rem', fontWeight: 600, cursor: 'pointer' }
