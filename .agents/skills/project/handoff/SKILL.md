---
name: handoff
description: Standardize coordination between agent sessions by creating and maintaining handoff documents in tmp/handoffs/
---

# handoff

This skill explains how agents must create and update handoff documents when working on multi-phase implementations or when the user requests a session refresh.

---

## Where to Store Handoffs

- **Location:** All handoff documents MUST be saved in the `tmp/handoffs/` directory relative to the repository root.
- **Naming Convention:** Files must follow the naming pattern: `handoff-<feature>.md` (e.g., `handoff-router.md`, `handoff-dashboard-v2.md`).

---

## Scenario 1: Multi-phase Implementations

When implementing a large feature broken into phases, use the handoff file to track progress and context for subsequent agents.

1. **Track the Current Phase:**
   - Clearly document all planned phases.
   - Mark which phase is currently in progress, completed, or next.

2. **Update After Completion:**
   - At the end of your session/task, ALWAYS update the handoff document to reflect your progress.
   - Note what was successfully completed and any blockers encountered.

3. **Include Essential Resources:**
   - Provide direct paths to key files touched or needed.
   - Include relevant resource links, architecture context, and hints so the next agent knows *exactly* where to search and start without needing to do broad codebase discovery.

---

## Scenario 2: Session Refresh

When the user wants to refresh the session (start a new chat/agent), follow these steps:

1. **Summarize Progress:**
   - Document an in-depth, highly detailed summary of the work that has been completed in the current session. Provide comprehensive context so the new agent is fully up to speed.
   
2. **Define the Next Phase:**
   - If the user specifies the next goal or phase, explicitly document it under a "Next Steps" or "Next Phase" section.

---

## Template 1: Multi-phase Implementation

```markdown
# Handoff: <Feature Name>

## Overview
Brief description of the feature or task.

## Phases
- [x] Phase 1: Setup scaffolding
- [x] Phase 2: Implement core logic
- [ ] Phase 3: Add unit tests (Next)
- [ ] Phase 4: Final review and linting

## Current Status Summary
Summarize the work completed in the latest session. (e.g., "Implemented the authentication middleware, but tests are currently failing on the token refresh edge case.")

## Next Phase
- Focus on Phase 3. 
- Fix token refresh tests.

## Key Resources & Files
- `src/middleware/auth.ts`: Main logic
- `tests/auth.test.ts`: Failing tests
- [External API Doc](https://example.com/api)
```

---

## Template 2: Session Refresh

```markdown
# Session Refresh: <Current Focus>

## Overview
Brief description of the current task being worked on before the refresh.

## Progress Summary
An in-depth, highly detailed summary of what was successfully completed in the previous session, the exact current state, partial progress, context, and what is currently pending.

## Next Steps
- Define the immediate next steps the new agent should take based on user instructions.

## Key Resources & Files
- Provide direct paths to the files currently being worked on.
```
