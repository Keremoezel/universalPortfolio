<template>
  <div class="portfolio-page">

    <!-- ============ HERO ============ -->
    <section
      v-if="componentsStore.visibleSections.some(s => s.key === 'hero')"
      id="hero"
      ref="heroEl"
      class="hero-section"
    >
      <div class="hero-sticky">

        <div class="hero-bg-layer" aria-hidden="true">
          <div class="hero-atmosphere" />
          <div class="hero-mouse-glow" />
          <div class="hero-light-leak" />
          <div class="hero-vignette" />
          <div class="hero-focus-overlay" />
        </div>

        <div class="hero-grain" aria-hidden="true" />

        <div class="hero-film-number" aria-hidden="true">01 / 04</div>
        <div class="hero-top-rule" aria-hidden="true" />

        <div class="container-dusk hero-content">
          <div class="hero-content-inner">
            <div class="hero-eyebrow animate-fade-up" style="animation-delay: 0.5s">
              <span class="hero-eyebrow-line" />
              <span class="hero-eyebrow-dot" />
              <span>{{ $t('hero.available') }}</span>
            </div>

            <h1 class="hero-name animate-fade-up" style="animation-delay: 0.85s">
              {{ field(contentStore.hero.name) }}
            </h1>

            <div class="hero-tagline-wrap animate-fade-up" style="animation-delay: 1.2s">
              <p class="hero-tagline">
                <span
                  v-for="(line, i) in field(contentStore.hero.tagline).split('\n')"
                  :key="i"
                  class="hero-tagline-line"
                >{{ line }}<br v-if="i < field(contentStore.hero.tagline).split('\n').length - 1" /></span>
              </p>
            </div>

            <p class="hero-subline animate-fade-up" style="animation-delay: 1.55s">
              {{ field(contentStore.hero.subline) }}
            </p>

            <div class="hero-cta animate-fade-up" style="animation-delay: 1.9s">
              <a :href="contentStore.hero.ctaLink" class="btn-primary" @click.prevent="scrollTo('work')">
                {{ field(contentStore.hero.ctaLabel) }}
              </a>
              <a :href="'mailto:' + contentStore.contact.email" class="btn-ghost">
                Get in touch <span class="btn-ghost-arrow">→</span>
              </a>
            </div>
          </div>
        </div>

        <div class="hero-scroll-indicator animate-fade-in" style="animation-delay: 2.6s">
          <span class="scroll-line" />
          <span class="scroll-label">{{ $t('hero.scroll') }}</span>
        </div>

      </div><!-- /hero-sticky -->
    </section>

    <!-- ============ WORK ============ -->
    <section
      v-if="componentsStore.visibleSections.some(s => s.key === 'work')"
      id="work"
      class="work-section"
    >
      <div class="section-atmosphere" aria-hidden="true" />

      <div class="container-dusk">
        <div class="section-header" v-reveal>
          <div class="section-header-left">
            <span class="section-index">02</span>
            <div>
              <span class="section-tag">{{ $t('work.tag') }}</span>
              <h2 class="section-title">{{ $t('work.title') }}</h2>
            </div>
          </div>
          <div class="section-header-rule" />
        </div>

        <div v-if="featuredProjects.length" class="projects-featured">
          <NuxtLink
            v-for="(project, index) in featuredProjects"
            :key="project.id"
            :to="`/project/${project.slug}`"
            v-reveal
            class="project-card project-card-wide"
            :style="{ transitionDelay: `${index * 0.12}s` }"
            @mousemove="onCardTilt($event)"
            @mouseleave="onCardReset($event)"
          >
            <div class="project-image">
              <div class="project-image-frame">
                <div class="project-image-grain" />
                <img
                  v-if="project.imageUrl"
                  :src="project.imageUrl"
                  :alt="field(project.title)"
                  class="project-image-photo"
                />
                <div
                  v-else
                  class="project-image-bg"
                  :style="{ backgroundImage: projectGradient(index) }"
                />
                <div class="project-image-vignette" />
                <div class="project-image-watermark">
                  <span class="watermark-index">0{{ index + 1 }}</span>
                  <span class="watermark-category">{{ field(project.category) }}</span>
                </div>
              </div>
            </div>
            <div class="project-meta">
              <div class="project-header">
                <div>
                  <span class="project-category">{{ field(project.category) }}</span>
                  <h3 class="project-title">{{ field(project.title) }}</h3>
                </div>
                <span class="project-year">{{ project.year }}</span>
              </div>
              <p class="project-desc">{{ field(project.description) }}</p>
              <div class="project-tags">
                <span v-for="tag in project.tags" :key="tag" class="project-tag">{{ tag }}</span>
              </div>
            </div>
            <div class="project-cta" aria-hidden="true">
              <span class="project-cta-line" />
              <span class="project-cta-arrow">→</span>
            </div>
          </NuxtLink>
        </div>

        <template v-if="otherProjects.length">
          <div class="projects-more-label" v-reveal>
            <span class="projects-more-rule" />
            <span class="projects-more-text">{{ $t('work.more') }}</span>
            <span class="projects-more-rule" />
          </div>
          <div class="projects-grid">
            <NuxtLink
              v-for="(project, index) in otherProjects"
              :key="project.id"
              :to="`/project/${project.slug}`"
              v-reveal
              class="project-card"
              :style="{ transitionDelay: `${index * 0.12}s` }"
              @mousemove="onCardTilt($event)"
              @mouseleave="onCardReset($event)"
            >
              <div class="project-image">
                <div class="project-image-frame">
                  <div class="project-image-grain" />
                  <img
                    v-if="project.imageUrl"
                    :src="project.imageUrl"
                    :alt="field(project.title)"
                    class="project-image-photo"
                  />
                  <div
                    v-else
                    class="project-image-bg"
                    :style="{ backgroundImage: projectGradient(featuredProjects.length + index) }"
                  />
                  <div class="project-image-vignette" />
                  <div class="project-image-watermark">
                    <span class="watermark-index">0{{ featuredProjects.length + index + 1 }}</span>
                    <span class="watermark-category">{{ field(project.category) }}</span>
                  </div>
                </div>
              </div>
              <div class="project-meta">
                <div class="project-header">
                  <div>
                    <span class="project-category">{{ field(project.category) }}</span>
                    <h3 class="project-title">{{ field(project.title) }}</h3>
                  </div>
                  <span class="project-year">{{ project.year }}</span>
                </div>
                <p class="project-desc">{{ field(project.description) }}</p>
                <div class="project-tags">
                  <span v-for="tag in project.tags" :key="tag" class="project-tag">{{ tag }}</span>
                </div>
              </div>
              <div class="project-cta" aria-hidden="true">
                <span class="project-cta-line" />
                <span class="project-cta-arrow">→</span>
              </div>
            </NuxtLink>
          </div>
        </template>
      </div>
    </section>

    <!-- ============ ABOUT ============ -->
    <section
      v-if="componentsStore.visibleSections.some(s => s.key === 'about')"
      id="about"
      class="about-section"
    >
      <div class="container-dusk">
        <div class="about-grid">
          <div class="about-left" v-reveal>
            <div class="section-index-col">
              <span class="section-index">03</span>
              <span class="section-tag">{{ $t('about.tag') }}</span>
            </div>

            <h2 class="about-headline">
              <span
                v-for="(line, i) in field(contentStore.about.headline).split('\n')"
                :key="i"
                class="about-headline-line"
              >{{ line }}<br /></span>
            </h2>

            <div class="about-rule" />

            <div class="about-meta">
              <div class="about-meta-item">
                <span class="about-meta-label">{{ $t('about.location') }}</span>
                <span class="about-meta-value">{{ contentStore.about.location }}</span>
              </div>
              <div class="about-meta-item">
                <span class="about-meta-label">{{ $t('about.status') }}</span>
                <span class="about-meta-value about-status">
                  <span class="status-dot" />{{ field(contentStore.about.availability) }}
                </span>
              </div>
            </div>
          </div>

          <div class="about-right" v-reveal.delay2>
            <div class="about-paragraphs">
              <p
                v-for="(para, i) in contentStore.about.paragraphs"
                :key="i"
                class="about-para"
              >{{ field(para) }}</p>
            </div>

            <div class="about-skills">
              <span class="skills-label">{{ $t('about.disciplines') }}</span>
              <div class="skills-list">
                <span
                  v-for="skill in contentStore.about.skills"
                  :key="skill"
                  class="skill-item"
                >{{ skill }}</span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="contentStore.process.steps.length" class="process-section" v-reveal>
          <p class="process-intro">{{ field(contentStore.process.intro) }}</p>
          <div class="process-steps">
            <div
              v-for="step in contentStore.process.steps"
              :key="step.number"
              class="process-step"
            >
              <span class="process-step-number">{{ step.number }}</span>
              <h4 class="process-step-title">{{ field(step.title) }}</h4>
              <p class="process-step-body">{{ field(step.body) }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ============ CONTACT ============ -->
    <section
      v-if="componentsStore.visibleSections.some(s => s.key === 'contact')"
      id="contact"
      class="contact-section"
    >
      <div class="contact-atmosphere" aria-hidden="true" />

      <div class="container-dusk">
        <div class="contact-section-index" v-reveal>
          <span class="section-index">04</span>
          <span class="section-tag">{{ $t('contact.tag') }}</span>
        </div>

        <div class="contact-grid">
          <div class="contact-left" v-reveal.delay1>
            <h2 class="contact-headline">
              <span
                v-for="(line, i) in field(contentStore.contact.headline).split('\n')"
                :key="i"
                class="contact-headline-line"
              >{{ line }}<br /></span>
            </h2>
            <p class="contact-subline">{{ field(contentStore.contact.subline) }}</p>
          </div>

          <div class="contact-right" v-reveal.delay2>
            <a :href="'mailto:' + contentStore.contact.email" class="contact-email">
              <span class="contact-email-text">{{ contentStore.contact.email }}</span>
              <span class="contact-email-arrow">↗</span>
            </a>

            <div class="contact-socials">
              <a
                v-for="social in contentStore.contact.socials"
                :key="social.label"
                :href="social.url"
                target="_blank"
                rel="noopener"
                class="contact-social"
              >
                <span>{{ social.label }}</span>
                <span class="contact-social-arrow">↗</span>
              </a>
            </div>

            <div class="contact-trust" v-reveal.delay3>
              <div v-if="contentStore.contact.responseTime" class="trust-item">
                <span class="trust-label">{{ $t('contact.responseTime') }}</span>
                <span class="trust-value">{{ field(contentStore.contact.responseTime) }}</span>
              </div>
              <div v-if="contentStore.contact.availabilityNote" class="trust-item">
                <span class="trust-label">{{ $t('contact.availability') }}</span>
                <span class="trust-value">{{ field(contentStore.contact.availabilityNote) }}</span>
              </div>
              <div v-if="contentStore.contact.stack" class="trust-item trust-stack">
                <span class="trust-label">{{ $t('contact.stack') }}</span>
                <span class="trust-value">{{ contentStore.contact.stack }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
const contentStore    = useContentStore()
const componentsStore = useComponentsStore()
const { field }       = useLocaleContent()

const featuredProjects = computed(() => contentStore.projects.filter(p => p.featured))
const otherProjects    = computed(() => contentStore.projects.filter(p => !p.featured))

const heroEl = ref<HTMLElement | null>(null)
useHeroMotion(heroEl)
useHeroScroll(heroEl)

function scrollTo(id: string) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const projectGradients = [
  'linear-gradient(135deg, var(--dusk-surface-alt) 0%, var(--dusk-border) 40%, var(--dusk-bg-deep) 100%)',
  'linear-gradient(145deg, var(--dusk-bg-deep) 0%, var(--dusk-surface) 50%, var(--dusk-bg-deep) 100%)',
  'linear-gradient(125deg, var(--dusk-surface) 0%, var(--dusk-surface-alt) 50%, var(--dusk-bg-deep) 100%)',
  'linear-gradient(155deg, var(--dusk-surface) 0%, var(--dusk-surface-alt) 50%, var(--dusk-bg-deep) 100%)'
]

function projectGradient(index: number) {
  return projectGradients[index % projectGradients.length]
}

function onCardTilt(e: MouseEvent) {
  const card = e.currentTarget as HTMLElement
  const rect = card.getBoundingClientRect()
  const x = (e.clientX - rect.left) / rect.width - 0.5
  const y = (e.clientY - rect.top)  / rect.height - 0.5
  card.style.setProperty('--tilt-x', String((-y * 6).toFixed(2)))
  card.style.setProperty('--tilt-y', String((x  * 6).toFixed(2)))
}

function onCardReset(e: MouseEvent) {
  const card = e.currentTarget as HTMLElement
  card.style.setProperty('--tilt-x', '0')
  card.style.setProperty('--tilt-y', '0')
}
</script>

<style scoped>
.portfolio-page {
  background-color: var(--dusk-bg);
}

/* ══════════════════════════════════════════════
   CINEMATIC HERO — SCROLL CONTAINER + STICKY PANEL
   ══════════════════════════════════════════════ */

.hero-section {
  position: relative;
  height: 200vh;
  background-color: var(--dusk-bg-deep);
}

.hero-sticky {
  position: sticky;
  top: 0;
  height: 100vh;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.hero-bg-layer {
  position: absolute;
  inset: 0;
  z-index: 0;
  filter: blur(var(--focus-blur, 5px));
  will-change: filter;
}

.hero-bg-layer > * {
  position: absolute;
  inset: 0;
}

.hero-grain {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  opacity: 0.14;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23noise)'/%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 180px 180px;
  mix-blend-mode: overlay;
  animation: grainShift 0.15s steps(1) infinite;
  translate: 0 calc(var(--scroll-y, 0) * -0.04px);
  will-change: translate;
}

@keyframes grainShift {
  0%   { background-position: 0 0; }
  20%  { background-position: -40px -20px; }
  40%  { background-position: 20px -40px; }
  60%  { background-position: -30px 10px; }
  80%  { background-position: 10px 30px; }
  100% { background-position: 0 0; }
}

.hero-atmosphere {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background:
    radial-gradient(ellipse 80% 60% at 75% 15%, color-mix(in srgb, var(--dusk-primary) 14%, transparent) 0%, transparent 65%),
    radial-gradient(ellipse 50% 45% at 15% 85%, color-mix(in srgb, var(--dusk-accent) 10%, transparent) 0%, transparent 60%),
    radial-gradient(ellipse 40% 30% at 50% 50%, color-mix(in srgb, var(--dusk-primary) 4%, transparent) 0%, transparent 70%);
  translate: 0 calc(var(--scroll-y, 0) * 0.12px);
  animation: atmosphereBreathe 12s ease-in-out infinite;
  will-change: translate, opacity;
}

@keyframes atmosphereBreathe {
  0%, 100% { opacity: 0.85; }
  50%       { opacity: 1; }
}

.hero-light-leak {
  position: absolute;
  top: 60px;
  right: 0;
  width: 55%;
  height: 2px;
  background: linear-gradient(to left, color-mix(in srgb, var(--dusk-primary) 70%, transparent), color-mix(in srgb, var(--dusk-primary) 15%, transparent) 40%, transparent);
  z-index: 2;
  pointer-events: none;
}

.hero-mouse-glow {
  position: absolute;
  top: -10%;
  left: -10%;
  width: 120%;
  height: 120%;
  z-index: 1;
  pointer-events: none;
  background: radial-gradient(
    ellipse 40% 35% at 50% 45%,
    color-mix(in srgb, var(--dusk-primary) 7%, transparent) 0%,
    transparent 65%
  );
  translate:
    calc(var(--mouse-x, 0) * 40px)
    calc(var(--mouse-y, 0) * 28px);
  will-change: translate;
}

.hero-vignette {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  background: radial-gradient(ellipse 95% 95% at 50% 50%, transparent 45%, rgba(0,0,0,0.55) 100%);
}

.hero-focus-overlay {
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;
  background: radial-gradient(
    ellipse 80% 70% at 50% 45%,
    color-mix(in srgb, var(--dusk-bg) 12%, transparent) 0%,
    color-mix(in srgb, var(--dusk-bg) 38%, transparent) 100%
  );
  opacity: var(--overlay-fade, 0);
  will-change: opacity;
}

.hero-film-number {
  position: absolute;
  bottom: var(--space-10);
  right: var(--space-8);
  z-index: 3;
  font-family: 'Courier New', monospace;
  font-size: 10px;
  letter-spacing: 0.2em;
  color: color-mix(in srgb, var(--dusk-primary) 35%, transparent);
  text-transform: uppercase;
}

.hero-top-rule {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(to right, transparent, color-mix(in srgb, var(--dusk-primary) 30%, transparent) 30%, color-mix(in srgb, var(--dusk-primary) 15%, transparent) 70%, transparent);
  z-index: 3;
}

.hero-content {
  position: relative;
  z-index: 4;
  padding-top: var(--space-32);
  padding-bottom: var(--space-32);
  max-width: 960px;
}

.hero-content-inner {
  translate:
    calc(var(--mouse-x, 0) * 5px)
    calc(var(--mouse-y, 0) * 3px);
  scale: var(--focus-scale, 0.985);
  will-change: translate, scale;
}

.hero-eyebrow {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 500;
  letter-spacing: var(--tracking-widest);
  text-transform: uppercase;
  color: var(--dusk-primary);
  margin-bottom: var(--space-12);
}

.hero-eyebrow-line {
  display: inline-block;
  width: 24px;
  height: 1px;
  background: var(--dusk-primary);
  flex-shrink: 0;
  opacity: 0.7;
}

.hero-eyebrow-dot {
  width: 5px;
  height: 5px;
  background: var(--dusk-primary);
  border-radius: var(--radius-full);
  animation: pulse 2.5s ease-in-out infinite;
  flex-shrink: 0;
}

@keyframes pulse {
  0%, 100% { opacity: 1; box-shadow: 0 0 0 0 color-mix(in srgb, var(--dusk-primary) 40%, transparent); }
  50% { opacity: 0.5; box-shadow: 0 0 0 4px color-mix(in srgb, var(--dusk-primary) 0%, transparent); }
}

.hero-name {
  font-family: var(--font-display);
  font-size: clamp(3.5rem, 9vw, 8rem);
  font-weight: var(--heading-weight);
  letter-spacing: -0.03em;
  color: var(--dusk-text);
  line-height: 0.95;
  margin-bottom: var(--space-8);
  text-shadow: 0 2px 30px color-mix(in srgb, black 50%, transparent);
}

.hero-tagline-wrap {
  position: relative;
  padding-left: var(--space-6);
  margin-bottom: var(--space-8);
}

.hero-tagline-wrap::before {
  content: '';
  position: absolute;
  left: 0;
  top: 4px;
  bottom: 4px;
  width: 2px;
  background: linear-gradient(to bottom, var(--dusk-primary), transparent);
  border-radius: 1px;
}

.hero-tagline {
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 3.5vw, 3rem);
  font-weight: 300;
  font-style: italic;
  letter-spacing: -0.015em;
  color: var(--dusk-text-secondary);
  line-height: 1.35;
}

.hero-tagline-line { display: inline; }

.hero-subline {
  font-family: var(--font-body);
  font-size: var(--text-base);
  font-weight: 300;
  color: var(--dusk-text-muted);
  line-height: 1.8;
  max-width: 460px;
  margin-bottom: var(--space-10);
  letter-spacing: 0.008em;
}

.hero-cta {
  display: flex;
  align-items: center;
  gap: var(--space-8);
  flex-wrap: wrap;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-8);
  background: var(--dusk-primary);
  color: var(--dusk-bg-deep);
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: var(--tracking-widest);
  text-transform: uppercase;
  text-decoration: none;
  border-radius: var(--radius-sm);
  transition:
    background   0.3s cubic-bezier(0.16, 1, 0.3, 1),
    transform    0.3s cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow   0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.btn-primary:hover {
  background: var(--dusk-primary-dark);
  transform: translateY(-2px);
  box-shadow:
    0 10px 28px color-mix(in srgb, var(--dusk-primary) 22%, transparent),
    0 0 0 3px color-mix(in srgb, var(--dusk-primary) 8%, transparent);
}

.btn-ghost {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 400;
  color: var(--dusk-text-muted);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: var(--space-2);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: color var(--duration-fast) var(--ease-smooth);
  letter-spacing: 0.01em;
}

.btn-ghost:hover { color: var(--dusk-primary); }

.btn-ghost-arrow {
  display: inline-block;
  transition: transform var(--duration-base) var(--ease-out-expo);
}

.btn-ghost:hover .btn-ghost-arrow { transform: translate(4px, 0); }

.hero-scroll-indicator {
  position: absolute;
  bottom: var(--space-10);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
  z-index: 6;
}

.scroll-line {
  width: 1px;
  height: 56px;
  background: linear-gradient(to bottom, color-mix(in srgb, var(--dusk-primary) 60%, transparent), transparent);
  animation: scrollDrop 2s ease-in-out infinite;
  transform-origin: top;
}

@keyframes scrollDrop {
  0%   { transform: scaleY(0); opacity: 0; }
  30%  { opacity: 1; }
  70%  { transform: scaleY(1); opacity: 1; }
  100% { transform: scaleY(1); opacity: 0; }
}

.scroll-label {
  font-family: var(--font-body);
  font-size: 9px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--dusk-primary) 45%, transparent);
}

