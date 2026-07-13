<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useContent } from '@/composables/useContent'
import { useLegalSeo } from '@/composables/useSeo'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'

type LegalKey = 'terms' | 'privacy'

const route = useRoute()
const { content, fetchContent } = useContent()

const legalKey = computed(() => route.meta.legalKey as LegalKey)
const pageTitle = computed(() => String(route.meta.pageTitle ?? 'Document juridique'))
const pagePath = computed(() => route.path)

const bodyHtml = computed(() => {
  const key = legalKey.value
  return content.value?.legal?.[key] ?? ''
})

useLegalSeo(pageTitle, pagePath)

onMounted(() => {
  fetchContent().catch(() => undefined)
})
</script>

<template>
  <AppHeader />
  <main class="relative min-h-screen pt-24 pb-16">
    <article class="page-container max-w-3xl py-12">
      <h1 class="text-display-lg-mobile mb-10 md:text-headline-md">{{ pageTitle }}</h1>
      <div class="legal-body text-base leading-relaxed text-on-surface-variant" v-html="bodyHtml" />
    </article>
  </main>
  <AppFooter />
</template>

<style scoped>
.legal-body :deep(h2) {
  margin-top: 2rem;
  margin-bottom: 0.75rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-on-surface);
}

.legal-body :deep(h2:first-child) {
  margin-top: 0;
}

.legal-body :deep(p) {
  margin-bottom: 1rem;
}

.legal-body :deep(ul) {
  margin-bottom: 1rem;
  list-style: disc;
  padding-left: 1.5rem;
}

.legal-body :deep(li) {
  margin-bottom: 0.35rem;
}

.legal-body :deep(a) {
  color: var(--color-primary-fixed-dim);
  text-decoration: underline;
}

.legal-body :deep(a:hover) {
  opacity: 0.85;
}

.legal-body :deep(strong) {
  color: var(--color-on-surface);
  font-weight: 600;
}

.legal-body :deep(em) {
  font-size: 0.875rem;
  opacity: 0.8;
}
</style>
