<script setup lang="ts">
import { computed } from 'vue'
import type { PortfolioItem } from '@/types/content'
import { useContent } from '@/composables/useContent'

const { content } = useContent()
const portfolio = computed(() => content.value?.sections.portfolio ?? [])

const badgeClasses: Record<PortfolioItem['badgeStyle'], string> = {
  premium: 'bg-secondary-container/20 text-secondary-fixed-dim border-secondary-container/30',
  fixed: 'bg-tertiary-container/10 text-tertiary-fixed-dim border-tertiary-container/20',
  pro: 'bg-primary-container/20 text-primary-fixed-dim border-primary-container/30',
}
</script>

<template>
  <section id="portfolio" class="page-container py-24">
    <div class="mb-12 flex flex-col items-end justify-between gap-6 md:flex-row">
      <div>
        <span class="text-label-caps tracking-widest text-secondary-fixed-dim">RÉALISATIONS</span>
        <h2 class="text-display-lg-mobile mt-2 uppercase tracking-tight md:text-headline-md">
          Nos Réalisations
        </h2>
      </div>
      <div class="flex gap-2" aria-hidden="true">
        <button
          type="button"
          class="rounded-full border border-outline-variant p-2 transition-all hover:border-primary-fixed-dim hover:text-primary-fixed-dim"
        >
          <span class="material-symbols-outlined">chevron_left</span>
        </button>
        <button
          type="button"
          class="rounded-full border border-outline-variant p-2 transition-all hover:border-primary-fixed-dim hover:text-primary-fixed-dim"
        >
          <span class="material-symbols-outlined">chevron_right</span>
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-gutter sm:grid-cols-2 lg:grid-cols-3">
      <article
        v-for="item in portfolio"
        :key="item.tag"
        class="glass-card group relative overflow-hidden rounded-xl"
      >
        <div class="relative aspect-video overflow-hidden">
          <img
            :src="item.image"
            :alt="item.title"
            decoding="async"
            class="h-full w-full object-cover"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
          <div class="id-tag">{{ item.tag }}</div>
        </div>
        <div class="p-6">
          <div class="mb-4 flex items-start justify-between">
            <h4 class="text-xl font-bold">{{ item.title }}</h4>
            <span
              class="rounded border px-2 py-1 text-xs"
              :class="badgeClasses[item.badgeStyle]"
            >
              {{ item.badge }}
            </span>
          </div>
          <p class="text-body-sm mb-6 text-on-surface-variant">{{ item.description }}</p>
          <button
            type="button"
            class="text-label-caps w-full border border-primary-fixed-dim/30 py-2 uppercase text-primary-fixed-dim transition-colors hover:bg-primary-fixed-dim hover:text-on-primary-fixed"
          >
            {{ item.buttonLabel }}
          </button>
        </div>
      </article>
    </div>
  </section>
</template>
