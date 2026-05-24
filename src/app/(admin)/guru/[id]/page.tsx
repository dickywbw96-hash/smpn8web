'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

interface GuruForm {
  name: string
  nip: string
  position: string
  subject: string
  photo_url: string
  type: 'guru' | 'tas'
  is_active: boolean
  order_index: number
}

const EMPTY: GuruForm = {
  name: '',
  nip: '',
  position: '',
  subject: '',
  photo_url: '',
  type: 'guru',
  is_active: true,
  order_index: 0,
}

function getInitials(name: string) {
  return name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()
}

export default function GuruFormPage() {
  const params  = useParams()
  const router  = useRouter()
  const id      = params?.id as string
  const isNew   = id === 'baru'

  const [form, setForm]         = useState<GuruForm>(EMPTY)
  const [loading, setLoading]   = useState(!isNew)
  const [saving, setSaving]     = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError]       = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isNew) return
    fetch(`/api/admin/guru/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d?.id) {
          setForm({
            name: d.name ?? '',
            nip: d.nip ?? '',
            position: d.position ?? '',
            subject: d.subject ?? '',
            photo_url: d.photo_url ?? '',
            type: d.type ?? 'guru',
            is_active: d.is_active ?? true,
            order_index: d.order_index ?? 0,
          })
        }
        setLoading(false)
      })
  }, [id, isNew])

  function set(key: keyof GuruForm, value: any) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleUpload(file: File) {
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    fd.append('folder', 'guru')
    const res  = await fetch('/api/admin/media/upload', { method: 'POST', body: fd })
    const data = await res.json()
    if (data?.url) set('photo_url', data.url)
    setUploading(false)
  }

  async function handleSubmit() {
    if (!form.name.trim()) { setError('Nama wajib diisi'); return }
    setSaving(true)
    setError('')

    const method = isNew ? 'POST' : 'PUT'
    const url    = isNew ? '/api/admin/guru' : `/api/admin/guru/${id}`

    const res  = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()

    if (!res.ok) { setError(data?.message ?? 'Gagal menyimpan'); setSaving(false); return }
    router.push('/admin/guru')
  }

  if (loading) {
    return <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>Memuat...</div>
  }

  return (
    <>
      <style>{`
        .gf-page   { padding: 2rem; max-width: 680px; }
        .gf-topbar {
          display: flex; align-items: center; gap: 1rem;
          margin-bottom: 2rem;
        }
        .gf-back {
          background: #f1f5f9; border: none;
          width: 36px; height: 36px; border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; text-decoration: none; color: #475569;
          transition: background .15s;
        }
        .gf-back:hover { background: #e2e8f0; }
        .gf-title { font-size: 1.4rem; font-weight: 800; color: #071e4a; margin: 0; }
        .gf-card  { background: white; border-radius: 14px; padding: 2rem; box-shadow: 0 1px 8px rgba(0,0,0,.07); }
        .gf-avatar-section {
          display: flex; align-items: center; gap: 1.5rem;
          margin-bottom: 2rem; padding-bottom: 2rem;
          border-bottom: 1px solid #f1f5f9;
        }
        .gf-avatar {
          width: 80px; height: 80px; border-radius: 50%;
          background: #e8eef8; overflow: hidden;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.5rem; font-weight: 700; color: #1a5cc8;
          flex-shrink: 0; border: 3px solid #e8eef8;
        }
        .gf-avatar img { width: 100%; height: 100%; object-fit: cover; }
        .gf-upload-btn {
          background: #f1f5f9; border: none;
          padding: .6rem 1.2rem; border-radius: 8px;
          font-size: .82rem; font-weight: 700; color: #475569;
          cursor: pointer; transition: background .15s;
        }
        .gf-upload-btn:hover { background: #e2e8f0; }
        .gf-upload-hint { font-size: .72rem; color: #94a3b8; margin-top: .3rem; }
        .gf-row  { margin-bottom: 1.25rem; }
        .gf-row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.25rem; }
        label  { display: block; font-size: .78rem; font-weight: 700; color: #475569; margin-bottom: .4rem; letter-spacing: .04em; text-transform: uppercase; }
        input[type=text], input[type=number] {
          width: 100%; padding: .65rem .85rem;
          border: 1.5px solid #e2e8f0; border-radius: 8px;
          font-size: .9rem; color: #071e4a;
          outline: none; transition: border-color .15s;
          box-sizing: border-box;
        }
        input[type=text]:focus, input[type=number]:focus { border-color: #1a5cc8; }
        .gf-toggle-row {
          display: flex; align-items: center; gap: .75rem;
          margin-bottom: 1.5rem;
        }
        .gf-toggle {
          position: relative; width: 44px; height: 24px;
        }
        .gf-toggle input { opacity: 0; width: 0; height: 0; }
        .gf-slider {
          position: absolute; inset: 0;
          background: #e2e8f0; border-radius: 100px;
          cursor: pointer; transition: background .2s;
        }
        .gf-slider::before {
          content: ''; position: absolute;
          width: 18px; height: 18px;
          background: white; border-radius: 50%;
          top: 3px; left: 3px;
          transition: transform .2s;
          box-shadow: 0 1px 3px rgba(0,0,0,.2);
        }
        .gf-toggle input:checked + .gf-slider { background: #1a5cc8; }
        .gf-toggle input:checked + .gf-slider::before { transform: translateX(20px); }
        .gf-toggle-label { font-size: .875rem; font-weight: 600; color: #475569; }
        .gf-error { background: #fee2e2; color: #dc2626; border-radius: 8px; padding: .75rem 1rem; font-size: .85rem; font-weight: 600; margin-bottom: 1rem; }
        .gf-actions { display: flex; gap: .75rem; justify-content: flex-end; padding-top: 1rem; border-top: 1px solid #f1f5f9; }
        .gf-cancel {
          background: #f1f5f9; color: #475569; border: none;
          padding: .7rem 1.4rem; border-radius: 8px;
          font-weight: 700; font-size: .875rem; cursor: pointer;
          text-decoration: none; display: inline-block;
          transition: background .15s;
        }
        .gf-cancel:hover { background: #e2e8f0; }
        .gf-save {
          background: #1a5cc8; color: white; border: none;
          padding: .7rem 1.8rem; border-radius: 8px;
          font-weight: 700; font-size: .875rem; cursor: pointer;
          transition: background .15s;
        }
        .gf-save:hover:not(:disabled) { background: #1450b0; }
        .gf-save:disabled { opacity: .6; cursor: not-allowed; }
        @media (max-width: 500px) { .gf-row2 { grid-template-columns: 1fr; } }
      `}</style>

      <div className="gf-page">
        <div className="gf-topbar">
          <Link href="/admin/guru" className="gf-back" aria-label="Kembali">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </Link>
          <h1 className="gf-title">{isNew ? 'Tambah Guru' : 'Edit Guru'}</h1>
        </div>

        <div className="gf-card">
          {/* Avatar upload */}
          <div className="gf-avatar-section">
            <div className="gf-avatar">
              {form.photo_url
                ? <img src={form.photo_url} alt="foto" />
                : (form.name ? getInitials(form.name) : '👤')
              }
            </div>
            <div>
              <button
                className="gf-upload-btn"
                type="button"
                disabled={uploading}
                onClick={() => fileRef.current?.click()}
              >
                {uploading ? 'Mengunggah...' : '📷 Upload Foto'}
              </button>
              <p className="gf-upload-hint">JPG/PNG, maks 2MB. Rasio 1:1 (kotak) direkomendasikan.</p>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) handleUpload(f)
                }}
              />
              {form.photo_url && (
                <button
                  type="button"
                  style={{ background: 'none', border: 'none', color: '#dc2626', fontSize: '.75rem', cursor: 'pointer', marginTop: '.3rem', display: 'block' }}
                  onClick={() => set('photo_url', '')}
                >
                  Hapus foto
                </button>
              )}
            </div>
          </div>

          {/* Fields */}
          <div className="gf-row">
            <label>Nama Lengkap *</label>
            <input type="text" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Contoh: Budi Santoso, S.Pd." />
          </div>

          <div className="gf-row2">
            <div>
              <label>NIP</label>
              <input type="text" value={form.nip} onChange={(e) => set('nip', e.target.value)} placeholder="198501012010011001" />
            </div>
            <div>
              <label>Urutan Tampil</label>
              <input type="number" value={form.order_index} onChange={(e) => set('order_index', Number(e.target.value))} min={0} />
            </div>
          </div>

          <div className="gf-row">
            <label>Jenis</label>
            <div style={{ display: 'flex', gap: '.75rem' }}>
              {(['guru', 'tas'] as const).map((t) => (
                <label key={t} style={{ display: 'flex', alignItems: 'center', gap: '.4rem', cursor: 'pointer', textTransform: 'none', letterSpacing: 0, fontSize: '.875rem', fontWeight: 600, color: form.type === t ? '#1a5cc8' : '#64748b' }}>
                  <input
                    type="radio"
                    name="type"
                    value={t}
                    checked={form.type === t}
                    onChange={() => set('type', t)}
                    style={{ accentColor: '#1a5cc8' }}
                  />
                  {t === 'guru' ? '👨‍🏫 Guru / Pendidik' : '🗂️ Tenaga Administrasi (TAS)'}
                </label>
              ))}
            </div>
          </div>

          {form.type === 'guru' && (
          <div className="gf-row">
            <label>Mata Pelajaran</label>
            <input type="text" value={form.subject} onChange={(e) => set('subject', e.target.value)} placeholder="Contoh: Matematika, Bahasa Indonesia" />
          </div>
          )}

          <div className="gf-row">
            <label>Jabatan</label>
            <input type="text" value={form.position} onChange={(e) => set('position', e.target.value)} placeholder="Contoh: Wali Kelas 8A, Wakasek Kurikulum" />
          </div>

          <div className="gf-toggle-row">
            <label className="gf-toggle">
              <input type="checkbox" checked={form.is_active} onChange={(e) => set('is_active', e.target.checked)} />
              <span className="gf-slider" />
            </label>
            <span className="gf-toggle-label">{form.is_active ? 'Aktif (tampil di website)' : 'Nonaktif (tersembunyi)'}</span>
          </div>

          {error && <div className="gf-error">{error}</div>}

          <div className="gf-actions">
            <Link href="/admin/guru" className="gf-cancel">Batal</Link>
            <button className="gf-save" disabled={saving} onClick={handleSubmit}>
              {saving ? 'Menyimpan...' : (isNew ? 'Tambah Guru' : 'Simpan Perubahan')}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}