/* ══════════════════════════════════════════════
   SECTION SHARED
══════════════════════════════════════════════ */
.section-atmosphere {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  background:
    radial-gradient(ellipse 60% 40% at 90% 10%, color-mix(in srgb, var(--dusk-primary) 5%, transparent) 0%, transparent 70%),
    radial-gradient(ellipse 40% 30% at 10% 90%, color-mix(in srgb, var(--dusk-accent) 4%, transparent) 0%, transparent 60%);
}

.section-index {
  font-family: 'Courier New', monospace;
  font-size: var(--text-xs);
  letter-spacing: 0.15em;
  color: var(--dusk-text-faint);
  display: block;
}

.section-tag {
  display: inline-block;
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 500;
  letter-spacing: var(--tracking-widest);
  text-transform: uppercase;
  color: var(--dusk-primary);
  margin-bottom: var(--space-3);
}

.section-title {
  font-family: var(--font-display);
  font-size: clamp(3rem, 5vw, 5rem);
  font-weight: var(--heading-weight);
  letter-spacing: -0.04em;
  color: var(--dusk-text);
  line-height: 0.95;
  text-shadow: 0 2px 30px color-mix(in srgb, black 60%, transparent);
}

/* ══════════════════════════════════════════════
   WORK
══════════════════════════════════════════════ */
.work-section {
  position: relative;
  padding-block: var(--space-32);
  border-top: 1px solid var(--dusk-border-muted);
}

