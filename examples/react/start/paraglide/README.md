# react-start-paraglide

A minimal example demonstrating how to integrate `@wadiou/tanstack-i18n` with [Paraglide JS](https://inlang.com/m/gerre34r/library-inlang-paraglideJs) compile-time messages in a TanStack Start application.

## Features

- URL prefixing (`as-needed` mode)
- Cookie persistence
- Language switcher using `useLocaleContext()`
- Message loading integrated with TanStack Router's `beforeLoad`
- Server-side rendering (SSR) of translated strings
- Paraglide JS compile-time translations integration

## Running the Example

```bash
pnpm --dir examples/react/start/paraglide dev
```

Open [http://localhost:3000](http://localhost:3000).

## Docs

See the [Paraglide integration guide](../../../../apps/docs/content/integrations/paraglide.mdx) — this app implements that wiring.
