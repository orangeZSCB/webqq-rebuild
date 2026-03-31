<script setup lang="ts">
import { computed } from 'vue'
import { parseCQCode } from '@/utils/cqcode'
import { useContactsStore } from '@/stores/mock-data'

interface Props {
  text: string
}

const props = defineProps<Props>()
const contactsStore = useContactsStore()

const segments = computed(() => parseCQCode(props.text))

const getAtName = (qq: string) => {
  const contact = contactsStore.getContactById(qq)
  return contact?.nickname || contact?.remark || `用户${qq}`
}

const getImageUrl = (url: string) => {
  // blob: URL（本地预览）直接使用
  if (url.startsWith('blob:')) return url
  const decodedUrl = url.replace(/&amp;/g, '&')
  return `/get_image?url=${encodeURIComponent(decodedUrl)}`
}

const downloadFile = (fileId: string, fileName: string) => {
  window.open(`/get_file?file_id=${fileId}`, '_blank')
}

const playVoice = (file: string, path: string) => {
  // 优先使用 path，如果没有则使用 file
  const filePath = path || file
  const audio = new Audio(`/get_record?file=${encodeURIComponent(filePath)}`)
  audio.play()
}

const getVideoUrl = (url: string) => {
  // 解码 HTML 实体
  const decodedUrl = url.replace(/&amp;/g, '&')
  return `/get_video?url=${encodeURIComponent(decodedUrl)}`
}

const openImage = (url: string) => {
  window.open(url, '_blank')
}
</script>

<template>
  <span class="message-content">
    <template v-for="(seg, idx) in segments" :key="idx">
      <span v-if="seg.type === 'text'">{{ seg.data.text }}</span>
      <img v-else-if="seg.type === 'image'" :src="getImageUrl(seg.data.url)" class="message-image" @click="openImage(getImageUrl(seg.data.url))" @error="(e) => (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22%3E[图片]%3C/text%3E%3C/svg%3E'" />
      <span v-else-if="seg.type === 'at'" class="message-at">@{{ seg.data.name || getAtName(seg.data.qq) }}</span>
      <span v-else-if="seg.type === 'reply'" class="message-reply">[回复: {{ seg.data.text || '消息' }}]</span>
      <span v-else-if="seg.type === 'face'" class="message-face">[表情]</span>
      <button v-else-if="seg.type === 'record'" class="message-voice-btn" @click="playVoice(seg.data.file, seg.data.path || seg.data.url)">
        🔊 语音消息
      </button>
      <video v-else-if="seg.type === 'video'" :src="getVideoUrl(seg.data.url)" class="message-video" controls></video>
      <button v-else-if="seg.type === 'file'" class="message-file-btn" @click="downloadFile(seg.data.file_id, seg.data.file)">
        📎 {{ seg.data.file }}
      </button>
    </template>
  </span>
</template>

<style scoped>
.message-content {
  word-break: break-word;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.message-image {
  max-width: 200px;
  max-height: 200px;
  border-radius: 4px;
  cursor: pointer;
  display: block;
}

.message-video {
  max-width: 300px;
  max-height: 300px;
  border-radius: 4px;
}

.message-at {
  color: #4a83ba;
  font-weight: 600;
}

.message-reply,
.message-face {
  color: #888;
  font-style: italic;
}

.message-voice-btn,
.message-file-btn {
  padding: 6px 12px;
  border: 1px solid #4a83ba;
  border-radius: 6px;
  background: rgba(74, 131, 186, 0.1);
  color: #4a83ba;
  cursor: pointer;
  text-align: left;
  font-size: 12px;
}

.message-voice-btn:hover,
.message-file-btn:hover {
  background: rgba(74, 131, 186, 0.2);
}
</style>
