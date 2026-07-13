<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import type { PortfolioItem } from '@/types/content'

const props = defineProps<{
  open: boolean
  mode: 'add' | 'edit'
  initialItem: PortfolioItem
  uploadFile: (file: File) => Promise<string | null>
}>()

const emit = defineEmits<{
  close: []
  save: [item: PortfolioItem]
}>()

const form = reactive<PortfolioItem>({
  title: '',
  description: '',
  image: '',
  tag: '',
  badge: '',
  badgeStyle: 'premium',
  buttonLabel: 'Détails',
})

const error = ref('')
const uploading = ref(false)

watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) return
    error.value = ''
    Object.assign(form, JSON.parse(JSON.stringify(props.initialItem)))
  },
)

function handleClose() {
  emit('close')
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') handleClose()
}

async function handleImageChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  uploading.value = true
  error.value = ''
  try {
    const url = await props.uploadFile(file)
    if (url) form.image = url
    else error.value = "Erreur lors de l'upload."
  } catch {
    error.value = "Erreur lors de l'upload."
  } finally {
    uploading.value = false
    input.value = ''
  }
}

function handleSubmit() {
  if (!form.title.trim()) {
    error.value = 'Le titre est requis.'
    return
  }
  if (!form.image.trim()) {
    error.value = 'Une image est requise (upload ou URL existante).'
    return
  }
  emit('save', { ...form })
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-4"
      @click.self="handleClose"
      @keydown="handleKeydown"
    >
      <div
        class="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-border bg-surface-elevated p-6 shadow-xl"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="mode === 'add' ? 'portfolio-modal-add' : 'portfolio-modal-edit'"
      >
        <div class="mb-6 flex items-center justify-between">
          <h3
            :id="mode === 'add' ? 'portfolio-modal-add' : 'portfolio-modal-edit'"
            class="font-display text-lg font-semibold"
          >
            {{ mode === 'add' ? 'Ajouter une entrée portfolio' : 'Modifier l’entrée portfolio' }}
          </h3>
          <button
            type="button"
            class="text-muted hover:text-primary"
            aria-label="Fermer"
            @click="handleClose"
          >
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <form class="space-y-4" @submit.prevent="handleSubmit">
          <label class="block text-sm">
            Titre
            <input
              v-model="form.title"
              class="mt-1 w-full rounded-lg border border-border px-3 py-2"
              placeholder="Setup Full RGB"
              required
            />
          </label>

          <label class="block text-sm">
            Description
            <textarea
              v-model="form.description"
              class="mt-1 w-full rounded-lg border border-border px-3 py-2"
              rows="3"
              placeholder="Description du projet"
            />
          </label>

          <div class="block text-sm">
            Image
            <input
              type="file"
              accept="image/*"
              class="mt-1 block w-full text-sm"
              :disabled="uploading"
              @change="handleImageChange"
            />
            <p v-if="uploading" class="mt-1 text-xs text-muted">Upload en cours…</p>
            <div v-if="form.image" class="mt-3 flex items-center gap-3">
              <img
                :src="form.image"
                alt="Aperçu"
                class="h-16 w-16 rounded-lg border border-border object-cover"
              />
              <input
                :value="form.image"
                class="flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-xs text-muted"
                readonly
              />
            </div>
          </div>

          <div class="grid gap-4 md:grid-cols-2">
            <label class="block text-sm">
              Tag
              <input v-model="form.tag" class="mt-1 w-full rounded-lg border border-border px-3 py-2" placeholder="[RGB-MASTER]" />
            </label>
            <label class="block text-sm">
              Badge
              <input v-model="form.badge" class="mt-1 w-full rounded-lg border border-border px-3 py-2" placeholder="PREMIUM" />
            </label>
          </div>

          <label class="block text-sm">
            Style du badge
            <select v-model="form.badgeStyle" class="mt-1 w-full rounded-lg border border-border px-3 py-2">
              <option value="premium">premium</option>
              <option value="fixed">fixed</option>
              <option value="pro">pro</option>
            </select>
          </label>

          <label class="block text-sm">
            Libellé du bouton
            <input
              v-model="form.buttonLabel"
              class="mt-1 w-full rounded-lg border border-border px-3 py-2"
              placeholder="Détails du build"
            />
          </label>

          <p v-if="error" class="text-sm text-red-600">{{ error }}</p>

          <div class="flex justify-end gap-3 pt-2">
            <button
              type="button"
              class="rounded-lg border border-border px-4 py-2 text-sm hover:bg-surface"
              @click="handleClose"
            >
              Annuler
            </button>
            <button
              type="submit"
              class="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-black hover:opacity-90 disabled:opacity-50"
              :disabled="uploading"
            >
              {{ mode === 'add' ? 'Ajouter' : 'Enregistrer' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>
