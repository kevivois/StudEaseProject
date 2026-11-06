const assert = require('node:assert/strict');
const { execFile } = require('node:child_process');
const { once } = require('node:events');
const { mkdtemp, rm, writeFile } = require('node:fs/promises');
const { createServer } = require('node:http');
const { tmpdir } = require('node:os');
const { join } = require('node:path');
const { promisify } = require('node:util');
const { test } = require('node:test');

const execute = promisify(execFile);
const userId = '11111111-1111-4111-8111-111111111111';
const password = 'test-password-only';
const key = 'test-admin-key-only';

function executeWithInput(args, options, input) {
  const result = execute(process.execPath, args, options);
  let sent = false;
  result.child.stdout.on('data', chunk => {
    if (!sent && chunk.toString().includes('Nouveau mot de passe : ')) {
      sent = true;
      result.child.stdin.end(input);
    }
  });
  return result;
}

async function run(t, env = {}, args = [userId], input = `${password}\nyes\n`) {
  const cwd = await mkdtemp(join(tmpdir(), 'studease-reset-password-'));
  t.after(() => rm(cwd, { recursive: true, force: true }));
  return executeWithInput([
    require.resolve('tsx/cli'),
    join(__dirname, 'resetPassword.ts'),
    ...args,
  ], {
    cwd,
    env: {
      ...process.env,
      NEXT_PUBLIC_SUPABASE_URL: 'http://127.0.0.1:1',
      SUPABASE_SERVICE_ROLE_KEY: key,
      NEW_PASSWORD: password,
      ...env,
    },
    timeout: 15000,
  }, input);
}

async function server(t, handler) {
  const instance = createServer(handler);
  instance.listen(0, '127.0.0.1');
  await once(instance, 'listening');
  t.after(() => new Promise((resolve, reject) => {
    instance.close(error => error ? reject(error) : resolve());
    instance.closeAllConnections();
  }));
  return `http://127.0.0.1:${instance.address().port}`;
}

test('prints the chosen password, asks for confirmation and updates only the requested Auth user', async t => {
  let received;
  const url = await server(t, async (req, res) => {
    let body = '';
    for await (const chunk of req) body += chunk;
    received = { method: req.method, path: req.url, headers: req.headers, body: JSON.parse(body) };
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ id: userId }));
  });
  const result = await run(t, { NEXT_PUBLIC_SUPABASE_URL: url });
  assert.equal(received.method, 'PUT');
  assert.equal(received.path, `/auth/v1/admin/users/${userId}`);
  assert.equal(received.headers.authorization, `Bearer ${key}`);
  assert.deepEqual(received.body, { password });
  assert.match(result.stdout, /Mot de passe remplace/);
  assert.equal(result.stderr, '');
  assert.match(result.stdout, /Are you sure\?/);
  assert.ok(result.stdout.includes(`Mot de passe choisi : ${password}`));
  assert.ok(!result.stdout.includes(key));
});

test('loads configuration from .env.local', async t => {
  const url = await server(t, (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ id: userId }));
  });
  const env = { ...process.env };
  delete env.NEXT_PUBLIC_SUPABASE_URL;
  delete env.SUPABASE_SERVICE_ROLE_KEY;
  delete env.NEW_PASSWORD;
  const cwd = await mkdtemp(join(tmpdir(), 'studease-reset-password-'));
  t.after(() => rm(cwd, { recursive: true, force: true }));
  await writeFile(join(cwd, '.env.local'),
    `NEXT_PUBLIC_SUPABASE_URL=${url}\nSUPABASE_SERVICE_ROLE_KEY=${key}\n`);
  const result = await executeWithInput([
    require.resolve('tsx/cli'), join(__dirname, 'resetPassword.ts'), userId,
  ], { cwd, env, timeout: 15000 }, `${password}\nyes\n`);
  assert.match(result.stdout, /Mot de passe remplace/);
});

test('rejects missing configuration and invalid input before contacting Supabase', async t => {
  for (const [env, args, message] of [
    [{ SUPABASE_SERVICE_ROLE_KEY: '' }, [userId], /SUPABASE_SERVICE_ROLE_KEY/],
    [{}, ['invalid'], /Identifiant invalide/],
    [{}, [], /Usage/],
    [{}, [userId, 'extra'], /Usage/],
  ]) {
    await assert.rejects(run(t, env, args), error => {
      assert.equal(error.code, 1);
      assert.match(error.stderr, message);
      assert.ok(!error.stdout.includes('Mot de passe remplace'));
      return true;
    });
  }
});

test('rejects short passwords and interrupted password input', async t => {
  for (const input of ['short\n', '']) {
    await assert.rejects(run(t, {}, [userId], input), error => {
      assert.equal(error.code, 1);
      assert.match(error.stderr, /6 caracteres|Saisie interrompue/);
      assert.ok(!error.stdout.includes('Mot de passe remplace'));
      return true;
    });
  }
});

test('does not contact Supabase unless explicitly confirmed', async t => {
  let requests = 0;
  const url = await server(t, (_req, res) => {
    requests++;
    res.end('{}');
  });
  for (const confirmation of ['no\n', '\n', 'oui\n', '']) {
    const result = await run(t, { NEXT_PUBLIC_SUPABASE_URL: url }, [userId], `${password}\n${confirmation}`);
    assert.match(result.stdout, /Operation annulee/);
    assert.ok(!result.stdout.includes('Mot de passe remplace'));
  }
  assert.equal(requests, 0);
});

test('reports Supabase errors with a failing exit code', async t => {
  const url = await server(t, (_req, res) => {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'User not found' }));
  });
  await assert.rejects(run(t, { NEXT_PUBLIC_SUPABASE_URL: url }), error => {
    assert.equal(error.code, 1);
    assert.match(error.stderr, /User not found/);
    assert.ok(!error.stdout.includes('Mot de passe remplace'));
    return true;
  });
});

test('does not report success for an unconfirmed update', async t => {
  const url = await server(t, (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ id: '22222222-2222-4222-8222-222222222222' }));
  });
  await assert.rejects(run(t, { NEXT_PUBLIC_SUPABASE_URL: url }), error => {
    assert.equal(error.code, 1);
    assert.match(error.stderr, /ne confirme pas/);
    return true;
  });
});
