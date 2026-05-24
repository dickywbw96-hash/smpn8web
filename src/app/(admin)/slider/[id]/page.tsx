'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase, uploadFile } from '@/lib/supabase'
import Link from 'next/link'

export default function EditSliderPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  const [form, setForm] = useState({
    title: '',
    description: '',
    image_url: '',
    link_type: 'none',
    link_url: '',
    is_active: true,
    order_index: 0,
  })

  useEffect(() => { fetchItem() }, [id])

  async function fetchItem() {
    const { data } = await supabase.from('slider_dashboard').select('*').eq('id', id).single()
    if (!data) { router.push('/admin/slider'); return }
    setForm({
      title: data.title ?? '',
      description: data.description ?? '',
      image_url: data.image_url ?? '',
      link_type: data.link_type ?? 'none',
      link_url: data.link_url ?? '',
      is_active: data.is_active ?? true,
      order_index: data.order_index ?? 0,
    })
    setLoading(false)
  }

  async function handleImageUpload(file: File) {
    setUploading(true)
    const path = `slider/${Date.now()}-${file.name}`
    const url = await uploadFile('media', path, file)
    if (url) setForm(f => ({ ...f, image_url: url }))
    setUploading(false)
  }

  async function handleSave() {
    if (!form.image_url) { alert('Gambar wajib ada.'); return }
    setSaving(true)
    await supabase.from('slider_dashboard').update({
      title: form.title,
      description: form.description,
      image_url: form.image_url,
      link_type: form.link_type,
      link_url: form.link_type === 'custom' ? form.link_url : null,
      is_active: form.is_active,
    }).eq('id', id)
    setSaving(false)
    router.push('/admin/slider')
  }

  if (loading) return <div style={{ padding: '2rem', color: '#6b7280' }}>Memuat...</div>

  return (
    <div style={{ padding: '2rem', maxWidth: '600px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Link href="/admin/slider" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '0.875rem' }}>← Kembali</Link>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#030f2b', margin: 0 }}>Edit Slider</h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={card}>
          <label style={labelStyle}>Judul</label>
          <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} style={inputStyle} placeholder="Judul slide..." />
          <label style={{ ...labelStyle, marginTop: '0.75rem' }}>Deskripsi</label>
          <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Deskripsi singkat..." />
        </div>

        <div style={card}>
          <label style={labelStyle}>Gambar Slider *</label>
          <input type="file" accept="image/*" onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0])} style={{ fontSize: '0.875rem' }} />
          {uploading && <p style={{ color: '#6b7280', fontSize: '0.8rem', marginTop: '0.5rem' }}>Mengupload...</p>}
          {form.image_url && (
            <img src={form.image_url} alt="" style={{ marginTop: '0.75rem', width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px' }} />
          )}
          <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.5rem' }}>Rekomendasi: 1200×450px atau rasio 16:6</p>
        </div>

        <div style={card}>
          <label style={labelStyle}>Tipe Link</label>
          <select value={form.link_type} onChange={e => setForm(f => ({ ...f, link_type: e.target.value }))} style={selectStyle}>
            <option value="none">Tidak ada link</option>
            <option value="custom">URL Custom</option>
          </select>
          {form.link_type === 'custom' && (
            <>
              <label style={{ ...labelStyle, marginTop: '0.75rem' }}>URL</label>
              <input value={form.link_url} onChange={e => setForm(f => ({ ...f, link_url: e.target.value }))} style={inputStyle} placeholder="https://..." />
            </>
          )}
          <div style={{ marginTop: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', cursor: 'pointer' }}>
              <input type="checkbox" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} />
              Aktifkan slide ini
            </label>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={handleSave} disabled={saving} style={btnPrimary}>
            {saving ? 'Menyimpan...' : '💾 Simpan Perubahan'}
          </button>
          <Link href="/admin/slider" style={btnSecondary}>Batal</Link>
        </div>
      </div>
    </div>
  )
}

const card: React.CSSProperties = { background: 'white', borderRadius: '10px', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }
const labelStyle: React.CSSProperties = { display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }
const inputStyle: React.CSSProperties = { width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }
const selectStyle: React.CSSProperties = { width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '0.875rem', background: 'white' }
const btnPrimary: React.CSSProperties = { padding: '0.625rem 1.5rem', background: '#0d2a5e', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer' }
const btnSecondary: React.CSSProperties = { padding: '0.625rem 1.5rem', background: 'white', color: '#374151', border: '1px solid #e5e7eb', borderRadius: '8px', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none', display: 'inline-block' }