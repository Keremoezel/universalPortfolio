<template>
  <div class="case-study-page">

    <!-- Navigation -->
    <nav class="cs-nav">
      <NuxtLink :to="localePath('/')" class="cs-back">
        <span class="cs-back-arrow">←</span>
        <span>{{ $t('project.back') }}</span>
      </NuxtLink>
      <span class="cs-nav-index">{{ $t('project.caseStudy') }}</span>
    </nav>

    <!-- Not found -->
    <div v-if="!project" class="cs-not-found">
      <p>Project not found.</p>
      <NuxtLink :to="localePath('/')" class="cs-back">←</NuxtLink>
    </div>

    <template v-else>

      <!-- Hero header -->
      <header class="cs-header">
        <div class="cs-header-meta">
          <span class="cs-category">{{ field(project.category) }}</span>
          <span class="cs-divider">·</span>
          <span class="cs-year">{{ project.year }}</span>
        </div>

        <h1 class="cs-title">{{ field(project.title) }}</h1>

        <p class="cs-description">{{ field(project.description) }}</p>

        <div class="cs-tags">
          <span v-for="tag in project.tags" :key="tag" class="cs-tag">{{ tag }}</span>
        </div>

        <!-- Project image -->
        <div v-if="project.imageUrl" class="cs-image-wrap">
          <img :src="project.imageUrl" :alt="field(project.title)" class="cs-image" />
        </div>
        <div v-else class="cs-image-placeholder">
          <span class="cs-image-placeholder-text">{{ field(project.category) }}</span>
        </div>

        <!-- Live link -->
        <div v-if="project.link" class="cs-link-wrap">
          <a :href="project.link" target="_blank" rel="noopener" class="cs-live-link">
            {{ $t('project.viewLive') }} <span>↗</span>
          </a>
        </div>
      </header>

      <!-- Case study body -->
      <div v-if="project.caseStudy" class="cs-body">

        <section class="cs-section">
          <div class="cs-section-label">
            <span class="cs-section-number">01</span>
            <span class="cs-section-name">{{ $t('project.problem') }}</span>
          </div>
          <p class="cs-section-text">{{ field(project.caseStudy.problem) }}</p>
        </section>

        <div class="cs-rule" />

        <section class="cs-section">
          <div class="cs-section-label">
            <span class="cs-section-number">02</span>
            <span class="cs-section-name">{{ $t('project.approach') }}</span>
          </div>
          <p class="cs-section-text">{{ field(project.caseStudy.approach) }}</p>
        </section>

        <div class="cs-rule" />

        <section class="cs-section">
          <div class="cs-section-label">
            <span class="cs-section-number">03</span>
            <span class="cs-section-name">{{ $t('project.solution') }}</span>
          </div>
          <p class="cs-section-text">{{ field(project.caseStudy.solution) }}</p>
        </section>

        <div class="cs-rule" />

        <section class="cs-section cs-section-result">
          <div class="cs-section-label">
            <span class="cs-section-number">04</span>
            <span class="cs-section-name">{{ $t('project.result') }}</span>
          </div>
          <p class="cs-section-text">{{ field(project.caseStudy.result) }}</p>
        </section>

      </div>

      <div v-else class="cs-empty">
        <p>Case study details coming soon.</p>
      </div>

      <!-- Footer nav -->
      <footer class="cs-footer">
        <NuxtLink
          v-if="prevProject"
          :to="localePath(`/project/${prevProject.slug}`)"
          class="cs-nav-project cs-nav-prev"
        >
          <span class="cs-nav-dir">← {{ $t('project.previous') }}</span>
          <span class="cs-nav-title">{{ field(prevProject.title) }}</span>
        </NuxtLink>
        <div v-else />
        <NuxtLink
          v-if="nextProject"
          :to="localePath(`/project/${nextProject.slug}`)"
          class="cs-nav-project cs-nav-next"
        >
          <span class="cs-nav-dir">{{ $t('project.next') }} →</span>
          <span class="cs-nav-title">{{ field(nextProject.title) }}</span>
        </NuxtLink>
        <div v-else />
      </footer>

    </template>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const route   = useRoute()
const content = useContentStore()
const { field } = useLocaleContent()
const localePath = useLocalePath()

const project = computed(() =>
  content.projects.find(p => p.slug === route.params.slug)
)

const projectIndex = computed(() =>
  content.projects.findIndex(p => p.slug === route.params.slug)
)

const prevProject = computed(() =>
  projectIndex.value > 0 ? content.projects[projectIndex.value - 1] : null
)

const nextProject = computed(() =>
  projectIndex.value < content.projects.length - 1
    ? content.projects[projectIndex.value + 1]
    : null
)

useHead(() => ({
  title:       project.value ? `${field(project.value.title)} — Case Study` : 'Project Not Found',
  meta: [
    { name: 'description', content: project.value ? field(project.value.description) : '' }
  ]
}))
</script>

<style scoped>
.case-study-page {
  min-height: 100vh;
  background: var(--dusk-bg-deep);
  color: var(--dusk-text);
}

.cs-nav {
  position: sticky;
  top: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-5) var(--space-8);
  background: rgba(6, 4, 2, 0.85);
  backdrop-filter: blur(20px) saturate(1.4);
  border-bottom: 1px solid color-mix(in srgb, var(--dusk-primary) 10%, transparent);
}

