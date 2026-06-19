# @Wadiou/tanstack-i18n

**Install, quick start, and development:** see the [repository README](../../README.md).

## Exports

| Subpath | Purpose |
| ------- | ------- |
| `.` | `defineLocaleConfig`, `createLocaleRuntime`, adapters, types |
| `./react-router` | React Router `createNavigation`, `createToLocalizedRoute` |
| `./solid-router` | Solid Router `createNavigation`, `createToLocalizedRoute` |
| `./react` | `createLocaleProvider`, `useLocaleContext` |
| `./solid` | Solid `createLocaleProvider` |
| `./react-start` | `createServerEntry` and React helpers |
| `./solid-start` | `createServerEntry` and Solid helpers |

## Peer dependencies

Optional — install only what your stack uses:

| Entry | Peers |
| ----- | ----- |
| `@Wadiou/tanstack-i18n` | — |
| `@Wadiou/tanstack-i18n/react` | `react` |
| `@Wadiou/tanstack-i18n/solid` | `solid-js` |
| `@Wadiou/tanstack-i18n/react-router` | `@tanstack/react-router` |
| `@Wadiou/tanstack-i18n/solid-router` | `@tanstack/solid-router` |
| `@Wadiou/tanstack-i18n/react-start` | `@tanstack/react-start` |
| `@Wadiou/tanstack-i18n/solid-start` | `@tanstack/solid-start` |

## Behavior contract

- `LocaleRequestResult` actions: `pass`, `redirect`, `sync-cookie`, `detect`
- Redirect responses default to HTTP **307** when status is omitted
- `getLocale()` resolves URL segment → persist adapters → `defaultLocale` (infer adapters are not used)

## License

MIT — see [LICENSE](./LICENSE).
