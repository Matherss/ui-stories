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

const pad = (d: number) => `${d * 16}px`
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
      >
        {{ node.label }}
      </UIStoriesSidebarEl>
      <template v-else>
        <button
          type="button"
          class="uis-tree-group-btn"
          @click="toggle(node.key)"
        >
          <div class="uis-tree-group-btn-label">
            <svg class="uis-tree-group-btn-icon" :class="{ 'uis-tree-group-btn-icon--open': isOpen(node.key) }" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M9.16667 15.8333H4.16667C3.72464 15.8333 3.30072 15.6577 2.98816 15.3452C2.67559 15.0326 2.5 14.6087 2.5 14.1667V5.00001C2.5 4.55798 2.67559 4.13406 2.98816 3.8215C3.30072 3.50894 3.72464 3.33334 4.16667 3.33334H7.5L10 5.83334H15.8333C16.2754 5.83334 16.6993 6.00894 17.0118 6.3215C17.3244 6.63406 17.5 7.05798 17.5 7.50001V10.8333M16.6667 17.5L18.3333 15.8333L16.6667 14.1667M14.1667 14.1667L12.5 15.8333L14.1667 17.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>{{ node.label }}</span>
          </div>
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
  margin-top: 8px;
}

.uis-tree-group {
  padding: 8px 0 8px 16px;
}

.uis-tree-group-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  border: none;
  background: transparent;
  text-align: left;
  
  color: #334155;
  cursor: pointer;
}

.uis-tree-group-btn-label {
  display: flex;
  align-items: center;
  gap: 8px;

  span {
    font-family: var(--uis-font-sans);
    font-size: 14px;
    font-weight: 500;
    line-height: normal;
  }

}

.uis-tree-group-btn-icon {
  color: #3A3B3E;
}

.uis-tree-group-btn-icon--open {
  color: var(--uis-primary);
}

</style>
