# react-start-use-intl

A minimal example demonstrating how to integrate `@Wadiou/tanstack-i18n` with [use-intl](https://next-intl.dev/docs/environments/core-library) in a TanStack Start application.

## Features

- URL prefixing (`as-needed` mode)
- Cookie persistence
- Language switcher using `useLocaleContext()`
- Message loading integrated with TanStack Router's `beforeLoad`
- Server-side rendering (SSR) of translated strings

## Running the Example

```bash
pnpm --dir examples/react/start/use-intl dev
```

Open [http://localhost:3000](http://localhost:3000).

## Docs

See the [use-intl integration guide](../../../../apps/docs/content/integrations/use-intl.mdx) — this app implements that wiring.
