# @Wadiou/tanstack-i18n

Locale routing, persistence, and TanStack Start/Router adapters for i18n.

For full installation instructions, guides, and API references, visit the [TanStack i18n Documentation](https://tanstack-i18n.wadiou.dev).

## Quick Links

- [Documentation Website](https://tanstack-i18n.wadiou.dev)
- [GitHub Repository](https://github.com/Wadiou/tanstack-i18n)
- [Contributing Guide](https://github.com/Wadiou/tanstack-i18n/blob/main/CONTRIBUTING.md)
- [Runnable Integration Examples](https://github.com/Wadiou/tanstack-i18n/tree/main/examples)

## Installation

```bash
pnpm add @Wadiou/tanstack-i18n
# or bun add @Wadiou/tanstack-i18n
# or npm i @Wadiou/tanstack-i18n
```

## Subpath Exports

This package exposes separate subpath entries for different UI frameworks and routers. Import only what you need:

| Subpath | Purpose |
| ------- | ------- |
| `@Wadiou/tanstack-i18n` | Core runtime: `defineLocaleConfig`, `createLocaleRuntime`, persistence adapters, and core types |
| `@Wadiou/tanstack-i18n/react` | React bindings: `createLocaleProvider`, `useLocaleContext` |
| `@Wadiou/tanstack-i18n/solid` | Solid JS bindings: `createLocaleProvider` |
| `@Wadiou/tanstack-i18n/react-router` | React Router / TanStack Router integration: `createNavigation`, `createToLocalizedRoute` |
| `@Wadiou/tanstack-i18n/solid-router` | Solid Router / TanStack Router integration: `createNavigation`, `createToLocalizedRoute` |
| `@Wadiou/tanstack-i18n/react-start` | TanStack Start (React) helpers: `createServerEntry` and client/server request utilities |
| `@Wadiou/tanstack-i18n/solid-start` | TanStack Start (Solid) helpers: `createServerEntry` and client/server request utilities |

## Peer Dependencies

Please install the peer dependencies corresponding to the subpaths you import in your project:

| Subpath Entry | Peer Dependency |
| ------------- | --------------- |
| `@Wadiou/tanstack-i18n` | _None_ |
| `@Wadiou/tanstack-i18n/react` | `react` |
| `@Wadiou/tanstack-i18n/solid` | `solid-js` |
| `@Wadiou/tanstack-i18n/react-router` | `@tanstack/react-router` |
| `@Wadiou/tanstack-i18n/solid-router` | `@tanstack/solid-router` |
| `@Wadiou/tanstack-i18n/react-start` | `@tanstack/react-start` |
| `@Wadiou/tanstack-i18n/solid-start` | `@tanstack/solid-start` |

## License

MIT — see [LICENSE](./LICENSE).
