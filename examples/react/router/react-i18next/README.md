# react-router-react-i18next

A minimal example demonstrating how to integrate `@Wadiou/tanstack-i18n` with [react-i18next](https://react.i18next.com/) and [i18next](https://www.i18next.com/) in a client-side TanStack Router application.

## Features

- URL prefixing (`as-needed` mode)
- LocalStorage and Cookie persistence
- Language switcher using `useLocaleContext()`
- Message loading integrated with TanStack Router's `beforeLoad`
- Pure client-side single-page application (SPA)
- Request-scoped type-safe translation keys

## Running the Example

```bash
pnpm --dir examples/react/router/react-i18next dev
```

Open [http://localhost:3000](http://localhost:3000).

## Docs

See the [react-i18next integration guide](../../../../apps/docs/content/integrations/react-i18next.mdx) — this app implements that wiring.
