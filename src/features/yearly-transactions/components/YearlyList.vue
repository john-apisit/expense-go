<template>
  <div class="space-y-4">
    <!-- Filter Tabs -->
    <div class="flex gap-2 border-b border-gray-200">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        @click="activeFilter = tab.value"
        class="px-4 py-2 -mb-px text-sm font-medium transition-colors"
        :class="
          activeFilter === tab.value
            ? 'text-blue-600 border-b-2 border-blue-600'
            : 'text-gray-500 hover:text-gray-700'
        "
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p class="mt-2 text-sm text-gray-600">กำลังโหลด...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredTransactions.length === 0" class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">ไม่มีรายการ</h3>
      <p class="mt-1 text-sm text-gray-500">เริ่มต้นโดยการเพิ่มรายการค่าใช้จ่าย/รายได้ประจำปี</p>
    </div>

    <!-- Transaction List -->
    <div v-else class="space-y-3">
      <div
        v-for="transaction in filteredTransactions"
        :key="transaction.id"
        class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center gap-2">
              <h3 class="font-medium text-gray-900">{{ transaction.title }}</h3>
              <span
                class="px-2 py-1 text-xs font-medium rounded-full"
                :class="
                  transaction.type === 'income'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                "
              >
                {{ transaction.type === 'income' ? 'รายรับ' : 'รายจ่าย' }}
              </span>
            </div>
            <p class="text-sm text-gray-600 mt-1">
              {{ transaction.category?.name || 'ไม่มีหมวดหมู่' }}
            </p>
            <div class="flex items-center gap-4 mt-2 text-sm text-gray-500">
              <span>{{ formatAmount(transaction.amount) }}</span>
              <span>ทุกเดือน{{ getMonthName(transaction.occurrence_month) }}</span>
              <span>{{ formatYearRange(transaction.start_year, transaction.end_year) }}</span>
            </div>
          </div>
          <div class="flex gap-2 ml-4">
            <button
              @click="$emit('edit', transaction)"
              class="p-2 text-gray-400 hover:text-blue-600 transition-colors"
              title="แก้ไข"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              @click="confirmDelete(transaction)"
              class="p-2 text-gray-400 hover:text-red-600 transition-colors"
              title="ลบ"
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
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { YearlyTransaction } from '../../../shared/types'
import { formatCurrency } from '../../../shared/utils/currency'

interface Props {
  transactions: YearlyTransaction[]
  loading?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  edit: [transaction: YearlyTransaction]
  delete: [transaction: YearlyTransaction]
}>()

const tabs = [
  { value: 'all' as const, label: 'ทั้งหมด' },
  { value: 'income' as const, label: 'รายรับ' },
  { value: 'expense' as const, label: 'รายจ่าย' },
]

const activeFilter = ref<'all' | 'income' | 'expense'>('all')

const filteredTransactions = computed(() => {
  if (activeFilter.value === 'all') {
    return props.transactions
  }
  return props.transactions.filter((t) => t.type === activeFilter.value)
})

const months = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
]

const getMonthName = (month: number) => {
  return months[month - 1] || ''
}

const formatAmount = (amount: number) => {
  return formatCurrency(amount)
}

const formatYearRange = (startYear: number, endYear: number | null) => {
  if (endYear === null) {
    return `${startYear} - ไม่มีกำหนด`
  }
  return `${startYear} - ${endYear}`
}

const confirmDelete = (transaction: YearlyTransaction) => {
  if (confirm(`ต้องการลบรายการ "${transaction.title}" ใช่หรือไม่?`)) {
    emit('delete', transaction)
  }
}
</script>

