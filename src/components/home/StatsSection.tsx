export default function StatsSection() {
  const stats = [
    { icon: '🎓', value: '700+', label: 'Siswa Aktif' },
    { icon: '👩‍🏫', value: '50+', label: 'Guru & Tenaga Pendidik' },
    { icon: '🏆', value: '100+', label: 'Prestasi Diraih' },
    { icon: '🌿', label: 'Sekolah Adiwiyata', value: '✓' },
  ]

  return (
    <>
      <style>{`
        .stats-section {
          background: white;
          padding: 2rem 0;
          box-shadow: 0 4px 24px rgba(7,30,74,.07);
          position: relative;
          z-index: 5;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1px;
          background: var(--gray-100);
          border-radius: var(--radius-lg);
          overflow: hidden;
        }
        .stat-item {
          background: white;
          padding: 1.75rem 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          transition: background .2s ease;
        }
        .stat-item:hover { background: var(--blue-50); }
        .stat-icon {
          font-size: 2rem;
          flex-shrink: 0;
        }
        .stat-value {
          font-family: 'Playfair Display', serif;
          font-size: 1.75rem;
          color: var(--blue-800);
          font-weight: 700;
          line-height: 1;
          margin-bottom: .2rem;
        }
        .stat-label {
          font-size: .82rem;
          color: var(--gray-500);
          font-weight: 500;
        }
        @media (max-width: 768px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 480px) {
          .stats-grid { grid-template-columns: 1fr; }
        }
      `}</style>
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((s, i) => (
              <div key={i} className="stat-item">
                <span className="stat-icon">{s.icon}</span>
                <div>
                  <div className="stat-value">{s.value}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
