'use client'

import { useState } from 'react'
import { Dialog } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { MAX_CHANNEL_NAME_LENGTH, MIN_CHANNEL_NAME_LENGTH } from '@/lib/constants'

export function CreateChannelDialog({
  open,
  onClose,
  onCreate,
}: {
  open: boolean
  onClose: () => void
  onCreate: (name: string) => Promise<unknown>
}) {
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (trimmed.length < MIN_CHANNEL_NAME_LENGTH) {
      setError(`Name must be at least ${MIN_CHANNEL_NAME_LENGTH} characters`)
      return
    }
    setError(null)
    setCreating(true)
    try {
      await onCreate(trimmed)
      setName('')
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create channel')
    } finally {
      setCreating(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} title="Create a channel">
      <form onSubmit={handleSubmit}>
        <Input
          value={name}
          onChange={(e) => {
            setName(e.target.value)
            setError(null)
          }}
          placeholder="channel-name"
          maxLength={MAX_CHANNEL_NAME_LENGTH}
          autoFocus
        />
        {error && <p className="text-sm text-danger mt-2">{error}</p>}
        <div className="flex justify-end gap-2 mt-4">
          <Button type="button" onClick={onClose} className="bg-border text-foreground">
            Cancel
          </Button>
          <Button type="submit" disabled={creating || !name.trim()} className="bg-accent text-accent-foreground">
            {creating ? 'Creating...' : 'Create'}
          </Button>
        </div>
      </form>
    </Dialog>
  )
}
