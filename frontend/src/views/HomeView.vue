<script setup lang="ts">
import { onMounted } from 'vue'
import { useContent } from '@/composables/useContent'
import { useSiteSeo } from '@/composables/useSeo'
import ContactModal from '@/components/ContactModal.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import HeroSection from '@/components/sections/HeroSection.vue'
import ExpertiseSection from '@/components/sections/ExpertiseSection.vue'
import PortfolioSection from '@/components/sections/PortfolioSection.vue'
import SocialSection from '@/components/sections/SocialSection.vue'
import ContactSection from '@/components/sections/ContactSection.vue'

const { content, error, fetchContent } = useContent()

useSiteSeo(content)

onMounted(() => {
  fetchContent().catch(() => undefined)
})
</script>

<template>
  <div
    v-if="!content"
    class="flex min-h-screen flex-col items-center justify-center gap-3 text-on-surface-variant"
  >
    <p>Chargement…</p>
    <p v-if="error" class="text-sm text-red-400">{{ error }}</p>
  </div>
  <template v-else>
    <AppHeader />
    <main class="scanline cyber-grid relative min-h-screen pt-24">
      <HeroSection />
      <ExpertiseSection />
      <PortfolioSection />
      <SocialSection />
      <ContactSection />
    </main>
    <AppFooter />
    <ContactModal />
  </template>
</template>
