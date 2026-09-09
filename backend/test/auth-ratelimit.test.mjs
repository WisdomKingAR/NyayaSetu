import test from 'node:test';
import assert from 'node:assert/strict';

process.env.SUPABASE_URL = 'https://test.supabase.co';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-key';
process.env.SARVAM_API_KEY = 'test-sarvam-key';
process.env.GEMINI_API_KEY = 'test-gemini-key';
process.env.FRONTEND_URL = 'http://localhost:3000';

const { createApp } = await import('../dist/app.js');

const app = createApp();
const server = app.listen(0);
const port = server.address().port;
const baseUrl = `http://localhost:${port}`;

test.after(() => {
  server.close();
});

test('POST /api/auth/signin - rate limits after 15 requests from same IP', async () => {
  let rateLimited = false;
  // Send 16 requests
  for (let i = 0; i < 16; i++) {
    const res = await fetch(`${baseUrl}/api/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: `user${i}@example.com`, password: 'password123' }),
    });
    if (res.status === 429) {
      rateLimited = true;
      const body = await res.json();
      assert.equal(body.success, false);
      assert.equal(body.error.code, 'AUTH_RATE_LIMITED');
      break;
    }
  }
  assert.equal(rateLimited, true, 'Expected rate limiter to trigger 429');
});
