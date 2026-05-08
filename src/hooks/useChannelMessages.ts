'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import { MESSAGE_HISTORY_LIMIT } from '@/lib/constants'
import type { Message, UserPresence } from '@/types'
import type { RealtimeChannel } from '@supabase/supabase-js'

export function useChannelMessages(
  channelRef: React.MutableRefObject<RealtimeChannel | null>,
  channelId: number | null,
  nickname: string,
  sessionId: string
) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [onlineUsers, setOnlineUsers] = useState<Map<string, UserPresence>>(new Map())

  useEffect(() => {
    if (!channelId) return

    setIsLoading(true)
    setError(null)
    setMessages([])

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

  useEffect(() => {
    const channel = channelRef.current
    if (!channel) return

    const handleMessage = (p: { payload: Message }) => {
      const msg = p.payload
      setMessages((prev) => {
        const exists = prev.some(
          (m) => m.id === msg.id || (msg.temp_id && m.id === msg.temp_id)
        )
        if (exists) {
          return prev.map((m) =>
            m.id === msg.temp_id ? { ...msg, id: msg.id || msg.temp_id! } : m
          )
        }
        return [...prev, msg]
      })
    }

    channel.on('broadcast', { event: 'message' }, handleMessage)
    // Presence is handled via the global app:global channel, not here

    // Listeners are cleaned up when the channel is removed in useRealtimeChannel
  }, [channelRef, channelId])

  const sendMessage = useCallback(
    async (content: string) => {
      const ch = channelRef.current
      if (!ch || !channelId || !content.trim()) return

      const tempId = crypto.randomUUID()
      const msgData = {
        id: tempId,
        temp_id: tempId,
        channel_id: channelId,
        nickname: nickname || 'Anonymous',
        content: content.trim(),
        created_at: new Date().toISOString(),
      }

      // Optimistic: add to local state immediately so sender always sees their message
      setMessages((prev) => [...prev, msgData])

      ch.send({
        type: 'broadcast',
        event: 'message',
        payload: msgData,
      })

      const { data, error } = await supabase
        .from('messages')
        .insert({
          channel_id: channelId,
          nickname: nickname || 'Anonymous',
          content: content.trim(),
        })
        .select('*')
        .single()

      if (error) {
        setMessages((prev) => prev.filter((m) => m.id !== tempId))
        setError(new Error(error.message))
        return
      }

      // Replace optimistic message with real DB record
      setMessages((prev) =>
        prev.map((m) => (m.id === tempId ? { ...data, id: data.id } : m))
      )

      ch.send({
        type: 'broadcast',
        event: 'message',
        payload: { ...data, temp_id: tempId },
      })
    },
    [channelRef, channelId, nickname]
  )

  return { messages, isLoading, error, sendMessage, onlineUsers, setOnlineUsers }
}
