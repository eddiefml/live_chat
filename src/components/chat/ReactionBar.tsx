'use client'

import type { ReactionGroup } from '@/types'

export function ReactionBar({
  reactions,
  onToggle,
  onRemove,
}: {
  reactions: ReactionGroup[]
  onToggle: (emoji: string) => void
  onRemove: (emoji: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-1 mt-0.5">
      {reactions.slice(0, 3).map((r) => (
        <button
          key={r.emoji}
          onClick={() => (r.hasReacted ? onRemove(r.emoji) : onToggle(r.emoji))}
          className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-xs transition-colors ${
            r.hasReacted
              ? 'bg-accent/20 text-accent ring-1 ring-accent/50'
              : 'bg-card border border-border hover:border-accent/50'
          }`}
        >
          <span>{r.emoji}</span>
          <span className="text-muted">{r.count}</span>
        </button>
      ))}
      {reactions.length > 3 && (
        <span className="text-xs text-muted px-1">
          +{reactions.length - 3}
        </span>
      )}
    </div>
  )
}
