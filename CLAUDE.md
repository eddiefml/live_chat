# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Multi-channel anonymous live chat app. Next.js 16 App Router + Supabase Realtime (Broadcast + Presence). No authentication — users pick a nickname stored in localStorage. Fully client-side rendering (`'use client'` throughout); no SSR, no API routes, no middleware. All data access is direct browser→Supabase via the anon key with permissive RLS.

## Commands

```
npm run dev      # Start dev server (port 3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Architecture

```
Supabase Realtime:
  app:global     → Presence (sidebar online counts, per-channel tallies)
  room:<id>      → Broadcast (messages, typing, reactions) + Presence (per-ch users)

Postgres tables:
  channels       → id, name, slug, created_at, created_by
  messages       → id, channel_id, nickname, content, created_at
  reactions      → id, message_id, nickname, emoji, created_at (UNIQUE: message_id+nickname+emoji)

All RLS: USING (true) — fully permissive for anonymous access
```

### Message flow
1. User sends → broadcast with temp UUID (optimistic) + INSERT to DB
2. On DB success → broadcast with real ID → all clients dedup/replace
3. Channel switch → fetch last 100 from DB, then listen for live broadcasts

### Hook data flow
`useRealtimeChannel(channelId)` stores Supabase channel in ref → sub-hooks (`useChannelMessages`, `useTypingIndicator`, `useReactions`) access `channelRef.current` to register `.on()` listeners. Channel cleanup on switch is handled by `supabase.removeChannel()`.

## Environment

```
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
```

See `supabase/migrations/001_schema.sql` for the database schema.