.cs-back {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--dusk-text-muted);
  text-decoration: none;
  transition: color 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  letter-spacing: 0.02em;
}

.cs-back:hover { color: var(--dusk-primary); }
.cs-back-arrow { transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
.cs-back:hover .cs-back-arrow { transform: translateX(-3px); }

.cs-nav-index {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  letter-spacing: var(--tracking-widest);
  text-transform: uppercase;
  color: var(--dusk-text-faint);
}

.cs-header {
  max-width: 860px;
  margin: 0 auto;
  padding: var(--space-24) var(--space-8) var(--space-16);
}

.cs-header-meta {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-6);
}

.cs-category {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  letter-spacing: var(--tracking-widest);
  text-transform: uppercase;
  color: var(--dusk-primary);
}

.cs-divider { color: var(--dusk-text-faint); }

.cs-year {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  letter-spacing: var(--tracking-wide);
  color: var(--dusk-text-faint);
}

.cs-title {
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 6vw, 5.5rem);
  font-weight: 300;
  letter-spacing: -0.03em;
  line-height: 0.95;
  color: var(--dusk-text);
  margin-bottom: var(--space-8);
}

.cs-description {
  font-family: var(--font-body);
  font-size: var(--text-lg);
  font-weight: 300;
  color: var(--dusk-text-secondary);
  line-height: 1.75;
  max-width: 600px;
  margin-bottom: var(--space-6);
}

.cs-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-bottom: var(--space-10);
}

.cs-tag {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  letter-spacing: var(--tracking-wide);
  color: var(--dusk-text-muted);
  border: 1px solid var(--dusk-border-muted);
  border-radius: var(--radius-sm);
  padding: 3px var(--space-3);
}

.cs-image-wrap {
  width: 100%;
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid var(--dusk-border-muted);
  margin-bottom: var(--space-8);
  aspect-ratio: 16 / 9;
}

.cs-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.cs-image-placeholder {
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: var(--radius-lg);
  border: 1px solid var(--dusk-border-muted);
  background: var(--dusk-surface);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--space-8);
}

.cs-image-placeholder-text {
  font-family: var(--font-display);
  font-size: clamp(2rem, 5vw, 5rem);
  font-weight: 300;
  color: var(--dusk-border-muted);
  letter-spacing: -0.03em;
}

.cs-link-wrap { margin-bottom: var(--space-4); }

.cs-live-link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--dusk-primary);
  text-decoration: none;
  letter-spacing: 0.01em;
  transition: opacity 0.3s ease;
}

.cs-live-link:hover { opacity: 0.7; }

.cs-body {
  max-width: 860px;
  margin: 0 auto;
  padding: 0 var(--space-8) var(--space-32);
}

.cs-rule {
  height: 1px;
  background: linear-gradient(to right, transparent, var(--dusk-border-muted) 20%, var(--dusk-border-muted) 80%, transparent);
  margin: var(--space-14) 0;
}

.cs-section {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: var(--space-8);
  align-items: start;
}

.cs-section-label {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding-top: var(--space-1);
}

.cs-section-number {
  font-family: 'Courier New', monospace;
  font-size: 10px;
  letter-spacing: 0.2em;
  color: var(--dusk-primary);
  opacity: 0.7;
}

.cs-section-name {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  letter-spacing: var(--tracking-widest);
  text-transform: uppercase;
  color: var(--dusk-text-muted);
}

.cs-section-text {
  font-family: var(--font-body);
  font-size: var(--text-lg);
  font-weight: 300;
  color: var(--dusk-text-secondary);
  line-height: 1.8;
}

.cs-section-result .cs-section-text {
  color: var(--dusk-text);
  font-size: var(--text-xl);
}

.cs-not-found,
.cs-empty {
  max-width: 860px;
  margin: var(--space-24) auto;
  padding: 0 var(--space-8);
  color: var(--dusk-text-muted);
  font-family: var(--font-body);
  font-size: var(--text-base);
}

.cs-footer {
  max-width: 860px;
  margin: 0 auto;
  padding: var(--space-12) var(--space-8) var(--space-24);
  border-top: 1px solid var(--dusk-border-muted);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--space-8);
}

.cs-nav-project {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  text-decoration: none;
  transition: opacity 0.3s ease;
}

.cs-nav-project:hover { opacity: 0.65; }
.cs-nav-next { text-align: right; }

.cs-nav-dir {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  letter-spacing: var(--tracking-widest);
  text-transform: uppercase;
  color: var(--dusk-text-faint);
}

.cs-nav-title {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: 300;
  color: var(--dusk-text);
  letter-spacing: -0.02em;
}

@media (max-width: 700px) {
  .cs-nav { padding: var(--space-4) var(--space-5); }
  .cs-header { padding: var(--space-16) var(--space-5) var(--space-10); }
  .cs-body { padding: 0 var(--space-5) var(--space-20); }
  .cs-section { grid-template-columns: 1fr; gap: var(--space-4); }
  .cs-footer { padding: var(--space-10) var(--space-5) var(--space-16); flex-direction: column; }
  .cs-nav-next { text-align: left; }
}
</style>
