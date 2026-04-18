import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server'
import { randomBytes } from 'node:crypto'

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

  const { email } = await readBody(event)
  const token = randomBytes(32).toString('hex')

  const { data, error } = await adminClient
    .from('invites')
    .insert({ token, email: email ?? null, created_by: user.id })
    .select('token, email, created_at')
    .single()

  if (error) throw createError({ statusCode: 500, message: error.message })

  const host = getRequestHeader(event, 'host') ?? 'localhost:3000'
  const proto = process.env.NODE_ENV === 'production' ? 'https' : 'http'

  return {
    token: data.token,
    email: data.email,
    signupUrl: `${proto}://${host}/signup?token=${data.token}`
  }
})
