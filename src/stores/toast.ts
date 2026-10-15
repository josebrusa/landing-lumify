import { ref } from 'vue'
import { defineStore } from 'pinia'

export type ToastVariant = 'success' | 'error' | 'info'

export interface ToastItem {
  id: string
  message: string
  variant: ToastVariant
}

const DEFAULT_TTL_MS = 4200

export const useToastStore = defineStore('toast', () => {
  const items = ref<ToastItem[]>([])
  const timers = new Map<string, ReturnType<typeof setTimeout>>()

  function dismiss(id: string) {
    const timer = timers.get(id)
    if (timer) {
      clearTimeout(timer)
      timers.delete(id)
    }
    items.value = items.value.filter((item) => item.id !== id)
  }

  function push(message: string, variant: ToastVariant = 'info', ttlMs = DEFAULT_TTL_MS) {
    const trimmed = message.trim()
    if (!trimmed) return
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    items.value = [...items.value.slice(-4), { id, message: trimmed, variant }]
    const timer = setTimeout(() => dismiss(id), ttlMs)
    timers.set(id, timer)
  }

  function success(message: string, ttlMs?: number) {
    push(message, 'success', ttlMs)
  }

  function error(message: string, ttlMs?: number) {
    push(message, 'error', ttlMs ?? 5600)
  }

  function info(message: string, ttlMs?: number) {
    push(message, 'info', ttlMs)
  }

  return {
    items,
    push,
    dismiss,
    success,
    error,
    info,
  }
})
