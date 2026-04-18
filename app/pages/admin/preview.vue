<template>
  <div class="preview-page">
    <!-- Device selector -->
    <div class="device-bar">
      <div class="device-tabs">
        <button
          v-for="device in devices"
          :key="device.key"
          class="device-tab"
          :class="{ active: activeDevice === device.key }"
          @click="activeDevice = device.key"
        >
          <span class="device-icon">{{ device.icon }}</span>
          {{ device.label }}
        </button>
      </div>
      <a :href="previewUrl" target="_blank" class="open-btn">Open in new tab ↗</a>
    </div>

    <!-- Iframe shell -->
    <div class="preview-shell" :class="`device-${activeDevice}`">
      <div class="device-frame">
        <div v-if="activeDevice !== 'desktop'" class="frame-notch" />
        <iframe
          v-if="previewUrl"
          ref="previewFrame"
          :src="previewUrl"
          class="preview-frame"
          title="Portfolio Preview"
          @load="onFrameLoad"
        />
        <div v-else class="preview-loading">
          <span>Loading preview…</span>
        </div>
      </div>
    </div>

    <!-- Sync info -->
    <div class="sync-bar">
      <span class="sync-indicator">
        <span class="sync-dot" />
        Live sync active — changes in admin reflect on reload
      </span>
      <button class="reload-btn" @click="reloadFrame">↺ Reload Preview</button>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const previewFrame = ref<HTMLIFrameElement | null>(null)
const activeDevice = ref<'desktop' | 'tablet' | 'mobile'>('desktop')
const { siteUsername, loadSite } = useSiteSync()

const previewUrl = computed(() => siteUsername.value ? `/${siteUsername.value}` : null)

// Watch so iframe navigates once username resolves
watch(previewUrl, (url) => {
  if (url && previewFrame.value && previewFrame.value.src !== window.location.origin + url) {
    previewFrame.value.src = url
  }
})

onMounted(async () => {
  if (!siteUsername.value) {
    await loadSite()
  }
})

const devices = [
  { key: 'desktop', label: 'Desktop', icon: '▭' },
  { key: 'tablet', label: 'Tablet', icon: '▯' },
  { key: 'mobile', label: 'Mobile', icon: '▮' }
] as const

function onFrameLoad() {
  // Frame loaded — could inject CSS variables here if needed
}

function reloadFrame() {
  if (previewFrame.value) {
    previewFrame.value.src = previewFrame.value.src
  }
}
</script>

<style scoped>
.preview-page {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  height: calc(100vh - var(--nav-height) - var(--space-16));
}

.device-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--dusk-surface);
  border: 1px solid var(--dusk-border-muted);
  border-radius: var(--radius-lg);
  padding: var(--space-2) var(--space-3);
}

.device-tabs {
  display: flex;
  gap: var(--space-1);
}

.device-tab {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  font-family: var(--font-body);
  font-size: var(--text-xs);
  color: var(--dusk-text-muted);
  background: transparent;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-smooth);
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
}

.device-tab.active {
  background: var(--dusk-surface-alt);
  color: var(--dusk-primary);
}

.device-icon { font-size: 10px; }

.open-btn {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  color: var(--dusk-text-muted);
  text-decoration: none;
  padding: var(--space-2) var(--space-4);
  border: 1px solid var(--dusk-border-muted);
  border-radius: var(--radius-sm);
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  transition: all var(--duration-fast) var(--ease-smooth);
}

.open-btn:hover { color: var(--dusk-primary); border-color: var(--dusk-primary); }

/* Preview shell */
.preview-shell {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  background: var(--dusk-bg-deep);
  border: 1px solid var(--dusk-border-muted);
  border-radius: var(--radius-lg);
  overflow: hidden;
  padding: var(--space-6);
  transition: all var(--duration-slow) var(--ease-smooth);
}

.device-frame {
  width: 100%;
  height: 100%;
  position: relative;
  background: var(--dusk-bg);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
  transition: all var(--duration-slow) var(--ease-smooth);
}

.preview-shell.device-tablet .device-frame {
  max-width: 768px;
  border-radius: 20px;
  box-shadow: 0 0 0 8px var(--dusk-surface), var(--shadow-lg);
}

.preview-shell.device-mobile .device-frame {
  max-width: 390px;
  border-radius: 40px;
  box-shadow: 0 0 0 10px var(--dusk-surface-alt), 0 0 0 12px var(--dusk-border), var(--shadow-lg);
}

.frame-notch {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 20px;
  background: var(--dusk-surface);
  border-radius: 10px;
  z-index: 10;
}

.preview-frame {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
  min-height: 500px;
}

/* Sync bar */
.sync-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-3) var(--space-4);
  background: var(--dusk-surface);
  border: 1px solid var(--dusk-border-muted);
  border-radius: var(--radius-lg);
}

.sync-indicator {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-xs);
  color: var(--dusk-text-muted);
  letter-spacing: var(--tracking-normal);
}

.sync-dot {
  width: 6px;
  height: 6px;
  background: var(--dusk-primary);
  border-radius: var(--radius-full);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.reload-btn {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  color: var(--dusk-text-muted);
  background: transparent;
  border: 1px solid var(--dusk-border-muted);
  border-radius: var(--radius-sm);
  padding: var(--space-1) var(--space-4);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-smooth);
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
}

.reload-btn:hover { color: var(--dusk-primary); border-color: var(--dusk-primary); }

.preview-loading {
  width: 100%;
  height: 100%;
  min-height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--dusk-text-faint);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  letter-spacing: var(--tracking-widest);
  text-transform: uppercase;
}
</style>
