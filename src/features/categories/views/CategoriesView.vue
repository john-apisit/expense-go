<template>
  <Layout>
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">จัดการหมวดหมู่</h1>
          <p class="mt-1 text-sm text-gray-500">
            เพิ่ม แก้ไข หรือลบหมวดหมู่รายรับและรายจ่าย
          </p>
        </div>
        <BaseButton @click="handleAdd">
          <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          เพิ่มหมวดหมู่
        </BaseButton>
      </div>

      <!-- Info Card -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div class="flex">
          <div class="shrink-0">
            <svg class="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-blue-800">เกี่ยวกับหมวดหมู่</h3>
            <div class="mt-2 text-sm text-blue-700">
              <ul class="list-disc list-inside space-y-1">
                <li>หมวดหมู่ช่วยจัดระเบียบรายรับและรายจ่ายของคุณ</li>
                <li>การลบหมวดหมู่จะไม่ลบรายการที่เกี่ยวข้อง (Soft Delete)</li>
                <li>หมวดหมู่ที่ลบแล้วจะไม่แสดงในฟอร์มเพิ่มรายการ</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div v-if="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <CategoryList
        v-else
        :categories="categories"
        @edit="handleEdit"
        @delete="handleDelete"
      />

      <!-- Add/Edit Modal -->
      <BaseModal
        v-model="showModal"
        :title="editingCategory ? 'แก้ไขหมวดหมู่' : 'เพิ่มหมวดหมู่ใหม่'"
      >
        <CategoryForm
          :category="editingCategory"
          :loading="formLoading"
          :error="formError"
          @submit="handleSubmit"
          @cancel="closeModal"
        />
      </BaseModal>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Layout from '../../../shared/components/Layout.vue'
import BaseButton from '../../../shared/components/BaseButton.vue'
import BaseModal from '../../../shared/components/BaseModal.vue'
import CategoryForm from '../components/CategoryForm.vue'
import CategoryList from '../components/CategoryList.vue'
import { useCategories } from '../../../shared/composables/useCategories'
import type { Category } from '../../../shared/types'

const {
  categories,
  loading,
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = useCategories()

const showModal = ref(false)
const editingCategory = ref<Category | null>(null)
const formLoading = ref(false)
const formError = ref<string | null>(null)

const handleAdd = () => {
  editingCategory.value = null
  showModal.value = true
}

const handleEdit = (category: Category) => {
  editingCategory.value = category
  showModal.value = true
}

const handleSubmit = async (data: { name: string; type: 'income' | 'expense' }) => {
  formLoading.value = true
  formError.value = null

  try {
    if (editingCategory.value) {
      await updateCategory(editingCategory.value.id, data.name)
    } else {
      await createCategory(data.name, data.type)
    }
    await fetchCategories()
    closeModal()
  } catch (e) {
    formError.value = e instanceof Error ? e.message : 'เกิดข้อผิดพลาด'
  } finally {
    formLoading.value = false
  }
}

const handleDelete = async (category: Category) => {
  const message = `คุณต้องการลบหมวดหมู่ "${category.name}" หรือไม่?\n\nรายการที่ใช้หมวดหมู่นี้จะยังคงอยู่ แต่หมวดหมู่จะไม่แสดงในฟอร์มเพิ่มรายการใหม่`
  
  if (!confirm(message)) return

  try {
    await deleteCategory(category.id)
    await fetchCategories()
  } catch (e) {
    alert('เกิดข้อผิดพลาดในการลบหมวดหมู่')
  }
}

const closeModal = () => {
  showModal.value = false
  editingCategory.value = null
  formError.value = null
}

onMounted(() => {
  fetchCategories()
})
</script>

