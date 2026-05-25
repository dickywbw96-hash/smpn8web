'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase, uploadFile } from '@/lib/supabase'
import Link from 'next/link'

const CATEGORIES = [
  { value: 'kegiatan_umum', label: 'Kegiatan Umum' },
  { value: 'prestasi', label: 'Prestasi' },
  { value: 'kegiatan_organisasi', label: 'Kegiatan Organisasi' },
  { value: 'artikel', label: 'Artikel' },
]

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()
}

export default function EditPostPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [galleryUploading, setGalleryUploading] = useState(false)
  const [role, setRole] = useState('')
  const [userId, setUserId] = useState('')

  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content_html: '',
    category: 'kegiatan_umum',
    status: 'draft',
    featured_image_url: '',
    show_in_slider: false,
    published_at: '',
    seo_meta_title: '',
    seo_meta_description: '',
  })
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [gallery, setGallery] = useState<{ id?: string; image_url: string; caption: string; order_index: number }[]>([])
  const [deletedGalleryIds, setDeletedGalleryIds] = useState<string[]>([])
  const [deletedTagIds, setDeletedTagIds] = useState<string[]>([])
  const [existingTagIds, setExistingTagIds] = useState<Record<string, string>>({})

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setUserId(session.user.id)
        const { data } = await supabase.from('users').select('role').eq('id', session.user.id).single()
        setRole(data?.role ?? '')
      }
      await fetchPost()
    }
    init()
  }, [id])

  async function fetchPost() {
    const { data } = await supabase
      .from('posts')
      .select('*, posts_gallery(*), posts_tags(*)')
      .eq('id', id)
      .single()

    if (!data) { router.push('/posts'); return }

    setForm({
      title: data.title ?? '',
      slug: data.slug ?? '',
      excerpt: data.excerpt ?? '',
      content_html: data.content_html ?? '',
      category: data.category ?? 'kegiatan_umum',
      status: data.status ?? 'draft',
      featured_image_url: data.featured_image_url ?? '',
      show_in_slider: data.show_in_slider ?? false,
      published_at: data.published_at ? data.published_at.slice(0, 16) : '',
      seo_meta_title: data.seo_meta_title ?? '',
      seo_meta_description: data.seo_meta_description ?? '',
    })

    const tagMap: Record<string, string> = {}
    const tagList = (data.posts_tags ?? []).map((t: any) => { tagMap[t.tag] = t.id; return t.tag })
    setTags(tagList)
    setExistingTagIds(tagMap)

    setGallery((data.posts_gallery ?? []).sort((a: any, b: any) => a.order_index - b.order_index).map((g: any) => ({
      id: g.id, image_url: g.image_url, caption: g.caption ?? '', order_index: g.order_index,
    })))
    setLoading(false)
  }

  async function handleFeaturedImageUpload(file: File) {
    setUploading(true)
    const path = `posts/${Date.now()}-${file.name}`
    const url = await uploadFile('media', path, file)
    if (url) setForm(f => ({ ...f, featured_image_url: url }))
    setUploading(false)
  }

  async function handleGalleryUpload(files: FileList) {
    setGalleryUploading(true)
    for (const file of Array.from(files)) {
      const path = `posts/gallery/${Date.now()}-${file.name}`
      const url = await uploadFile('media', path, file)
      if (url) setGallery(g => [...g, { image_url: url, caption: '', order_index: g.length }])
    }
    setGalleryUploading(false)
  }

  function addTag() {
    const t = tagInput.trim()
    if (t && !tags.includes(t)) setTags(ts => [...ts, t])
    setTagInput('')
  }

  function removeTag(t: string) {
    if (existingTagIds[t]) setDeletedTagIds(ids => [...ids, existingTagIds[t]])
    setTags(ts => ts.filter(x => x !== t))
  }

  function removeGallery(i: number) {
    const item = gallery[i]
    if (item.id) setDeletedGalleryIds(ids => [...ids, item.id!])
    setGallery(g => g.filter((_, j) => j !== i))
  }

  async function handleSave(status?: string) {
    setSaving(true)
    const finalStatus = status ?? form.status

    await supabase.from('posts').update({
      title: form.title,
      slug: form.slug,
      excerpt: form.excerpt,
      content_html: form.content_html,
      category: form.category,
      status: finalStatus,
      featured_image_url: form.featured_image_url || null,
      show_in_slider: form.show_in_slider,
      published_at: finalStatus === 'published' ? (form.published_at || new Date().toISOString()) : null,
      seo_meta_title: form.seo_meta_title,
      seo_meta_description: form.seo_meta_description,
      updated_at: new Date().toISOString(),
    }).eq('id', id)

    // Tags: delete removed, insert new
    if (deletedTagIds.length > 0) await supabase.from('posts_tags').delete().in('id', deletedTagIds)
    const newTags = tags.filter(t => !existingTagIds[t])
    if (newTags.length > 0) await supabase.from('posts_tags').insert(newTags.map(tag => ({ post_id: id, tag })))

    // Gallery: delete removed, upsert existing
    if (deletedGalleryIds.length > 0) await supabase.from('posts_gallery').delete().in('id', deletedGalleryIds)
    for (const [i, g] of gallery.entries()) {
      if (g.id) {
        await supabase.from('posts_gallery').update({ caption: g.caption, order_index: i }).eq('id', g.id)
      } else {
        await supabase.from('posts_gallery').insert({ post_id: id, image_url: g.image_url, caption: g.caption, order_index: i })
      }
    }

    setSaving(false)
    router.push('/posts')
  }

  if (loading) return <div style={{ padding: '2rem', color: '#6b7280' }}>Memuat...</div>

  return (
    <div style={{ padding: '2rem', maxWidth: '900px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Link href="/posts" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '0.875rem' }}>← Kembali</Link>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#030f2b', margin: 0 }}>Edit Berita</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem' }}>
        {/* Main column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={card}>
            <label style={labelStyle}>Judul Berita *</label>
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} style={{ ...inputStyle, fontSize: '1rem', fontWeight: 600 }} />
            <label style={{ ...labelStyle, marginTop: '0.75rem' }}>Slug</label>
            <input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} style={inputStyle} />
          </div>

          <div style={card}>
            <label style={labelStyle}>Ringkasan</label>
            <textarea value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
          </div>

          <div style={card}>
            <label style={labelStyle}>Konten (HTML)</label>
            <textarea value={form.content_html} onChange={e => setForm(f => ({ ...f, content_html: e.target.value }))} rows={14} style={{ ...inputStyle, resize: 'vertical', fontFamily: 'monospace', fontSize: '0.8rem' }} />
          </div>

          {/* Gallery */}
          <div style={card}>
            <label style={labelStyle}>Galeri Foto</label>
            <input type="file" accept="image/*" multiple onChange={e => e.target.files && handleGalleryUpload(e.target.files)} style={{ fontSize: '0.875rem' }} />
            {galleryUploading && <p style={{ color: '#6b7280', fontSize: '0.8rem' }}>Mengupload...</p>}
            {gallery.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginTop: '1rem' }}>
                {gallery.map((g, i) => (
                  <div key={i}>
                    <div style={{ position: 'relative' }}>
                      <img src={g.image_url} alt="" style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '6px' }} />
                      <button onClick={() => removeGallery(i)} style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(220,38,38,0.9)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', padding: '2px 6px', fontSize: '0.7rem' }}>✕</button>
                    </div>
                    <input value={g.caption} onChange={e => { const ng = [...gallery]; ng[i].caption = e.target.value; setGallery(ng) }} placeholder="Caption..." style={{ width: '100%', marginTop: '0.25rem', fontSize: '0.75rem', padding: '0.25rem 0.5rem', border: '1px solid #e5e7eb', borderRadius: '4px', boxSizing: 'border-box' }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tags */}
          <div style={card}>
            <label style={labelStyle}>Tags</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())} placeholder="Tambah tag..." style={{ ...inputStyle, flex: 1 }} />
              <button onClick={addTag} style={btnSecondary}>Tambah</button>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
              {tags.map(t => (
                <span key={t} style={{ padding: '0.2rem 0.6rem', background: '#eff6ff', color: '#1d4ed8', borderRadius: '100px', fontSize: '0.775rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  {t}
                  <button onClick={() => removeTag(t)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#1d4ed8', padding: 0 }}>×</button>
                </span>
              ))}
            </div>
          </div>

          {/* SEO */}
          <div style={card}>
            <label style={labelStyle}>SEO Meta Title</label>
            <input value={form.seo_meta_title} onChange={e => setForm(f => ({ ...f, seo_meta_title: e.target.value }))} style={inputStyle} />
            <label style={{ ...labelStyle, marginTop: '0.75rem' }}>SEO Meta Description</label>
            <textarea value={form.seo_meta_description} onChange={e => setForm(f => ({ ...f, seo_meta_description: e.target.value }))} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={card}>
            <label style={labelStyle}>Status</label>
            <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} style={selectStyle}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Arsip</option>
            </select>
            {form.status === 'published' && (
              <>
                <label style={{ ...labelStyle, marginTop: '0.75rem' }}>Tanggal Publish</label>
                <input type="datetime-local" value={form.published_at} onChange={e => setForm(f => ({ ...f, published_at: e.target.value }))} style={inputStyle} />
              </>
            )}
            <button onClick={() => handleSave()} disabled={saving} style={{ ...btnPrimary, marginTop: '1rem' }}>
              {saving ? 'Menyimpan...' : '💾 Simpan Perubahan'}
            </button>
          </div>

          <div style={card}>
            <label style={labelStyle}>Kategori *</label>
            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={selectStyle}>
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>

          <div style={card}>
            <label style={labelStyle}>Foto Utama</label>
            <input type="file" accept="image/*" onChange={e => e.target.files?.[0] && handleFeaturedImageUpload(e.target.files[0])} style={{ fontSize: '0.8rem' }} />
            {uploading && <p style={{ color: '#6b7280', fontSize: '0.8rem', marginTop: '0.5rem' }}>Mengupload...</p>}
            {form.featured_image_url && (
              <div style={{ marginTop: '0.75rem', position: 'relative' }}>
                <img src={form.featured_image_url} alt="" style={{ width: '100%', borderRadius: '6px', objectFit: 'cover', maxHeight: '180px' }} />
                <button onClick={() => setForm(f => ({ ...f, featured_image_url: '' }))} style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(220,38,38,0.9)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', padding: '2px 8px', fontSize: '0.75rem' }}>Hapus</button>
              </div>
            )}
            <div style={{ marginTop: '0.75rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                <input type="checkbox" checked={form.show_in_slider} onChange={e => setForm(f => ({ ...f, show_in_slider: e.target.checked }))} />
                Tampilkan di slider
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
const selectStyle: React.CSSProperties = { width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '0.875rem', outline: 'none', background: 'white' }
const btnPrimary: React.CSSProperties = { padding: '0.625rem', background: '#0d2a5e', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', width: '100%' }
const btnSecondary: React.CSSProperties = { padding: '0.5rem 1rem', background: 'white', color: '#374151', border: '1px solid #e5e7eb', borderRadius: '8px', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }