<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <h1 class="text-xl font-bold text-blue-600">Expense Go</h1>
            </div>
            <div class="hidden sm:ml-6 sm:flex sm:space-x-4">
              <router-link
                to="/dashboard"
                class="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors"
                :class="isActive('/dashboard') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'"
              >
                แดชบอร์ด
              </router-link>
              <router-link
                to="/categories"
                class="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors"
                :class="isActive('/categories') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'"
              >
                หมวดหมู่
              </router-link>
              <router-link
                to="/recurring-transactions"
                class="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors"
                :class="isActive('/recurring-transactions') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'"
              >
                รายการประจำ
              </router-link>
              <router-link
                to="/yearly-transactions"
                class="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors"
                :class="isActive('/yearly-transactions') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'"
              >
                รายการประจำปี
              </router-link>
              <router-link
                to="/one-time-transactions"
                class="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors"
                :class="isActive('/one-time-transactions') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'"
              >
                รายการครั้งเดียว
              </router-link>
              <router-link
                to="/monthly-summary"
                class="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors"
                :class="isActive('/monthly-summary') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'"
              >
                สรุปรายเดือน
              </router-link>
            </div>
          </div>
          <div class="flex items-center">
            <button
              @click="handleLogout"
              class="ml-4 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              ออกจากระบบ
            </button>
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <slot></slot>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { supabase } from '../../supabase/client'

const router = useRouter()
const route = useRoute()

const isActive = (path: string) => {
  return route.path === path || route.path.startsWith(path + '/')
}

const handleLogout = async () => {
  await supabase.auth.signOut()
  router.push('/login')
}
</script>

