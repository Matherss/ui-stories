<script setup lang="ts">
import SidebarBranch from './SidebarBranch.vue'

export interface TreeNode {
  key: string
  label: string
  children: TreeNode[]
  storyId?: string
}

withDefaults(
  defineProps<{
    nodes: TreeNode[]
    currentId?: string | null
    storyHref: (id: string) => string
    isOpen: (key: string) => boolean
    toggle: (key: string) => void
    depth?: number
  }>(),
  { depth: 0 },
)

const pad = (d: number) => `${10 + d * 12}px`
</script>

<template>
  <ul class="uis-tree">
    <li
      v-for="node in nodes"
      :key="node.key"
      :class="node.storyId ? 'uis-tree-leaf' : 'uis-tree-group'"
    >
      <UIStoriesSidebarEl
        v-if="node.storyId"
        :to="storyHref(node.storyId)"
        :active="node.storyId === currentId"
        :padding-left="pad(depth)"
      >
        {{ node.label }}
      </UIStoriesSidebarEl>
      <template v-else>
        <button
          type="button"
          class="uis-tree-group-btn"
          :style="{ paddingLeft: pad(depth) }"
          @click="toggle(node.key)"
        >
          <span class="uis-tree-chevron" :class="{ 'uis-tree-chevron--open': isOpen(node.key) }">›</span>
          <span>{{ node.label }}</span>
        </button>
        <SidebarBranch
          v-show="isOpen(node.key)"
          class="uis-tree-nested"
          :nodes="node.children"
          :current-id="currentId"
          :story-href="storyHref"
          :is-open="isOpen"
          :toggle="toggle"
          :depth="depth + 1"
        />
      </template>
    </li>
  </ul>
</template>

<style scoped>
.uis-tree {
  list-style: none;
  margin: 0;
  padding: 0;
}

.uis-tree-nested {
  margin-top: 2px;
}

.uis-tree-group-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  border: none;
  background: transparent;
  text-align: left;
  padding: 8px 10px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  color: #334155;
  cursor: pointer;
}

.uis-tree-group-btn:hover {
  background: #f8fafc;
}

.uis-tree-chevron {
  display: inline-block;
  transform: rotate(0deg);
  transition: transform 0.15s ease;
  color: #94a3b8;
  width: 14px;
}

.uis-tree-chevron--open {
  transform: rotate(90deg);
}

</style>
