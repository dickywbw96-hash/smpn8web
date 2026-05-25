'use client'

import { useEffect, useState } from 'react'
import { getSupabaseBrowser } from '@/lib/supabase-browser'
import { uploadFile } from '@/lib/supabase'
import ThemePicker from '@/components/admin/ThemePicker'

// ── Types ────────────────────────────────────────────────────────────────────

interface MissionPoint { id?: string; point: string; order_index: number }
interface Tagline { id?: string; text: string; order_index: number }

interface SettingsForm {
  school_name: string
  school_nss: string
  school_npsn: string
  school_logo_url: string
  address_street: string
  address_kelurahan: string
  address_kecamatan: string
  address_city: string
  address_province: string
  address_postal_code: string
  address_maps_url: string
  contact_phone: string
  contact_whatsapp: string
  contact_email: string
  contact_website: string
  social_facebook: string
  social_instagram: string
  social_youtube: string
  social_twitter: string
  social_tiktok: string
  principal_name: string
  principal_nip: string
  principal_photo_url: string
  principal_message: string
  vision: string
  motto: string
  ticker_text: string
  ticker_enabled: boolean
  seo_meta_title: string
  seo_meta_description: string
  seo_og_image_url: string
  google_analytics_id: string
}

const EMPTY_FORM: SettingsForm = {
  school_name: '', school_nss: '', school_npsn: '', school_logo_url: '',
  address_street: '', address_kelurahan: '', address_kecamatan: '',
  address_city: '', address_province: '', address_postal_code: '', address_maps_url: '',
  contact_phone: '', contact_whatsapp: '', contact_email: '', contact_website: '',
  social_facebook: '', social_instagram: '', social_youtube: '', social_twitter: '', social_tiktok: '',
  principal_name: '', principal_nip: '', principal_photo_url: '', principal_message: '',
  vision: '', motto: '', ticker_text: '', ticker_enabled: true,
  seo_meta_title: '', seo_meta_description: '', seo_og_image_url: '', google_analytics_id: '',
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const INPUT_STYLE: React.CSSProperties = {
  width: '100%', padding: '0.6rem 0.75rem', border: '1px solid #e5e7eb',
  borderRadius: '8px', fontSize: '0.875rem', color: '#111827',
  background: 'white', boxSizing: 'border-box', outline: 'none',
}
const LABEL_STYLE: React.CSSProperties = { fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.3rem', display: 'block' }
const SECTION_STYLE: React.CSSProperties = {
  background: 'white', borderRadius: '12px', padding: '1.5rem',
  boxShadow: '0 1px 3px rgba(0,0,0,0.08)', marginBottom: '1.5rem',
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <label style={LABEL_STYLE}>{label}</label>
      {children}
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#030f2b', marginBottom: '1.25rem', paddingBottom: '0.5rem', borderBottom: '2px solid #f3f4f6' }}>
      {children}
    </h2>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function SiteSettingsPage() {
  const supabase = getSupabaseBrowser()
  const [form, setForm] = useState<SettingsForm>(EMPTY_FORM)
  const [missions, setMissions] = useState<MissionPoint[]>([])
  const [taglines, setTaglines] = useState<Tagline[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)
  const [logoUploading, setLogoUploading] = useState(false)
  const [photoUploading, setPhotoUploading] = useState(false)
  const [activeTab, setActiveTab] = useState<'tema' | 'umum' | 'kontak' | 'kepala' | 'visi' | 'seo'>('tema')

  useEffect(() => { fetchSettings() }, [])

  async function fetchSettings() {
    const { data } = await supabase.from('site_settings').select('*').single()
    if (data) {
      const { mission: _m, taglines: _t, ...rest } = data as any
      setForm({ ...EMPTY_FORM, ...rest })
    }
    const { data: missionData } = await supabase.from('site_settings_mission').select('*').order('order_index')
    const { data: taglineData } = await supabase.from('site_settings_taglines').select('*').order('order_index')
    setMissions(missionData ?? [])
    setTaglines(taglineData ?? [])
    setLoading(false)
  }

  function set(key: keyof SettingsForm, value: any) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function showToast(msg: string, type: 'success' | 'error' = 'success') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>, field: 'school_logo_url' | 'principal_photo_url') {
    const file = e.target.files?.[0]
    if (!file) return
    const setter = field === 'school_logo_url' ? setLogoUploading : setPhotoUploading
    setter(true)
    const ext = file.name.split('.').pop()
    const path = `settings/${field}_${Date.now()}.${ext}`
    const url = await uploadFile('media', path, file)
    if (url) set(field, url)
    else showToast('Gagal upload gambar', 'error')
    setter(false)
  }

  async function handleSave() {
    setSaving(true)
    try {
      const { error } = await supabase.from('site_settings').upsert({ id: 1, ...form })
      if (error) throw error

      await supabase.from('site_settings_mission').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      if (missions.length > 0) {
        await supabase.from('site_settings_mission').insert(
          missions.map((m, i) => ({ point: m.point, order_index: i }))
        )
      }

      await supabase.from('site_settings_taglines').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      if (taglines.length > 0) {
        await supabase.from('site_settings_taglines').insert(
          taglines.map((t, i) => ({ text: t.text, order_index: i }))
        )
      }

      showToast('Pengaturan berhasil disimpan!')
      fetchSettings()
    } catch (err: any) {
      showToast(err.message ?? 'Gagal menyimpan', 'error')
    } finally {
      setSaving(false)
    }
  }

  function addMission() { setMissions(prev => [...prev, { point: '', order_index: prev.length }]) }
  function updateMission(i: number, val: string) { setMissions(prev => prev.map((m, idx) => idx === i ? { ...m, point: val } : m)) }
  function removeMission(i: number) { setMissions(prev => prev.filter((_, idx) => idx !== i)) }
  function moveMission(i: number, dir: -1 | 1) {
    setMissions(prev => {
      const arr = [...prev]; const j = i + dir
      if (j < 0 || j >= arr.length) return arr
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
      return arr
    })
  }

  function addTagline() { setTaglines(prev => [...prev, { text: '', order_index: prev.length }]) }
  function updateTagline(i: number, val: string) { setTaglines(prev => prev.map((t, idx) => idx === i ? { ...t, text: val } : t)) }
  function removeTagline(i: number) { setTaglines(prev => prev.filter((_, idx) => idx !== i)) }

  const tabs: { key: typeof activeTab; label: string }[] = [
    { key: 'tema', label: '🎨 Tema Website' },
    { key: 'umum', label: '🏫 Umum' },
    { key: 'kontak', label: '📞 Kontak & Sosmed' },
    { key: 'kepala', label: '👤 Kepala Sekolah' },
    { key: 'visi', label: '🎯 Visi & Misi' },
    { key: 'seo', label: '🔍 SEO & Lain' },
  ]

  if (loading) return <div style={{ padding: '2rem', color: '#6b7280' }}>Memuat...</div>

  return (
    <div style={{ padding: '2rem', maxWidth: '900px' }}>
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: '1.5rem', right: '1.5rem', zIndex: 9999,
          padding: '0.75rem 1.25rem', borderRadius: '10px', fontWeight: 600, fontSize: '0.875rem',
          background: toast.type === 'success' ? '#dcfce7' : '#fee2e2',
          color: toast.type === 'success' ? '#16a34a' : '#dc2626',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}>
          {toast.type === 'success' ? '✅' : '❌'} {toast.msg}
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#030f2b' }}>Pengaturan Website</h1>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.25rem' }}>Konfigurasi informasi dan tampilan website sekolah</p>
        </div>
        {activeTab !== 'tema' && (
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              padding: '0.6rem 1.5rem', background: saving ? '#93c5fd' : '#0d2a5e',
              color: 'white', border: 'none', borderRadius: '8px',
              cursor: saving ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: '0.875rem',
            }}
          >
            {saving ? 'Menyimpan...' : '💾 Simpan Semua'}
          </button>
        )}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1.5rem', background: 'white', padding: '0.4rem', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', flexWrap: 'wrap' }}>
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '0.5rem 1rem', border: 'none', borderRadius: '8px', cursor: 'pointer',
              fontSize: '0.8rem', fontWeight: activeTab === tab.key ? 700 : 500,
              background: activeTab === tab.key ? '#0d2a5e' : 'transparent',
              color: activeTab === tab.key ? 'white' : '#6b7280',
              transition: 'all 0.2s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Tab: Tema Website ── */}
      {activeTab === 'tema' && (
        <div style={SECTION_STYLE}>
          <SectionTitle>🎨 Tema Tampilan Website</SectionTitle>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1.25rem' }}>
            Pilih tema yang akan diterapkan ke seluruh halaman publik website. Perubahan langsung tersimpan otomatis.
          </p>
          <ThemePicker />
        </div>
      )}

      {/* ── Tab: Umum ── */}
      {activeTab === 'umum' && (
        <div>
          <div style={SECTION_STYLE}>
            <SectionTitle>Identitas Sekolah</SectionTitle>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <Field label="Nama Sekolah *">
                  <input style={INPUT_STYLE} value={form.school_name} onChange={e => set('school_name', e.target.value)} />
                </Field>
              </div>
              <Field label="NSS">
                <input style={INPUT_STYLE} value={form.school_nss} onChange={e => set('school_nss', e.target.value)} />
              </Field>
              <Field label="NPSN">
                <input style={INPUT_STYLE} value={form.school_npsn} onChange={e => set('school_npsn', e.target.value)} />
              </Field>
              <Field label="Motto Sekolah">
                <input style={INPUT_STYLE} value={form.motto} onChange={e => set('motto', e.target.value)} placeholder="Motto singkat sekolah..." />
              </Field>
            </div>

            <Field label="Logo Sekolah">
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                {form.school_logo_url && (
                  <img src={form.school_logo_url} alt="Logo" style={{ width: '60px', height: '60px', objectFit: 'contain', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '4px' }} />
                )}
                <div>
                  <label style={{ display: 'inline-block', padding: '0.5rem 1rem', background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                    {logoUploading ? 'Mengupload...' : '📁 Pilih File'}
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleUpload(e, 'school_logo_url')} />
                  </label>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>PNG/SVG, maks 2MB</div>
                </div>
              </div>
            </Field>
          </div>

          <div style={SECTION_STYLE}>
            <SectionTitle>Alamat Sekolah</SectionTitle>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <Field label="Alamat Jalan">
                  <input style={INPUT_STYLE} value={form.address_street} onChange={e => set('address_street', e.target.value)} />
                </Field>
              </div>
              <Field label="Kelurahan">
                <input style={INPUT_STYLE} value={form.address_kelurahan} onChange={e => set('address_kelurahan', e.target.value)} />
              </Field>
              <Field label="Kecamatan">
                <input style={INPUT_STYLE} value={form.address_kecamatan} onChange={e => set('address_kecamatan', e.target.value)} />
              </Field>
              <Field label="Kota/Kabupaten">
                <input style={INPUT_STYLE} value={form.address_city} onChange={e => set('address_city', e.target.value)} />
              </Field>
              <Field label="Provinsi">
                <input style={INPUT_STYLE} value={form.address_province} onChange={e => set('address_province', e.target.value)} />
              </Field>
              <Field label="Kode Pos">
                <input style={INPUT_STYLE} value={form.address_postal_code} onChange={e => set('address_postal_code', e.target.value)} />
              </Field>
              <div style={{ gridColumn: '1 / -1' }}>
                <Field label="URL Google Maps (embed)">
                  <input style={INPUT_STYLE} value={form.address_maps_url} onChange={e => set('address_maps_url', e.target.value)} placeholder="https://maps.google.com/..." />
                </Field>
              </div>
            </div>
          </div>

          <div style={SECTION_STYLE}>
            <SectionTitle>Tagline / Running Text</SectionTitle>
            <Field label="Ticker Text (running text di header)">
              <input style={INPUT_STYLE} value={form.ticker_text} onChange={e => set('ticker_text', e.target.value)} placeholder="Selamat datang di SMPN 8 Probolinggo..." />
            </Field>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <input type="checkbox" checked={form.ticker_enabled} onChange={e => set('ticker_enabled', e.target.checked)} style={{ width: '18px', height: '18px', accentColor: '#0d2a5e' }} />
              <span style={{ fontSize: '0.875rem', color: '#374151' }}>Tampilkan ticker</span>
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <label style={LABEL_STYLE}>Tagline Halaman Utama</label>
                <button onClick={addTagline} style={{ padding: '0.3rem 0.75rem', background: '#f0f9ff', color: '#0369a1', border: '1px solid #bae6fd', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>+ Tambah</button>
              </div>
              {taglines.map((t, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                  <input style={{ ...INPUT_STYLE, flex: 1 }} value={t.text} onChange={e => updateTagline(i, e.target.value)} placeholder={`Tagline ${i + 1}...`} />
                  <button onClick={() => removeTagline(i)} style={{ padding: '0.4rem 0.6rem', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}>✕</button>
                </div>
              ))}
              {taglines.length === 0 && <p style={{ fontSize: '0.8rem', color: '#9ca3af', fontStyle: 'italic' }}>Belum ada tagline.</p>}
            </div>
          </div>
        </div>
      )}

      {/* ── Tab: Kontak & Sosmed ── */}
      {activeTab === 'kontak' && (
        <div>
          <div style={SECTION_STYLE}>
            <SectionTitle>Kontak</SectionTitle>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
              <Field label="Telepon"><input style={INPUT_STYLE} value={form.contact_phone} onChange={e => set('contact_phone', e.target.value)} placeholder="0335-..." /></Field>
              <Field label="WhatsApp"><input style={INPUT_STYLE} value={form.contact_whatsapp} onChange={e => set('contact_whatsapp', e.target.value)} placeholder="628..." /></Field>
              <Field label="Email"><input style={INPUT_STYLE} value={form.contact_email} onChange={e => set('contact_email', e.target.value)} placeholder="smpn8@..." /></Field>
              <Field label="Website"><input style={INPUT_STYLE} value={form.contact_website} onChange={e => set('contact_website', e.target.value)} placeholder="https://..." /></Field>
            </div>
          </div>
          <div style={SECTION_STYLE}>
            <SectionTitle>Media Sosial</SectionTitle>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
              <Field label="Facebook"><input style={INPUT_STYLE} value={form.social_facebook} onChange={e => set('social_facebook', e.target.value)} placeholder="https://facebook.com/..." /></Field>
              <Field label="Instagram"><input style={INPUT_STYLE} value={form.social_instagram} onChange={e => set('social_instagram', e.target.value)} placeholder="https://instagram.com/..." /></Field>
              <Field label="YouTube"><input style={INPUT_STYLE} value={form.social_youtube} onChange={e => set('social_youtube', e.target.value)} placeholder="https://youtube.com/..." /></Field>
              <Field label="Twitter / X"><input style={INPUT_STYLE} value={form.social_twitter} onChange={e => set('social_twitter', e.target.value)} placeholder="https://x.com/..." /></Field>
              <Field label="TikTok"><input style={INPUT_STYLE} value={form.social_tiktok} onChange={e => set('social_tiktok', e.target.value)} placeholder="https://tiktok.com/@..." /></Field>
            </div>
          </div>
        </div>
      )}

      {/* ── Tab: Kepala Sekolah ── */}
      {activeTab === 'kepala' && (
        <div style={SECTION_STYLE}>
          <SectionTitle>Data Kepala Sekolah</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
            <Field label="Nama Kepala Sekolah"><input style={INPUT_STYLE} value={form.principal_name} onChange={e => set('principal_name', e.target.value)} /></Field>
            <Field label="NIP"><input style={INPUT_STYLE} value={form.principal_nip} onChange={e => set('principal_nip', e.target.value)} /></Field>
          </div>
          <Field label="Foto Kepala Sekolah">
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              {form.principal_photo_url && (
                <img src={form.principal_photo_url} alt="Foto" style={{ width: '80px', height: '80px', objectFit: 'cover', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
              )}
              <div>
                <label style={{ display: 'inline-block', padding: '0.5rem 1rem', background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                  {photoUploading ? 'Mengupload...' : '📁 Pilih Foto'}
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleUpload(e, 'principal_photo_url')} />
                </label>
                <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>JPG/PNG, maks 2MB</div>
              </div>
            </div>
          </Field>
          <Field label="Sambutan / Pesan Kepala Sekolah">
            <textarea style={{ ...INPUT_STYLE, minHeight: '200px', resize: 'vertical', lineHeight: 1.6 }} value={form.principal_message} onChange={e => set('principal_message', e.target.value)} placeholder="Tuliskan sambutan kepala sekolah..." />
          </Field>
        </div>
      )}

      {/* ── Tab: Visi & Misi ── */}
      {activeTab === 'visi' && (
        <div>
          <div style={SECTION_STYLE}>
            <SectionTitle>Visi Sekolah</SectionTitle>
            <Field label="Pernyataan Visi">
              <textarea style={{ ...INPUT_STYLE, minHeight: '100px', resize: 'vertical', lineHeight: 1.6 }} value={form.vision} onChange={e => set('vision', e.target.value)} placeholder="Tuliskan visi sekolah..." />
            </Field>
          </div>
          <div style={SECTION_STYLE}>
            <SectionTitle>Misi Sekolah</SectionTitle>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.75rem' }}>
              <button onClick={addMission} style={{ padding: '0.4rem 1rem', background: '#f0f9ff', color: '#0369a1', border: '1px solid #bae6fd', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>+ Tambah Poin Misi</button>
            </div>
            {missions.map((m, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', alignItems: 'flex-start' }}>
                <div style={{ width: '28px', height: '28px', background: '#0d2a5e', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0, marginTop: '0.3rem' }}>{i + 1}</div>
                <textarea style={{ ...INPUT_STYLE, flex: 1, minHeight: '60px', resize: 'vertical' }} value={m.point} onChange={e => updateMission(i, e.target.value)} placeholder={`Poin misi ${i + 1}...`} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <button onClick={() => moveMission(i, -1)} disabled={i === 0} style={{ padding: '0.3rem 0.5rem', background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: '4px', cursor: i === 0 ? 'not-allowed' : 'pointer', fontSize: '0.7rem', opacity: i === 0 ? 0.4 : 1 }}>▲</button>
                  <button onClick={() => moveMission(i, 1)} disabled={i === missions.length - 1} style={{ padding: '0.3rem 0.5rem', background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: '4px', cursor: i === missions.length - 1 ? 'not-allowed' : 'pointer', fontSize: '0.7rem', opacity: i === missions.length - 1 ? 0.4 : 1 }}>▼</button>
                  <button onClick={() => removeMission(i)} style={{ padding: '0.3rem 0.5rem', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.7rem' }}>✕</button>
                </div>
              </div>
            ))}
            {missions.length === 0 && <p style={{ fontSize: '0.8rem', color: '#9ca3af', fontStyle: 'italic' }}>Belum ada poin misi.</p>}
          </div>
        </div>
      )}

      {/* ── Tab: SEO & Lain ── */}
      {activeTab === 'seo' && (
        <div style={SECTION_STYLE}>
          <SectionTitle>SEO & Analitik</SectionTitle>
          <Field label="Meta Title (judul browser)">
            <input style={INPUT_STYLE} value={form.seo_meta_title} onChange={e => set('seo_meta_title', e.target.value)} placeholder="SMPN 8 Probolinggo - ..." />
          </Field>
          <Field label="Meta Description">
            <textarea style={{ ...INPUT_STYLE, minHeight: '80px', resize: 'vertical' }} value={form.seo_meta_description} onChange={e => set('seo_meta_description', e.target.value)} placeholder="Deskripsi singkat website sekolah..." />
          </Field>
          <Field label="OG Image URL (gambar preview sosmed)">
            <input style={INPUT_STYLE} value={form.seo_og_image_url} onChange={e => set('seo_og_image_url', e.target.value)} placeholder="https://..." />
          </Field>
          <Field label="Google Analytics ID">
            <input style={INPUT_STYLE} value={form.google_analytics_id} onChange={e => set('google_analytics_id', e.target.value)} placeholder="G-XXXXXXXXXX" />
          </Field>
          <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: '#f0f9ff', borderRadius: '8px', fontSize: '0.8rem', color: '#0369a1' }}>
            💡 Meta title & description akan digunakan sebagai default untuk seluruh halaman website.
          </div>
        </div>
      )}

      {/* Save button bottom — hanya tampil di tab selain tema */}
      {activeTab !== 'tema' && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
          <button onClick={handleSave} disabled={saving} style={{ padding: '0.75rem 2rem', background: saving ? '#93c5fd' : '#0d2a5e', color: 'white', border: 'none', borderRadius: '8px', cursor: saving ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: '0.875rem' }}>
            {saving ? 'Menyimpan...' : '💾 Simpan Semua'}
          </button>
        </div>
      )}
    </div>
  )
}
