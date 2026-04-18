export function useHeroMotion(heroRef: Ref<HTMLElement | null>) {
  if (!import.meta.client) return

  let targetX = 0
  let targetY = 0
  let currentX = 0
  let currentY = 0
  let rafId = 0

  const LERP_FACTOR = 0.038

  function lerp(a: number, b: number, t: number) {
    return a + (b - a) * t
  }

  function onMouseMove(e: MouseEvent) {
    targetX = (e.clientX / window.innerWidth - 0.5) * 2
    targetY = (e.clientY / window.innerHeight - 0.5) * 2
  }

  function onScroll() {
    heroRef.value?.style.setProperty('--scroll-y', String(window.scrollY))
  }

  function tick() {
    currentX = lerp(currentX, targetX, LERP_FACTOR)
    currentY = lerp(currentY, targetY, LERP_FACTOR)

    const el = heroRef.value
    if (el) {
      el.style.setProperty('--mouse-x', currentX.toFixed(4))
      el.style.setProperty('--mouse-y', currentY.toFixed(4))
    }

    rafId = requestAnimationFrame(tick)
  }

  onMounted(() => {
    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    // Set initial values so CSS vars are never undefined
    heroRef.value?.style.setProperty('--mouse-x', '0')
    heroRef.value?.style.setProperty('--mouse-y', '0')
    heroRef.value?.style.setProperty('--scroll-y', '0')
    tick()
  })

  onUnmounted(() => {
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('scroll', onScroll)
    cancelAnimationFrame(rafId)
  })
}