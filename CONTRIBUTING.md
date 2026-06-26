# Contributing

Issues and pull requests are welcome. For questions, open a GitHub issue until Discussions are enabled on the published repo.

## Prerequisites

- [Node.js](https://nodejs.org/) **24+**
- [pnpm](https://pnpm.io/) **11.5.0** — run `corepack enable` once

## Repository layout

| Path | Role |
| ---- | ---- |
| `packages/tanstack-i18n` | npm package |
| `apps/docs` | Public docs site |
| `apps/docs-dev` | Local WIP docs (not deployed) |
| `examples/*` | Runnable integration examples |

## Setup

```bash
nvm install
nvm use
corepack enable
pnpm install
```

## Quality checks

From the repository root:

```bash
pnpm validate   # lint, typecheck, and tests (turbo across workspaces)
pnpm check      # Biome/Ultracite read-only
pnpm fix        # auto-fix where safe
```

Run `pnpm validate` before opening a pull request.

## Git hooks

| Hook | Runs |
| ---- | ---- |
| `pre-commit` | `lint-staged` (Biome on staged files), then `pnpm validate` |
| `commit-msg` | Commitlint — [Conventional Commits](https://www.conventionalcommits.org/) with a **required scope** |

## Commit format

```
type(scope): imperative subject
```

| Scope | Use when changes touch… |
| ----- | ----------------------- |
| `tanstack-i18n` | `packages/tanstack-i18n` |
| `docs` | `apps/docs` |
| `monorepo` | root config, Turbo, hooks, skills |
| `deps` | dependency-only bumps |
| `ci` | `.github/workflows` |

Examples:

- `feat(tanstack-i18n): add cookie adapter option`
- `docs(docs): document redirect status contract`
- `chore(monorepo): align turbo scripts with workspace defaults`

**How to commit:**

- **Interactive:** `pnpm commit` (Commitizen + commitlint scopes)
- **From a file:** write the message to `.commit/message` , then run `pnpm commit:file` (`git commit -F .commit/message`)

**Agents:** repo-specific skills live under [`.agents/skills/project/`](.agents/skills/project/) — [`use-commit`](.agents/skills/project/use-commit/SKILL.md) (scoped commits, `.commit/message` workflow) and [`use-docs`](.agents/skills/project/use-docs/SKILL.md) (Fumadocs MDX in `apps/docs`). Agents commit only when asked; they use `.commit/message` + `git commit -F .commit/message`, not `pnpm commit`.

## Pull requests

- Run `pnpm validate` before opening a PR
- Prefer one logical change per PR when practical
- For package behavior, `packages/tanstack-i18n/src/` is the source of truth — update code first, then docs

## Code conventions

- Modules under `packages/tanstack-i18n/src/` use static-class layout (see existing files)
- Exported types: JSDoc in `types.ts`; `{@link}` references only types defined in that file
- Package lint: `pnpm --dir packages/tanstack-i18n run check` (Ultracite/Biome)

## Docs & Examples

- **Docs site**: run `pnpm docs:dev` from the repo root to start `apps/docs`.
- **Examples**: run `pnpm --dir examples/<name> dev` to run a specific integration example locally.
- `apps/docs-dev` and `content/tmp/` are local WIP (gitignored) — not the public specification

## Changesets & Releases

This repository uses [Changesets](https://github.com/changesets/changesets) to manage package versioning and generate changelogs.

### Creating a Changeset (Humans)

If your changes affect `@wadiou/tanstack-i18n` and should trigger a release:

1. Run the changesets CLI from the repository root:
   ```bash
   pnpm changeset
   ```
2. Follow the interactive CLI prompts to select:
   - The package to bump (`@wadiou/tanstack-i18n`).
   - The bump type (`patch`, `minor`, or `major`).
   - A detailed user-facing description of the change for the changelog.
3. Commit the generated `.changeset/<random-name>.md` file alongside your changes.

### AI Agents Release Guideline

If you are an AI agent working in this repository:
* Do **NOT** run versioning scripts (`pnpm version-packages` or `pnpm release-packages`) locally.
* Follow the instructions in the [Release Package](.agents/skills/release/SKILL.md) skill to generate changeset files manually under `.changeset/<descriptive-name>.md`. Only the GitHub Actions release workflow bot is permitted to consume changesets and perform package releases.
