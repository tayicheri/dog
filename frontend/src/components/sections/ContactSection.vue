<script setup lang="ts">
import { computed, ref } from 'vue'
import { api } from '@/api/client'
import { useContent } from '@/composables/useContent'

const { content } = useContent()
const contact = computed(() => content.value?.sections.contact)

const email = ref('')
const status = ref<'idle' | 'sending' | 'ok' | 'error'>('idle')

async function submitNewsletter() {
  if (!email.value) return
  status.value = 'sending'
  try {
    await api.post('/contact', {
      name: 'Newsletter',
      email: email.value,
      message: 'Inscription newsletter — alertes matériel',
    })
    status.value = 'ok'
    email.value = ''
  } catch {
    status.value = 'error'
  }
}
</script>

<template>
  <section id="contact" class="page-container py-20">
    <div
      class="glass-card relative overflow-hidden rounded-[2rem] border-2 border-primary-fixed-dim/20 p-8 text-center md:p-16"
    >
      <div
        class="pointer-events-none absolute top-0 right-0 p-4 font-mono text-[80px] opacity-[0.03] select-none"
      >
        PRÊT_
      </div>
      <h2 class="text-headline-md mb-6 md:text-display-lg-mobile">
        Besoin d'un <span class="text-primary-fixed-dim">coup de boost</span> performance ?
      </h2>
      <p class="mx-auto mb-10 max-w-xl text-base text-on-surface-variant">{{ contact?.intro }}</p>
      <form class="mx-auto flex max-w-lg flex-col gap-4 md:flex-row" @submit.prevent="submitNewsletter">
        <input
          v-model="email"
          class="text-label-caps flex-grow border-b-2 border-outline-variant bg-black px-6 py-4 text-primary-fixed-dim outline-none placeholder:text-on-surface-variant/40 focus:border-primary-fixed-dim"
          placeholder="VOTRE EMAIL"
          type="email"
          required
        />
        <button
          type="submit"
          class="neon-glow-primary rounded-lg bg-primary-fixed-dim px-10 py-4 font-bold text-on-primary-fixed transition-all hover:bg-primary-container active:scale-95 disabled:opacity-50"
          :disabled="status === 'sending'"
        >
          {{ status === 'sending' ? 'ENVOI…' : 'ENVOYER' }}
        </button>
      </form>
      <p v-if="status === 'ok'" class="mt-4 text-sm text-primary-fixed-dim">Inscription enregistrée — merci !</p>
      <p v-if="status === 'error'" class="mt-4 text-sm text-red-400">Erreur lors de l'envoi. Réessayez.</p>
    </div>
  </section>
</template>
