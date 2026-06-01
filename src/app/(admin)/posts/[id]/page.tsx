'use client'

import { useState, useEffect, useRef } from 'react'
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

/** Buat tag <figure> untuk disisipkan ke content_html */
function buildImageHtml(url: string, caption: string, width: string) {
  const widthStyle =
    width === 'full' ? 'width:100%;' : width === 'half' ? 'width:50%;' : 'width:33%;'
  const figStyle = `display:block;margin:1.75rem auto;${widthStyle}text-align:center;`
  const imgStyle = `max-width:100%;height:auto;border-radius:8px;box-shadow:0 4px 16px rgba(0,0,0,.08);`
  if (caption.trim()) {
    return `<figure style="${figStyle}"><img src="${url}" alt="${caption}" style="${imgStyle}" /><figcaption style="font-size:.82rem;color:#6b7280;margin-top:.4rem;">${caption}</figcaption></figure>`
  }
  return `<figure style="${figStyle}"><img src="${url}" alt="" style="${imgStyle}" /></figure>`
}

// ─── Modal Sisipkan Gambar ───────────────────────────────────────────────────
interface InsertImageModalProps {
  onClose: () => void
  onInsert: (html: string, position: 'before' | 'after' | 'cursor') => void
  uploadFileFn: (bucket: string, path: string, file: File) => Promise<string | null>
}

