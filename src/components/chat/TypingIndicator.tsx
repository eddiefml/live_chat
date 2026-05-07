'use client'

import { cn } from '@/lib/utils'

export function TypingIndicator({ users }: { users: string[] }) {
  const text =
    users.length === 1
      ? `${users[0]} is typing...`
      : users.length <= 3
        ? `${users.slice(0, -1).join(', ')} and ${users[users.length - 1]} are typing...`
        : `${users[0]}, ${users[1]}, and ${users.length - 2} others are typing...`

  return (
    <div className="flex items-center gap-2 px-4 py-1 text-xs text-muted">
      <div className="flex gap-0.5">
        <span className="w-1 h-1 rounded-full bg-muted animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-1 h-1 rounded-full bg-muted animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-1 h-1 rounded-full bg-muted animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
      {text}
    </div>
  )
}
