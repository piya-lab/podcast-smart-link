# Podcast Smart Link

A "link in bio" style page for a podcast: one URL with buttons out to Spotify, Apple Podcasts, and YouTube for every episode, plus socials and branding — with click analytics and an admin dashboard to manage it all.

- **Public page**: `/` (latest episode + socials), `/episodes` (full archive, paginated)
- **Admin**: `/admin` (settings, RSS sync, per-episode platform links), `/admin/analytics` (click totals + chart)

## Local development

Node.js is installed locally at `~/.local/node` (already on your `PATH` via `.zshrc`). A local Postgres database runs via Prisma's built-in dev server.

```bash
npx prisma dev -d   # starts local Postgres in the background (only needed once per reboot)
npm run dev          # starts the app at http://localhost:3000
```

First time setup:

1. Set a real `ADMIN_PASSWORD` in `.env` (it currently defaults to `changeme` — change this before sharing the URL with anyone).
2. Go to `/admin`, log in, fill in the show name, slug, and the podcast's RSS feed URL, save.
3. Click **Sync new episodes** to pull episodes in from the feed.
4. Open each episode and paste in its Spotify / Apple Podcasts / YouTube links (these aren't in the RSS feed, so they're added by hand — see project plan for why).

## Deploying it for real

This app needs a real Postgres database and a host. Recommended: **Vercel** (hosting) + **Neon** (Postgres), both free to start.

### 1. Create a Neon database
1. Go to [neon.com](https://neon.com) and sign up (free tier).
2. Create a new project — any name/region is fine.
3. Copy the connection string it gives you (starts with `postgresql://...`).

### 2. Push the schema to Neon
In your terminal, temporarily point at the Neon database and apply migrations:

```bash
DATABASE_URL="<paste your Neon connection string>" npx prisma migrate deploy
```

### 3. Deploy to Vercel
1. Push this project to a GitHub repo (`git init`, `git add`, `git commit`, then create a repo on GitHub and push).
2. Go to [vercel.com/new](https://vercel.com/new), sign up, and import that GitHub repo.
3. Before the first deploy, add these Environment Variables in Vercel's project settings:
   - `DATABASE_URL` — the same Neon connection string from step 1
   - `ADMIN_PASSWORD` — a real password, not `changeme`
   - `SESSION_SECRET` — any long random string (e.g. generate one with `openssl rand -hex 32`)
4. Deploy. Vercel gives you a `*.vercel.app` URL — you can attach a custom domain in Vercel's project settings afterward.

### 4. First-run setup on the live site
Same as local: go to `https://<your-domain>/admin`, log in, fill in show settings, sync episodes, and add platform links per episode.
