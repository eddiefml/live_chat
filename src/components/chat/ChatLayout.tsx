'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/chat/Sidebar'
import { ChatArea } from '@/components/chat/ChatArea'
import { EmptyState } from '@/components/chat/EmptyState'
import type { Channel } from '@/types'
import type { RealtimeChannel } from '@supabase/supabase-js'

interface TypingData {
  typingUsers: string[]
  emitTyping: () => void
  stopTyping: () => void
}

export function ChatLayout({
  channels,
  isLoading,
  onlineCounts,
  totalOnline,
  activeChannelId,
  activeChannelName,
  channelRef,
  nickname,
  typingData,
  onSelect,
  onCreateChannel,
}: {
  channels: Channel[]
  isLoading: boolean
  onlineCounts: Map<number, number>
  totalOnline: number
  activeChannelId: number | null
  activeChannelName: string
  channelRef: React.MutableRefObject<RealtimeChannel | null>
  nickname: string
  typingData: TypingData
  onSelect: (id: number) => void
  onCreateChannel: (name: string) => Promise<unknown>
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-60 transform transition-transform md:relative md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar
          channels={channels}
          activeChannelId={activeChannelId}
          onlineCounts={onlineCounts}
          totalOnline={totalOnline}
          isLoading={isLoading}
          onSelect={(id) => {
            onSelect(id)
            setSidebarOpen(false)
          }}
          onCreateChannel={onCreateChannel}
        />
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        {/* Mobile top bar */}
        <div className="md:hidden h-12 flex items-center gap-2 px-4 border-b border-border shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded-lg hover:bg-border transition-colors text-muted"
          >
            ☰
          </button>
          <span className="font-semibold text-sm truncate">
            {activeChannelName ? `# ${activeChannelName}` : 'Live Chat'}
          </span>
        </div>

        {activeChannelId ? (
          <ChatArea
            key={activeChannelId}
            channelId={activeChannelId}
            channelName={activeChannelName}
            channelRef={channelRef}
            nickname={nickname}
            onlineCount={onlineCounts.get(activeChannelId) || 0}
            typingData={typingData}
          />
        ) : (
          <EmptyState
            icon="👋"
            title="Welcome to Live Chat"
            description="Select a channel from the sidebar or create a new one to start chatting."
          />
        )}
      </div>
    </div>
  )
}
