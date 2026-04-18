<template>
  <div class="auth-page">
    <div class="auth-grain" aria-hidden="true" />
    <div class="auth-atmosphere" aria-hidden="true" />

    <div class="auth-card">
      <div class="auth-logo">
        <span class="auth-logo-icon">◈</span>
        <span class="auth-logo-text">Studio</span>
      </div>

      <h1 class="auth-heading">Sign in</h1>
      <p class="auth-subheading">Access your portfolio dashboard.</p>

      <form class="auth-form" @submit.prevent="handleLogin">
        <div class="auth-field">
          <label class="auth-label" for="email">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            class="auth-input"
            autocomplete="email"
            required
            placeholder="you@example.com"
          />
        </div>

        <div class="auth-field">
          <label class="auth-label" for="password">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            class="auth-input"
            autocomplete="current-password"
            required
            placeholder="••••••••"
          />
        </div>

        <p v-if="error" class="auth-error">{{ error }}</p>

        <button type="submit" class="auth-btn" :disabled="loading">
          <span v-if="loading" class="auth-btn-spinner" />
          <span v-else>Sign in →</span>
        </button>
      </form>

      <p class="auth-footer">
        Have an invite?
        <NuxtLink to="/signup" class="auth-link">Create account →</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

useSeoMeta({ title: 'Sign in — Studio' })

const supabase = useSupabaseClient()
const email    = ref('')
const password = ref('')
const error    = ref('')
const loading  = ref(false)

async function handleLogin() {
  loading.value = true
  error.value   = ''
  try {
    const { error: err } = await supabase.auth.signInWithPassword({
      email:    email.value,
      password: password.value
    })
    if (err) {
      error.value = err.message
      return
    }
    await navigateTo('/admin')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  background-color: var(--dusk-bg-deep);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.auth-grain {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  opacity: 0.10;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23noise)'/%3E%3C/svg%3E");
  background-size: 180px 180px;
  mix-blend-mode: overlay;
}

.auth-atmosphere {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background:
    radial-gradient(ellipse 70% 60% at 60% 30%, color-mix(in srgb, var(--dusk-primary) 8%, transparent) 0%, transparent 70%),
    radial-gradient(ellipse 50% 40% at 30% 80%, color-mix(in srgb, var(--dusk-accent) 6%, transparent) 0%, transparent 60%);
}

.auth-card {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 400px;
  padding: var(--space-10) var(--space-10);
  background: var(--dusk-surface);
  border: 1px solid var(--dusk-border-muted);
  border-radius: var(--radius-md);
}

.auth-logo {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-8);
}

.auth-logo-icon {
  font-size: var(--text-xl);
  color: var(--dusk-primary);
}

.auth-logo-text {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: 400;
  color: var(--dusk-text);
}

.auth-heading {
  font-family: var(--font-display);
  font-size: clamp(2rem, 4vw, 2.8rem);
  font-weight: 300;
  letter-spacing: -0.03em;
  color: var(--dusk-text);
  line-height: 1;
  margin-bottom: var(--space-2);
}

.auth-subheading {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--dusk-text-muted);
  margin-bottom: var(--space-8);
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.auth-field {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.auth-label {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 500;
  letter-spacing: var(--tracking-widest);
  text-transform: uppercase;
  color: var(--dusk-text-faint);
}

.auth-input {
  background: var(--dusk-bg);
  border: 1px solid var(--dusk-border-muted);
  border-radius: var(--radius-sm);
  padding: var(--space-3) var(--space-4);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--dusk-text);
  outline: none;
  transition: border-color var(--duration-fast) var(--ease-smooth);
  width: 100%;
}

.auth-input::placeholder { color: var(--dusk-text-faint); }

.auth-input:focus { border-color: color-mix(in srgb, var(--dusk-primary) 50%, transparent); }

.auth-error {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  color: #e07070;
  padding: var(--space-2) var(--space-3);
  background: rgba(224,112,112,0.08);
  border: 1px solid rgba(224,112,112,0.2);
  border-radius: var(--radius-sm);
}

.auth-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-6);
  background: var(--dusk-primary);
  color: var(--dusk-bg-deep);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 600;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background var(--duration-fast) var(--ease-smooth);
  margin-top: var(--space-2);
}

.auth-btn:hover:not(:disabled) { background: var(--dusk-primary-dark); }
.auth-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.auth-btn-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(0,0,0,0.2);
  border-top-color: var(--dusk-bg-deep);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.auth-footer {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--dusk-text-muted);
  text-align: center;
  margin-top: var(--space-6);
}

.auth-link {
  color: var(--dusk-primary);
  text-decoration: none;
  transition: color var(--duration-fast) var(--ease-smooth);
}

.auth-link:hover { color: var(--dusk-text); }
</style>
