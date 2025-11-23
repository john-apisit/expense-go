<template>
  <div class="w-full">
    <label v-if="label" :for="id" class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <input
      :id="id"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      :min="min"
      :max="max"
      :step="step"
      :class="inputClasses"
      @input="handleInput"
      @blur="handleBlur"
    />
    <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
    <p v-else-if="hint" class="mt-1 text-sm text-gray-500">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  id?: string
  type?: 'text' | 'email' | 'password' | 'number' | 'date' | 'month'
  modelValue?: string | number | null
  label?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  error?: string
  hint?: string
  min?: string | number
  max?: string | number
  step?: string | number
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  modelValue: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number | null]
  blur: []
}>()

const inputClasses = computed(() => {
  const base = 'block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:bg-gray-100 disabled:cursor-not-allowed'
  const errorClass = props.error
    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
  
  return `${base} ${errorClass}`
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (props.type === 'number') {
    const value = target.value === '' ? null : Number(target.value)
    emit('update:modelValue', value)
  } else {
    emit('update:modelValue', target.value)
  }
}

const handleBlur = () => {
  emit('blur')
}
</script>

