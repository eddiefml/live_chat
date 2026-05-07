'use client'

import { useState, useEffect } from 'react'

function getSessionId(): string {
  try {
    let id = localStorage.getItem('livechat_session_id')
    if (!id) {
      id = crypto.randomUUID()
      localStorage.setItem('livechat_session_id', id)
    }
    return id
  } catch {
    return 'session_' + Math.random().toString(36).slice(2)
  }
}

export function useSessionId(): string {
  const [sessionId] = useState<string>(getSessionId)
  return sessionId
}
