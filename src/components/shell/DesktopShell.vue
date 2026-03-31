<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useDesktopStore } from '@/stores/desktop'
import MainPanel from './MainPanel.vue'
import ToolBar from './ToolBar.vue'
import TopBar from './TopBar.vue'

const desktopStore = useDesktopStore()
const { wallpaper } = storeToRefs(desktopStore)
</script>

<template>
  <div id="desktop" class="EQQ_Container" :style="{ background: wallpaper }">
    <TopBar />
    <MainPanel />
    <ToolBar />
  </div>
</template>
