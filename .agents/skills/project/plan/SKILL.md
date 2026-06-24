---
name: plan
description: Create and structure feature plans in the local documentation sandbox. Use when asked to plan a feature or create an implementation route.
---

# plan

This skill explains how agents must structure and organize feature plans in `apps/docs-dev`. 

> [!IMPORTANT]
> This skill ONLY covers the *structure and categorization* of plans. For rules on how to author MDX, structure Fumadocs, and edit `meta.json`, you **must** refer to the **use-docs** skill.

---

## Where to Store Plans

All plans must be stored in the local documentation sandbox under:
**`apps/docs-dev/content/tmp/plans/`**

---

## Plan Categories

When creating a plan, you must categorize it as either **Simple** or **Complex**. The user can explicitly instruct you to treat a plan as Complex even if you initially deem it Simple.

### 1. Simple Plans
Use for small, straightforward features.
- **Structure:** A single markdown route.
- **Example:** `apps/docs-dev/content/tmp/plans/login.mdx`
- *Note:* If the user later requests an implementation route, this simple plan must be refactored (see Implementation Routes below).

### 2. Complex Plans
Use for large features requiring in-depth explanation across multiple parts.
- **Structure:** A parent folder containing multiple routes. The main plan goes in `index.mdx`, and specific topics go into subroutes.
- **Example:**
  ```text
  apps/docs-dev/content/tmp/plans/dashboard/
  ├── index.mdx       (Main overview)
  ├── api.mdx         (API design)
  └── components.mdx  (UI components)
  ```

### 3. Expanding Complex Subroutes
If the user asks to expand a specific section of a complex plan (e.g., the API section becomes too complex for a single file), you should **multi-nest it within the same folder** rather than moving it outside. 
- **Refactoring:** Rename `api.mdx` to `api/index.mdx` and add additional subroutes alongside it.
- **Example:**
  ```text
  apps/docs-dev/content/tmp/plans/dashboard/
  ├── index.mdx
  ├── api/
  │   ├── index.mdx       (Was api.mdx)
  │   └── endpoints.mdx   (New in-depth route)
  └── components.mdx
  ```

---

## Plan Depth

When writing the content of a plan, **you must decide the appropriate level of detail**. Evaluate the feature's complexity and choose whether the plan should be:
- **Concise:** For trivial or straightforward changes.
- **Medium Depth:** For standard features that need clear outlines but not exhaustive documentation.
- **High Depth:** For intricate architecture, large features, or highly nuanced edge cases.

Use your best judgment to provide the exact right amount of detail.

---

## Implementation Routes & Phases

The user can demand an **implementation route** containing actionable phases. This route splits the overall plan into small phases, allowing the agent to execute only *one phase at a time* per request.

The implementation route must be named **`implementation.mdx`**. Its placement depends on the plan's category:

### For Complex Plans
Place `implementation.mdx` directly next to the other subroutes in the feature's folder.
```text
apps/docs-dev/content/tmp/plans/dashboard/
├── index.mdx
├── components.mdx
└── implementation.mdx   <-- Actionable phases
```

### For Simple Plans (Refactoring)
If you created a Simple plan (e.g., `feature.mdx`) and the user requests an implementation route, you must refactor the plan into a folder:
1. Rename `feature.mdx` to `feature/index.mdx`.
2. Create the implementation route as `feature/implementation.mdx`.
3. Update the `meta.json` as instructed by the **use-docs** skill.

```text
apps/docs-dev/content/tmp/plans/feature/
├── index.mdx            <-- Was feature.mdx
└── implementation.mdx   <-- Actionable phases
```

---

## Execution Rule

- **No premature execution:** Never write, modify, or delete any codebase source files during the planning stage (i.e. while creating or editing plans) unless the user explicitly specifies. The planning phase must be strictly limited to research and plan authoring.
- **Execute one phase per request:** When following an `implementation.mdx` document, do not attempt to complete multiple phases in a single response unless explicitly asked by the user.

---

## Related
- **use-docs** — MDX authoring, `meta.json` rules, and Fumadocs structure.
- **handoff** — How to track phase completion and hand off between sessions.
