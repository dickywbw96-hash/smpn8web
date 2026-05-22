import type { Metadata } from 'next'
import React from 'react'
import './custom.css'

type Args = {
  children: React.ReactNode
}

export const metadata: Metadata = {
  title: {
    default: 'Admin Panel — SMPN 8 Probolinggo',
    template: '%s | Admin SMPN 8',
  },
  description: 'Panel administrasi website SMP Negeri 8 Probolinggo',
  robots: {
    index: false,
    follow: false,
  },
}

export default function Layout({ children }: Args) {
  return <>{children}</>
}