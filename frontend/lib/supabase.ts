import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Type definitions
export interface Resource {
  id: string
  title: string
  description: string | null
  url: string | null
  category: 'scholarship' | 'visa' | 'job' | 'accommodation' | 'general'
  country: string
  institution: string | null
  deadline: string | null
  eligibility: string | null
  amount: string | null
  tags: string[] | null
  last_updated: string
  created_at: string
  metadata: Record<string, unknown> | null
}