.section-header {
  display: flex;
  align-items: flex-end;
  gap: var(--space-8);
  margin-bottom: var(--space-16);
}

.section-header-left {
  display: flex;
  align-items: flex-start;
  gap: var(--space-5);
  flex-shrink: 0;
}

.section-header-rule {
  flex: 1;
  height: 1px;
  background: linear-gradient(to right, var(--dusk-border), transparent);
  margin-bottom: var(--space-2);
}

.section-index-col {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  padding-top: var(--space-1);
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-4);
}

.project-card {
  position: relative;
  background: var(--dusk-surface);
  border: 1px solid var(--dusk-border-muted);
  border-radius: var(--radius-md);
  overflow: hidden;
  cursor: pointer;
  transition:
    border-color 0.45s cubic-bezier(0.16, 1, 0.3, 1),
    transform    0.45s cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow   0.45s cubic-bezier(0.16, 1, 0.3, 1);
}

.project-card::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background: radial-gradient(
    ellipse 70% 50% at 50% 0%,
    color-mix(in srgb, var(--dusk-primary) 7%, transparent) 0%,
    transparent 70%
  );
  opacity: 0;
  transition: opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.project-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.4) 100%);
  z-index: 1;
  opacity: 0;
  transition: opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1);
  pointer-events: none;
}

