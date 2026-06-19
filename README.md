<p align="center">
  <img src="./assets/Header-i18n.png" alt="TanStack i18n" width="850" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT" />
  <img src="https://img.shields.io/badge/node-%3E%3D20-green.svg" alt="node >=20" />
</p>

- Locale segments in URLs — prefix always, hide for default, or custom paths per language
- First-visit handling — send visitors to the right URL and remember their choice
- Browser language detection when no preference exists yet
- React and Solid bindings — bring your own translation library

## Install

```bash
pnpm add @Wadiou/tanstack-i18n
```

Peer dependencies are optional — install only what your stack uses. See [package README](packages/tanstack-i18n/README.md) for exports and peer dependencies.

## Quick start

```ts
import {
  defineLocaleConfig,
  createLocaleRuntime,
  cookie,
  acceptLanguage,
} from "@Wadiou/tanstack-i18n";

const config = defineLocaleConfig({
  locales: ["en", "ar"],
  defaultLocale: "en",
  url: { prefix: "always" },
  adapters: {
    persist: [cookie({ name: "LOCALE" })],
    infer: [acceptLanguage()],
  },
});

export const locale = createLocaleRuntime(config);
```

## Repository layout

| Path | Role |
| ---- | ---- |
| `packages/tanstack-i18n` | npm package |
| `apps/docs` | Public docs site |
| `apps/docs-dev` | Local WIP docs (not deployed) |
| `examples/*` | Runnable integration examples |

## Development

```bash
corepack enable
pnpm install
pnpm validate
pnpm docs:dev
pnpm --dir examples/<name> dev
```

Run `pnpm validate` before opening a PR (lint, typecheck, and tests across workspaces).

## Links

- [Package README](packages/tanstack-i18n/README.md) — exports, peers, behavior contract
- [Contributing](CONTRIBUTING.md)
- [Docs site](apps/docs) — run `pnpm docs:dev` locally

License: [MIT](./LICENSE)
