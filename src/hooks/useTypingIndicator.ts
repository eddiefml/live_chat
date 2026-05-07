'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import type { RealtimeChannel } from '@supabase/supabase-js'
import { TYPING_THROTTLE_MS, TYPING_STALE_MS } from '@/lib/constants'

export function useTypingIndicator(
  channelRef: React.MutableRefObject<RealtimeChannel | null>,
  nickname: string
) {
  const [typingUsers, setTypingUsers] = useState<{ nickname: string; lastTyped: number }[]>([])
  const lastEmitRef = useRef(0)
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  useEffect(() => {
    const channel = channelRef.current
    if (!channel) return

    const handleStart = (p: { payload: { nickname: string } }) => {
      const name = p.payload.nickname
      if (name === nickname) return

      setTypingUsers((prev) => {
        const filtered = prev.filter((u) => u.nickname !== name)
        const next = [...filtered, { nickname: name, lastTyped: Date.now() }]

        // Set stale timer
        if (timersRef.current.has(name)) {
          clearTimeout(timersRef.current.get(name))
        }
        timersRef.current.set(
          name,
          setTimeout(() => {
            setTypingUsers((prev) => prev.filter((u) => u.nickname !== name))
            timersRef.current.delete(name)
          }, TYPING_STALE_MS)
        )

        return next
      })
    }

    const handleStop = (p: { payload: { nickname: string } }) => {
      const name = p.payload.nickname
      setTypingUsers((prev) => prev.filter((u) => u.nickname !== name))
      if (timersRef.current.has(name)) {
        clearTimeout(timersRef.current.get(name))
        timersRef.current.delete(name)
      }
    }

    channel.on('broadcast', { event: 'typing:start' }, handleStart)
    channel.on('broadcast', { event: 'typing:stop' }, handleStop)

    return () => {
      timersRef.current.forEach((t) => clearTimeout(t))
      timersRef.current.clear()
    }
  }, [channelRef, nickname])

  const emitTyping = useCallback(() => {
    const now = Date.now()
    if (now - lastEmitRef.current < TYPING_THROTTLE_MS) return
    lastEmitRef.current = now
    channelRef.current?.send({
      type: 'broadcast',
      event: 'typing:start',
      payload: { nickname },
    })
  }, [channelRef, nickname])

  const stopTyping = useCallback(() => {
    channelRef.current?.send({
      type: 'broadcast',
      event: 'typing:stop',
      payload: { nickname },
    })
  }, [channelRef, nickname])

  return {
    typingUsers: typingUsers.map((u) => u.nickname),
    emitTyping,
    stopTyping,
  }
}
