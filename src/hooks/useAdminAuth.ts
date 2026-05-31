// src/hooks/useAdminAuth.ts
'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase-elkpd'

export function useAdminAuth() {
  const [admin, setAdmin] = useState<any>(() => {
    if (typeof window === 'undefined') return null
    try { const s = localStorage.getItem('admin_session'); return s ? JSON.parse(s) : null } catch { return null }
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = async (username: string, password: string) => {
    setLoading(true); setError(null)
    try {
      const { data, error: err } = await supabase
        .from('admin').select('*')
        .eq('username', username).eq('password', password).single()
      if (err || !data) { setError('Username atau password salah!'); return false }
      localStorage.setItem('admin_session', JSON.stringify(data))
      setAdmin(data); return true
    } catch { setError('Terjadi kesalahan. Coba lagi.'); return false }
    finally { setLoading(false) }
  }

  const logout = () => { localStorage.removeItem('admin_session'); setAdmin(null) }
  return { admin, login, logout, loading, error }
}
