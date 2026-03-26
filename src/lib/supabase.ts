import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

const isSupabaseConfigured = supabaseUrl && supabaseAnonKey && 
  supabaseUrl !== 'https://your-project.supabase.co' && 
  supabaseAnonKey !== 'your-anon-key'

if (!isSupabaseConfigured) {
  console.warn('[KiboJobs] Supabase credentials not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in the Replit Secrets panel.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
export { isSupabaseConfigured }

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string
          avatar_url: string | null
          bio: string | null
          location: string | null
          phone: string | null
          completion_percentage: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      jobs: {
        Row: {
          id: string
          title: string
          company_id: string
          location: string
          work_mode: 'Remoto' | 'Híbrido' | 'Presencial'
          job_type: 'CLT' | 'PJ' | 'Freelance' | 'Estágio'
          salary_min: number | null
          salary_max: number | null
          salary_tbd: boolean
          description: string
          requirements: string[]
          benefits: string[]
          experience_level: string
          jlpt_level: string | null
          closing_date: string | null
          is_sponsored: boolean
          is_featured: boolean
          views: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['jobs']['Row'], 'id' | 'created_at' | 'updated_at' | 'views'>
        Update: Partial<Database['public']['Tables']['jobs']['Insert']>
      }
      companies: {
        Row: {
          id: string
          user_id: string | null
          name: string
          logo_url: string | null
          description: string | null
          website: string | null
          industry: string | null
          open_jobs: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['companies']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['companies']['Insert']>
      }
      applications: {
        Row: {
          id: string
          user_id: string
          job_id: string
          status: 'pending' | 'viewed' | 'interview' | 'rejected' | 'accepted'
          applied_at: string
        }
        Insert: Omit<Database['public']['Tables']['applications']['Row'], 'id' | 'applied_at'>
        Update: Partial<Database['public']['Tables']['applications']['Insert']>
      }
    }
  }
}
