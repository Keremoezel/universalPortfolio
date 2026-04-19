// stores/theme.ts
// Controls the active design theme — Dusk defaults + live overrides from admin

export interface ThemeColors {
  bg: string
  surface: string
  border: string
  primary: string
  accent: string
  text: string
}

export interface ThemeTypography {
  fontDisplay: string
  fontBody: string
  baseFontSize: string
  headingWeight: string
}

export interface ThemeConfig {
  colors: ThemeColors
  typography: ThemeTypography
  radius: string
  spacing: string
}

export const DUSK_DEFAULTS: ThemeConfig = {
  colors: {
    bg:      '#120e08',
    surface: '#1e1610',
    border:  '#3a2d1c',
    primary: '#d4944a',
    accent:  '#c4613a',
    text:    '#f2ede3'
  },
  typography: {
    fontDisplay: "'Cormorant Garamond', Georgia, serif",
    fontBody:    "'DM Sans', 'Helvetica Neue', sans-serif",
    baseFontSize: '16px',
    headingWeight: '400'
  },
  radius: '4px',
  spacing: '1rem'
}

export const useThemeStore = defineStore('theme', () => {
  const activeTheme = ref<ThemeConfig>(JSON.parse(JSON.stringify(DUSK_DEFAULTS)))
  const themeHistory = ref<ThemeConfig[]>([])

  function applyTheme(config: Partial<ThemeConfig>) {
    // Deep merge
    if (config.colors) {
      Object.assign(activeTheme.value.colors, config.colors)
    }
    if (config.typography) {
      Object.assign(activeTheme.value.typography, config.typography)
    }
    if (config.radius !== undefined) activeTheme.value.radius = config.radius
    if (config.spacing !== undefined) activeTheme.value.spacing = config.spacing

    // Apply to CSS variables
    syncToDom()

    // Record in history (last 10)
    themeHistory.value.unshift(JSON.parse(JSON.stringify(activeTheme.value)))
    if (themeHistory.value.length > 10) themeHistory.value.pop()
  }

  function syncToDom() {
    if (import.meta.client) {
      const root = document.documentElement
      const c = activeTheme.value.colors
      const t = activeTheme.value.typography

      root.style.setProperty('--dusk-bg', c.bg)
      root.style.setProperty('--dusk-surface', c.surface)
      root.style.setProperty('--dusk-border', c.border)
      root.style.setProperty('--dusk-primary', c.primary)
      root.style.setProperty('--dusk-accent', c.accent)
      root.style.setProperty('--dusk-text', c.text)
      
      root.style.setProperty('--font-display', t.fontDisplay)
      root.style.setProperty('--font-body', t.fontBody)
      root.style.setProperty('--heading-weight', t.headingWeight)
      root.style.setProperty('--radius-md', activeTheme.value.radius)
    }
  }

  function resetToDefaults() {
    activeTheme.value = JSON.parse(JSON.stringify(DUSK_DEFAULTS))
    syncToDom()
  }

  function exportTheme(): string {
    return JSON.stringify({
      theme: {
        colors: activeTheme.value.colors,
        radius: activeTheme.value.radius,
        spacing: activeTheme.value.spacing,
        typography: activeTheme.value.typography
      },
      components: {
        button: { variant: 'solid' },
        card: { variant: 'elevated' }
      }
    }, null, 2)
  }

  // ── DB integration ──
  // loadFromConfig is an alias for applyTheme — both accept Partial<ThemeConfig>
  const loadFromConfig = applyTheme

  function getConfig(): ThemeConfig {
    return JSON.parse(JSON.stringify(activeTheme.value))
  }

  return {
    activeTheme,
    themeHistory,
    applyTheme,
    loadFromConfig,
    syncToDom,
    resetToDefaults,
    exportTheme,
    getConfig
  }
})
