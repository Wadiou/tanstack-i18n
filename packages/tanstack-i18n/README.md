# @wadiou/tanstack-i18n

Locale routing, persistence, and TanStack Start/Router adapters for i18n.

For full installation instructions, guides, and API references, visit the [TanStack i18n Documentation](https://tanstack-i18n.wadiou.dev).

## Quick Links

- [Documentation Website](https://tanstack-i18n.wadiou.dev)
- [GitHub Repository](https://github.com/Wadiou/tanstack-i18n)
- [Contributing Guide](https://github.com/Wadiou/tanstack-i18n/blob/main/CONTRIBUTING.md)
- [Runnable Integration Examples](https://github.com/Wadiou/tanstack-i18n/tree/main/examples)

## Installation

```bash
pnpm add @wadiou/tanstack-i18n
# or bun add @wadiou/tanstack-i18n
# or npm i @wadiou/tanstack-i18n
```

## Subpath Exports

This package exposes separate subpath entries for different UI frameworks and routers. Import only what you need:

| Subpath | Purpose |
| ------- | ------- |
| `@wadiou/tanstack-i18n` | Core runtime: `defineLocaleConfig`, `createLocaleRuntime`, persistence adapters, and core types |
| `@wadiou/tanstack-i18n/react` | React bindings: `createLocaleProvider`, `useLocaleContext` |
| `@wadiou/tanstack-i18n/solid` | Solid JS bindings: `createLocaleProvider` |
| `@wadiou/tanstack-i18n/react-router` | React Router / TanStack Router integration: `createNavigation`, `createToLocalizedRoute` |
| `@wadiou/tanstack-i18n/solid-router` | Solid Router / TanStack Router integration: `createNavigation`, `createToLocalizedRoute` |
| `@wadiou/tanstack-i18n/react-start` | TanStack Start (React) helpers: `createServerEntry` and client/server request utilities |
| `@wadiou/tanstack-i18n/solid-start` | TanStack Start (Solid) helpers: `createServerEntry` and client/server request utilities |

## Peer Dependencies

Please install the peer dependencies corresponding to the subpaths you import in your project:

| Subpath Entry | Peer Dependency |
| ------------- | --------------- |
| `@wadiou/tanstack-i18n` | _None_ |
| `@wadiou/tanstack-i18n/react` | `react` |
| `@wadiou/tanstack-i18n/solid` | `solid-js` |
| `@wadiou/tanstack-i18n/react-router` | `@tanstack/react-router` |
| `@wadiou/tanstack-i18n/solid-router` | `@tanstack/solid-router` |
| `@wadiou/tanstack-i18n/react-start` | `@tanstack/react-start` |
| `@wadiou/tanstack-i18n/solid-start` | `@tanstack/solid-start` |

## License

MIT — see [LICENSE](./LICENSE).
