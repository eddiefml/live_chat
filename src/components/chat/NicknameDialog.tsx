'use client'

import { useState } from 'react'
import { useNickname } from '@/hooks/useNickname'
import { NICKNAME_MIN_LENGTH, NICKNAME_MAX_LENGTH } from '@/lib/constants'

export function NicknameDialog() {
  const { nickname, setNickname, isNicknameSet } = useNickname()
  const [input, setInput] = useState(nickname)
  const [error, setError] = useState<string | null>(null)

  if (isNicknameSet) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const err = setNickname(input)
    if (err) {
      setError(err)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-card border border-border rounded-xl p-6 w-full max-w-sm mx-4 shadow-xl">
        <h1 className="text-xl font-semibold text-foreground mb-2">Welcome to Live Chat</h1>
        <p className="text-muted text-sm mb-4">Pick a nickname to get started</p>
        <form onSubmit={handleSubmit}>
          <input
            id="nickname"
            name="nickname"
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
              setError(null)
            }}
            placeholder="Enter nickname..."
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent text-sm"
            maxLength={NICKNAME_MAX_LENGTH}
            autoFocus
          />
          <p className="text-xs text-muted mt-1">
            {input.trim().length}/{NICKNAME_MIN_LENGTH} min, {NICKNAME_MAX_LENGTH} max
          </p>
          {error && <p className="text-sm text-danger mt-2">{error}</p>}
          <button
            type="submit"
            className="mt-4 w-full px-4 py-2 bg-accent text-accent-foreground rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            Join Chat
          </button>
        </form>
      </div>
    </div>
  )
}
