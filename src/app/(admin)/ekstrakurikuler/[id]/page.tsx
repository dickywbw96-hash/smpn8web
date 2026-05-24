'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase, uploadFile } from '@/lib/supabase'
import Link from 'next/link'

const HARI_OPTIONS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()
}

export default function EditEkskulPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()
  const isNew = id === 'new'

  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [coverUploading, setCoverUploading] = useState(false)
  const [galleryUploading, setGalleryUploading] = useState(false)

  const [form, setForm] = useState({
    name: '',
    slug: '',
    category: '',
    cover_image_url: '',
    pembina: '',
    pembina_nip: '',
    schedule_hari: [] as string[],
    schedule_waktu: '',
    schedule_tempat: '',
    description_html: '',
    is_active: true,
  })

  const [gallery, setGallery] = useState<{ id?: string; image_url: string; caption: string }[]>([])
  const [deletedGalleryIds, setDeletedGalleryIds] = useState<string[]>([])
  const [achievements, setAchievements] = useState<{ id?: string; title: string; year: string; level: string }[]>([])
  const [deletedAchievementIds, setDeletedAchievementIds] = useState<string[]>([])

  useEffect(() => {
    if (!isNew) fetchData()
  }, [id])

  async function fetchData() {
    const { data } = await supabase
      .from('ekstrakurikuler')
      .select('*, ekstrakurikuler_gallery(*), ekstrakurikuler_achievements(*)')
      .eq('id', id)
      .single()
    if (!data) { router.push('/ekstrakurikuler'); return }

    setForm({
      name: data.name ?? '',
      slug: data.slug ?? '',
      category: data.category ?? '',
      cover_image_url: data.cover_image_url ?? '',
      pembina: data.pembina ?? '',
      pembina_nip: data.pembina_nip ?? '',
      schedule_hari: data.schedule_hari ?? [],
      schedule_waktu: data.schedule_waktu ?? '',
      schedule_tempat: data.schedule_tempat ?? '',
      description_html: data.description_html ?? '',
      is_active: data.is_active ?? true,
    })
    setGallery((data.ekstrakurikuler_gallery ?? []).map((g: any) => ({ id: g.id, image_url: g.image_url, caption: g.caption ?? '' })))
    setAchievements((data.ekstrakurikuler_achievements ?? []).map((a: any) => ({ id: a.id, title: a.title ?? '', year: a.year ?? '', level: a.level ?? '' })))
    setLoading(false)
  }

  function toggleHari(h: string) {
    setForm(f => ({
      ...f,
      schedule_hari: f.schedule_hari.includes(h) ? f.schedule_hari.filter(x => x !== h) : [...f.schedule_hari, h]
    }))
  }

  async function handleCoverUpload(file: File) {
    setCoverUploading(true)
    const url = await uploadFile('media', `ekskul/${Date.now()}-${file.name}`, file)
    if (url) setForm(f => ({ ...f, cover_image_url: url }))
    setCoverUploading(false)
  }

  async function handleGalleryUpload(files: FileList) {
    setGalleryUploading(true)
    for (const file of Array.from(files)) {
      const url = await uploadFile('media', `ekskul/gallery/${Date.now()}-${file.name}`, file)
      if (url) setGallery(g => [...g, { image_url: url, caption: '' }])
    }
    setGalleryUploading(false)
  }

  async function handleSave() {
    if (!form.name || !form.pembina) { alert('Nama dan pembina wajib diisi.'); return }
    setSaving(true)

    const payload = {
      name: form.name,
      slug: form.slug || slugify(form.name),
      category: form.category,
      cover_image_url: form.cover_image_url || null,
      pembina: form.pembina,
      pembina_nip: form.pembina_nip || null,
      schedule_hari: form.schedule_hari,
      schedule_waktu: form.schedule_waktu || null,
      schedule_tempat: form.schedule_tempat || null,
      description_html: form.description_html || null,
      is_active: form.is_active,
    }

    let recordId = id
    if (isNew) {
      const { data: newItem } = await supabase.from('ekstrakurikuler').insert({ ...payload, order_index: 0 }).select().single()
      if (!newItem) { setSaving(false); alert('Gagal menyimpan.'); return }
      recordId = newItem.id
    } else {
      await supabase.from('ekstrakurikuler').update(payload).eq('id', id)
    }

    // Gallery
    if (deletedGalleryIds.length > 0) await supabase.from('ekstrakurikuler_gallery').delete().in('id', deletedGalleryIds)
    for (const g of gallery) {
      if (!g.id) await supabase.from('ekstrakurikuler_gallery').insert({ ekskul_id: recordId, image_url: g.image_url, caption: g.caption })
      else await supabase.from('ekstrakurikuler_gallery').update({ caption: g.caption }).eq('id', g.id)
    }

    // Achievements
    if (deletedAchievementIds.length > 0) await supabase.from('ekstrakurikuler_achievements').delete().in('id', deletedAchievementIds)
    for (const a of achievements) {
      if (!a.id) await supabase.from('ekstrakurikuler_achievements').insert({ ekskul_id: recordId, title: a.title, year: a.year, level: a.level })
      else await supabase.from('ekstrakurikuler_achievements').update({ title: a.title, year: a.year, level: a.level }).eq('id', a.id)
    }

    setSaving(false)
    router.push('/ekstrakurikuler')
  }

  if (loading) return <div style={{ padding: '2rem', color: '#6b7280' }}>Memuat...</div>

  return (
    <div style={{ padding: '2rem', maxWidth: '900px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Link href="/ekstrakurikuler" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '0.875rem' }}>← Kembali</Link>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#030f2b', margin: 0 }}>
          {isNew ? 'Tambah Ekstrakurikuler' : 'Edit Ekstrakurikuler'}
        </h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Info dasar */}
          <div style={card}>
            <label style={labelStyle}>Nama Ekstrakurikuler *</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value, slug: slugify(e.target.value) }))} style={inputStyle} placeholder="Contoh: Pramuka" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.75rem' }}>
              <div>
                <label style={labelStyle}>Slug</label>
                <input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Kategori</label>
                <input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={inputStyle} placeholder="Olahraga / Seni / dll" />
              </div>
            </div>
          </div>

          {/* Pembina */}
          <div style={card}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Nama Pembina *</label>
                <input value={form.pembina} onChange={e => setForm(f => ({ ...f, pembina: e.target.value }))} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>NIP Pembina</label>
                <input value={form.pembina_nip} onChange={e => setForm(f => ({ ...f, pembina_nip: e.target.value }))} style={inputStyle} />
              </div>
            </div>
          </div>

          {/* Jadwal */}
          <div style={card}>
            <label style={labelStyle}>Hari Latihan</label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
              {HARI_OPTIONS.map(h => (
                <button key={h} onClick={() => toggleHari(h)} style={{
                  padding: '0.3rem 0.75rem', borderRadius: '100px', border: '1px solid',
                  fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600,
                  background: form.schedule_hari.includes(h) ? '#0d2a5e' : 'white',
                  color: form.schedule_hari.includes(h) ? 'white' : '#374151',
                  borderColor: form.schedule_hari.includes(h) ? '#0d2a5e' : '#e5e7eb',
                }}>{h}</button>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Waktu</label>
                <input value={form.schedule_waktu} onChange={e => setForm(f => ({ ...f, schedule_waktu: e.target.value }))} style={inputStyle} placeholder="13.00 - 15.00 WIB" />
              </div>
              <div>
                <label style={labelStyle}>Tempat</label>
                <input value={form.schedule_tempat} onChange={e => setForm(f => ({ ...f, schedule_tempat: e.target.value }))} style={inputStyle} placeholder="Lapangan / Aula..." />
              </div>
            </div>
          </div>

          {/* Deskripsi */}
          <div style={card}>
            <label style={labelStyle}>Deskripsi (HTML)</label>
            <textarea value={form.description_html} onChange={e => setForm(f => ({ ...f, description_html: e.target.value }))} rows={8} style={{ ...inputStyle, resize: 'vertical', fontFamily: 'monospace', fontSize: '0.8rem' }} />
          </div>

          {/* Galeri */}
          <div style={card}>
            <label style={labelStyle}>Galeri Foto</label>
            <input type="file" accept="image/*" multiple onChange={e => e.target.files && handleGalleryUpload(e.target.files)} style={{ fontSize: '0.875rem' }} />
            {galleryUploading && <p style={{ color: '#6b7280', fontSize: '0.8rem' }}>Mengupload...</p>}
            {gallery.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginTop: '0.75rem' }}>
                {gallery.map((g, i) => (
                  <div key={i}>
                    <div style={{ position: 'relative' }}>
                      <img src={g.image_url} alt="" style={{ width: '100%', height: '90px', objectFit: 'cover', borderRadius: '6px' }} />
                      <button onClick={() => {
                        if (g.id) setDeletedGalleryIds(ids => [...ids, g.id!])
                        setGallery(gl => gl.filter((_, j) => j !== i))
                      }} style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(220,38,38,0.9)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', padding: '2px 6px', fontSize: '0.7rem' }}>✕</button>
                    </div>
                    <input value={g.caption} onChange={e => { const ng = [...gallery]; ng[i].caption = e.target.value; setGallery(ng) }} placeholder="Caption..." style={{ width: '100%', marginTop: '0.25rem', fontSize: '0.75rem', padding: '0.25rem 0.5rem', border: '1px solid #e5e7eb', borderRadius: '4px', boxSizing: 'border-box' }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Prestasi */}
          <div style={card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <label style={{ ...labelStyle, marginBottom: 0 }}>Prestasi</label>
              <button onClick={() => setAchievements(a => [...a, { title: '', year: '', level: '' }])} style={{ padding: '0.25rem 0.75rem', background: '#eff6ff', color: '#1d4ed8', border: 'none', borderRadius: '6px', fontSize: '0.775rem', fontWeight: 600, cursor: 'pointer' }}>+ Tambah</button>
            </div>
            {achievements.map((a, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr auto auto auto', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                <input value={a.title} onChange={e => { const na = [...achievements]; na[i].title = e.target.value; setAchievements(na) }} placeholder="Nama prestasi..." style={inputStyle} />
                <input value={a.year} onChange={e => { const na = [...achievements]; na[i].year = e.target.value; setAchievements(na) }} placeholder="Tahun" style={{ ...inputStyle, width: '70px' }} />
                <input value={a.level} onChange={e => { const na = [...achievements]; na[i].level = e.target.value; setAchievements(na) }} placeholder="Tingkat" style={{ ...inputStyle, width: '90px' }} />
                <button onClick={() => {
                  if (a.id) setDeletedAchievementIds(ids => [...ids, a.id!])
                  setAchievements(ac => ac.filter((_, j) => j !== i))
                }} style={{ padding: '0.4rem 0.6rem', background: '#fef2f2', color: '#dc2626', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}>✕</button>
              </div>
            ))}
            {achievements.length === 0 && <p style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Belum ada prestasi</p>}
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
                <input type="checkbox" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} />
                Tampilkan di halaman publik
              </label>
            </div>
          </div>

          <div style={card}>
            <label style={labelStyle}>Foto Cover</label>
            <input type="file" accept="image/*" onChange={e => e.target.files?.[0] && handleCoverUpload(e.target.files[0])} style={{ fontSize: '0.8rem' }} />
            {coverUploading && <p style={{ color: '#6b7280', fontSize: '0.8rem', marginTop: '0.5rem' }}>Mengupload...</p>}
            {form.cover_image_url && (
              <div style={{ marginTop: '0.75rem', position: 'relative' }}>
                <img src={form.cover_image_url} alt="" style={{ width: '100%', borderRadius: '6px', objectFit: 'cover', maxHeight: '160px' }} />
                <button onClick={() => setForm(f => ({ ...f, cover_image_url: '' }))} style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(220,38,38,0.9)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', padding: '2px 8px', fontSize: '0.75rem' }}>Hapus</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const card: React.CSSProperties = { background: 'white', borderRadius: '10px', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }
const labelStyle: React.CSSProperties = { display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }
const inputStyle: React.CSSProperties = { width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }
const btnPrimary: React.CSSProperties = { padding: '0.625rem', background: '#0d2a5e', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', width: '100%' }