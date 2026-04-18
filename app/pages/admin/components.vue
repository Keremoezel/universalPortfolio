<template>
  <div class="components-page">
    <div class="page-intro">
      <p class="page-desc">Toggle visibility of portfolio sections. Drag to reorder (changes order in live portfolio).</p>
    </div>

    <div class="sections-list">
      <div
        v-for="(section, index) in componentsStore.sortedSections"
        :key="section.key"
        class="section-row"
        :class="{ 'section-hidden': !section.visible }"
      >
        <!-- Drag handle -->
        <div class="drag-handle" :title="`Drag to reorder`">
          <span class="drag-dots">⠿</span>
        </div>

        <!-- Order badge -->
        <div class="section-order">{{ index + 1 }}</div>

        <!-- Info -->
        <div class="section-info">
          <p class="section-name">{{ section.label }}</p>
          <p class="section-key-tag">{{ section.key }}</p>
        </div>

        <!-- Reorder arrows -->
        <div class="reorder-btns">
          <button
            class="reorder-btn"
            :disabled="index === 0"
            title="Move up"
            @click="componentsStore.reorderSections(index, index - 1)"
          >↑</button>
          <button
            class="reorder-btn"
            :disabled="index === componentsStore.sortedSections.length - 1"
            title="Move down"
            @click="componentsStore.reorderSections(index, index + 1)"
          >↓</button>
        </div>

        <!-- Toggle -->
        <div class="section-toggle">
          <button
            class="toggle-btn"
            :class="{ active: section.visible }"
            :aria-label="`${section.visible ? 'Hide' : 'Show'} ${section.label}`"
            @click="componentsStore.toggleSection(section.key)"
          >
            <span class="toggle-track">
              <span class="toggle-thumb" />
            </span>
            <span class="toggle-label">{{ section.visible ? 'Visible' : 'Hidden' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Summary -->
    <div class="summary-card">
      <div class="summary-header">
        <span class="summary-title">Active order in portfolio</span>
        <button class="reset-btn" @click="componentsStore.resetToDefaults()">Reset</button>
      </div>
      <div class="summary-flow">
        <template v-for="(section, i) in componentsStore.visibleSections" :key="section.key">
          <span class="flow-section">{{ section.label }}</span>
          <span v-if="i < componentsStore.visibleSections.length - 1" class="flow-arrow">→</span>
        </template>
        <span v-if="componentsStore.visibleSections.length === 0" class="flow-empty">
          All sections hidden
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const componentsStore = useComponentsStore()
</script>

<style scoped>
.components-page { display: flex; flex-direction: column; gap: var(--space-6); }

.page-desc {
  font-size: var(--text-sm);
  color: var(--dusk-text-muted);
  line-height: var(--leading-relaxed);
}

.sections-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.section-row {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4) var(--space-5);
  background: var(--dusk-surface);
  border: 1px solid var(--dusk-border-muted);
  border-radius: var(--radius-lg);
  transition: all var(--duration-base) var(--ease-smooth);
}

.section-hidden {
  opacity: 0.5;
}

.drag-handle {
  cursor: grab;
  color: var(--dusk-text-faint);
  padding: var(--space-1);
}

.drag-dots { font-size: var(--text-lg); }

.section-order {
  width: 24px;
  height: 24px;
  background: var(--dusk-surface-alt);
  border: 1px solid var(--dusk-border-muted);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-xs);
  color: var(--dusk-text-muted);
  flex-shrink: 0;
}

.section-info { flex: 1; }

.section-name {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--dusk-text);
}

.section-key-tag {
  font-size: var(--text-xs);
  color: var(--dusk-text-faint);
  font-family: monospace;
  letter-spacing: var(--tracking-normal);
}

.reorder-btns {
  display: flex;
  gap: var(--space-1);
}

.reorder-btn {
  width: 28px;
  height: 28px;
  background: transparent;
  border: 1px solid var(--dusk-border-muted);
  border-radius: var(--radius-sm);
  color: var(--dusk-text-muted);
  cursor: pointer;
  font-size: var(--text-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--duration-fast) var(--ease-smooth);
}

.reorder-btn:hover:not(:disabled) {
  border-color: var(--dusk-primary);
  color: var(--dusk-primary);
}

.reorder-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

/* Toggle */
.toggle-btn {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  background: transparent;
  border: none;
  cursor: pointer;
}

.toggle-track {
  width: 36px;
  height: 20px;
  border-radius: var(--radius-full);
  background: var(--dusk-border);
  position: relative;
  transition: background var(--duration-base) var(--ease-smooth);
  display: block;
}

.toggle-btn.active .toggle-track {
  background: var(--dusk-primary);
}

.toggle-thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  border-radius: var(--radius-full);
  background: var(--dusk-bg);
  transition: transform var(--duration-base) var(--ease-smooth);
  display: block;
}

.toggle-btn.active .toggle-thumb {
  transform: translateX(16px);
}

.toggle-label {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  color: var(--dusk-text-muted);
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  min-width: 48px;
}

/* Summary */
.summary-card {
  background: var(--dusk-surface);
  border: 1px solid var(--dusk-border-muted);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
}

.summary-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-4);
}

.summary-title {
  font-size: var(--text-xs);
  letter-spacing: var(--tracking-widest);
  text-transform: uppercase;
  color: var(--dusk-text-faint);
}

.reset-btn {
  font-size: var(--text-xs);
  color: var(--dusk-text-muted);
  background: transparent;
  border: 1px solid var(--dusk-border-muted);
  border-radius: var(--radius-sm);
  padding: var(--space-1) var(--space-3);
  cursor: pointer;
  font-family: var(--font-body);
  transition: all var(--duration-fast) var(--ease-smooth);
}

.reset-btn:hover { color: var(--dusk-accent); border-color: var(--dusk-accent); }

.summary-flow {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.flow-section {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--dusk-text);
  background: var(--dusk-surface-alt);
  border: 1px solid var(--dusk-border);
  border-radius: var(--radius-sm);
  padding: var(--space-1) var(--space-3);
}

.flow-arrow {
  color: var(--dusk-text-faint);
  font-size: var(--text-sm);
}

.flow-empty {
  font-size: var(--text-sm);
  color: var(--dusk-text-faint);
  font-style: italic;
}
</style>
