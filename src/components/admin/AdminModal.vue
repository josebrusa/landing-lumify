<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = defineProps<{
  open: boolean
  title: string
  description?: string
}>()

const emit = defineEmits<{
  close: []
}>()

const rootRef = ref<HTMLElement | null>(null)

watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) return
    // Best-effort initial focus for keyboard users.
    queueMicrotask(() => {
      const el = rootRef.value
      const first = el?.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )
      first?.focus()
    })
  },
)

const labelledBy = computed(() => `admin-modal-title-${props.title.replace(/\s+/g, '-').toLowerCase()}`)
const describedBy = computed(() =>
  props.description ? `admin-modal-desc-${props.title.replace(/\s+/g, '-').toLowerCase()}` : undefined,
)

function onOverlayClick(e: MouseEvent) {
  if ((e.target as HTMLElement).dataset.overlay === 'true') emit('close')
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close')
}
</script>

<template>
  <Teleport to="body">
    <div
      v-show="open"
      data-overlay="true"
      class="fixed inset-0 z-500 bg-[rgba(6,14,20,0.25)] backdrop-blur-sm flex items-center justify-center px-4 py-6"
      @click="onOverlayClick"
      @keydown="onKeydown"
    >
      <section
        v-if="open"
        ref="rootRef"
        class="w-full max-w-lg rounded-radius border border-gray-light bg-white p-5 shadow-[0_24px_70px_rgba(0,0,0,0.18)]"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="labelledBy"
        :aria-describedby="describedBy"
        @click.stop
      >
        <header class="mb-4">
          <h2 :id="labelledBy" class="font-heading text-lg font-bold text-text">
            {{ title }}
          </h2>
          <p v-if="description" :id="describedBy" class="mt-1 text-sm text-text-muted">
            {{ description }}
          </p>
        </header>

        <div>
          <slot />
        </div>
      </section>
    </div>
  </Teleport>
</template>
