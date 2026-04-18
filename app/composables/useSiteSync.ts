// Admin-side site sync — queries Supabase directly from the authenticated client.
// Avoids server-route cookie timing issues in the CSR admin panel.
const isSaving     = ref(false)
const isLoading    = ref(false)
const saveError    = ref<string | null>(null)
const siteUsername = ref<string | null>(null)

export function useSiteSync() {
  const supabase        = useSupabaseClient()
  const user            = useSupabaseUser()
  const contentStore    = useContentStore()
  const componentsStore = useComponentsStore()
  const themeStore      = useThemeStore()

  async function loadSite() {
    const userId = user.value?.id || (user.value as any)?.user_metadata?.sub
    if (!userId) return null


    isLoading.value = true
    try {
      const { data, error } = await supabase
        .from('sites')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle()

      if (error) throw error

      if (data) {
        siteUsername.value = data.username as string
        const content    = data.content    as Record<string, unknown>
        const components = data.components as unknown[]
        const theme      = data.theme      as Record<string, unknown>

        if (content    && Object.keys(content).length)                    contentStore.loadFromConfig(content)
        if (components && Array.isArray(components) && components.length) componentsStore.loadFromConfig(components as never)
        if (theme      && Object.keys(theme).length)                      themeStore.loadFromConfig(theme)
      }

      return data
    } catch (err) {
      console.error('[useSiteSync] loadSite failed:', err)
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function saveSite() {
    isSaving.value  = true
    saveError.value = null
    try {

      await $fetch('/api/site/update', {
        method: 'POST',
        body: {
          content:    JSON.parse(JSON.stringify(contentStore.getConfig())),
          components: JSON.parse(JSON.stringify(componentsStore.getConfig())),
          theme:      JSON.parse(JSON.stringify(themeStore.getConfig()))
        }
      })
    } catch (err: any) {
      saveError.value = err.data?.message || err.message || 'Failed to save site.'
      throw err
    } finally {
      isSaving.value = false
    }
  }

  return { loadSite, saveSite, isSaving, isLoading, saveError, siteUsername }
}
