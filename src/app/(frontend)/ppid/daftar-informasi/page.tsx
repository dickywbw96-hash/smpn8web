import type { Metadata } from 'next'
import PPIDSubPage from '@/components/ppid/PPIDSubPage'
export const metadata: Metadata = { title: 'Daftar Informasi Publik' }
export const revalidate = 300
export default function PPIDDaftarPage() {
  return <PPIDSubPage category="daftar_informasi" currentHref="/ppid/daftar-informasi" />
}
