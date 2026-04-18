import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const username = getRouterParam(event, 'username')
  if (!username) throw createError({ statusCode: 400 })

  const adminClient = await serverSupabaseServiceRole(event)

  const { data, error } = await adminClient
    .from('sites')
    .select('username, theme, content, components')
    .eq('username', username)
    .single()

  if (error || !data) {
    throw createError({ statusCode: 404, message: 'Portfolio not found' })
  }

  return data
})
