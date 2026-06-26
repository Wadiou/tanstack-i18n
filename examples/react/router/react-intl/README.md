# react-router-react-intl

A minimal example demonstrating how to integrate `@wadiou/tanstack-i18n` with [react-intl](https://formatjs.io/docs/react-intl/) in a client-side TanStack Router application.

## Features

- URL prefixing (`as-needed` mode)
- LocalStorage and Cookie persistence
- Language switcher using `useLocaleContext()`
- Message loading integrated with TanStack Router's `beforeLoad`
- Pure client-side single-page application (SPA)

## Running the Example

```bash
pnpm --dir examples/react/router/react-intl dev
```

Open [http://localhost:3000](http://localhost:3000).

## Docs

See the [react-intl integration guide](../../../../apps/docs/content/integrations/react-intl.mdx) — this app implements that wiring.
