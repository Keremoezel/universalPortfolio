<template>
  <div class="admin-dashboard">

    <!-- Stats row -->
    <div class="stats-grid">
      <div class="stat-card">
        <span class="stat-label">Projects</span>
        <span class="stat-value">{{ content.projects.length }}</span>
        <span class="stat-sub">in portfolio</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">Sections</span>
        <span class="stat-value">{{ components.visibleSections.length }}</span>
        <span class="stat-sub">of {{ components.sections.length }} visible</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">Theme</span>
        <span class="stat-value stat-value-swatch">
          <span
            class="color-swatch"
            :style="{ background: theme.activeTheme.colors.primary }"
          />
          Dusk
        </span>
        <span class="stat-sub">design system</span>
      </div>
      <div class="stat-card stat-card-accent">
        <span class="stat-label">Status</span>
        <span class="stat-value stat-value-live">
          <span class="live-indicator" />
          Live
        </span>
        <span class="stat-sub">portfolio is active</span>
      </div>
    </div>

    <!-- Quick actions -->
    <div class="quick-actions">
      <h2 class="section-title">Quick Actions</h2>
      <div class="actions-grid">
        <NuxtLink to="/admin/theme" class="action-card">
          <span class="action-icon">◐</span>
          <div>
            <p class="action-label">Theme Editor</p>
            <p class="action-desc">Adjust colors, typography, and radius</p>
          </div>
          <span class="action-arrow">→</span>
        </NuxtLink>
        <NuxtLink to="/admin/content" class="action-card">
          <span class="action-icon">✦</span>
          <div>
            <p class="action-label">Edit Content</p>
            <p class="action-desc">Update name, projects, bio, contact</p>
          </div>
          <span class="action-arrow">→</span>
        </NuxtLink>
        <NuxtLink to="/admin/components" class="action-card">
          <span class="action-icon">⊞</span>
          <div>
            <p class="action-label">Sections</p>
            <p class="action-desc">Show/hide and reorder portfolio sections</p>
          </div>
          <span class="action-arrow">→</span>
        </NuxtLink>
        <NuxtLink to="/admin/ai-prompt" class="action-card">
          <span class="action-icon">⟡</span>
          <div>
            <p class="action-label">AI Theme</p>
            <p class="action-desc">Generate themes from natural language</p>
          </div>
          <span class="action-arrow">→</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Current theme preview -->
    <div class="theme-preview-strip">
      <h2 class="section-title">Active Theme Palette</h2>
      <div class="palette-row">
        <div
          v-for="(color, key) in theme.activeTheme.colors"
          :key="key"
          class="palette-chip"
        >
          <div class="palette-color" :style="{ background: color }" />
          <span class="palette-key">{{ key }}</span>
          <span class="palette-hex">{{ color }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const content = useContentStore()
const components = useComponentsStore()
const theme = useThemeStore()
</script>

<style scoped>
.admin-dashboard { display: flex; flex-direction: column; gap: var(--space-10); }

/* Stats */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-4);
}

.stat-card {
  background: var(--dusk-surface);
  border: 1px solid var(--dusk-border-muted);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.stat-card-accent {
  border-color: color-mix(in srgb, var(--dusk-primary) 30%, transparent);
}

.stat-label {
  font-size: var(--text-xs);
  letter-spacing: var(--tracking-widest);
  text-transform: uppercase;
  color: var(--dusk-text-faint);
}

.stat-value {
  font-family: var(--font-display);
  font-size: var(--text-4xl);
  font-weight: 300;
  color: var(--dusk-text);
  letter-spacing: var(--tracking-tight);
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.stat-value-swatch { font-size: var(--text-2xl); }
.stat-value-live { font-size: var(--text-2xl); }

.stat-sub {
  font-size: var(--text-xs);
  color: var(--dusk-text-muted);
}

.color-swatch {
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: var(--radius-sm);
}

.live-indicator {
  display: inline-block;
  width: 8px;
  height: 8px;
  background: var(--dusk-primary);
  border-radius: var(--radius-full);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

/* Actions */
.section-title {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: 300;
  color: var(--dusk-text);
  letter-spacing: var(--tracking-tight);
  margin-bottom: var(--space-5);
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-3);
}

.action-card {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-5);
  background: var(--dusk-surface);
  border: 1px solid var(--dusk-border-muted);
  border-radius: var(--radius-lg);
  text-decoration: none;
  transition: all var(--duration-base) var(--ease-smooth);
}

.action-card:hover {
  border-color: var(--dusk-primary);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.action-card:hover .action-arrow { color: var(--dusk-primary); transform: translateX(4px); }

.action-icon {
  font-size: var(--text-2xl);
  color: var(--dusk-primary);
  width: 40px;
  text-align: center;
  flex-shrink: 0;
}

.action-label {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--dusk-text);
  margin-bottom: var(--space-1);
}

.action-desc {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  color: var(--dusk-text-muted);
}

.action-arrow {
  font-size: var(--text-lg);
  color: var(--dusk-text-faint);
  margin-left: auto;
  transition: all var(--duration-base) var(--ease-smooth);
}

/* Palette */
.theme-preview-strip { }

.palette-row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}

.palette-chip {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
}

.palette-color {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  border: 1px solid var(--dusk-border-muted);
}

.palette-key {
  font-size: var(--text-xs);
  color: var(--dusk-text-muted);
  letter-spacing: var(--tracking-normal);
}

.palette-hex {
  font-size: 10px;
  color: var(--dusk-text-faint);
  font-variant-numeric: tabular-nums;
}

@media (max-width: 900px) {
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .actions-grid { grid-template-columns: 1fr; }
}
</style>
