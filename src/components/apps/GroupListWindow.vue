<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useGroupsStore, useConversationsStore } from '@/stores/mock-data'
import { useWindowManagerStore } from '@/stores/windowManager'

const groupsStore = useGroupsStore()
const conversationsStore = useConversationsStore()
const windowManager = useWindowManagerStore()
const { groups } = storeToRefs(groupsStore)

const handleOpenGroup = (groupId: string, groupName: string) => {
  let conversation = conversationsStore.getConversationByGroupId(groupId)
  if (!conversation) {
    conversation = {
      id: `conv-${groupId}`,
      kind: 'group',
      groupId,
      title: groupName,
      unreadCount: 0,
      lastMessagePreview: '',
    }
    conversationsStore.conversations.push(conversation)
  }

  windowManager.openGroupChatWindow(groupId, conversation.id, groupName)
}
</script>

<template>
  <div class="group-list">
    <div class="group-list__header">我的群组</div>
    <div class="group-list__body">
      <button v-for="group in groups" :key="group.id" class="group-item" type="button" @click="handleOpenGroup(group.id, group.name)">
        <div class="group-item__avatar">群</div>
        <div class="group-item__info">
          <div class="group-item__name">{{ group.name }}</div>
          <div class="group-item__meta">{{ group.memberCount }} 位成员</div>
        </div>
      </button>
    </div>
  </div>
</template>

<style scoped>
.group-list {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.48);
}

.group-list__header {
  padding: 14px 16px;
  font-size: 14px;
  font-weight: 700;
  color: #2d5f8f;
  border-bottom: 1px solid rgba(74, 131, 186, 0.14);
}

.group-list__body {
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.group-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  border: 1px solid rgba(74, 131, 186, 0.16);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.72);
  padding: 10px 12px;
  cursor: pointer;
  text-align: left;
}

.group-item:hover {
  background: rgba(255, 255, 255, 0.9);
}

.group-item__avatar {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  background: linear-gradient(180deg, #fff, #d8ecff);
  color: #2d6fad;
  font-weight: 700;
}

.group-item__name {
  font-size: 13px;
  font-weight: 600;
  color: #2d5f8f;
}

.group-item__meta {
  font-size: 11px;
  color: rgba(45, 95, 143, 0.58);
}
</style>
