# NovaProxy deployment on Vercel

This build is prepared for Vercel Functions. It does not use a long-running keepalive process or cron job. Vercel serves the Express app through `api/index.js`.

## 1. Push this repository to GitHub

Deploy the repository as a Vercel project with the repository root as the Root Directory. No custom build command is required; Vercel installs dependencies from `package.json`.

## 2. Environment variables

Set these in Vercel for Production (and Preview if you need preview deployments):

- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`
- `UPSTREAM_BASE_URL` — your OpenAI-compatible upstream, for example `https://dashscope.aliyuncs.com/compatible-mode/v1`
- `UPSTREAM_API_KEY` — the upstream secret, server-side only
- `STRAX_API` — the secondary STRAX secret, server-side only; only the fixed GPT/Claude model allowlist uses it
- `STRAX_BASE_URL` — the STRAX OpenAI-compatible base URL
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET`

Optional:

- `ALLOWED_ORIGINS=*`
- `API_RATE_LIMIT_PER_MINUTE=120`
- `ADMIN_RATE_LIMIT_PER_MINUTE=30`
- `MAX_BODY_MB=10`

Do not add `PORT`; Vercel manages the function runtime.

## 3. Supabase

Run `schema.sql` in Supabase SQL Editor.

## 4. Routes

- `GET /health`
- `GET /v1/models`
- `POST /v1/chat/completions`
- `/v1/*` passthrough routes
- `GET /admin`

The client only sees the Vercel deployment URL. Upstream credentials remain server-side.

## 5. Keepalive

This project intentionally does not run an internal keepalive or Vercel Cron. Use an external uptime monitor such as UptimeRobot for periodic health checks.
