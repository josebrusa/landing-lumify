import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import Training from '../pages/Training.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/training',
      name: 'training',
      component: Training,
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../pages/Login.vue'),
      meta: { guestFocused: true },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../pages/Register.vue'),
      meta: { guestFocused: true },
    },
    {
      path: '/verify-otp',
      name: 'verify-otp',
      component: () => import('../pages/VerifyOtp.vue'),
      meta: { guestFocused: true },
    },
    {
      path: '/admin',
      component: () => import('../pages/admin/AdminLayout.vue'),
      meta: { requiresAuth: true, requiresAdmin: true },
      children: [
        {
          path: '',
          name: 'admin-home',
          component: () => import('../pages/admin/AdminHome.vue'),
        },
        {
          path: 'settings',
          name: 'admin-settings',
          component: () => import('../pages/admin/AdminSettings.vue'),
        },
        {
          path: 'leads/:id',
          name: 'admin-lead-detail',
          component: () => import('../pages/admin/AdminLeadDetail.vue'),
        },
      ],
    },
  ],
  scrollBehavior(to) {
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }
    return { top: 0 }
  },
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()
  if (!auth.initialized) {
    await auth.hydrateFromStorage()
  }

  const needsAuth = to.matched.some((r) => r.meta.requiresAuth)
  const needsAdmin = to.matched.some((r) => r.meta.requiresAdmin)

  if (needsAuth && !auth.isAuthenticated) {
    return {
      name: 'login',
      query: { redirect: to.fullPath },
    }
  }

  if (needsAdmin && !auth.hasRole('admin')) {
    return { name: 'home' }
  }

  const guestFocused = to.matched.some((r) => r.meta.guestFocused)
  if (guestFocused && auth.isAuthenticated) {
    const redirect =
      typeof to.query.redirect === 'string' && to.query.redirect.startsWith('/')
        ? to.query.redirect
        : undefined
    if (redirect) return redirect
    return auth.hasRole('admin') ? '/admin' : '/'
  }

  return true
})

export default router
