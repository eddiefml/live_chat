'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import { generateSlug } from '@/lib/utils'
import type { Channel } from '@/types'

export function useChannels() {
  const [channels, setChannels] = useState<Channel[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    supabase
      .from('channels')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) setError(new Error(error.message))
        else setChannels(data || [])
        setIsLoading(false)
      })
  }, [])

  const createChannel = useCallback(async (name: string): Promise<Channel> => {
    const slug = generateSlug(name)
    const { data, error } = await supabase
      .from('channels')
      .insert({ name: name.trim(), slug, created_by: 'anon' })
      .select('*')
      .single()

    if (error) {
      if (error.code === '23505') {
        throw new Error('A channel with this name already exists')
      }
      throw new Error(error.message)
    }

    setChannels((prev) => [data, ...prev])
    return data
  }, [])

  return { channels, isLoading, error, createChannel }
}
