import type { Contact } from '@/domain/models'
import type { QQTransport } from '@/services/api/transport'

export class ContactRepository {
  private transport: QQTransport

  constructor(transport: QQTransport) {
    this.transport = transport
  }

  getContacts(): Promise<Contact[]> {
    return this.transport.getContacts()
  }
}
