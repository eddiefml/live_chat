'use client'

import { ChannelItem } from '@/components/chat/ChannelItem'
import type { Channel } from '@/types'

export function ChannelList({
  channels,
  activeChannelId,
  onlineCounts,
  isLoading,
  onSelect,
}: {
  channels: Channel[]
  activeChannelId: number | null
  onlineCounts: Map<number, number>
  isLoading: boolean
  onSelect: (id: number) => void
}) {
  if (isLoading) {
    return (
      <div className="space-y-1 px-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-9 rounded-lg bg-border animate-pulse" />
        ))}
      </div>
    )
  }

  if (channels.length === 0) {
    return (
      <div className="px-3 py-6 text-center">
        <p className="text-sm text-muted">No channels yet</p>
        <p className="text-xs text-muted mt-1">Create the first one!</p>
      </div>
    )
  }

  return (
    <div className="space-y-0.5 px-2">
      {channels.map((ch) => (
        <ChannelItem
          key={ch.id}
          channel={ch}
          isActive={ch.id === activeChannelId}
          onlineCount={onlineCounts.get(ch.id) || 0}
          onClick={() => onSelect(ch.id)}
        />
      ))}
    </div>
  )
}
