'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import { MESSAGE_HISTORY_LIMIT } from '@/lib/constants'
import type { Message } from '@/types'
import type { RealtimeChannel } from '@supabase/supabase-js'

export function useChannelMessages(
  channelId: number | null,
  nickname: string
) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

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

  // Listen for new messages via Postgres Changes (single source of truth)
  useEffect(() => {
    if (!channelId) return

    const msgChannel = supabase.channel(`msg:${channelId}`)

    msgChannel.on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `channel_id=eq.${channelId}`,
      },
      (payload) => {
        const msg = payload.new as Message
        setMessages((prev) => {
          if (prev.some((m) => m.id === msg.id)) return prev
          return [...prev, msg]
        })
      }
    )

    msgChannel.subscribe()

    return () => {
      supabase.removeChannel(msgChannel)
    }
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
