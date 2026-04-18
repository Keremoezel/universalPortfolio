import { createClient } from '@supabase/supabase-js'

// Returns a Supabase client using the service role key.
// Bypasses RLS — use only in trusted server routes.
export function useAdminClient() {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_KEY
  if (!url || !key) throw createError({ statusCode: 500, message: 'SUPABASE_SERVICE_KEY is not configured.' })
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } })
}

// Verify the caller is an admin. Throws 401/403 if not.
export async function requireAdmin(callerId: string | undefined) {
  if (!callerId) throw createError({ statusCode: 401 })
  const client = useAdminClient()
  const { data } = await client.from('users').select('role').eq('id', callerId).single()
  if (data?.role !== 'admin') throw createError({ statusCode: 403, message: 'Admin only.' })
}
