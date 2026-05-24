'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function EkstrakurikulerPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [role, setRole] = useState('')
  const [userId, setUserId] = useState('')
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
    const { data } = await supabase.from('ekstrakurikuler').select('*').order('order_index')
    setItems(data ?? [])
    setLoading(false)
  }

  async function toggleActive(id: string, val: boolean) {
    await supabase.from('ekstrakurikuler').update({ is_active: val }).eq('id', id)
    setItems(items.map(i => i.id === id ? { ...i, is_active: val } : i))
  }

  async function handleDelete(id: string) {
    if (!confirm('Hapus ekstrakurikuler ini?')) return
    if (role === 'admin') {
      await supabase.from('ekstrakurikuler').delete().eq('id', id)
      fetchItems()
    } else {
      await supabase.from('delete_requests').insert({ collection_slug: 'ekstrakurikuler', doc_id: id, requested_by: userId, status: 'pending' })
      alert('Permintaan hapus telah dikirim.')
    }
  }

  async function moveItem(id: string, dir: 'up' | 'down') {
    const idx = items.findIndex(i => i.id === id)
    if (dir === 'up' && idx === 0) return
    if (dir === 'down' && idx === items.length - 1) return
    const swapIdx = dir === 'up' ? idx - 1 : idx + 1
    const newItems = [...items]
    ;[newItems[idx], newItems[swapIdx]] = [newItems[swapIdx], newItems[idx]]
    setItems(newItems)
    await supabase.from('ekstrakurikuler').update({ order_index: swapIdx }).eq('id', newItems[idx].id)
    await supabase.from('ekstrakurikuler').update({ order_index: idx }).eq('id', newItems[swapIdx].id)
  }

  const filtered = items.filter(i => search === '' || i.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#030f2b', margin: 0 }}>Ekstrakurikuler</h1>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: '0.25rem 0 0' }}>{items.length} ekstrakurikuler terdaftar</p>
        </div>
        <Link href="/ekstrakurikuler/new" style={btnPrimary}>+ Tambah Ekskul</Link>
      </div>

      <div style={{ marginBottom: '1.25rem' }}>
        <input
          type="text"
          placeholder="Cari ekstrakurikuler..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ padding: '0.5rem 0.875rem', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '0.875rem', outline: 'none', width: '280px', background: 'white' }}
        />
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', color: '#9ca3af', padding: '3rem' }}>Memuat...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          {filtered.map((item, idx) => (
            <div key={item.id} style={{ ...card, opacity: item.is_active ? 1 : 0.65 }}>
              {item.cover_image_url && (
                <img src={item.cover_image_url} alt={item.name} style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '6px', marginBottom: '0.75rem' }} />
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '1rem', color: '#111827' }}>{item.name}</div>
                  {item.category && <div style={{ fontSize: '0.775rem', color: '#6b7280', marginTop: '0.2rem' }}>{item.category}</div>}
                  <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.4rem' }}>👨‍🏫 {item.pembina}</div>
                  {item.schedule_hari?.length > 0 && (
                    <div style={{ fontSize: '0.775rem', color: '#6b7280', marginTop: '0.2rem' }}>📅 {item.schedule_hari.join(', ')}</div>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginLeft: '0.5rem' }}>
                  <button onClick={() => moveItem(item.id, 'up')} disabled={idx === 0} style={btnOrder}>▲</button>
                  <button onClick={() => moveItem(item.id, 'down')} disabled={idx === filtered.length - 1} style={btnOrder}>▼</button>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #f3f4f6' }}>
                <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '100px', background: item.is_active ? '#dcfce7' : '#f3f4f6', color: item.is_active ? '#16a34a' : '#6b7280', fontWeight: 600 }}>
                  {item.is_active ? 'Aktif' : 'Nonaktif'}
                </span>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <Link href={`/ekstrakurikuler/${item.id}`} style={btnEdit}>Edit</Link>
                  <button onClick={() => toggleActive(item.id, !item.is_active)} style={btnSecondary}>
                    {item.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                  </button>
                  <button onClick={() => handleDelete(item.id)} style={btnDelete}>Hapus</button>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#9ca3af', padding: '3rem' }}>Tidak ada ekstrakurikuler ditemukan</div>
          )}
        </div>
      )}
    </div>
  )
}

const card: React.CSSProperties = { background: 'white', borderRadius: '10px', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }
const btnPrimary: React.CSSProperties = { padding: '0.625rem 1.25rem', background: '#0d2a5e', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', textDecoration: 'none', display: 'inline-block' }
const btnSecondary: React.CSSProperties = { padding: '0.3rem 0.6rem', background: 'white', color: '#374151', border: '1px solid #e5e7eb', borderRadius: '6px', fontWeight: 600, fontSize: '0.75rem', cursor: 'pointer' }
const btnEdit: React.CSSProperties = { padding: '0.3rem 0.6rem', background: '#eff6ff', color: '#1d4ed8', borderRadius: '6px', textDecoration: 'none', fontSize: '0.75rem', fontWeight: 600 }
const btnDelete: React.CSSProperties = { padding: '0.3rem 0.6rem', background: '#fef2f2', color: '#dc2626', border: 'none', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }
const btnOrder: React.CSSProperties = { padding: '0.15rem 0.4rem', border: '1px solid #e5e7eb', borderRadius: '4px', background: 'white', cursor: 'pointer', fontSize: '0.7rem', color: '#6b7280' }