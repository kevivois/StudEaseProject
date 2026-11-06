const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { once } = require('node:events');
const { test } = require('node:test');
const { runInNewContext } = require('node:vm');
const ts = require('typescript');

const root = join(__dirname, '..');

function loadApi(fetch) {
  const source = readFileSync(join(root, 'src', 'lib', 'api.ts'), 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText;
  const exports = {};
  runInNewContext(compiled, { exports, fetch, console, encodeURIComponent });
  return exports;
}

test('all API calls and document URLs use the same-origin prefix', async () => {
  const requests = [];
  const { api, API_BASE_URL } = loadApi(async (url, options) => {
    requests.push({ url, options });
    return { ok: true, json: async () => ({ user: { type: 'student' } }) };
  });
  assert.equal(API_BASE_URL, '/api');
  await api.auth.login('test@example.test', 'test-password-only');
  assert.deepEqual(requests.map(r => r.url), ['/api/auth/login', '/api/auth/me']);
  assert.ok(requests.every(r => r.options.credentials === 'include'));
  assert.equal(requests[0].options.method, 'POST');

  const body = { testUpload: true };
  await api.offers.files.upload('offer-test', body);
  await api.applications.files.upload('application-test', body);
  await api.auth.logout();
  assert.ok(requests.every(r => r.url.startsWith('/api/')));
  assert.equal(requests[2].options.body, body);
  assert.equal(requests[3].options.body, body);
  assert.equal(requests[4].url, '/api/auth/logout');
  assert.equal(requests[4].options.credentials, 'include');
  assert.equal(api.offers.files.getFullUrl('offer-test', 'folder/cv test.pdf'),
    '/api/offers/offer-test/files/folder%2Fcv%20test.pdf');
  assert.equal(api.applications.files.getFullUrl('application-test', 'folder/cv test.pdf'),
    '/api/applications/application-test/files/folder%2Fcv%20test.pdf');
});

test('login does not report success when the session check fails', async () => {
  let calls = 0;
  const { api } = loadApi(async () => {
    calls++;
    return calls === 1
      ? { ok: true, json: async () => ({ message: 'Login successful' }) }
      : { ok: false, json: async () => ({ message: 'Unauthorized' }) };
  });
  await assert.rejects(api.auth.login('test@example.test', 'test-password-only'), /Unauthorized/);
  assert.equal(calls, 2);
});

test('Vercel forwards API routes before the SPA fallback', () => {
  const config = JSON.parse(readFileSync(join(root, 'vercel.json'), 'utf8'));
  assert.deepEqual(config.rewrites[0], {
    source: '/api/:path*',
    destination: 'https://stud-ease-api.vercel.app/api/:path*',
  });
  assert.deepEqual(config.rewrites[1], { source: '/(.*)', destination: '/' });
});

test('Vite proxy forwards cookies, bodies, paths and errors without serving the SPA', async t => {
  const { createServer: createViteServer } = await import('vite');
  const upstreamRequests = [];
  const upstream = createServer(async (req, res) => {
    let body = '';
    for await (const chunk of req) body += chunk;
    upstreamRequests.push({ path: req.url, method: req.method, cookie: req.headers.cookie, body });
    res.setHeader('Content-Type', 'application/json');
    if (req.url === '/api/auth/login') {
      res.setHeader('Set-Cookie', 'test-session=test-value; Path=/; HttpOnly; SameSite=Lax');
      res.end(JSON.stringify({ message: 'Login successful' }));
    } else if (req.url === '/api/auth/me') {
      res.statusCode = req.headers.cookie === 'test-session=test-value' ? 200 : 401;
      res.end(JSON.stringify(res.statusCode === 200 ? { user: { type: 'student' } } : { error: 'Unauthorized' }));
    } else if (req.url.startsWith('/api/offers/')) {
      res.end(JSON.stringify({ received: body }));
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ error: 'Not found' }));
    }
  });
  upstream.listen(0, '127.0.0.1');
  await once(upstream, 'listening');
  t.after(() => new Promise((resolve, reject) => {
    upstream.close(error => error ? reject(error) : resolve());
    upstream.closeAllConnections();
  }));
  const vite = await createViteServer({
    root,
    server: {
      host: '127.0.0.1',
      port: 0,
      proxy: { '/api': { target: `http://127.0.0.1:${upstream.address().port}` } },
    },
    logLevel: 'error',
  });
  t.after(() => vite.close());
  assert.equal(vite.config.server.proxy['/api'].changeOrigin, true);
  await vite.listen();
  const origin = `http://127.0.0.1:${vite.httpServer.address().port}`;
  const login = await fetch(`${origin}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'test@example.test', password: 'test-password-only' }),
  });
  assert.equal(login.status, 200);
  const cookie = login.headers.get('set-cookie');
  assert.match(cookie, /HttpOnly; SameSite=Lax/);
  assert.ok(!cookie.includes('Domain='));
  const me = await fetch(`${origin}/api/auth/me`, { headers: { Cookie: cookie.split(';')[0] } });
  assert.equal(me.status, 200);
  assert.deepEqual(await me.json(), { user: { type: 'student' } });
  assert.equal((await fetch(`${origin}/api/auth/me`)).status, 401);
  const upload = new FormData();
  upload.append('files', new Blob(['test document']), 'cv-test.pdf');
  const uploadResult = await fetch(`${origin}/api/offers/offer-test/files/upload?test=1`, {
    method: 'POST', body: upload, headers: { Cookie: cookie.split(';')[0] },
  });
  assert.equal(uploadResult.status, 200);
  assert.match((await uploadResult.json()).received, /cv-test.pdf/);
  assert.equal(upstreamRequests[3].path, '/api/offers/offer-test/files/upload?test=1');
  assert.equal(upstreamRequests[3].cookie, 'test-session=test-value');
  assert.equal(upstreamRequests[0].method, 'POST');
  assert.match(upstreamRequests[0].body, /test@example.test/);
  const missing = await fetch(`${origin}/api/missing`);
  assert.equal(missing.status, 404);
  assert.deepEqual(await missing.json(), { error: 'Not found' });
});
