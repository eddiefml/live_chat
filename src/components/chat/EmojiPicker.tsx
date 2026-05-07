import { REACTION_EMOJIS } from '@/lib/constants'

export function EmojiPicker({ onSelect }: { onSelect: (emoji: string) => void }) {
  return (
    <div className="flex gap-0.5 bg-card border border-border rounded-lg px-1 py-0.5 shadow-lg">
      {REACTION_EMOJIS.map((emoji) => (
        <button
          key={emoji}
          onClick={() => onSelect(emoji)}
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-border transition-colors text-sm"
        >
          {emoji}
        </button>
      ))}
    </div>
  )
}
