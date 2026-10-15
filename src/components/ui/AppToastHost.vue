<script setup lang="ts">
import { useI18n } from '@/composables/useI18n'
import { useToastStore, type ToastVariant } from '@/stores/toast'

const { t } = useI18n()
const toast = useToastStore()

function variantClass(variant: ToastVariant) {
  if (variant === 'success') return 'border-green-200 bg-white text-green-900'
  if (variant === 'error') return 'border-red-200 bg-white text-red-800'
  return 'border-gray-light bg-white text-text'
}

function accentClass(variant: ToastVariant) {
  if (variant === 'success') return 'bg-green-600'
  if (variant === 'error') return 'bg-red-600'
  return 'bg-deep'
}
</script>

<template>
  <Teleport to="body">
    <div
      class="pointer-events-none fixed inset-x-0 bottom-0 z-[600] flex flex-col items-end gap-2 px-4 py-5 sm:px-6"
      aria-live="polite"
      aria-relevant="additions"
    >
      <div
        v-for="item in toast.items"
        :key="item.id"
        class="pointer-events-auto flex w-full max-w-sm overflow-hidden rounded-radius border shadow-[0_16px_40px_rgba(6,14,20,0.14)]"
        :class="variantClass(item.variant)"
        role="status"
      >
        <span class="w-1.5 shrink-0" :class="accentClass(item.variant)" aria-hidden="true" />
        <div class="flex min-w-0 flex-1 items-start gap-3 px-3.5 py-3">
          <p class="min-w-0 flex-1 text-sm font-medium leading-snug">{{ item.message }}</p>
          <button
            type="button"
            class="shrink-0 rounded-radius-sm px-1.5 py-0.5 text-xs font-semibold text-text-muted hover:bg-surface hover:text-text"
            :aria-label="t('admin.toast.close')"
            @click="toast.dismiss(item.id)"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
