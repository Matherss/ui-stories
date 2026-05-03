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
          <span>{{ node.label }}</span>
           <span class="uis-tree-chevron" :class="{ 'uis-tree-chevron--open': isOpen(node.key) }">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M5 7.5L10 12.5L15 7.5" stroke="#3A3B3E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
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
  justify-content: space-between;
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
  display: flex;
  justify-content: center;
  align-items: center;
  transform: rotate(0deg);
  transition: transform 0.15s ease;
  color: #94a3b8;
}

.uis-tree-chevron--open {
  transform: rotate(180deg);
}

</style>
