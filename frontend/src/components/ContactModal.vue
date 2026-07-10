<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { api } from '@/api/client'
import { useContactModal } from '@/composables/useContactModal'
import { useContent } from '@/composables/useContent'

const { isOpen, closeContact } = useContactModal()
const { content } = useContent()

const form = reactive({
  name: '',
  email: '',
  phone: '',
  message: '',
})
const status = ref<'idle' | 'sending' | 'ok' | 'error'>('idle')

watch(isOpen, (open) => {
  if (!open) {
    status.value = 'idle'
  }
})

async function submit() {
  status.value = 'sending'
  try {
    await api.post('/contact', form)
    status.value = 'ok'
    form.name = ''
    form.email = ''
    form.phone = ''
    form.message = ''
  } catch {
    status.value = 'error'
  }
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      @click.self="closeContact"
    >
      <div
        class="glass-card neon-glow-primary relative w-full max-w-lg rounded-2xl border-2 border-primary-fixed-dim/30 p-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-modal-title"
      >
        <button
          type="button"
          class="absolute top-4 right-4 text-on-surface-variant transition-colors hover:text-primary-fixed-dim"
          aria-label="Fermer"
          @click="closeContact"
        >
          <span class="material-symbols-outlined">close</span>
        </button>

        <span class="text-label-caps mb-2 block text-tertiary-fixed-dim">// CONTACT PROTOCOL</span>
        <h2 id="contact-modal-title" class="text-headline-md mb-2 text-primary-fixed-dim">Contact Us</h2>
        <p class="mb-6 text-body-sm text-on-surface-variant">
          {{ content?.business.name }} — {{ content?.business.city }}
        </p>

        <form class="space-y-4" @submit.prevent="submit">
          <label class="block text-sm">
            <span class="text-label-caps text-on-surface-variant">Nom</span>
            <input
              v-model="form.name"
              class="mt-1 w-full border-b-2 border-outline-variant bg-black/50 px-3 py-2 text-on-surface outline-none focus:border-primary-fixed-dim"
              required
            />
          </label>
          <label class="block text-sm">
            <span class="text-label-caps text-on-surface-variant">Email</span>
            <input
              v-model="form.email"
              type="email"
              class="mt-1 w-full border-b-2 border-outline-variant bg-black/50 px-3 py-2 text-on-surface outline-none focus:border-primary-fixed-dim"
              required
            />
          </label>
          <label class="block text-sm">
            <span class="text-label-caps text-on-surface-variant">Téléphone</span>
            <input
              v-model="form.phone"
              class="mt-1 w-full border-b-2 border-outline-variant bg-black/50 px-3 py-2 text-on-surface outline-none focus:border-primary-fixed-dim"
            />
          </label>
          <label class="block text-sm">
            <span class="text-label-caps text-on-surface-variant">Message</span>
            <textarea
              v-model="form.message"
              class="mt-1 w-full border-b-2 border-outline-variant bg-black/50 px-3 py-2 text-on-surface outline-none focus:border-primary-fixed-dim"
              rows="4"
              required
              minlength="10"
            />
          </label>

          <button
            type="submit"
            class="neon-glow-primary w-full rounded-lg bg-primary-fixed-dim py-3 font-bold text-on-primary-fixed transition-all hover:bg-primary-container disabled:opacity-50"
            :disabled="status === 'sending'"
          >
            {{ status === 'sending' ? 'ENVOI…' : 'ENVOYER' }}
          </button>
        </form>

        <p v-if="status === 'ok'" class="mt-4 text-center text-sm text-primary-fixed-dim">Message envoyé — merci !</p>
        <p v-if="status === 'error'" class="mt-4 text-center text-sm text-red-400">
          Erreur lors de l'envoi. Réessayez ou appelez-nous.
        </p>
      </div>
    </div>
  </Teleport>
</template>
