import { serverSupabaseClient } from '#supabase/server'
import { createClient } from '@supabase/supabase-js'

// Called after Supabase Auth signup.
// Does NOT require an auth session — the invite token is proof of legitimacy.
// Uses the service role key to bypass RLS for user lookup + site creation.
// This works whether email confirmation is enabled or disabled.
export default defineEventHandler(async (event) => {
  const { token, username, email } = await readBody(event)

  if (!token || !username || !email) {
    throw createError({ statusCode: 400, message: 'token, username, and email are required.' })
  }

  // Anon client for public reads (invite validation, username availability)
  const client = await serverSupabaseClient(event)

  // 1. Validate invite token
  const { data: invite, error: inviteErr } = await client
    .from('invites')
    .select('id, email, used')
    .eq('token', token)
    .single()

  if (inviteErr || !invite) throw createError({ statusCode: 404, message: 'Invalid invite token.' })
  if (invite.used)           throw createError({ statusCode: 410, message: 'Invite already used.' })

  // If the invite was created with a specific email, enforce it
  if (invite.email && invite.email !== email) {
    throw createError({ statusCode: 403, message: 'Email does not match this invite.' })
  }

  // 2. Validate username
  if (!/^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$/.test(username)) {
    throw createError({ statusCode: 400, message: 'Invalid username format.' })
  }
  const reserved = ['admin', 'login', 'signup', 'api', 'project']
  if (reserved.includes(username)) throw createError({ statusCode: 400, message: 'That username is reserved.' })

  // 3. Check username availability (sites has public read RLS — no service key needed)
  const { data: taken } = await client
    .from('sites')
    .select('id')
    .eq('username', username)
    .maybeSingle()

  if (taken) throw createError({ statusCode: 409, message: 'Username already taken.' })

  // 4. Service role client — bypasses RLS for user lookup + site insert
  const serviceUrl = process.env.SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_KEY
  if (!serviceUrl || !serviceKey) {
    throw createError({ statusCode: 500, message: 'SUPABASE_SERVICE_KEY is not configured on the server.' })
  }

  const adminClient = createClient(serviceUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  })

  // 5. Find user by email — public.users row is auto-created by the trigger at signUp time,
  //    even before email confirmation, so this works immediately after supabase.auth.signUp()
  const { data: userProfile } = await adminClient
    .from('users')
    .select('id')
    .eq('email', email)
    .single()

  if (!userProfile) {
    throw createError({
      statusCode: 404,
      message: 'Account not found. Make sure signup completed before calling setup.'
    })
  }

  // 6. Mark invite as used
  await adminClient
    .from('invites')
    .update({ used: true, used_at: new Date().toISOString() })
    .eq('id', invite.id)

  // 7. Create the site
  const { data: site, error: siteErr } = await adminClient
    .from('sites')
    .insert({ user_id: userProfile.id, username, theme: {}, content: {}, components: [] })
    .select()
    .single()

  if (siteErr) throw createError({ statusCode: 500, message: siteErr.message })

  return { username: site.username }
})
