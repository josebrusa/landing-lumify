import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import Home from '../pages/Home.vue'
import Login from '../pages/Login.vue'
import Register from '../pages/Register.vue'
import VerifyOtp from '../pages/VerifyOtp.vue'
import Admin from '../pages/Admin.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { guestOnly: true },
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
      meta: { guestOnly: true },
    },
    {
      path: '/verify-otp',
      name: 'verify-otp',
      component: VerifyOtp,
      meta: { requiresOtpChallenge: true },
    },
    {
      path: '/admin',
      name: 'admin',
      component: Admin,
      meta: { requiresAuth: true },
    },
  ],
  scrollBehavior(to) {
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }
    return { top: 0 }
  },
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (to.meta.requiresOtpChallenge) {
    if (auth.isAuthenticated) {
      const redir =
        typeof to.query.redirect === 'string' && to.query.redirect.startsWith('/') && !to.query.redirect.startsWith('//')
          ? to.query.redirect
          : undefined
      return redir ? { path: redir } : { name: 'admin' }
    }
    if (!auth.challengeId) {
      return { name: 'login' }
    }
  }

  if (to.meta.guestOnly && auth.isAuthenticated) {
    const raw = typeof to.query.redirect === 'string' ? to.query.redirect : ''
    if (raw.startsWith('/') && !raw.startsWith('//')) {
      return { path: raw }
    }
    return { name: 'admin' }
  }

  return true
})

export default router
