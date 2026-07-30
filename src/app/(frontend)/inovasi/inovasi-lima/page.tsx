import type { Metadata } from 'next'
import InovasiDetailPage from '@/components/inovasi/InovasiDetailPage'
import { getInovasiBySlug } from '@/app/constants/inovasi'

export const metadata: Metadata = { title: 'INOVASI LIMA — Inovasi Sekolah' }

export default function InovasiLimaPage() {
  const item = getInovasiBySlug('inovasi-lima')!
  return <InovasiDetailPage item={item} />
}
