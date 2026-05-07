'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { MAX_MESSAGE_LENGTH } from '@/lib/constants'

const EMOJI_LIST = ['😀','😂','❤️','🔥','👍','🎉','😮','😢','👏','💯','✨','🥳','🤔','😎','🚀','💪','🙌','😍','🤗','🫶','😭','😤','👀','💀','🍿','☕','🎵','🌈','⭐','💜']

export function MessageInput({
  onSend,
  onTyping,
  onStopTyping,
  disabled,
}: {
  onSend: (content: string) => void
  onTyping: () => void
  onStopTyping: () => void
  disabled: boolean
}) {
  const [content, setContent] = useState('')
  const [showEmoji, setShowEmoji] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const emojiRef = useRef<HTMLDivElement>(null)
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    if (!showEmoji) return
    const handleClick = (e: MouseEvent) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target as Node)) {
        setShowEmoji(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [showEmoji])

  const insertEmoji = useCallback((emoji: string) => {
    const el = inputRef.current
    if (!el) return
    const start = el.selectionStart
    const end = el.selectionEnd
    const newContent = content.slice(0, start) + emoji + content.slice(end)
    setContent(newContent)
    requestAnimationFrame(() => {
      el.focus()
      const pos = start + emoji.length
      el.setSelectionRange(pos, pos)
    })
  }, [content])

  const resetIdleTimer = () => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
    idleTimerRef.current = setTimeout(() => {
      onStopTyping()
    }, 3000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)
    if (e.target.value.trim()) {
      onTyping()
      resetIdleTimer()
    } else {
      onStopTyping()
    }
  }

  const handleSend = () => {
    if (!content.trim() || disabled) return
    onStopTyping()
    onSend(content.trim())
    setContent('')
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="px-4 py-3 border-t border-border shrink-0">
      <div className="relative" ref={emojiRef}>
        {showEmoji && (
          <div className="absolute bottom-full left-0 mb-2 bg-card border border-border rounded-xl p-2 shadow-xl z-50">
            <div className="grid grid-cols-10 gap-0.5">
              {EMOJI_LIST.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => {
                    insertEmoji(emoji)
                    setShowEmoji(false)
                  }}
                  className="w-8 h-8 flex items-center justify-center rounded hover:bg-border transition-colors text-lg"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="flex items-end gap-2">
          <button
            type="button"
            onClick={() => setShowEmoji((v) => !v)}
            className="p-2 rounded-lg hover:bg-border transition-colors text-lg shrink-0"
            title="Add emoji"
          >
            😀
          </button>
          <textarea
            ref={inputRef}
            value={content}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onBlur={() => {
              onStopTyping()
              if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
            }}
            placeholder="Type a message... (Enter to send, Shift+Enter for newline)"
            rows={1}
            maxLength={MAX_MESSAGE_LENGTH}
            disabled={disabled}
            className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent text-sm resize-none max-h-32"
          />
          <button
            onClick={handleSend}
            disabled={!content.trim() || disabled}
            className="px-3 py-2 bg-accent text-accent-foreground rounded-lg font-medium text-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity shrink-0"
          >
            Send
          </button>
        </div>
      </div>
      {content.length > MAX_MESSAGE_LENGTH * 0.8 && (
        <p className="text-xs text-muted mt-1 text-right">
          {content.length}/{MAX_MESSAGE_LENGTH}
        </p>
      )}
    </div>
  )
}
