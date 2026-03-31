<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useDesktopStore } from '@/stores/desktop'

const desktopStore = useDesktopStore()
const { sidebarOpen, toggleBarTitle } = storeToRefs(desktopStore)
</script>

<template>
  <button
    id="toggleBar"
    class="toggleBar"
    :class="sidebarOpen ? 'toggleBar_show' : 'toggleBar_hide'"
    :title="toggleBarTitle"
    type="button"
    @click="desktopStore.toggleSidebar()"
  >
    <span class="toggleBar__arrow">{{ sidebarOpen ? '◀' : '▶' }}</span>
  </button>
</template>
