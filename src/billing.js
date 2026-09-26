const { consumeTokens } = require('./db');

function normalizeUsage(usage) {
  if (!usage || typeof usage !== 'object') return 0;

  const total = Number(usage.total_tokens);
  if (Number.isFinite(total) && total > 0) return Math.floor(total);

  const prompt = Number(usage.prompt_tokens);
  const completion = Number(usage.completion_tokens);
  const sum = (Number.isFinite(prompt) ? prompt : 0) + (Number.isFinite(completion) ? completion : 0);
  return sum > 0 ? Math.floor(sum) : 0;
}

function usageFromPayload(payload) {
  return normalizeUsage(payload?.usage);
}

function usageFromSseText(text) {
  let usage = 0;
  const lines = String(text || '').split(/\r?\n/);

  for (const line of lines) {
    if (!line.startsWith('data:')) continue;
    const raw = line.slice(5).trim();
    if (!raw || raw === '[DONE]') continue;

    try {
      const payload = JSON.parse(raw);
      const current = usageFromPayload(payload);
      if (current > 0) usage = current;
    } catch {
      // Ignore non-JSON SSE lines. The response itself is still forwarded unchanged.
    }
  }

  return usage;
}

async function chargeApiKey(keyId, usageTokens) {
  const tokens = Math.floor(Number(usageTokens));
  if (!Number.isFinite(tokens) || tokens <= 0) return null;

  try {
    const balance = await consumeTokens(keyId, tokens);
    console.log(`[Billing] API key ${keyId}: -${tokens} tokens, balance=${balance}`);
    return balance;
  } catch (err) {
    console.error(`[Billing] Failed to charge API key ${keyId}:`, err?.message || err);
    return null;
  }
}

module.exports = {
  usageFromPayload,
  usageFromSseText,
  chargeApiKey
};
