/* ============================================================================
   nome-seguro — sanitização segura de nomes de arquivo para Node.js.

   Um nome de arquivo que vem de fora (upload, corpo de requisição, importação)
   não é confiável: pode conter separador de caminho (../../.env → path traversal),
   byte nulo, caractere proibido do Windows, um nome de dispositivo reservado
   (CON, NUL, LPT1…), ou começar com ponto/traço (arquivo oculto ou algo parecido
   com opção de linha de comando). Este módulo transforma qualquer string em um
   nome de arquivo de UM segmento, seguro para gravar em disco.

   Sem dependências. Funciona em qualquer runtime JS.
   ============================================================================ */

/* Nomes de dispositivo reservados do Windows (case-insensitive), com ou sem
   extensão. Gravar "CON.txt" quebra em Windows. */
const RESERVADOS = /^(con|prn|aux|nul|conin\$|conout\$|com[1-9¹²³]|lpt[1-9¹²³])(?:[. ]|$)/i;

/* Caracteres proibidos em nome de arquivo no Windows + controles (0x00–0x1F).
   A barra e a contrabarra entram aqui só por segurança: o split de caminho
   abaixo já tira qualquer separador antes. */
const PROIBIDOS = /[<>:"/\\|?*\u0000-\u001f\u007f-\u009f\u202a-\u202e\u2066-\u2069]/g;

/* Sufixo que o navegador acrescenta no download repetido: " (1)", " (12)"…
   Quatro dígitos (um ano "(2025)") NÃO é sufixo de cópia e é preservado. */
const SUFIXO_COPIA = /[\s_-]*\((\d{1,3})\)\s*$/;

const extDe = (nome) => {
  const ponto = nome.lastIndexOf('.');
  return ponto > 0 ? nome.slice(ponto) : '';
};
const encoder = new TextEncoder();
const tamanho = (s) => encoder.encode(s).length;
function cortarUTF8(s, limite) {
  let bytes = 0, saida = '';
  for (const caractere of s) {
    bytes += tamanho(caractere);
    if (bytes > limite) break;
    saida += caractere;
  }
  return saida;
}

/**
 * Remove o sufixo de cópia do download repetido do navegador — inclusive
 * repetido ("arquivo (1) (1).pdf" → "arquivo.pdf"). Preserva a extensão.
 * @param {string} nome
 * @returns {string}
 */
export function limparSufixoCopia(nome) {
  const bruto = String(nome ?? '').trim();
  const ext = extDe(bruto);
  let base = ext ? bruto.slice(0, -ext.length) : bruto;
  let antes;
  do { antes = base; base = base.replace(SUFIXO_COPIA, ''); } while (base !== antes);
  base = base.replace(/\s+/g, ' ').trim();
  return base + ext.toLowerCase();
}

/**
 * Transforma qualquer string num nome de arquivo de UM segmento, seguro para
 * disco: sem caminho, sem caractere proibido, sem nome reservado, sem oculto.
 *
 * @param {string} nome  nome vindo de fora (não confiável)
 * @param {object} [opcoes]
 * @param {string} [opcoes.padrao='arquivo']   nome usado quando sobra vazio
 * @param {number} [opcoes.maxLen=200]          tamanho máximo (preserva extensão)
 * @param {boolean} [opcoes.limparCopia=true]   também tira o "(1)" do download
 * @param {boolean} [opcoes.normalizar=true]    normaliza Unicode (NFC)
 * @returns {string}
 */
export function nomeSeguro(nome, opcoes = {}) {
  const { padrao = 'arquivo', maxLen = 200, limparCopia = true, normalizar = true } = opcoes;
  if (!Number.isSafeInteger(maxLen) || maxLen < 1 || maxLen > 255) throw new TypeError('maxLen precisa ser inteiro entre 1 e 255');

  // 1) só o último trecho: "../../.env" ou "C:\segredo" nunca vira caminho
  let s = String(nome ?? '').split(/[\\/]/).pop() ?? '';
  if (normalizar) s = s.normalize('NFC');
  if (limparCopia) s = limparSufixoCopia(s);

  // 2) tira proibidos/controles, colapsa pontos (impede ".." e escalonamento)
  s = s
    .replace(PROIBIDOS, '-')
    .replace(/\.{2,}/g, '.')
    .replace(/\s+/g, ' ')
    .replace(/^[.\-\s]+/, '')   // nada de oculto (.env) nem parecido com flag (-rf)
    .replace(/[.\s]+$/, '')     // Windows remove ponto/espaço final — evita ambiguidade
    .trim();

  // 3) nome de dispositivo reservado do Windows → prefixa
  const ext = extDe(s);
  if (RESERVADOS.test(s)) s = `_${s}`;

  // 4) limite de tamanho preservando a extensão
  if (tamanho(s) > maxLen) {
    const e = extDe(s), orcamento = maxLen - tamanho(e);
    const b = e && orcamento > 0 ? cortarUTF8(s.slice(0, -e.length), orcamento).replace(/[.\s]+$/, '') : '';
    s = b ? b + e : cortarUTF8(s, maxLen);
  }
  s = s.replace(/[.\s]+$/, '').replace(/^[.\-\s]+/, '');
  if (RESERVADOS.test(s)) s = (`_${s}`).slice(0, maxLen);
  if (!s) {
    // O fallback é entrada não confiável também, e nunca retorna um caminho.
    return nomeSeguro(String(padrao || 'arquivo'), { ...opcoes, padrao: 'a', maxLen, limparCopia, normalizar });
  }
  return s;
}

export default nomeSeguro;
