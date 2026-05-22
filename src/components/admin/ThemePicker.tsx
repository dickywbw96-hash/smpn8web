'use client'

import React, { useState, useEffect } from 'react'
import { useField } from '@payloadcms/ui'
import { themes } from '@/lib/themes'
import type { Theme, ThemeId } from '@/lib/themes'

const css = `
.tp-wrap { padding: 8px 0; }
.tp-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
  margin-bottom: 20px;
}
.tp-btn {
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  padding: 12px 8px;
  cursor: pointer;
  background: #fff;
  text-align: center;
  transition: all 0.2s;
  font-family: inherit;
  width: 100%;
}
.tp-btn:hover { border-color: #1d4ed8; transform: translateY(-2px); }
.tp-btn.active { border-color: #1d4ed8; box-shadow: 0 0 0 3px rgba(29,78,216,0.15); }
.tp-swatch {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  margin: 0 auto 8px;
  overflow: hidden;
}
.tp-swatch-inner { width: 100%; height: 100%; border-radius: 50%; }
.tp-name { font-size: 11px; font-weight: 600; color: #1e293b; line-height: 1.3; margin-bottom: 2px; }
.tp-desc { font-size: 10px; color: #64748b; line-height: 1.3; }
.tp-active-badge {
  display: inline-block;
  margin-top: 6px;
  padding: 2px 8px;
  background: #1d4ed8;
  color: #fff;
  border-radius: 10px;
  font-size: 9px;
  font-weight: 600;
}
.tp-preview {
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 12px;
}
.tp-preview-label {
  padding: 8px 12px;
  background: #f8fafc;
  font-size: 11px;
  color: #64748b;
  border-bottom: 1px solid #e2e8f0;
}
.tp-preview-label strong { color: #1e3a8a; }
.tp-mockup { font-size: 0; }
.tp-nav {
  padding: 8px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.tp-nav-logo { font-size: 11px; font-weight: 600; }
.tp-nav-links { display: flex; gap: 10px; }
.tp-nav-link { font-size: 9px; opacity: 0.85; }
.tp-ticker { padding: 4px 12px; font-size: 10px; text-align: center; }
.tp-hero { padding: 20px 12px 16px; }
.tp-hero-tag { font-size: 9px; margin-bottom: 4px; opacity: 0.8; letter-spacing: 0.05em; }
.tp-hero-title { font-size: 15px; font-weight: 600; line-height: 1.3; margin-bottom: 6px; }
.tp-hero-sub { font-size: 10px; opacity: 0.75; line-height: 1.5; margin-bottom: 12px; }
.tp-hero-btn { display: inline-block; padding: 6px 14px; font-size: 10px; font-weight: 600; cursor: default; }
.tp-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; padding: 10px 12px; }
.tp-card-item { border-radius: 4px; padding: 8px; border: 0.5px solid rgba(0,0,0,0.08); }
.tp-card-title { font-size: 10px; font-weight: 600; margin-bottom: 2px; }
.tp-card-text { font-size: 9px; opacity: 0.7; line-height: 1.4; }
.tp-section-title { font-size: 12px; font-weight: 600; padding: 8px 12px 4px; }
.tp-news { display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px; padding: 0 12px 12px; }
.tp-news-card { border-radius: 4px; overflow: hidden; border: 0.5px solid rgba(0,0,0,0.08); }
.tp-news-img { height: 36px; }
.tp-news-body { padding: 6px; }
.tp-news-tag { font-size: 9px; font-weight: 600; margin-bottom: 2px; }
.tp-news-title { font-size: 10px; line-height: 1.3; }
.tp-footer { padding: 8px 12px; font-size: 9px; text-align: center; opacity: 0.85; }
`

