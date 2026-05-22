import { NotFoundPage } from '@payloadcms/next/views'
import type { Metadata } from 'next'
import configPromise from '@payload-config'
import { importMap } from '../importMap.js'

import './custom.css'

type Args = {
  params: Promise<{
    segments: string[]
  }>
  searchParams: Promise<{
    [key: string]: string | string[]
  }>
}

export const metadata: Metadata = {
  title: 'Halaman Tidak Ditemukan',
  description: 'Halaman yang kamu cari tidak tersedia di panel admin SMPN 8 Probolinggo.',
  robots: {
    index: false,
    follow: false,
  },
}

export default async function NotFound({ params, searchParams }: Args) {
  return (
    <NotFoundPage
      config={configPromise}
      params={params}
      searchParams={searchParams}
      importMap={importMap}
    />
  )
}