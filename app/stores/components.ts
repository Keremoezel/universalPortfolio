// stores/components.ts
// Controls section visibility and ordering in the portfolio

export type SectionKey = 'hero' | 'work' | 'about' | 'contact'
export type LangCode = 'en' | 'tr' | 'de'

export interface LanguageSettings {
  defaultLocale: LangCode
  enabledLocales: LangCode[]
}

export interface SectionConfig {
  key: SectionKey
  label: string
  visible: boolean
  order: number
}

export const useComponentsStore = defineStore('components', () => {
  const sections = ref<SectionConfig[]>([
    { key: 'hero',    label: 'Hero',    visible: true, order: 0 },
    { key: 'work',    label: 'Work',    visible: true, order: 1 },
    { key: 'about',   label: 'About',   visible: true, order: 2 },
    { key: 'contact', label: 'Contact', visible: true, order: 3 }
  ])

  const languageSettings = ref<LanguageSettings>({
    defaultLocale: 'en',
    enabledLocales: ['en', 'tr', 'de']
  })

  const sortedSections = computed(() =>
    [...sections.value].sort((a, b) => a.order - b.order)
  )

  const visibleSections = computed(() =>
    sortedSections.value.filter(s => s.visible)
  )

  function toggleSection(key: SectionKey) {
    const section = sections.value.find(s => s.key === key)
    if (section) section.visible = !section.visible
  }

  function setSectionVisible(key: SectionKey, visible: boolean) {
    const section = sections.value.find(s => s.key === key)
    if (section) section.visible = visible
  }

  function reorderSections(from: number, to: number) {
    const sorted = [...sortedSections.value]
    const [item] = sorted.splice(from, 1)
    if (!item) return
    sorted.splice(to, 0, item)
    sorted.forEach((section, idx) => {
      const original = sections.value.find(s => s.key === section.key)
      if (original) original.order = idx
    })
  }

  function resetToDefaults() {
    sections.value.forEach((section, idx) => {
      section.visible = true
      section.order = idx
    })
    languageSettings.value = { defaultLocale: 'en', enabledLocales: ['en', 'tr', 'de'] }
  }

  function setDefaultLocale(code: LangCode) {
    languageSettings.value.defaultLocale = code
    // always ensure default locale is enabled
    if (!languageSettings.value.enabledLocales.includes(code)) {
      languageSettings.value.enabledLocales.push(code)
    }
  }

  function toggleLocale(code: LangCode) {
    // Cannot disable the default locale
    if (code === languageSettings.value.defaultLocale) return
    const idx = languageSettings.value.enabledLocales.indexOf(code)
    if (idx === -1) {
      languageSettings.value.enabledLocales.push(code)
    } else {
      languageSettings.value.enabledLocales.splice(idx, 1)
    }
  }

  // ── DB integration ──

  function loadFromConfig(config: any) {
    if (Array.isArray(config)) {
      // legacy: just an array of sections
      if (config.length) sections.value = config
    } else if (config && typeof config === 'object') {
      if (Array.isArray(config.sections) && config.sections.length) {
        sections.value = config.sections
      }
      if (config.languageSettings) {
        languageSettings.value = config.languageSettings
      }
    }
  }

  function getConfig() {
    return {
      sections: sections.value,
      languageSettings: languageSettings.value
    }
  }

  return {
    sections,
    languageSettings,
    sortedSections,
    visibleSections,
    toggleSection,
    setSectionVisible,
    reorderSections,
    resetToDefaults,
    setDefaultLocale,
    toggleLocale,
    loadFromConfig,
    getConfig
  }
})
