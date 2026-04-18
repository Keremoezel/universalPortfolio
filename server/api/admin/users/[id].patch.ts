import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const callerId = (await serverSupabaseUser(event))?.id
  if (!callerId) throw createError({ statusCode: 401 })

  const adminClient = await serverSupabaseServiceRole(event)

  // Verify caller is admin
  const { data: caller } = await adminClient.from('users').select('role').eq('id', callerId).single()
  if (caller?.role !== 'admin') throw createError({ statusCode: 403, message: 'Admin only.' })

  const targetId = getRouterParam(event, 'id')
  const { role } = await readBody(event)

  if (!['admin', 'user'].includes(role)) {
    throw createError({ statusCode: 400, message: 'Role must be "admin" or "user".' })
  }

  const { data, error } = await adminClient
    .from('users')
    .update({ role })
    .eq('id', targetId)
    .select('id, email, role')
    .single()

  if (error) throw createError({ statusCode: 500, message: error.message })
  return data
})
