import type { UserProfile } from '@/domain/models'
import type { QQTransport } from '@/services/api/transport'

export class SessionRepository {
  private transport: QQTransport

  constructor(transport: QQTransport) {
    this.transport = transport
  }

  getSelf(): Promise<UserProfile> {
    return this.transport.getSelf()
  }
}
