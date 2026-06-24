# react-start-react-i18next

A minimal example demonstrating how to integrate `@Wadiou/tanstack-i18n` with [react-i18next](https://react.i18next.com/) in a TanStack Start application.

## Features

- URL prefixing (`as-needed` mode)
- Cookie persistence
- Language switcher using `useLocaleContext()`
- Message loading integrated with TanStack Router's `beforeLoad`
- Server-side rendering (SSR) of translated strings with request-scoped `i18next` instances

## Running the Example

```bash
pnpm --dir examples/react/start/react-i18next dev
```

Open [http://localhost:3000](http://localhost:3000).

## Docs

See the [react-i18next integration guide](../../../../apps/docs/content/integrations/react-i18next.mdx) — this app implements that wiring.