.project-card:hover {
  border-color: color-mix(in srgb, var(--dusk-primary) 22%, transparent);
  transform:
    perspective(900px)
    rotateX(calc(var(--tilt-x, 0) * 1deg))
    rotateY(calc(var(--tilt-y, 0) * 1deg))
    translateY(-4px)
    scale(1.012);
  box-shadow:
    0 20px 48px rgba(0, 0, 0, 0.45),
    0 0 0 1px color-mix(in srgb, var(--dusk-primary) 8%, transparent);
}

.project-card:hover::before { opacity: 1; }
.project-card:hover::after  { opacity: 1; }

.project-card:hover .project-cta { opacity: 1; transform: translateY(0); }

.project-card-wide { grid-column: 1 / -1; }

.project-image {
  width: 100%;
  aspect-ratio: 16 / 7;
  overflow: hidden;
  position: relative;
}

.project-image-frame {
  width: 100%;
  height: 100%;
  position: relative;
  transition: transform var(--duration-slower) var(--ease-out-expo);
}

.project-card:hover .project-image-frame { transform: scale(1.03); }

.project-image-grain {
  position: absolute;
  inset: 0;
  z-index: 2;
  opacity: 0.12;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23noise)'/%3E%3C/svg%3E");
  background-size: 160px 160px;
  mix-blend-mode: overlay;
  pointer-events: none;
}

