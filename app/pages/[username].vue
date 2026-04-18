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

useSeoMeta({
  title: `${username} — Portfolio`,
  ogTitle: `${username} — Portfolio`,
  description: `Portfolio of ${username}, built on Studio.`
})
</script>
