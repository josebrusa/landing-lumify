<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '@/composables/useI18n'

const props = defineProps<{
  /** Translation key prefix, e.g. legal.privacy */
  prefix: 'legal.privacy' | 'legal.terms' | 'legal.cookies'
}>()

const { t } = useI18n()

const sections = computed(() => {
  const list: { title: string; body: string }[] = []
  for (let i = 1; i <= 6; i++) {
    const titleKey = `${props.prefix}.s${i}_title`
    const bodyKey = `${props.prefix}.s${i}_body`
    const title = t(titleKey)
    const body = t(bodyKey)
    if (title === titleKey) break
    list.push({ title, body })
  }
  return list
})
</script>

<template>
  <div class="min-h-screen bg-surface px-[5%] py-12 sm:py-16">
    <article class="mx-auto max-w-2xl">
      <h1 class="font-heading text-3xl sm:text-4xl font-extrabold text-text tracking-tight">
        {{ t(`${prefix}.title`) }}
      </h1>
      <p class="mt-2 text-sm text-text-muted">{{ t(`${prefix}.updated`) }}</p>
      <div class="mt-10 flex flex-col gap-8">
        <section v-for="(section, idx) in sections" :key="idx">
          <h2 class="font-heading text-lg font-bold text-deep mb-2">{{ section.title }}</h2>
          <p class="text-[0.95rem] text-text-muted leading-relaxed">{{ section.body }}</p>
        </section>
      </div>
    </article>
  </div>
</template>
