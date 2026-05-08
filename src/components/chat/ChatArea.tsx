'use client'

import { useCallback } from 'react'
import { useChannelMessages } from '@/hooks/useChannelMessages'
import { useReactions } from '@/hooks/useReactions'
import { ChatHeader } from '@/components/chat/ChatHeader'
import { MessageList } from '@/components/chat/MessageList'
import { MessageInput } from '@/components/chat/MessageInput'
import type { Message } from '@/types'
import type { RealtimeChannel } from '@supabase/supabase-js'

interface TypingData {
  typingUsers: string[]
  emitTyping: () => void
  stopTyping: () => void
}

export function ChatArea({
  channelId,
  channelName,
  channelRef,
  nickname,
  onlineCount,
  typingData,
  onMsgRef,
}: {
  channelId: number
  channelName: string
  channelRef: React.MutableRefObject<RealtimeChannel | null>
  nickname: string
  onlineCount: number
  typingData: TypingData
  onMsgRef: React.MutableRefObject<(msg: Message) => void>
}) {
  const { messages, isLoading, sendMessage } = useChannelMessages(channelId, nickname, onMsgRef)

  const { reactions, addReaction, removeReaction } = useReactions(
    channelRef,
    messages,
    nickname
  )

  const handleSend = useCallback(
    (content: string) => {
      sendMessage(content)
    },
    [sendMessage]
  )

  return (
    <div className="flex-1 flex flex-col min-w-0 min-h-0">
      <ChatHeader channelName={channelName} onlineCount={onlineCount} />
      <MessageList
        messages={messages}
        isLoading={isLoading}
        nickname={nickname}
        reactions={reactions}
        typingUsers={typingData.typingUsers.filter((u) => u !== nickname)}
        onAddReaction={(messageId, emoji) => addReaction(messageId, emoji)}
        onRemoveReaction={(messageId, emoji) => removeReaction(messageId, emoji)}
      />
      <MessageInput
        onSend={handleSend}
        onTyping={typingData.emitTyping}
        onStopTyping={typingData.stopTyping}
        disabled={!channelName}
      />
    </div>
  )
}
