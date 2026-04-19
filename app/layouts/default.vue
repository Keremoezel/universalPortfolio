<template>
  <div class="layout-default">
    <!-- Navigation -->
    <nav class="site-nav" :class="{ 'nav-scrolled': isScrolled }">
      <div class="container-dusk nav-inner">
        <NuxtLink :to="localePath('/')" class="nav-logo">
          <span class="nav-logo-text">{{ field(content.hero.name) }}</span>
        </NuxtLink>

        <div class="nav-links">
          <a href="#work"    class="nav-link" @click.prevent="scrollTo('work')">{{ $t('nav.work') }}</a>
          <a href="#about"   class="nav-link" @click.prevent="scrollTo('about')">{{ $t('nav.about') }}</a>
          <a href="#contact" class="nav-link" @click.prevent="scrollTo('contact')">{{ $t('nav.contact') }}</a>

          <!-- Language switcher: only show enabled locales -->
          <div class="lang-switcher" role="navigation" aria-label="Language">
            <NuxtLink
              v-for="loc in visibleLocales"
              :key="loc.code"
              :to="switchLocalePath(loc.code)"
              class="lang-btn"
              :class="{ active: locale === loc.code }"
            >
              {{ loc.code.toUpperCase() }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main content -->
    <main class="site-main">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="site-footer">
      <div class="container-dusk footer-inner">
        <p class="footer-copy">
          © {{ new Date().getFullYear() }} {{ field(content.hero.name) }} — All rights reserved
        </p>
        <div class="footer-socials">
          <a
            v-for="social in content.contact.socials"
            :key="social.label"
            :href="social.url"
            target="_blank"
            rel="noopener"
            class="footer-social-link"
          >
            {{ social.label }}
          </a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const content = useContentStore()
const componentsStore = useComponentsStore()
const { field } = useLocaleContent()

// i18n routing
const { locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const localePath = useLocalePath()

// Only show locales enabled by the portfolio owner
const visibleLocales = computed(() =>
  locales.value.filter(loc =>
    componentsStore.languageSettings.enabledLocales.includes(loc.code as any)
  )
)

// Navbar glass + scroll velocity
const { isScrolled } = useScrollBehavior()

function scrollTo(id: string) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<style scoped>
.layout-default {
  min-height: 100vh;
  background-color: var(--dusk-bg);
  color: var(--dusk-text);
}

/* ── Navigation ── */
.site-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  height: var(--nav-height);
  transition:
    background-color 0.6s cubic-bezier(0.16, 1, 0.3, 1),
    border-color     0.6s cubic-bezier(0.16, 1, 0.3, 1),
    backdrop-filter  0.6s cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow       0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.nav-scrolled {
  background-color: color-mix(in srgb, var(--dusk-bg) 86%, transparent);
  backdrop-filter: blur(20px) saturate(1.4);
  -webkit-backdrop-filter: blur(20px) saturate(1.4);
  border-bottom: 1px solid color-mix(in srgb, var(--dusk-primary) 12%, transparent);
  box-shadow: 0 1px 0 color-mix(in srgb, var(--dusk-primary) 6%, transparent),
              0 8px 32px color-mix(in srgb, black 40%, transparent);
}

.nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}

.nav-logo { text-decoration: none; }

.nav-logo-text {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: 400;
  letter-spacing: var(--tracking-normal);
  color: var(--dusk-text);
  transition: color var(--duration-fast) var(--ease-smooth);
}

.nav-logo:hover .nav-logo-text { color: var(--dusk-primary); }

.nav-links {
  display: flex;
  align-items: center;
  gap: var(--space-8);
}

.nav-link {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 400;
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  color: var(--dusk-text-secondary);
  text-decoration: none;
  position: relative;
  transition: color 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 100%;
  height: 1px;
  background: var(--dusk-primary);
  transition: right 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.nav-link:hover { color: var(--dusk-primary); }
.nav-link:hover::after { right: 0; }

/* ── Language switcher ── */
.lang-switcher {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  padding-left: var(--space-6);
  border-left: 1px solid color-mix(in srgb, var(--dusk-primary) 15%, transparent);
}

.lang-btn {
  font-family: var(--font-body);
  font-size: 10px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--dusk-text-faint);
  text-decoration: none;
  padding: 3px var(--space-2);
  border-radius: var(--radius-sm);
  transition: color 0.2s ease, background 0.2s ease;
}

.lang-btn:hover { color: var(--dusk-text); }

.lang-btn.active {
  color: var(--dusk-primary);
  background: color-mix(in srgb, var(--dusk-primary) 8%, transparent);
}

/* ── Main ── */
.site-main { padding-top: var(--nav-height); }

/* ── Footer ── */
.site-footer {
  border-top: 1px solid var(--dusk-border-muted);
  padding-block: var(--space-10);
  margin-top: var(--space-24);
}

.footer-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--space-4);
}

.footer-copy {
  font-size: var(--text-sm);
  color: var(--dusk-text-muted);
  letter-spacing: var(--tracking-normal);
}

.footer-socials {
  display: flex;
  align-items: center;
  gap: var(--space-6);
}

.footer-social-link {
  font-size: var(--text-sm);
  color: var(--dusk-text-muted);
  text-decoration: none;
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  transition: color var(--duration-fast) var(--ease-smooth);
}

.footer-social-link:hover { color: var(--dusk-primary); }

@media (max-width: 640px) {
  .nav-links { gap: var(--space-4); }
  .lang-switcher { padding-left: var(--space-3); }
  .footer-inner { flex-direction: column; align-items: flex-start; }
}
</style>
