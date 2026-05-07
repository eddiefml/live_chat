'use client'

import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

export function EmptyState({
  icon,
  title,
  description,
  children,
}: {
  icon?: string
  title: string
  description?: string
  children?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-6 py-12">
      {icon && <div className="text-4xl mb-4">{icon}</div>}
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      {description && <p className="text-sm text-muted mt-1 max-w-sm">{description}</p>}
      {children && <div className="mt-4">{children}</div>}
    </div>
  )
}
