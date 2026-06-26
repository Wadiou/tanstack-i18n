# react-start-react-intl

A minimal example demonstrating how to integrate `@wadiou/tanstack-i18n` with [react-intl](https://formatjs.io/docs/react-intl/) in a TanStack Start application.

## Features

- URL prefixing (`as-needed` mode)
- Cookie persistence
- Language switcher using `useLocaleContext()`
- Message loading integrated with TanStack Router's `beforeLoad`
- Server-side rendering (SSR) of translated strings

## Running the Example

```bash
pnpm --dir examples/react/start/react-intl dev
```

Open [http://localhost:3000](http://localhost:3000).

## Docs

See the [react-intl integration guide](../../../../apps/docs/content/integrations/react-intl.mdx) — this app implements that wiring.
