import type { Metadata } from 'next'
import InovasiDetailPage from '@/components/inovasi/InovasiDetailPage'
import { getInovasiBySlug } from '@/app/constants/inovasi'

export const metadata: Metadata = { title: 'PAMER SI WOLU — Inovasi Sekolah' }

export default function InovasiPamerSiWoluPage() {
  const item = getInovasiBySlug('pamer-si-wolu')!
  return <InovasiDetailPage item={item} />
}
