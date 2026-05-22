import type { Metadata } from 'next'
import BeritaKategoriPage from '@/components/ui/BeritaKategoriPage'

export const metadata: Metadata = { title: 'Kegiatan Organisasi' }
export const revalidate = 60

export default function KegiatanOrganisasiPage() {
  return <BeritaKategoriPage category="kegiatan_organisasi" />
}
