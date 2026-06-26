# solid-start-solid-primitives-i18n

A minimal example demonstrating how to integrate `@wadiou/tanstack-i18n` with `@solid-primitives/i18n` in a TanStack Solid Start application.

## Features

- URL prefixing (`as-needed` mode)
- Cookie persistence
- Language switcher using `useLocaleContext()`
- Message loading integrated with TanStack Router's `beforeLoad`
- Server-side rendering (SSR) of translated strings
- `@solid-primitives/i18n` reactive translations integration

## Running the Example

```bash
pnpm --dir examples/solid/start/solid-primitives-i18n dev
```

Open [http://localhost:3000](http://localhost:3000).

## Docs

See the [Solid Primitives i18n integration guide](../../../../apps/docs/content/integrations/solid-primitives-i18n.mdx) — this app implements that wiring.
