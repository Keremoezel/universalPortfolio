import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const token = getRouterParam(event, 'token')
  if (!token) throw createError({ statusCode: 400 })

  const client = await serverSupabaseClient(event)

  const { data, error } = await client
    .from('invites')
    .select('id, email, used')
    .eq('token', token)
    .single()

  if (error || !data) {
    throw createError({ statusCode: 404, message: 'Invalid invite token.' })
  }
  if (data.used) {
    throw createError({ statusCode: 410, message: 'This invite has already been used.' })
  }

  return { valid: true, email: data.email }
})
