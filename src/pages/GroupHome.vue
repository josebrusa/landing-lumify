<script setup lang="ts">
import AppNav from '../components/layout/AppNav.vue'
import { useI18n } from '../composables/useI18n'
import { useScrollReveal } from '../composables/useScrollReveal'

useScrollReveal('.reveal')

const { t } = useI18n()
</script>

<template>
  <div class="min-h-screen bg-deep text-white font-sans overflow-x-hidden">
    <AppNav />

    <!-- ── HERO ──────────────────────────────────────────────── -->
    <section class="min-h-screen bg-deep relative overflow-hidden flex flex-col justify-center items-center text-center px-[5%] pt-[120px] pb-20">
      <!-- Radial gradient -->
      <div class="absolute inset-0 z-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(60,157,255,0.14)_0%,transparent_65%)]" />
      <!-- Grid -->
      <div class="absolute inset-0 z-0 opacity-[0.06] bg-size-[60px_60px] bg-[linear-gradient(rgba(60,157,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(60,157,255,0.5)_1px,transparent_1px)]" />

      <div class="relative z-10 max-w-[760px] mx-auto">
        <!-- Eyebrow -->
        <div class="inline-flex items-center gap-2 bg-blue/15 border border-blue/35 text-blue py-1.5 px-4 rounded-full text-xs font-semibold tracking-widest uppercase mb-7 animate-[fadeUp_0.8s_ease_both]">
          <span class="w-1.5 h-1.5 bg-blue rounded-full animate-[pulse_2s_infinite]" />
          {{ t('group.eyebrow') }}
        </div>

        <!-- Heading -->
        <h1 class="font-heading text-[clamp(2.4rem,6vw,4rem)] font-extrabold text-white leading-[1.08] tracking-[-1.5px] mb-6 animate-[fadeUp_0.8s_0.1s_ease_both]">
          {{ t('group.hero.title') }}
        </h1>

        <!-- Description -->
        <p class="text-lg text-white/65 leading-[1.75] max-w-[600px] mx-auto mb-10 font-light animate-[fadeUp_0.8s_0.2s_ease_both]">
          {{ t('group.hero.desc') }}
        </p>

        <!-- CTA -->
        <a
          href="#divisiones"
          class="inline-flex items-center gap-2 bg-blue text-white py-4 px-8 rounded-full font-semibold text-base no-underline transition-all duration-[0.25s] hover:bg-[#5aaeff] hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(60,157,255,0.4)] animate-[fadeUp_0.8s_0.3s_ease_both]"
        >
          {{ t('group.div.label') }} ↓
        </a>
      </div>
    </section>

    <!-- ── DIVISIONS ─────────────────────────────────────────── -->
    <section id="divisiones" class="py-[100px] px-[5%] bg-surface">
      <div class="max-w-[1100px] mx-auto">

        <!-- Section header -->
        <div class="text-center mb-16 reveal">
          <div class="text-xs font-bold tracking-[2px] uppercase text-blue mb-3">{{ t('group.div.label') }}</div>
          <h2 class="font-heading text-[clamp(1.9rem,4vw,2.8rem)] font-extrabold text-deep leading-[1.1] tracking-[-0.8px] mb-4">
            {{ t('group.div.title') }}
          </h2>
          <p class="text-base text-text-muted max-w-[560px] mx-auto leading-relaxed">
            {{ t('group.div.desc') }}
          </p>
        </div>

        <!-- Cards grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

          <!-- ── LUMIFY TECH ── -->
          <a
            href="/tech"
            class="group block no-underline bg-white border border-gray-light rounded-[20px] p-8 transition-all duration-300 hover:border-blue/50 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(60,157,255,0.12)] reveal"
          >
            <!-- Icon -->
            <div class="w-14 h-14 rounded-2xl bg-blue/15 border border-blue/25 flex items-center justify-center mb-6 transition-colors group-hover:bg-blue/25">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="text-blue">
                <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
              </svg>
            </div>
            <!-- Badge -->
            <div class="inline-flex items-center gap-1.5 bg-blue/15 border border-blue/30 text-blue py-1 px-3 rounded-full text-[11px] font-bold uppercase tracking-widest mb-4">
              <span class="w-1.5 h-1.5 bg-blue rounded-full animate-[pulse_2s_infinite]" />
              {{ t('group.div.tech.tag') }}
            </div>
            <h3 class="font-heading text-2xl font-bold text-deep mb-1">{{ t('group.div.tech.name') }}</h3>
            <p class="text-sm text-blue font-medium mb-3">{{ t('group.div.tech.subtitle') }}</p>
            <p class="text-sm text-text-muted leading-relaxed mb-6">{{ t('group.div.tech.desc') }}</p>
            <span class="text-sm font-semibold text-blue group-hover:text-[#5aaeff] transition-colors">
              {{ t('group.div.tech.cta') }}
            </span>
          </a>

          <!-- ── LUMIFY LOGISTICS ── -->
          <a
            href="/logistics"
            class="group block no-underline bg-white border border-gray-light rounded-[20px] p-8 transition-all duration-300 hover:border-blue/50 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(60,157,255,0.12)] reveal"
          >
            <!-- Icon -->
            <div class="w-14 h-14 rounded-2xl bg-blue/15 border border-blue/25 flex items-center justify-center mb-6 transition-colors group-hover:bg-blue/25">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="text-blue">
                <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
              </svg>
            </div>
            <!-- Badge -->
            <div class="inline-flex items-center gap-1.5 bg-blue/15 border border-blue/30 text-blue py-1 px-3 rounded-full text-[11px] font-bold uppercase tracking-widest mb-4">
              <span class="w-1.5 h-1.5 bg-blue rounded-full animate-[pulse_2s_infinite]" />
              {{ t('group.div.log.tag') }}
            </div>
            <h3 class="font-heading text-2xl font-bold text-deep mb-1">{{ t('group.div.log.name') }}</h3>
            <p class="text-sm text-blue font-medium mb-3">{{ t('group.div.log.subtitle') }}</p>
            <p class="text-sm text-text-muted leading-relaxed mb-6">{{ t('group.div.log.desc') }}</p>
            <span class="text-sm font-semibold text-blue group-hover:text-[#5aaeff] transition-colors">
              {{ t('group.div.log.cta') }}
            </span>
          </a>

          <!-- ── LUMIFY STUDIO (próximamente) ── -->
          <div class="bg-white/70 border border-gray-light rounded-[20px] p-8 opacity-80 reveal">
            <!-- Icon -->
            <div class="w-14 h-14 rounded-2xl bg-blue/10 border border-blue/15 flex items-center justify-center mb-6">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="text-blue/50">
                <line x1="18" y1="20" x2="8" y2="10"/><line x1="5" y1="3" x2="19" y2="3"/><line x1="6" y1="9" x2="3" y2="6"/><line x1="13" y1="6" x2="3" y2="16"/><path d="m5 19 7-7"/>
              </svg>
            </div>
            <!-- Badge -->
            <div class="inline-flex items-center gap-1.5 bg-gray-dark/5 border border-gray-light text-text-muted py-1 px-3 rounded-full text-[11px] font-bold uppercase tracking-widest mb-4">
              {{ t('group.div.studio.tag') }}
            </div>
            <h3 class="font-heading text-2xl font-bold text-deep/60 mb-1">{{ t('group.div.studio.name') }}</h3>
            <p class="text-sm text-blue/60 font-medium mb-3">{{ t('group.div.studio.subtitle') }}</p>
            <p class="text-sm text-text-muted/70 leading-relaxed mb-6">{{ t('group.div.studio.desc') }}</p>
            <span class="text-sm font-medium text-text-muted/50">{{ t('group.div.studio.note') }}</span>
          </div>

          <!-- ── LUMIFY ADVISORS (próximamente) ── -->
          <div class="bg-white/70 border border-gray-light rounded-[20px] p-8 opacity-80 reveal">
            <!-- Icon -->
            <div class="w-14 h-14 rounded-2xl bg-blue/10 border border-blue/15 flex items-center justify-center mb-6">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="text-blue/50">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
              </svg>
            </div>
            <!-- Badge -->
            <div class="inline-flex items-center gap-1.5 bg-gray-dark/5 border border-gray-light text-text-muted py-1 px-3 rounded-full text-[11px] font-bold uppercase tracking-widest mb-4">
              {{ t('group.div.legal.tag') }}
            </div>
            <h3 class="font-heading text-2xl font-bold text-deep/60 mb-1">{{ t('group.div.legal.name') }}</h3>
            <p class="text-sm text-blue/60 font-medium mb-3">{{ t('group.div.legal.subtitle') }}</p>
            <p class="text-sm text-text-muted/70 leading-relaxed mb-6">{{ t('group.div.legal.desc') }}</p>
            <span class="text-sm font-medium text-text-muted/50">{{ t('group.div.legal.note') }}</span>
          </div>

        </div>
      </div>
    </section>

  </div>
</template>
