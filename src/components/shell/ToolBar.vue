<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useWindowManagerStore } from '@/stores/windowManager'
import { useNotificationsStore } from '@/stores/notifications'

const windowManager = useWindowManagerStore()
const notificationsStore = useNotificationsStore()
const { taskbarWindows } = storeToRefs(windowManager)

const handleTaskbarClick = (windowId: string) => {
  windowManager.restoreFromTaskbar(windowId)
}

const openSettings = () => {
  windowManager.openSettingsWindow()
}

const showWelcomeToast = () => {
  notificationsStore.pushNotification({
    type: 'info',
    title: 'WebQQ2.0 重构版',
    message: 'v1.0. 基本重构，收发，还原等。',
    duration: 3500,
  })
}
</script>

<template>
  <div id="toolBar">
    <div id="copyrightBar" class="copyrightBar copyrightBar_bg">腾讯公司版权所有 Copyright © 2010</div>
    <div class="toolBar_bg">
      <div id="statusBar">
        <div class="statusBar__left">
          <button id="settingCenterButton" class="settingCenterButton" type="button" @click="openSettings"></button>
          <button class="statusBar__about" type="button" @click="showWelcomeToast">版本说明</button>
        </div>
      </div>
      <div id="taskBar">
        <button
          v-for="windowItem in taskbarWindows"
          :key="windowItem.id"
          class="taskBar__item"
          :class="{ 'taskBar__item--active': windowItem.active && !windowItem.minimized }"
          type="button"
          @click="handleTaskbarClick(windowItem.id)"
        >
          {{ windowItem.title }}
        </button>
      </div>
    </div>
  </div>
</template>
