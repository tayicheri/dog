<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { useHead } from '@unhead/vue'
import { api, setAuthToken } from '@/api/client'
import PortfolioItemModal from '@/components/admin/PortfolioItemModal.vue'
import RichTextEditor from '@/components/admin/RichTextEditor.vue'
import { useContent } from '@/composables/useContent'
import type { PortfolioItem, SiteContent } from '@/types/content'

const { content, fetchContent, setContent } = useContent()

useHead({
  title: 'Admin — D.O.G.',
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
})

const token = ref<string | null>(
  typeof localStorage !== 'undefined' ? localStorage.getItem('dog_admin_token') : null,
)
const loginForm = reactive({ username: '', password: '' })
const loginError = ref('')
const saving = ref(false)
const saveMessage = ref('')
const saveDetails = ref<unknown | null>(null)
const passwordForm = reactive({ currentPassword: '', newPassword: '' })
const smtpForm = reactive({ email: '', password: '' })
const smtpConfigured = ref(false)

const draft = ref<SiteContent | null>(null)
const lastSaved = ref<SiteContent | null>(null)

const portfolioModalOpen = ref(false)
const portfolioModalMode = ref<'add' | 'edit'>('add')
const portfolioEditingIndex = ref<number | null>(null)
const portfolioModalItem = ref<PortfolioItem>(emptyPortfolioItem())

const isLoggedIn = computed(() => Boolean(token.value))
const isDirty = computed(() => {
  if (!draft.value || !lastSaved.value) return false
  return stableStringify(draft.value) !== stableStringify(lastSaved.value)
})

