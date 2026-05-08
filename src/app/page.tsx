'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useSessionId } from '@/hooks/useSessionId'
import { useNickname } from '@/hooks/useNickname'
import { useChannels } from '@/hooks/useChannels'
import { useRealtimeChannel } from '@/hooks/useRealtimeChannel'
import { useTypingIndicator } from '@/hooks/useTypingIndicator'
import { ChatLayout } from '@/components/chat/ChatLayout'
import type { UserPresence } from '@/types'

export const dynamic = 'force-dynamic'

export default function Page() {
  const { isNicknameSet } = useNickname()
  const sessionId = useSessionId()
  const { nickname } = useNickname()
  const { channels, isLoading, createChannel } = useChannels()

  const [activeChannelId, setActiveChannelId] = useState<number | null>(null)
  const [onlineCounts, setOnlineCounts] = useState<Map<number, number>>(new Map())
  const [totalOnline, setTotalOnline] = useState(0)

  const activeChannelName = useMemo(
    () => channels.find((c) => c.id === activeChannelId)?.name || '',
    [channels, activeChannelId]
  )

  const { channelRef } = useRealtimeChannel(activeChannelId, sessionId)
  const typingData = useTypingIndicator(channelRef, nickname)

  // Global presence: one channel, tracks current channel, syncs online counts
  useEffect(() => {
    if (!isNicknameSet || !sessionId) return

    const globalChannel = supabase.channel('app:global', {
      config: { presence: { key: sessionId } },
    })

    globalChannel.on('presence', { event: 'sync' }, () => {
      const state = globalChannel.presenceState()
      const users = new Map<string, UserPresence>()
      Object.entries(state).forEach(([key, presences]) => {
        if (presences.length > 0) {
          users.set(key, presences[presences.length - 1] as unknown as UserPresence)
        }
      })

      const counts = new Map<number, number>()
      let globalCount = 0
      users.forEach((u) => {
        globalCount++
        if (u.current_channel_id) {
          counts.set(u.current_channel_id, (counts.get(u.current_channel_id) || 0) + 1)
        }
      })

      setOnlineCounts(counts)
      setTotalOnline(globalCount)
    })

    globalChannel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        globalChannel.track({
          nickname,
          session_id: sessionId,
          current_channel_id: activeChannelId,
          online_at: new Date().toISOString(),
        })
      }
    })

    return () => {
      supabase.removeChannel(globalChannel)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNicknameSet, sessionId, nickname, activeChannelId])

  const handleSelectChannel = useCallback((id: number) => {
    setActiveChannelId(id)
  }, [])

  if (!isNicknameSet) return null

  return (
    <ChatLayout
      channels={channels}
      isLoading={isLoading}
      onlineCounts={onlineCounts}
      totalOnline={totalOnline}
      activeChannelId={activeChannelId}
      activeChannelName={activeChannelName}
      channelRef={channelRef}
      nickname={nickname}
      typingData={typingData}
      onSelect={handleSelectChannel}
      onCreateChannel={createChannel}
    />
  )
}
