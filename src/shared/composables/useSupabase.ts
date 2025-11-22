import { supabase } from '../../supabase/client'

export function useSupabase() {
  return {
    supabase,
    auth: supabase.auth,
  }
}

