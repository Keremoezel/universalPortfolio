// stores/components.ts
// Controls section visibility and ordering in the portfolio

export type SectionKey = 'hero' | 'work' | 'about' | 'contact'

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
  }

  // ── DB integration ──

  function loadFromConfig(config: SectionConfig[]) {
    if (!Array.isArray(config) || config.length === 0) return
    sections.value = config
  }

  function getConfig(): SectionConfig[] {
    return sections.value
  }

  return {
    sections,
    sortedSections,
    visibleSections,
    toggleSection,
    setSectionVisible,
    reorderSections,
    resetToDefaults,
    loadFromConfig,
    getConfig
  }
})
