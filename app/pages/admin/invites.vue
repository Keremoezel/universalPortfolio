<template>
  <div class="admin-section">

    <!-- Generate invite -->
    <div class="panel">
      <div class="panel-header">
        <h2 class="panel-title">Generate invite link</h2>
        <p class="panel-desc">Each link is single-use. Share it with the person you want to onboard.</p>
      </div>

      <div class="invite-form">
        <div class="field">
          <label class="field-label">Email (optional)</label>
          <input
            v-model="emailInput"
            type="email"
            class="field-input"
            placeholder="recipient@example.com"
          />
          <span class="field-hint">If set, only this email can use the invite.</span>
        </div>
        <button class="btn-primary" :disabled="generating" @click="generate">
          <span v-if="generating" class="spinner" />
          <span v-else>Generate link →</span>
        </button>
      </div>

      <!-- Generated link output -->
      <div v-if="latestLink" class="invite-result">
        <span class="invite-result-label">Invite link</span>
        <div class="invite-link-row">
          <code class="invite-link-text">{{ latestLink }}</code>
          <button class="copy-btn" @click="copyLink">{{ copied ? 'Copied!' : 'Copy' }}</button>
        </div>
      </div>

      <p v-if="generateError" class="error-msg">{{ generateError }}</p>
    </div>

    <!-- Invite history -->
    <div class="panel">
      <div class="panel-header">
        <h2 class="panel-title">Invite history</h2>
        <button class="btn-ghost" @click="fetchInvites">↻ Refresh</button>
      </div>

      <div v-if="loading" class="empty-state">Loading…</div>
      <div v-else-if="!invites.length" class="empty-state">No invites yet.</div>

      <table v-else class="invite-table">
        <thead>
          <tr>
            <th>Token</th>
            <th>Email</th>
            <th>Status</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="inv in invites" :key="inv.id" :class="{ used: inv.used }">
            <td class="token-cell">
              <code>{{ inv.token.slice(0, 12) }}…</code>
              <button class="copy-btn-sm" @click="copyToken(inv.token)">Copy link</button>
            </td>
            <td>{{ inv.email ?? '—' }}</td>
            <td>
              <span class="badge" :class="inv.used ? 'badge-used' : 'badge-open'">
                {{ inv.used ? 'Used' : 'Open' }}
              </span>
            </td>
            <td class="date-cell">{{ formatDate(inv.created_at) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const supabase = useSupabaseClient()

const emailInput    = ref('')
const generating    = ref(false)
const generateError = ref('')
const latestLink    = ref('')
const copied        = ref(false)
const loading       = ref(false)

interface Invite {
  id: string
  token: string
  email: string | null
  used: boolean
  created_at: string
}
const invites = ref<Invite[]>([])

async function generate() {
  generating.value    = true
  generateError.value = ''
  latestLink.value    = ''
  try {
    const data = await $fetch<{ token: string; signupUrl: string }>('/api/invites/create', {
      method: 'POST',
      body: { email: emailInput.value || null }
    })
    latestLink.value = data.signupUrl
    emailInput.value = ''
    await fetchInvites()
  } catch (err: unknown) {
    generateError.value = (err as { data?: { message?: string } })?.data?.message ?? 'Failed to generate invite.'
  } finally {
    generating.value = false
  }
}

async function fetchInvites() {
  loading.value = true
  const { data } = await supabase
    .from('invites')
    .select('id, token, email, used, created_at')
    .order('created_at', { ascending: false })
    .limit(50)
  invites.value = (data as Invite[]) ?? []
  loading.value = false
}

function copyLink() {
  navigator.clipboard.writeText(latestLink.value)
  copied.value = true
  setTimeout(() => (copied.value = false), 2000)
}

function copyToken(token: string) {
  const url = `${window.location.origin}/signup?token=${token}`
  navigator.clipboard.writeText(url)
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

onMounted(fetchInvites)
</script>

<style scoped>
.admin-section { display: flex; flex-direction: column; gap: var(--space-8); }

.panel {
  background: var(--dusk-surface);
  border: 1px solid var(--dusk-border-muted);
  border-radius: var(--radius-md);
  padding: var(--space-7);
}

.panel-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: var(--space-6);
  gap: var(--space-4);
}

.panel-title {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: 400;
  color: var(--dusk-text);
  letter-spacing: -0.02em;
}

.panel-desc {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--dusk-text-muted);
  margin-top: var(--space-1);
}

.invite-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  max-width: 480px;
}

.field { display: flex; flex-direction: column; gap: var(--space-2); }

