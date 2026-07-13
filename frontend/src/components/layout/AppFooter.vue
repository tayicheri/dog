<script setup lang="ts">
import { computed } from 'vue'
import { brand } from '@/config/brand'
import { useContent } from '@/composables/useContent'
import { useContactModal } from '@/composables/useContactModal'

const { content } = useContent()
const { openContact } = useContactModal()
const businessName = computed(() => content.value?.business.name ?? brand.fullName)
const year = new Date().getFullYear()
</script>

<template>
  <footer class="w-full rounded-t-xl border-t border-outline-variant/20 bg-surface-container-lowest">
    <div class="page-container grid grid-cols-1 gap-gutter py-12 md:grid-cols-3">
      <div class="space-y-6">
        <div class="font-display text-display-lg-mobile font-bold text-primary-fixed-dim">{{ brand.name }}</div>
        <p class="text-body-sm text-on-surface-variant">
          Expertise technique, passion gaming. Nous repoussons les limites de votre matériel avec précision et
          performance.
        </p>
      </div>

      <div class="space-y-4">
        <h5 class="text-label-caps font-bold text-secondary-fixed-dim">Légal &amp; assistance</h5>
        <ul class="space-y-2">
          <li>
            <RouterLink
              class="text-body-sm text-on-surface-variant transition-colors hover:text-tertiary-fixed-dim"
              to="/conditions-utilisation"
            >
              Conditions d'utilisation
            </RouterLink>
          </li>
          <li>
            <RouterLink
              class="text-body-sm text-on-surface-variant transition-colors hover:text-tertiary-fixed-dim"
              to="/politique-de-confidentialite"
            >
              Politique de confidentialité
            </RouterLink>
          </li>
          <li>
            <button
              class="text-body-sm text-on-surface-variant transition-colors hover:text-tertiary-fixed-dim"
              type="button"
              @click="openContact"
            >
              Support technique
            </button>
          </li>
        </ul>
      </div>

      <div class="space-y-6">
        <h5 class="text-label-caps font-bold text-secondary-fixed-dim">Nous suivre</h5>
        <div class="flex gap-4">
          <a
            class="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-variant transition-all hover:text-primary-fixed-dim"
            href="#social"
            aria-label="Réseaux sociaux"
          >
            <span class="material-symbols-outlined">share</span>
          </a>
          <a
            class="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-variant transition-all hover:text-primary-fixed-dim"
            href="#contact"
            aria-label="Contact"
          >
            <span class="material-symbols-outlined">mail</span>
          </a>
        </div>
        <p class="text-body-sm text-on-surface-variant">
          © {{ year }} {{ businessName }}. Ingénierie de précision.
        </p>
      </div>
    </div>
  </footer>
</template>
