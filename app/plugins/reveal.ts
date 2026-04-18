// Universal plugin (runs on both server + client).
// getSSRProps = no-op for SSR.
// mounted/unmounted = IntersectionObserver, client only (Vue lifecycle).

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('reveal', {
    // SSR: return empty props — nothing to render server-side
    getSSRProps() {
      return {}
    },

    mounted(el, binding) {
      el.classList.add('reveal')

      const modifiers = binding.modifiers
      if (modifiers.delay1) el.classList.add('reveal-delay-1')
      else if (modifiers.delay2) el.classList.add('reveal-delay-2')
      else if (modifiers.delay3) el.classList.add('reveal-delay-3')
      else if (modifiers.delay4) el.classList.add('reveal-delay-4')

      const observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0]
          if (entry?.isIntersecting) {
            el.classList.add('is-visible')
            observer.unobserve(el)
          }
        },
        { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
      )

      observer.observe(el)
      el._revealObserver = observer
    },

    unmounted(el) {
      el._revealObserver?.disconnect()
      delete el._revealObserver
    }
  })
})
