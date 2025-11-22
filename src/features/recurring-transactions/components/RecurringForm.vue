<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <BaseInput
      v-model="form.title"
      label="ชื่อรายการ"
      placeholder="เช่น เงินเดือน, ค่าเช่าบ้าน"
      required
    />

    <div class="grid grid-cols-2 gap-4">
      <BaseSelect
        v-model="form.type"
        label="ประเภท"
        required
        @update:model-value="handleTypeChange"
      >
        <option value="income">รายรับ</option>
        <option value="expense">รายจ่าย</option>
      </BaseSelect>

      <BaseSelect
        v-model="form.category_id"
        label="หมวดหมู่"
        required
        placeholder="เลือกหมวดหมู่"
      >
        <option
          v-for="cat in filteredCategories"
          :key="cat.id"
          :value="cat.id"
        >
          {{ cat.name }}
        </option>
      </BaseSelect>
    </div>

    <BaseInput
      v-model="form.amount"
      type="number"
      label="จำนวนเงิน (บาท)"
      placeholder="0.00"
      required
      step="0.01"
      min="0"
    />

    <div class="grid grid-cols-2 gap-4">
      <BaseInput
        v-model="form.start_month"
        type="month"
        label="เดือนเริ่มต้น"
        required
      />

      <BaseInput
        v-model="form.end_month"
        type="month"
        label="เดือนสิ้นสุด"
        hint="ไม่ระบุหากเป็นรายการต่อเนื่อง"
      />
    </div>

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
        {{ transaction ? 'บันทึก' : 'เพิ่ม' }}
      </BaseButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import BaseInput from '../../../shared/components/BaseInput.vue'
import BaseSelect from '../../../shared/components/BaseSelect.vue'
import BaseButton from '../../../shared/components/BaseButton.vue'
import { useCategories } from '../../../shared/composables/useCategories'
import type { RecurringTransaction } from '../../../shared/types'
import { formatMonthInput } from '../../../shared/utils/date'

interface Props {
  transaction?: RecurringTransaction | null
  loading?: boolean
  error?: string | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  submit: [data: any]
  cancel: []
}>()

const { categories } = useCategories()

const form = ref({
  title: '',
  type: 'expense' as 'expense' | 'income',
  category_id: '',
  amount: 0,
  start_month: formatMonthInput(new Date()),
  end_month: '',
})

const filteredCategories = computed(() => {
  return categories.value.filter(
    (c) => c.type === form.value.type && !c.is_deleted
  )
})

watch(
  () => props.transaction,
  (transaction) => {
    if (transaction) {
      form.value = {
        title: transaction.title,
        type: transaction.type,
        category_id: transaction.category_id,
        amount: transaction.amount,
        start_month: formatMonthInput(transaction.start_month),
        end_month: transaction.end_month ? formatMonthInput(transaction.end_month) : '',
      }
    }
  },
  { immediate: true }
)

const handleTypeChange = () => {
  form.value.category_id = ''
}

const handleSubmit = () => {
  const data = {
    ...form.value,
    start_month: form.value.start_month + '-01',
    end_month: form.value.end_month ? form.value.end_month + '-01' : null,
  }
  emit('submit', data)
}
</script>

