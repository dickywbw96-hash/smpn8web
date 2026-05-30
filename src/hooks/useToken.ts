// src/hooks/useToken.ts
'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase-elkpd'

export function useToken() {
  const [kegiatan, setKegiatan] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const validateToken = async (token: string) => {
    setLoading(true)
    setError(null)
    try {
      const { data, error: err } = await supabase
        .from('kegiatan')
        .select('*, guru(nama, mapel)')
        .eq('token', token.toUpperCase().trim())
        .eq('aktif', true)
        .single()

      if (err || !data) {
        setError('Token tidak ditemukan atau sudah tidak aktif!')
        return null
      }
      setKegiatan(data)
      return data
    } catch {
      setError('Terjadi kesalahan. Coba lagi.')
      return null
    } finally {
      setLoading(false)
    }
  }

  return { kegiatan, validateToken, loading, error }
}
