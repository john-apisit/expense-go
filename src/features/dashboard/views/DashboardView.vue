<template>
  <Layout>
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-3xl font-bold text-gray-900">แดชบอร์ด</h1>
        <p class="text-sm text-gray-500">{{ currentMonthDisplay }}</p>
      </div>

      <div v-if="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <template v-else>
        <!-- Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <SummaryCard
            title="ยอดเงินรวม"
            :amount="currentBalance"
            subtitle="ยอดเงินคงเหลือปัจจุบัน"
            variant="blue"
          >
            <template #icon>
              <svg class="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
            </template>
          </SummaryCard>

          <SummaryCard
            title="รายรับเดือนนี้"
            :amount="currentMonthIncome"
            subtitle="รวมรายรับทั้งหมด"
            variant="green"
          >
            <template #icon>
              <svg class="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </template>
          </SummaryCard>

          <SummaryCard
            title="รายจ่ายเดือนนี้"
            :amount="currentMonthExpense"
            subtitle="รวมรายจ่ายทั้งหมด"
            variant="red"
          >
            <template #icon>
              <svg class="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
              </svg>
            </template>
          </SummaryCard>

          <SummaryCard
            title="สุทธิเดือนนี้"
            :amount="currentMonthNet"
            subtitle="รายรับ - รายจ่าย"
            :variant="currentMonthNet >= 0 ? 'green' : 'red'"
          >
            <template #icon>
              <svg class="w-8 h-8" :class="currentMonthNet >= 0 ? 'text-green-600' : 'text-red-600'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </template>
          </SummaryCard>
        </div>

        <!-- Charts and Recent Transactions -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MonthlyChart :data="chartData" />
          <RecentTransactions :transactions="recentTransactions" />
        </div>

        <!-- Quick Actions -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">เริ่มต้นใช้งาน</h3>
          <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
            <router-link
              to="/categories"
              class="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <svg class="w-8 h-8 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <span class="text-sm font-medium text-gray-700">หมวดหมู่</span>
            </router-link>

            <router-link
              to="/recurring-transactions"
              class="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <svg class="w-8 h-8 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              <span class="text-sm font-medium text-gray-700">รายการประจำ</span>
            </router-link>

            <router-link
              to="/one-time-transactions"
              class="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <svg class="w-8 h-8 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              <span class="text-sm font-medium text-gray-700">รายการครั้งเดียว</span>
            </router-link>

            <router-link
              to="/monthly-summary"
              class="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <svg class="w-8 h-8 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span class="text-sm font-medium text-gray-700">สรุปรายเดือน</span>
            </router-link>

            <button
              @click="refreshData"
              class="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <svg class="w-8 h-8 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span class="text-sm font-medium text-gray-700">รีเฟรช</span>
            </button>
          </div>
        </div>
      </template>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Layout from '../../../shared/components/Layout.vue'
import SummaryCard from '../components/SummaryCard.vue'
import RecentTransactions from '../components/RecentTransactions.vue'
import MonthlyChart from '../components/MonthlyChart.vue'
import { supabase } from '../../../supabase/client'
import { getMonthKey, isMonthInRange } from '../../../shared/utils/date'
import type { RecurringTransaction, OneTimeTransaction } from '../../../shared/types'

const loading = ref(true)
const initialBalance = ref(0)
const recurringTransactions = ref<RecurringTransaction[]>([])
const oneTimeTransactions = ref<OneTimeTransaction[]>([])

const currentMonthKey = computed(() => getMonthKey(new Date()))

const currentMonthDisplay = computed(() => {
  return new Date().toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
  })
})

const currentMonthIncome = computed(() => {
  let total = 0

  // Recurring income
  for (const transaction of recurringTransactions.value) {
    if (transaction.type === 'income') {
      const startMonth = getMonthKey(transaction.start_month)
      const endMonth = transaction.end_month ? getMonthKey(transaction.end_month) : null
      if (isMonthInRange(currentMonthKey.value, startMonth, endMonth)) {
        total += transaction.amount
      }
    }
  }

  // One-time income
  for (const transaction of oneTimeTransactions.value) {
    if (transaction.type === 'income' && getMonthKey(transaction.transaction_date) === currentMonthKey.value) {
      total += transaction.amount
    }
  }

  return total
})

