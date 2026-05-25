import type { Metadata } from 'next'
import { getSiteSettings, getImageUrl } from '@/lib/db'
import { getThemeById, themeToCSS } from '@/lib/themes'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import '@/styles/globals.css'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  return {
    title: {
      default: settings?.seo?.metaTitle ?? 'SMP Negeri 8 Probolinggo',
      template: `%s | SMP Negeri 8 Probolinggo`,
    },
    description: settings?.seo?.metaDescription ?? 'Website resmi SMP Negeri 8 Kota Probolinggo',
    metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'),
    openGraph: {
      siteName: 'SMP Negeri 8 Probolinggo',
      locale: 'id_ID',
      images: settings?.seo?.ogImage ? [getImageUrl(settings.seo.ogImage)] : [],
    },
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings()
  const logoUrl = settings?.schoolLogo ? getImageUrl(settings.schoolLogo) : undefined
  const theme = getThemeById((settings as any)?.activeTheme ?? 'klasik-formal')
  const themeStyles = themeToCSS(theme)

  // Ticker state untuk kalkulasi paddingTop awal (SSR).
  // Navbar sendiri sudah handle sticky + perubahan height via JS.
  // Nilai ini adalah tinggi maksimum (sebelum scroll):
  //   topbar(36) + navbar(66) + ticker(34) = 136px
  //   tanpa ticker: 36 + 66 = 102px
  const showTicker = (settings?.tickerEnabled ?? true) && !!settings?.tickerText
  const initialPadding = 36 + 66 + (showTicker ? 34 : 0)

  return (
    <html lang="id">
      <head>
        <style dangerouslySetInnerHTML={{ __html: themeStyles }} data-theme="dynamic" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        {/*
          Navbar sekarang menampung topbar + navbar + ticker dalam satu
          .header-shell fixed, sehingga tidak ada celah/gap di antara ketiganya.
          Ticker.tsx sudah bisa dihapus / tidak dipakai lagi.
        */}
        <Navbar
          logoUrl={logoUrl}
          settings={settings}
          tickerText={settings?.tickerText}
          tickerEnabled={settings?.tickerEnabled ?? true}
        />
        <main style={{ paddingTop: `${initialPadding}px` }}>{children}</main>
        <Footer settings={settings} />
      </body>
    </html>
  )
}