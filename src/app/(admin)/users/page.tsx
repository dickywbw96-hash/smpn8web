'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

// ── Types ─────────────────────────────────────────────────────────────────────

interface UserRow {
  id: string
  email: string
  name: string
  role: 'admin' | 'editor'
  is_active: boolean
  created_at: string
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const INPUT_STYLE: React.CSSProperties = {
  width: '100%', padding: '0.6rem 0.75rem', border: '1px solid #e5e7eb',
  borderRadius: '8px', fontSize: '0.875rem', color: '#111827',
  background: 'white', boxSizing: 'border-box', outline: 'none',
}
const LABEL_STYLE: React.CSSProperties = { fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.3rem', display: 'block' }

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <label style={LABEL_STYLE}>{label}</label>
      {children}
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function UsersPage() {
  const [users, setUsers] = useState<UserRow[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editUser, setEditUser] = useState<UserRow | null>(null)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)
  const [currentUserId, setCurrentUserId] = useState<string>('')

  // Form state
  const [formName, setFormName] = useState('')
  const [formEmail, setFormEmail] = useState('')
  const [formRole, setFormRole] = useState<'admin' | 'editor'>('editor')
  const [formPassword, setFormPassword] = useState('')
  const [formActive, setFormActive] = useState(true)

  useEffect(() => {
    fetchCurrent()
    fetchUsers()
  }, [])

  async function fetchCurrent() {
    const { data: { session } } = await supabase.auth.getSession()
    if (session) setCurrentUserId(session.user.id)
  }

  async function fetchUsers() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error) setUsers(data ?? [])
    setLoading(false)
  }

  function showToast(msg: string, type: 'success' | 'error' = 'success') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  function openCreate() {
    setEditUser(null)
    setFormName(''); setFormEmail(''); setFormRole('editor'); setFormPassword(''); setFormActive(true)
    setShowModal(true)
  }

  function openEdit(user: UserRow) {
    setEditUser(user)
    setFormName(user.name); setFormEmail(user.email); setFormRole(user.role)
    setFormPassword(''); setFormActive(user.is_active)
    setShowModal(true)
  }

  async function handleSave() {
    if (!formName.trim() || !formEmail.trim()) {
      showToast('Nama dan email wajib diisi', 'error'); return
    }
    setSaving(true)

    try {
      if (editUser) {
        // Update data di tabel users
        const { error } = await supabase
          .from('users')
          .update({ name: formName, role: formRole, is_active: formActive })
          .eq('id', editUser.id)
        if (error) throw error
        showToast('User berhasil diperbarui')
      } else {
        // Buat user baru via Supabase Auth (perlu service role di server, ini contoh client-side)
        // Pada implementasi nyata, gunakan API Route untuk panggil supabaseAdmin.auth.admin.createUser
        if (!formPassword || formPassword.length < 6) {
          showToast('Password minimal 6 karakter', 'error'); setSaving(false); return
        }
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formEmail,
          password: formPassword,
        })
        if (authError) throw authError
        if (authData.user) {
          const { error } = await supabase.from('users').insert({
            id: authData.user.id,
            email: formEmail,
            name: formName,
            role: formRole,
            is_active: formActive,
          })
          if (error) throw error
        }
        showToast('User berhasil dibuat. Cek email untuk konfirmasi.')
      }
      setShowModal(false)
      fetchUsers()
    } catch (err: any) {
      showToast(err.message ?? 'Terjadi kesalahan', 'error')
    } finally {
      setSaving(false)
    }
  }

  async function toggleActive(user: UserRow) {
    if (user.id === currentUserId) {
      showToast('Tidak dapat menonaktifkan akun Anda sendiri', 'error'); return
    }
    const { error } = await supabase
      .from('users')
      .update({ is_active: !user.is_active })
      .eq('id', user.id)
    if (error) { showToast('Gagal memperbarui status', 'error'); return }
    showToast(user.is_active ? 'User dinonaktifkan' : 'User diaktifkan')
    fetchUsers()
  }

  function formatDate(d: string) {
    return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(d))
  }

  if (loading) return <div style={{ padding: '2rem', color: '#6b7280' }}>Memuat...</div>

  return (
    <div style={{ padding: '2rem' }}>
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#030f2b' }}>Kelola User</h1>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            {users.length} user terdaftar
          </p>
        </div>
        <button
          onClick={openCreate}
          style={{
            padding: '0.6rem 1.25rem', background: '#0d2a5e', color: 'white',
            border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '0.875rem',
          }}
        >
          + Tambah User
        </button>
      </div>

      {/* Info box */}
      <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '10px', padding: '0.875rem 1.25rem', marginBottom: '1.5rem', fontSize: '0.8rem', color: '#92400e' }}>
        ⚠️ <strong>Catatan:</strong> Pembuatan user baru memerlukan konfirmasi email. Gunakan Supabase Dashboard untuk membuat user tanpa konfirmasi email, atau aktifkan "Auto-confirm" di pengaturan Supabase Auth.
      </div>

      {/* Table */}
      <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9fafb', borderBottom: '2px solid #f3f4f6' }}>
              <th style={{ textAlign: 'left', padding: '0.875rem 1rem', fontSize: '0.8rem', color: '#6b7280', fontWeight: 600 }}>Nama</th>
              <th style={{ textAlign: 'left', padding: '0.875rem 1rem', fontSize: '0.8rem', color: '#6b7280', fontWeight: 600 }}>Email</th>
              <th style={{ textAlign: 'left', padding: '0.875rem 1rem', fontSize: '0.8rem', color: '#6b7280', fontWeight: 600 }}>Role</th>
              <th style={{ textAlign: 'left', padding: '0.875rem 1rem', fontSize: '0.8rem', color: '#6b7280', fontWeight: 600 }}>Status</th>
              <th style={{ textAlign: 'left', padding: '0.875rem 1rem', fontSize: '0.8rem', color: '#6b7280', fontWeight: 600 }}>Bergabung</th>
              <th style={{ textAlign: 'right', padding: '0.875rem 1rem', fontSize: '0.8rem', color: '#6b7280', fontWeight: 600 }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} style={{ borderBottom: '1px solid #f9fafb' }}>
                <td style={{ padding: '0.875rem 1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '36px', height: '36px', borderRadius: '50%',
                      background: user.role === 'admin' ? '#0d2a5e' : '#16a34a',
                      color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.875rem', fontWeight: 700, flexShrink: 0,
                    }}>
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: '#111827', fontSize: '0.875rem' }}>
                        {user.name}
                        {user.id === currentUserId && (
                          <span style={{ marginLeft: '0.5rem', fontSize: '0.7rem', background: '#dbeafe', color: '#1d4ed8', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 600 }}>Anda</span>
                        )}
                      </div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '0.875rem 1rem', fontSize: '0.875rem', color: '#6b7280' }}>{user.email}</td>
                <td style={{ padding: '0.875rem 1rem' }}>
                  <span style={{
                    padding: '0.2rem 0.7rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 700,
                    background: user.role === 'admin' ? '#dbeafe' : '#dcfce7',
                    color: user.role === 'admin' ? '#1d4ed8' : '#16a34a',
                  }}>
                    {user.role === 'admin' ? '🔑 Admin' : '✏️ Editor'}
                  </span>
                </td>
                <td style={{ padding: '0.875rem 1rem' }}>
                  <span style={{
                    padding: '0.2rem 0.7rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 600,
                    background: user.is_active ? '#dcfce7' : '#f3f4f6',
                    color: user.is_active ? '#16a34a' : '#9ca3af',
                  }}>
                    {user.is_active ? 'Aktif' : 'Nonaktif'}
                  </span>
                </td>
                <td style={{ padding: '0.875rem 1rem', fontSize: '0.8rem', color: '#9ca3af' }}>{formatDate(user.created_at)}</td>
                <td style={{ padding: '0.875rem 1rem', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => openEdit(user)}
                      style={{ padding: '0.4rem 0.875rem', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => toggleActive(user)}
                      disabled={user.id === currentUserId}
                      style={{
                        padding: '0.4rem 0.875rem', border: 'none', borderRadius: '6px', cursor: user.id === currentUserId ? 'not-allowed' : 'pointer', fontSize: '0.8rem', fontWeight: 600,
                        background: user.is_active ? '#fee2e2' : '#dcfce7',
                        color: user.is_active ? '#dc2626' : '#16a34a',
                        opacity: user.id === currentUserId ? 0.4 : 1,
                      }}
                    >
                      {user.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af', fontSize: '0.875rem' }}>Belum ada user</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Role info */}
      <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {[
          { role: 'Admin', icon: '🔑', color: '#1d4ed8', bg: '#dbeafe', perms: ['Akses semua fitur', 'Kelola user', 'Ubah pengaturan website', 'Approve/reject permintaan hapus', 'Hapus konten'] },
          { role: 'Editor', icon: '✏️', color: '#16a34a', bg: '#dcfce7', perms: ['Tambah & edit berita', 'Tambah & edit ekskul', 'Tambah & edit PPID', 'Tidak bisa hapus konten', 'Tidak bisa akses pengaturan & user'] },
        ].map(r => (
          <div key={r.role} style={{ background: 'white', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span style={{ padding: '0.25rem 0.75rem', background: r.bg, color: r.color, borderRadius: '100px', fontSize: '0.8rem', fontWeight: 700 }}>{r.icon} {r.role}</span>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {r.perms.map(p => (
                <li key={p} style={{ fontSize: '0.8rem', color: '#6b7280', padding: '0.2rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ color: r.color }}>•</span> {p}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
        }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '460px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#030f2b', marginBottom: '1.5rem' }}>
              {editUser ? 'Edit User' : 'Tambah User Baru'}
            </h2>

            <Field label="Nama Lengkap *">
              <input style={INPUT_STYLE} value={formName} onChange={e => setFormName(e.target.value)} placeholder="Nama lengkap..." />
            </Field>

            <Field label="Email *">
              <input
                style={{ ...INPUT_STYLE, background: editUser ? '#f9fafb' : 'white', color: editUser ? '#9ca3af' : '#111827' }}
                value={formEmail}
                onChange={e => setFormEmail(e.target.value)}
                placeholder="email@sekolah.sch.id"
                type="email"
                disabled={!!editUser}
              />
              {editUser && <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>Email tidak dapat diubah</p>}
            </Field>

            {!editUser && (
              <Field label="Password *">
                <input style={INPUT_STYLE} value={formPassword} onChange={e => setFormPassword(e.target.value)} placeholder="Minimal 6 karakter" type="password" />
              </Field>
            )}

            <Field label="Role">
              <select style={INPUT_STYLE} value={formRole} onChange={e => setFormRole(e.target.value as any)}>
                <option value="editor">Editor</option>
                <option value="admin">Admin</option>
              </select>
            </Field>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <input type="checkbox" id="activeCheck" checked={formActive} onChange={e => setFormActive(e.target.checked)} style={{ width: '18px', height: '18px', accentColor: '#0d2a5e' }} />
              <label htmlFor="activeCheck" style={{ fontSize: '0.875rem', color: '#374151', cursor: 'pointer' }}>Akun aktif</label>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowModal(false)}
                style={{ padding: '0.6rem 1.25rem', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' }}
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                style={{
                  padding: '0.6rem 1.5rem', background: saving ? '#93c5fd' : '#0d2a5e',
                  color: 'white', border: 'none', borderRadius: '8px', cursor: saving ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: '0.875rem',
                }}
              >
                {saving ? 'Menyimpan...' : editUser ? 'Perbarui' : 'Buat User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}