import type { Metadata } from 'next'
import PPIDSubPage from '@/components/ppid/PPIDSubPage'
export const metadata: Metadata = { title: 'MoU' }
export const revalidate = 300
export default function PPIDMouPage() {
  return <PPIDSubPage category="mou" currentHref="/ppid/mou" />
}
