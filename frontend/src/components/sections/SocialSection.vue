<script setup lang="ts">
import { computed } from 'vue'
import { useContent } from '@/composables/useContent'

const { content } = useContent()
const social = computed(() => content.value?.sections.social)

const youtubeImage = computed(
  () => social.value?.youtubeImage || '/uploads/social-youtube.jpg',
)
const tiktokImage = computed(
  () => social.value?.tiktokImage || '/uploads/social-tiktok.jpg',
)
</script>

<template>
  <section id="social" class="relative overflow-hidden bg-surface-container-low py-24">
    <div class="page-container relative z-10">
      <div class="mb-16 text-center">
        <h2 class="text-display-lg-mobile mb-4 md:text-display-lg">
          SUIVEZ LE <span class="text-primary-fixed-dim">DOG</span>
        </h2>
        <p class="mx-auto max-w-2xl text-base text-on-surface-variant">{{ social?.subtitle }}</p>
      </div>

      <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
        <a
          :href="social?.youtubeUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="glass-card group relative aspect-video overflow-hidden rounded-3xl border-none shadow-2xl"
        >
          <div class="absolute inset-0 bg-black/40 transition-all group-hover:bg-black/20"></div>
          <img :src="youtubeImage" alt="YouTube D.O.G." class="h-full w-full object-cover" />
          <div class="absolute inset-0 flex flex-col items-center justify-center p-8">
            <div
              class="neon-glow-secondary mb-6 flex h-20 w-20 animate-pulse items-center justify-center rounded-full bg-red-600"
            >
              <span class="material-symbols-outlined fill-current text-4xl text-white">play_arrow</span>
            </div>
            <h3 class="text-headline-md mb-2 text-white">Chaîne YouTube</h3>
            <p class="mb-6 text-on-surface-variant">Analyses poussées &amp; tests de performance</p>
            <span class="rounded-full bg-red-600 px-8 py-3 font-bold text-white transition-all hover:bg-red-500">
              S'ABONNER AU DOG
            </span>
          </div>
        </a>

        <a
          :href="social?.tiktokUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="glass-card group relative aspect-video overflow-hidden rounded-3xl border-none shadow-2xl"
        >
          <div class="absolute inset-0 bg-black/40 transition-all group-hover:bg-black/20"></div>
          <img :src="tiktokImage" alt="TikTok D.O.G." class="h-full w-full object-cover" />
          <div class="absolute inset-0 flex flex-col items-center justify-center p-8">
            <div
              class="neon-glow-primary mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-cyan-400"
            >
              <span class="material-symbols-outlined text-4xl text-black">bolt</span>
            </div>
            <h3 class="text-headline-md mb-2 text-white">Shorts TikTok</h3>
            <p class="mb-6 text-on-surface-variant">Réparations flash &amp; montages express</p>
            <span class="rounded-full bg-cyan-400 px-8 py-3 font-bold text-black transition-all hover:bg-cyan-300">
              VOIR LES SHORTS
            </span>
          </div>
        </a>
      </div>
    </div>

    <div
      class="absolute top-1/2 left-1/2 -z-10 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-fixed-dim/5 blur-[120px]"
    ></div>
  </section>
</template>
