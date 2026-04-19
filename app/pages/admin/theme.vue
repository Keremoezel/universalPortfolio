<template>
  <div class="theme-editor">
    <div class="editor-layout">
      <!-- Controls column -->
      <div class="editor-controls">

        <!-- Layout Styles (Moods) -->
        <div class="control-group">
          <h3 class="group-title">Layout Moods (BG/Surface)</h3>
          <div class="preset-grid">
            <button
              v-for="(colors, name) in LAYOUT_PRESETS"
              :key="name"
              class="preset-btn"
              :class="{ active: currentLayout === name }"
              :title="name.replace('_', ' ')"
              @click="applyLayout(name, colors)"
            >
              <div class="preset-swatch mood-swatch">
                <div class="swatch-bg" :style="{ background: colors.bg }" />
                <div class="swatch-surface" :style="{ background: colors.surface }" />
                <div class="swatch-border" :style="{ background: colors.border }" />
              </div>
              <span class="preset-name">{{ name.replace('_', ' ') }}</span>
            </button>
          </div>
        </div>

        <!-- Theme Presets (Primary/Accent) -->
        <div class="control-group">
          <h3 class="group-title">Brand Accents</h3>
          <div class="preset-grid">
            <button
              v-for="(colors, name) in THEME_PRESETS"
              :key="name"
              class="preset-btn"
              :class="{ active: currentPreset === name }"
              :title="name.replace('_', ' ')"
              @click="applyPreset(name, colors)"
            >
              <div class="preset-swatch">
                <div class="swatch-primary" :style="{ background: colors.primary }" />
                <div class="swatch-accent" :style="{ background: colors.accent }" />
              </div>
              <span class="preset-name">{{ name.split('_')[0] }}</span>
            </button>
          </div>
        </div>

        <!-- Colors -->
        <div class="control-group">
          <h3 class="group-title">Colors</h3>
          <div class="color-fields">
            <div
              v-for="(value, key) in localColors"
              :key="key"
              class="color-field"
            >
              <label :for="`color-${key}`" class="field-label">{{ key }}</label>
              <div class="color-input-row">
                <input
                  :id="`color-${key}`"
                  v-model="localColors[key]"
                  type="color"
                  class="color-picker"
                  @input="applyLive"
                />
                <input
                  v-model="localColors[key]"
                  type="text"
                  class="color-hex-input"
                  placeholder="#000000"
                  @change="applyLive"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Typography -->
        <div class="control-group">
          <h3 class="group-title">Typography</h3>

          <div class="control-field">
            <label class="field-label">Display Font</label>
            <select v-model="localTypo.fontDisplay" class="select-input" @change="applyLive">
              <option value="'Cormorant Garamond', Georgia, serif">Cormorant Garamond (Serif)</option>
              <option value="'DM Sans', sans-serif">DM Sans (Sans)</option>
              <option value="'Playfair Display', Georgia, serif">Playfair Display (Serif)</option>
              <option value="'Space Mono', monospace">Space Mono (Mono)</option>
            </select>
          </div>

          <div class="control-field">
            <label class="field-label">Body Font</label>
            <select v-model="localTypo.fontBody" class="select-input" @change="applyLive">
              <option value="'DM Sans', 'Helvetica Neue', sans-serif">DM Sans</option>
              <option value="'Inter', sans-serif">Inter</option>
              <option value="'Cormorant Garamond', serif">Cormorant Garamond</option>
              <option value="'Space Mono', monospace">Space Mono</option>
            </select>
          </div>

          <div class="control-field">
            <label class="field-label">Heading Weight</label>
            <select v-model="localTypo.headingWeight" class="select-input" @change="applyLive">
              <option value="300">Light (300)</option>
              <option value="400">Regular (400)</option>
              <option value="500">Medium (500)</option>
              <option value="600">Semibold (600)</option>
            </select>
          </div>
        </div>

        <!-- Radius -->
        <div class="control-group">
          <h3 class="group-title">Border Radius</h3>
          <div class="control-field">
            <label class="field-label">
              Radius — <code>{{ localRadius }}</code>
            </label>
            <input
              v-model="localRadius"
              type="range"
              min="0"
              max="24"
              step="2"
              class="range-input"
              @input="applyLive"
            />
            <div class="range-labels">
              <span>Sharp</span><span>Rounded</span>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="control-group control-actions">
          <button class="btn-apply" @click="applyTheme">Apply Theme</button>
          <button class="btn-reset" @click="resetTheme">Reset to Dusk</button>
          <button class="btn-export" @click="exportTheme">Export JSON</button>
        </div>

        <!-- Export output -->
        <div v-if="exportedJson" class="export-output">
          <div class="export-header">
            <span class="export-label">Theme JSON</span>
            <button class="copy-btn" @click="copyJson">
              {{ copied ? '✓ Copied' : 'Copy' }}
            </button>
          </div>
          <pre class="export-pre">{{ exportedJson }}</pre>
        </div>
      </div>

      <!-- Preview column -->
      <div class="editor-preview">
        <div class="preview-card">
          <div class="preview-badge">Preview</div>

          <!-- Mock hero -->
          <div class="preview-hero" :style="{ background: localColors.bg }">
            <div class="preview-tag" :style="{ color: localColors.primary }">Selected Work</div>
            <div
              class="preview-headline"
              :style="{ fontFamily: localTypo.fontDisplay, color: localColors.text, fontWeight: localTypo.headingWeight }"
            >
              Your Portfolio
            </div>
            <div class="preview-sub" :style="{ color: 'var(--dusk-text-muted)' }">
              Crafting experiences that endure.
            </div>

            <!-- Sample button -->
            <div
              class="preview-btn"
              :style="{ background: localColors.primary, color: localColors.bg, borderRadius: `${localRadius}px` }"
            >
              View Work
            </div>
          </div>

          <!-- Mock card -->
          <div class="preview-project-card" :style="{ background: localColors.surface, borderColor: localColors.border, borderRadius: `${Number(localRadius) * 2}px` }">
            <div class="preview-card-cat" :style="{ color: localColors.primary }">Design System</div>
            <div class="preview-card-title" :style="{ fontFamily: localTypo.fontDisplay, color: localColors.text }">
              Horizon Interface
            </div>
            <div class="preview-card-desc" :style="{ color: 'var(--dusk-text-muted)' }">
              A comprehensive design system built for scale.
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })

