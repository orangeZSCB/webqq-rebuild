import type { QQTransport, QQTransportEvent } from './transport'
import { mockSession } from '@/mocks/mockSession'
import { mockContacts } from '@/mocks/mockContacts'
import { mockConversations, mockMessages } from '@/mocks/mockConversations'
import { mockGroups } from '@/mocks/mockGroups'

export class MockTransport implements QQTransport {
  private listeners = new Set<(event: QQTransportEvent) => void>()

  async connect() {
    this.emit({ type: 'connection.state', state: 'connecting' })
    this.emit({ type: 'connection.state', state: 'connected' })
  }

  async disconnect() {
    this.emit({ type: 'connection.state', state: 'disconnected' })
  }

  async getSelf() {
    return structuredClone(mockSession)
  }

  async getContacts() {
    return structuredClone(mockContacts)
  }

  async getGroups() {
    return structuredClone(mockGroups)
  }

  async getConversations() {
    return structuredClone(mockConversations)
  }

  async getMessages(conversationId: string) {
    return structuredClone(mockMessages.filter((message) => message.conversationId === conversationId))
  }

  subscribe(handler: (event: QQTransportEvent) => void) {
    this.listeners.add(handler)
    return () => {
      this.listeners.delete(handler)
    }
  }

  private emit(event: QQTransportEvent) {
    this.listeners.forEach((handler) => handler(event))
  }
}
