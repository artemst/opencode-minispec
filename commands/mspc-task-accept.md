---
description: Distill a completed minispec task into living docs and archive it
agent: build
---

# Minispec Task Accept

The user is ready to accept a task. Distill actual implementation into living docs (`minispec/REQS.md`, `minispec/TECH.md`, `minispec/TESTS.md`), archive the task, and delete its temporary spec.

Read the task ID from `$ARGUMENTS`. If no argument is provided, stop and ask the user which task to accept.

## Process (follow in order)

### Phase 1 — Read & Gather

1. Read `minispec/specs/SPEC-T0001.md`, using the actual zero-padded task ID. If it does not exist, stop and tell the user.
2. Read `minispec/REQS.md`, `minispec/TECH.md`, and `minispec/TESTS.md`.
3. Read `minispec/TODO.md` and find the task entry if present.
4. Read `minispec/DONE.md` for archive format.
5. Read `minispec/CONCEPT.md` and `minispec/LESSONS.md`.
6. Read the actual implementation code and tests; distill what shipped, not just what was planned.

### Phase 2 — Acceptance Gate

Before editing, verify readiness:
- The user has tested the implementation, or explicitly accepts any remaining manual checks.
- No acceptance criterion is known failed or unaddressed.
- The spec and implementation contain enough information to preserve the delivered behavior.

If readiness is unclear from the current conversation, stop and ask for acceptance confirmation before mutating docs.

### Phase 3 — Prepare Distillation

Build the full change set before writing:
- `REQS.md` - implemented, testable behavior and edge cases; no duplicates; reference the task ID.
- `TECH.md` - actual components, data/config changes, patterns, and integrations; conceptual, not function-by-function.
- `TESTS.md` - automated tests with locations, plus manual checks with steps and expected outcomes.
- `CONCEPT.md` - update only if implementation changed the vision, planned feature shape, or key decisions.
- `TODO.md` - remove the accepted task if it is present.
- `DONE.md` - add the archive entry.
- Spec file - delete only after doc updates and archive succeed.

Keep each doc coherent; update existing sections instead of appending task-by-task fragments.

### Phase 4 — Lesson Decision

Lessons belong in `minispec/LESSONS.md` only when the task produced durable, non-obvious knowledge a future reader could not infer from code, `REQS.md`, or `TECH.md`.

Qualifying signals:
- an abandoned approach and why it failed
- a mid-task reversal and what triggered it
- a surprise or gotcha future work would likely hit
- a hidden constraint not encoded elsewhere

If no lesson qualifies, skip lesson updates. If one or more qualify, list them for the user before editing and write only what they confirm. Update an adjacent existing lesson instead of adding a parallel one when possible.

Lesson entry format:

```markdown
### <Short takeaway>

- **Learned in**: T0001 — <task summary>
- **Context**: <what we were trying to do>
- **Insight**: <the non-obvious thing>
- **Implication**: <what future work should do differently>
```

### Phase 5 — Apply Changes

Only after the acceptance gate and lesson decision are complete:

1. Update `REQS.md`, `TECH.md`, `TESTS.md`, and any needed `CONCEPT.md`/`LESSONS.md` entries.
2. Remove the task from `TODO.md` if present.
3. Add this entry to `DONE.md`:

```markdown
## T0001 — <description>

- **Completed**: <YYYY-MM-DD>
- **Spec**: SPEC-T0001 (removed after distillation)
- **Summary**: <one-sentence summary of what was delivered>
- **Files**: <key files created or modified>
```

4. Delete `minispec/specs/SPEC-T0001.md` for the actual zero-padded task ID.

If any write fails, stop, report the partial state, and do not delete the spec unless all doc/archive updates succeeded.

### Phase 6 — Summary

Present:
- What was distilled into `REQS.md`, `TECH.md`, and `TESTS.md`
- Task archive entry in `DONE.md`
- Spec removal status
- Any `CONCEPT.md` or `LESSONS.md` updates, or explicitly say none were needed
- Suggested next task from `TODO.md`, if any

## Rules

- Reality over plan: distill from the implementation.
- Preserve traceability with task IDs.
- Do not add speculative content to reality docs.
- Do not delete the spec before durable docs and archive are updated.
