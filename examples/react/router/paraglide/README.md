# react-router-paraglide

A minimal example demonstrating how to integrate `@wadiou/tanstack-i18n` with [Paraglide-JS](https://inlang.com/m/gerre34r/library-inlang-paraglideJs) in a client-side TanStack Router application.

## Features

- URL prefixing (`as-needed` mode)
- LocalStorage and Cookie persistence
- Language switcher using `useLocaleContext()`
- Message loading integrated with TanStack Router's `beforeLoad`
- Pure client-side single-page application (SPA)
- Fully type-safe compiled dictionary messages

## Running the Example

```bash
pnpm --dir examples/react/router/paraglide dev
```

Open [http://localhost:3000](http://localhost:3000).

## Docs

See the [Paraglide integration guide](../../../../apps/docs/content/integrations/paraglide.mdx) — this app implements that wiring.
