<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useSessionStore } from '@/stores/mock-data'
import { useThemeStore } from '@/stores/theme'

const sessionStore = useSessionStore()
const themeStore = useThemeStore()
const { profile } = storeToRefs(sessionStore)

const cycleTheme = () => {
  const themeIds = Object.keys(themeStore.THEMES)
  const currentIndex = themeIds.indexOf(themeStore.themeId)
  const nextIndex = (currentIndex + 1) % themeIds.length
  themeStore.setTheme(themeIds[nextIndex])
}
</script>

<template>
  <div id="topBar">
    <div class="topBar_bg">
      <a id="logo" href="#" title="WebQQ2.0"></a>
      <div class="topBar_actions">
        <button class="theme-pill" type="button" @click="cycleTheme" :title="`当前主题：${themeStore.currentTheme().name}`">
          {{ themeStore.currentTheme().name }}
        </button>
      </div>
      <div id="qqBar" class="qqBar">
        <div class="qq-avatar">{{ profile.nickname.charAt(0) }}</div>
        <div class="qq-meta">
          <div class="qq-nickname">{{ profile.nickname }}</div>
          <div class="qq-status">{{ profile.status === 'online' ? '在线' : profile.status }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
