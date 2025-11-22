<template>
  <div class="bg-white rounded-lg shadow p-6 border-l-4" :class="borderColor">
    <div class="flex items-center justify-between">
      <div class="flex-1">
        <p class="text-sm font-medium text-gray-500 uppercase">{{ title }}</p>
        <p class="mt-2 text-3xl font-bold" :class="textColor">
          {{ formatCurrency(amount) }}
        </p>
        <p v-if="subtitle" class="mt-1 text-xs text-gray-500">{{ subtitle }}</p>
      </div>
      <div class="ml-4" :class="iconBgColor">
        <div class="p-3 rounded-lg">
          <slot name="icon">
            <svg class="w-8 h-8" :class="iconColor" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { formatCurrency } from '../../../shared/utils/currency'

interface Props {
  title: string
  amount: number
  subtitle?: string
  variant?: 'blue' | 'green' | 'red' | 'purple'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'blue',
})

const borderColor = computed(() => {
  const colors = {
    blue: 'border-blue-500',
    green: 'border-green-500',
    red: 'border-red-500',
    purple: 'border-purple-500',
  }
  return colors[props.variant]
})

const textColor = computed(() => {
  const colors = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    red: 'text-red-600',
    purple: 'text-purple-600',
  }
  return colors[props.variant]
})

const iconBgColor = computed(() => {
  const colors = {
    blue: 'bg-blue-50',
    green: 'bg-green-50',
    red: 'bg-red-50',
    purple: 'bg-purple-50',
  }
  return colors[props.variant]
})

const iconColor = computed(() => {
  const colors = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    red: 'text-red-600',
    purple: 'text-purple-600',
  }
  return colors[props.variant]
})
</script>

