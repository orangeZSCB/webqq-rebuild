<script setup lang="ts">
import { ref } from 'vue'
import { useOneBotStore } from '@/stores/onebot'
import { useNotificationsStore } from '@/stores/notifications'

const oneBotStore = useOneBotStore()
const notificationsStore = useNotificationsStore()

const connecting = ref(false)
const qrcodeImage = ref('')
const showQRCode = ref(false)

const handleGetQRCode = async () => {
  console.log('[BotLogin] 点击获取二维码按钮')
  connecting.value = true
  showQRCode.value = false

  try {
    console.log('[BotLogin] 调用 Python HTTP API 获取二维码...')
    const response = await fetch('http://localhost:19114/qrcode')
    const result = await response.json()
    console.log('[BotLogin] 响应:', result)

    if (result.qrcode) {
      qrcodeImage.value = result.qrcode
      showQRCode.value = true

      notificationsStore.pushNotification({
        type: 'success',
        title: '二维码已生成',
        message: '请使用手机 QQ 扫码登录',
        duration: 2000,
      })
    } else {
      throw new Error(result.error || '获取二维码失败')
    }
  } catch (e) {
    console.error('[BotLogin] 获取二维码失败:', e)
    notificationsStore.pushNotification({
      type: 'error',
      title: '获取二维码失败',
      message: String(e),
      duration: 3000,
    })
  } finally {
    connecting.value = false
  }
}

const handleConnect = async () => {
  console.log('[BotLogin] 点击登录按钮')
  connecting.value = true

  try {
    console.log('[BotLogin] 设置 OneBot 配置: ws://localhost:8080/webqq/ws')
    oneBotStore.config.url = 'ws://localhost:8080/webqq/ws'
    await oneBotStore.connect()

    console.log('[BotLogin] 连接成功')
    notificationsStore.pushNotification({
      type: 'success',
      title: '连接成功',
      message: 'Bot 已连接，正在获取数据...',
      duration: 2000,
    })
  } catch (e) {
    console.error('[BotLogin] 连接失败:', e)
    notificationsStore.pushNotification({
      type: 'error',
      title: '连接失败',
      message: '请确保已完成登录',
      duration: 3000,
    })
  } finally {
    connecting.value = false
  }
}
</script>

<template>
  <div class="login-window">
    <div class="login-window__header">
      <h2>QQ 登录</h2>
      <p>{{ showQRCode ? '请使用手机 QQ 扫码登录' : '连接到 Bot 服务' }}</p>
    </div>

    <div class="login-window__form">
      <template v-if="!showQRCode">
        <button :disabled="connecting" @click="handleGetQRCode">
          {{ connecting ? '连接中...' : '获取二维码' }}
        </button>
      </template>

      <template v-else>
        <div class="qrcode-container">
          <img :src="qrcodeImage" alt="登录二维码" class="qrcode-image" />
        </div>

        <button :disabled="connecting" @click="handleConnect">
          {{ connecting ? '验证中...' : '扫码完成，点击登录' }}
        </button>

        <button class="btn-secondary" @click="showQRCode = false">
          重新获取二维码
        </button>
      </template>
    </div>
  </div>
</template>

<style scoped>
.login-window {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.5);
  padding: 32px;
}

.login-window__header {
  text-align: center;
  margin-bottom: 32px;
}

.login-window__header h2 {
  font-size: 24px;
  color: var(--color-primary);
  margin-bottom: 8px;
}

.login-window__header p {
  font-size: 14px;
  color: var(--color-text-secondary);
}

.login-window__form {
  width: 100%;
  max-width: 420px;
  min-width: 420px;
}

.login-window__form label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.login-window__form span {
  font-size: 13px;
  color: var(--color-text-secondary);
}

.login-window__form input {
  height: 40px;
  padding: 0 12px;
  border: 1px solid rgba(74, 131, 186, 0.22);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.88);
  font-size: 14px;
}

.login-window__form button {
  width: 100%;
  height: 40px;
  border-radius: 20px;
  border: none;
  background: linear-gradient(180deg, #5fb3f6, #4a9de8);
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.login-window__form button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.qrcode-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background: #fff;
  border-radius: 12px;
  margin-bottom: 16px;
}

.qrcode-image {
  width: 280px;
  height: 280px;
}

.btn-secondary {
  margin-top: 8px;
  background: rgba(74, 131, 186, 0.1) !important;
  color: var(--color-primary) !important;
}
</style>
