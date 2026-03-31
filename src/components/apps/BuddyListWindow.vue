<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useContactsStore } from '@/stores/mock-data'
import { useWindowManagerStore } from '@/stores/windowManager'
import { useConversationsStore } from '@/stores/mock-data'

const contactsStore = useContactsStore()
const { groupedContacts } = storeToRefs(contactsStore)

const windowManager = useWindowManagerStore()
const conversationsStore = useConversationsStore()

const searchQuery = ref('')

const filteredGroupedContacts = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) {
    return groupedContacts.value
  }

  return groupedContacts.value
    .map((group) => ({
      groupName: group.groupName,
      items: group.items.filter(
        (contact) =>
          contact.nickname.toLowerCase().includes(query) ||
          contact.qqNumber.includes(query) ||
          (contact.remark && contact.remark.toLowerCase().includes(query)),
      ),
    }))
    .filter((group) => group.items.length > 0)
})

const handleContactClick = (contactId: string) => {
  const contact = contactsStore.getContactById(contactId)
  if (!contact) {
    return
  }

  let conversation = conversationsStore.getConversationByContactId(contactId)
  if (!conversation) {
    conversation = {
      id: `conv-${contactId}`,
      kind: 'private',
      contactId,
      title: contact.nickname,
      unreadCount: 0,
      lastMessagePreview: '',
    }
    conversationsStore.conversations.push(conversation)
  }

  windowManager.openChatWindow(contactId, conversation.id, `与 ${contact.nickname} 对话中`)
}
</script>

<template>
  <div class="buddy-list">
    <div class="buddy-list__header">
      <div class="buddy-list__search">
        <input v-model="searchQuery" type="text" placeholder="搜索联系人" class="buddy-list__search-input" />
      </div>
    </div>
    <div class="buddy-list__body">
      <div v-if="filteredGroupedContacts.length === 0" class="buddy-list__empty">
        <div class="buddy-list__empty-text">未找到匹配的联系人</div>
      </div>
      <div v-for="group in filteredGroupedContacts" :key="group.groupName" class="buddy-group">
        <div class="buddy-group__header">
          <span class="buddy-group__name">{{ group.groupName }}</span>
          <span class="buddy-group__count">{{ group.items.length }}</span>
        </div>
        <div class="buddy-group__items">
          <div
            v-for="contact in group.items"
            :key="contact.id"
            class="buddy-item"
            @click="handleContactClick(contact.id)"
          >
            <div class="buddy-item__avatar" :data-status="contact.status">
              {{ contact.nickname.charAt(0) }}
            </div>
            <div class="buddy-item__info">
              <div class="buddy-item__nickname">{{ contact.nickname }}</div>
              <div class="buddy-item__signature">{{ contact.qqNumber }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.buddy-list {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.48);
}

.buddy-list__header {
  padding: 12px;
  border-bottom: 1px solid rgba(74, 131, 186, 0.14);
}

.buddy-list__search-input {
  width: 100%;
  height: 28px;
  border: 1px solid rgba(74, 131, 186, 0.22);
  border-radius: 14px;
  padding: 0 12px;
  background: rgba(255, 255, 255, 0.78);
  font-size: 12px;
  color: #2d5f8f;
}

.buddy-list__search-input::placeholder {
  color: rgba(45, 95, 143, 0.48);
}

.buddy-list__body {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}

.buddy-list__empty {
  padding: 32px 16px;
  text-align: center;
}

.buddy-list__empty-text {
  font-size: 12px;
  color: rgba(45, 95, 143, 0.48);
}

.buddy-group {
  margin-bottom: 12px;
}

.buddy-group__header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  font-size: 12px;
  color: #3a6f9f;
  font-weight: 700;
}

.buddy-group__count {
  color: rgba(58, 111, 159, 0.58);
}

.buddy-group__items {
  display: flex;
  flex-direction: column;
}

.buddy-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  cursor: pointer;
  transition: background 120ms ease;
}

.buddy-item:hover {
  background: rgba(255, 255, 255, 0.68);
}

.buddy-item__avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(180deg, #fff, #d8ecff);
  display: grid;
  place-items: center;
  font-weight: 700;
  color: #2d6fad;
  font-size: 14px;
  position: relative;
}

.buddy-item__avatar::after {
  content: '';
  position: absolute;
  right: 0;
  bottom: 0;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid #fff;
}

.buddy-item__avatar[data-status='online']::after {
  background: #52c41a;
}

.buddy-item__avatar[data-status='away']::after {
  background: #faad14;
}

.buddy-item__avatar[data-status='busy']::after {
  background: #f5222d;
}

.buddy-item__avatar[data-status='offline']::after {
  background: #8c8c8c;
}

.buddy-item__info {
  flex: 1;
  min-width: 0;
}

.buddy-item__nickname {
  font-size: 13px;
  font-weight: 600;
  color: #2d5f8f;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.buddy-item__signature {
  font-size: 11px;
  color: rgba(45, 95, 143, 0.58);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
