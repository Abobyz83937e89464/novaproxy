# NovaProxy

OpenAI-compatible API proxy with Supabase-managed proxy keys, token billing, admin panel, and strict STRAX routing for the four configured GPT/Claude models.

## Routes

- `GET /health`
- `GET /v1/models`
- `POST /v1/chat/completions`
- `GET /admin`

## Vercel

The Express app is exported from `src/server.js` and exposed through `api/index.js`. Vercel rewrites all incoming paths to that function. There is no internal keepalive cron. Use an external uptime monitor for health checks.

## Environment

```text
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SERVICE_KEY=YOUR_SECRET_KEY
UPSTREAM_BASE_URL=https://provider.example/v1
UPSTREAM_API_KEY=YOUR_UPSTREAM_KEY
STRAX_API=YOUR_STRAX_KEY
STRAX_BASE_URL=https://your-strax.example/v1
ADMIN_PASSWORD=YOUR_ADMIN_PASSWORD
ADMIN_SESSION_SECRET=LONG_RANDOM_SECRET
```

Optional:

```text
ALLOWED_ORIGINS=*
API_RATE_LIMIT_PER_MINUTE=120
ADMIN_RATE_LIMIT_PER_MINUTE=30
MAX_BODY_MB=10
```

Run `schema.sql` in Supabase SQL Editor before first use.
