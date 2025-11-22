<template>
  <div class="bg-white rounded-lg shadow p-4">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
      <BaseInput
        v-model="localStartMonth"
        type="month"
        label="เดือนเริ่มต้น"
      />
      <BaseInput
        v-model="localEndMonth"
        type="month"
        label="เดือนสิ้นสุด"
      />
      <BaseButton @click="handleApply">
        แสดงผล
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import BaseInput from '../../../shared/components/BaseInput.vue'
import BaseButton from '../../../shared/components/BaseButton.vue'
import { formatMonthInput } from '../../../shared/utils/date'

interface Props {
  startMonth: string
  endMonth: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  apply: [startMonth: string, endMonth: string]
}>()

const localStartMonth = ref(props.startMonth)
const localEndMonth = ref(props.endMonth)

watch(() => props.startMonth, (value) => {
  localStartMonth.value = value
})

watch(() => props.endMonth, (value) => {
  localEndMonth.value = value
})

const handleApply = () => {
  emit('apply', localStartMonth.value, localEndMonth.value)
}
</script>

