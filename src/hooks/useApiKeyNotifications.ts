// src/hooks/useApiKeyNotifications.ts
'use client'
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase-elkpd'

const getReadIds = () => {
  try { return new Set<string>(JSON.parse(localStorage.getItem('admin_read_notif') || '[]')) }
  catch { return new Set<string>() }
}
const saveReadIds = (set: Set<string>) =>
  localStorage.setItem('admin_read_notif', JSON.stringify([...set]))

export function useApiKeyNotifications(pollIntervalMs = 30_000) {
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const fetchNotifications = useCallback(async () => {
    const { data, error } = await supabase
      .from('ai_key_usage')
      .select('key_index, status, exhausted_at, total_requests, updated_at')
      .in('status', ['exhausted', 'error'])
      .order('exhausted_at', { ascending: false })
    if (error) { setLoading(false); return }
    const readIds = getReadIds()
    const mapped = (data || []).map((row: any) => ({
      id: `key-${row.key_index}`, keyIndex: row.key_index,
      status: row.status, exhaustedAt: row.exhausted_at,
      totalRequests: row.total_requests, updatedAt: row.updated_at,
      isRead: readIds.has(`key-${row.key_index}`),
      message: row.status === 'exhausted'
        ? `API Key #${row.key_index} sudah habis kuota`
        : `API Key #${row.key_index} mengalami error berulang`,
      detail: row.status === 'exhausted'
        ? 'Pengguna tidak bisa generate LKPD sampai key diganti atau direset.'
        : 'Key ini gagal berulang kali. Periksa validitasnya.',
    }))
    setNotifications(mapped)
    setUnreadCount(mapped.filter((n: any) => !n.isRead).length)
    setLoading(false)
  }, [])

  const markAsRead = useCallback((id: string) => {
    const readIds = getReadIds(); readIds.add(id); saveReadIds(readIds)
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))
    setUnreadCount(prev => Math.max(0, prev - 1))
  }, [])

  const markAllRead = useCallback(() => {
    const readIds = getReadIds()
    setNotifications(prev => { prev.forEach(n => readIds.add(n.id)); saveReadIds(readIds); return prev.map(n => ({ ...n, isRead: true })) })
    setUnreadCount(0)
  }, [])

  const resetKey = useCallback(async (keyIndex: number) => {
    const { error } = await supabase.from('ai_key_usage')
      .update({ status: 'active', exhausted_at: null, updated_at: new Date().toISOString() })
      .eq('key_index', keyIndex)
    if (error) return false
    const id = `key-${keyIndex}`; const readIds = getReadIds()
    readIds.delete(id); saveReadIds(readIds)
    await fetchNotifications(); return true
  }, [fetchNotifications])

  useEffect(() => {
    fetchNotifications()
    const timer = setInterval(fetchNotifications, pollIntervalMs)
    return () => clearInterval(timer)
  }, [fetchNotifications, pollIntervalMs])

  return { notifications, unreadCount, loading, markAsRead, markAllRead, resetKey, refresh: fetchNotifications }
}
