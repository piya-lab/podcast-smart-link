# Podcast Smart Link (SKMP)

A "link in bio" style tool for a podcast: every episode gets its own shareable branded page (e.g. `/brent-gill`) with buttons out to Spotify, Apple Podcasts, and YouTube, plus socials, a tagline, and click/visit analytics — all managed from a simple admin dashboard.

**Live site:** https://listen-skmp.netlify.app
**Code:** https://github.com/piya-lab/podcast-smart-link
**Database:** Supabase project "SKMP - Link"

## Pages

- `/` — homepage: latest episode + socials
- `/episodes` — full paginated archive, links through to each episode's page
- `/[episodeSlug]` — each episode's own branded landing page (e.g. `/brent-gill`) — this is the link you actually share
- `/admin` — dashboard: show settings, RSS sync, per-episode links/slugs, visits/CTR table
- `/admin/analytics` — clicks-over-time chart + totals per episode

## Local development

Node.js is installed locally at `~/.local/node` (already on `PATH` via `.zshrc`). A local Postgres database runs via Prisma's built-in dev server.

```bash
npx prisma dev -d   # starts local Postgres in the background (only needed once per reboot)
npm run dev          # starts the app at http://localhost:3000
```

First time setup: go to `/admin`, log in (password from `ADMIN_PASSWORD` in `.env`), fill in show settings, click **Sync new episodes**, then add Spotify/Apple/YouTube links per episode.

## Stack

- **Next.js** (App Router, TypeScript) + **Tailwind CSS**
- **Prisma** ORM against **Supabase Postgres**
- Hosted on **Netlify** (auto-deploys from the `main` branch on GitHub)

## Making changes and deploying

1. Edit code locally, test with `npm run dev`.
2. If the database schema changed (`prisma/schema.prisma`), create a migration and apply it to the **local** dev database:
   ```bash
   npx prisma migrate dev --name describe_the_change
   ```
3. Apply the same migration to **production** (Supabase). Use the **direct** connection (port 5432), not the pooled one — the pooler doesn't support the session-level features Prisma Migrate needs and will hang:
   ```bash
   DATABASE_URL="postgresql://postgres:<password>@db.weqyxiexxawptzwcirjg.supabase.co:5432/postgres?sslmode=require" npx prisma migrate deploy
   ```
4. Commit and push to `main` — Netlify picks up the push automatically and redeploys within ~1 minute.
5. Verify on the live site after deploy.

## Environment variables

Set in **Netlify → Site configuration → Environment variables** (scope: All scopes / Builds+Functions+Runtime):

| Variable | Value |
|---|---|
| `DATABASE_URL` | Supabase **pooled** connection string (Transaction pooler, port 6543) — used by the running app, not migrations |
| `ADMIN_PASSWORD` | Password for `/admin` login |
| `SESSION_SECRET` | Long random string (e.g. `openssl rand -hex 32`) |

Locally, these live in `.env` and point at the local dev Postgres instead.

## Setting up a fresh environment from scratch (reference)

If this ever needs to be redeployed somewhere new:

1. **Database**: create a free Supabase project, copy its pooled connection string (Project → Connect → Transaction pooler) for `DATABASE_URL`, and its direct connection string (port 5432) for running migrations.
2. **Push the schema**: `DATABASE_URL="<direct connection string>" npx prisma migrate deploy`
3. **Hosting**: create a Netlify site, import the GitHub repo, add the three environment variables above, deploy.
4. **First-run setup**: go to `https://<your-site>/admin`, log in, fill in show settings (name, slug, RSS feed URL, logo, tagline, socials), sync episodes, add platform links.
