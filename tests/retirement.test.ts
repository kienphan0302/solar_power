import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { onRequest } from '../functions/_middleware';

test('old preview redirects product pages and preserves campaign parameters', () => {
  const response = onRequest({ request: new Request('https://old.solar-power-5w7.pages.dev/san-pham/may-nuoc-nong/?utm_source=google') });
  assert.equal(response.status, 302);
  assert.equal(response.headers.get('Location'), 'https://water-heater-e3j.pages.dev/san-pham/may-nuoc-nong/?utm_source=google');
  assert.equal(response.headers.get('Cache-Control'), 'no-store');
});

test('old API cannot save or forward submissions from cached forms', async () => {
  for (const method of ['GET', 'POST', 'OPTIONS']) {
    const response = onRequest({ request: new Request('https://old.solar-power-5w7.pages.dev/api/lead', { method }) });
    assert.equal(response.status, 410);
    assert.equal(response.headers.get('Location'), null);
    assert.equal((await response.json() as { formReady: boolean }).formReady, false);
  }
});

test('unrecognized write routes are not replayed to production', () => {
  const response = onRequest({ request: new Request('https://old.solar-power-5w7.pages.dev/', { method: 'POST' }) });
  assert.equal(response.status, 405);
  assert.equal(response.headers.get('Location'), null);
});

test('retired preview has no D1 binding and applies middleware to every path', () => {
  const config = JSON.parse(readFileSync('wrangler.jsonc', 'utf8'));
  assert.deepEqual(config.d1_databases, []);
  assert.deepEqual(config.env.preview.d1_databases, []);
  const routes = JSON.parse(readFileSync('public/_routes.json', 'utf8'));
  assert.deepEqual(routes.include, ['/*']);
  assert.deepEqual(routes.exclude, []);
});
