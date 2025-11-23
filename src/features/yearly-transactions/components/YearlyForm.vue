<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <BaseInput
      v-model="form.title"
      label="ชื่อรายการ"
      placeholder="เช่น ประกันรถยนต์, โบนัสประจำปี"
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
      <BaseSelect
        v-model="form.occurrence_month"
        label="เดือนที่เกิดรายการ"
        required
      >
        <option v-for="month in months" :key="month.value" :value="month.value">
          {{ month.label }}
        </option>
      </BaseSelect>

      <div class="flex items-end">
        <label class="flex items-center gap-2 text-sm text-gray-700 cursor-pointer pb-2">
          <input
            type="checkbox"
            v-model="isOngoing"
            class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span>ไม่มีกำหนด</span>
        </label>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <BaseInput
        v-model.number="form.start_year"
        type="number"
        label="ปีเริ่มต้น"
        placeholder="2024"
        required
        :min="2000"
        :max="2100"
      />

      <BaseInput
        v-model.number="form.end_year"
        type="number"
        label="ปีสิ้นสุด"
        placeholder="2025"
        :disabled="isOngoing"
        :min="form.start_year"
        :max="2100"
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
import type { YearlyTransaction } from '../../../shared/types'

interface Props {
  transaction?: YearlyTransaction | null
  loading?: boolean
  error?: string | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  submit: [data: any]
  cancel: []
}>()

const { categories } = useCategories()

const months = [
  { value: 1, label: 'มกราคม' },
  { value: 2, label: 'กุมภาพันธ์' },
  { value: 3, label: 'มีนาคม' },
  { value: 4, label: 'เมษายน' },
  { value: 5, label: 'พฤษภาคม' },
  { value: 6, label: 'มิถุนายน' },
  { value: 7, label: 'กรกฎาคม' },
  { value: 8, label: 'สิงหาคม' },
  { value: 9, label: 'กันยายน' },
  { value: 10, label: 'ตุลาคม' },
  { value: 11, label: 'พฤศจิกายน' },
  { value: 12, label: 'ธันวาคม' },
]

const currentYear = new Date().getFullYear()

const form = ref({
  title: '',
  type: 'expense' as 'expense' | 'income',
  category_id: '',
  amount: 0,
  occurrence_month: 1,
  start_year: currentYear,
  end_year: null as number | null,
})

const isOngoing = ref(true)

const filteredCategories = computed(() => {
  return categories.value.filter(
    (c) => c.type === form.value.type && !c.is_deleted
  )
})

watch(isOngoing, (value) => {
  if (value) {
    form.value.end_year = null
  } else if (!form.value.end_year) {
    form.value.end_year = form.value.start_year + 1
  }
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
        occurrence_month: transaction.occurrence_month,
        start_year: transaction.start_year,
        end_year: transaction.end_year,
      }
      isOngoing.value = transaction.end_year === null
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
    end_year: isOngoing.value ? null : form.value.end_year,
  }
  emit('submit', data)
}
</script>

