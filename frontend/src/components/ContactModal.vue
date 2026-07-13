<script setup lang="ts">
import { computed, onUnmounted, reactive, ref, watch } from 'vue'
import { api } from '@/api/client'
import { heroDefaultImage } from '@/config/brand'
import { useContactModal } from '@/composables/useContactModal'

const { isOpen, closeContact } = useContactModal()

const missionLabels: Record<string, string> = {
  reparation: 'Réparation Matérielle',
  montage: 'Montage PC sur mesure',
  optimisation: 'Optimisation logicielle / réglages fins',
  autre: 'Autre Requête',
}

const form = reactive({
  name: '',
  email: '',
  phone: '',
  missionType: 'reparation',
  message: '',
})
const status = ref<'idle' | 'sending' | 'ok' | 'error'>('idle')
const closing = ref(false)

const statusLine = computed(() => {
  if (status.value === 'sending') return 'TRANSMISSION EN COURS…'
  if (status.value === 'ok') return 'SIGNAL REÇU — MERCI POUR VOTRE MESSAGE'
  if (status.value === 'error') return 'ÉCHEC DE TRANSMISSION — RÉESSAYEZ'
  return 'SYSTÈME OPÉRATIONNEL - PRÊT À RECEVOIR'
})

watch(isOpen, (open) => {
  if (open) {
    closing.value = false
    status.value = 'idle'
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

onUnmounted(() => {
  document.body.style.overflow = ''
})

function retry() {
  status.value = 'idle'
}

function handleClose() {
  closing.value = true
  window.setTimeout(() => {
    closeContact()
    closing.value = false
  }, 200)
}

async function submit() {
  status.value = 'sending'
  const mission = missionLabels[form.missionType] ?? form.missionType
  const payload = {
    name: form.name,
    email: form.email,
    phone: form.phone || undefined,
    message: `Type de mission : ${mission}\n\n${form.message}`,
  }

  try {
    await api.post('/contact', payload)
    status.value = 'ok'
    form.name = ''
    form.email = ''
    form.phone = ''
    form.missionType = 'reparation'
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
      class="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto p-margin-mobile md:p-margin-desktop"
    >
      <!-- Fond flouté (Stitch) -->
      <div class="fixed inset-0 z-0" @click="handleClose">
        <div class="absolute inset-0 z-10 bg-surface/60 backdrop-blur-sm" />
        <img
          :src="heroDefaultImage"
          alt=""
          class="h-full w-full object-cover blur-md grayscale-[20%]"
        />
      </div>

      <div
        class="glass-panel neon-border-glow relative z-10 w-full max-w-2xl overflow-hidden rounded-xl transition-all duration-300"
        :class="closing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'"
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-modal-title"
        @click.stop
      >
        <button
          type="button"
          class="group absolute top-6 right-6 z-20 p-2 text-on-surface-variant transition-colors hover:text-primary-container"
          aria-label="Fermer"
          @click="handleClose"
        >
          <span class="material-symbols-outlined text-3xl transition-transform duration-300 group-hover:rotate-90">
            close
          </span>
        </button>

        <div class="absolute top-6 left-6 font-body text-sm text-primary-container opacity-40 select-none">
          [REF-CONTACT-082]
        </div>

        <div class="px-8 pt-16 pb-12">
          <div class="mb-10 text-center">
            <h2 id="contact-modal-title" class="text-headline-md mb-2 tracking-tight text-primary">
              LANCER UN DIAGNOSTIC
            </h2>
            <p class="text-body-sm mx-auto max-w-md text-on-surface-variant">
              Précisez votre mission. Un technicien D.O.G. analysera vos fréquences sous 24h.
            </p>
            <div class="modal-segmented-progress mt-6 flex justify-center">
              <span class="active" />
              <span class="active" />
              <span class="active" />
              <span class="active animate-pulse-cyan" />
              <span />
            </div>
          </div>

          <form v-if="status === 'idle' || status === 'sending'" class="space-y-8" @submit.prevent="submit">
            <div class="grid grid-cols-1 gap-gutter md:grid-cols-2">
              <div class="flex flex-col gap-2">
                <label class="text-label-caps text-on-surface-variant" for="contact-name">Nom / Pseudo</label>
                <input
                  id="contact-name"
                  v-model="form.name"
                  class="cyber-input focus:ring-0"
                  placeholder="Gamer_Alpha"
                  type="text"
                  required
                />
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-label-caps text-on-surface-variant" for="contact-email">
                  Adresse e-mail
                </label>
                <input
                  id="contact-email"
                  v-model="form.email"
                  class="cyber-input focus:ring-0"
                  placeholder="contact@exemple.fr"
                  type="email"
                  required
                />
              </div>
            </div>

            <div class="flex flex-col gap-2">
              <label class="text-label-caps text-on-surface-variant" for="contact-phone">Téléphone</label>
              <input
                id="contact-phone"
                v-model="form.phone"
                class="cyber-input focus:ring-0"
                placeholder="06 12 34 56 78"
                type="tel"
                autocomplete="tel"
              />
            </div>

            <div class="relative flex flex-col gap-2">
              <label class="text-label-caps text-on-surface-variant" for="contact-mission">Type de Mission</label>
              <select
                id="contact-mission"
                v-model="form.missionType"
                class="cyber-input cursor-pointer appearance-none focus:ring-0"
              >
                <option class="bg-surface text-on-surface" value="reparation">Réparation Matérielle</option>
                <option class="bg-surface text-on-surface" value="montage">Montage PC sur mesure</option>
                <option class="bg-surface text-on-surface" value="optimisation">
                  Optimisation logicielle / réglages fins
                </option>
                <option class="bg-surface text-on-surface" value="autre">Autre Requête</option>
              </select>
              <span
                class="material-symbols-outlined pointer-events-none absolute right-0 bottom-3 text-primary-container"
              >
                expand_more
              </span>
            </div>

            <div class="flex flex-col gap-2">
              <label class="text-label-caps text-on-surface-variant" for="contact-message">
                Détails de l'Anomalie
              </label>
              <textarea
                id="contact-message"
                v-model="form.message"
                class="cyber-input resize-none focus:ring-0"
                placeholder="Décrivez les symptômes de votre machine ou votre projet de montage..."
                rows="4"
                required
                minlength="10"
              />
            </div>

            <div class="flex flex-col items-center gap-4 pt-4">
              <button
                type="submit"
                class="group flex w-full items-center justify-center gap-2 rounded-none bg-primary-container px-12 py-4 font-display text-base font-bold text-black transition-all duration-300 hover:bg-primary-container/90 hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] active:scale-95 disabled:opacity-50 md:w-auto"
                :disabled="status === 'sending'"
              >
                <span>{{ status === 'sending' ? 'ENVOI EN COURS…' : 'ENVOYER LE SIGNAL' }}</span>
                <span class="material-symbols-outlined transition-transform group-hover:translate-x-1">send</span>
              </button>
              <p class="text-body-sm flex items-center gap-2 text-on-surface-variant/60">
                <span
                  class="material-symbols-outlined text-sm"
                  :class="status === 'idle' ? 'animate-pulse text-tertiary-fixed-dim' : ''"
                >
                  radio_button_checked
                </span>
                {{ statusLine }}
              </p>
            </div>
          </form>

          <div v-else class="flex flex-col items-center gap-6 pt-4 text-center">
            <p
              class="text-body-sm flex items-center gap-2"
              :class="status === 'ok' ? 'text-primary-container' : 'text-red-400'"
            >
              <span class="material-symbols-outlined text-sm">radio_button_checked</span>
              {{ statusLine }}
            </p>

            <button
              v-if="status === 'error'"
              type="button"
              class="group flex w-full items-center justify-center gap-2 rounded-none bg-primary-container px-12 py-4 font-display text-base font-bold text-black transition-all duration-300 hover:bg-primary-container/90 hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] active:scale-95 md:w-auto"
              @click="retry"
            >
              <span>RÉESSAYER</span>
              <span class="material-symbols-outlined transition-transform group-hover:translate-x-1">refresh</span>
            </button>
          </div>
        </div>

        <div class="h-1 w-full bg-gradient-to-r from-transparent via-primary-container to-transparent opacity-30" />
      </div>

      <div
        class="pointer-events-none fixed bottom-0 left-0 z-0 h-1/3 w-full bg-gradient-to-t from-primary-container/5 to-transparent"
      />
    </div>
  </Teleport>
</template>
