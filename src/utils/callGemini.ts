// src/utils/callGemini.ts
// Client-side Gemini caller dengan multi-key fallback (port dari useGeminiAI.js)
import { supabase } from '@/lib/supabase-elkpd'

const GEMINI_MODEL = 'gemini-2.5-flash'

const getEnvKeys = () => {
  const keys: { index: number; key: string }[] = []
  for (let i = 1; i <= 10; i++) {
    const k = process.env[`NEXT_PUBLIC_GEMINI_KEY_${i}`]
    if (k) keys.push({ index: i, key: k })
  }
  return keys
}

const markKey = async (keyIndex: number, status: string) => {
  await supabase.from('ai_key_usage').update({
    status, exhausted_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  }).eq('key_index', keyIndex)
}

const markUsed = async (keyIndex: number, currentTotal: number) => {
  await supabase.from('ai_key_usage').update({
    last_used_at: new Date().toISOString(),
    total_requests: (currentTotal || 0) + 1,
    updated_at: new Date().toISOString(),
  }).eq('key_index', keyIndex)
}

export async function callGemini(prompt: string, { onStatus }: { onStatus?: (s: string) => void } = {}) {
  const envKeys = getEnvKeys()
  if (!envKeys.length) throw new Error('Tidak ada NEXT_PUBLIC_GEMINI_KEY_* di .env')

  const { data: activeDbKeys, error } = await supabase
    .from('ai_key_usage').select('*').eq('status', 'active').order('key_index', { ascending: true })
  if (error || !activeDbKeys?.length) throw new Error('Semua API key Gemini sudah habis kuota!')

  const usableKeys = activeDbKeys
    .map((dbKey: any) => {
      const envEntry = envKeys.find(k => k.index === dbKey.key_index)
      return envEntry ? { ...dbKey, key: envEntry.key } : null
    })
    .filter(Boolean)

  if (!usableKeys.length) throw new Error('Tidak ada key yang cocok antara ENV dan database!')

  for (let i = 0; i < usableKeys.length; i++) {
    const current = usableKeys[i]
    if (onStatus) onStatus(`Menghubungi AI (key #${current.key_index})...`)
    await markUsed(current.key_index, current.total_requests)

    let res: Response
    try {
      res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${current.key}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 8192 },
          }),
        }
      )
    } catch { continue }

    if (res.status === 429 || res.status === 403) {
      if (onStatus) onStatus(`Key #${current.key_index} habis, ganti otomatis...`)
      await markKey(current.key_index, 'exhausted'); continue
    }
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}))
      throw new Error(`Gemini error ${res.status}: ${errBody?.error?.message || 'Unknown error'}`)
    }

    const json = await res.json()
    const text = json?.candidates?.[0]?.content?.parts?.[0]?.text
    if (!text) throw new Error('Respons AI kosong.')
    return text
  }
  throw new Error('Semua API key sudah dicoba dan habis. Hubungi admin.')
}
