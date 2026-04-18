import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server'
import { writeFileSync } from 'node:fs'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) throw createError({ statusCode: 401 })

  const { theme, content, components } = await readBody(event)
  
  try {
    const fs = await import('node:fs')
    const path = await import('node:path')
    fs.writeFileSync(path.join(process.cwd(), 'scratch_payload.json'), JSON.stringify({ theme, content, components }, null, 2))
  } catch (e) {
    console.error('Failed to write payload', e)
  }

  const adminClient = await serverSupabaseServiceRole(event)

  const actualUserId = user.id || user.user_metadata?.sub

  const { data, error } = await adminClient
    .from('sites')
    .update({ theme, content, components })
    .eq('user_id', actualUserId)
    .select('id, username, updated_at')
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      throw createError({ statusCode: 404, message: 'No site found — create one first.' })
    }
    throw createError({ statusCode: 500, message: error.message })
  }

  return data
})
