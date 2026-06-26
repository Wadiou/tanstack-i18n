---
name: Release Package
description: Instructions and guidelines on how to manage package versioning, generate changelogs, and run releases using Changesets in the tanstack-i18n monorepo.
---

# Package Versioning & Release Workflow

This skill explains how versioning and package releases are managed using Changesets in the `tanstack-i18n` repository.

> [!IMPORTANT]
> **AI Agent Responsibility Boundary:**
> When asked to prepare a feature or fix for release, **DO NOT** run versioning scripts (like `pnpm version-packages` or `pnpm release-packages`). Running them locally will modify the `package.json` and delete changeset files, which disables the GitHub Actions PR automation.
>
> Your **only** release task is to **generate the changeset file(s)** under `.changeset/<random-name>.md`. The GitHub Action bot will consume these files and handle package versioning and publishing automatically.

---

## 1. Creating a Changeset File

To document changes for release, generate a new changeset file at `.changeset/<random-name>.md`. 

### File Naming
Use a formal, descriptive name consisting of lowercase kebab-case words describing the change (e.g., `fix-cookie-parsing.md` or `add-solid-router-adapter.md`). Do not use random word combinations.

### File Format
Write the changeset using the following structure:
```markdown
---
"@wadiou/tanstack-i18n": patch
---

Detailed user-facing changelog description of the fix or feature.
```

### Determining the Bump Type
* **`patch`**: Backward-compatible bug fixes, performance improvements, internal refactoring, or dependency updates.
* **`minor`**: Backward-compatible new features or adapters added to the API.
* **`major`**: Backward-incompatible breaking changes to existing APIs or configurations.

---

## 2. Automated Versioning and Publishing (GitHub Bot)

For reference, the following commands are run **exclusively** by the GitHub Actions runner (`release.yml`) on `main`:

* `pnpm version-packages` (internally consumes pending `.changeset/*.md` files, bumps package versions, updates the changelog, and opens the "Version Packages" PR).
* `pnpm release-packages` (builds the workspace and publishes package versions to the public NPM registry when the release PR is merged).

