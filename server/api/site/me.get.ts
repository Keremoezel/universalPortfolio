import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) throw createError({ statusCode: 401 })

  const client = await serverSupabaseClient(event)

  const { data, error } = await client
    .from('sites')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (error) {
    // PGRST116 = no rows found — user has no site yet, return null
    if (error.code === 'PGRST116') return null
    throw createError({ statusCode: 500, message: error.message })
  }

  return data
})
