<template>
  <div class="bg-white rounded-lg shadow overflow-hidden">
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              เดือน
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              รายรับประจำ
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              รายรับครั้งเดียว
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              รวมรายรับ
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              รายจ่ายประจำ
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              รายจ่ายครั้งเดียว
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              รวมรายจ่าย
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              สุทธิ
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              ยอดรวมสะสม
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="summaries.length === 0">
            <td colspan="9" class="px-6 py-12 text-center text-gray-500">
              ไม่มีข้อมูล
            </td>
          </tr>
          <tr
            v-for="summary in summaries"
            :key="summary.month"
            class="hover:bg-gray-50"
          >
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {{ formatMonthDisplay(summary.month) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-right text-green-600">
              {{ formatNumber(summary.recurringIncome) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-right text-green-600">
              {{ formatNumber(summary.oneTimeIncome) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-green-600">
              {{ formatNumber(summary.totalIncome) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-right text-red-600">
              {{ formatNumber(summary.recurringExpense) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-right text-red-600">
              {{ formatNumber(summary.oneTimeExpense) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-red-600">
              {{ formatNumber(summary.totalExpense) }}
            </td>
            <td
              class="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold"
              :class="summary.netBalance >= 0 ? 'text-green-600' : 'text-red-600'"
            >
              {{ formatNumber(summary.netBalance) }}
            </td>
            <td
              class="px-6 py-4 whitespace-nowrap text-sm text-right font-bold"
              :class="summary.runningBalance >= 0 ? 'text-blue-600' : 'text-red-600'"
            >
              {{ formatNumber(summary.runningBalance) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Summary Card -->
    <div class="border-t border-gray-200 bg-gray-50 px-6 py-4">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <p class="text-xs text-gray-500 uppercase">ยอดเริ่มต้น</p>
          <p class="text-lg font-semibold text-gray-900">{{ formatCurrency(initialBalance) }}</p>
        </div>
        <div>
          <p class="text-xs text-gray-500 uppercase">รวมรายรับ</p>
          <p class="text-lg font-semibold text-green-600">{{ formatCurrency(totalIncome) }}</p>
        </div>
        <div>
          <p class="text-xs text-gray-500 uppercase">รวมรายจ่าย</p>
          <p class="text-lg font-semibold text-red-600">{{ formatCurrency(totalExpense) }}</p>
        </div>
        <div>
          <p class="text-xs text-gray-500 uppercase">ยอดสุทธิ</p>
          <p
            class="text-lg font-semibold"
            :class="finalBalance >= 0 ? 'text-blue-600' : 'text-red-600'"
          >
            {{ formatCurrency(finalBalance) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { MonthlySummary } from '../../../shared/types'
import { formatCurrency, formatNumber } from '../../../shared/utils/currency'
import { parseMonthKey } from '../../../shared/utils/date'

interface Props {
  summaries: MonthlySummary[]
  initialBalance: number
}

const props = defineProps<Props>()

const totalIncome = computed(() => {
  return props.summaries.reduce((sum, s) => sum + s.totalIncome, 0)
})

const totalExpense = computed(() => {
  return props.summaries.reduce((sum, s) => sum + s.totalExpense, 0)
})

const finalBalance = computed(() => {
  if (props.summaries.length === 0) return props.initialBalance
  return props.summaries[props.summaries.length - 1].runningBalance
})

const formatMonthDisplay = (monthKey: string) => {
  const { year, month } = parseMonthKey(monthKey)
  const date = new Date(year, month, 1)
  return date.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
  })
}
</script>

