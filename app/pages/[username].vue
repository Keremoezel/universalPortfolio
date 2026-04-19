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

// Populate stores before ANY component rendering starts
if (site.value) {
  if (Object.keys(site.value.content).length) {
    contentStore.loadFromConfig(site.value.content)
  }
  if (Array.isArray(site.value.components) && site.value.components.length) {
    componentsStore.loadFromConfig(site.value.components as never)
  }
  if (Object.keys(site.value.theme).length) {
    themeStore.loadFromConfig(site.value.theme)
  }
}

// Handle owner-defined default language
if (import.meta.client) {
  const langCookie = useCookie(`lang-pref-${username}`)
  if (!langCookie.value) {
    const defaultLang = componentsStore.languageSettings.defaultLocale
    setLocale(defaultLang).then(() => {
      langCookie.value = defaultLang
    })
  }
}

useSeoMeta({
  title: `${username} — Portfolio`,
  ogTitle: `${username} — Portfolio`,
  description: `Portfolio of ${username}, built on Studio.`
})

</script>
