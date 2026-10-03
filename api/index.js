const app = require('../src/server');

// Vercel-only compatibility layer.
// On some Vercel routing/redirect paths, Authorization can be moved into
// x-vercel-sc-headers. Restore it on the Node request before Express reads it.
function vercelApp(req, res) {
  if (process.env.VERCEL === '1' && !req.headers.authorization) {
    const packed = req.headers['x-vercel-sc-headers'];
    if (packed) {
      try {
        const parsed = JSON.parse(packed);
        const authKey = Object.keys(parsed).find((key) => key.toLowerCase() === 'authorization');
        const authorization = authKey ? parsed[authKey] : null;
        if (typeof authorization === 'string' && authorization.trim()) {
          req.headers.authorization = authorization;
        }
      } catch {
        // Ignore malformed Vercel metadata and let normal auth handling run.
      }
    }
  }

  return app(req, res);
}

module.exports = vercelApp;
