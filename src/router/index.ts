import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '../supabase/client'
import LoginView from '../features/auth/views/LoginView.vue'
import InitialBalanceView from '../features/initial-balance/views/InitialBalanceView.vue'
import DashboardView from '../features/dashboard/views/DashboardView.vue'
import RecurringTransactionsView from '../features/recurring-transactions/views/RecurringTransactionsView.vue'
import OneTimeTransactionsView from '../features/one-time-transactions/views/OneTimeTransactionsView.vue'
import MonthlySummaryView from '../features/monthly-summary/views/MonthlySummaryView.vue'
import CategoriesView from '../features/categories/views/CategoriesView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresAuth: false },
    },
    {
      path: '/initial-balance',
      name: 'initial-balance',
      component: InitialBalanceView,
      meta: { requiresAuth: true, requiresInitialBalance: false },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true, requiresInitialBalance: true },
    },
    {
      path: '/categories',
      name: 'categories',
      component: CategoriesView,
      meta: { requiresAuth: true, requiresInitialBalance: true },
    },
    {
      path: '/recurring-transactions',
      name: 'recurring-transactions',
      component: RecurringTransactionsView,
      meta: { requiresAuth: true, requiresInitialBalance: true },
    },
    {
      path: '/one-time-transactions',
      name: 'one-time-transactions',
      component: OneTimeTransactionsView,
      meta: { requiresAuth: true, requiresInitialBalance: true },
    },
    {
      path: '/monthly-summary',
      name: 'monthly-summary',
      component: MonthlySummaryView,
      meta: { requiresAuth: true, requiresInitialBalance: true },
    },
  ],
})

// Navigation guard
router.beforeEach(async (to, _from, next) => {
  const { data } = await supabase.auth.getSession()
  const isAuthenticated = !!data.session

  // Check if route requires authentication
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
    return
  }

  // Redirect to dashboard if authenticated user tries to access login
  if (to.path === '/login' && isAuthenticated) {
    next('/dashboard')
    return
  }

  // Check if user has set initial balance
  if (to.meta.requiresInitialBalance && isAuthenticated) {
    const { data: balanceData, error } = await supabase
      .from('initial_balance')
      .select('id')
      .single()

    if (error || !balanceData) {
      next('/initial-balance')
      return
    }
  }

  next()
})

export default router
