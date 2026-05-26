import type { Metadata } from 'next'
import PageHero from '@/components/ui/PageHero'
import VisiMisiFullSection from '@/components/home/VisiMisiFullSection'
import { getSiteSettings } from '@/lib/db'

export const metadata: Metadata = { title: 'Visi & Misi' }
export const revalidate = 300

export default async function VisiMisiPage() {
  const settings = await getSiteSettings()
  return (
    <>
      <PageHero
        title="Visi & Misi"
        subtitle="Arah dan tujuan SMP Negeri 8 Probolinggo dalam mendidik generasi bangsa."
        breadcrumbs={[{ label: 'Profil', href: '/profil' }, { label: 'Visi & Misi' }]}
        accent="🎯"
      />
      <VisiMisiFullSection settings={settings} />
    </>
  )
}
