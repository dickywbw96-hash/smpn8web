import type { Metadata } from 'next'
import InovasiDetailPage from '@/components/inovasi/InovasiDetailPage'
import { getInovasiBySlug } from '@/app/constants/inovasi'

export const metadata: Metadata = { title: 'REMUS — Inovasi Sekolah' }

export default function InovasiRemusPage() {
  const item = getInovasiBySlug('remus')!
  return <InovasiDetailPage item={item} />
}
