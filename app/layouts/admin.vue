<template>
  <div class="admin-shell">
    <!-- Sidebar -->
    <aside class="admin-sidebar">
      <div class="sidebar-header">
        <div class="sidebar-logo">
          <span class="sidebar-logo-icon">◈</span>
          <span class="sidebar-logo-text">Studio</span>
        </div>
        <NuxtLink to="/" class="sidebar-preview-btn" title="View live portfolio" target="_blank">
          ↗
        </NuxtLink>
      </div>

      <nav class="sidebar-nav">
        <div class="sidebar-nav-group">
          <span class="sidebar-nav-label">Control</span>
          <NuxtLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="sidebar-nav-link"
            :class="{ active: route.path === link.to }"
          >
            <span class="nav-icon">{{ link.icon }}</span>
            <span>{{ link.label }}</span>
          </NuxtLink>
        </div>
      </nav>

      <div class="sidebar-footer">
        <div v-if="user" class="sidebar-user">
          <span class="sidebar-user-email">{{ user.email }}</span>
        </div>
        <div class="sidebar-footer-info">
          <span class="sidebar-footer-label">System</span>
          <span class="sidebar-footer-value">Dusk v1.0</span>
        </div>
        <div class="sidebar-footer-btns">
          <button class="sidebar-reset-btn" @click="handleReset">Reset All</button>
          <button class="sidebar-logout-btn" @click="handleLogout">Sign out</button>
        </div>
      </div>
    </aside>

    <!-- Main panel -->
    <main class="admin-main">
      <!-- Topbar -->
      <header class="admin-topbar">
        <div class="topbar-title">
          <h1 class="topbar-heading">{{ currentPageTitle }}</h1>
        </div>
        <div class="topbar-actions">
          <span v-if="saveError" class="topbar-save-error">{{ saveError }}</span>
          <button
            class="topbar-save-btn"
            :class="{ saving: isSaving }"
            :disabled="isSaving"
            @click="handleSave"
          >
            <span v-if="isSaving" class="save-spinner" />
            <span v-else>Save changes</span>
          </button>
          <NuxtLink
            v-if="siteUsername"
            :to="`/${siteUsername}`"
            target="_blank"
            class="topbar-live-btn"
          >
            <span class="live-dot" />
            Live Preview
          </NuxtLink>
        </div>
      </header>

      <!-- Page content -->
      <div class="admin-content">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const themeStore      = useThemeStore()
const componentsStore = useComponentsStore()

const supabase = useSupabaseClient()
const user     = useSupabaseUser()

const { loadSite, saveSite, isSaving, saveError, siteUsername } = useSiteSync()

onMounted(() => { loadSite() })

async function handleSave() {
  try {
    await saveSite()
  } catch {
    // saveError is already set inside useSiteSync
  }
}

async function handleLogout() {
  await supabase.auth.signOut()
  await navigateTo('/login')
}

const navLinks = [
  { to: '/admin',            label: 'Dashboard',   icon: '⬡' },
  { to: '/admin/theme',      label: 'Theme Editor', icon: '◐' },
  { to: '/admin/components', label: 'Components',   icon: '⊞' },
  { to: '/admin/content',    label: 'Content',      icon: '✦' },
  { to: '/admin/ai-prompt',  label: 'AI Prompt',    icon: '⟡' },
  { to: '/admin/preview',    label: 'Live Preview', icon: '◻' },
  { to: '/admin/invites',    label: 'Invites',      icon: '⊕' },
  { to: '/admin/users',      label: 'Users',        icon: '◉' }
]

const currentPageTitle = computed(() => {
  const link = navLinks.find(l => l.to === route.path)
  return link?.label ?? 'Admin'
})

function handleReset() {
  if (confirm('Reset all theme, content and component settings to defaults?')) {
    themeStore.resetToDefaults()
    componentsStore.resetToDefaults()
  }
}
</script>

<style scoped>
.admin-shell {
  display: flex;
  min-height: 100vh;
  background-color: var(--dusk-bg-deep);
  color: var(--dusk-text);
  font-family: var(--font-body);
}

/* ── Sidebar ── */
.admin-sidebar {
  width: var(--sidebar-width);
  min-height: 100vh;
  background-color: var(--dusk-bg);
  border-right: 1px solid var(--dusk-border-muted);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-6);
  border-bottom: 1px solid var(--dusk-border-muted);
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.sidebar-logo-icon {
  font-size: var(--text-lg);
  color: var(--dusk-primary);
}

.sidebar-logo-text {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: 400;
  color: var(--dusk-text);
  letter-spacing: var(--tracking-normal);
}

