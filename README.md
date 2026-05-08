# Live Chat

Real-time multi-channel anonymous chat built with Next.js and Supabase.

## Setup

1. Create a [Supabase](https://supabase.com) project
2. Run the SQL migration in `supabase/migrations/001_schema.sql` in the Supabase SQL Editor
3. Enable Realtime on the `messages` and `reactions` tables in Supabase Dashboard → Realtime
4. Copy `.env.local.example` to `.env.local` and fill in your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```

5. Install and run:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Features

- **Anonymous chat** — pick a nickname, no sign-up required
- **Multiple channels** — create and join different rooms
- **Realtime messaging** — instant delivery via Supabase Broadcast
- **Online presence** — see who's online per channel and globally
- **Typing indicators** — know when others are typing
- **Emoji reactions** — react to any message
- **Dark mode** — toggle between light and dark themes
- **URL auto-linkify** — URLs in messages become clickable links


## Tech Stack

- [Next.js 16](https://nextjs.org) (App Router)
- [Supabase](https://supabase.com) (Postgres + Realtime)
- [Tailwind CSS v4](https://tailwindcss.com)
- [TypeScript](https://www.typescriptlang.org)
