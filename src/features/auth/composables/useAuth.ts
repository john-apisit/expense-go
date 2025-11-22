import { ref } from 'vue'
import { supabase } from '../../../supabase/client'

export function useAuth() {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const user = ref(null)

  const signIn = async (email: string, password: string) => {
    loading.value = true
    error.value = null
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) throw signInError
      user.value = data.user
      return data
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to sign in'
      console.error('Error signing in:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  const signUp = async (email: string, password: string) => {
    loading.value = true
    error.value = null
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (signUpError) throw signUpError
      
      // Seed default categories for new user
      if (data.user) {
        await supabase.rpc('seed_default_categories', { p_user_id: data.user.id })
      }
      
      user.value = data.user
      return data
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to sign up'
      console.error('Error signing up:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  const signOut = async () => {
    loading.value = true
    error.value = null
    try {
      const { error: signOutError } = await supabase.auth.signOut()
      if (signOutError) throw signOutError
      user.value = null
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to sign out'
      console.error('Error signing out:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  const getCurrentUser = async () => {
    try {
      const { data } = await supabase.auth.getUser()
      user.value = data.user
      return data.user
    } catch (e) {
      console.error('Error getting current user:', e)
      return null
    }
  }

  return {
    loading,
    error,
    user,
    signIn,
    signUp,
    signOut,
    getCurrentUser,
  }
}

