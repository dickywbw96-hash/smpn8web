// src/components/elkpd/PageWrapper.tsx
export default function PageWrapper({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`min-h-screen w-full ${className}`} style={{ position: 'relative', isolation: 'isolate' }}>
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, backgroundImage: 'url(/bg1.png)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
      <div style={{ position: 'fixed', inset: 0, zIndex: 1, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(1px)' }} />
      <div style={{ position: 'relative', zIndex: 2 }}>{children}</div>
    </div>
  )
}