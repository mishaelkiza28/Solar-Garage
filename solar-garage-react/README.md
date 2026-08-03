# Solar Garage Client Manager — React

Vite + React + TypeScript rewrite of the client manager. Same feature set, same
visual design, backed by the same Supabase project — just properly componentised
this time.

## Stack

- **Vite** — build tool, dev server
- **React 18 + TypeScript** — UI
- **Supabase JS** — auth, database, storage (same project as the previous version)
- Plain CSS with custom properties (`src/index.css`) — no CSS framework, keeps the
  existing black/white/green/blue theme exactly as-is

## Local development

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`. Your real Supabase project URL and key are
already in `.env` (gitignored — never gets pushed to GitHub), so it connects to
live data immediately. No demo mode unless that file is missing.

## Project structure

```
src/
  components/          UI components
    sections/           the six panels inside a client's detail view
    modals/              add/edit client, log follow-up, add O&M task, upload doc
    icons/                shared SVG icon component
  hooks/                useAuth, useClients, useClientDetail, useToast
  lib/                  supabase.ts (client init), demoData.ts (fallback data)
  types.ts              shared TypeScript types, mirrors the database schema
  index.css             all styling — design tokens at the top
```

## Deploying to GitHub Pages

This repo includes `.github/workflows/deploy.yml`, which builds and deploys
automatically on every push to `main`. One-time setup:

1. Push this repo to GitHub (see below if you need the commands).
2. In the repo, go to **Settings → Secrets and variables → Actions** → **New
   repository secret**, and add two secrets:

   | Name | Value |
   |---|---|
   | `VITE_SUPABASE_URL` | `https://qywooqavxdceeranmqow.supabase.co` |
   | `VITE_SUPABASE_KEY` | `sb_publishable_jKGWIn1xM2DgFCy8K6JOQw_jBkMC24u` |

   (These are the same values already sitting in your local `.env` — the anon/
   publishable key is meant to be public-facing, Row-Level Security is what
   actually protects the data, so this is safe to store as a repo secret same
   as any other config value.)

3. Go to **Settings → Pages** → under **Build and deployment → Source**,
   choose **GitHub Actions** (not "Deploy from a branch" — the workflow handles
   that itself).
4. Push to `main`. Check the **Actions** tab to watch it build. Once green,
   your site is live at `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`.

The workflow reads your repo name automatically and sets the correct base
path, so it works regardless of what you name the repository.

### Pushing this repo to GitHub for the first time

```bash
git init
git add .
git commit -m "Solar Garage Client Manager — React rewrite"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

Create the empty repo first at `github.com/new` — set it to **Public** (GitHub
Pages on the free plan only works on public repos).

### Manual build (no GitHub Actions)

If you'd rather not use the workflow:

```bash
npm run build        # outputs to dist/
```

Then push the contents of `dist/` to a `gh-pages` branch, or to the root of
`main` with Pages set to "Deploy from a branch." You'll need to set the
`base` in `vite.config.ts` manually to match your repo name in that case,
since the automatic repo-name detection only happens inside the Actions
workflow.

## Known issue (harmless)

`npm install` will flag a moderate esbuild advisory
(GHSA-67mh-4wv8-2f99). It only affects the local dev server accepting
requests from arbitrary websites during `npm run dev` — it does not affect
the production build or the deployed site. Fixing it requires a breaking
upgrade to Vite 8, which isn't necessary for this to be safe to use.

## What's preserved from the previous version

Everything: auth (sign in/up/out with session persistence), client CRUD with
conditional system-spec fields, O&M task scheduling and completion, follow-up
logging, document upload/download/delete via Supabase Storage with drag-and-
drop, search and filtering (all/installed/prospect/overdue), toast
notifications, and a demo-mode fallback if Supabase credentials are ever
missing.
