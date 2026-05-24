'use client'

import { useEffect, useState } from 'react'
import { supabase, uploadFile } from '@/lib/supabase'
import Link from 'next/link'

export default function SliderPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [uploading, setUploading] = useState(false)

  const [form, setForm] = useState({
    title: '',
    description: '',
    image_url: '',
    link_type: 'none',
    link_url: '',
    is_active: true,
  })

  useEffect(() => { fetchItems() }, [])

  async function fetchItems() {
    const { data } = await supabase.from('slider_dashboard').select('*').order('order_index')
    setItems(data ?? [])
    setLoading(false)
  }

  async function handleImageUpload(file: File) {
    setUploading(true)
    const path = `slider/${Date.now()}-${file.name}`
    const url = await uploadFile('media', path, file)
    if (url) setForm(f => ({ ...f, image_url: url }))
    setUploading(false)
  }

  async function handleAdd() {
    if (!form.image_url) { alert('Upload gambar dulu.'); return }
    const maxOrder = items.length > 0 ? Math.max(...items.map(i => i.order_index ?? 0)) + 1 : 0
    await supabase.from('slider_dashboard').insert({
      title: form.title,
      description: form.description,
      image_url: form.image_url,
      link_type: form.link_type,
      link_url: form.link_type === 'custom' ? form.link_url : null,
      is_active: form.is_active,
      order_index: maxOrder,
    })
    setForm({ title: '', description: '', image_url: '', link_type: 'none', link_url: '', is_active: true })
    setAdding(false)
    fetchItems()
  }

  async function toggleActive(id: string, val: boolean) {
    await supabase.from('slider_dashboard').update({ is_active: val }).eq('id', id)
    setItems(items.map(i => i.id === id ? { ...i, is_active: val } : i))
  }

  async function handleDelete(id: string) {
    if (!confirm('Hapus slider ini?')) return
    await supabase.from('slider_dashboard').delete().eq('id', id)
    fetchItems()
  }

  async function moveItem(id: string, dir: 'up' | 'down') {
    const idx = items.findIndex(i => i.id === id)
    if (dir === 'up' && idx === 0) return
    if (dir === 'down' && idx === items.length - 1) return
    const swapIdx = dir === 'up' ? idx - 1 : idx + 1
    const newItems = [...items]
    ;[newItems[idx], newItems[swapIdx]] = [newItems[swapIdx], newItems[idx]]
    setItems(newItems)
    await supabase.from('slider_dashboard').update({ order_index: swapIdx }).eq('id', newItems[idx].id)
    await supabase.from('slider_dashboard').update({ order_index: idx }).eq('id', newItems[swapIdx].id)
  }

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#030f2b', margin: 0 }}>Slider Dashboard</h1>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: '0.25rem 0 0' }}>{items.length} slide</p>
        </div>
        <button onClick={() => setAdding(!adding)} style={btnPrimary}>
          {adding ? '✕ Batal' : '+ Tambah Slide'}
        </button>
      </div>

      {/* Add form */}
      {adding && (
        <div style={{ ...card, marginBottom: '1.5rem', border: '2px solid #bfdbfe' }}>
          <h3 style={{ margin: '0 0 1rem', fontSize: '1rem', fontWeight: 700, color: '#030f2b' }}>Tambah Slide Baru</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Judul</label>
              <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} style={inputStyle} placeholder="Judul slide..." />
            </div>
            <div>
              <label style={labelStyle}>Link Type</label>
              <select value={form.link_type} onChange={e => setForm(f => ({ ...f, link_type: e.target.value }))} style={selectStyle}>
                <option value="none">Tidak ada link</option>
                <option value="custom">URL Custom</option>
              </select>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Deskripsi</label>
              <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} style={inputStyle} placeholder="Deskripsi singkat..." />
            </div>
            {form.link_type === 'custom' && (
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>URL</label>
                <input value={form.link_url} onChange={e => setForm(f => ({ ...f, link_url: e.target.value }))} style={inputStyle} placeholder="https://..." />
              </div>
            )}
            <div>
              <label style={labelStyle}>Gambar *</label>
              <input type="file" accept="image/*" onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0])} style={{ fontSize: '0.875rem' }} />
              {uploading && <p style={{ color: '#6b7280', fontSize: '0.8rem', marginTop: '0.25rem' }}>Mengupload...</p>}
              {form.image_url && <img src={form.image_url} alt="" style={{ marginTop: '0.5rem', width: '100%', maxHeight: '120px', objectFit: 'cover', borderRadius: '6px' }} />}
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} />
                Aktif
              </label>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
            <button onClick={handleAdd} style={btnPrimary}>Simpan Slide</button>
            <button onClick={() => setAdding(false)} style={btnSecondary}>Batal</button>
          </div>
        </div>
      )}

      {/* Slider list */}
      {loading ? (
        <div style={{ textAlign: 'center', color: '#9ca3af', padding: '3rem' }}>Memuat...</div>
      ) : items.length === 0 ? (
        <div style={{ ...card, textAlign: 'center', color: '#9ca3af', padding: '3rem' }}>Belum ada slider. Tambah slide pertama!</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {items.map((item, idx) => (
            <div key={item.id} style={{ ...card, display: 'flex', alignItems: 'center', gap: '1rem', opacity: item.is_active ? 1 : 0.6 }}>
              {/* Order controls */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <button onClick={() => moveItem(item.id, 'up')} disabled={idx === 0} style={btnOrder}>▲</button>
                <button onClick={() => moveItem(item.id, 'down')} disabled={idx === items.length - 1} style={btnOrder}>▼</button>
              </div>
              {/* Image */}
              <img src={item.image_url} alt={item.title} style={{ width: '140px', height: '80px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0 }} />
              {/* Info */}
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: '#111827', fontSize: '0.95rem' }}>{item.title || <span style={{ color: '#9ca3af' }}>Tanpa judul</span>}</div>
                {item.description && <div style={{ color: '#6b7280', fontSize: '0.8rem', marginTop: '0.25rem' }}>{item.description}</div>}
                {item.link_type !== 'none' && <div style={{ fontSize: '0.75rem', color: '#60a5fa', marginTop: '0.25rem' }}>🔗 {item.link_url}</div>}
                <div style={{ marginTop: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', padding: '0.15rem 0.5rem', borderRadius: '100px', background: item.is_active ? '#dcfce7' : '#f3f4f6', color: item.is_active ? '#16a34a' : '#6b7280', fontWeight: 600 }}>
                    {item.is_active ? 'Aktif' : 'Nonaktif'}
                  </span>
                </div>
              </div>
              {/* Actions */}
              <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                <Link href={`/slider/${item.id}`} style={btnEdit}>Edit</Link>
                <button onClick={() => toggleActive(item.id, !item.is_active)} style={btnSecondary}>
                  {item.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                </button>
                <button onClick={() => handleDelete(item.id)} style={btnDelete}>Hapus</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const card: React.CSSProperties = { background: 'white', borderRadius: '10px', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }
const labelStyle: React.CSSProperties = { display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }
const inputStyle: React.CSSProperties = { width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }
const selectStyle: React.CSSProperties = { width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '0.875rem', background: 'white' }
const btnPrimary: React.CSSProperties = { padding: '0.625rem 1.25rem', background: '#0d2a5e', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer' }
const btnSecondary: React.CSSProperties = { padding: '0.4rem 0.875rem', background: 'white', color: '#374151', border: '1px solid #e5e7eb', borderRadius: '6px', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }
const btnEdit: React.CSSProperties = { padding: '0.4rem 0.875rem', background: '#eff6ff', color: '#1d4ed8', borderRadius: '6px', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 600 }
const btnDelete: React.CSSProperties = { padding: '0.4rem 0.875rem', background: '#fef2f2', color: '#dc2626', border: 'none', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }
const btnOrder: React.CSSProperties = { padding: '0.15rem 0.4rem', border: '1px solid #e5e7eb', borderRadius: '4px', background: 'white', cursor: 'pointer', fontSize: '0.7rem', color: '#6b7280' }