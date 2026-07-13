<script setup lang="ts">
import { onBeforeUnmount, watch } from 'vue'
import { EditorContent, useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'

const props = withDefaults(
  defineProps<{
    modelValue: string
    label?: string
    minHeight?: string
  }>(),
  {
    label: '',
    minHeight: '280px',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit.configure({
      heading: { levels: [2, 3] },
    }),
    Link.configure({
      openOnClick: false,
      HTMLAttributes: { rel: 'noopener noreferrer' },
    }),
  ],
  editorProps: {
    attributes: {
      class:
        'prose-editor min-h-[inherit] px-3 py-2 text-sm text-on-surface outline-none focus:outline-none',
    },
  },
  onUpdate: ({ editor: ed }) => {
    emit('update:modelValue', ed.getHTML())
  },
})

watch(
  () => props.modelValue,
  (value) => {
    const ed = editor.value
    if (!ed) return
    if (ed.getHTML() === value) return
    ed.commands.setContent(value, { emitUpdate: false })
  },
)

onBeforeUnmount(() => {
  editor.value?.destroy()
})

function toggleBold() {
  editor.value?.chain().focus().toggleBold().run()
}

function toggleItalic() {
  editor.value?.chain().focus().toggleItalic().run()
}

function toggleHeading(level: 2 | 3) {
  editor.value?.chain().focus().toggleHeading({ level }).run()
}

function toggleBulletList() {
  editor.value?.chain().focus().toggleBulletList().run()
}

function toggleOrderedList() {
  editor.value?.chain().focus().toggleOrderedList().run()
}

function setLink() {
  const ed = editor.value
  if (!ed) return
  const previous = ed.getAttributes('link').href as string | undefined
  const url = window.prompt('URL du lien', previous ?? 'https://')
  if (url === null) return
  if (url === '') {
    ed.chain().focus().extendMarkRange('link').unsetLink().run()
    return
  }
  ed.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
}

function isActive(name: string, attrs?: Record<string, unknown>) {
  return editor.value?.isActive(name, attrs) ?? false
}
</script>

<template>
  <div class="space-y-2">
    <label v-if="label" class="block text-sm font-medium">{{ label }}</label>
    <div class="overflow-hidden rounded-lg border border-border bg-surface">
      <div v-if="editor" class="flex flex-wrap gap-1 border-b border-border bg-surface-elevated p-2">
        <button
          class="rounded px-2 py-1 text-xs font-semibold hover:bg-surface"
          :class="isActive('bold') ? 'bg-surface text-primary' : 'text-muted'"
          type="button"
          title="Gras"
          @click="toggleBold"
        >
          B
        </button>
        <button
          class="rounded px-2 py-1 text-xs italic hover:bg-surface"
          :class="isActive('italic') ? 'bg-surface text-primary' : 'text-muted'"
          type="button"
          title="Italique"
          @click="toggleItalic"
        >
          I
        </button>
        <button
          class="rounded px-2 py-1 text-xs font-semibold hover:bg-surface"
          :class="isActive('heading', { level: 2 }) ? 'bg-surface text-primary' : 'text-muted'"
          type="button"
          title="Titre H2"
          @click="toggleHeading(2)"
        >
          H2
        </button>
        <button
          class="rounded px-2 py-1 text-xs font-semibold hover:bg-surface"
          :class="isActive('heading', { level: 3 }) ? 'bg-surface text-primary' : 'text-muted'"
          type="button"
          title="Titre H3"
          @click="toggleHeading(3)"
        >
          H3
        </button>
        <button
          class="rounded px-2 py-1 text-xs hover:bg-surface"
          :class="isActive('bulletList') ? 'bg-surface text-primary' : 'text-muted'"
          type="button"
          title="Liste à puces"
          @click="toggleBulletList"
        >
          • Liste
        </button>
        <button
          class="rounded px-2 py-1 text-xs hover:bg-surface"
          :class="isActive('orderedList') ? 'bg-surface text-primary' : 'text-muted'"
          type="button"
          title="Liste numérotée"
          @click="toggleOrderedList"
        >
          1. Liste
        </button>
        <button
          class="rounded px-2 py-1 text-xs hover:bg-surface"
          :class="isActive('link') ? 'bg-surface text-primary' : 'text-muted'"
          type="button"
          title="Lien"
          @click="setLink"
        >
          Lien
        </button>
      </div>
      <div :style="{ minHeight }">
        <EditorContent :editor="editor" />
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.ProseMirror) {
  min-height: inherit;
}

:deep(.ProseMirror h2) {
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  font-size: 1.125rem;
  font-weight: 700;
}

:deep(.ProseMirror h3) {
  margin-top: 0.75rem;
  margin-bottom: 0.35rem;
  font-size: 1rem;
  font-weight: 600;
}

:deep(.ProseMirror p) {
  margin-bottom: 0.5rem;
}

:deep(.ProseMirror ul),
:deep(.ProseMirror ol) {
  margin-bottom: 0.5rem;
  padding-left: 1.25rem;
}

:deep(.ProseMirror ul) {
  list-style: disc;
}

:deep(.ProseMirror ol) {
  list-style: decimal;
}

:deep(.ProseMirror a) {
  color: var(--color-primary);
  text-decoration: underline;
}

:deep(.ProseMirror:focus) {
  outline: none;
}
</style>
