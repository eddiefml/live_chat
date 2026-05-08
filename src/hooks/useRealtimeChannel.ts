'use client'

import { useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { Message } from '@/types'
import type { RealtimeChannel } from '@supabase/supabase-js'

export function useRealtimeChannel(
  channelId: number | null,
  sessionId: string,
  onMsgRef: React.MutableRefObject<(msg: Message) => void>
) {
  const channelRef = useRef<RealtimeChannel | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    if (!channelId || !sessionId) return

    const channel = supabase.channel(`room:${channelId}`, {
      config: {
        broadcast: { self: true },
        presence: { key: sessionId },
      },
    })

    // Postgres Changes for messages — must be registered BEFORE subscribe
    channel.on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `channel_id=eq.${channelId}`,
      },
      (payload) => {
        onMsgRef.current(payload.new as Message)
      }
    )

    channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') setIsConnected(true)
      if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') setIsConnected(false)
    })

    channelRef.current = channel

    return () => {
      setIsConnected(false)
      supabase.removeChannel(channel)
      channelRef.current = null
    }
  }, [channelId, sessionId])

  return { channelRef, isConnected }
}
