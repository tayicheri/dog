import { computed, ref, readonly } from 'vue'
import { api } from '@/api/client'
import type { SiteContent } from '@/types/content'

const content = ref<SiteContent | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

export function useContent() {
  async function fetchContent() {
    if (content.value) return content.value
    loading.value = true
    error.value = null
    try {
      const { data } = await api.get<SiteContent>('/content')
      content.value = data
      return data
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Erreur de chargement'
      throw e
    } finally {
      loading.value = false
    }
  }

  function setContent(data: SiteContent) {
    content.value = data
  }

  return {
    content: readonly(content),
    loading: readonly(loading),
    isLoading: computed(() => loading.value),
    error: readonly(error),
    fetchContent,
    setContent,
  }
}
