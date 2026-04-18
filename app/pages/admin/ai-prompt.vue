<template>
  <div class="ai-prompt-page">
    <div class="ai-intro">
      <p class="ai-desc">
        Describe the theme you want in plain language. The AI will generate a structured JSON config that you can apply directly to your portfolio.
      </p>
      <div class="ai-examples">
        <span class="examples-label">Try:</span>
        <button
          v-for="example in examplePrompts"
          :key="example"
          class="example-chip"
          @click="promptText = example"
        >{{ example }}</button>
      </div>
    </div>

    <!-- Prompt input -->
    <div class="prompt-area">
      <div class="prompt-header">
        <span class="prompt-label">Your Prompt</span>
        <span class="char-count" :class="{ warning: promptText.length > 400 }">
          {{ promptText.length }} / 500
        </span>
      </div>
      <textarea
        v-model="promptText"
        class="prompt-textarea"
        rows="5"
        placeholder="e.g. A dark, moody color scheme inspired by jazz clubs in 1960s Paris. Deep blacks, muted gold, and worn paper textures. Very minimal, elegant typography..."
        maxlength="500"
      />
      <button class="generate-btn" :disabled="!promptText.trim() || isGenerating" @click="generateTheme">
        <span v-if="isGenerating" class="generating-spinner" />
        {{ isGenerating ? 'Generating...' : '⟡ Generate Theme' }}
      </button>
    </div>

    <!-- Output -->
    <div v-if="generatedTheme" class="output-area">
      <div class="output-header">
        <span class="output-label">Generated Theme</span>
        <div class="output-actions">
          <button class="output-btn" @click="applyGenerated">Apply Theme</button>
          <button class="output-btn secondary" @click="copyGenerated">
            {{ copied ? '✓ Copied' : 'Copy JSON' }}
          </button>
        </div>
      </div>

      <!-- Color preview -->
      <div v-if="parsedColors" class="color-preview">
        <div
          v-for="(value, key) in parsedColors"
          :key="key"
          class="color-preview-chip"
        >
          <div class="cp-swatch" :style="{ background: value }" />
          <span class="cp-key">{{ key }}</span>
        </div>
      </div>

      <pre class="output-pre">{{ generatedTheme }}</pre>
    </div>

    <!-- History -->
    <div v-if="history.length > 0" class="history-area">
      <h3 class="history-title">Generation History</h3>
      <div class="history-list">
        <div
          v-for="(item, i) in history"
          :key="i"
          class="history-item"
          @click="loadHistory(item)"
        >
          <div class="history-prompt">{{ item.prompt }}</div>
          <div class="history-colors">
            <span
              v-for="color in item.colors"
              :key="color"
              class="history-swatch"
              :style="{ background: color }"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const themeStore = useThemeStore()

const promptText = ref('')
const isGenerating = ref(false)
const generatedTheme = ref('')
const copied = ref(false)
const parsedColors = ref<Record<string, string> | null>(null)

const history = ref<{ prompt: string; json: string; colors: string[] }[]>([])

const examplePrompts = [
  'Warm jazz club in 1960s Paris',
  'Cold Nordic minimal, ice and stone',
  'Lush botanical garden, deep greens and terracotta',
  'Futuristic Tokyo neon, dark with vibrant accents',
  'Desert at golden hour, warm sands and indigo sky'
]

async function generateTheme() {
  if (!promptText.value.trim()) return
  isGenerating.value = true
  generatedTheme.value = ''
  parsedColors.value = null

  // Simulate AI generation with a themed JSON based on keywords
  await new Promise(r => setTimeout(r, 1200))

  const generated = generateThemeFromPrompt(promptText.value)
  generatedTheme.value = JSON.stringify(generated, null, 2)

  try {
    parsedColors.value = generated.theme.colors
    history.value.unshift({
      prompt: promptText.value,
      json: generatedTheme.value,
      colors: Object.values(generated.theme.colors)
    })
    if (history.value.length > 5) history.value.pop()
  }
  catch {}

  isGenerating.value = false
}

