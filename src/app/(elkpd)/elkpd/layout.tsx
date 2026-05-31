// src/app/(elkpd)/elkpd/layout.tsx
import '@/styles/globals.css'

export const metadata = {
  title: 'e-LKPD | SMP Negeri 8 Probolinggo',
  description: 'Laman Pembelajaran Jarak Jauh SMP Negeri 8 Probolinggo',
}

export default function ElkpdLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}