import type { Metadata } from 'next'
import BeritaKategoriPage from '@/components/ui/BeritaKategoriPage'

export const metadata: Metadata = { title: 'Artikel' }
export const revalidate = 60

export default function ArtikelPage() {
  return <BeritaKategoriPage category="artikel" />
}