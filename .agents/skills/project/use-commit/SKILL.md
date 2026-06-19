---
name: use-commit
description: Write scoped Conventional Commits and run git commit in this repo. Use when the user asks to commit, amend, or draft a message.
---

# use-commit

How agents commit in this **tanstack-i18n** workspace. For amend/push/hook safety, follow the user rule **committing-changes-with-git**; this skill adds **repo-specific** scopes and workflow.

---

## When to commit

- **Only** when the user explicitly asks.
- **Run** `git add`, `git commit`, `git status` yourself — do not only print commands.
- **Always** write the message to **`.commit/message`** first (never stage that file).
- Message draft only → update **`.commit/message`** only; do not run `git commit`.
- After success, reply with subject line + brief summary — not a second full draft in chat.
- **Never** proactive commits, `git config` changes, `--no-verify`, `git push`, or interactive git (`-i`).

### Amend (short)

`git commit --amend` only if: user asked, HEAD was your commit this session, not pushed, and amend was requested or a hook auto-fixed files after a **successful** commit. Hook **failed** → fix and create a **new** commit.

---

## Git hooks

| Hook | Runs |
|------|------|
| `pre-commit` | `lint-staged` (Biome) → `pnpm validate` |
| `commit-msg` | Commitlint — scoped Conventional Commits |

`pnpm validate` = `turbo run check typecheck test` across workspaces that define those scripts (package + docs for check/typecheck; package for test).

Humans: `pnpm commit` or `pnpm commit:file`. Agents: **`.commit/message`** + `git commit -F .commit/message`.

---

## Pre-commit workflow

From repo root, in parallel before drafting:

```bash
git status
git diff
git diff --staged
git log -5 --oneline
git log -3 --format=%B
```

Pick scope from the table below. Do not commit secrets or `.env`.

---

## Message format

```
type(scope): imperative subject

1–3 sentences on why, not a file list.
```

| Part | Rule |
|------|------|
| Subject | ≤100 chars, no trailing period |
| Type | `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert` |
| Scope | **Required** — enum below |

### Scopes

| Scope | Use when changes touch… |
|-------|-------------------------|
| `tanstack-i18n` | `packages/tanstack-i18n` |
| `docs` | `apps/docs` |
| `monorepo` | root config, Turbo, hooks, `.vscode`, skills |
| `deps` | dependency-only bumps |
| `ci` | `.github/workflows` |

### Examples

- `feat(tanstack-i18n): add optional solid router peer`
- `docs(docs): document redirect status contract`
- `chore(monorepo): align turbo scripts with workspace defaults`

Invalid: `feat: missing scope`, `feat(frontend): …` (scope not in enum).

---

## Commit steps

1. Pre-commit workflow above.
2. Write scoped message to **`.commit/message`**.
3. `git add <paths>` — never `.commit/message`.
4. `git commit -F .commit/message`
5. `git status`

---

## Related

- **use-docs** — Fumadocs content, `meta.json`, MDX authoring.
