<template>
  <div class="space-y-6">
    <!-- Filter Tabs -->
    <div class="flex justify-between items-center">
      <div class="flex gap-2">
        <button
          :class="filterType === 'all' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'"
          class="px-4 py-2 rounded-md text-sm font-medium transition-colors"
          @click="filterType = 'all'"
        >
          ทั้งหมด ({{ categories.length }})
        </button>
        <button
          :class="filterType === 'income' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'"
          class="px-4 py-2 rounded-md text-sm font-medium transition-colors"
          @click="filterType = 'income'"
        >
          รายรับ ({{ incomeCount }})
        </button>
        <button
          :class="filterType === 'expense' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'"
          class="px-4 py-2 rounded-md text-sm font-medium transition-colors"
          @click="filterType = 'expense'"
        >
          รายจ่าย ({{ expenseCount }})
        </button>
      </div>
    </div>

    <!-- Categories Grid -->
    <div v-if="filteredCategories.length === 0" class="text-center py-12 bg-gray-50 rounded-lg">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
      <p class="mt-2 text-gray-500">ยังไม่มีหมวดหมู่</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="category in filteredCategories"
        :key="category.id"
        class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center gap-2">
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                :class="category.type === 'income' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'"
              >
                {{ category.type === 'income' ? 'รายรับ' : 'รายจ่าย' }}
              </span>
            </div>
            <h4 class="mt-2 font-medium text-gray-900">{{ category.name }}</h4>
            <p class="text-xs text-gray-400 mt-1">
              สร้างเมื่อ {{ formatDate(category.created_at) }}
            </p>
          </div>
          <div class="flex gap-1 ml-2">
            <button
              class="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              @click="$emit('edit', category)"
              title="แก้ไข"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              class="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
              @click="$emit('delete', category)"
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
import type { Category } from '../../../shared/types'
import { formatDate } from '../../../shared/utils/date'

interface Props {
  categories: Category[]
}

const props = defineProps<Props>()

defineEmits<{
  edit: [category: Category]
  delete: [category: Category]
}>()

const filterType = ref<'all' | 'income' | 'expense'>('all')

const filteredCategories = computed(() => {
  if (filterType.value === 'all') {
    return props.categories
  }
  return props.categories.filter((c) => c.type === filterType.value)
})

const incomeCount = computed(() => {
  return props.categories.filter((c) => c.type === 'income').length
})

const expenseCount = computed(() => {
  return props.categories.filter((c) => c.type === 'expense').length
})
</script>

