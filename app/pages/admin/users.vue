<template>
  <div class="admin-section">
    <div class="panel">
      <div class="panel-header">
        <div>
          <h2 class="panel-title">Users</h2>
          <p class="panel-desc">Manage roles for all accounts on this platform.</p>
        </div>
        <button class="btn-ghost" @click="fetchUsers">↻ Refresh</button>
      </div>

      <div v-if="loading" class="empty-state">Loading…</div>
      <div v-else-if="error" class="error-msg">{{ error }}</div>
      <div v-else-if="!users.length" class="empty-state">No users yet.</div>

      <table v-else class="users-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Username</th>
            <th>Role</th>
            <th>Joined</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="u in users" :key="u.id">
            <td>{{ u.email }}</td>
            <td>
              <NuxtLink
                v-if="u.username"
                :to="`/${u.username}`"
                target="_blank"
                class="username-link"
              >{{ u.username }} ↗</NuxtLink>
              <span v-else class="no-site">No site</span>
            </td>
            <td>
              <span class="badge" :class="u.role === 'admin' ? 'badge-admin' : 'badge-user'">
                {{ u.role }}
              </span>
            </td>
            <td class="date-cell">{{ formatDate(u.created_at) }}</td>
            <td>
              <button
                v-if="u.id !== currentUserId"
                class="role-btn"
                :disabled="savingId === u.id"
                @click="toggleRole(u)"
              >
                <span v-if="savingId === u.id" class="spinner" />
                <span v-else>
                  {{ u.role === 'admin' ? 'Demote to user' : 'Make admin' }}
                </span>
              </button>
              <span v-else class="you-label">You</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const user = useSupabaseUser()
const currentUserId = computed(() => user.value?.id)

const loading  = ref(false)
const error    = ref('')
const savingId = ref<string | null>(null)

interface UserRow {
  id:         string
  email:      string
  role:       string
  created_at: string
  username:   string | null
}
const users = ref<UserRow[]>([])

async function fetchUsers() {
  loading.value = true
  error.value   = ''
  try {
    const data = await $fetch<(Omit<UserRow, 'username'> & { sites: { username: string }[] })[]>(
      '/api/admin/users'
    )
    // Flatten site username onto each user row
    users.value = data.map(u => ({
      ...u,
      username: u.sites?.[0]?.username ?? null
    }))
  } catch (err: unknown) {
    error.value = (err as { data?: { message?: string } })?.data?.message ?? 'Failed to load users.'
  } finally {
    loading.value = false
  }
}

async function toggleRole(u: UserRow) {
  savingId.value = u.id
  const newRole  = u.role === 'admin' ? 'user' : 'admin'
  try {
    await $fetch(`/api/admin/users/${u.id}`, {
      method: 'PATCH',
      body: { role: newRole }
    })
    u.role = newRole
  } catch (err: unknown) {
    alert((err as { data?: { message?: string } })?.data?.message ?? 'Failed to update role.')
  } finally {
    savingId.value = null
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

onMounted(fetchUsers)
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

.empty-state {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--dusk-text-faint);
  padding: var(--space-6) 0;
  text-align: center;
}

.error-msg {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: #e07070;
  padding: var(--space-4) 0;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
  font-family: var(--font-body);
  font-size: var(--text-sm);
}

.users-table th {
  text-align: left;
  font-size: var(--text-xs);
  font-weight: 500;
  letter-spacing: var(--tracking-widest);
  text-transform: uppercase;
  color: var(--dusk-text-faint);
  padding: var(--space-2) var(--space-4) var(--space-3);
  border-bottom: 1px solid var(--dusk-border-muted);
}

.users-table td {
  padding: var(--space-3) var(--space-4);
  color: var(--dusk-text-secondary);
  border-bottom: 1px solid var(--dusk-border-muted);
  vertical-align: middle;
}

.date-cell { font-family: 'Courier New', monospace; font-size: var(--text-xs); white-space: nowrap; }

.username-link {
  color: var(--dusk-primary);
  text-decoration: none;
  font-size: var(--text-xs);
  letter-spacing: 0.02em;
}

.username-link:hover { text-decoration: underline; }

.no-site { color: var(--dusk-text-faint); font-size: var(--text-xs); }

.badge {
  display: inline-block;
  padding: 2px 8px;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  border-radius: 2px;
}

.badge-admin { background: color-mix(in srgb, var(--dusk-primary) 12%, transparent); color: var(--dusk-primary); }
.badge-user  { background: var(--dusk-surface-alt); color: var(--dusk-text-faint); }

.role-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--dusk-text-muted);
  background: transparent;
  border: 1px solid var(--dusk-border-muted);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-smooth);
}

.role-btn:hover:not(:disabled) { color: var(--dusk-primary); border-color: color-mix(in srgb, var(--dusk-primary) 40%, transparent); }
.role-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.you-label {
  font-family: 'Courier New', monospace;
  font-size: var(--text-xs);
  color: var(--dusk-text-faint);
  letter-spacing: 0.1em;
}

.spinner {
  width: 10px;
  height: 10px;
  border: 2px solid rgba(255,255,255,0.2);
  border-top-color: var(--dusk-primary);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }
</style>
