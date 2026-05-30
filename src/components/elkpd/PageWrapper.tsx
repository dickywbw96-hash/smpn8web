// src/components/elkpd/PageWrapper.tsx
export default function PageWrapper({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`min-h-screen w-full relative ${className}`}
      style={{
        backgroundImage: 'url(/bg1.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] z-0" />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
