# nome-seguro

[Brazilian Portuguese](README.md) · [Voluntary support](SUPPORT.en-US.md)

Sanitize a filename into one safe path segment, with Windows reserved-name handling and a UTF-8 byte limit.

## Start here

Requires Git and Node.js 22+ for tests. No runtime dependencies. Download the actual repository rather than an unverified same-name npm package.

```sh
git clone https://github.com/techrodrigo21-ux/nome-seguro.git
cd nome-seguro
npm test
node tools/check-public-content.mjs
```

These imports work from the cloned repository root. To use the module in another project, install a pinned Git tag (v1.2.0) or copy the module while retaining the MIT license. This documentation does not claim an npm registry release.

```js
import { nomeSeguro, limparSufixoCopia } from './src/index.js';
console.log(nomeSeguro('../../.env')); // env
console.log(nomeSeguro('report (1).pdf')); // report.pdf
```

## API

`nomeSeguro(nome, { padrao, maxLen, limparCopia, normalizar })`; `limparSufixoCopia(nome)`.

Public function and option names remain in Portuguese for compatibility.

## Behavior and limits

`maxLen` is an integer from 1 to 255 and also limits UTF-8 bytes. Fallback names are sanitized. Extensions are retained when they fit. Use random IDs and exclusive file creation to prevent collisions; enforce destination containment and symlink safety. Sanitizing the name does not validate uploaded content.

## Maintenance

These standalone modules are inspired by work on Nexus, Rodrigo Rodrigues's independent project. They contain no private database, deployment configuration, logs, credentials or user records. Coordinated maintenance means reviewing related changes in the same release cycle, not automatically copying private source files.

## Security and compatibility

Sanitized fallback, multi-extension reserved names and UTF-8 limits.

[Contributing](CONTRIBUTING.md) · [Security](SECURITY.md) · [Voluntary support](SUPPORT.en-US.md)

MIT © Rodrigo Rodrigues


## Practical use — 1.2.0

UTF-8 truncation preserves extensions and complete characters. `maxLen` counts bytes; it does not prevent collisions or symlinks.

Runnable example with synthetic data: `node examples/uso.mjs`.


## ☕ Support this work

If this project helped you, consider buying me a coffee. Any amount is welcome, and sharing your feedback helps too.

[![Support via Pix](assets/support/pix-en-us.svg)](SUPPORT.en-US.md)