.project-image-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.project-image-vignette {
  position: absolute;
  inset: 0;
  z-index: 3;
  background: radial-gradient(ellipse 100% 100% at 50% 50%, transparent 30%, rgba(0,0,0,0.6) 100%);
  pointer-events: none;
}

.project-image-watermark {
  position: absolute;
  inset: 0;
  z-index: 4;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  flex-direction: column;
}

.watermark-index {
  font-family: 'Courier New', monospace;
  font-size: 2.5rem;
  color: color-mix(in srgb, var(--dusk-text) 6%, transparent);
  letter-spacing: 0.3em;
  line-height: 1;
}

.watermark-category {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 500;
  letter-spacing: var(--tracking-widest);
  text-transform: uppercase;
  color: color-mix(in srgb, var(--dusk-primary) 50%, transparent);
}

.project-image-photo {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.project-meta { position: relative; z-index: 2; padding: var(--space-5) var(--space-6); }

.project-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: var(--space-3);
}

.project-category {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  letter-spacing: var(--tracking-widest);
  text-transform: uppercase;
  color: var(--dusk-primary);
  display: block;
  margin-bottom: var(--space-1);
}

.project-title {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: 400;
  letter-spacing: -0.02em;
  color: var(--dusk-text);
  line-height: 1.15;
}

