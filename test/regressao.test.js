import { test } from 'node:test';
import assert from 'node:assert/strict';
import { nomeSeguro } from '../src/index.js';
test('fallback, dispositivos com múltiplas extensões e teto em bytes', () => {
  for (const padrao of ['../../.env', 'CON.txt.exe', '.', '', 'COM¹.log']) {
    const nome = nomeSeguro('', { padrao, maxLen: 12 });
    assert.ok(nome && !/[\\/]/.test(nome) && !/^[.-]/.test(nome));
    assert.ok(Buffer.byteLength(nome) <= 12);
    assert.ok(!/^(CON|COM¹)([. ]|$)/i.test(nome));
  }
  for (let maxLen = 1; maxLen <= 20; maxLen++) {
    const nome = nomeSeguro('😀'.repeat(20) + '.extension', { maxLen });
    assert.ok(nome && Buffer.byteLength(nome) <= maxLen);
    assert.ok(!/[. ]$/.test(nome));
  }
  for (const maxLen of [0, -1, NaN, Infinity, 1.2]) assert.throws(() => nomeSeguro('a', { maxLen }));
});
