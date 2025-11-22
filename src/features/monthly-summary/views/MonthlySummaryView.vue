<template>
  <Layout>
    <div class="space-y-6">
      <h1 class="text-3xl font-bold text-gray-900">สรุปรายเดือน</h1>

      <MonthFilter
        :start-month="startMonth"
        :end-month="endMonth"
        @apply="handleApplyFilter"
      />

      <div v-if="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <div v-else-if="error" class="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p class="text-sm text-red-600">{{ error }}</p>
      </div>

      <SummaryTable
        v-else
        :summaries="summaries"
        :initial-balance="initialBalance"
      />
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Layout from '../../../shared/components/Layout.vue'
import MonthFilter from '../components/MonthFilter.vue'
import SummaryTable from '../components/SummaryTable.vue'
import { useMonthlySummary } from '../composables/useMonthlySummary'
import { formatMonthInput } from '../../../shared/utils/date'

const { loading, error, summaries, initialBalance, calculateMonthlySummaries } = useMonthlySummary()

// Default to current year
const now = new Date()
const startMonth = ref(formatMonthInput(new Date(now.getFullYear(), 0, 1)))
const endMonth = ref(formatMonthInput(new Date(now.getFullYear(), 11, 1)))

const handleApplyFilter = async (start: string, end: string) => {
  startMonth.value = start
  endMonth.value = end

  const startDate = new Date(start + '-01')
  const endDate = new Date(end + '-01')
  endDate.setMonth(endDate.getMonth() + 1)
  endDate.setDate(0) // Last day of the month

  await calculateMonthlySummaries(startDate, endDate)
}

onMounted(async () => {
  const startDate = new Date(startMonth.value + '-01')
  const endDate = new Date(endMonth.value + '-01')
  endDate.setMonth(endDate.getMonth() + 1)
  endDate.setDate(0)

  await calculateMonthlySummaries(startDate, endDate)
})
</script>