import { DUSK_DEFAULTS } from '~/stores/theme'

const themeStore = useThemeStore()

const LAYOUT_PRESETS = {
  Dusk_Original: { bg: "#120e08", surface: "#1e1610", border: "#3a2d1c", text: "#f2ede3" },
  Midnight:      { bg: "#0a0a0c", surface: "#141418", border: "#282830", text: "#e0e0e6" },
  Deep_Slate:    { bg: "#0f1115", surface: "#1a1d23", border: "#303640", text: "#eceef2" },
  Soft_Onyx:     { bg: "#050505", surface: "#121212", border: "#222222", text: "#f5f5f5" },
  Light_Studio:  { bg: "#f8f9fa", surface: "#ffffff", border: "#e9ecef", text: "#1a1a1b" },
  Nordic_Frost:  { bg: "#111418", surface: "#181c22", border: "#262c36", text: "#d1d9e0" },
  Kyoto_Ink:     { bg: "#0d0b14", surface: "#15121f", border: "#2a243d", text: "#e4e0f0" },
  Matcha_Moss:   { bg: "#0d0e0c", surface: "#141712", border: "#242b1f", text: "#e2e6df" },
  Ruby_Eclipse:  { bg: "#120a0a", surface: "#1c1111", border: "#361d1d", text: "#f0e4e4" },
  Concrete:      { bg: "#1a1a1c", surface: "#242427", border: "#3a3a40", text: "#eaeaec" }
}

const THEME_PRESETS = {
  amber_energy:    { primary: "#d4944a", accent: "#c4613a" },
  indigo_tech:     { primary: "#60a5fa", accent: "#4f46e5" },
  emerald_trust:   { primary: "#10b981", accent: "#059669" },
  rose_creative:   { primary: "#fb7185", accent: "#e11d48" },
  amethyst_luxury: { primary: "#a78bfa", accent: "#7c3aed" },
  teal_modern:     { primary: "#2dd4bf", accent: "#0d9488" },
  crimson_bold:    { primary: "#f87171", accent: "#b91c1c" },
  slate_minimal:   { primary: "#94a3b8", accent: "#475569" },
  cyan_cyber:      { primary: "#22d3ee", accent: "#0284c7" },
  gold_prestige:   { primary: "#fbbf24", accent: "#b45309" }
}

const localColors = reactive({ ...themeStore.activeTheme.colors })
const localTypo = reactive({ ...themeStore.activeTheme.typography })
const localRadius = ref(parseInt(themeStore.activeTheme.radius) || 4)
const currentPreset = ref<string | null>(null)
const currentLayout = ref<string | null>('Dusk_Original')

const exportedJson = ref('')
const copied = ref(false)

function applyLayout(name: string, colors: typeof LAYOUT_PRESETS.Dusk_Original) {
  currentLayout.value = name
  localColors.bg = colors.bg
  localColors.surface = colors.surface
  localColors.border = colors.border
  localColors.text = colors.text
  applyLive()
}