function InsertImageModal({ onClose, onInsert, uploadFileFn }: InsertImageModalProps) {
  const [step, setStep] = useState<'upload' | 'options'>('upload')
  const [uploading, setUploading] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [caption, setCaption] = useState('')
  const [width, setWidth] = useState<'full' | 'half' | 'third'>('full')
  const [position, setPosition] = useState<'before' | 'after' | 'cursor'>('cursor')

  async function handleFile(file: File) {
    setUploading(true)
    const path = `posts/inline/${Date.now()}-${file.name}`
    const url = await uploadFileFn('media', path, file)
    if (url) { setImageUrl(url); setStep('options') }
    setUploading(false)
  }

  function handleInsert() {
    onInsert(buildImageHtml(imageUrl, caption, width), position)
    onClose()
  }

  return (
    <div style={overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={modalBox}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#030f2b' }}>
            📷 Sisipkan Gambar ke Konten
          </h3>
          <button onClick={onClose} style={{ border: 'none', background: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#6b7280' }}>×</button>
        </div>

        {step === 'upload' ? (
          <div
            style={{
              border: '2px dashed #d1d5db', borderRadius: '10px', padding: '2.5rem',
              textAlign: 'center', background: '#f9fafb', cursor: 'pointer',
            }}
            onDragOver={e => e.preventDefault()}
            onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }}
          >
            {uploading ? (
              <p style={{ color: '#6b7280', margin: 0 }}>⏳ Mengupload gambar...</p>
            ) : (
              <>
                <p style={{ color: '#9ca3af', fontSize: '2rem', margin: '0 0 .5rem' }}>🖼️</p>
                <p style={{ color: '#374151', fontWeight: 600, margin: '0 0 .25rem', fontSize: '.9rem' }}>Drag & drop gambar di sini</p>
                <p style={{ color: '#9ca3af', fontSize: '.8rem', margin: '0 0 1rem' }}>atau klik tombol di bawah</p>
                <label style={{ display: 'inline-block', padding: '.5rem 1.25rem', background: '#0d2a5e', color: 'white', borderRadius: '8px', fontSize: '.85rem', fontWeight: 600, cursor: 'pointer' }}>
                  Pilih Gambar
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
                </label>
              </>
            )}
          </div>
        ) : (
          <div>
            {/* Preview */}
            <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
              <img src={imageUrl} alt="preview" style={{ maxWidth: '100%', maxHeight: '180px', objectFit: 'contain', borderRadius: '8px', border: '1px solid #e5e7eb' }} />
            </div>

            <label style={labelStyle}>Caption (opsional)</label>
            <input value={caption} onChange={e => setCaption(e.target.value)} placeholder="Tulis keterangan gambar..." style={{ ...inputStyle, marginBottom: '1rem' }} />

            <label style={labelStyle}>Ukuran Gambar</label>
            <div style={{ display: 'flex', gap: '.5rem', marginBottom: '1rem' }}>
              {([
                { val: 'full', label: '↔ Penuh', desc: '100%' },
                { val: 'half', label: '⬛ Sedang', desc: '50%' },
                { val: 'third', label: '▪ Kecil', desc: '33%' },
              ] as const).map(opt => (
                <button key={opt.val} onClick={() => setWidth(opt.val)} style={{
                  flex: 1, padding: '.5rem', border: `2px solid ${width === opt.val ? '#0d2a5e' : '#e5e7eb'}`,
                  borderRadius: '8px', background: width === opt.val ? '#eff6ff' : 'white',
                  cursor: 'pointer', fontSize: '.78rem', fontWeight: 600,
                  color: width === opt.val ? '#0d2a5e' : '#6b7280',
                }}>
                  <div>{opt.label}</div>
                  <div style={{ fontSize: '.7rem', fontWeight: 400, marginTop: '.15rem' }}>{opt.desc}</div>
                </button>
              ))}
            </div>

            <label style={labelStyle}>Posisi Sisipan</label>
            <div style={{ display: 'flex', gap: '.5rem', marginBottom: '1.25rem' }}>
              {([
                { val: 'before', label: '⬆ Awal Konten' },
                { val: 'cursor', label: '✦ Di Sini (kursor)' },
                { val: 'after', label: '⬇ Akhir Konten' },
              ] as const).map(opt => (
                <button key={opt.val} onClick={() => setPosition(opt.val)} style={{
                  flex: 1, padding: '.5rem', border: `2px solid ${position === opt.val ? '#0d2a5e' : '#e5e7eb'}`,
                  borderRadius: '8px', background: position === opt.val ? '#eff6ff' : 'white',
                  cursor: 'pointer', fontSize: '.75rem', fontWeight: 600,
                  color: position === opt.val ? '#0d2a5e' : '#6b7280',
                }}>
                  {opt.label}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '.5rem' }}>
              <button onClick={() => setStep('upload')} style={{ ...btnSecondary, flex: 1 }}>← Ganti Gambar</button>
              <button onClick={handleInsert} style={{ ...btnPrimary, flex: 2 }}>✓ Sisipkan Gambar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function EditPostPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [galleryUploading, setGalleryUploading] = useState(false)
  const [showImageModal, setShowImageModal] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

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
        const { data } = await supabase.from('users').select('role').eq('id', session.user.id).single()
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

  /** Sisipkan HTML gambar ke textarea di posisi yang dipilih */
  function handleInsertImage(html: string, position: 'before' | 'after' | 'cursor') {
    const ta = textareaRef.current
    const current = form.content_html
    let newContent = current

    if (position === 'before') {
      newContent = html + '\n' + current
    } else if (position === 'after') {
      newContent = current + '\n' + html
    } else {
      if (ta) {
        const start = ta.selectionStart ?? current.length
        newContent = current.slice(0, start) + '\n' + html + '\n' + current.slice(start)
      } else {
        newContent = current + '\n' + html
      }
    }

    setForm(f => ({ ...f, content_html: newContent }))
    setTimeout(() => { if (ta) ta.focus() }, 50)
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

    if (deletedTagIds.length > 0) await supabase.from('posts_tags').delete().in('id', deletedTagIds)
    const newTags = tags.filter(t => !existingTagIds[t])
    if (newTags.length > 0) await supabase.from('posts_tags').insert(newTags.map(tag => ({ post_id: id, tag })))

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
      {showImageModal && (
        <InsertImageModal
          onClose={() => setShowImageModal(false)}
          onInsert={handleInsertImage}
          uploadFileFn={uploadFile}
        />
      )}

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

          {/* Konten dengan tombol Sisipkan Gambar */}
          <div style={card}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <label style={{ ...labelStyle, marginBottom: 0 }}>Konten (HTML)</label>
              <button
                onClick={() => setShowImageModal(true)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '.35rem',
                  padding: '.35rem .75rem', background: '#eff6ff', color: '#0d2a5e',
                  border: '1px solid #bfdbfe', borderRadius: '6px',
                  fontSize: '.78rem', fontWeight: 700, cursor: 'pointer',
                }}
                title="Sisipkan gambar ke dalam konten"
              >
                📷 Sisipkan Gambar
              </button>
            </div>
            <textarea
              ref={textareaRef}
              value={form.content_html}
              onChange={e => setForm(f => ({ ...f, content_html: e.target.value }))}
              rows={14}
              style={{ ...inputStyle, resize: 'vertical', fontFamily: 'monospace', fontSize: '0.8rem' }}
            />
            <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.5rem' }}>
              Klik <strong>Sisipkan Gambar</strong> lalu posisikan kursor di textarea sebelum membuka modal untuk sisipan tepat.
            </p>
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

// ─── Styles ──────────────────────────────────────────────────────────────────
const overlay: React.CSSProperties = {
  position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  zIndex: 9999, padding: '1rem',
}
const modalBox: React.CSSProperties = {
  background: 'white', borderRadius: '14px', padding: '1.5rem',
  width: '100%', maxWidth: '480px', boxShadow: '0 20px 60px rgba(0,0,0,.2)',
  maxHeight: '90vh', overflowY: 'auto',
}
const card: React.CSSProperties = { background: 'white', borderRadius: '10px', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }
const labelStyle: React.CSSProperties = { display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }
const inputStyle: React.CSSProperties = { width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }
const selectStyle: React.CSSProperties = { width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '0.875rem', outline: 'none', background: 'white' }
const btnPrimary: React.CSSProperties = { padding: '0.625rem', background: '#0d2a5e', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', width: '100%' }
const btnSecondary: React.CSSProperties = { padding: '0.5rem 1rem', background: 'white', color: '#374151', border: '1px solid #e5e7eb', borderRadius: '8px', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }