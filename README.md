# nome-seguro

Sanitização **segura** de nomes de arquivo para Node.js. Um nome vindo de fora
(upload, corpo de requisição, importação) é dado não confiável — este módulo o
transforma num nome de **um único segmento**, seguro para gravar em disco.

Zero dependências. ESM. Funciona em qualquer runtime JS moderno.

## O problema (segurança)

Gravar em disco um nome que o usuário controla abre uma porta conhecida:

- **Path traversal** — `../../.env`, `C:\Windows\...` escapam da pasta de destino.
- **Byte nulo e caracteres de controle** — truncam o caminho ou corrompem logs.
- **Caracteres proibidos do Windows** — `< > : " / \ | ? *`.
- **Nomes de dispositivo reservados** — `CON`, `NUL`, `LPT1`… quebram no Windows.
- **Arquivo oculto / parecido com flag** — `.env`, `-rf`.
- **Ambiguidade de fim** — Windows remove ponto/espaço final (`arquivo.` → `arquivo`).

`nome-seguro` trata todos de uma vez.

## Instalação

```bash
npm install nome-seguro
```

## Uso

```js
import { nomeSeguro, limparSufixoCopia } from 'nome-seguro';

nomeSeguro('../../.env');                 // 'env'
nomeSeguro('rela:to*rio?.txt');           // 'rela-to-rio-.txt'
nomeSeguro('CON');                        // '_CON'
nomeSeguro('.bashrc');                    // 'bashrc'
nomeSeguro('contrato (1) (1).pdf');       // 'contrato.pdf'
nomeSeguro('', { padrao: 'documento' });  // 'documento'

limparSufixoCopia('Balanco 2026 (2).pdf'); // 'Balanco 2026.pdf'
```

Exemplo com Express + upload:

```js
import path from 'node:path';
import { nomeSeguro } from 'nome-seguro';

const destino = path.join(PASTA_UPLOADS, nomeSeguro(req.body.nome));
// destino é garantidamente UM arquivo dentro de PASTA_UPLOADS
```

## API

### `nomeSeguro(nome, opcoes?) → string`

| opção | padrão | o que faz |
|---|---|---|
| `padrao` | `'arquivo'` | nome usado quando sobra vazio |
| `maxLen` | `200` | tamanho máximo (preserva a extensão) |
| `limparCopia` | `true` | também tira o `(1)` do download repetido |
| `normalizar` | `true` | normaliza Unicode (NFC) |

### `limparSufixoCopia(nome) → string`

Remove só o sufixo de cópia do navegador (`" (1)"`, `" (12)"`), inclusive
repetido. Um ano entre parênteses (`"(2025)"`) é preservado.

> **Importante:** `nome-seguro` devolve um nome de arquivo. Ele **não** é
> suficiente sozinho — continue resolvendo o caminho final com `path.join` e
> conferindo que o resultado permanece dentro da pasta de destino.

## Testes

```bash
npm test
```

## Origem

Extraído e generalizado de um sistema real de gestão de TI (uploads de documentos
e anexos), onde nomes vinham de importações e do corpo das requisições. Nenhum
dado do sistema de origem acompanha o código — é lógica pura.

## Licença

MIT © Rodrigo Rodrigues
