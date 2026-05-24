'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, uploadFile } from '@/lib/supabase'
import Link from 'next/link'

const CATEGORIES = [
  { value: 'kegiatan_umum', label: 'Kegiatan Umum' },
  { value: 'prestasi', label: 'Prestasi' },
  { value: 'kegiatan_organisasi', label: 'Kegiatan Organisasi' },
]

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export default function NewPostPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [userId, setUserId] = useState('')
  const [uploading, setUploading] = useState(false)
  const [galleryUploading, setGalleryUploading] = useState(false)

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
  const [gallery, setGallery] = useState<{ image_url: string; caption: string }[]>([])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setUserId(session.user.id)
    })
  }, [])

  function handleTitleChange(val: string) {
    setForm(f => ({ ...f, title: val, slug: slugify(val) }))
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
      if (url) setGallery(g => [...g, { image_url: url, caption: '' }])
    }
    setGalleryUploading(false)
  }

  function addTag() {
    const t = tagInput.trim()
    if (t && !tags.includes(t)) setTags(ts => [...ts, t])
    setTagInput('')
  }

  async function handleSave(status: string) {
    if (!form.title || !form.category) {
      alert('Judul dan kategori wajib diisi.')
      return
    }
    setSaving(true)

    const { data: post, error } = await supabase.from('posts').insert({
      title: form.title,
      slug: form.slug || slugify(form.title),
      excerpt: form.excerpt,
      content_html: form.content_html,
      category: form.category,
      status,
      featured_image_url: form.featured_image_url || null,
      show_in_slider: form.show_in_slider,
      published_at: status === 'published' ? (form.published_at || new Date().toISOString()) : null,
      author_id: userId,
      seo_meta_title: form.seo_meta_title,
      seo_meta_description: form.seo_meta_description,
    }).select().single()

    if (error) {
      alert('Gagal menyimpan: ' + error.message)
      setSaving(false)
      return
    }

    // Insert tags
    if (tags.length > 0) {
      await supabase.from('posts_tags').insert(tags.map(tag => ({ post_id: post.id, tag })))
    }

    // Insert gallery
    if (gallery.length > 0) {
      await supabase.from('posts_gallery').insert(
        gallery.map((g, i) => ({ post_id: post.id, image_url: g.image_url, caption: g.caption, order_index: i }))
      )
    }

    router.push('/posts')
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '900px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Link href="/posts" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '0.875rem' }}>← Kembali</Link>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#030f2b', margin: 0 }}>Tambah Berita Baru</h1>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem' }}>
        {/* Main column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Judul */}
          <div style={card}>
            <label style={labelStyle}>Judul Berita *</label>
            <input
              value={form.title}
              onChange={e => handleTitleChange(e.target.value)}
              placeholder="Masukkan judul berita..."
              style={{ ...inputStyle, fontSize: '1rem', fontWeight: 600 }}
            />
            <label style={{ ...labelStyle, marginTop: '0.75rem' }}>Slug (URL)</label>
            <input
              value={form.slug}
              onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
              style={inputStyle}
            />
          </div>

          {/* Ringkasan */}
          <div style={card}>
            <label style={labelStyle}>Ringkasan / Excerpt</label>
            <textarea
              value={form.excerpt}
              onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
              placeholder="Ringkasan singkat berita (opsional)..."
              rows={3}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          {/* Konten */}
          <div style={card}>
            <label style={labelStyle}>Konten Berita (HTML)</label>
            <textarea
              value={form.content_html}
              onChange={e => setForm(f => ({ ...f, content_html: e.target.value }))}
              placeholder="<p>Tulis konten berita di sini...</p>"
              rows={14}
              style={{ ...inputStyle, resize: 'vertical', fontFamily: 'monospace', fontSize: '0.8rem' }}
            />
            <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.5rem' }}>
              Mendukung HTML. Gunakan &lt;p&gt;, &lt;h2&gt;, &lt;ul&gt;, &lt;img&gt;, dll.
            </p>
          </div>

          {/* Galeri */}
          <div style={card}>
            <label style={labelStyle}>Galeri Foto</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={e => e.target.files && handleGalleryUpload(e.target.files)}
              style={{ fontSize: '0.875rem' }}
            />
            {galleryUploading && <p style={{ color: '#6b7280', fontSize: '0.8rem' }}>Mengupload...</p>}
            {gallery.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginTop: '1rem' }}>
                {gallery.map((g, i) => (
                  <div key={i} style={{ position: 'relative' }}>
                    <img src={g.image_url} alt="" style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '6px' }} />
                    <input
                      value={g.caption}
                      onChange={e => {
                        const ng = [...gallery]
                        ng[i].caption = e.target.value
                        setGallery(ng)
                      }}
                      placeholder="Caption..."
                      style={{ width: '100%', marginTop: '0.25rem', fontSize: '0.75rem', padding: '0.25rem 0.5rem', border: '1px solid #e5e7eb', borderRadius: '4px' }}
                    />
                    <button onClick={() => setGallery(g => g.filter((_, j) => j !== i))} style={{
                      position: 'absolute', top: '4px', right: '4px',
                      background: 'rgba(220,38,38,0.9)', color: 'white', border: 'none',
                      borderRadius: '4px', cursor: 'pointer', padding: '2px 6px', fontSize: '0.7rem',
                    }}>✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tags */}
          <div style={card}>
            <label style={labelStyle}>Tags</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="Tambah tag, tekan Enter..."
                style={{ ...inputStyle, flex: 1 }}
              />
              <button onClick={addTag} style={btnSecondary}>Tambah</button>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
              {tags.map(t => (
                <span key={t} style={{ padding: '0.2rem 0.6rem', background: '#eff6ff', color: '#1d4ed8', borderRadius: '100px', fontSize: '0.775rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  {t}
                  <button onClick={() => setTags(ts => ts.filter(x => x !== t))} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#1d4ed8', padding: 0, fontSize: '0.9rem' }}>×</button>
                </span>
              ))}
            </div>
          </div>

          {/* SEO */}
          <div style={card}>
            <label style={labelStyle}>SEO Meta Title</label>
            <input value={form.seo_meta_title} onChange={e => setForm(f => ({ ...f, seo_meta_title: e.target.value }))} style={inputStyle} placeholder="Judul SEO (opsional)" />
            <label style={{ ...labelStyle, marginTop: '0.75rem' }}>SEO Meta Description</label>
            <textarea value={form.seo_meta_description} onChange={e => setForm(f => ({ ...f, seo_meta_description: e.target.value }))} rows={3} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Deskripsi SEO..." />
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Publish actions */}
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
              <button onClick={() => handleSave('draft')} disabled={saving} style={btnSecondary}>
                💾 Simpan Draft
              </button>
              <button onClick={() => handleSave('published')} disabled={saving} style={btnPrimary}>
                🚀 {saving ? 'Menyimpan...' : 'Publish'}
              </button>
            </div>
          </div>

          {/* Kategori */}
          <div style={card}>
            <label style={labelStyle}>Kategori *</label>
            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={selectStyle}>
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>

          {/* Featured image */}
          <div style={card}>
            <label style={labelStyle}>Foto Utama</label>
            <input type="file" accept="image/*" onChange={e => e.target.files?.[0] && handleFeaturedImageUpload(e.target.files[0])} style={{ fontSize: '0.8rem' }} />
            {uploading && <p style={{ color: '#6b7280', fontSize: '0.8rem', marginTop: '0.5rem' }}>Mengupload...</p>}
            {form.featured_image_url && (
              <div style={{ marginTop: '0.75rem', position: 'relative' }}>
                <img src={form.featured_image_url} alt="" style={{ width: '100%', borderRadius: '6px', objectFit: 'cover', maxHeight: '180px' }} />
                <button onClick={() => setForm(f => ({ ...f, featured_image_url: '' }))} style={{
                  position: 'absolute', top: '4px', right: '4px',
                  background: 'rgba(220,38,38,0.9)', color: 'white', border: 'none', borderRadius: '4px',
                  cursor: 'pointer', padding: '2px 8px', fontSize: '0.75rem',
                }}>Hapus</button>
              </div>
            )}
            <div style={{ marginTop: '0.75rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem', color: '#374151' }}>
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