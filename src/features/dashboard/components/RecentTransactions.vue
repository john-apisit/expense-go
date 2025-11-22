<template>
  <div class="bg-white rounded-lg shadow">
    <div class="px-6 py-4 border-b border-gray-200">
      <h3 class="text-lg font-semibold text-gray-900">รายการล่าสุด</h3>
    </div>
    <div class="divide-y divide-gray-200">
      <div v-if="transactions.length === 0" class="px-6 py-12 text-center text-gray-500">
        ยังไม่มีรายการ
      </div>
      <div
        v-for="transaction in transactions"
        :key="transaction.id"
        class="px-6 py-4 hover:bg-gray-50 transition-colors"
      >
        <div class="flex items-center justify-between">
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 truncate">
              {{ transaction.title }}
            </p>
            <p class="text-xs text-gray-500 mt-1">
              {{ transaction.category?.name }} • {{ formatDate(transaction.date) }}
            </p>
          </div>
          <div class="ml-4 flex-shrink-0">
            <p
              class="text-sm font-semibold"
              :class="transaction.type === 'income' ? 'text-green-600' : 'text-red-600'"
            >
              {{ transaction.type === 'income' ? '+' : '-' }}{{ formatCurrency(transaction.amount) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatCurrency } from '../../../shared/utils/currency'
import { formatDate } from '../../../shared/utils/date'

interface Transaction {
  id: string
  title: string
  amount: number
  type: 'income' | 'expense'
  date: string
  category?: {
    name: string
  }
}

interface Props {
  transactions: Transaction[]
}

defineProps<Props>()
</script>

