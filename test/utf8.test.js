import { test } from 'node:test';
import assert from 'node:assert/strict';
import { nomeSeguro } from '../src/index.js';
test('preserva extensão sob orçamento UTF-8 sem cortar emoji', () => {
  assert.equal(nomeSeguro('😀😀😀.pdf', { maxLen: 12 }), '😀😀.pdf');
  assert.equal(nomeSeguro('açãoação.pdf', { maxLen: 10 }), 'ação.pdf');
  const s = nomeSeguro('😀'.repeat(10000) + '.txt', { maxLen: 255 });
  assert.ok(s.endsWith('.txt'));
  assert.ok(new TextEncoder().encode(s).length <= 255);
  assert.equal(s.includes('\uFFFD'), false);
});
