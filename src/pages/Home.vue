<script setup lang="ts">
import AppNav from '../components/layout/AppNav.vue'
import Hero from '../components/HomeSections/Hero.vue'
import Services from '../components/HomeSections/Services.vue'
import Packs from '../components/HomeSections/Packs.vue'
import Retainers from '../components/HomeSections/Retainers.vue'
import Methodology from '../components/HomeSections/Methodology.vue'
import About from '../components/HomeSections/About.vue'
import Register from '../components/HomeSections/Register.vue'
import { useScrollReveal } from '../composables/useScrollReveal'

useScrollReveal('.reveal')
</script>

<template>
  <div class="min-h-screen">
    <AppNav />

    <main>
      <Hero />
      <Services />
      <Packs />
      <Retainers />
      <Methodology />
      <About />
      <Register />
    </main>
  </div>
</template>
