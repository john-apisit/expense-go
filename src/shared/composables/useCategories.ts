import { ref, computed } from 'vue'
import { supabase } from '../../supabase/client'
import type { Category } from '../types'

export function useCategories() {
  const categories = ref<Category[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const expenseCategories = computed(() =>
    categories.value.filter((c) => c.type === 'expense' && !c.is_deleted)
  )

  const incomeCategories = computed(() =>
    categories.value.filter((c) => c.type === 'income' && !c.is_deleted)
  )

  const fetchCategories = async () => {
    loading.value = true
    error.value = null
    try {
      const { data, error: fetchError } = await supabase
        .from('categories')
        .select('*')
        .eq('is_deleted', false)
        .order('name')

      if (fetchError) throw fetchError
      categories.value = (data || []) as Category[]
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch categories'
      console.error('Error fetching categories:', e)
    } finally {
      loading.value = false
    }
  }
  fetchCategories()

  const createCategory = async (name: string, type: 'expense' | 'income') => {
    loading.value = true
    error.value = null
    try {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) throw new Error('User not authenticated')

      const { data, error: insertError } = await supabase
        .from('categories')
        // @ts-ignore - Supabase type inference issue
        .insert({ name, type, user_id: userData.user.id })
        .select()
        .single()

      if (insertError) throw insertError
      if (data) {
        categories.value.push(data as Category)
      }
      return data as Category
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to create category'
      console.error('Error creating category:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  const updateCategory = async (id: string, name: string) => {
    loading.value = true
    error.value = null
    try {
      const { data, error: updateError } = await supabase
        .from('categories')
        // @ts-ignore - Supabase type inference issue
        .update({ name })
        .eq('id', id)
        .select()
        .single()

      if (updateError) throw updateError
      if (data) {
        const index = categories.value.findIndex((c) => c.id === id)
        if (index !== -1) {
          categories.value[index] = data as Category
        }
      }
      return data as Category
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to update category'
      console.error('Error updating category:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  const deleteCategory = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      const { data, error: deleteError } = await supabase
        .from('categories')
        // @ts-ignore - Supabase type inference issue
        .update({ is_deleted: true })
        .eq('id', id)
        .select()
        .single()

      if (deleteError) throw deleteError
      if (data) {
        const index = categories.value.findIndex((c) => c.id === id)
        if (index !== -1) {
          categories.value[index] = data as Category
        }
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to delete category'
      console.error('Error deleting category:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    categories,
    expenseCategories,
    incomeCategories,
    loading,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  }
}
