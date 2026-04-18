/**
 * useLocaleContent
 *
 * Provides `field()` — reads a multi-language content string
 * for the currently active @nuxtjs/i18n locale.
 *
 * Usage:
 *   const { field } = useLocaleContent()
 *   {{ field(contentStore.hero.name) }}   // → correct lang string
 *
 * Falls back to `en` if the current locale has no value.
 * Accepts plain `string` safely (returns as-is) for non-translated fields.
 */

import type { MLString } from '~/stores/content'

export function useLocaleContent() {
  const { locale } = useI18n()

  function field(value: MLString | string | undefined | null): string {
    if (!value) return ''
    if (typeof value === 'string') return value
    const key = locale.value as keyof MLString
    return value[key] || value.en || ''
  }

  return { field }
}
