import { test } from 'node:test';
import assert from 'node:assert/strict';
import { nomeSeguro, limparSufixoCopia } from '../src/index.js';

test('impede path traversal — fica só o último trecho', () => {
  assert.equal(nomeSeguro('../../.env'), 'env');
  assert.equal(nomeSeguro('C:\\Windows\\system32\\drivers\\etc\\hosts'), 'hosts');
  assert.ok(!nomeSeguro('pasta/sub/arquivo.pdf').includes('/'));
  assert.ok(!nomeSeguro('pasta\\sub\\arquivo.pdf').includes('\\'));
});

test('tira caractere proibido, byte nulo e controle', () => {
  assert.equal(nomeSeguro('rela:to*rio?.txt'), 'rela-to-rio-.txt');
  assert.equal(nomeSeguro('ola\u0000mundo.txt'), 'ola-mundo.txt');
});

test('nada de oculto nem parecido com opção de linha de comando', () => {
  assert.equal(nomeSeguro('.bashrc'), 'bashrc');
  assert.equal(nomeSeguro('-rf'), 'rf');
  assert.equal(nomeSeguro('...senha'), 'senha');
});

test('nome de dispositivo reservado do Windows é neutralizado', () => {
  assert.equal(nomeSeguro('CON'), '_CON');
  assert.equal(nomeSeguro('nul.txt'), '_nul.txt');
  assert.equal(nomeSeguro('LPT1.pdf'), '_LPT1.pdf');
  assert.equal(nomeSeguro('contrato.pdf'), 'contrato.pdf'); // não é reservado
});

test('limpa o sufixo de cópia do download, inclusive repetido', () => {
  assert.equal(limparSufixoCopia('DECLARACAO 2026 (2).pdf'), 'DECLARACAO 2026.pdf');
  assert.equal(limparSufixoCopia('13 ADITIVO (1) (1).pdf'), '13 ADITIVO.pdf');
  assert.equal(limparSufixoCopia('Balanco (2025).pdf'), 'Balanco (2025).pdf'); // ano, não cópia
});

test('vazio vira o padrão; respeita limite preservando a extensão', () => {
  assert.equal(nomeSeguro('   '), 'arquivo');
  assert.equal(nomeSeguro('', { padrao: 'doc' }), 'doc');
  const longo = nomeSeguro('a'.repeat(500) + '.pdf', { maxLen: 20 });
  assert.ok(longo.length <= 20);
  assert.ok(longo.endsWith('.pdf'));
});