.field-label {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 500;
  letter-spacing: var(--tracking-widest);
  text-transform: uppercase;
  color: var(--dusk-text-faint);
}

.field-input {
  background: var(--dusk-bg);
  border: 1px solid var(--dusk-border-muted);
  border-radius: var(--radius-sm);
  padding: var(--space-3) var(--space-4);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--dusk-text);
  outline: none;
  transition: border-color var(--duration-fast) var(--ease-smooth);
}

.field-input:focus { border-color: color-mix(in srgb, var(--dusk-primary) 50%, transparent); }
.field-hint { font-size: var(--text-xs); color: var(--dusk-text-faint); }

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-6);
  background: var(--dusk-primary);
  color: var(--dusk-bg-deep);
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: var(--tracking-widest);
  text-transform: uppercase;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background var(--duration-fast) var(--ease-smooth);
  align-self: flex-start;
}

.btn-primary:hover:not(:disabled) { background: var(--dusk-primary-dark); }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

.btn-ghost {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--dusk-text-muted);
  background: transparent;
  border: 1px solid var(--dusk-border-muted);
  border-radius: var(--radius-sm);
  padding: var(--space-2) var(--space-4);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-smooth);
  flex-shrink: 0;
}

.btn-ghost:hover { color: var(--dusk-primary); border-color: var(--dusk-primary); }

.invite-result {
  margin-top: var(--space-6);
  padding: var(--space-5);
  background: var(--dusk-bg);
  border: 1px solid color-mix(in srgb, var(--dusk-primary) 20%, transparent);
  border-radius: var(--radius-sm);
}

.invite-result-label {
  display: block;
  font-family: var(--font-body);
  font-size: var(--text-xs);
  letter-spacing: var(--tracking-widest);
  text-transform: uppercase;
  color: var(--dusk-primary);
  margin-bottom: var(--space-3);
}

.invite-link-row {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  flex-wrap: wrap;
}

.invite-link-text {
  font-family: 'Courier New', monospace;
  font-size: var(--text-xs);
  color: var(--dusk-text-secondary);
  word-break: break-all;
  flex: 1;
}

.copy-btn {
  padding: var(--space-2) var(--space-4);
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 500;
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  color: var(--dusk-primary);
  background: transparent;
  border: 1px solid color-mix(in srgb, var(--dusk-primary) 30%, transparent);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-smooth);
  white-space: nowrap;
  flex-shrink: 0;
}

.copy-btn:hover { background: color-mix(in srgb, var(--dusk-primary) 8%, transparent); }

.copy-btn-sm {
  padding: 2px var(--space-3);
  font-family: var(--font-body);
  font-size: 10px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--dusk-text-faint);
  background: transparent;
  border: 1px solid var(--dusk-border-muted);
  border-radius: 2px;
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-smooth);
  margin-left: var(--space-2);
}

.copy-btn-sm:hover { color: var(--dusk-primary); border-color: color-mix(in srgb, var(--dusk-primary) 30%, transparent); }

.error-msg {
  margin-top: var(--space-4);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: #e07070;
}

.empty-state {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--dusk-text-faint);
  padding: var(--space-6) 0;
  text-align: center;
}

.invite-table {
  width: 100%;
  border-collapse: collapse;
  font-family: var(--font-body);
  font-size: var(--text-sm);
}

.invite-table th {
  text-align: left;
  font-size: var(--text-xs);
  font-weight: 500;
  letter-spacing: var(--tracking-widest);
  text-transform: uppercase;
  color: var(--dusk-text-faint);
  padding: var(--space-2) var(--space-4) var(--space-3);
  border-bottom: 1px solid var(--dusk-border-muted);
}

.invite-table td {
  padding: var(--space-3) var(--space-4);
  color: var(--dusk-text-secondary);
  border-bottom: 1px solid var(--dusk-border-muted);
  vertical-align: middle;
}

.invite-table tr.used td { opacity: 0.45; }

.token-cell { font-family: 'Courier New', monospace; font-size: var(--text-xs); }

.date-cell { font-family: 'Courier New', monospace; font-size: var(--text-xs); white-space: nowrap; }

.badge {
  display: inline-block;
  padding: 2px 8px;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  border-radius: 2px;
}

.badge-open { background: color-mix(in srgb, var(--dusk-primary) 12%, transparent); color: var(--dusk-primary); }
.badge-used { background: var(--dusk-surface-alt); color: var(--dusk-text-faint); }

.spinner {
  width: 12px;
  height: 12px;
  border: 2px solid rgba(0,0,0,0.2);
  border-top-color: var(--dusk-bg-deep);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }
</style>
