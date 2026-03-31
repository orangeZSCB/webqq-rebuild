import type { ChatMessage, Contact, Conversation, Group, UserProfile } from '@/domain/models'

export interface QQTransport {
  connect(): Promise<void>
  disconnect(): Promise<void>
  getSelf(): Promise<UserProfile>
  getContacts(): Promise<Contact[]>
  getGroups(): Promise<Group[]>
  getConversations(): Promise<Conversation[]>
  getMessages(conversationId: string): Promise<ChatMessage[]>
  subscribe(handler: (event: QQTransportEvent) => void): () => void
}

export type QQTransportEvent =
  | {
      type: 'connection.state'
      state: 'connecting' | 'connected' | 'disconnected'
    }
  | {
      type: 'message.received'
      conversationId: string
      message: ChatMessage
    }