// Simple keyword-driven theme generation
function generateThemeFromPrompt(prompt: string) {
  const p = prompt.toLowerCase()

  let colors = {
    bg: '#120e08',
    surface: '#1e1610',
    border: '#3a2d1c',
    primary: '#d4944a',
    accent: '#c4613a',
    text: '#f2ede3',
    muted: '#8a7d6b'
  }

  if (p.includes('nordic') || p.includes('ice') || p.includes('cold') || p.includes('minimal')) {
    colors = { bg: '#0e0f12', surface: '#17191f', border: '#2a2d38', primary: '#a8b4cc', accent: '#6b89b4', text: '#e8ecf2', muted: '#7a8498' }
  }
  else if (p.includes('neon') || p.includes('tokyo') || p.includes('futuristic') || p.includes('cyber')) {
    colors = { bg: '#080810', surface: '#0f0f1e', border: '#1e1e3a', primary: '#7c5df5', accent: '#e040fb', text: '#e8e0ff', muted: '#7070a0' }
  }
  else if (p.includes('green') || p.includes('botanical') || p.includes('nature') || p.includes('garden')) {
    colors = { bg: '#080e0a', surface: '#10180c', border: '#1e3020', primary: '#5a9a60', accent: '#c4613a', text: '#e8f0e4', muted: '#6a8870' }
  }
  else if (p.includes('desert') || p.includes('golden') || p.includes('sand')) {
    colors = { bg: '#100c06', surface: '#1c1508', border: '#38280e', primary: '#e8a83a', accent: '#4060b0', text: '#f4ead8', muted: '#9a8860' }
  }
  else if (p.includes('jazz') || p.includes('paris') || p.includes('noir') || p.includes('moody')) {
    colors = { bg: '#09080a', surface: '#141218', border: '#28222e', primary: '#b89860', accent: '#8060a0', text: '#ede8f0', muted: '#7a7080' }
  }

  return {
    theme: {
      colors,
      radius: '4px',
      spacing: '1rem',
      typography: {
        fontDisplay: "'Cormorant Garamond', Georgia, serif",
        fontBody: "'DM Sans', sans-serif",
        baseFontSize: '16px',
        headingWeight: '300'
      }
    },
    components: {
      button: { variant: 'solid' },
      card: { variant: 'elevated' }
    }
  }
}

function applyGenerated() {
  try {
    const parsed = JSON.parse(generatedTheme.value)
    if (parsed?.theme) {
      themeStore.applyTheme(parsed.theme)
    }
  }
  catch (e) {
    console.error('Invalid theme JSON', e)
  }
}

async function copyGenerated() {
  await navigator.clipboard.writeText(generatedTheme.value)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}

function loadHistory(item: { prompt: string; json: string; colors: string[] }) {
  promptText.value = item.prompt
  generatedTheme.value = item.json
  try {
    parsedColors.value = JSON.parse(item.json).theme.colors
  }
  catch {}
}
</script>

<style scoped>
.ai-prompt-page { display: flex; flex-direction: column; gap: var(--space-6); }

.ai-desc {
  font-size: var(--text-sm);
  color: var(--dusk-text-muted);
  line-height: var(--leading-relaxed);
  margin-bottom: var(--space-4);
}

