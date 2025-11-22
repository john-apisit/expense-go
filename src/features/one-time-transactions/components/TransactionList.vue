<template>
  <div class="space-y-4">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold text-gray-900">รายการทั้งหมด</h3>
      <div class="flex gap-2">
        <button
          :class="filterType === 'all' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'"
          class="px-3 py-1 rounded-md text-sm font-medium"
          @click="filterType = 'all'"
        >
          ทั้งหมด
        </button>
        <button
          :class="filterType === 'income' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'"
          class="px-3 py-1 rounded-md text-sm font-medium"
          @click="filterType = 'income'"
        >
          รายรับ
        </button>
        <button
          :class="filterType === 'expense' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'"
          class="px-3 py-1 rounded-md text-sm font-medium"
          @click="filterType = 'expense'"
        >
          รายจ่าย
        </button>
      </div>
    </div>

    <div v-if="filteredTransactions.length === 0" class="text-center py-12 bg-gray-50 rounded-lg">
      <p class="text-gray-500">ยังไม่มีรายการ</p>
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="transaction in filteredTransactions"
        :key="transaction.id"
        class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
      >
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <h4 class="font-medium text-gray-900">{{ transaction.title }}</h4>
            <p class="text-sm text-gray-500 mt-1">
              {{ transaction.category?.name || 'ไม่มีหมวดหมู่' }}
            </p>
            <p class="text-xs text-gray-400 mt-1">
              {{ formatDate(transaction.transaction_date) }}
            </p>
          </div>
          <div class="flex items-center gap-3">
            <div class="text-right">
              <p
                :class="transaction.type === 'income' ? 'text-green-600' : 'text-red-600'"
                class="font-semibold"
              >
                {{ transaction.type === 'income' ? '+' : '-' }}{{ formatCurrency(transaction.amount) }}
              </p>
            </div>
            <div class="flex gap-1">
              <button
                class="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                @click="$emit('edit', transaction)"
              >
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                class="p-2 text-red-600 hover:bg-red-50 rounded-md"
                @click="$emit('delete', transaction)"
              >
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { OneTimeTransaction } from '../../../shared/types'
import { formatCurrency } from '../../../shared/utils/currency'
import { formatDate } from '../../../shared/utils/date'

interface Props {
  transactions: OneTimeTransaction[]
}

const props = defineProps<Props>()

defineEmits<{
  edit: [transaction: OneTimeTransaction]
  delete: [transaction: OneTimeTransaction]
}>()

const filterType = ref<'all' | 'income' | 'expense'>('all')

const filteredTransactions = computed(() => {
  if (filterType.value === 'all') {
    return props.transactions
  }
  return props.transactions.filter((t) => t.type === filterType.value)
})
</script>

