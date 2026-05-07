'use client'

import { useState } from 'react'
import { ChannelList } from '@/components/chat/ChannelList'
import { CreateChannelDialog } from '@/components/chat/CreateChannelDialog'
import { useNickname } from '@/hooks/useNickname'
import type { Channel } from '@/types'

export function Sidebar({
  channels,
  activeChannelId,
  onlineCounts,
  totalOnline,
  isLoading,
  onSelect,
  onCreateChannel,
}: {
  channels: Channel[]
  activeChannelId: number | null
  onlineCounts: Map<number, number>
  totalOnline: number
  isLoading: boolean
  onSelect: (id: number) => void
  onCreateChannel: (name: string) => Promise<unknown>
}) {
  const [showCreate, setShowCreate] = useState(false)
  const { nickname } = useNickname()

  return (
    <aside className="w-60 flex flex-col border-r border-border bg-card shrink-0">
      <div className="p-3 border-b border-border">
        <div className="flex items-center justify-between">
          <h1 className="font-bold text-sm">Live Chat</h1>
          <button
            onClick={() => setShowCreate(true)}
            className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-border transition-colors text-muted text-lg leading-none"
          >
            +
          </button>
        </div>
        <div className="flex items-center gap-1.5 mt-1 text-xs text-muted">
          <span className="w-1.5 h-1.5 rounded-full bg-online" />
          <span>{totalOnline} online</span>
          <span className="mx-1">·</span>
          <span className="truncate">{nickname}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        <ChannelList
          channels={channels}
          activeChannelId={activeChannelId}
          onlineCounts={onlineCounts}
          isLoading={isLoading}
          onSelect={onSelect}
        />
      </div>

      <CreateChannelDialog
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreate={onCreateChannel}
      />
    </aside>
  )
}
