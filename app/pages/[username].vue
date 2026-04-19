<template>
  <PortfolioView />
</template>

<script setup lang="ts">
const route           = useRoute()
const contentStore    = useContentStore()
const componentsStore = useComponentsStore()
const themeStore      = useThemeStore()


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
  if (site.value.components) {
    componentsStore.loadFromConfig(site.value.components as any)
  }
  if (Object.keys(site.value.theme).length) {
    themeStore.loadFromConfig(site.value.theme)
  }
}

// Handle owner-defined default language
const { locale, setLocale } = useI18n()
const langCookie = useCookie('i18n_redirected') // Nuxt i18n's default cookie

if (site.value) {
  const ownerDefault = componentsStore.languageSettings.defaultLocale
  
  // If no user preference cookie exists, use the owner's default
  if (!langCookie.value && locale.value !== ownerDefault) {
    if (import.meta.server) {
      // On server, we can just set the locale value for this request
      locale.value = ownerDefault
    } else {
      // On client, use the official switcher
      setLocale(ownerDefault)
    }
  }
}


useSeoMeta({
  title: `${username} — Portfolio`,
  ogTitle: `${username} — Portfolio`,
  description: `Portfolio of ${username}, built on Studio.`
})

</script>
