import type { Metadata } from 'next'
import BeritaKategoriPage from '@/components/ui/BeritaKategoriPage'

export const metadata: Metadata = { title: 'Kegiatan Umum' }
export const revalidate = 60

export default function KegiatanUmumPage() {
  return <BeritaKategoriPage category="kegiatan_umum" />
}
