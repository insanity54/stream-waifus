import { createError } from 'h3'
import type { Database } from '~~/types/database.types'
import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  const client = await serverSupabaseClient<Database>(event)

  const { data, error } = await client.from('settings').select('id, is_streamer').eq('user', user.id)
  if (error) {
    throw createError({ statusMessage: error.message })
  }

  return data
})