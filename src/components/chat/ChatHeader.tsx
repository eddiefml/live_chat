'use client'

import { useNickname } from '@/hooks/useNickname'
import { useTheme } from '@/components/providers/ThemeProvider'

export function ChatHeader({
  channelName,
  onlineCount,
}: {
  channelName: string
  onlineCount: number
}) {
  const { nickname } = useNickname()
  const { theme, toggle } = useTheme()

  return (
    <div className="h-12 flex items-center justify-between px-4 border-b border-border shrink-0">
      <div className="flex items-center gap-2">
        <h2 className="font-semibold text-sm"># {channelName}</h2>
        <span className="flex items-center gap-1 text-xs text-muted">
          <span className="w-1.5 h-1.5 rounded-full bg-online" />
          {onlineCount} online
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted hidden sm:inline">{nickname}</span>
        <button
          onClick={toggle}
          className="p-1.5 rounded-lg hover:bg-border transition-colors text-muted"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? '☀' : '☾'}
        </button>
      </div>
    </div>
  )
}
