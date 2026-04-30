import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import './style.css'
import App from './App.vue'
import { setUnauthorizedHandler } from './api/auth-token'
import { useAuthStore } from './stores/auth'

async function bootstrap() {
  const app = createApp(App)
  const pinia = createPinia()
  app.use(pinia)

  const authStore = useAuthStore()
  setUnauthorizedHandler(() => {
    authStore.logoutLocal()
    void router.push({ name: 'login' })
  })

  await authStore.hydrateFromStorage()

  app.use(router)
  app.mount('#app')
}

void bootstrap()
