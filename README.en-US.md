<p align="right">
  <a href="README.md"><img src="assets/support/flag-pt-br.svg" width="36" height="24" alt="Português brasileiro" title="Português brasileiro"></a>
  <a href="README.en-US.md"><img src="assets/support/flag-en-us.svg" width="36" height="24" alt="English (United States)" title="English (United States)"></a>
  <a href="README.es-AR.md"><img src="assets/support/flag-es-ar.svg" width="36" height="24" alt="Español (Argentina)" title="Español (Argentina)"></a>
</p>

# nome-seguro

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

[Contributing](CONTRIBUTING.en-US.md) · [Security](SECURITY.en-US.md)

MIT © Rodrigo Rodrigues


## Practical use — 1.2.0

UTF-8 truncation preserves extensions and complete characters. `maxLen` counts bytes; it does not prevent collisions or symlinks.

Runnable example with synthetic data: `node examples/uso.mjs`.

---

<p align="center">
  <img src="assets/support/banner-en-us.svg" width="960" alt="Open source. A coffee makes a difference. Support Rodrigo Rodrigues’s work.">
</p>

## ☕ Buy me a coffee

Did this project help you solve a problem, learn something new, or take your first steps in development? If you feel like supporting my work, a coffee is a kind way to say thank you.

I’m **Rodrigo Rodrigues**, creator of **Nexus** and these open source projects. Your support helps me set aside time to improve the code, write clearer examples, and keep sharing what I learn.

**Give any amount that feels right to you. Supporting is completely optional — the project remains free under the MIT license.**

<p>
  <a href="#support-via-pix"><img src="assets/support/pix-en-us.svg" width="190" height="44" alt="Support via Pix"></a>
  <a href="https://github.com/techrodrigo21-ux/nome-seguro/issues/new?title=Feedback%3A%20this%20project%20helped%20me"><img src="assets/support/comment-en-us.svg" width="210" height="44" alt="Leave a comment"></a>
</p>

### Support via Pix

In your banking app, scan the QR code or copy the Pix key below. Choose your amount and check the recipient details before confirming.

<p align="center">
  <img src="assets/support/pix-qr.png" width="260" alt="Original Pix QR code supplied by Rodrigo Rodrigues; the text key below is an alternative.">
</p>

**Pix key**

```text
8875a24e-44d1-4c91-b6bb-62c9f0070955
```

Pix is Brazil’s payment system. If your bank does not support it, you can still help by sharing the project, reporting a bug, improving the documentation, or leaving feedback.

### Your feedback matters, too

[Tell me how the project helped you](https://github.com/techrodrigo21-ux/nome-seguro/issues/new?title=Feedback%3A%20this%20project%20helped%20me). I’d love to hear what you built, what you learned, and what could be clearer for someone just starting out.

A comment is welcome with or without a donation. Please keep payment receipts, personal details, credentials and private user data out of public Issues.

---

**Thank you for supporting my work and helping me keep building and sharing. ❤️**
