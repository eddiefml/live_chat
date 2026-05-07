export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export function formatTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHr = Math.floor(diffMin / 60)

  if (diffSec < 10) return 'just now'
  if (diffSec < 60) return `${diffSec}s ago`
  if (diffMin < 60) return `${diffMin}m ago`
  if (diffHr < 24) return `${diffHr}h ago`
  return date.toLocaleDateString()
}

export function formatFullTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString()
}

export function isUrl(text: string): boolean {
  try {
    const url = new URL(text)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

export function extractUrls(text: string): { text: string; url: string }[] {
  const urlRegex = /(https?:\/\/[^\s<]+[^\s<.,;:!?)}\]'"])/g
  const parts: { text: string; url: string }[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = urlRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ text: text.slice(lastIndex, match.index), url: '' })
    }
    parts.push({ text: match[1], url: match[1] })
    lastIndex = match.index + match[1].length
  }

  if (lastIndex < text.length) {
    parts.push({ text: text.slice(lastIndex), url: '' })
  }

  return parts.length > 0 ? parts : [{ text, url: '' }]
}
