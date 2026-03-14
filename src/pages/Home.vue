<script setup lang="ts">
import Nav from '../components/layout/Nav.vue'
import Footer from '../components/layout/Footer.vue'
import Hero from '../components/sections/Hero.vue'
import Services from '../components/sections/Services.vue'
import Packs from '../components/sections/Packs.vue'
import Retainers from '../components/sections/Retainers.vue'
import Methodology from '../components/sections/Methodology.vue'
import About from '../components/sections/About.vue'
import Register from '../components/sections/Register.vue'
import Modal from '../components/modals/Modal.vue'
import PricingModal from '../components/modals/PricingModal.vue'
import { useScrollReveal } from '../composables/useScrollReveal'

useScrollReveal('.reveal')
</script>

<template>
  <div class="min-h-screen">
    <Nav />

    <main>
      <Hero />
      <Services />
      <Packs />
      <Retainers />
      <Methodology />
      <About />
      <Register />
    </main>

    <Footer />
    <Modal />
    <PricingModal />
  </div>
</template>
