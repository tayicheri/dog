<script setup lang="ts">
import { computed } from 'vue'
import { heroDefaultImage } from '@/config/brand'
import { useContent } from '@/composables/useContent'

const { content } = useContent()
const hero = computed(() => content.value?.sections.hero)
const image = computed(() => hero.value?.image || heroDefaultImage)
</script>

<template>
  <section id="hero" class="page-container relative overflow-hidden py-20">
    <div class="grid grid-cols-1 items-center gap-gutter md:grid-cols-12">
      <div class="z-10 md:col-span-7">
        <span
          v-if="hero?.badge"
          class="text-label-caps mb-6 inline-block rounded border border-tertiary-fixed-dim/30 px-3 py-1 text-tertiary-fixed-dim"
        >
          {{ hero.badge }}
        </span>
        <h1 class="text-display-lg-mobile mb-6 leading-none md:text-display-lg">
          {{ hero?.title }}
          <span class="text-primary-fixed-dim">{{ hero?.titleAccent }}</span>
          &amp; DU DÉPANNAGE EXPERT
        </h1>
        <p class="mb-10 max-w-xl text-base leading-relaxed text-on-surface-variant">
          {{ hero?.subtitle }}
        </p>
        <div class="flex flex-wrap gap-4">
          <a
            href="#expertise"
            class="neon-glow-primary group flex items-center gap-2 rounded-lg bg-primary-fixed-dim px-8 py-4 font-bold text-on-primary-fixed transition-all hover:scale-105 active:scale-95"
          >
            {{ hero?.ctaLabel }}
            <span class="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
          </a>
          <a
            href="#portfolio"
            class="rounded-lg border border-secondary-fixed-dim/50 px-8 py-4 font-bold text-secondary-fixed-dim transition-all hover:bg-secondary-fixed-dim/10 active:scale-95"
          >
            {{ hero?.secondaryCtaLabel }}
          </a>
        </div>
      </div>

      <div class="relative md:col-span-5">
        <div
          class="glass-card relative flex aspect-square w-full items-center justify-center rounded-2xl border-2 border-primary-fixed-dim/20 p-4"
        >
          <div class="absolute -inset-4 rounded-full bg-primary-fixed-dim/10 blur-3xl"></div>
          <img
            :src="image"
            alt="Setup gaming D.O.G."
            class="h-full w-full rounded-xl object-cover grayscale transition-all duration-700 hover:grayscale-0"
          />
          <div v-if="hero?.imageTag" class="id-tag">{{ hero.imageTag }}</div>
        </div>
      </div>
    </div>
  </section>
</template>
