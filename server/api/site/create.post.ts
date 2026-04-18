import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) throw createError({ statusCode: 401 })

  const { username } = await readBody(event)

  if (!username || !/^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$/.test(username)) {
    throw createError({
      statusCode: 400,
      message: 'Username must be 3–30 characters, lowercase alphanumeric and hyphens only.'
    })
  }

  const reserved = ['admin', 'login', 'signup', 'api', 'project']
  if (reserved.includes(username)) {
    throw createError({ statusCode: 400, message: 'That username is reserved.' })
  }

  const adminClient = await serverSupabaseServiceRole(event)

  const { data: existing } = await adminClient
    .from('sites')
    .select('id')
    .eq('username', username)
    .maybeSingle()

  if (existing) throw createError({ statusCode: 409, message: 'Username already taken.' })

  const actualUserId = user.id || user.user_metadata?.sub

  const { data, error } = await adminClient
    .from('sites')
    .insert({ user_id: actualUserId, username, theme: {}, content: {}, components: [] })
    .select()
    .single()

  if (error) throw createError({ statusCode: 500, message: error.message })

  return data
})
