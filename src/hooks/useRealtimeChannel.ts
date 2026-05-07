'use client'

import { useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { RealtimeChannel } from '@supabase/supabase-js'

export function useRealtimeChannel(channelId: number | null, sessionId: string) {
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
