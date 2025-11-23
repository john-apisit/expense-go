<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <!-- Mobile menu button -->
            <button
              @click="toggleMobileMenu"
              class="sm:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors"
              aria-label="เมนู"
            >
              <!-- Hamburger icon when menu is closed -->
              <svg
                v-if="!isMobileMenuOpen"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <!-- Close icon when menu is open -->
              <svg
                v-else
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <!-- Logo -->
            <div class="shrink-0 flex items-center ml-2 sm:ml-0">
              <h1 class="text-xl font-bold text-blue-600">Expense Go</h1>
            </div>

            <!-- Desktop menu -->
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
                รายการประจำเดือน
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
              class="hidden sm:block ml-4 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              ออกจากระบบ
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile menu -->
      <div
        v-if="isMobileMenuOpen"
        class="sm:hidden bg-white border-t border-gray-200"
      >
        <div class="px-2 pt-2 pb-3 space-y-1">
          <router-link
            to="/dashboard"
            @click="closeMobileMenu"
            class="block px-3 py-2 text-base font-medium rounded-md transition-colors"
            :class="isActive('/dashboard') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'"
          >
            แดชบอร์ด
          </router-link>
          <router-link
            to="/categories"
            @click="closeMobileMenu"
            class="block px-3 py-2 text-base font-medium rounded-md transition-colors"
            :class="isActive('/categories') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'"
          >
            หมวดหมู่
          </router-link>
          <router-link
            to="/recurring-transactions"
            @click="closeMobileMenu"
            class="block px-3 py-2 text-base font-medium rounded-md transition-colors"
            :class="isActive('/recurring-transactions') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'"
          >
            รายการประจำเดือน
          </router-link>
          <router-link
            to="/yearly-transactions"
            @click="closeMobileMenu"
            class="block px-3 py-2 text-base font-medium rounded-md transition-colors"
            :class="isActive('/yearly-transactions') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'"
          >
            รายการประจำปี
          </router-link>
          <router-link
            to="/one-time-transactions"
            @click="closeMobileMenu"
            class="block px-3 py-2 text-base font-medium rounded-md transition-colors"
            :class="isActive('/one-time-transactions') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'"
          >
            รายการครั้งเดียว
          </router-link>
          <router-link
            to="/monthly-summary"
            @click="closeMobileMenu"
            class="block px-3 py-2 text-base font-medium rounded-md transition-colors"
            :class="isActive('/monthly-summary') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'"
          >
            สรุปรายเดือน
          </router-link>
          <button
            @click="handleLogout"
            class="w-full text-left block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
          >
            ออกจากระบบ
          </button>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <slot></slot>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { supabase } from '../../supabase/client'

const router = useRouter()
const route = useRoute()
const isMobileMenuOpen = ref(false)

const isActive = (path: string) => {
  return route.path === path || route.path.startsWith(path + '/')
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const handleLogout = async () => {
  await supabase.auth.signOut()
  router.push('/login')
}

// Close mobile menu when route changes
watch(route, () => {
  isMobileMenuOpen.value = false
})
</script>

