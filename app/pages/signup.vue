<template>
  <div class="auth-page">
    <div class="auth-grain" aria-hidden="true" />
    <div class="auth-atmosphere" aria-hidden="true" />

    <div class="auth-card">
      <div class="auth-logo">
        <span class="auth-logo-icon">◈</span>
        <span class="auth-logo-text">Studio</span>
      </div>

      <!-- Step 1: invite validated, show creation form -->
      <template v-if="step === 'form'">
        <h1 class="auth-heading">Create account</h1>
        <p class="auth-subheading">Invite valid. Choose a username for your portfolio URL.</p>

        <form class="auth-form" @submit.prevent="handleSignup">
          <div class="auth-field">
            <label class="auth-label" for="username">Username</label>
            <div class="auth-input-prefix-wrap">
              <span class="auth-input-prefix">{{ host }}/</span>
              <input
                id="username"
                v-model="username"
                type="text"
                class="auth-input auth-input-suffix"
                placeholder="yourname"
                pattern="[a-z0-9][a-z0-9\-]{1,28}[a-z0-9]"
                required
              />
            </div>
            <span class="auth-hint">3–30 chars, lowercase letters, numbers and hyphens.</span>
          </div>

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
              autocomplete="new-password"
              minlength="8"
              required
              placeholder="Min. 8 characters"
            />
          </div>

          <p v-if="error" class="auth-error">{{ error }}</p>

          <button type="submit" class="auth-btn" :disabled="loading">
            <span v-if="loading" class="auth-btn-spinner" />
            <span v-else>Create account →</span>
          </button>
        </form>
      </template>

      <!-- Step 2: email confirmation needed -->
      <template v-else-if="step === 'confirm'">
        <h1 class="auth-heading">Check your email</h1>
        <p class="auth-subheading">
          We sent a confirmation link to <strong>{{ email }}</strong>.
          Click it to activate your account, then
          <NuxtLink to="/login" class="auth-link">sign in</NuxtLink>.
        </p>
      </template>

      <!-- Step 3: redirect (email confirmation disabled) -->
      <template v-else-if="step === 'done'">
        <h1 class="auth-heading">All set!</h1>
        <p class="auth-subheading">Redirecting to your dashboard…</p>
      </template>

      <!-- Initial state: validating token -->
      <template v-else-if="step === 'validating'">
        <p class="auth-subheading">Validating invite…</p>
      </template>

      <!-- Invalid token -->
      <template v-else-if="step === 'invalid'">
        <h1 class="auth-heading">Invalid invite</h1>
        <p class="auth-error">{{ error || 'This invite link is not valid or has already been used.' }}</p>
        <NuxtLink to="/login" class="auth-link auth-link-block">Go to sign in →</NuxtLink>
      </template>

      <p v-if="step === 'form'" class="auth-footer">
        Already have an account?
        <NuxtLink to="/login" class="auth-link">Sign in →</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

useSeoMeta({ title: 'Create account — Studio' })

const route    = useRoute()
const supabase = useSupabaseClient()

const token    = computed(() => route.query.token as string | undefined)
const host     = computed(() => import.meta.client ? window.location.host : 'yoursite.com')

const step     = ref<'validating' | 'form' | 'confirm' | 'done' | 'invalid'>('validating')
const email    = ref('')
const password = ref('')
const username = ref('')
const error    = ref('')
const loading  = ref(false)

// On mount, validate the invite token from the URL
onMounted(async () => {
  if (!token.value) {
    error.value = 'No invite token provided.'
    step.value  = 'invalid'
    return
  }
  try {
    const data = await $fetch<{ valid: boolean; email: string | null }>(
      `/api/invites/${token.value}`
    )
    if (data.email) email.value = data.email
    step.value = 'form'
  } catch (err: unknown) {
    error.value = (err as { data?: { message?: string } })?.data?.message ?? 'Invalid invite.'
    step.value  = 'invalid'
  }
})

async function handleSignup() {
  loading.value = true
  error.value   = ''
  try {
    // Sign up via Supabase Auth
    const { data: authData, error: authErr } = await supabase.auth.signUp({
      email:    email.value,
      password: password.value
    })

    if (authErr) { error.value = authErr.message; return }

    // Call setup: marks invite used + creates site.
    // No auth session required — invite token + email proves legitimacy.
    await $fetch('/api/auth/setup', {
      method: 'POST',
      body: {
        token:    token.value,
        username: username.value,
        email:    email.value
      }
    })

    if (authData.session) {
      // Email confirmation disabled — user is immediately logged in
      step.value = 'done'
      await navigateTo('/admin')
    } else {
      // Email confirmation required
      step.value = 'confirm'
    }
  } catch (err: unknown) {
    error.value = (err as { data?: { message?: string } })?.data?.message ?? 'Something went wrong.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* All base styles shared with login.vue — use global or repeat here */
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
  max-width: 440px;
  padding: var(--space-10);
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

.auth-logo-icon { font-size: var(--text-xl); color: var(--dusk-primary); }
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
  line-height: 1.6;
}

.auth-form { display: flex; flex-direction: column; gap: var(--space-5); }

.auth-field { display: flex; flex-direction: column; gap: var(--space-2); }

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

.auth-input-prefix-wrap {
  display: flex;
  align-items: center;
  background: var(--dusk-bg);
  border: 1px solid var(--dusk-border-muted);
  border-radius: var(--radius-sm);
  overflow: hidden;
  transition: border-color var(--duration-fast) var(--ease-smooth);
}

.auth-input-prefix-wrap:focus-within { border-color: color-mix(in srgb, var(--dusk-primary) 50%, transparent); }

.auth-input-prefix {
  padding: var(--space-3) var(--space-3);
  font-family: 'Courier New', monospace;
  font-size: var(--text-xs);
  color: var(--dusk-text-faint);
  background: var(--dusk-surface-alt);
  border-right: 1px solid var(--dusk-border-muted);
  white-space: nowrap;
  flex-shrink: 0;
}

.auth-input-suffix {
  border: none;
  border-radius: 0;
  background: transparent;
  flex: 1;
}

.auth-input-suffix:focus { border-color: transparent; }

.auth-hint {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  color: var(--dusk-text-faint);
}

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

.auth-link-block { display: inline-block; margin-top: var(--space-4); }
</style>
