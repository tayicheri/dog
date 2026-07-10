<script setup lang="ts">
import { computed } from 'vue'
import { useContent } from '@/composables/useContent'

const { content } = useContent()
const about = computed(() => content.value?.sections.about)
const services = computed(() => content.value?.sections.services ?? [])

const bodyParagraphs = computed(() => about.value?.body.split('\n\n').filter(Boolean) ?? [])

const iconColors = ['text-primary-fixed-dim', 'text-secondary-fixed-dim', 'text-tertiary-fixed-dim', 'text-primary-fixed-dim']
</script>

<template>
  <section
    id="expertise"
    class="border-y border-outline-variant/20 bg-surface-container-lowest/80 py-24"
  >
    <div class="page-container">
      <div class="grid grid-cols-1 items-start gap-16 md:grid-cols-2">
        <div>
          <h2 class="text-headline-md mb-8 flex items-center gap-3">
            <span class="material-symbols-outlined text-tertiary-fixed-dim">terminal</span>
            {{ about?.title }}
          </h2>
          <div class="space-y-6 text-base leading-relaxed text-on-surface-variant">
            <p v-for="(para, i) in bodyParagraphs" :key="i">{{ para }}</p>
          </div>
          <div class="mt-8 flex gap-4">
            <div class="flex flex-1 flex-col gap-2">
              <div class="text-label-caps text-on-surface-variant">HW DIAGNOSTICS</div>
              <div class="segmented-progress">
                <div v-for="n in 5" :key="n" class="segmented-segment" :class="{ active: n <= 4 }"></div>
              </div>
            </div>
            <div class="flex flex-1 flex-col gap-2">
              <div class="text-label-caps text-on-surface-variant">FPS OPTIMIZATION</div>
              <div class="segmented-progress">
                <div v-for="n in 5" :key="n" class="segmented-segment active"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <article
            v-for="(service, index) in services"
            :key="service.title"
            class="glass-card space-y-4 rounded-xl p-6"
            :class="{ 'mt-8': index === 1 || index === 3 }"
          >
            <span
              class="material-symbols-outlined text-4xl"
              :class="iconColors[index % iconColors.length]"
              aria-hidden="true"
            >
              {{ service.icon }}
            </span>
            <h3 class="text-lg font-bold">{{ service.title }}</h3>
            <p class="text-body-sm text-on-surface-variant">{{ service.description }}</p>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>
