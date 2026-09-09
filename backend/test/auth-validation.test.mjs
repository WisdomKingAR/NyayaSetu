import test from 'node:test';
import assert from 'node:assert/strict';

// Set dummy env vars for test startup validation
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

test('POST /api/auth/signup - rejects invalid email', async () => {
  const res = await fetch(`${baseUrl}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'invalid-email', password: 'ValidPassword123!' }),
  });

  const body = await res.json();
  assert.equal(res.status, 400);
  assert.equal(body.success, false);
  assert.equal(body.error.code, 'INVALID_EMAIL');
});

test('POST /api/auth/signup - rejects short password', async () => {
  const res = await fetch(`${baseUrl}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'citizen@example.com', password: 'short' }),
  });

  const body = await res.json();
  assert.equal(res.status, 400);
  assert.equal(body.success, false);
  assert.equal(body.error.code, 'INVALID_PASSWORD');
});

test('POST /api/auth/signup - rejects unexpected extra fields', async () => {
  const res = await fetch(`${baseUrl}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'citizen@example.com',
      password: 'ValidPassword123!',
      isAdmin: true,
    }),
  });

  const body = await res.json();
  assert.equal(res.status, 400);
  assert.equal(body.success, false);
  assert.equal(body.error.code, 'UNEXPECTED_FIELD');
});

test('GET /api/auth/me - rejects request when Bearer token is missing', async () => {
  const res = await fetch(`${baseUrl}/api/auth/me`);
  const body = await res.json();
  assert.equal(res.status, 401);
  assert.equal(body.success, false);
  assert.equal(body.error.code, 'UNAUTHORIZED');
});

test('POST /api/auth/signin - rejects invalid body format', async () => {
  const res = await fetch(`${baseUrl}/api/auth/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'bad' }),
  });

  const body = await res.json();
  assert.equal(res.status, 400);
  assert.equal(body.success, false);
  assert.equal(body.error.code, 'INVALID_CREDENTIALS');
});