const currentMonthExpense = computed(() => {
  let total = 0

  // Recurring expense
  for (const transaction of recurringTransactions.value) {
    if (transaction.type === 'expense') {
      const startMonth = getMonthKey(transaction.start_month)
      const endMonth = transaction.end_month ? getMonthKey(transaction.end_month) : null
      if (isMonthInRange(currentMonthKey.value, startMonth, endMonth)) {
        total += transaction.amount
      }
    }
  }

  // One-time expense
  for (const transaction of oneTimeTransactions.value) {
    if (transaction.type === 'expense' && getMonthKey(transaction.transaction_date) === currentMonthKey.value) {
      total += transaction.amount
    }
  }

  return total
})

const currentMonthNet = computed(() => {
  return currentMonthIncome.value - currentMonthExpense.value
})

const currentBalance = computed(() => {
  return initialBalance.value + calculateTotalBalance()
})

const chartData = computed(() => {
  const data = []
  const now = new Date()

  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthKey = getMonthKey(date)

    let income = 0
    let expense = 0

    // Calculate recurring transactions
    for (const transaction of recurringTransactions.value) {
      const startMonth = getMonthKey(transaction.start_month)
      const endMonth = transaction.end_month ? getMonthKey(transaction.end_month) : null

      if (isMonthInRange(monthKey, startMonth, endMonth)) {
        if (transaction.type === 'income') {
          income += transaction.amount
        } else {
          expense += transaction.amount
        }
      }
    }

    // Calculate one-time transactions
    for (const transaction of oneTimeTransactions.value) {
      if (getMonthKey(transaction.transaction_date) === monthKey) {
        if (transaction.type === 'income') {
          income += transaction.amount
        } else {
          expense += transaction.amount
        }
      }
    }

    data.push({ month: monthKey, income, expense })
  }

  return data
})

const recentTransactions = computed(() => {
  const transactions = oneTimeTransactions.value
    .map((t) => ({
      id: t.id,
      title: t.title,
      amount: t.amount,
      type: t.type,
      date: t.transaction_date,
      category: t.category,
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  return transactions
})

const calculateTotalBalance = () => {
  let total = 0

  // Calculate all recurring transactions up to now
  const now = new Date()
  for (const transaction of recurringTransactions.value) {
    const startDate = new Date(transaction.start_month)
    const endDate = transaction.end_month ? new Date(transaction.end_month) : now

    let current = new Date(startDate.getFullYear(), startDate.getMonth(), 1)
    while (current <= now && current <= endDate) {
      const amount = transaction.type === 'income' ? transaction.amount : -transaction.amount
      total += amount
      current.setMonth(current.getMonth() + 1)
    }
  }

  // Calculate all one-time transactions
  for (const transaction of oneTimeTransactions.value) {
    const amount = transaction.type === 'income' ? transaction.amount : -transaction.amount
    total += amount
  }

  return total
}

const fetchData = async () => {
  loading.value = true
  try {
    // Fetch initial balance
    const { data: balanceData } = await supabase
      .from('initial_balance')
      .select('amount')
      .single()
    initialBalance.value = (balanceData as any)?.amount || 0

    // Fetch recurring transactions
    const { data: recurringData } = await supabase
      .from('recurring_transactions')
      .select('*, category:categories(*)')
      .eq('is_deleted', false)
    recurringTransactions.value = (recurringData || []) as RecurringTransaction[]

    // Fetch one-time transactions
    const { data: oneTimeData } = await supabase
      .from('one_time_transactions')
      .select('*, category:categories(*)')
      .eq('is_deleted', false)
    oneTimeTransactions.value = (oneTimeData || []) as OneTimeTransaction[]
  } catch (e) {
    console.error('Error fetching data:', e)
  } finally {
    loading.value = false
  }
}

const refreshData = () => {
  fetchData()
}

onMounted(() => {
  fetchData()
})
</script>

