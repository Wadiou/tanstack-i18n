---
name: Create Example
description: Instructions and guidelines for creating or adding new integration examples in the monorepo.
---

# Creating a New Example Project

Follow these instructions whenever you need to create a new integration example project in this repository.

## 1. Copy an Existing Example First
To maintain symmetry and avoid configuration mistakes, never write a new example from scratch. Always start by identifying a similar example (e.g., matching the target framework `react` or `solid`, and router architecture `router` or `start`) and duplicate it.

```bash
# Example: Copying react/start/paraglide to create a react/start/use-intl example
cp -r examples/react/start/paraglide examples/react/start/use-intl
```

## 2. Update Configuration Files & Identifiers
Ensure you immediately clean up, rename, and update all configurations in the duplicated directory to match the new stack and location:

### package.json
- **`name`**: Set to the unscoped pattern `example-<framework>-<type>-<library>` (e.g., `example-solid-start-use-intl`).
- **`private`**: Must be set to `true`.
- **Dependencies**: Update dependencies and devDependencies to fit the new integration (e.g., swap `@inlang/paraglide-js` for `use-intl`). Ensure `@Wadiou/tanstack-i18n` is defined as a workspace dependency.

### biome.jsonc
- Update the `"extends"` property to match the root `biome.jsonc` file:
  ```json
  "extends": [
    "../../../../biome.jsonc",
    "ultracite/biome/react" // or solid
  ]
  ```

### README.md
- Update the title and features of the integration.
- Update all run commands to point to the correct directory:
  ```markdown
  pnpm --dir examples/<framework>/<type>/<integration> dev
  ```
- Adjust relative markdown links pointing to guides or docs (adjusting levels up like `../../../../apps/docs/...`).

## 3. Implement Stack-Specific Setup
- Ensure files like `vite.config.ts`, `src/locale-config.ts`, `src/locale.ts`, `src/i18n/provider.tsx`, and `src/routes/__root.tsx` are updated to match the target library's conventions.
- **Naming Conventions**: Always name the translation hook file `use-translation.ts` and export `useTranslations` (do not use custom abbreviations like `use-t.ts` or `useT`).
- Remove code and assets specific to the source example (e.g. delete `project.inlang` or `src/paraglide` when moving away from Paraglide).

## 4. Documentation Policy
- **Never** modify or create integration documentation files (e.g., in `apps/docs/content/integrations/`) unless explicitly requested by the user.

## 5. Integrate into Workspace
- Run `pnpm install` in the workspace root to regenerate node_modules and setup symlinks.
- Run `pnpm check`, `pnpm typecheck`, and `pnpm build` to verify the new example integrates cleanly into the monorepo check-suite.
