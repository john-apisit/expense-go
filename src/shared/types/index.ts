export type { Database, TransactionType } from './database'

export interface Category {
  id: string
  user_id: string
  name: string
  type: 'expense' | 'income'
  is_deleted: boolean
  created_at: string
  updated_at: string
}

export interface InitialBalance {
  id: string
  user_id: string
  amount: number
  created_at: string
}

export interface RecurringTransaction {
  id: string
  user_id: string
  title: string
  category_id: string
  amount: number
  type: 'expense' | 'income'
  start_month: string
  end_month: string | null
  is_deleted: boolean
  created_at: string
  updated_at: string
  category?: Category
}

export interface OneTimeTransaction {
  id: string
  user_id: string
  title: string
  category_id: string
  amount: number
  type: 'expense' | 'income'
  transaction_date: string
  is_deleted: boolean
  created_at: string
  updated_at: string
  category?: Category
}

export interface MonthlySummary {
  month: string // YYYY-MM format
  recurringIncome: number
  recurringExpense: number
  oneTimeIncome: number
  oneTimeExpense: number
  totalIncome: number
  totalExpense: number
  netBalance: number
  runningBalance: number
}

