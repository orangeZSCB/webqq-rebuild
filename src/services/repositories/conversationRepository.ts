import type { ChatMessage, Conversation, Group } from '@/domain/models'
import type { QQTransport } from '@/services/api/transport'

export class ConversationRepository {
  private transport: QQTransport

  constructor(transport: QQTransport) {
    this.transport = transport
  }

  getConversations(): Promise<Conversation[]> {
    return this.transport.getConversations()
  }

  getGroups(): Promise<Group[]> {
    return this.transport.getGroups()
  }

  getMessages(conversationId: string): Promise<ChatMessage[]> {
    return this.transport.getMessages(conversationId)
  }
}
