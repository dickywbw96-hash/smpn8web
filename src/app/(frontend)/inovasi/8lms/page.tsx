import type { Metadata } from 'next'
import InovasiDetailPage from '@/components/inovasi/InovasiDetailPage'
import { getInovasiBySlug } from '@/app/constants/inovasi'

export const metadata: Metadata = { title: '8LMS — Inovasi Sekolah' }

export default function Inovasi8LMSPage() {
  const item = getInovasiBySlug('8lms')!
  return <InovasiDetailPage item={item} />
}
