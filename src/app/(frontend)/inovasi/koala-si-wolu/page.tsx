import type { Metadata } from 'next'
import InovasiDetailPage from '@/components/inovasi/InovasiDetailPage'
import { getInovasiBySlug } from '@/app/constants/inovasi'

export const metadata: Metadata = { title: 'KOALA SI WOLU — Inovasi Sekolah' }

export default function KoalaSiWoluPage() {
  const item = getInovasiBySlug('koala-si-wolu')!
  return <InovasiDetailPage item={item} />
}