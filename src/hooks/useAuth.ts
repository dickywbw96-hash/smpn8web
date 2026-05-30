// src/hooks/useAuth.ts
'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase-elkpd'

export function useAuth() {
  const [guru, setGuru] = useState<any>(() => {
    if (typeof window === 'undefined') return null
    const saved = sessionStorage.getItem('guru_session')
    return saved ? JSON.parse(saved) : null
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = async (username: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      const { data, error: err } = await supabase
        .from('guru')
        .select('*')
        .eq('username', username)
        .eq('password', password)
        .single()

      if (err || !data) {
        setError('Username atau password salah!')
        return false
      }
      sessionStorage.setItem('guru_session', JSON.stringify(data))
      setGuru(data)
      return true
    } catch {
      setError('Terjadi kesalahan. Coba lagi.')
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    sessionStorage.removeItem('guru_session')
    setGuru(null)
  }

  return { guru, login, logout, loading, error }
}
