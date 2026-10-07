# nome-seguro

[English (United States)](README.en-US.md) · [Apoio voluntário](SUPPORT.md)

## Segurança e compatibilidade

Fallback sanitizado, nomes reservados com múltiplas extensões e limite UTF-8.

`maxLen` é inteiro de 1 a 255 e limita também bytes UTF-8. O nome padrão passa pela mesma limpeza. Extensões são preservadas quando cabem. Use identificadores aleatórios para evitar colisões e criação exclusiva de arquivos; confira confinamento e links simbólicos no destino. Um nome limpo não torna o conteúdo do upload confiável.

Baixe pelo GitHub; não é necessário instalar um pacote homônimo do npm. Para consumir em outro projeto, use uma revisão Git fixada (tag v1.2.0) ou copie o módulo e preserve a licença. Os exemplos abaixo usam importação local após o clone. Node.js 22 ou superior para os testes.

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
git clone https://github.com/techrodrigo21-ux/nome-seguro.git
cd nome-seguro
npm test
```

## Uso

```js
import { nomeSeguro, limparSufixoCopia } from './src/index.js';

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
import { nomeSeguro } from './src/index.js';

const destino = path.join(PASTA_UPLOADS, nomeSeguro(req.body.nome));
// Confira confinamento, colisões e links simbólicos antes de gravar.
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

## Manutenção e apoio

Código independente inspirado em problemas resolvidos no Nexus, projeto de Rodrigo Rodrigues. Não inclui banco, configuração privada, logs, dados de usuários ou credenciais. Evolução coordenada significa revisar mudanças relacionadas no mesmo ciclo; não há cópia automática de arquivos privados.

[Como contribuir](CONTRIBUTING.md) · [Segurança](SECURITY.md) · [Apoio voluntário](SUPPORT.md)


## Uso prático — 1.2.0

Truncamento UTF-8 preserva extensões e caracteres completos. `maxLen` mede bytes; não elimina colisões ou symlinks.

Exemplo executável com dados sintéticos: `node examples/uso.mjs`.


## ☕ Apoie este trabalho

Se este projeto te ajudou, considere me pagar um café. Qualquer valor é bem-vindo, e seu comentário também ajuda.

[![Apoiar com Pix](assets/support/pix-pt-br.svg)](SUPPORT.md)
