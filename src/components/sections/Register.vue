<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from '../../composables/useI18n'
import { PhClipboard, PhChartBar, PhTarget } from '@phosphor-icons/vue'

const { t } = useI18n()

const company = ref('')
const email = ref('')
const submitted = ref(false)

const perks = [
  { key: 'reg.p1', icon: PhClipboard },
  { key: 'reg.p2', icon: PhChartBar },
  { key: 'reg.p3', icon: PhTarget },
]

function onSubmit() {
  submitted.value = true
  company.value = ''
  email.value = ''
}
</script>

<template>
  <section
    id="registro"
    class="py-[100px] px-[5%] relative overflow-hidden bg-[linear-gradient(135deg,#0a3d62_0%,#0d4f7e_60%,#0a3558_100%)]"
  >
    <div
      class="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_70%_70%_at_80%_50%,rgba(60,157,255,0.15)_0%,transparent_70%)]"
    />
    <div class="relative z-10 max-w-[700px] mx-auto text-center">
      <div class="reveal">
        <div class="text-xs font-bold tracking-[2px] uppercase text-blue mb-3.5">{{ t('reg.label') }}</div>
        <h2 class="font-heading text-[clamp(1.9rem,4vw,2.8rem)] font-extrabold text-white leading-[1.1] tracking-[-0.8px]">
          {{ t('reg.title') }}
        </h2>
        <p class="text-base text-white/70 leading-[1.75] mt-4 mb-12">
          {{ t('reg.desc') }}
        </p>
      </div>
      <div class="flex justify-center gap-8 flex-wrap mb-10 reveal">
        <div
          v-for="p in perks"
          :key="p.key"
          class="flex items-center gap-2 text-white/65 text-[0.87rem]"
        >
          <div class="w-7 h-7 rounded-full bg-blue/20 flex items-center justify-center shrink-0 text-blue">
            <component :is="p.icon" :size="16" weight="regular" />
          </div>
          {{ t(p.key) }}
        </div>
      </div>
      <form
        v-if="!submitted"
        class="flex gap-3 flex-wrap justify-center reveal"
        @submit.prevent="onSubmit"
      >
        <input
          v-model="company"
          type="text"
          :placeholder="t('reg.company')"
          class="flex-1 min-w-[240px] max-w-[340px] py-4 px-5 rounded-full border-[1.5px] border-white/20 bg-white/10 text-white text-[0.95rem] outline-none transition-[border-color] focus:border-blue placeholder:text-white/40"
        />
        <input
          v-model="email"
          type="email"
          :placeholder="t('reg.email')"
          required
          class="flex-1 min-w-[240px] max-w-[340px] py-4 px-5 rounded-full border-[1.5px] border-white/20 bg-white/10 text-white text-[0.95rem] outline-none transition-[border-color] focus:border-blue placeholder:text-white/40"
        />
        <button
          type="submit"
          class="py-4 px-8 rounded-full bg-blue text-white border-none cursor-pointer font-bold text-[0.95rem] font-sans transition-all hover:bg-[#5aaeff] hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(60,157,255,0.4)] whitespace-nowrap"
        >
          {{ t('reg.btn') }}
        </button>
      </form>
      <p v-else class="text-white/90 font-medium reveal">
        ✓ {{ t('reg.success') }}
      </p>
      <p v-if="!submitted" class="mt-4 text-[0.8rem] text-white/40 reveal">
        {{ t('reg.note') }}
      </p>
    </div>
  </section>
</template>
