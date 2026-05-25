'use client'

import { useEffect, useState } from 'react'
import { getSupabaseBrowser } from '@/lib/supabase-browser'
import PPIDLayout from '@/components/ppid/PPIDLayout'

const CATEGORY_MAP: Record<string, string> = {
  tentang: 'Tentang PPID',
  alur_permohonan: 'Alur Permohonan Informasi',
  mou: 'MoU',
  sop: 'SOP PPID',
  daftar_informasi: 'Daftar Informasi Publik',
}

const TENTANG_SUBS = [
  'Profil PPID',
  'SK',
  'Tugas dan Fungsi',
  'Maklumat Pelayanan Publik',
  'Jam Layanan',
]

interface Attachment {
  id: string
  file_url: string
  file_label: string
  file_description: string
}

interface ImageItem {
  id: string
  image_url: string
  caption: string
}

interface PPIDItem {
  id: string
  title: string
  category: string
  subcategory?: string
  document_number?: string
  document_date?: string
  content?: string
  content_html?: string
  order_index: number
  is_published: boolean
  ppid_attachments: Attachment[]
  ppid_images: ImageItem[]
}

interface PPIDSubPageProps {
  category: string
  currentHref: string
}

export default function PPIDSubPage({ category, currentHref }: PPIDSubPageProps) {
  const supabase = getSupabaseBrowser()
  const [items, setItems] = useState<PPIDItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeSub, setActiveSub] = useState<string>('')

  const dbCategory = CATEGORY_MAP[category] ?? category
  const isTentang = category === 'tentang'

  useEffect(() => {
    async function fetchItems() {
      const { data } = await supabase
        .from('ppid')
        .select('*, ppid_attachments(*), ppid_images(*)')
        .eq('category', dbCategory)
        .eq('is_published', true)
        .order('order_index')
      setItems((data as PPIDItem[]) ?? [])
      setLoading(false)
    }
    fetchItems()
  }, [category])

  useEffect(() => {
    if (isTentang && items.length > 0 && !activeSub) {
      const firstSub = TENTANG_SUBS.find((s) => items.some((i) => i.subcategory === s))
      setActiveSub(firstSub ?? items[0]?.subcategory ?? '')
    }
  }, [items])

  const visibleItems =
    isTentang && activeSub ? items.filter((i) => i.subcategory === activeSub) : items

  return (
    <PPIDLayout currentHref={currentHref}>
      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#9ca3af' }}>Memuat...</div>
      ) : items.length === 0 ? (
        <div style={{ padding: '3rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📄</div>
          <p style={{ color: '#6b7280', margin: 0 }}>Belum ada dokumen yang dipublikasikan.</p>
        </div>
      ) : (
        <div>
          {/* Tab Sub-kategori khusus Tentang PPID */}
          {isTentang && (
            <div
              style={{
                display: 'flex',
                gap: '0.5rem',
                flexWrap: 'wrap',
                marginBottom: '1.5rem',
                borderBottom: '2px solid #e5e7eb',
              }}
            >
              {TENTANG_SUBS.filter((s) => items.some((i) => i.subcategory === s)).map((sub) => (
                <button
                  key={sub}
                  onClick={() => setActiveSub(sub)}
                  style={{
                    padding: '0.5rem 1rem',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    border: 'none',
                    borderBottom: activeSub === sub ? '2px solid #0d2a5e' : '2px solid transparent',
                    background: 'none',
                    color: activeSub === sub ? '#0d2a5e' : '#6b7280',
                    cursor: 'pointer',
                    marginBottom: '-2px',
                  }}
                >
                  {sub}
                </button>
              ))}
            </div>
          )}

          {/* List Dokumen */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {visibleItems.map((item) => (
              <DocCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}
    </PPIDLayout>
  )
}

function DocCard({ item }: { item: PPIDItem }) {
  const [open, setOpen] = useState(false)
  const attachments = item.ppid_attachments ?? []
  const images = item.ppid_images ?? []

  return (
    <div
      style={{
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
        overflow: 'hidden',
        border: '1px solid #f3f4f6',
      }}
    >
      {/* Header card */}
      <div
        onClick={() => setOpen((o) => !o)}
        style={{
          padding: '1rem 1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          cursor: 'pointer',
          gap: '1rem',
        }}
      >
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontWeight: 700,
              color: '#111827',
              fontSize: '0.95rem',
              marginBottom: '0.25rem',
            }}
          >
            {item.title}
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {item.document_number && (
              <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                No: {item.document_number}
              </span>
            )}
            {item.document_date && (
              <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                {new Date(item.document_date).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            )}
            {attachments.length > 0 && (
              <span style={{ fontSize: '0.75rem', color: '#3b82f6' }}>
                📎 {attachments.length} lampiran
              </span>
            )}
          </div>
        </div>
        <span style={{ fontSize: '0.8rem', color: '#9ca3af', flexShrink: 0 }}>
          {open ? '▲' : '▼'}
        </span>
      </div>

      {/* Expanded content */}
      {open && (
        <div
          style={{ borderTop: '1px solid #f3f4f6', padding: '1rem 1.25rem', background: '#fafafa' }}
        >
          {/* HTML content */}
          {item.content_html && (
            <div
              dangerouslySetInnerHTML={{ __html: item.content_html }}
              style={{ fontSize: '0.9rem', color: '#374151', lineHeight: 1.7, marginBottom: '1rem' }}
            />
          )}

          {/* Plain text fallback */}
          {!item.content_html && item.content && (
            <p
              style={{ fontSize: '0.9rem', color: '#374151', lineHeight: 1.7, marginBottom: '1rem' }}
            >
              {item.content}
            </p>
          )}

          {/* Gambar */}
          {images.length > 0 && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                gap: '0.75rem',
                marginBottom: '1rem',
              }}
            >
              {images.map((img) => (
                <div key={img.id}>
                  <img
                    src={img.image_url}
                    alt={img.caption ?? ''}
                    style={{
                      width: '100%',
                      borderRadius: '8px',
                      objectFit: 'cover',
                      aspectRatio: '4/3',
                    }}
                  />
                  {img.caption && (
                    <p
                      style={{
                        fontSize: '0.75rem',
                        color: '#6b7280',
                        marginTop: '0.25rem',
                        textAlign: 'center',
                      }}
                    >
                      {img.caption}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Lampiran */}
          {attachments.length > 0 && (
            <div>
              <div
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: '#374151',
                  marginBottom: '0.5rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                Lampiran
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {attachments.map((att) => (
                  <a
                    key={att.id}
                    href={att.file_url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 0.75rem',
                      background: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      color: '#1d4ed8',
                      fontSize: '0.85rem',
                      fontWeight: 500,
                    }}
                  >
                    <span>📄</span>
                    <span style={{ flex: 1 }}>{att.file_label || 'Unduh Dokumen'}</span>
                    {att.file_description && (
                      <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                        {att.file_description}
                      </span>
                    )}
                    <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>↓</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