.sidebar-preview-btn {
  font-size: var(--text-sm);
  color: var(--dusk-text-muted);
  text-decoration: none;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--dusk-border-muted);
  border-radius: var(--radius-sm);
  transition: all var(--duration-fast) var(--ease-smooth);
}

.sidebar-preview-btn:hover {
  color: var(--dusk-primary);
  border-color: var(--dusk-primary);
}

.sidebar-nav {
  flex: 1;
  padding: var(--space-6) var(--space-4);
}

.sidebar-nav-group { margin-bottom: var(--space-6); }

.sidebar-nav-label {
  font-size: var(--text-xs);
  letter-spacing: var(--tracking-widest);
  text-transform: uppercase;
  color: var(--dusk-text-faint);
  display: block;
  padding: 0 var(--space-2);
  margin-bottom: var(--space-2);
}

.sidebar-nav-link {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  color: var(--dusk-text-secondary);
  text-decoration: none;
  transition: all var(--duration-fast) var(--ease-smooth);
  margin-bottom: var(--space-1);
}

.sidebar-nav-link:hover {
  background: var(--dusk-surface);
  color: var(--dusk-text);
}

.sidebar-nav-link.active {
  background: var(--dusk-surface-alt);
  color: var(--dusk-primary);
}

.nav-icon {
  font-size: var(--text-base);
  width: 20px;
  text-align: center;
}

.sidebar-footer {
  padding: var(--space-5) var(--space-5);
  border-top: 1px solid var(--dusk-border-muted);
}

.sidebar-footer-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-3);
}

.sidebar-footer-label {
  font-size: var(--text-xs);
  letter-spacing: var(--tracking-widest);
  text-transform: uppercase;
  color: var(--dusk-text-faint);
}

.sidebar-footer-value {
  font-size: var(--text-xs);
  color: var(--dusk-text-muted);
}

.sidebar-user {
  padding: var(--space-3) 0;
  margin-bottom: var(--space-2);
  border-bottom: 1px solid var(--dusk-border-muted);
}

.sidebar-user-email {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  color: var(--dusk-text-faint);
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sidebar-footer-btns {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.sidebar-logout-btn {
  width: 100%;
  padding: var(--space-2) var(--space-3);
  font-size: var(--text-xs);
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  color: var(--dusk-text-faint);
  background: transparent;
  border: 1px solid var(--dusk-border-muted);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-smooth);
  font-family: var(--font-body);
}

.sidebar-logout-btn:hover {
  color: var(--dusk-text-muted);
  border-color: var(--dusk-border);
}

.sidebar-reset-btn {
  width: 100%;
  padding: var(--space-2) var(--space-3);
  font-size: var(--text-xs);
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  color: var(--dusk-text-faint);
  background: transparent;
  border: 1px solid var(--dusk-border-muted);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-smooth);
  font-family: var(--font-body);
}

.sidebar-reset-btn:hover {
  color: var(--dusk-accent);
  border-color: var(--dusk-accent);
}

/* ── Main panel ── */
.admin-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.admin-topbar {
  height: var(--nav-height);
  border-bottom: 1px solid var(--dusk-border-muted);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-inline: var(--space-8);
  background-color: var(--dusk-bg);
  position: sticky;
  top: 0;
  z-index: 50;
}

.topbar-heading {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: 400;
  color: var(--dusk-text);
  letter-spacing: var(--tracking-normal);
}

.topbar-save-error {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  color: #e07070;
}

.topbar-save-btn {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-5);
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 500;
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  color: var(--dusk-bg-deep);
  background: var(--dusk-primary);
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background var(--duration-fast) var(--ease-smooth);
}

.topbar-save-btn:hover:not(:disabled) { background: var(--dusk-primary-dark); }
.topbar-save-btn:disabled { opacity: 0.6; cursor: not-allowed; }

.save-spinner {
  width: 12px;
  height: 12px;
  border: 2px solid rgba(0,0,0,0.15);
  border-top-color: var(--dusk-bg-deep);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.topbar-live-btn {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 500;
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  color: var(--dusk-text-secondary);
  text-decoration: none;
  border: 1px solid var(--dusk-border-muted);
  border-radius: var(--radius-full);
  transition: all var(--duration-fast) var(--ease-smooth);
}

.topbar-live-btn:hover {
  color: var(--dusk-primary);
  border-color: var(--dusk-primary);
}

.live-dot {
  width: 6px;
  height: 6px;
  background: var(--dusk-primary);
  border-radius: var(--radius-full);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.admin-content {
  flex: 1;
  padding: var(--space-8);
  overflow-y: auto;
}
</style>
