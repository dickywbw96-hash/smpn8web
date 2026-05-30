import type { Metadata } from 'next'
import '@/styles/globals.css'
import PageTransition from '@/components/PageTransition'

export const metadata: Metadata = {
  title: 'SMP Negeri 8 Probolinggo',
  description: 'Website resmi SMP Negeri 8 Kota Probolinggo',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <PageTransition />
        {children}
      </body>
    </html>
  )
}