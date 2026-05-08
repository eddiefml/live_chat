'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import { MESSAGE_HISTORY_LIMIT } from '@/lib/constants'
import type { Message } from '@/types'

export function useChannelMessages(
  channelId: number | null,
  nickname: string,
  onMsgRef: React.MutableRefObject<(msg: Message) => void>
) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // Wire up the callback ref so useRealtimeChannel can push messages here
  onMsgRef.current = (msg: Message) => {
    setMessages((prev) => {
      if (prev.some((m) => m.id === msg.id)) return prev
      return [...prev, msg]
    })
  }

  // Fetch message history on channel switch
  useEffect(() => {
    if (!channelId) {
      setMessages([])
      return
    }

    setIsLoading(true)
    setError(null)

    supabase
      .from('messages')
      .select('*')
      .eq('channel_id', channelId)
      .order('created_at', { ascending: true })
      .limit(MESSAGE_HISTORY_LIMIT)
      .then(({ data, error }) => {
        if (error) setError(new Error(error.message))
        else setMessages(data || [])
        setIsLoading(false)
      })
  }, [channelId])

  const sendMessage = useCallback(
    async (content: string) => {
      if (!channelId || !content.trim()) return

      const { error } = await supabase.from('messages').insert({
        channel_id: channelId,
        nickname: nickname || 'Anonymous',
        content: content.trim(),
      })

      if (error) setError(new Error(error.message))
    },
    [channelId, nickname]
  )

  return { messages, isLoading, error, sendMessage }
}
