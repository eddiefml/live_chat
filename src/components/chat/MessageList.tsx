'use client'

import { useRef, useEffect } from 'react'
import { useAutoScroll } from '@/hooks/useAutoScroll'
import { MessageItem } from '@/components/chat/MessageItem'
import { TypingIndicator } from '@/components/chat/TypingIndicator'
import { EmptyState } from '@/components/chat/EmptyState'
import type { Message, ReactionGroup } from '@/types'

export function MessageList({
  messages,
  isLoading,
  nickname,
  reactions,
  typingUsers,
  onAddReaction,
  onRemoveReaction,
}: {
  messages: Message[]
  isLoading: boolean
  nickname: string
  reactions: Map<string | number, ReactionGroup[]>
  typingUsers: string[]
  onAddReaction: (messageId: number, emoji: string) => void
  onRemoveReaction: (messageId: number, emoji: string) => void
}) {
  const { containerRef } = useAutoScroll([messages, typingUsers])

  if (isLoading) {
    return (
      <div className="flex-1 p-4 space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-2">
            <div className="w-7 h-7 rounded-full bg-border animate-pulse shrink-0" />
            <div className="space-y-1 flex-1">
              <div className="h-3 w-20 bg-border animate-pulse rounded" />
              <div className="h-8 w-48 bg-border animate-pulse rounded-2xl" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (messages.length === 0 && typingUsers.length === 0) {
    return (
      <EmptyState
        icon="💬"
        title="No messages yet"
        description="Be the first to say something in this channel."
      />
    )
  }

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto py-2">
      {messages.map((msg, i) => (
        <MessageItem
          key={typeof msg.id === 'string' ? msg.id : msg.id}
          message={msg}
          isOwn={msg.nickname === nickname}
          reactions={reactions.get(typeof msg.id === 'number' ? msg.id : (msg.temp_id || msg.id)) || []}
          onAddReaction={(emoji) => onAddReaction(msg.id as number, emoji)}
          onRemoveReaction={(emoji) => onRemoveReaction(msg.id as number, emoji)}
        />
      ))}
      {typingUsers.length > 0 && <TypingIndicator users={typingUsers} />}
    </div>
  )
}
