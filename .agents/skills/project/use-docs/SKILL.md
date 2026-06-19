---
name: use-docs
description: Read and author Fumadocs for @Wadiou/tanstack-i18n. Use when editing MDX, meta.json, or the docs app.
---

# use-docs

**`apps/docs-dev`** is a sandbox for local documentation. **`apps/docs`** + the structure sections below are where authoring conventions live. For feature planning, refer to the **plan** skill.

| App | Purpose | Run |
|-----|---------|-----|
| **`apps/docs`** | Deployable public docs (stub until release) | `pnpm docs:dev` → :5173 |
| **`apps/docs-dev`** | Local dev — sandbox / WIP (gitignored `tmp/`) | `pnpm --dir apps/docs-dev run dev` → :5175 |

**Package code** in **`packages/tanstack-i18n`** is the source of truth for behavior and APIs.

**DO NOT** invent Nextra layout (`apps/docs/app/`, `_meta.js`). **DO NOT** duplicate monorepo-only patterns (NestJS, Better Auth, full-stack app guides).

**DO NOT** grep, cite, or summarize files under `apps/docs-dev/content/tmp/` unless the user explicitly asks about a specific tmp file.

---

## When to use

- Implement or explain package behavior → read **`packages/tanstack-i18n`** first; use deployable docs in `apps/docs/content/` when present.
- Add or move **deployable** pages → `apps/docs/content/` + **use-commit** with `docs(docs): …`.
- Local sandbox / WIP → `apps/docs-dev` (gitignored `tmp/`; dev server only). (See the **plan** skill for feature planning).

---

## Agent directives

1. **Code first for behavior** — `packages/tanstack-i18n` over local tmp MDX.
2. **Authoring structure** — follow `meta.json` / MDX rules below for **`apps/docs`** only.
3. **Local tmp** — discover sections via the docs-dev sidebar after `pnpm --dir apps/docs-dev run dev`; do not hard-code tmp slug lists.
4. **Lint / Biome policy** — when the user asks about ignores or Ultracite suppressions, read the **lint** section in the docs-dev sidebar (under workspace) after starting the dev server.
5. **Historical prose** — MDX may reference paths outside this repo; those are **not** pages in these docs apps.

---

## Deployable docs — `apps/docs`

| Piece | Location |
|-------|----------|
| Content | `apps/docs/content/` |
| Source config | `apps/docs/source.config.ts` |
| Loader | `apps/docs/src/lib/source.ts` |
| Page shell / MDX | `src/routes/$.tsx`, `src/components/mdx.tsx` |

```bash
pnpm docs:dev       # http://localhost:5173
pnpm docs:preview   # build + preview on 5174
pnpm build          # turbo build — includes apps/docs, not docs-dev
```

### `meta.json` rules

- Every `pages` entry must exist as `index.mdx`, `{slug}.mdx`, or a subfolder with content.
- **Never** list `"index"` in `pages` when the folder has `index.mdx` — duplicates the sidebar hub.
- Top-level section folders: include `"icon"` (Lucide PascalCase) on the folder’s own `meta.json`.
- When moving pages, update parent `pages` arrays in the same change.

### Section landing — parent holds hub content

For multi-page sections (`integrations/`, `migration/`, etc.):

1. Put hub intro on **`{section}/index.mdx`** — served at `/integrations`.
2. **`pages` lists only child slugs** — never `"index"`. The folder parent is the landing; index content is not a duplicate sidebar child.
3. Do not add a leaf whose `title` repeats the folder `title` in `meta.json`.

### Single-page onboarding sections

For **get-started** (and similar early onboarding with no child routes):

- Use a **flat page** — `get-started.mdx` at `content/` root, listed in root `meta.json` `pages`.
- Set **`icon`** in page frontmatter (Lucide PascalCase, e.g. `Rocket`) — same as folder `meta.json` icons.
- Do **not** use an empty folder (`get-started/index.mdx` + `"pages": []`) — Fumadocs still renders a collapsible folder with a chevron.
- Split into a folder only when the section has real child pages.

### Authoring standards

| Rule | Detail |
| ---- | ------ |
| **Code first** | Read `packages/tanstack-i18n/src/` + README before writing |
| **No empty public pages** | No Callout-only stubs in `apps/docs` |
| **Integrations stay in Integrations** | Get started may mention BYO messages and name use-intl as the primary example — no wiring recipe there |
| **Surface API only** | Outcomes and config; no pipeline internals |
| **MDX safety** | `` `{-$locale}` `` in inline code only — never bare `{-$locale}` |
| **Enhance over copy-paste** | README is source material; use `Steps`, tables, cross-links |

### MDX components (no imports in content)

`Card`, `Cards`, `Callout`, `Tabs`, `Tab`, `Steps`, `Step`, `Mermaid`

Hub grids: `<Card title="…" href="…" icon="LucideName" />`

### Adding a page

1. Choose section via parent folder `meta.json`.
2. Add `{slug}.mdx` or folder `index.mdx` + frontmatter `title` / `description`.
3. Add slug to parent `"pages"`.
4. Cross-link with root-relative paths discovered from the folder tree.

---

## Local dev — `apps/docs-dev`

Local sandbox and WIP preview only. Not built or deployed. See the **plan** skill for instructions on creating plans.

```bash
pnpm --dir apps/docs-dev run dev   # http://localhost:5175
```

---

## Related

- **plan** — how to structure and categorize feature plans in docs-dev.
- **use-commit** — scoped commits for doc and skill changes.
