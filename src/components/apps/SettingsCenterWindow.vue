<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useSessionStore } from '@/stores/mock-data'
import { useThemeStore } from '@/stores/theme'
import { useNotificationsStore } from '@/stores/notifications'
import { useOneBotStore } from '@/stores/onebot'

const sessionStore = useSessionStore()
const themeStore = useThemeStore()
const notificationsStore = useNotificationsStore()
const oneBotStore = useOneBotStore()
const { profile } = storeToRefs(sessionStore)

const enableNotifications = ref(true)
const showStatusBadge = ref(true)
const restoreLayout = ref(true)

const oneBotUrl = ref('ws://localhost:8080/webqq/ws')
const oneBotEnabled = ref(false)

const loadPreferences = () => {
  const saved = localStorage.getItem('webqq-rebuild.preferences')
  if (saved) {
    try {
      const prefs = JSON.parse(saved)
      enableNotifications.value = prefs.enableNotifications ?? true
      showStatusBadge.value = prefs.showStatusBadge ?? true
      restoreLayout.value = prefs.restoreLayout ?? true
      oneBotUrl.value = prefs.oneBotUrl ?? 'ws://localhost:8080/webqq/ws'
      oneBotEnabled.value = prefs.oneBotEnabled ?? false
    } catch {
      // ignore
    }
  }
}

const saveSettings = () => {
  const prefs = {
    enableNotifications: enableNotifications.value,
    showStatusBadge: showStatusBadge.value,
    restoreLayout: restoreLayout.value,
    oneBotUrl: oneBotUrl.value,
    oneBotEnabled: oneBotEnabled.value,
  }
  localStorage.setItem('webqq-rebuild.preferences', JSON.stringify(prefs))

  oneBotStore.config.url = oneBotUrl.value
  oneBotStore.config.enabled = oneBotEnabled.value

  if (oneBotEnabled.value) {
    oneBotStore.connect()
  } else {
    oneBotStore.disconnect()
  }

  notificationsStore.pushNotification({
    type: 'success',
    title: '设置已保存',
    message: '当前设置已保存在本地重构版中。',
    duration: 2400,
  })
}

loadPreferences()
</script>

<template>
  <div class="settings-window">
    <div class="settings-window__section">
      <div class="settings-window__title">账号信息</div>
      <div class="settings-row"><span>昵称</span><strong>{{ profile.nickname }}</strong></div>
      <div class="settings-row"><span>QQ 号</span><strong>{{ profile.qqNumber }}</strong></div>
      <div class="settings-row"><span>签名</span><strong>{{ profile.signature }}</strong></div>
    </div>

    <div class="settings-window__section">
      <div class="settings-window__title">主题设置</div>
      <div class="settings-row"><span>当前主题</span><strong>{{ themeStore.currentTheme().name }}</strong></div>
      <div class="theme-buttons">
        <button
          v-for="(theme, key) in themeStore.THEMES"
          :key="key"
          class="settings-action"
          :class="{ 'settings-action--active': themeStore.themeId === key }"
          type="button"
          @click="themeStore.setTheme(key)"
        >
          {{ theme.name }}
        </button>
      </div>
    </div>

    <div class="settings-window__section">
      <div class="settings-window__title">界面偏好</div>
      <label class="settings-checkbox"><input v-model="enableNotifications" type="checkbox" /> 启用桌面通知</label>
      <label class="settings-checkbox"><input v-model="showStatusBadge" type="checkbox" /> 显示在线状态徽标</label>
      <label class="settings-checkbox"><input v-model="restoreLayout" type="checkbox" /> 启动时恢复窗口布局</label>
    </div>

    <div class="settings-window__section">
      <div class="settings-window__title">OneBot 连接</div>
      <label class="settings-checkbox">
        <input v-model="oneBotEnabled" type="checkbox" /> 启用 OneBot 连接
      </label>
      <div class="settings-row">
        <span>WebSocket URL</span>
        <input v-model="oneBotUrl" class="settings-input" type="text" placeholder="ws://localhost:8080/webqq/ws" />
      </div>
      <div class="settings-row">
        <span>连接状态</span>
        <strong :style="{ color: oneBotStore.connected ? '#52c41a' : '#999' }">
          {{ oneBotStore.connected ? '已连接' : '未连接' }}
        </strong>
      </div>
    </div>

    <div class="settings-window__footer">
      <button class="settings-save" type="button" @click="saveSettings">保存设置</button>
    </div>
  </div>
</template>

<style scoped>
.settings-window {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.5);
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(74, 131, 186, 0.3) transparent;
}

.settings-window__section {
  border: 1px solid rgba(74, 131, 186, 0.14);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.72);
  padding: 14px;
}

.settings-window__title {
  font-size: 14px;
  font-weight: 700;
  color: #2d5f8f;
  margin-bottom: 12px;
}

.settings-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 6px 0;
  font-size: 13px;
  color: #3b6b98;
}

.settings-checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #3b6b98;
  margin-bottom: 8px;
  cursor: pointer;
}

.theme-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.settings-action,
.settings-save {
  height: 32px;
  padding: 0 16px;
  border-radius: 16px;
  border: 1px solid rgba(74, 157, 232, 0.32);
  background: linear-gradient(180deg, #5fb3f6, #4a9de8);
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.settings-action--active {
  background: linear-gradient(180deg, #4a9de8, #3b82c4);
  border-color: rgba(74, 157, 232, 0.6);
}

.settings-window__footer {
  display: flex;
  justify-content: flex-end;
  margin-top: auto;
}

.settings-input {
  flex: 1;
  height: 28px;
  padding: 0 8px;
  border: 1px solid rgba(74, 131, 186, 0.22);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.88);
  font-size: 12px;
  color: #2d5f8f;
}
</style>
