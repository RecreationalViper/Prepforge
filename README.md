# PrepForge

A prestige cooking network: calm, editorial, liquid glass. **Make it effortless.**

Live: https://recreationalviper.github.io/prepforge/

## What's in v1
- Liquid Glass design system (`app/globals.css`, `components/GlassCard.tsx`): blur 32 / saturate 180 / contrast 110, pointer-following specular, conic edge lens, orb-adaptive tint, three drifting orbs with 0.3x parallax.
- Top bar (menu drawer, instant search across recipes, people and ingredients, ⌘K), bottom glass dock.
- Today's Table, set every morning by the Daily Curator (`scripts/curate.mjs`): breakfast under 15 min, lunch 30-40 g protein, balanced dinner, two snacks under 200 kcal, one world dish rotating through 30 countries. Chef's notes and SEO titles by Claude (if `ANTHROPIC_API_KEY` is set) or the free Groq/Gemini chain. 30-day archive.
- 3D recipe cards (spring physics), save button with haptics, 7 short-video platform links per recipe (greyed until a video exists).
- Saves (by meal, searchable), Grocery (merge, combine, scale, aisle groups, swipe to delete, share), nearest 3 stores and restaurants for your dish (free OpenStreetMap), Planner, Pantry matcher.
- All business pages: about, contact, terms, privacy, cookies, community, help, careers, press.

## Next layers
Accounts and sync (Supabase, schema in `supabase/schema.sql`), social (profiles, cookbooks, remixes, step comments), AI sous-chef chat, Pro paywall and delivery.

## Run locally
`npm install && npm run dev` (needs Node 20). `npm run curate` refreshes Today's Table.
