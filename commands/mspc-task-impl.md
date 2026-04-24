---
description: Implement a minispec task from its spec and verify acceptance criteria
agent: build
---

# Minispec Task Impl

You are implementing a task based on its specification. The spec contains everything you need: requirements, acceptance criteria, technical context, and implementation plan. Your job is to write the code, verify it works, and leave the codebase in a clean state.

Read the task ID from `$ARGUMENTS`. If no argument is provided, stop and ask the user which task to implement.

## Process (follow in order)

### Phase 1 — Read & Understand

1. Read the spec file at `docs/specs/SPEC-T0001.md`, using the actual zero-padded task ID. If it does not exist, tell the user and suggest running `/mspc-task-new T0001` first.
2. Read `AGENTS.md` for project conventions and principles.
3. Read `docs/TECH.md` for current technical architecture — component boundaries, data model, technology choices, and established patterns.
4. Read `docs/REQS.md` to understand what is already implemented and working.
5. If this task has dependencies, read the current codebase to understand what already exists.
6. Build a mental model of what needs to be built or modified, the acceptance criteria to satisfy, the edge cases to handle, and what is explicitly out of scope.

### Phase 2 — Plan

Before writing code, think through the implementation:
1. What files need to be created or modified?
2. What is the right order of implementation?
3. What tests are needed to verify each acceptance criterion?
4. Are there any concerns or ambiguities? If so, ask the user before proceeding.

Present a brief implementation plan before editing. Confirm with the user only if the spec leaves ambiguity, the work involves a meaningful tradeoff, or you need approval for a deviation.

### Phase 3 — Implement

Write the code following the spec's implementation plan and the project's conventions.

Rules:
- Follow the spec's scope strictly. Do not add features, refactor unrelated code, or improve things outside the task boundary.
- Write code that satisfies the acceptance criteria — no more, no less.
- Handle the edge cases listed in the spec.
- Follow the project's coding conventions, naming patterns, and architectural boundaries.
- Write tests as you go.
- If you discover something that the spec did not account for, stop and discuss with the user rather than improvising.
- If the user approves a deviation from the spec, update `docs/specs/SPEC-T0001.md` for the actual zero-padded task ID before continuing to implement.
- Keep it simple. If you write 200 lines and it could be 50, rewrite it.
- Match existing code style. Do not introduce new patterns unless the spec calls for it.

### Phase 4 — Verify

Go through each acceptance criterion from the spec and verify it.

Steps that must actually be executed:
1. Run tests — execute all relevant tests and fix failures.
2. Build check — ensure the project builds cleanly, if applicable.
3. Lint or format — run any configured linters or formatters.
4. Manual verification — for criteria not fully covered by tests, describe the exact steps the user should run manually.
5. Acceptance checklist — check each criterion against what was actually verified.

Every criterion falls into one of three states:
- ✅ Verified — an automated test or observed behavior confirms it.
- 🟡 Needs manual check — cannot be automated; provide exact steps for the user.
- ❌ Not verified — tests failed, were skipped, or the criterion is unaddressed.

Present the verification results to the user:

```markdown
## Verification Results

- ✅ <criterion 1> — verified by <test name>
- 🟡 <criterion 2> — manual check: <exact steps>
- ❌ <criterion 3> — <what is blocking / what is needed>
```

Gate: if any criterion is ❌, the task is not ready. Do not suggest `/mspc-task-accept`. Instead, summarize what is blocking and either fix it in this session or flag it clearly.

### Phase 5 — Summary

Present:
- What was implemented (files created or modified)
- Verification results (acceptance criteria checklist)
- Any deviations from the spec (and why)
- Any issues discovered that affect other tasks
- Manual checks the user should perform before accepting
- Suggested next step:
  - If all criteria are ✅ or 🟡: "Test the 🟡 items yourself, then run `/mspc-task-accept T0001` with the actual zero-padded task ID to finalize."
  - If any criterion is ❌: "Fix the blockers above before accepting. Do not run `/mspc-task-accept` until all criteria pass."

## Rules to always apply

- The spec is the source of truth. If the spec seems wrong, flag it rather than silently diverging.
- Stay in scope. The spec's Excludes section exists for a reason.
- Test what you build. Every acceptance criterion should have corresponding verification.
- Do not mark tasks as done. The user does that via `/mspc-task-accept` after their own verification.
- Ask before improvising. A short clarification is cheaper than a wrong implementation.
- Clean code, not perfect code. Write clear, working code that satisfies the criteria without over-engineering.