.ai-examples {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.examples-label {
  font-size: var(--text-xs);
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  color: var(--dusk-text-faint);
  margin-right: var(--space-1);
}

.example-chip {
  font-size: var(--text-xs);
  color: var(--dusk-text-secondary);
  background: var(--dusk-surface);
  border: 1px solid var(--dusk-border-muted);
  border-radius: var(--radius-full);
  padding: var(--space-1) var(--space-4);
  cursor: pointer;
  font-family: var(--font-body);
  transition: all var(--duration-fast) var(--ease-smooth);
}

.example-chip:hover { border-color: var(--dusk-primary); color: var(--dusk-primary); }

/* Prompt */
.prompt-area {
  background: var(--dusk-surface);
  border: 1px solid var(--dusk-border-muted);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.prompt-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.prompt-label {
  font-size: var(--text-xs);
  letter-spacing: var(--tracking-widest);
  text-transform: uppercase;
  color: var(--dusk-text-faint);
}

.char-count {
  font-size: var(--text-xs);
  color: var(--dusk-text-faint);
  font-variant-numeric: tabular-nums;
}

.char-count.warning { color: var(--dusk-accent); }

.prompt-textarea {
  width: 100%;
  background: var(--dusk-bg);
  border: 1px solid var(--dusk-border-muted);
  border-radius: var(--radius-md);
  color: var(--dusk-text);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  padding: var(--space-3) var(--space-4);
  outline: none;
  resize: vertical;
  line-height: var(--leading-relaxed);
  transition: border-color var(--duration-fast) var(--ease-smooth);
}

.prompt-textarea:focus { border-color: var(--dusk-primary); }
.prompt-textarea::placeholder { color: var(--dusk-text-faint); }

.generate-btn {
  align-self: flex-start;
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-6);
  background: var(--dusk-primary);
  color: var(--dusk-bg);
  border: none;
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-smooth);
}

.generate-btn:hover:not(:disabled) { background: var(--dusk-primary-dark); }
.generate-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.generating-spinner {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid rgba(0,0,0,0.3);
  border-top-color: var(--dusk-bg);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* Output */
.output-area {
  background: var(--dusk-surface);
  border: 1px solid var(--dusk-border-muted);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.output-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4) var(--space-5);
  border-bottom: 1px solid var(--dusk-border-muted);
}

.output-label {
  font-size: var(--text-xs);
  letter-spacing: var(--tracking-widest);
  text-transform: uppercase;
  color: var(--dusk-text-faint);
}

.output-actions { display: flex; gap: var(--space-2); }

.output-btn {
  padding: var(--space-1) var(--space-4);
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 500;
  cursor: pointer;
  border-radius: var(--radius-sm);
  transition: all var(--duration-fast) var(--ease-smooth);
}

.output-btn:not(.secondary) {
  background: var(--dusk-primary);
  color: var(--dusk-bg);
  border: none;
}

.output-btn:not(.secondary):hover { background: var(--dusk-primary-dark); }

.output-btn.secondary {
  background: transparent;
  border: 1px solid var(--dusk-border-muted);
  color: var(--dusk-text-muted);
}

.output-btn.secondary:hover { border-color: var(--dusk-primary); color: var(--dusk-primary); }

.color-preview {
  display: flex;
  gap: var(--space-3);
  padding: var(--space-4) var(--space-5);
  flex-wrap: wrap;
  border-bottom: 1px solid var(--dusk-border-muted);
}

.color-preview-chip {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
}

.cp-swatch {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--dusk-border-muted);
}

.cp-key {
  font-size: 10px;
  color: var(--dusk-text-faint);
  letter-spacing: var(--tracking-normal);
}

.output-pre {
  padding: var(--space-5);
  font-family: monospace;
  font-size: 11px;
  color: var(--dusk-text-secondary);
  white-space: pre-wrap;
  max-height: 280px;
  overflow-y: auto;
}

/* History */
.history-title {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: 400;
  color: var(--dusk-text);
  letter-spacing: var(--tracking-tight);
  margin-bottom: var(--space-3);
}

.history-list { display: flex; flex-direction: column; gap: var(--space-2); }

.history-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  padding: var(--space-3) var(--space-4);
  background: var(--dusk-surface);
  border: 1px solid var(--dusk-border-muted);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: border-color var(--duration-fast) var(--ease-smooth);
}

.history-item:hover { border-color: var(--dusk-primary); }

.history-prompt {
  font-size: var(--text-sm);
  color: var(--dusk-text-muted);
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.history-colors { display: flex; gap: var(--space-1); flex-shrink: 0; }

.history-swatch {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 2px;
}
</style>
