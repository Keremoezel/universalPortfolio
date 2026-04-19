<template>
  <PortfolioView />
</template>

<script setup lang="ts">
const route           = useRoute()
const contentStore    = useContentStore()
const componentsStore = useComponentsStore()
const themeStore      = useThemeStore()
const { setLocale }   = useI18n()

const username = route.params.username as string

// Fetch site config server-side (SSR) for SEO and performance
const { data: site, error } = await useAsyncData(
  `site-${username}`,
  () => $fetch<{
    username: string
    theme: Record<string, unknown>
    content: Record<string, unknown>
    components: unknown[]
  }>(`/api/site/${username}`)
)

if (error.value || !site.value) {
  throw createError({ statusCode: 404, message: 'Portfolio not found.' })
}

// Populate stores before rendering so PortfolioView sees the correct data
if (Object.keys(site.value.content).length) {
  contentStore.loadFromConfig(site.value.content)
}
if (Array.isArray(site.value.components) && site.value.components.length) {
  componentsStore.loadFromConfig(site.value.components as never)
}
if (Object.keys(site.value.theme).length) {
  themeStore.loadFromConfig(site.value.theme)
}

// Apply the portfolio owner's default language for first-time visitors
// (only if the visitor hasn't already set their own preference via the switcher)
if (import.meta.client) {
  const storedLang = sessionStorage.getItem(`lang-pref-${username}`)
  if (!storedLang) {
    const defaultLang = componentsStore.languageSettings.defaultLocale
    await setLocale(defaultLang)
  }
}

useSeoMeta({
  title: `${username} — Portfolio`,
  ogTitle: `${username} — Portfolio`,
  description: `Portfolio of ${username}, built on Studio.`
})
</script>
