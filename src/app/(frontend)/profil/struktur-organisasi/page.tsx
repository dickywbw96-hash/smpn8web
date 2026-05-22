import type { Metadata } from 'next'
import PageHero from '@/components/ui/PageHero'

export const metadata: Metadata = { title: 'Struktur Organisasi' }

export default function StrukturOrganisasiPage() {
  return (
    <>
      <PageHero
        title="Struktur Organisasi"
        subtitle="Susunan organisasi dan kepemimpinan SMP Negeri 8 Probolinggo."
        breadcrumbs={[{ label: 'Profil', href: '/profil' }, { label: 'Struktur Organisasi' }]}
        accent="🏛️"
      />
      <section style={{ padding: '4rem 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="section-label">Organisasi</span>
          <h2 className="section-title" style={{ marginBottom: '2rem' }}>Struktur Organisasi Sekolah</h2>
          <div style={{
            background: 'var(--blue-50)',
            borderRadius: 'var(--radius-lg)',
            padding: '4rem 2rem',
            color: 'var(--gray-500)',
            border: '2px dashed var(--blue-200)'
          }}>
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>🏛️</span>
            <p>Bagan struktur organisasi akan ditampilkan di sini setelah diupload oleh administrator.</p>
          </div>
        </div>
      </section>
    </>
  )
}
