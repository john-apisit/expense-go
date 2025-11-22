<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <BaseInput
      v-model="form.name"
      label="ชื่อหมวดหมู่"
      placeholder="เช่น อาหาร, เงินเดือน"
      required
    />

    <BaseSelect
      v-model="form.type"
      label="ประเภท"
      required
    >
      <option value="income">รายรับ</option>
      <option value="expense">รายจ่าย</option>
    </BaseSelect>

    <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-lg">
      <p class="text-sm text-red-600">{{ error }}</p>
    </div>

    <div class="flex justify-end gap-2">
      <BaseButton
        type="button"
        variant="ghost"
        @click="$emit('cancel')"
      >
        ยกเลิก
      </BaseButton>
      <BaseButton
        type="submit"
        :loading="loading"
        :disabled="loading"
      >
        {{ category ? 'บันทึก' : 'เพิ่ม' }}
      </BaseButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import BaseInput from '../../../shared/components/BaseInput.vue'
import BaseSelect from '../../../shared/components/BaseSelect.vue'
import BaseButton from '../../../shared/components/BaseButton.vue'
import type { Category } from '../../../shared/types'

interface Props {
  category?: Category | null
  loading?: boolean
  error?: string | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  submit: [data: { name: string; type: 'income' | 'expense' }]
  cancel: []
}>()

const form = ref({
  name: '',
  type: 'expense' as 'income' | 'expense',
})

watch(
  () => props.category,
  (category) => {
    if (category) {
      form.value = {
        name: category.name,
        type: category.type,
      }
    } else {
      form.value = {
        name: '',
        type: 'expense',
      }
    }
  },
  { immediate: true }
)

const handleSubmit = () => {
  if (!form.value.name.trim()) return
  emit('submit', form.value)
}
</script>