.project-year {
  font-family: 'Courier New', monospace;
  font-size: var(--text-xs);
  color: var(--dusk-text-faint);
  letter-spacing: 0.05em;
  flex-shrink: 0;
  margin-top: var(--space-1);
}

.project-desc {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 300;
  color: var(--dusk-text-muted);
  line-height: var(--leading-relaxed);
  margin-bottom: var(--space-4);
}

.project-tags { display: flex; flex-wrap: wrap; gap: var(--space-2); }

.project-tag {
  font-family: var(--font-body);
  font-size: 10px;
  color: var(--dusk-text-faint);
  background: var(--dusk-surface-alt);
  border: 1px solid var(--dusk-border-muted);
  border-radius: 2px;
  padding: 3px 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.project-cta {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 3;
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-6);
  background: linear-gradient(to top, color-mix(in srgb, var(--dusk-bg) 95%, transparent) 0%, transparent 100%);
  opacity: 0;
  transform: translateY(4px);
  transition:
    opacity var(--duration-base) var(--ease-smooth),
    transform var(--duration-base) var(--ease-out-expo);
}

.project-cta-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(to right, color-mix(in srgb, var(--dusk-primary) 60%, transparent), transparent);
}

.project-cta-arrow {
  font-size: var(--text-sm);
  color: var(--dusk-primary);
  letter-spacing: 0.1em;
}

