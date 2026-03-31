export interface CQSegment {
  type: 'text' | 'image' | 'at' | 'reply' | 'face' | 'file' | 'record' | 'video'
  data: Record<string, string>
}

export function parseCQCode(message: string): CQSegment[] {
  const segments: CQSegment[] = []
  const regex = /\[CQ:([^,\]]+)(?:,([^\]]+))?\]/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = regex.exec(message)) !== null) {
    // 添加前面的文本
    if (match.index > lastIndex) {
      const text = message.slice(lastIndex, match.index)
      if (text) {
        segments.push({ type: 'text', data: { text } })
      }
    }

    const type = match[1]
    const params = match[2] || ''
    const data: Record<string, string> = {}

    // 解析参数
    if (params) {
      params.split(',').forEach((param) => {
        const [key, ...valueParts] = param.split('=')
        if (key && valueParts.length > 0) {
          data[key] = valueParts.join('=')
        }
      })
    }

    segments.push({ type: type as any, data })
    lastIndex = regex.lastIndex
  }

  // 添加剩余文本
  if (lastIndex < message.length) {
    const text = message.slice(lastIndex)
    if (text) {
      segments.push({ type: 'text', data: { text } })
    }
  }

  return segments.length > 0 ? segments : [{ type: 'text', data: { text: message } }]
}

export function formatMessagePreview(message: string): string {
  const segments = parseCQCode(message)
  return segments.map(seg => {
    switch (seg.type) {
      case 'image': return '[图片]'
      case 'video': return '[视频]'
      case 'record': return '[语音]'
      case 'file': return '[文件]'
      case 'face': return '[表情]'
      case 'at': return `@${seg.data.qq}`
      case 'reply': return '[回复]'
      case 'text': return seg.data.text
      default: return ''
    }
  }).join('')
}
