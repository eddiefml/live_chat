export interface Channel {
  id: number
  name: string
  slug: string
  created_at: string
  created_by: string
}

export interface Message {
  id: number | string
  channel_id: number
  nickname: string
  content: string
  created_at: string
  temp_id?: string
}

export interface Reaction {
  id: number
  message_id: number
  nickname: string
  emoji: string
  created_at: string
}

export interface ReactionGroup {
  emoji: string
  count: number
  users: string[]
  hasReacted: boolean
}

export interface UserPresence {
  nickname: string
  session_id: string
  online_at: string
  current_channel_id?: number
}
