# NovaProxy token billing

This version keeps the existing proxy flow and additionally deducts the actual `usage.total_tokens` returned by DashScope from the API key balance.

For streaming chat completions, the proxy automatically enables `stream_options.include_usage` so DashScope includes usage in the final SSE chunk. The response sent to the client is still forwarded unchanged.

Before deploying this version, run the updated `schema.sql` in the Supabase SQL Editor. The SQL creates the atomic `consume_api_key_tokens` RPC used by the proxy and normalizes all existing currencies to `token`.

The admin panel now exposes token balance only; there is no currency selector.
