<script setup lang="ts">
import { brand, navLinks } from '@/config/brand'
import { useContactModal } from '@/composables/useContactModal'

const { openContact } = useContactModal()
</script>

<template>
  <header
    class="fixed top-0 z-50 w-full border-b border-outline-variant/30 bg-background/80 shadow-[0_0_20px_rgba(0,219,233,0.15)] backdrop-blur-xl"
  >
    <nav class="page-container flex items-center justify-between py-4">
      <a class="font-display text-display-lg-mobile font-bold tracking-tighter text-primary-fixed-dim" href="/">
        {{ brand.name }}
      </a>

      <div class="hidden items-center gap-8 md:flex">
        <a
          v-for="(link, i) in navLinks"
          :key="link.href + link.label"
          class="font-body text-sm transition-colors"
          :class="
            i === 0
              ? 'border-b-2 border-primary-fixed-dim pb-1 text-primary-fixed-dim'
              : 'text-on-surface-variant hover:text-primary-fixed-dim'
          "
          :href="link.href"
        >
          {{ link.label }}
        </a>
      </div>

      <button
        type="button"
        class="neon-glow-primary rounded-lg bg-primary-container px-6 py-2 font-bold text-on-primary transition-all hover:bg-primary-fixed-dim active:scale-95"
        @click="openContact"
      >
        Contact Us
      </button>
    </nav>
  </header>
</template>
