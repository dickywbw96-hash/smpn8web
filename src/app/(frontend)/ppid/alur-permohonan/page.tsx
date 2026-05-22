import type { Metadata } from 'next'
import PPIDSubPage from '@/components/ppid/PPIDSubPage'
export const metadata: Metadata = { title: 'Alur Permohonan Informasi' }
export const revalidate = 300
export default function PPIDAlurPage() {
  return <PPIDSubPage category="alur_permohonan" currentHref="/ppid/alur-permohonan" />
}
