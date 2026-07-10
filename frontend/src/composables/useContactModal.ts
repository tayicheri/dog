import { ref } from 'vue'

const isOpen = ref(false)

export function useContactModal() {
  function openContact() {
    isOpen.value = true
  }

  function closeContact() {
    isOpen.value = false
  }

  return { isOpen, openContact, closeContact }
}