.projects-featured {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  margin-bottom: var(--space-4);
}

.projects-more-label {
  display: flex;
  align-items: center;
  gap: var(--space-5);
  margin: var(--space-10) 0 var(--space-4);
}

.projects-more-rule {
  flex: 1;
  height: 1px;
  background: var(--dusk-border-muted);
}

.projects-more-text {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  letter-spacing: var(--tracking-widest);
  text-transform: uppercase;
  color: var(--dusk-text-faint);
  white-space: nowrap;
}

/* ══════════════════════════════════════════════
   ABOUT
══════════════════════════════════════════════ */
.about-section {
  padding-block: var(--space-32);
  border-top: 1px solid var(--dusk-border-muted);
}

.about-grid {
  display: grid;
  grid-template-columns: 5fr 7fr;
  gap: var(--space-20);
  align-items: start;
}

.about-left {
  position: sticky;
  top: calc(var(--nav-height) + var(--space-8));
}

.about-headline {
  font-family: var(--font-display);
  font-size: clamp(3rem, 5vw, 5.5rem);
  font-weight: var(--heading-weight);
  letter-spacing: -0.04em;
  color: var(--dusk-text);
  line-height: 0.95;
  margin-top: var(--space-4);
  margin-bottom: var(--space-8);
  text-shadow: 0 2px 30px color-mix(in srgb, black 50%, transparent);
}

.about-rule {
  height: 1px;
  width: 48px;
  background: linear-gradient(to right, var(--dusk-primary), transparent);
  margin-bottom: var(--space-8);
}

.about-meta { display: flex; flex-direction: column; gap: var(--space-5); }

.about-meta-item { display: flex; flex-direction: column; gap: 3px; }

.about-meta-label {
  font-family: 'Courier New', monospace;
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--dusk-text-faint);
}

.about-meta-value {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--dusk-text-secondary);
  letter-spacing: 0.01em;
}

.about-status { display: flex; align-items: center; gap: var(--space-2); }

.status-dot {
  width: 5px;
  height: 5px;
  background: var(--dusk-primary);
  border-radius: var(--radius-full);
  animation: pulse 2.5s ease-in-out infinite;
  flex-shrink: 0;
}

.about-paragraphs {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
  margin-top: var(--space-16);
  margin-bottom: var(--space-12);
  padding-top: var(--space-4);
  border-top: 1px solid var(--dusk-border-muted);
}

.about-para {
  font-family: var(--font-body);
  font-size: var(--text-lg);
  font-weight: 300;
  color: var(--dusk-text-secondary);
  line-height: 1.85;
  letter-spacing: 0.01em;
}

.skills-label {
  display: block;
  font-family: 'Courier New', monospace;
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--dusk-text-faint);
  margin-bottom: var(--space-4);
}

.skills-list { display: flex; flex-wrap: wrap; gap: var(--space-2); }

.skill-item {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--dusk-text-secondary);
  background: var(--dusk-surface);
  border: 1px solid var(--dusk-border-muted);
  border-radius: var(--radius-sm);
  padding: var(--space-2) var(--space-4);
  letter-spacing: 0.01em;
  cursor: default;
  transition:
    border-color var(--duration-fast) var(--ease-smooth),
    color var(--duration-fast) var(--ease-smooth),
    background var(--duration-fast) var(--ease-smooth);
}

.skill-item:hover {
  border-color: color-mix(in srgb, var(--dusk-primary) 40%, transparent);
  color: var(--dusk-primary);
  background: color-mix(in srgb, var(--dusk-primary) 5%, transparent);
}

/* ══════════════════════════════════════════════
   PROCESS
══════════════════════════════════════════════ */
.process-section {
  margin-top: var(--space-20);
  padding-top: var(--space-12);
  border-top: 1px solid var(--dusk-border-muted);
}

.process-intro {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  letter-spacing: var(--tracking-widest);
  text-transform: uppercase;
  color: var(--dusk-text-faint);
  margin-bottom: var(--space-10);
}

.process-steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: var(--space-8);
}

.process-step { display: flex; flex-direction: column; gap: var(--space-3); }

.process-step-number {
  font-family: 'Courier New', monospace;
  font-size: 10px;
  letter-spacing: 0.2em;
  color: var(--dusk-primary-dim);
}

.process-step-title {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: 300;
  color: var(--dusk-text);
  letter-spacing: -0.02em;
}

.process-step-body {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 300;
  color: var(--dusk-text-muted);
  line-height: 1.7;
}

