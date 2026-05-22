import type { Metadata } from 'next'
import BeritaKategoriPage from '@/components/ui/BeritaKategoriPage'

export const metadata: Metadata = { title: 'Prestasi' }
export const revalidate = 60

export default function PrestasiPage() {
  return <BeritaKategoriPage category="prestasi" />
}
