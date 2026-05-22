export type ThemeId =
  | 'klasik-formal'
  | 'modern-minimalis'
  | 'dinamis-bold'
  | 'elegan-mewah'
  | 'akademik-pro'

export interface Theme {
  id: ThemeId
  name: string
  description: string
  preview: {
    primary: string
    accent: string
    background: string
  }
  variables: Record<string, string>
}

export const themes: Theme[] = [
  {
    id: 'klasik-formal',
    name: 'Klasik Formal',
    description: 'Elegan, rapi, dan berwibawa. Cocok untuk kesan sekolah formal.',
    preview: {
      primary: '#1e3a8a',
      accent: '#b8860b',
      background: '#f8fafc',
    },
    variables: {
      '--font-heading': '"Georgia", "Times New Roman", serif',
      '--font-body': '"Georgia", serif',
      '--color-primary': '#1e3a8a',
      '--color-primary-dark': '#172554',
      '--color-primary-light': '#dbeafe',
      '--color-accent': '#b8860b',
      '--color-accent-light': '#fef9c3',
      '--color-bg': '#ffffff',
      '--color-bg-secondary': '#f8fafc',
      '--color-text': '#0f172a',
      '--color-text-muted': '#475569',
      '--color-nav-bg': '#1e3a8a',
      '--color-nav-text': '#ffffff',
      '--color-ticker-bg': '#f1f5f9',
      '--color-ticker-text': '#1e3a8a',
      '--color-footer-bg': '#1e3a8a',
      '--color-footer-text': '#ffffff',
      '--color-hero-bg': '#1e3a8a',
      '--color-hero-text': '#ffffff',
      '--color-btn-bg': '#b8860b',
      '--color-btn-text': '#ffffff',
      '--radius-card': '4px',
      '--radius-btn': '4px',
      '--shadow-card': '0 1px 4px rgba(0,0,0,0.08)',
      '--animation-enter': 'fadeIn',
      '--animation-duration': '0.5s',
      '--hero-decor': 'border-left: 4px solid #b8860b',
      '--nav-border': 'none',
    },
  },
  {
    id: 'modern-minimalis',
    name: 'Modern Minimalis',
    description: 'Bersih, lega, dan modern. Whitespace besar, kesan profesional muda.',
    preview: {
      primary: '#1d4ed8',
      accent: '#f59e0b',
      background: '#f0f9ff',
    },
    variables: {
      '--font-heading': '"Inter", "Segoe UI", sans-serif',
      '--font-body': '"Inter", "Segoe UI", sans-serif',
      '--color-primary': '#1d4ed8',
      '--color-primary-dark': '#1e3a8a',
      '--color-primary-light': '#eff6ff',
      '--color-accent': '#f59e0b',
      '--color-accent-light': '#fef3c7',
      '--color-bg': '#ffffff',
      '--color-bg-secondary': '#f0f9ff',
      '--color-text': '#1e3a8a',
      '--color-text-muted': '#64748b',
      '--color-nav-bg': '#ffffff',
      '--color-nav-text': '#1d4ed8',
      '--color-ticker-bg': '#1d4ed8',
      '--color-ticker-text': '#ffffff',
      '--color-footer-bg': '#f1f5f9',
      '--color-footer-text': '#64748b',
      '--color-hero-bg': '#f0f9ff',
      '--color-hero-text': '#1e3a8a',
      '--color-btn-bg': '#1d4ed8',
      '--color-btn-text': '#ffffff',
      '--radius-card': '12px',
      '--radius-btn': '8px',
      '--shadow-card': '0 4px 16px rgba(29,78,216,0.08)',
      '--animation-enter': 'slideUp',
      '--animation-duration': '0.4s',
      '--hero-decor': 'none',
      '--nav-border': '0.5px solid #e2e8f0',
    },
  },
  {
    id: 'dinamis-bold',
    name: 'Dinamis Bold',
    description: 'Energik, kuat, dan kontras tinggi. Menonjolkan prestasi dan semangat.',
    preview: {
      primary: '#1e40af',
      accent: '#eab308',
      background: '#eff6ff',
    },
    variables: {
      '--font-heading': '"Trebuchet MS", "Arial Black", sans-serif',
      '--font-body': '"Segoe UI", "Arial", sans-serif',
      '--color-primary': '#1e40af',
      '--color-primary-dark': '#1e3a8a',
      '--color-primary-light': '#dbeafe',
      '--color-accent': '#eab308',
      '--color-accent-light': '#fef9c3',
      '--color-bg': '#ffffff',
      '--color-bg-secondary': '#eff6ff',
      '--color-text': '#1e3a8a',
      '--color-text-muted': '#1e40af',
      '--color-nav-bg': '#1e40af',
      '--color-nav-text': '#ffffff',
      '--color-ticker-bg': '#eab308',
      '--color-ticker-text': '#1e3a8a',
      '--color-footer-bg': '#1e40af',
      '--color-footer-text': '#ffffff',
      '--color-hero-bg': '#1e40af',
      '--color-hero-text': '#ffffff',
      '--color-btn-bg': '#eab308',
      '--color-btn-text': '#1e3a8a',
      '--radius-card': '0px',
      '--radius-btn': '0px',
      '--shadow-card': '4px 4px 0px #1e40af',
      '--animation-enter': 'zoomIn',
      '--animation-duration': '0.3s',
      '--hero-decor': 'border-bottom: 4px solid #eab308',
      '--nav-border': 'none',
    },
  },
  {
    id: 'elegan-mewah',
    name: 'Elegan Mewah',
    description: 'Dark mode premium dengan aksen gold. Kesan sekolah bergengsi dan modern.',
    preview: {
      primary: '#0f172a',
      accent: '#d4af37',
      background: '#1e293b',
    },
    variables: {
      '--font-heading': '"Georgia", "Palatino", serif',
      '--font-body': '"Georgia", serif',
      '--color-primary': '#d4af37',
      '--color-primary-dark': '#b8960c',
      '--color-primary-light': '#1e293b',
      '--color-accent': '#d4af37',
      '--color-accent-light': '#2d2a1a',
      '--color-bg': '#0f172a',
      '--color-bg-secondary': '#1e293b',
      '--color-text': '#d4af37',
      '--color-text-muted': '#94a3b8',
      '--color-nav-bg': '#0f172a',
      '--color-nav-text': '#d4af37',
      '--color-ticker-bg': '#0f172a',
      '--color-ticker-text': '#d4af37',
      '--color-footer-bg': '#020617',
      '--color-footer-text': '#d4af37',
      '--color-hero-bg': '#0f172a',
      '--color-hero-text': '#d4af37',
      '--color-btn-bg': '#d4af37',
      '--color-btn-text': '#0f172a',
      '--radius-card': '2px',
      '--radius-btn': '2px',
      '--shadow-card': '0 0 0 1px rgba(212,175,55,0.2)',
      '--animation-enter': 'shimmerIn',
      '--animation-duration': '0.6s',
      '--hero-decor': 'letter-spacing: 0.03em',
      '--nav-border': '0.5px solid rgba(212,175,55,0.3)',
    },
  },
  {
    id: 'akademik-pro',
    name: 'Akademik Pro',
    description: 'Gaya universitas. Dense, informatif, dan sangat terpercaya.',
    preview: {
      primary: '#1e3a8a',
      accent: '#93c5fd',
      background: '#f8fafc',
    },
    variables: {
      '--font-heading': '"Georgia", serif',
      '--font-body': '"Segoe UI", "Arial", sans-serif',
      '--color-primary': '#1e3a8a',
      '--color-primary-dark': '#172554',
      '--color-primary-light': '#dbeafe',
      '--color-accent': '#93c5fd',
      '--color-accent-light': '#eff6ff',
      '--color-bg': '#ffffff',
      '--color-bg-secondary': '#f8fafc',
      '--color-text': '#0f172a',
      '--color-text-muted': '#475569',
      '--color-nav-bg': '#1e3a8a',
      '--color-nav-text': '#ffffff',
      '--color-ticker-bg': '#e2e8f0',
      '--color-ticker-text': '#1e3a8a',
      '--color-footer-bg': '#0f172a',
      '--color-footer-text': '#94a3b8',
      '--color-hero-bg': '#f8fafc',
      '--color-hero-text': '#0f172a',
      '--color-btn-bg': '#1e3a8a',
      '--color-btn-text': '#ffffff',
      '--radius-card': '2px',
      '--radius-btn': '4px',
      '--shadow-card': '0 1px 3px rgba(0,0,0,0.1)',
      '--animation-enter': 'revealUp',
      '--animation-duration': '0.5s',
      '--hero-decor': 'border-top: 3px solid #1e3a8a',
      '--nav-border': 'none',
    },
  },
]

export const defaultTheme = themes[0]

export function getThemeById(id: string): Theme {
  return themes.find((t) => t.id === id) ?? defaultTheme
}

export function themeToCSS(theme: Theme): string {
  const vars = Object.entries(theme.variables)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join('\n')
  return `:root {\n${vars}\n}`
}