/* ══════════════════════════════════════════════
   CONTACT
══════════════════════════════════════════════ */
.contact-section {
  position: relative;
  padding-block: var(--space-32);
  border-top: 1px solid var(--dusk-border-muted);
  overflow: hidden;
}

.contact-atmosphere {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  background:
    radial-gradient(ellipse 70% 60% at 50% 50%, color-mix(in srgb, var(--dusk-accent) 7%, transparent) 0%, transparent 70%),
    radial-gradient(ellipse 50% 40% at 80% 80%, color-mix(in srgb, var(--dusk-primary) 6%, transparent) 0%, transparent 60%);
}

.contact-section-index {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  margin-bottom: var(--space-12);
  position: relative;
  z-index: 1;
}

.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-20);
  align-items: center;
  position: relative;
  z-index: 1;
}

.contact-headline {
  font-family: var(--font-display);
  font-size: clamp(3rem, 5vw, 5.5rem);
  font-weight: 300;
  letter-spacing: -0.04em;
  color: var(--dusk-text);
  line-height: 0.95;
  margin-bottom: var(--space-6);
  text-shadow: 0 2px 30px rgba(0,0,0,0.5);
}

.contact-headline-line { display: inline; }

.contact-subline {
  font-family: var(--font-body);
  font-size: var(--text-base);
  font-weight: 300;
  color: var(--dusk-text-muted);
  line-height: var(--leading-relaxed);
  letter-spacing: 0.01em;
}

.contact-email {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  font-family: var(--font-display);
  font-size: clamp(1.25rem, 2.5vw, 2rem);
  font-weight: 300;
  color: var(--dusk-text);
  text-decoration: none;
  border-bottom: 1px solid var(--dusk-border);
  padding-bottom: var(--space-5);
  margin-bottom: var(--space-8);
  letter-spacing: -0.01em;
  transition:
    color var(--duration-base) var(--ease-smooth),
    border-color var(--duration-base) var(--ease-smooth);
}

.contact-email:hover {
  color: var(--dusk-primary);
  border-color: color-mix(in srgb, var(--dusk-primary) 40%, transparent);
}

.contact-email-text { flex: 1; }

.contact-email-arrow {
  font-size: var(--text-xl);
  transition: transform var(--duration-base) var(--ease-out-expo);
  opacity: 0.6;
}

.contact-email:hover .contact-email-arrow { transform: translate(4px, -4px); opacity: 1; }

.contact-socials { display: flex; flex-direction: column; gap: 0; }

.contact-social {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: var(--font-body);
  font-size: var(--text-xs);
  color: var(--dusk-text-muted);
  text-decoration: none;
  padding-block: var(--space-4);
  border-bottom: 1px solid var(--dusk-border-muted);
  letter-spacing: 0.05em;
  text-transform: uppercase;
  transition: color var(--duration-fast) var(--ease-smooth);
}

.contact-social:hover { color: var(--dusk-primary); }

.contact-social-arrow {
  transition: transform var(--duration-base) var(--ease-out-expo);
  opacity: 0.5;
}

.contact-social:hover .contact-social-arrow { transform: translate(3px, -3px); opacity: 1; }

/* ══════════════════════════════════════════════
   TRUST SIGNALS
══════════════════════════════════════════════ */
.contact-trust {
  margin-top: var(--space-8);
  padding-top: var(--space-6);
  border-top: 1px solid var(--dusk-border-muted);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.trust-item {
  display: flex;
  align-items: baseline;
  gap: var(--space-4);
}

.trust-label {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  letter-spacing: var(--tracking-widest);
  text-transform: uppercase;
  color: var(--dusk-text-faint);
  width: 110px;
  flex-shrink: 0;
}

.trust-value {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--dusk-text-muted);
  line-height: 1.5;
}

.trust-stack .trust-value {
  color: var(--dusk-text-secondary);
  letter-spacing: 0.02em;
}

/* ══════════════════════════════════════════════
   RESPONSIVE
══════════════════════════════════════════════ */
@media (max-width: 900px) {
  .projects-grid { grid-template-columns: 1fr; }
  .project-card-wide { grid-column: auto; }
  .about-grid, .contact-grid { grid-template-columns: 1fr; gap: var(--space-12); }
  .about-left { position: static; }
  .section-header { flex-direction: column; align-items: flex-start; gap: var(--space-4); }
  .section-header-rule { display: none; }
  .process-steps { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 580px) {
  .hero-cta { flex-direction: column; align-items: flex-start; gap: var(--space-5); }
  .hero-name { font-size: clamp(3rem, 12vw, 5rem); }
  .process-steps { grid-template-columns: 1fr; }
  .trust-item { flex-direction: column; gap: var(--space-1); }
  .trust-label { width: auto; }
}
</style>
