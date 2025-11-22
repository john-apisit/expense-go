<template>
  <div class="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
    <div class="mb-6 text-center">
      <h2 class="text-2xl font-bold text-gray-900">ตั้งค่ายอดเงินเริ่มต้น</h2>
      <p class="mt-2 text-sm text-gray-600">
        กรุณากรอกยอดเงินที่คุณมีอยู่ในปัจจุบันเพื่อเริ่มต้นใช้งาน
      </p>
    </div>

    <form @submit.prevent="handleSubmit">
      <BaseInput
        v-model="amount"
        type="number"
        label="ยอดเงินเริ่มต้น (บาท)"
        placeholder="0.00"
        required
        step="0.01"
        min="0"
        :error="amountError"
        class="mb-6"
      />

      <div v-if="error" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
        <p class="text-sm text-red-600">{{ error }}</p>
      </div>

      <BaseButton
        type="submit"
        :loading="loading"
        :disabled="loading"
        full-width
      >
        บันทึก
      </BaseButton>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BaseInput from '../../../shared/components/BaseInput.vue'
import BaseButton from '../../../shared/components/BaseButton.vue'

interface Props {
  loading?: boolean
  error?: string | null
}

defineProps<Props>()

const emit = defineEmits<{
  submit: [amount: number]
}>()

const amount = ref<number>(0)
const amountError = ref('')

const handleSubmit = () => {
  amountError.value = ''

  if (!amount.value || amount.value < 0) {
    amountError.value = 'กรุณากรอกยอดเงินที่ถูกต้อง'
    return
  }

  emit('submit', amount.value)
}
</script>

