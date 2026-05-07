'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { ReactionGroup } from '@/types'
import type { RealtimeChannel } from '@supabase/supabase-js'

export function useReactions(
  channelRef: React.MutableRefObject<RealtimeChannel | null>,
  messages: { id: number | string }[],
  nickname: string
) {
  const [reactions, setReactions] = useState<Map<string | number, ReactionGroup[]>>(new Map())

  useEffect(() => {
    const ids = messages.map((m) => m.id).filter((id) => typeof id === 'number') as number[]
    if (ids.length === 0) return

    supabase
      .from('reactions')
      .select('*')
      .in('message_id', ids)
      .then(({ data, error }) => {
        if (error || !data) return
        const grouped = new Map<string | number, ReactionGroup[]>()
        data.forEach((r) => {
          const groups = grouped.get(r.message_id) || []
          const existing = groups.find((g) => g.emoji === r.emoji)
          if (existing) {
            existing.count++
            existing.users.push(r.nickname)
            if (r.nickname === nickname) existing.hasReacted = true
          } else {
            groups.push({
              emoji: r.emoji,
              count: 1,
              users: [r.nickname],
              hasReacted: r.nickname === nickname,
            })
          }
          grouped.set(r.message_id, groups)
        })
        setReactions(grouped)
      })
  }, [messages, nickname])

  useEffect(() => {
    const channel = channelRef.current
    if (!channel) return

    const handleReactionAdd = (p: { payload: { message_id: number; nickname: string; emoji: string } }) => {
      setReactions((prev) => {
        const next = new Map(prev)
        const groups = [...(next.get(p.payload.message_id) || [])]
        const existing = groups.find((g) => g.emoji === p.payload.emoji)
        if (existing) {
          existing.count++
          if (!existing.users.includes(p.payload.nickname)) existing.users.push(p.payload.nickname)
          if (p.payload.nickname === nickname) existing.hasReacted = true
        } else {
          groups.push({
            emoji: p.payload.emoji,
            count: 1,
            users: [p.payload.nickname],
            hasReacted: p.payload.nickname === nickname,
          })
        }
        next.set(p.payload.message_id, groups)
        return next
      })
    }

    const handleReactionRemove = (p: { payload: { message_id: number; nickname: string; emoji: string } }) => {
      setReactions((prev) => {
        const next = new Map(prev)
        const groups = (next.get(p.payload.message_id) || []).map((g) => {
          if (g.emoji !== p.payload.emoji) return g
          const users = g.users.filter((u) => u !== p.payload.nickname)
          return {
            ...g,
            count: g.count - 1,
            users,
            hasReacted: p.payload.nickname === nickname ? false : g.hasReacted,
          }
        }).filter((g) => g.count > 0)
        next.set(p.payload.message_id, groups)
        return next
      })
    }

    channel.on('broadcast', { event: 'reaction:add' }, handleReactionAdd)
    channel.on('broadcast', { event: 'reaction:remove' }, handleReactionRemove)

    return () => {
      // cleanup handled by channel removal
    }
  }, [channelRef, nickname])

  const addReaction = useCallback(
    async (messageId: number, emoji: string) => {
      const { error } = await supabase
        .from('reactions')
        .upsert({ message_id: messageId, nickname, emoji }, { onConflict: 'message_id,nickname,emoji' })

      if (!error) {
        channelRef.current?.send({
          type: 'broadcast',
          event: 'reaction:add',
          payload: { message_id: messageId, nickname, emoji },
        })
      }
    },
    [channelRef, nickname]
  )

  const removeReaction = useCallback(
    async (messageId: number, emoji: string) => {
      const { error } = await supabase
        .from('reactions')
        .delete()
        .eq('message_id', messageId)
        .eq('nickname', nickname)
        .eq('emoji', emoji)

      if (!error) {
        channelRef.current?.send({
          type: 'broadcast',
          event: 'reaction:remove',
          payload: { message_id: messageId, nickname, emoji },
        })
      }
    },
    [channelRef, nickname]
  )

  return { reactions, addReaction, removeReaction }
}
