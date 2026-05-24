'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase, uploadFile } from '@/lib/supabase'
import Link from 'next/link'

const PPID_CATEGORIES = [
  'Informasi Berkala', 'Informasi Serta Merta', 'Informasi Setiap Saat',
  'Informasi Dikecualikan', 'Profil', 'Program Kerja', 'Keuangan', 'Regulasi',
]

export default function EditPPIDPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()
  const isNew = id === 'new'

  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [imageUploading, setImageUploading] = useState(false)

  const [form, setForm] = useState({
    title: '',
    category: PPID_CATEGORIES[0],
    document_number: '',
    document_date: '',
    version: '',
    content_html: '',
    is_published: false,
  })

  const [attachments, setAttachments] = useState<{ id?: string; file_url: string; file_label: string; file_description: string }[]>([])
  const [deletedAttachmentIds, setDeletedAttachmentIds] = useState<string[]>([])
  const [images, setImages] = useState<{ id?: string; image_url: string; caption: string }[]>([])
  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([])
  const [attachUploading, setAttachUploading] = useState(false)

  useEffect(() => {
    if (!isNew) fetchData()
  }, [id])

  async function fetchData() {
    const { data } = await supabase
      .from('ppid')
      .select('*, ppid_attachments(*), ppid_images(*)')
      .eq('id', id)
      .single()
    if (!data) { router.push('/admin/ppid'); return }
    setForm({
      title: data.title ?? '',
      category: data.category ?? PPID_CATEGORIES[0],
      document_number: data.document_number ?? '',
      document_date: data.document_date ?? '',
      version: data.version ?? '',
      content_html: data.content_html ?? '',
      is_published: data.is_published ?? false,
    })
    setAttachments((data.ppid_attachments ?? []).map((a: any) => ({ id: a.id, file_url: a.file_url, file_label: a.file_label ?? '', file_description: a.file_description ?? '' })))
    setImages((data.ppid_images ?? []).map((img: any) => ({ id: img.id, image_url: img.image_url, caption: img.caption ?? '' })))
    setLoading(false)
  }

  async function handleFileUpload(file: File) {
    setAttachUploading(true)
    const path = `ppid/attachments/${Date.now()}-${file.name}`
    const url = await uploadFile('media', path, file)
    if (url) setAttachments(a => [...a, { file_url: url, file_label: file.name, file_description: '' }])
    setAttachUploading(false)
  }

  async function handleImageUpload(files: FileList) {
    setImageUploading(true)
    for (const file of Array.from(files)) {
      const url = await uploadFile('media', `ppid/images/${Date.now()}-${file.name}`, file)
      if (url) setImages(imgs => [...imgs, { image_url: url, caption: '' }])
    }
    setImageUploading(false)
  }

  async function handleSave() {
    if (!form.title || !form.category) { alert('Judul dan kategori wajib diisi.'); return }
    setSaving(true)

    const payload = {
      title: form.title,
      category: form.category,
      document_number: form.document_number || null,
      document_date: form.document_date || null,
      version: form.version || null,
      content_html: form.content_html || null,
      is_published: form.is_published,
    }

    let recordId = id
    if (isNew) {
      const count = await supabase.from('ppid').select('id', { count: 'exact', head: true })
      const { data: newDoc } = await supabase.from('ppid').insert({ ...payload, order_index: count.count ?? 0 }).select().single()
      if (!newDoc) { setSaving(false); alert('Gagal menyimpan.'); return }
      recordId = newDoc.id
    } else {
      await supabase.from('ppid').update(payload).eq('id', id)
    }

    // Attachments
    if (deletedAttachmentIds.length > 0) await supabase.from('ppid_attachments').delete().in('id', deletedAttachmentIds)
    for (const a of attachments) {
      if (!a.id) await supabase.from('ppid_attachments').insert({ ppid_id: recordId, file_url: a.file_url, file_label: a.file_label, file_description: a.file_description })
      else await supabase.from('ppid_attachments').update({ file_label: a.file_label, file_description: a.file_description }).eq('id', a.id)
    }

    // Images
    if (deletedImageIds.length > 0) await supabase.from('ppid_images').delete().in('id', deletedImageIds)
    for (const img of images) {
      if (!img.id) await supabase.from('ppid_images').insert({ ppid_id: recordId, image_url: img.image_url, caption: img.caption })
      else await supabase.from('ppid_images').update({ caption: img.caption }).eq('id', img.id)
    }

    setSaving(false)
    router.push('/admin/ppid')
  }

  if (loading) return <div style={{ padding: '2rem', color: '#6b7280' }}>Memuat...</div>

  return (
    <div style={{ padding: '2rem', maxWidth: '900px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Link href="/admin/ppid" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '0.875rem' }}>← Kembali</Link>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#030f2b', margin: 0 }}>
          {isNew ? 'Tambah Dokumen PPID' : 'Edit Dokumen PPID'}
        </h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Info */}
          <div style={card}>
            <label style={labelStyle}>Judul Dokumen *</label>
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} style={inputStyle} placeholder="Judul dokumen..." />

            <label style={{ ...labelStyle, marginTop: '0.75rem' }}>Kategori *</label>
            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={selectStyle}>
              {PPID_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginTop: '0.75rem' }}>
              <div>
                <label style={labelStyle}>Nomor Dokumen</label>
                <input value={form.document_number} onChange={e => setForm(f => ({ ...f, document_number: e.target.value }))} style={inputStyle} placeholder="001/..." />
              </div>
              <div>
                <label style={labelStyle}>Tanggal Dokumen</label>
                <input type="date" value={form.document_date} onChange={e => setForm(f => ({ ...f, document_date: e.target.value }))} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Versi</label>
                <input value={form.version} onChange={e => setForm(f => ({ ...f, version: e.target.value }))} style={inputStyle} placeholder="v1.0" />
              </div>
            </div>
          </div>

          {/* Konten */}
          <div style={card}>
            <label style={labelStyle}>Konten / Keterangan (HTML)</label>
            <textarea value={form.content_html} onChange={e => setForm(f => ({ ...f, content_html: e.target.value }))} rows={10} style={{ ...inputStyle, resize: 'vertical', fontFamily: 'monospace', fontSize: '0.8rem' }} />
          </div>

          {/* Lampiran */}
          <div style={card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <label style={{ ...labelStyle, marginBottom: 0 }}>Lampiran File</label>
              <label style={{ padding: '0.25rem 0.75rem', background: '#eff6ff', color: '#1d4ed8', borderRadius: '6px', fontSize: '0.775rem', fontWeight: 600, cursor: 'pointer' }}>
                + Upload File
                <input type="file" style={{ display: 'none' }} onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0])} />
              </label>
            </div>
            {attachUploading && <p style={{ color: '#6b7280', fontSize: '0.8rem' }}>Mengupload...</p>}
            {attachments.map((a, i) => (
              <div key={i} style={{ border: '1px solid #e5e7eb', borderRadius: '6px', padding: '0.75rem', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1, marginRight: '0.5rem' }}>
                    <input value={a.file_label} onChange={e => { const na = [...attachments]; na[i].file_label = e.target.value; setAttachments(na) }} placeholder="Label file..." style={{ ...inputStyle, marginBottom: '0.5rem' }} />
                    <input value={a.file_description} onChange={e => { const na = [...attachments]; na[i].file_description = e.target.value; setAttachments(na) }} placeholder="Deskripsi (opsional)..." style={inputStyle} />
                  </div>
                  <button onClick={() => {
                    if (a.id) setDeletedAttachmentIds(ids => [...ids, a.id!])
                    setAttachments(at => at.filter((_, j) => j !== i))
                  }} style={{ padding: '0.4rem 0.6rem', background: '#fef2f2', color: '#dc2626', border: 'none', borderRadius: '6px', cursor: 'pointer', flexShrink: 0 }}>✕</button>
                </div>
                <a href={a.file_url} target="_blank" rel="noreferrer" style={{ fontSize: '0.75rem', color: '#60a5fa' }}>🔗 Lihat file</a>
              </div>
            ))}
            {attachments.length === 0 && <p style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Belum ada lampiran</p>}
          </div>

          {/* Gambar */}
          <div style={card}>
            <label style={labelStyle}>Gambar Pendukung</label>
            <input type="file" accept="image/*" multiple onChange={e => e.target.files && handleImageUpload(e.target.files)} style={{ fontSize: '0.875rem' }} />
            {imageUploading && <p style={{ color: '#6b7280', fontSize: '0.8rem' }}>Mengupload...</p>}
            {images.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginTop: '0.75rem' }}>
                {images.map((img, i) => (
                  <div key={i}>
                    <div style={{ position: 'relative' }}>
                      <img src={img.image_url} alt="" style={{ width: '100%', height: '90px', objectFit: 'cover', borderRadius: '6px' }} />
                      <button onClick={() => {
                        if (img.id) setDeletedImageIds(ids => [...ids, img.id!])
                        setImages(imgs => imgs.filter((_, j) => j !== i))
                      }} style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(220,38,38,0.9)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', padding: '2px 6px', fontSize: '0.7rem' }}>✕</button>
                    </div>
                    <input value={img.caption} onChange={e => { const ni = [...images]; ni[i].caption = e.target.value; setImages(ni) }} placeholder="Caption..." style={{ width: '100%', marginTop: '0.25rem', fontSize: '0.75rem', padding: '0.25rem 0.5rem', border: '1px solid #e5e7eb', borderRadius: '4px', boxSizing: 'border-box' }} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={card}>
            <button onClick={handleSave} disabled={saving} style={btnPrimary}>
              {saving ? 'Menyimpan...' : isNew ? '🚀 Simpan' : '💾 Simpan Perubahan'}
            </button>
            <div style={{ marginTop: '0.75rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={form.is_published} onChange={e => setForm(f => ({ ...f, is_published: e.target.checked }))} />
                Publikasikan dokumen
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const card: React.CSSProperties = { background: 'white', borderRadius: '10px', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }
const labelStyle: React.CSSProperties = { display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }
const inputStyle: React.CSSProperties = { width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }
const selectStyle: React.CSSProperties = { width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '0.875rem', background: 'white' }
const btnPrimary: React.CSSProperties = { padding: '0.625rem', background: '#0d2a5e', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', width: '100%' }