export default function ThemePicker() {
  const { value, setValue } = useField<string>({ path: 'activeTheme' })
  const [selected, setSelected] = useState<ThemeId>((value as ThemeId) ?? 'klasik-formal')

  useEffect(() => {
    if (value) setSelected(value as ThemeId)
  }, [value])

  function handleSelect(id: ThemeId) {
    setSelected(id)
    setValue(id)
  }

  const activeTheme: Theme = themes.find((t: Theme) => t.id === selected) ?? themes[0]
  const v = activeTheme.variables

  return (
    <div className="tp-wrap">
      <style>{css}</style>

      <div className="tp-grid">
        {themes.map((t: Theme) => (
          <button
            key={t.id}
            type="button"
            className={`tp-btn${selected === t.id ? ' active' : ''}`}
            onClick={() => handleSelect(t.id)}
            aria-pressed={selected === t.id}
          >
            <div className="tp-swatch">
              <div
                className="tp-swatch-inner"
                style={{
                  background: `linear-gradient(135deg, ${t.preview.primary} 55%, ${t.preview.accent} 100%)`,
                }}
              />
            </div>
            <div className="tp-name">{t.name}</div>
            <div className="tp-desc">{t.description.split('.')[0]}</div>
            {selected === t.id && <div className="tp-active-badge">✓ Aktif</div>}
          </button>
        ))}
      </div>

      <div className="tp-preview">
        <div className="tp-preview-label">
          Preview: <strong>{activeTheme.name}</strong> — {activeTheme.description}
        </div>

        <div className="tp-mockup">
          <div
            className="tp-nav"
            style={{ background: v['--color-nav-bg'], borderBottom: v['--nav-border'], fontFamily: v['--font-heading'] }}
          >
            <span className="tp-nav-logo" style={{ color: v['--color-nav-text'] }}>
              ⚑ SMPN 8 Probolinggo
            </span>
            <div className="tp-nav-links">
              {(['Home', 'Profil', 'Berita', 'PPID', 'SPMB'] as string[]).map((m: string) => (
                <span key={m} className="tp-nav-link" style={{ color: v['--color-nav-text'] }}>{m}</span>
              ))}
            </div>
          </div>

          <div
            className="tp-ticker"
            style={{ background: v['--color-ticker-bg'], color: v['--color-ticker-text'], fontFamily: v['--font-body'] }}
          >
            ✦ Selamat datang di website resmi SMP Negeri 8 Probolinggo ✦
          </div>

          <div
            className="tp-hero"
            style={{ background: v['--color-hero-bg'], fontFamily: v['--font-heading'] }}
          >
            <div className="tp-hero-tag" style={{ color: v['--color-accent'] }}>
              SEKOLAH ADIWIYATA · BERPRESTASI
            </div>
            <div className="tp-hero-title" style={{ color: v['--color-hero-text'] }}>
              Guru Berkualitas,<br />Sekolah Berprestasi
            </div>
            <div className="tp-hero-sub" style={{ color: v['--color-hero-text'] }}>
              Mewujudkan generasi unggul, berkarakter, dan berwawasan lingkungan.
            </div>
            <span
              className="tp-hero-btn"
              style={{ background: v['--color-btn-bg'], color: v['--color-btn-text'], borderRadius: v['--radius-btn'] }}
            >
              Lihat Profil Sekolah
            </span>
          </div>

          <div className="tp-cards" style={{ background: v['--color-bg-secondary'] }}>
            {(['Sekolah Adiwiyata', 'Berprestasi', 'Guru Berkualitas'] as string[]).map((c: string) => (
              <div
                key={c}
                className="tp-card-item"
                style={{ background: v['--color-bg'], borderRadius: v['--radius-card'] }}
              >
                <div className="tp-card-title" style={{ color: v['--color-primary'], fontFamily: v['--font-heading'] }}>{c}</div>
                <div className="tp-card-text" style={{ color: v['--color-text-muted'] }}>Keunggulan sekolah kami</div>
              </div>
            ))}
          </div>

          <div style={{ background: v['--color-bg'] }}>
            <div className="tp-section-title" style={{ color: v['--color-primary'], fontFamily: v['--font-heading'] }}>
              Berita Terkini
            </div>
            <div className="tp-news">
              {([
                { tag: 'Prestasi', title: 'Juara 1 Olimpiade Sains Kota Probolinggo' },
                { tag: 'Kegiatan', title: 'Peringatan Hari Pendidikan Nasional 2025' },
              ] as { tag: string; title: string }[]).map((n: { tag: string; title: string }) => (
                <div
                  key={n.tag}
                  className="tp-news-card"
                  style={{ background: v['--color-bg-secondary'], borderRadius: v['--radius-card'] }}
                >
                  <div className="tp-news-img" style={{ background: v['--color-primary-light'] }} />
                  <div className="tp-news-body">
                    <div className="tp-news-tag" style={{ color: v['--color-primary'] }}>{n.tag}</div>
                    <div className="tp-news-title" style={{ color: v['--color-text'] }}>{n.title}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className="tp-footer"
            style={{ background: v['--color-footer-bg'], color: v['--color-footer-text'], fontFamily: v['--font-body'] }}
          >
            © 2025 SMP Negeri 8 Probolinggo · Jl. Raya Semampir, Probolinggo
          </div>
        </div>
      </div>
    </div>
  )
}