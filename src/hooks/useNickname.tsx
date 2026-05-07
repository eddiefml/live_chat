'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { NICKNAME_MIN_LENGTH, NICKNAME_MAX_LENGTH } from '@/lib/constants'

interface NicknameContextValue {
  nickname: string
  setNickname: (name: string) => string | null
  isNicknameSet: boolean
}

const NicknameContext = createContext<NicknameContextValue | null>(null)

function getStoredNickname(): string {
  try {
    return localStorage.getItem('livechat_nickname') || ''
  } catch {
    return ''
  }
}

function isValidNickname(name: string): string | null {
  const trimmed = name.trim()
  if (trimmed.length < NICKNAME_MIN_LENGTH) {
    return `Name must be at least ${NICKNAME_MIN_LENGTH} characters`
  }
  if (trimmed.length > NICKNAME_MAX_LENGTH) {
    return `Name must be at most ${NICKNAME_MAX_LENGTH} characters`
  }
  if (!/^[a-zA-Z0-9 _-]+$/.test(trimmed)) {
    return 'Only letters, numbers, spaces, hyphens, and underscores allowed'
  }
  return null
}

export function NicknameProvider({ children }: { children: ReactNode }) {
  const [nickname, setNicknameState] = useState('')
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setNicknameState(getStoredNickname())
    setIsLoaded(true)
  }, [])

  const setNickname = useCallback((name: string): string | null => {
    const error = isValidNickname(name)
    if (error) return error
    const trimmed = name.trim()
    setNicknameState(trimmed)
    try {
      localStorage.setItem('livechat_nickname', trimmed)
    } catch { /* ignore */ }
    return null
  }, [])

  if (!isLoaded) {
    return null
  }

  return (
    <NicknameContext.Provider value={{ nickname, setNickname, isNicknameSet: !!nickname }}>
      {children}
    </NicknameContext.Provider>
  )
}

export function useNickname(): NicknameContextValue {
  const ctx = useContext(NicknameContext)
  if (!ctx) throw new Error('useNickname must be used within NicknameProvider')
  return ctx
}