function applyPreset(name: string, colors: { primary: string, accent: string }) {
  currentPreset.value = name
  localColors.primary = colors.primary
  localColors.accent = colors.accent
  applyLive()
}

function applyLive() {
  if (import.meta.client) {
    const root = document.documentElement
    root.style.setProperty('--dusk-bg', localColors.bg)
    root.style.setProperty('--dusk-surface', localColors.surface)
    root.style.setProperty('--dusk-border', localColors.border)
    root.style.setProperty('--dusk-primary', localColors.primary)
    root.style.setProperty('--dusk-accent', localColors.accent)
    root.style.setProperty('--dusk-text', localColors.text)
    root.style.setProperty('--font-display', localTypo.fontDisplay)
    root.style.setProperty('--font-body', localTypo.fontBody)
    root.style.setProperty('--heading-weight', localTypo.headingWeight)
    root.style.setProperty('--radius-md', `${localRadius.value}px`)
  }
}

function applyTheme() {
  themeStore.applyTheme({
    colors: { ...localColors },
    typography: { ...localTypo },
    radius: `${localRadius.value}px`
  })
}

function resetTheme() {
  Object.assign(localColors, DUSK_DEFAULTS.colors)
  Object.assign(localTypo, DUSK_DEFAULTS.typography)
  localRadius.value = parseInt(DUSK_DEFAULTS.radius) || 4
  themeStore.resetToDefaults()
}

function exportTheme() {
  applyTheme()
  exportedJson.value = themeStore.exportTheme()
}

async function copyJson() {
  await navigator.clipboard.writeText(exportedJson.value)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}
</script>

<style scoped>
.theme-editor { }

.editor-layout {
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: var(--space-8);
  align-items: start;
}

.editor-controls {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

/* Control Groups */
.control-group {
  background: var(--dusk-surface);
  border: 1px solid var(--dusk-border-muted);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
}

.group-title {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: 400;
  color: var(--dusk-text);
  letter-spacing: var(--tracking-normal);
  margin-bottom: var(--space-4);
  padding-bottom: var(--space-3);
  border-bottom: 1px solid var(--dusk-border-muted);
}

/* Presets */
.preset-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(64px, 1fr));
  gap: var(--space-2);
}

.preset-btn {
  background: var(--dusk-bg);
  border: 1px solid var(--dusk-border-muted);
  border-radius: var(--radius-md);
  padding: var(--space-2);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  transition: all var(--duration-fast) var(--ease-smooth);
}

.preset-btn:hover {
  border-color: var(--dusk-primary);
  background: var(--dusk-surface-alt);
}

.preset-btn.active {
  border-color: var(--dusk-primary);
  background: var(--dusk-primary-glow);
}

.preset-swatch {
  display: flex;
  width: 100%;
  height: 24px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.05);
}

.mood-swatch {
  flex-direction: column;
}

.swatch-bg { flex: 1; width: 100%; }
.swatch-surface { 
  flex: 0.7; 
  width: 75%; 
  margin-inline: auto; 
  height: 14px; 
  margin-top: -8px; 
  border: 1px solid var(--dusk-border); 
  border-bottom: none; 
  border-radius: 2px 2px 0 0; 
  box-shadow: 0 -2px 10px rgba(0,0,0,0.3);
}
.swatch-border { height: 2px; width: 100%; background: var(--dusk-border); opacity: 0.5; }

.swatch-primary { flex: 1; }
.swatch-accent { flex: 0.4; }

.preset-name {
  font-size: 8px;
  text-transform: uppercase;
  color: var(--dusk-text-muted);
  letter-spacing: 0.1em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  text-align: center;
}

