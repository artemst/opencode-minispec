---
description: Handle a trivial minispec change end-to-end without creating a spec file
agent: build
---

# Minispec Task Quick

This is the only intentional no-spec path. Use it for changes that are too small to justify the full `/mspc-task-new -> /mspc-task-impl -> /mspc-task-accept` cycle. Think: a typo fix, a one-line bugfix, a single-copy change, or a small isolated rename. The goal is to keep the documentation trail intact without the ceremony of a spec file.

Read the task reference from `$ARGUMENTS`:
- A task ID from `minispec/TODO.md`
- A task ID with description
- An inline description of a tiny change

If no argument is provided, stop and ask the user what to fix.

New task IDs: scan `minispec/TODO.md`, `DONE.md`, active specs, and summaries/sync reports for real `T####`; use max+1, starting at `T0001`; never reuse moved IDs.

## Process (follow in order)

### Phase 1 — Read & Understand

1. Read `AGENTS.md` for project context and conventions.
2. Read `minispec/TODO.md` — locate the task, or decide where to add it if new.
3. Read `minispec/DONE.md` for completed task context and task ID allocation.
4. Scan `minispec/specs/` and `minispec/summaries/` for existing task IDs if this is an inline task.
5. Read `minispec/REQS.md` and `minispec/TECH.md` briefly — understand the current state relevant to the change.
6. Read the specific code files the change would touch.

### Phase 2 — Triviality Gate

`/mspc-task-quick` is only for changes that meet all of these:
- Touch at most 1-2 files, or a uniform mechanical set.
- Acceptance is obvious: there is one clearly correct outcome and no design choice.
- No new dependencies, no data model changes, no new components.
- No new behavior that needs a user-facing decision.
- Fits in a single focused session of roughly 30 minutes.

If the change does not meet all criteria, stop and tell the user:

> This change is not trivial enough for `/mspc-task-quick` — <specific reason>. Run `/mspc-task-new <task>` to create a proper spec instead.

Do not proceed. Do not try to shrink the task to fit.

### Phase 3 — Confirm Scope

If the change is genuinely trivial, present a one-paragraph summary of:
- What will change
- Which files
- How success will be verified

Ask the user to confirm before editing. One round of confirmation only.

### Phase 4 — Implement & Verify

1. Apply the edits.
2. Run relevant tests and any project linter, formatter, or build check.
3. Confirm the outcome matches what was agreed in Phase 3.

If verification fails or the change turns out to be larger than it looked, stop, report exact changed files, and ask whether to keep this command's edits, revert only those edits, or promote the work to `/mspc-task-new`. Do not patch over a problem that grew beyond the triviality gate.

### Phase 5 — Update Living Docs (minimal)

Only update what actually changed:
- `minispec/REQS.md` — only if user-visible behavior changed
- `minispec/TECH.md` — only if technical surface changed
- `minispec/TESTS.md` — only if a new automated or manual test was added
- `minispec/LESSONS.md` — only if the work surfaced a non-obvious insight; confirm with the user before adding

The default for a trivial change is no doc updates beyond `minispec/DONE.md`.

### Phase 6 — Archive

If the task had a TODO ID, remove it from `minispec/TODO.md` and add to `minispec/DONE.md`:

```markdown
## T0001 — <description>

- **Completed**: <YYYY-MM-DD>
- **Via**: /mspc-task-quick (no spec)
- **Summary**: <one-sentence outcome>
- **Files**: <files touched>
```

If the task was inline (no ID), assign the next zero-padded task ID using the task ID rule above, add the DONE entry above, and do not add it to `minispec/TODO.md` first.

### Phase 7 — Summary

Present:
- What was changed (files + short description)
- Verification results (what was checked, outcome)
- Which living docs were updated, or explicitly say no living doc updates were needed
- `minispec/DONE.md` entry added
- Any note if a lesson was captured

## Rules

- Enforce the triviality gate.
- One confirmation, minimum doc updates, no scope creep.
- Never skip verification.
