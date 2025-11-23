import { ref } from 'vue'
import { supabase } from '../../../supabase/client'
import type { MonthlySummary, RecurringTransaction, OneTimeTransaction, YearlyTransaction } from '../../../shared/types'
import { getMonthKey, isMonthInRange } from '../../../shared/utils/date'

export function useMonthlySummary() {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const summaries = ref<MonthlySummary[]>([])
  const initialBalance = ref(0)

  const fetchInitialBalance = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('initial_balance')
        .select('amount')
        .single()

      if (fetchError) throw fetchError
      initialBalance.value = (data as any)?.amount || 0
    } catch (e) {
      console.error('Error fetching initial balance:', e)
      initialBalance.value = 0
    }
  }

  const calculateMonthlySummaries = async (startDate: Date, endDate: Date) => {
    loading.value = true
    error.value = null

    try {
      await fetchInitialBalance()

      // Fetch all recurring transactions
      const { data: recurringData, error: recurringError } = await supabase
        .from('recurring_transactions')
        .select('*')
        .eq('is_deleted', false)

      if (recurringError) throw recurringError
      const recurringTransactions = recurringData as RecurringTransaction[]

      // Fetch all yearly transactions
      const { data: yearlyData, error: yearlyError } = await supabase
        .from('yearly_transactions')
        .select('*')
        .eq('is_deleted', false)

      if (yearlyError) throw yearlyError
      const yearlyTransactions = yearlyData as YearlyTransaction[]

      // Fetch all one-time transactions within the date range
      const { data: oneTimeData, error: oneTimeError } = await supabase
        .from('one_time_transactions')
        .select('*')
        .eq('is_deleted', false)
        .gte('transaction_date', startDate.toISOString().split('T')[0])
        .lte('transaction_date', endDate.toISOString().split('T')[0])

      if (oneTimeError) throw oneTimeError
      const oneTimeTransactions = oneTimeData as OneTimeTransaction[]

      // Generate month keys
      const months: string[] = []
      const current = new Date(startDate.getFullYear(), startDate.getMonth(), 1)
      const end = new Date(endDate.getFullYear(), endDate.getMonth(), 1)

      while (current <= end) {
        months.push(getMonthKey(current))
        current.setMonth(current.getMonth() + 1)
      }

      // Calculate summaries for each month
      const monthlySummaries: MonthlySummary[] = []
      let runningBalance = initialBalance.value

      for (const monthKey of months) {
        let recurringIncome = 0
        let recurringExpense = 0
        let yearlyIncome = 0
        let yearlyExpense = 0
        let oneTimeIncome = 0
        let oneTimeExpense = 0

        // Parse month and year from monthKey (format: YYYY-MM)
        const [yearStr, monthStr] = monthKey.split('-')
        const year = Number(yearStr)
        const month = Number(monthStr)

        // Calculate recurring transactions for this month
        for (const transaction of recurringTransactions) {
          const startMonth = getMonthKey(transaction.start_month)
          const endMonth = transaction.end_month ? getMonthKey(transaction.end_month) : null

          if (isMonthInRange(monthKey, startMonth, endMonth)) {
            if (transaction.type === 'income') {
              recurringIncome += transaction.amount
            } else {
              recurringExpense += transaction.amount
            }
          }
        }

        // Calculate yearly transactions for this month
        for (const transaction of yearlyTransactions) {
          // Check if this month matches the occurrence month
          if (transaction.occurrence_month === month) {
            // Check if this year is within the transaction's year range
            if (year >= transaction.start_year && (transaction.end_year === null || year <= transaction.end_year)) {
              if (transaction.type === 'income') {
                yearlyIncome += transaction.amount
              } else {
                yearlyExpense += transaction.amount
              }
            }
          }
        }

        // Calculate one-time transactions for this month
        for (const transaction of oneTimeTransactions) {
          const transactionMonthKey = getMonthKey(transaction.transaction_date)
          if (transactionMonthKey === monthKey) {
            if (transaction.type === 'income') {
              oneTimeIncome += transaction.amount
            } else {
              oneTimeExpense += transaction.amount
            }
          }
        }

        const totalIncome = recurringIncome + yearlyIncome + oneTimeIncome
        const totalExpense = recurringExpense + yearlyExpense + oneTimeExpense
        const netBalance = totalIncome - totalExpense
        runningBalance += netBalance

        monthlySummaries.push({
          month: monthKey,
          recurringIncome,
          recurringExpense,
          yearlyIncome,
          yearlyExpense,
          oneTimeIncome,
          oneTimeExpense,
          totalIncome,
          totalExpense,
          netBalance,
          runningBalance,
        })
      }

      summaries.value = monthlySummaries
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to calculate summaries'
      console.error('Error calculating summaries:', e)
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    summaries,
    initialBalance,
    calculateMonthlySummaries,
  }
}

