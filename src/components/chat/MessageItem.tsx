'use client'

import { formatTime, extractUrls } from '@/lib/utils'
import { Avatar } from '@/components/ui/Avatar'
import { ReactionBar } from '@/components/chat/ReactionBar'
import { EmojiPicker } from '@/components/chat/EmojiPicker'
import type { Message, ReactionGroup } from '@/types'
import { useState } from 'react'

export function MessageItem({
  message,
  isOwn,
  reactions,
  onAddReaction,
  onRemoveReaction,
}: {
  message: Message
  isOwn: boolean
  reactions: ReactionGroup[]
  onAddReaction: (emoji: string) => void
  onRemoveReaction: (emoji: string) => void
}) {
  const [showEmoji, setShowEmoji] = useState(false)
  const parts = extractUrls(message.content)

  return (
    <div
      className={`flex gap-2 px-4 py-1.5 group hover:bg-black/5 dark:hover:bg-white/5 -mx-2 px-2 rounded ${
        isOwn ? 'flex-row-reverse' : ''
      }`}
      onMouseEnter={() => setShowEmoji(true)}
      onMouseLeave={() => setShowEmoji(false)}
    >
      <Avatar nickname={message.nickname} size="sm" />
      <div className={`flex flex-col min-w-0 relative ${isOwn ? 'items-end' : ''}`}>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-foreground">{message.nickname}</span>
          <span className="text-[10px] text-muted">{formatTime(message.created_at)}</span>
        </div>
        <div
          className={`text-sm mt-0.5 px-3 py-1.5 rounded-2xl max-w-md break-words ${
            isOwn
              ? 'bg-accent text-accent-foreground rounded-br-md'
              : 'bg-bubble-other text-foreground rounded-bl-md'
          }`}
        >
          {parts.map((part, i) =>
            part.url ? (
              <a
                key={i}
                href={part.url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:no-underline"
              >
                {part.text}
              </a>
            ) : (
              <span key={i}>{part.text}</span>
            )
          )}
        </div>
        {reactions.length > 0 && (
          <ReactionBar
            reactions={reactions}
            onToggle={onAddReaction}
            onRemove={onRemoveReaction}
          />
        )}
        {showEmoji && (
          <div className={`absolute bottom-full mb-0.5 z-30 ${isOwn ? 'right-0' : 'left-0'}`}>
            <EmojiPicker onSelect={onAddReaction} />
          </div>
        )}
      </div>
    </div>
  )
}
