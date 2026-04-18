/**
 * useScrollBehavior
 *
 * Tracks scroll velocity and stamps `is-fast-scrolling` on <body>
 * so CSS transitions modulate their duration automatically.
 * Also exports `isScrolled` for the navbar glass effect.
 *
 * Velocity logic:
 *   - Compares scrollY delta between rAF ticks
 *   - If delta > FAST_THRESHOLD px/frame → add class, remove after 300ms
 */
export function useScrollBehavior() {
  const isScrolled = ref(false)

  const FAST_THRESHOLD = 12   // px/frame considered "fast"
  const FAST_LINGER    = 300  // ms to keep the class after slowing

  let lastScrollY  = 0
  let fastTimer    = 0

  function onScroll() {
    const y     = window.scrollY
    const delta = Math.abs(y - lastScrollY)
    lastScrollY = y

    // Navbar glass
    isScrolled.value = y > 60

    // Velocity stamping
    if (delta > FAST_THRESHOLD) {
      document.body.classList.add('is-fast-scrolling')
      clearTimeout(fastTimer)
      fastTimer = window.setTimeout(() => {
        document.body.classList.remove('is-fast-scrolling')
      }, FAST_LINGER)
    }
  }

  onMounted(() => {
    window.addEventListener('scroll', onScroll, { passive: true })
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', onScroll)
    clearTimeout(fastTimer)
  })

  return { isScrolled }
}
