# react-router-use-intl

A minimal example demonstrating how to integrate `@wadiou/tanstack-i18n` with [use-intl](https://github.com/amannn/next-intl/tree/main/packages/use-intl) in a client-side TanStack Router application.

## Features

- URL prefixing (`as-needed` mode)
- LocalStorage and Cookie persistence
- Language switcher using `useLocaleContext()`
- Message loading integrated with TanStack Router's `beforeLoad`
- Pure client-side single-page application (SPA)
- ICUMessageFormat support via `use-intl`

## Running the Example

```bash
pnpm --dir examples/react/router/use-intl dev
```

Open [http://localhost:3000](http://localhost:3000).

## Docs

See the [use-intl integration guide](../../../../apps/docs/content/integrations/use-intl.mdx) — this app implements that wiring.
