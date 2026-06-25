<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { StoryMeta } from '../../../types/story-meta'
import SidebarBranch, { type TreeNode } from './SidebarBranch.vue'

const props = defineProps<{
  storyIds: string[]
  storiesMeta: Record<string, StoryMeta>
  currentId?: string | null
  basePath: string
}>()

const search = ref('')
const openGroups = ref<Set<string>>(new Set())

function normalizeBase(): string {
  return props.basePath.replace(/\/$/, '') || '/stories'
}

function storyHref(id: string): string {
  return `${normalizeBase()}/${id}`
}

function sortChildren(nodes: TreeNode[]) {
  nodes.sort((a, b) => {
    const af = a.storyId ? 1 : 0
    const bf = b.storyId ? 1 : 0
    if (af !== bf)
      return af - bf
    return a.label.localeCompare(b.label, 'ru')
  })
  for (const n of nodes) {
    if (!n.storyId)
      sortChildren(n.children)
  }
}

function buildTree(): TreeNode[] {
  const rootChildren: TreeNode[] = []
  const q = search.value.trim().toLowerCase()

  function ensureFolder(pathAcc: string, label: string, level: TreeNode[]): TreeNode {
    let folder = level.find(n => !n.storyId && n.label === label)
    if (!folder) {
      folder = { key: pathAcc, label, children: [] }
      level.push(folder)
    }
    return folder
  }

  for (const id of props.storyIds) {
    const meta = props.storiesMeta[id]
    if (!meta)
      continue
    if (q && !meta.name.toLowerCase().includes(q) && !id.toLowerCase().includes(q))
      continue

    const dirs = meta.directory?.length ? meta.directory : ['Stories']
    let level = rootChildren
    let pathAcc = ''

    for (const segment of dirs) {
      pathAcc += `/${segment}`
      const folder = ensureFolder(pathAcc, segment, level)
      level = folder.children
    }

    level.push({
      key: `${id}::story`,
      label: meta.name,
      children: [],
      storyId: id,
    })
  }

  sortChildren(rootChildren)
  return rootChildren
}

const tree = computed(() => buildTree())

function collectAncestorKeys(
  nodes: TreeNode[],
  targetId: string,
  ancestors: string[] = [],
): string[] | null {
  for (const n of nodes) {
    if (n.storyId === targetId)
      return ancestors
    if (!n.storyId) {
      const found = collectAncestorKeys(n.children, targetId, [...ancestors, n.key])
      if (found)
        return found
    }
  }
  return null
}

watch(
  () => [tree.value, props.currentId] as const,
  ([nodes, currentId]) => {
    if (!currentId)
      return
    const ancestors = collectAncestorKeys(nodes, currentId)
    if (!ancestors?.length)
      return
    const next = new Set(openGroups.value)
    for (const k of ancestors)
      next.add(k)
    openGroups.value = next
  },
)

function isOpen(key: string): boolean {
  return openGroups.value.has(key)
}

function toggle(key: string) {
  const next = new Set(openGroups.value)
  if (next.has(key))
    next.delete(key)
  else
    next.add(key)
  openGroups.value = next
}
</script>

<template>
  <aside class="uis-sidebar">
    <UIStoriesSearch v-model="search" />

    <nav class="uis-sidebar-nav" aria-label="Stories">
      <SidebarBranch
        :nodes="tree"
        :current-id="currentId"
        :story-href="storyHref"
        :is-open="isOpen"
        :toggle="toggle"
        :depth="0"
      />
    </nav>
  </aside>
</template>

<style scoped>
.uis-sidebar {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.uis-sidebar-nav {
  flex: 1;
  overflow: auto;
}
</style>
