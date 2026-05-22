import type { Metadata } from 'next'
import PPIDSubPage from '@/components/ppid/PPIDSubPage'
export const metadata: Metadata = { title: 'Tentang PPID' }
export const revalidate = 300
export default function PPIDTentangPage() {
  return <PPIDSubPage category="tentang" currentHref="/ppid/tentang" />
}
