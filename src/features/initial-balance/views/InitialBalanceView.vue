<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
    <BalanceForm :loading="loading" :error="error" @submit="handleSubmit" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BalanceForm from '../components/BalanceForm.vue'
import { supabase } from '../../../supabase/client'

const router = useRouter()
const loading = ref(false)
const error = ref<string | null>(null)

const handleSubmit = async (amount: number) => {
  loading.value = true
  error.value = null

  try {
    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user) throw new Error('User not authenticated')

    const { error: insertError } = await supabase
      .from('initial_balance')
      .insert({
        user_id: userData.user.id,
        amount,
      })

    if (insertError) throw insertError

    router.push('/dashboard')
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to save initial balance'
    console.error('Error saving initial balance:', e)
  } finally {
    loading.value = false
  }
}
</script>

