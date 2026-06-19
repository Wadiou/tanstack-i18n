# react-start-detect

A minimal example demonstrating how to integrate `@Wadiou/tanstack-i18n` with TanStack Start, showcasing isomorphic header-based locale detection.

## Features

- URL prefixing (`as-needed` mode)
- Cookie persistence
- Language switcher using `useLocaleContext()`
- Message loading integrated with TanStack Router's `beforeLoad`
- Server-side rendering (SSR) of translated strings
- Isomorphic header-based locale detection (`X-Locale-Detected`)

## Running the Example

```bash
pnpm --dir examples/react/start/detect dev
```

Open [http://localhost:3000](http://localhost:3000).

## Docs

See the [TanStack Start guide](../../../../apps/docs/content/guides/tanstack-start.mdx) — this app implements that wiring.
