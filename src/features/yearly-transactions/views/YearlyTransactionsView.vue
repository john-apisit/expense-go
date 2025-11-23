<template>
  <Layout>
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-3xl font-bold text-gray-900">รายการประจำปี</h1>
        <BaseButton @click="showModal = true">
          <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          เพิ่มรายการ
        </BaseButton>
      </div>

      <div v-if="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <YearlyList
        v-else
        :transactions="transactions"
        :loading="loading"
        @edit="handleEdit"
        @delete="handleDelete"
      />

      <BaseModal
        v-model="showModal"
        :title="editingTransaction ? 'แก้ไขรายการ' : 'เพิ่มรายการใหม่'"
      >
        <YearlyForm
          :transaction="editingTransaction"
          :loading="formLoading"
          :error="formError"
          @submit="handleSubmit"
          @cancel="closeModal"
        />
      </BaseModal>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Layout from '../../../shared/components/Layout.vue'
import BaseButton from '../../../shared/components/BaseButton.vue'
import BaseModal from '../../../shared/components/BaseModal.vue'
import YearlyForm from '../components/YearlyForm.vue'
import YearlyList from '../components/YearlyList.vue'
import { supabase } from '../../../supabase/client'
import { useCategories } from '../../../shared/composables/useCategories'
import type { YearlyTransaction } from '../../../shared/types'

const { fetchCategories } = useCategories()

const loading = ref(false)
const formLoading = ref(false)
const formError = ref<string | null>(null)
const showModal = ref(false)
const editingTransaction = ref<YearlyTransaction | null>(null)
const transactions = ref<YearlyTransaction[]>([])

const fetchTransactions = async () => {
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('yearly_transactions')
      .select('*, category:categories(*)')
      .eq('is_deleted', false)
      .order('created_at', { ascending: false })

    if (error) throw error
    transactions.value = (data || []) as YearlyTransaction[]
  } catch (e) {
    console.error('Error fetching yearly transactions:', e)
  } finally {
    loading.value = false
  }
}

const handleSubmit = async (data: any) => {
  formLoading.value = true
  formError.value = null

  try {
    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user) throw new Error('User not authenticated')

    if (editingTransaction.value) {
      const { error } = await supabase
        .from('yearly_transactions')
        .update(data)
        .eq('id', editingTransaction.value.id)

      if (error) throw error
    } else {
      const { error } = await supabase
        .from('yearly_transactions')
        .insert({
          ...data,
          user_id: userData.user.id,
        })

      if (error) throw error
    }

    await fetchTransactions()
    closeModal()
  } catch (e) {
    formError.value = e instanceof Error ? e.message : 'Failed to save transaction'
    console.error('Error saving yearly transaction:', e)
  } finally {
    formLoading.value = false
  }
}

const handleEdit = (transaction: YearlyTransaction) => {
  editingTransaction.value = transaction
  showModal.value = true
}

const handleDelete = async (transaction: YearlyTransaction) => {
  try {
    const { error } = await supabase
      .from('yearly_transactions')
      .update({ is_deleted: true })
      .eq('id', transaction.id)

    if (error) throw error
    await fetchTransactions()
  } catch (e) {
    console.error('Error deleting yearly transaction:', e)
    alert('เกิดข้อผิดพลาดในการลบรายการ')
  }
}

const closeModal = () => {
  showModal.value = false
  editingTransaction.value = null
  formError.value = null
}

onMounted(async () => {
  await fetchCategories()
  await fetchTransactions()
})
</script>