function stableStringify(value: unknown): string {
  if (value === null) return 'null'
  const t = typeof value
  if (t === 'string') return JSON.stringify(value)
  if (t === 'number' || t === 'boolean') return String(value)
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`
  if (t !== 'object') return JSON.stringify(value)
  const obj = value as Record<string, unknown>
  const keys = Object.keys(obj).sort()
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(obj[k])}`).join(',')}}`
}

function emptyPortfolioItem(): PortfolioItem {
  return {
    title: '',
    description: '',
    image: '',
    tag: '',
    badge: '',
    badgeStyle: 'premium',
    buttonLabel: 'Détails',
  }
}

onMounted(async () => {
  await fetchContent()
  if (content.value) {
    draft.value = JSON.parse(JSON.stringify(content.value)) as SiteContent
    lastSaved.value = JSON.parse(JSON.stringify(content.value)) as SiteContent
  }
  if (token.value) {
    setAuthToken(token.value)
    await fetchSmtpConfig()
  }
})

watch(isDirty, (dirty) => {
  if (!dirty) return
  saveMessage.value = ''
  saveDetails.value = null
})

function confirmIfDirty(): boolean {
  if (!isDirty.value) return true
  return confirm('Modifications non enregistrées. Continuer sans sauvegarder ?')
}

function onBeforeUnload(e: BeforeUnloadEvent) {
  if (!isDirty.value) return
  e.preventDefault()
  e.returnValue = ''
}

onMounted(() => window.addEventListener('beforeunload', onBeforeUnload))
onUnmounted(() => window.removeEventListener('beforeunload', onBeforeUnload))

async function login() {
  loginError.value = ''
  try {
    const { data } = await api.post<{ token: string }>('/admin/login', loginForm)
    token.value = data.token
    localStorage.setItem('dog_admin_token', data.token)
    setAuthToken(data.token)
    loginForm.password = ''
    await fetchSmtpConfig()
  } catch {
    loginError.value = 'Identifiants incorrects'
  }
}

function logout() {
  if (!confirmIfDirty()) return
  token.value = null
  localStorage.removeItem('dog_admin_token')
  setAuthToken(null)
}

async function save() {
  if (!draft.value) return
  saving.value = true
  saveMessage.value = ''
  saveDetails.value = null
  try {
    await api.put('/admin/content', draft.value)
    setContent(draft.value)
    lastSaved.value = JSON.parse(JSON.stringify(draft.value)) as SiteContent
    saveMessage.value = 'Contenu enregistré.'
  } catch (err: unknown) {
    const axiosErr = err as { response?: { status?: number; data?: unknown } }
    saveDetails.value = axiosErr.response?.data ?? null
    saveMessage.value = 'Erreur lors de la sauvegarde.'
  } finally {
    saving.value = false
  }
}

async function uploadFile(file: File): Promise<string | null> {
  if (!token.value) return null

  saveDetails.value = null
  const form = new FormData()
  form.append('file', file)
  try {
    const { data } = await api.post<{ url: string }>('/admin/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data.url
  } catch (err: unknown) {
    const axiosErr = err as { response?: { status?: number; data?: unknown } }
    saveDetails.value = axiosErr.response?.data ?? null
    saveMessage.value = "Erreur lors de l'upload."
    return null
  }
}

async function uploadImage(event: Event, target: 'hero' | 'about') {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file || !draft.value) return

  const url = await uploadFile(file)
  if (!url) return

  if (target === 'hero') draft.value.sections.hero.image = url
  else draft.value.sections.about.image = url
}

async function changePassword() {
  try {
    await api.put('/admin/password', passwordForm)
    passwordForm.currentPassword = ''
    passwordForm.newPassword = ''
    saveMessage.value = 'Mot de passe mis à jour.'
  } catch {
    saveMessage.value = 'Mot de passe actuel incorrect.'
  }
}

async function fetchSmtpConfig() {
  try {
    const { data } = await api.get<{ email: string; configured: boolean }>('/admin/smtp')
    smtpForm.email = data.email
    smtpConfigured.value = data.configured
  } catch {
    smtpConfigured.value = false
  }
}

async function saveSmtpConfig() {
  saveMessage.value = ''
  saveDetails.value = null
  try {
    await api.put('/admin/smtp', {
      email: smtpForm.email,
      password: smtpForm.password || undefined,
    })
    smtpConfigured.value = true
    smtpForm.password = ''
    saveMessage.value = 'Configuration email enregistrée.'
  } catch (err: unknown) {
    const axiosErr = err as { response?: { status?: number; data?: unknown } }
    saveDetails.value = axiosErr.response?.data ?? null
    saveMessage.value = 'Configuration email invalide. Vérifiez l\'adresse Gmail et le mot de passe d\'application.'
  }
}

function addService() {
  if (!draft.value) return
  draft.value.sections.services.push({
    title: 'Nouveau service',
    description: '',
    icon: 'build',
  })
}

function removeService(index: number) {
  draft.value?.sections.services.splice(index, 1)
}

function openPortfolioAdd() {
  portfolioModalMode.value = 'add'
  portfolioEditingIndex.value = null
  portfolioModalItem.value = emptyPortfolioItem()
  portfolioModalOpen.value = true
}

function openPortfolioEdit(index: number) {
  if (!draft.value) return
  portfolioModalMode.value = 'edit'
  portfolioEditingIndex.value = index
  portfolioModalItem.value = JSON.parse(JSON.stringify(draft.value.sections.portfolio[index])) as PortfolioItem
  portfolioModalOpen.value = true
}

function closePortfolioModal() {
  portfolioModalOpen.value = false
}

function savePortfolioItem(item: PortfolioItem) {
  if (!draft.value) return

  if (portfolioModalMode.value === 'add') {
    draft.value.sections.portfolio.push(item)
  } else if (portfolioEditingIndex.value !== null) {
    draft.value.sections.portfolio[portfolioEditingIndex.value] = item
  }

  portfolioModalOpen.value = false
}

function removePortfolio(index: number) {
  if (!draft.value) return
  if (!confirm('Supprimer cette entrée du portfolio ?')) return
  draft.value.sections.portfolio.splice(index, 1)
}
</script>

<template>
  <div class="min-h-screen bg-surface">
    <header class="border-b border-border bg-surface-elevated px-6 py-4">
      <div class="mx-auto flex max-w-container items-center justify-between">
        <h1 class="font-display text-xl font-bold text-primary">Admin — Dog Informatique</h1>
        <a class="text-sm text-primary hover:underline" href="/">← Retour au site</a>
      </div>
    </header>

    <main class="mx-auto max-w-container px-6 py-10">
      <section v-if="!isLoggedIn" class="mx-auto max-w-md rounded-xl border border-border bg-surface-elevated p-8">
        <h2 class="mb-6 font-display text-2xl font-semibold">Connexion</h2>
        <form class="space-y-4" @submit.prevent="login">
          <div>
            <label class="mb-1 block text-sm font-medium">Identifiant</label>
            <input
              v-model="loginForm.username"
              class="w-full rounded-lg border border-border px-3 py-2"
              type="text"
              required
            />
          </div>
          <div>
            <label class="mb-1 block text-sm font-medium">Mot de passe</label>
            <input
              v-model="loginForm.password"
              class="w-full rounded-lg border border-border px-3 py-2"
              type="password"
              required
            />
          </div>
          <p v-if="loginError" class="text-sm text-red-600">{{ loginError }}</p>
          <button
            class="w-full rounded-lg bg-primary px-4 py-2 font-semibold text-white hover:bg-primary-dark"
            type="submit"
          >
            Se connecter
          </button>
        </form>
      </section>

      <section v-else-if="draft" class="space-y-10">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div class="space-y-1">
            <p v-if="saveMessage" class="text-sm text-secondary-dark">{{ saveMessage }}</p>
            <details v-if="saveDetails" class="max-w-[60ch] text-xs text-muted">
              <summary class="cursor-pointer select-none">Détails</summary>
              <pre class="mt-2 overflow-x-auto whitespace-pre-wrap rounded-lg border border-border bg-surface p-3">{{ saveDetails }}</pre>
            </details>
          </div>
          <div class="flex gap-3">
            <button
              class="rounded-lg border border-border px-4 py-2 text-sm hover:bg-surface"
              type="button"
              @click="logout"
            >
              Déconnexion
            </button>
            <button
              class="rounded-lg bg-secondary px-4 py-2 text-sm font-semibold text-white hover:bg-secondary-dark disabled:opacity-50"
              type="button"
              :disabled="saving || !isDirty"
              @click="save"
            >
              {{ saving ? 'Enregistrement…' : 'Enregistrer' }}
            </button>
            <span
              v-if="isDirty"
              class="self-center rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted"
            >
              Modifications non enregistrées
            </span>
          </div>
        </div>

        <fieldset class="rounded-xl border border-border bg-surface-elevated p-6">
          <legend class="px-2 font-display text-lg font-semibold">SEO</legend>
          <div class="mt-4 grid gap-4 md:grid-cols-2">
            <label class="block text-sm">
              Titre
              <input v-model="draft.seo.title" class="mt-1 w-full rounded-lg border border-border px-3 py-2" />
            </label>
            <label class="block text-sm">
              Mots-clés
              <input v-model="draft.seo.keywords" class="mt-1 w-full rounded-lg border border-border px-3 py-2" />
            </label>
            <label class="col-span-full block text-sm">
              Description
              <textarea
                v-model="draft.seo.description"
                class="mt-1 w-full rounded-lg border border-border px-3 py-2"
                rows="2"
              />
            </label>
          </div>
        </fieldset>

        <fieldset class="rounded-xl border border-border bg-surface-elevated p-6">
          <legend class="px-2 font-display text-lg font-semibold">Coordonnées</legend>
          <div class="mt-4 grid gap-4 md:grid-cols-2">
            <label class="block text-sm">
              Nom
              <input v-model="draft.business.name" class="mt-1 w-full rounded-lg border border-border px-3 py-2" />
            </label>
            <label class="block text-sm">
              Téléphone
              <input v-model="draft.business.phone" class="mt-1 w-full rounded-lg border border-border px-3 py-2" />
            </label>
            <label class="block text-sm">
              Email
              <input v-model="draft.business.email" class="mt-1 w-full rounded-lg border border-border px-3 py-2" />
            </label>
            <label class="block text-sm">
              Ville
              <input v-model="draft.business.city" class="mt-1 w-full rounded-lg border border-border px-3 py-2" />
            </label>
            <label class="col-span-full block text-sm">
              Adresse
              <input v-model="draft.business.address" class="mt-1 w-full rounded-lg border border-border px-3 py-2" />
            </label>
            <label class="col-span-full block text-sm">
              Horaires
              <input v-model="draft.business.hours" class="mt-1 w-full rounded-lg border border-border px-3 py-2" />
            </label>
          </div>
        </fieldset>

        <fieldset class="rounded-xl border border-border bg-surface-elevated p-6">
          <legend class="px-2 font-display text-lg font-semibold">Hero</legend>
          <div class="mt-4 space-y-4">
            <label class="block text-sm">
              Badge
              <input v-model="draft.sections.hero.badge" class="mt-1 w-full rounded-lg border border-border px-3 py-2" />
            </label>
            <label class="block text-sm">
              Titre (partie 1)
              <input v-model="draft.sections.hero.title" class="mt-1 w-full rounded-lg border border-border px-3 py-2" />
            </label>
            <label class="block text-sm">
              Accent titre
              <input v-model="draft.sections.hero.titleAccent" class="mt-1 w-full rounded-lg border border-border px-3 py-2" />
            </label>
            <label class="block text-sm">
              Sous-titre
              <textarea
                v-model="draft.sections.hero.subtitle"
                class="mt-1 w-full rounded-lg border border-border px-3 py-2"
                rows="2"
              />
            </label>
            <label class="block text-sm">
              CTA principal
              <input
                v-model="draft.sections.hero.ctaLabel"
                class="mt-1 w-full rounded-lg border border-border px-3 py-2"
              />
            </label>
            <label class="block text-sm">
              CTA secondaire
              <input
                v-model="draft.sections.hero.secondaryCtaLabel"
                class="mt-1 w-full rounded-lg border border-border px-3 py-2"
              />
            </label>
            <label class="block text-sm">
              Tag image
              <input v-model="draft.sections.hero.imageTag" class="mt-1 w-full rounded-lg border border-border px-3 py-2" />
            </label>
            <label class="block text-sm">
              Image
              <input type="file" accept="image/*" class="mt-1 block" @change="uploadImage($event, 'hero')" />
              <span v-if="draft.sections.hero.image" class="text-xs text-muted">{{ draft.sections.hero.image }}</span>
            </label>
          </div>
        </fieldset>

        <fieldset class="rounded-xl border border-border bg-surface-elevated p-6">
          <legend class="px-2 font-display text-lg font-semibold">Services</legend>
          <div class="mt-4 space-y-6">
            <div
              v-for="(service, index) in draft.sections.services"
              :key="index"
              class="rounded-lg border border-border p-4"
            >
              <div class="mb-3 flex justify-between">
                <span class="text-sm font-medium">Service {{ index + 1 }}</span>
                <button class="text-sm text-red-600" type="button" @click="removeService(index)">Supprimer</button>
              </div>
              <div class="grid gap-3 md:grid-cols-2">
                <input v-model="service.title" class="rounded-lg border border-border px-3 py-2" placeholder="Titre" />
                <input v-model="service.icon" class="rounded-lg border border-border px-3 py-2" placeholder="Icône" />
                <textarea
                  v-model="service.description"
                  class="col-span-full rounded-lg border border-border px-3 py-2"
                  rows="2"
                  placeholder="Description"
                />
              </div>
            </div>
            <button class="text-sm text-primary hover:underline" type="button" @click="addService">
              + Ajouter un service
            </button>
          </div>
        </fieldset>

        <fieldset class="rounded-xl border border-border bg-surface-elevated p-6">
          <legend class="px-2 font-display text-lg font-semibold">À propos</legend>
          <div class="mt-4 space-y-4">
            <input v-model="draft.sections.about.title" class="w-full rounded-lg border border-border px-3 py-2" />
            <textarea
              v-model="draft.sections.about.body"
              class="w-full rounded-lg border border-border px-3 py-2"
              rows="4"
            />
            <label class="block text-sm">
              Image
              <input type="file" accept="image/*" class="mt-1 block" @change="uploadImage($event, 'about')" />
            </label>
          </div>
        </fieldset>

        <fieldset class="rounded-xl border border-border bg-surface-elevated p-6">
          <legend class="px-2 font-display text-lg font-semibold">Portfolio</legend>
          <div class="mt-4 space-y-4">
            <div
              v-for="(item, index) in draft.sections.portfolio"
              :key="index"
              class="flex flex-wrap items-center gap-4 rounded-lg border border-border p-4"
            >
              <img
                v-if="item.image"
                :src="item.image"
                :alt="item.title"
                class="h-14 w-14 shrink-0 rounded-lg border border-border object-cover"
              />
              <div
                v-else
                class="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-dashed border-border text-xs text-muted"
              >
                —
              </div>
              <div class="min-w-0 flex-1">
                <p class="truncate font-medium">{{ item.title || 'Sans titre' }}</p>
                <p class="truncate text-xs text-muted">{{ item.badge }} · {{ item.tag }}</p>
              </div>
              <div class="flex gap-2">
                <button
                  class="rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-surface"
                  type="button"
                  @click="openPortfolioEdit(index)"
                >
                  Modifier
                </button>
                <button
                  class="text-sm text-red-600 hover:underline"
                  type="button"
                  @click="removePortfolio(index)"
                >
                  Supprimer
                </button>
              </div>
            </div>
            <button class="text-sm text-primary hover:underline" type="button" @click="openPortfolioAdd">
              + Ajouter une entrée
            </button>
          </div>
        </fieldset>

        <fieldset class="rounded-xl border border-border bg-surface-elevated p-6">
          <legend class="px-2 font-display text-lg font-semibold">Social</legend>
          <div class="mt-4 grid gap-4 md:grid-cols-2">
            <input v-model="draft.sections.social.title" class="rounded-lg border border-border px-3 py-2" placeholder="Titre" />
            <input v-model="draft.sections.social.youtubeUrl" class="rounded-lg border border-border px-3 py-2" placeholder="YouTube URL" />
            <input v-model="draft.sections.social.tiktokUrl" class="rounded-lg border border-border px-3 py-2" placeholder="TikTok URL" />
            <textarea
              v-model="draft.sections.social.subtitle"
              class="col-span-full rounded-lg border border-border px-3 py-2"
              rows="2"
              placeholder="Sous-titre"
            />
          </div>
        </fieldset>

        <fieldset class="rounded-xl border border-border bg-surface-elevated p-6">
          <legend class="px-2 font-display text-lg font-semibold">Newsletter</legend>
          <textarea
            v-model="draft.sections.contact.intro"
            class="mt-4 w-full rounded-lg border border-border px-3 py-2"
            rows="2"
            placeholder="Intro"
          />
        </fieldset>

        <fieldset class="rounded-xl border border-border bg-surface-elevated p-6">
          <legend class="px-2 font-display text-lg font-semibold">Documents juridiques</legend>
          <p class="mt-2 text-sm text-muted">
            Textes types à faire valider par un professionnel avant mise en production définitive.
            Prévisualisez sur le site après enregistrement.
          </p>
          <div class="mt-4 space-y-8">
            <RichTextEditor
              v-model="draft.legal.terms"
              label="Conditions d'utilisation"
              min-height="320px"
            />
            <div class="flex gap-4 text-sm">
              <a class="text-primary hover:underline" href="/conditions-utilisation" target="_blank" rel="noopener noreferrer">
                Aperçu CGU →
              </a>
            </div>
            <RichTextEditor
              v-model="draft.legal.privacy"
              label="Politique de confidentialité"
              min-height="320px"
            />
            <div class="flex gap-4 text-sm">
              <a
                class="text-primary hover:underline"
                href="/politique-de-confidentialite"
                target="_blank"
                rel="noopener noreferrer"
              >
                Aperçu confidentialité →
              </a>
            </div>
          </div>
        </fieldset>

        <fieldset class="rounded-xl border border-border bg-surface-elevated p-6">
          <legend class="px-2 font-display text-lg font-semibold">Configuration email (Gmail)</legend>
          <div class="mt-4 space-y-4">
            <div class="rounded-lg border border-border bg-surface p-4 text-sm text-muted">
              <p class="mb-2">
                L'adresse doit être un compte <strong class="text-on-surface">@gmail.com</strong>.
                Utilisez un <strong class="text-on-surface">mot de passe d'application</strong> Google
                (pas votre mot de passe de connexion).
              </p>
              <p>
                Compte Google → Sécurité → Validation en 2 étapes → Mots de passe des applications.
              </p>
            </div>
            <p class="text-sm" :class="smtpConfigured ? 'text-secondary-dark' : 'text-muted'">
              {{ smtpConfigured ? 'Statut : configuré' : 'Statut : non configuré' }}
            </p>
            <form class="grid gap-4 md:grid-cols-2" @submit.prevent="saveSmtpConfig">
              <label class="block text-sm">
                Adresse Gmail
                <input
                  v-model="smtpForm.email"
                  class="mt-1 w-full rounded-lg border border-border px-3 py-2"
                  type="email"
                  placeholder="moncompte@gmail.com"
                  required
                />
              </label>
              <label class="block text-sm">
                Mot de passe d'application
                <input
                  v-model="smtpForm.password"
                  class="mt-1 w-full rounded-lg border border-border px-3 py-2"
                  type="password"
                  :placeholder="smtpConfigured ? 'Laisser vide pour conserver l\'actuel' : 'Mot de passe d\'application'"
                  :required="!smtpConfigured"
                />
              </label>
              <button
                class="rounded-lg border border-primary px-4 py-2 text-sm text-primary hover:bg-primary/5 md:col-span-2 md:w-fit"
                type="submit"
              >
                Enregistrer la configuration email
              </button>
            </form>
          </div>
        </fieldset>

        <fieldset class="rounded-xl border border-border bg-surface-elevated p-6">
          <legend class="px-2 font-display text-lg font-semibold">Changer le mot de passe</legend>
          <form class="mt-4 grid gap-4 md:grid-cols-2" @submit.prevent="changePassword">
            <input
              v-model="passwordForm.currentPassword"
              class="rounded-lg border border-border px-3 py-2"
              type="password"
              placeholder="Mot de passe actuel"
              required
            />
            <input
              v-model="passwordForm.newPassword"
              class="rounded-lg border border-border px-3 py-2"
              type="password"
              placeholder="Nouveau mot de passe (8+ car.)"
              minlength="8"
              required
            />
            <button
              class="rounded-lg border border-primary px-4 py-2 text-sm text-primary hover:bg-primary/5 md:col-span-2 md:w-fit"
              type="submit"
            >
              Mettre à jour
            </button>
          </form>
        </fieldset>
      </section>

      <PortfolioItemModal
        :open="portfolioModalOpen"
        :mode="portfolioModalMode"
        :initial-item="portfolioModalItem"
        :upload-file="uploadFile"
        @close="closePortfolioModal"
        @save="savePortfolioItem"
      />
    </main>
  </div>
</template>
