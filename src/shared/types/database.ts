export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type TransactionType = 'expense' | 'income'

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          user_id: string
          name: string
          type: TransactionType
          is_deleted: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          type: TransactionType
          is_deleted?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          type?: TransactionType
          is_deleted?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      initial_balance: {
        Row: {
          id: string
          user_id: string
          amount: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          created_at?: string
        }
      }
      recurring_transactions: {
        Row: {
          id: string
          user_id: string
          title: string
          category_id: string
          amount: number
          type: TransactionType
          start_month: string
          end_month: string | null
          is_deleted: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          category_id: string
          amount: number
          type: TransactionType
          start_month: string
          end_month?: string | null
          is_deleted?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          category_id?: string
          amount?: number
          type?: TransactionType
          start_month?: string
          end_month?: string | null
          is_deleted?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      one_time_transactions: {
        Row: {
          id: string
          user_id: string
          title: string
          category_id: string
          amount: number
          type: TransactionType
          transaction_date: string
          is_deleted: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          category_id: string
          amount: number
          type: TransactionType
          transaction_date: string
          is_deleted?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          category_id?: string
          amount?: number
          type?: TransactionType
          transaction_date?: string
          is_deleted?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
    Functions: {
      seed_default_categories: {
        Args: { p_user_id: string }
        Returns: void
      }
    }
  }
}

