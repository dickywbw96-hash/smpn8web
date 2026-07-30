import type { Metadata } from 'next'
import InovasiDetailPage from '@/components/inovasi/InovasiDetailPage'
import { getInovasiBySlug } from '@/app/constants/inovasi'

export const metadata: Metadata = { title: 'BATOLU — Inovasi Sekolah' }

export default function InovasiBatoluPage() {
  const item = getInovasiBySlug('batolu')!
  return <InovasiDetailPage item={item} />
}
