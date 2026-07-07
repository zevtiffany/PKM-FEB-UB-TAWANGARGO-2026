import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Server-side client pakai service role key (bypass RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export const STORAGE_BUCKET = 'foto-kegiatan'
