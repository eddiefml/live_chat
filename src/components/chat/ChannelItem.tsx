'use client'

import { cn } from '@/lib/utils'
import type { Channel } from '@/types'

export function ChannelItem({
  channel,
  isActive,
  onlineCount,
  onClick,
}: {
  channel: Channel
  isActive: boolean
  onlineCount: number
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors text-left',
        isActive
          ? 'bg-accent/15 text-accent font-medium'
          : 'text-foreground hover:bg-border/50'
      )}
    >
      <span className="truncate flex-1"># {channel.name}</span>
      <span className="flex items-center gap-1 text-xs text-muted shrink-0">
        <span className="w-1.5 h-1.5 rounded-full bg-online" />
        {onlineCount}
      </span>
    </button>
  )
}
