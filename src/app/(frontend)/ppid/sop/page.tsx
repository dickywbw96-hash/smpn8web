import type { Metadata } from 'next'
import PPIDSubPage from '@/components/ppid/PPIDSubPage'
export const metadata: Metadata = { title: 'SOP PPID' }
export const revalidate = 300
export default function PPIDSopPage() {
  return <PPIDSubPage category="sop" currentHref="/ppid/sop" />
}
