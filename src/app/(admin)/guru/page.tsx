'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Guru {
  id: string
  name: string
  nip?: string
  position?: string
  subject?: string
  photo_url?: string
  is_active: boolean
  order_index: number
}

function getInitials(name: string) {
  return name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()
}

export default function AdminGuruPage() {
  const [list, setList] = useState<Guru[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    const res = await fetch('/api/admin/guru')
    const data = await res.json()
    setList(data ?? [])
    setLoading(false)
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Hapus guru "${name}"?`)) return
    setDeleting(id)
    await fetch(`/api/admin/guru/${id}`, { method: 'DELETE' })
    await load()
    setDeleting(null)
  }

  async function toggleActive(guru: Guru) {
    await fetch(`/api/admin/guru/${guru.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !guru.is_active }),
    })
    await load()
  }

  useEffect(() => { load() }, [])

  return (
    <>
      <style>{`
        .ag-page { padding: 2rem; max-width: 960px; }
        .ag-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .ag-title { font-size: 1.5rem; font-weight: 800; color: #071e4a; margin: 0; }
        .ag-add-btn {
          background: #1a5cc8;
          color: white;
          font-weight: 700;
          padding: .65rem 1.4rem;
          border-radius: 8px;
          text-decoration: none;
          font-size: .875rem;
          transition: background .2s;
        }
        .ag-add-btn:hover { background: #1450b0; }
        .ag-table { width: 100%; border-collapse: collapse; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 6px rgba(0,0,0,.07); }
        .ag-table th { background: #f1f5f9; font-size: .75rem; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: #64748b; padding: .85rem 1rem; text-align: left; }
        .ag-table td { padding: .85rem 1rem; border-top: 1px solid #f1f5f9; vertical-align: middle; }
        .ag-avatar {
          width: 44px; height: 44px; border-radius: 50%;
          object-fit: cover; background: #e8eef8;
          display: flex; align-items: center; justify-content: center;
          font-weight: 700; font-size: .85rem; color: #1a5cc8;
          overflow: hidden; flex-shrink: 0;
        }
        .ag-avatar img { width: 100%; height: 100%; object-fit: cover; }
        .ag-name-cell { display: flex; align-items: center; gap: .85rem; }
        .ag-name { font-weight: 700; color: #071e4a; font-size: .9rem; }
        .ag-nip  { font-size: .75rem; color: #94a3b8; }
        .ag-subject-badge {
          display: inline-block;
          background: #e8f0fb; color: #1a5cc8;
          font-size: .72rem; font-weight: 700;
          padding: .2rem .7rem; border-radius: 100px;
        }
        .ag-badge-active   { background: #dcfce7; color: #16a34a; font-size: .72rem; font-weight: 700; padding: .2rem .7rem; border-radius: 100px; cursor: pointer; border: none; }
        .ag-badge-inactive { background: #fee2e2; color: #dc2626; font-size: .72rem; font-weight: 700; padding: .2rem .7rem; border-radius: 100px; cursor: pointer; border: none; }
        .ag-actions { display: flex; gap: .5rem; }
        .ag-btn-edit {
          background: #f1f5f9; color: #071e4a; border: none;
          font-size: .78rem; font-weight: 600;
          padding: .45rem .9rem; border-radius: 6px; cursor: pointer;
          text-decoration: none; display: inline-block;
          transition: background .15s;
        }
        .ag-btn-edit:hover { background: #e2e8f0; }
        .ag-btn-del {
          background: #fee2e2; color: #dc2626; border: none;
          font-size: .78rem; font-weight: 600;
          padding: .45rem .9rem; border-radius: 6px; cursor: pointer;
          transition: background .15s;
        }
        .ag-btn-del:hover { background: #fecaca; }
        .ag-empty { text-align: center; padding: 3rem; color: #94a3b8; }
        .ag-loading { text-align: center; padding: 3rem; color: #94a3b8; }
      `}</style>

      <div className="ag-page">
        <div className="ag-topbar">
          <h1 className="ag-title">Kelola Guru &amp; Staff</h1>
          <Link href="/admin/guru/baru" className="ag-add-btn">+ Tambah Guru</Link>
        </div>

        {loading ? (
          <div className="ag-loading">Memuat data...</div>
        ) : list.length === 0 ? (
          <div className="ag-empty">Belum ada data guru. <Link href="/admin/guru/baru">Tambah sekarang →</Link></div>
        ) : (
          <table className="ag-table">
            <thead>
              <tr>
                <th>Guru</th>
                <th>Mata Pelajaran</th>
                <th>Jabatan</th>
                <th>Status</th>
                <th>Urutan</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {list.map((g) => (
                <tr key={g.id}>
                  <td>
                    <div className="ag-name-cell">
                      <div className="ag-avatar">
                        {g.photo_url ? (
                          <img src={g.photo_url} alt={g.name} />
                        ) : (
                          getInitials(g.name)
                        )}
                      </div>
                      <div>
                        <div className="ag-name">{g.name}</div>
                        {g.nip && <div className="ag-nip">NIP: {g.nip}</div>}
                      </div>
                    </div>
                  </td>
                  <td>
                    {g.subject
                      ? <span className="ag-subject-badge">{g.subject}</span>
                      : <span style={{ color: '#cbd5e1' }}>—</span>
                    }
                  </td>
                  <td style={{ fontSize: '.85rem', color: '#475569' }}>
                    {g.position ?? <span style={{ color: '#cbd5e1' }}>—</span>}
                  </td>
                  <td>
                    <button
                      className={g.is_active ? 'ag-badge-active' : 'ag-badge-inactive'}
                      onClick={() => toggleActive(g)}
                      title="Klik untuk toggle"
                    >
                      {g.is_active ? 'Aktif' : 'Nonaktif'}
                    </button>
                  </td>
                  <td style={{ fontSize: '.85rem', color: '#94a3b8', textAlign: 'center' }}>
                    {g.order_index}
                  </td>
                  <td>
                    <div className="ag-actions">
                      <Link href={`/admin/guru/${g.id}`} className="ag-btn-edit">Edit</Link>
                      <button
                        className="ag-btn-del"
                        disabled={deleting === g.id}
                        onClick={() => handleDelete(g.id, g.name)}
                      >
                        {deleting === g.id ? '...' : 'Hapus'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  )
}