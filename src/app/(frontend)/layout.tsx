import type { Metadata } from 'next'
import { getSiteSettings, getImageUrl } from '@/lib/db'
import { getThemeById, themeToCSS } from '@/lib/themes'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Ticker from '@/components/layout/Ticker'
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

  return (
    <html lang="id">
      <head>
        <style dangerouslySetInnerHTML={{ __html: themeStyles }} data-theme="dynamic" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <Ticker text={settings?.tickerText} enabled={settings?.tickerEnabled ?? true} />
        <Navbar logoUrl={logoUrl} settings={settings} />
        <main>{children}</main>
        <Footer settings={settings} />
      </body>
    </html>
  )
}