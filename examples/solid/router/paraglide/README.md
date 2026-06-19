# solid-router-paraglide

A minimal example demonstrating how to integrate `@Wadiou/tanstack-i18n` with [Paraglide JS](https://inlang.com/m/gerre34r/library-inlang-paraglideJs) compile-time messages in a TanStack Solid Router SPA (Single Page Application).

## Features

- URL prefixing (`as-needed` mode)
- Cookie & LocalStorage persistence
- Language switcher using `useLocaleContext()`
- Message loading integrated with TanStack Router's `beforeLoad`
- Paraglide JS compile-time translations integration

## Running the Example

```bash
pnpm --dir examples/solid/router/paraglide dev
```

Open [http://localhost:3000](http://localhost:3000).

## Docs

See the [Paraglide integration guide](../../../../apps/docs/content/integrations/paraglide.mdx) — this app implements that wiring.
