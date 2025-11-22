<template>
  <div class="w-full max-w-md">
    <div class="bg-white shadow-lg rounded-lg px-8 py-10">
      <div class="mb-8 text-center">
        <h2 class="text-3xl font-bold text-gray-900">Expense Go</h2>
        <p class="mt-2 text-sm text-gray-600">จัดการค่าใช้จ่ายส่วนตัว</p>
      </div>

      <form @submit.prevent="handleSubmit">
        <BaseInput
          v-model="email"
          type="email"
          label="อีเมล"
          placeholder="your@email.com"
          required
          :error="emailError"
          class="mb-4"
        />

        <BaseInput
          v-model="password"
          type="password"
          label="รหัสผ่าน"
          placeholder="••••••••"
          required
          :error="passwordError"
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
          class="mb-4"
        >
          {{ isSignUp ? 'สมัครสมาชิก' : 'เข้าสู่ระบบ' }}
        </BaseButton>

        <div class="text-center">
          <button
            type="button"
            class="text-sm text-blue-600 hover:text-blue-500"
            @click="toggleMode"
          >
            {{ isSignUp ? 'มีบัญชีอยู่แล้ว? เข้าสู่ระบบ' : 'ยังไม่มีบัญชี? สมัครสมาชิก' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseInput from '../../../shared/components/BaseInput.vue'
import BaseButton from '../../../shared/components/BaseButton.vue'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { signIn, signUp, loading, error } = useAuth()

const email = ref('')
const password = ref('')
const emailError = ref('')
const passwordError = ref('')
const isSignUp = ref(false)

const toggleMode = () => {
  isSignUp.value = !isSignUp.value
  error.value = null
  emailError.value = ''
  passwordError.value = ''
}

const handleSubmit = async () => {
  emailError.value = ''
  passwordError.value = ''

  if (!email.value) {
    emailError.value = 'กรุณากรอกอีเมล'
    return
  }

  if (!password.value) {
    passwordError.value = 'กรุณากรอกรหัสผ่าน'
    return
  }

  if (password.value.length < 6) {
    passwordError.value = 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'
    return
  }

  try {
    if (isSignUp.value) {
      await signUp(email.value, password.value)
      alert('สมัครสมาชิกสำเร็จ! กรุณาตรวจสอบอีเมลเพื่อยืนยันบัญชี')
    } else {
      await signIn(email.value, password.value)
      router.push('/dashboard')
    }
  } catch (e) {
    // Error is handled by useAuth composable
  }
}
</script>

