import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) throw createError({ statusCode: 401 })

  const adminClient = await serverSupabaseServiceRole(event)

  const { data: profile, error: profileErr } = await adminClient
    .from('users')
    .select('role')
    .eq('email', user.email)
    .single()

  if (profile?.role !== 'admin') {
    throw createError({ 
      statusCode: 403, 
      message: `Admin only. Your role: ${profile?.role || 'null'} (User ID: ${user.id}, Email: ${user.email}). DB error: ${profileErr?.message}` 
    })
  }

  const { data, error } = await adminClient
    .from('users')
    .select('id, email, role, is_allowed, created_at, sites(username)')
    .order('created_at', { ascending: false })

  if (error) throw createError({ statusCode: 500, message: error.message })

  return data
})
