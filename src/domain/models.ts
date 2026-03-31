export type PresenceStatus = 'online' | 'away' | 'busy' | 'offline'

export interface UserProfile {
  id: string
  qqNumber: string
  nickname: string
  status: PresenceStatus
  signature: string
}

export interface Contact {
  id: string
  qqNumber: string
  nickname: string
  groupName: string
  status: PresenceStatus
  remark?: string
}

export interface Group {
  id: string
  name: string
  memberCount: number
  avatarUrl?: string
}

export interface Conversation {
  id: string
  kind: 'private' | 'group'
  contactId?: string
  groupId?: string
  title: string
  unreadCount: number
  lastMessagePreview: string
}

export interface ChatMessage {
  id: string
  conversationId: string
  sender: 'self' | 'contact' | 'system'
  senderName: string
  text: string
  time: string
}

export interface WindowState {
  id: string
  title: string
  kind: 'buddy-list' | 'chat' | 'group-list' | 'group-chat' | 'settings'
  x: number
  y: number
  width: number
  height: number
  minWidth: number
  minHeight: number
  zIndex: number
  minimized: boolean
  maximized: boolean
  active: boolean
  resizable: boolean
  meta?: Record<string, string>
}

export interface ToastNotification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  duration: number
}
