<template>
  <div class="bg-white rounded-lg shadow p-6">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">แนวโน้ม 6 เดือนล่าสุด</h3>
    <div class="space-y-4">
      <div
        v-for="month in chartData"
        :key="month.month"
        class="space-y-2"
      >
        <div class="flex justify-between text-sm">
          <span class="text-gray-600">{{ month.monthDisplay }}</span>
          <div class="flex gap-4">
            <span class="text-green-600">+{{ formatNumber(month.income) }}</span>
            <span class="text-red-600">-{{ formatNumber(month.expense) }}</span>
          </div>
        </div>
        <div class="relative h-8 bg-gray-100 rounded-full overflow-hidden">
          <div
            class="absolute top-0 left-0 h-full bg-green-500 opacity-50"
            :style="{ width: `${getPercentage(month.income)}%` }"
          ></div>
          <div
            class="absolute top-0 left-0 h-full bg-red-500 opacity-50"
            :style="{ width: `${getPercentage(month.expense)}%` }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { formatNumber } from '../../../shared/utils/currency'
import { parseMonthKey } from '../../../shared/utils/date'

interface MonthData {
  month: string
  income: number
  expense: number
}

interface Props {
  data: MonthData[]
}

const props = defineProps<Props>()

const maxAmount = computed(() => {
  let max = 0
  for (const month of props.data) {
    max = Math.max(max, month.income, month.expense)
  }
  return max || 1
})

const chartData = computed(() => {
  return props.data.map((month) => ({
    ...month,
    monthDisplay: formatMonthDisplay(month.month),
  }))
})

const getPercentage = (amount: number) => {
  return (amount / maxAmount.value) * 100
}

const formatMonthDisplay = (monthKey: string) => {
  const { year, month } = parseMonthKey(monthKey)
  const date = new Date(year, month, 1)
  return date.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'short',
  })
}
</script>

