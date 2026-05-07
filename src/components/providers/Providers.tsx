'use client'

import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { NicknameProvider } from '@/hooks/useNickname'
import { NicknameDialog } from '@/components/chat/NicknameDialog'
import type { ReactNode } from 'react'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <NicknameProvider>
        <NicknameDialog />
        {children}
      </NicknameProvider>
    </ThemeProvider>
  )
}
