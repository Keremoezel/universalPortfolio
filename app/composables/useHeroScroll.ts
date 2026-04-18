const BLUR_MAX      = 0      // başlangıçta blur YOK — sayfa net açılır
const BLUR_PEAK     = 8      // scroll ortasında peak blur — sinematik beat
const SCALE_MIN     = 0.982
const TRIGGER_RATIO = 0.85

function easeOutQuad(t: number): number {
  return 1 - (1 - t) * (1 - t)
}

export function useHeroScroll(heroRef: Ref<HTMLElement | null>) {
  if (!import.meta.client) return

  let ticking = false

  function update() {
    const hero = heroRef.value
    if (!hero) { ticking = false; return }

    const scrollRange = hero.offsetHeight - window.innerHeight
    const rawProgress = scrollRange > 0 ? Math.min(1, window.scrollY / scrollRange) : 0
    const scaled      = Math.min(1, rawProgress / TRIGGER_RATIO)
    const progress    = easeOutQuad(scaled)

    // Blur: 0 → peak (mid-scroll) → 0 — sinüs eğrisi = belirgin beat
    const blurCurve = Math.sin(progress * Math.PI)
    const blur      = (BLUR_PEAK * blurCurve).toFixed(2)

    // Scale: rest → 1.0 — içerik öne çıkıyor
    const scale = (SCALE_MIN + (1 - SCALE_MIN) * progress).toFixed(4)

    // Overlay: 0 → 0.35 (mid) → 0 — karanlık perde gelip gidiyor
    const overlay = (0.35 * blurCurve).toFixed(4)

    // Atmosphere parallax — daha belirgin kayma
    const atmosphereY = (rawProgress * 60).toFixed(1)

    hero.style.setProperty('--focus-blur',    `${blur}px`)
    hero.style.setProperty('--focus-scale',   scale)
    hero.style.setProperty('--overlay-fade',  overlay)
    hero.style.setProperty('--atmosphere-y',  atmosphereY)

    ticking = false
  }

  function onScroll() {
    if (!ticking) {
      ticking = true
      requestAnimationFrame(update)
    }
  }

  onMounted(async () => {
    await nextTick()
    const hero = heroRef.value
    if (hero) {
      // Başlangıç: net, blur yok, overlay yok
      hero.style.setProperty('--focus-blur',   '0px')
      hero.style.setProperty('--focus-scale',  String(SCALE_MIN))
      hero.style.setProperty('--overlay-fade', '0')
      hero.style.setProperty('--atmosphere-y', '0')
    }
    window.addEventListener('scroll', onScroll, { passive: true })
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', onScroll)
  })
}