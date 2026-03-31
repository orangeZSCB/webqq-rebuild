export interface OneBotConfig {
  url: string
  reconnect?: boolean
  reconnectInterval?: number
}

export interface OneBotMessage {
  type: string
  post_type?: string
  message_type?: string
  user_id?: number
  group_id?: number
  message?: string
  message_id?: number
  time?: number
  sender?: {
    user_id: number
    nickname: string
  }
}

export class OneBotTransport {
  private ws: WebSocket | null = null
  private config: OneBotConfig
  private reconnectTimer: number | null = null
  private messageHandlers: Array<(msg: OneBotMessage) => void> = []

  constructor(config: OneBotConfig) {
    this.config = {
      reconnect: true,
      reconnectInterval: 3000,
      ...config,
    }
  }

  connect() {
    if (this.ws?.readyState === WebSocket.OPEN) return

    this.ws = new WebSocket(this.config.url)

    this.ws.onopen = () => {
      console.log('[OneBot] Connected')
      if (this.reconnectTimer) {
        clearTimeout(this.reconnectTimer)
        this.reconnectTimer = null
      }
    }

    this.ws.onmessage = (event) => {
      console.log('[OneBot] Received message:', event.data)
      try {
        const data = JSON.parse(event.data)
        console.log('[OneBot] Parsed data:', data)
        console.log('[OneBot] Message handlers count:', this.messageHandlers.length)
        this.messageHandlers.forEach((handler) => handler(data))
      } catch (e) {
        console.error('[OneBot] Parse error:', e)
      }
    }

    this.ws.onclose = () => {
      console.log('[OneBot] Disconnected')
      if (this.config.reconnect) {
        this.reconnectTimer = window.setTimeout(() => {
          this.connect()
        }, this.config.reconnectInterval)
      }
    }

    this.ws.onerror = (error) => {
      console.error('[OneBot] Error:', error)
    }
  }

  disconnect() {
    this.config.reconnect = false
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
    this.ws?.close()
    this.ws = null
  }

  onMessage(handler: (msg: OneBotMessage) => void) {
    this.messageHandlers.push(handler)
  }

  sendMessage(messageType: 'private' | 'group', targetId: number, message: string) {
    if (this.ws?.readyState !== WebSocket.OPEN) {
      console.error('[OneBot] Not connected')
      return
    }

    const data: any = {
      action: 'send_msg',
      message_type: messageType,
      message: message,
    }

    if (messageType === 'private') {
      data.user_id = targetId
    } else {
      data.group_id = targetId
    }

    this.ws.send(JSON.stringify(data))
  }

  async callApi(action: string, params: any = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.ws?.readyState !== WebSocket.OPEN) {
        reject(new Error('Not connected'))
        return
      }

      const echo = `${action}_${Date.now()}`
      const data = { action, params, echo }

      const handler = (msg: OneBotMessage) => {
        if ((msg as any).echo === echo) {
          this.messageHandlers = this.messageHandlers.filter((h) => h !== handler)
          if ((msg as any).status === 'ok') {
            resolve((msg as any).data)
          } else {
            reject(new Error((msg as any).message || 'API call failed'))
          }
        }
      }

      this.messageHandlers.push(handler)
      this.ws.send(JSON.stringify(data))

      setTimeout(() => {
        this.messageHandlers = this.messageHandlers.filter((h) => h !== handler)
        reject(new Error('API call timeout'))
      }, 10000)
    })
  }

  async getLoginQRCode(): Promise<{ qrcode: string; qrcode_url: string }> {
    return this.callApi('get_login_qrcode')
  }
}