.color-fields {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.color-field { display: flex; flex-direction: column; gap: var(--space-1); }

.field-label {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  letter-spacing: var(--tracking-widest);
  text-transform: uppercase;
  color: var(--dusk-text-muted);
}

.field-label code {
  font-size: var(--text-xs);
  color: var(--dusk-primary);
  font-family: monospace;
}

.color-input-row {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.color-picker {
  width: 40px;
  height: 32px;
  border: 1px solid var(--dusk-border-muted);
  border-radius: var(--radius-sm);
  background: transparent;
  cursor: pointer;
  padding: 2px;
}

.color-hex-input {
  flex: 1;
  background: var(--dusk-bg);
  border: 1px solid var(--dusk-border-muted);
  border-radius: var(--radius-sm);
  color: var(--dusk-text);
  font-family: monospace;
  font-size: var(--text-sm);
  padding: var(--space-1) var(--space-3);
  outline: none;
  transition: border-color var(--duration-fast) var(--ease-smooth);
}

.color-hex-input:focus { border-color: var(--dusk-primary); }

.control-field { display: flex; flex-direction: column; gap: var(--space-2); margin-bottom: var(--space-4); }
.control-field:last-child { margin-bottom: 0; }

.select-input {
  width: 100%;
  background: var(--dusk-bg);
  border: 1px solid var(--dusk-border-muted);
  border-radius: var(--radius-sm);
  color: var(--dusk-text);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  padding: var(--space-2) var(--space-3);
  outline: none;
  cursor: pointer;
}

.range-input {
  width: 100%;
  accent-color: var(--dusk-primary);
}

.range-labels {
  display: flex;
  justify-content: space-between;
  font-size: var(--text-xs);
  color: var(--dusk-text-faint);
  margin-top: var(--space-1);
}

/* Action buttons */
.control-actions { display: flex; flex-direction: column; gap: var(--space-2); }

.btn-apply {
  padding: var(--space-3) var(--space-4);
  background: var(--dusk-primary);
  color: var(--dusk-bg);
  border: none;
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 500;
  cursor: pointer;
  transition: background var(--duration-fast) var(--ease-smooth);
}

.btn-apply:hover { background: var(--dusk-primary-dark); }

.btn-reset, .btn-export {
  padding: var(--space-3) var(--space-4);
  background: transparent;
  border: 1px solid var(--dusk-border-muted);
  border-radius: var(--radius-md);
  color: var(--dusk-text-secondary);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-smooth);
}

.btn-reset:hover, .btn-export:hover {
  border-color: var(--dusk-primary);
  color: var(--dusk-primary);
}

/* Export */
.export-output {
  background: var(--dusk-bg-deep);
  border: 1px solid var(--dusk-border-muted);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.export-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--dusk-border-muted);
}

.export-label {
  font-size: var(--text-xs);
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  color: var(--dusk-text-faint);
}

.copy-btn {
  font-size: var(--text-xs);
  color: var(--dusk-primary);
  background: transparent;
  border: none;
  cursor: pointer;
  font-family: var(--font-body);
  letter-spacing: var(--tracking-wide);
}

.export-pre {
  padding: var(--space-4);
  font-family: monospace;
  font-size: 11px;
  color: var(--dusk-text-secondary);
  max-height: 200px;
  overflow-y: auto;
  white-space: pre-wrap;
  word-break: break-all;
}

/* Live preview */
.editor-preview { position: sticky; top: calc(var(--nav-height) + var(--space-8)); }

.preview-card {
  background: var(--dusk-surface);
  border: 1px solid var(--dusk-border-muted);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.preview-badge {
  font-size: var(--text-xs);
  letter-spacing: var(--tracking-widest);
  text-transform: uppercase;
  color: var(--dusk-text-faint);
  padding: var(--space-3) var(--space-5);
  border-bottom: 1px solid var(--dusk-border-muted);
}

.preview-hero {
  padding: var(--space-8) var(--space-6) var(--space-6);
  transition: background var(--duration-slow) var(--ease-smooth);
}

.preview-tag {
  font-size: 10px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  margin-bottom: var(--space-3);
  transition: color var(--duration-slow) var(--ease-smooth);
}

.preview-headline {
  font-size: var(--text-3xl);
  font-weight: 300;
  letter-spacing: -0.02em;
  line-height: 1.2;
  margin-bottom: var(--space-3);
  transition: all var(--duration-slow) var(--ease-smooth);
}

.preview-sub {
  font-size: var(--text-sm);
  margin-bottom: var(--space-5);
  line-height: 1.6;
  transition: color var(--duration-slow) var(--ease-smooth);
}

.preview-btn {
  display: inline-block;
  padding: var(--space-2) var(--space-5);
  font-size: var(--text-xs);
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  transition: all var(--duration-slow) var(--ease-smooth);
}

.preview-project-card {
  margin: var(--space-4) var(--space-5) var(--space-5);
  padding: var(--space-4);
  border: 1px solid;
  transition: all var(--duration-slow) var(--ease-smooth);
}

.preview-card-cat {
  font-size: 10px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  margin-bottom: var(--space-1);
  transition: color var(--duration-slow) var(--ease-smooth);
}

.preview-card-title {
  font-size: var(--text-xl);
  font-weight: 300;
  letter-spacing: -0.02em;
  margin-bottom: var(--space-2);
  transition: all var(--duration-slow) var(--ease-smooth);
}

.preview-card-desc {
  font-size: var(--text-xs);
  line-height: 1.6;
  transition: color var(--duration-slow) var(--ease-smooth);
}

@media (max-width: 1100px) {
  .editor-layout { grid-template-columns: 1fr; }
  .editor-preview { position: static; }
}
</style>
