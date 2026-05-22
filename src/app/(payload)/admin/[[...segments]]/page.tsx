import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
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

export const generateMetadata = async ({ params, searchParams }: Args): Promise<Metadata> => {
  return generatePageMetadata({ config: configPromise, params, searchParams })
}

export default async function Page({ params, searchParams }: Args) {
  return (
    <RootPage
      config={configPromise}
      params={params}
      searchParams={searchParams}
      importMap={importMap}
    />
  )
}