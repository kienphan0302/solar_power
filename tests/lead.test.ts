import test from 'node:test';
import assert from 'node:assert/strict';
import type { D1Database } from '@cloudflare/workers-types';
import { createLeadHandler, type Env, type LeadContext } from '../lib/leads';

const valid = { id: '5a0fbc7d-572e-4305-b20c-9099003cad20', name: 'Khách kiểm thử', phone: '+84 912 345 678',
  area: 'Hà Nội', consent: true, token: 'test-token', source_path: '/', utm_source: 'google' };

function harness(options: { dbFails?: boolean; verified?: boolean; emailFails?: boolean; email?: boolean; secret?: string } = {}) {
  const saved = new Map<string, unknown[]>();
  const statuses: string[] = [];
  const pending: Promise<unknown>[] = [];
  let notifyCount = 0;
  const db = { prepare(sql: string) {
    let values: unknown[] = [];
    return { bind(...args: unknown[]) { values = args; return this; }, async run() {
      if (options.dbFails) throw new Error('Simulated database outage');
      if (sql.startsWith('INSERT')) {
        const id = String(values[0]);
        const changes = saved.has(id) ? 0 : 1;
        if (changes) saved.set(id, values);
        return { success: true, meta: { changes } };
      }
      statuses.push(String(values[0]));
      return { success: true, meta: { changes: 1 } };
    } };
  } } as unknown as D1Database;
  const env: Env = { DB: db, TURNSTILE_SECRET_KEY: options.secret || 'real-test-secret',
    ...(options.email ? { RESEND_API_KEY: 'mock-key', LEAD_FROM_EMAIL: 'from@example.com', LEAD_NOTIFY_EMAIL: 'to@example.com' } : {}) };
  const handler = createLeadHandler({ verifyToken: async () => options.verified !== false,
    notifySales: async () => { notifyCount++; if (options.emailFails) throw new Error('Simulated email outage'); } });
  async function send(data: unknown = valid, origin = 'https://solar.example.com', url = 'https://solar.example.com/api/lead') {
    return handler({ request: new Request(url, { method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json' }, body: JSON.stringify(data) }),
      env, waitUntil(p: Promise<unknown>) { pending.push(p); } } as LeadContext);
  }
  return { send, saved, statuses, pending, notifyCount: () => notifyCount };
}

test('valid lead is stored once and phone is normalized', async () => {
  const h = harness(); const response = await h.send();
  assert.equal(response.status, 201); assert.equal(h.saved.size, 1);
  assert.equal(h.saved.get(valid.id)?.[2], '0912345678');
});
test('invalid phone or missing consent cannot create a lead', async () => {
  const h = harness();
  assert.equal((await h.send({ ...valid, phone: 'abc' })).status, 400);
  assert.equal((await h.send({ ...valid, consent: false })).status, 400);
  assert.equal(h.saved.size, 0);
});
test('failed bot verification cannot create a lead', async () => {
  const h = harness({ verified: false }); assert.equal((await h.send()).status, 400); assert.equal(h.saved.size, 0);
});
test('database outage never returns success', async () => {
  const h = harness({ dbFails: true }); const response = await h.send();
  assert.equal(response.status, 503); assert.equal((await response.json() as { success: boolean }).success, false);
});
test('email outage preserves the lead and marks notification failed', async () => {
  const h = harness({ email: true, emailFails: true });
  assert.equal((await h.send()).status, 201); await Promise.all(h.pending);
  assert.equal(h.saved.size, 1); assert.deepEqual(h.statuses, ['failed']);
});
test('same submission ID does not duplicate storage or notification', async () => {
  const h = harness({ email: true }); await h.send(); const repeated = await h.send(); await Promise.all(h.pending);
  assert.equal(repeated.status, 200); assert.equal((await repeated.json() as { created: boolean }).created, false);
  assert.equal(h.saved.size, 1); assert.equal(h.notifyCount(), 1);
});
test('cross-origin submission is rejected before storage', async () => {
  const h = harness(); assert.equal((await h.send(valid, 'https://unrelated.example')).status, 403); assert.equal(h.saved.size, 0);
});
test('official dummy secret cannot be used on a public deployment', async () => {
  const h = harness({ secret: '1x0000000000000000000000000000000AA' });
  assert.equal((await h.send()).status, 503); assert.equal(h.saved.size, 0);
});
