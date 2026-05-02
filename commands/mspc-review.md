---
description: Audit minispec docs, code, and tests for inconsistencies, gaps, and improvements
agent: plan
---

# Minispec Review

You are conducting a comprehensive review of the project's current state. The goal is to surface inconsistencies, missing information, obsolete content, code issues, and testing gaps, then present actionable findings to the user.

This is a read-only audit of code and existing docs. You identify and report issues; you do not fix them. The one exception: Phase 4 may write new task entries to `docs/TODO.md`, but only for findings the user explicitly selects.

## Process (follow in order)

### Phase 1 — Read Everything

1. Read `AGENTS.md`.
2. Read `docs/CONCEPT.md`.
3. Read `docs/REQS.md`.
4. Read `docs/TECH.md`.
5. Read `docs/TODO.md`.
6. Read `docs/DONE.md`.
7. Read `docs/TESTS.md`.
8. Read `docs/LESSONS.md` if present.
9. Read all active specs in `docs/specs/`.
10. Read all exploration summaries in `docs/explorations/`.
11. Read the codebase in `impl/`.
12. Identify and read any test files.

### Phase 2 — Cross-Reference Audit

Check for consistency across all project artifacts.

Docs vs docs:
- `REQS.md`, `TECH.md`, `TESTS.md`, `CONCEPT.md`, and `AGENTS.md` do not contradict each other.
- `CONCEPT.md` planned features align with `TODO.md` backlog.
- `TODO.md` and `DONE.md` reflect task state consistently.
- Active specs reference valid `TODO.md` tasks and do not drift from living docs.

Docs vs code:
- `REQS.md` requirements are actually implemented in code.
- `TECH.md` matches the actual codebase.
- `TESTS.md` entries correspond to real automated tests or reproducible manual checks.
- No meaningful implemented behavior is undocumented, and no documented behavior is phantom.

Code quality:
- No obvious security issues, dead code, excessive duplication, naming drift, swallowed errors, or stray `TODO` / `FIXME` / `HACK` comments that belong in `TODO.md`.

Test coverage:
- Critical paths have automated coverage.
- Implemented behavior in `REQS.md` is covered by automated tests or explicit manual checks.
- Edge cases from active specs and living docs are covered appropriately.
- Manual test instructions in `TESTS.md` are current and reproducible.

### Phase 3 — Report

Present findings organized by severity and category. Every finding gets a flat, unique number (`F1`, `F2`, `F3`, ...) that runs across all sections in the order they appear.

```markdown
## Review Results

### Critical Issues

- **F1** — <what is wrong>. _Where:_ <file + section/line>. _Fix:_ <suggestion>. _Priority:_ high

### Inconsistencies

- **F2** — ...

### Missing Information

### Obsolete Content

### Code Improvements

### Testing Gaps

### Suggestions
```

For each finding:
- Assign the next `F<N>` identifier.
- State what is wrong.
- State where it is.
- Suggest a fix or next step.
- Rate priority: high, medium, or low.

### Phase 4 — Triage to `TODO.md`

After the report, offer to add selected findings to `docs/TODO.md` as new tasks. Prompt the user:

> Which findings should become TODO items? Reply with a list of Fs (for example `F1, F3, F7`), or `all high`, or `none`.

Before writing, for each selected finding:
- Check whether a matching task already exists in `TODO.md`.
- Decide the TODO category.
- Assign the next task ID by scanning `docs/TODO.md`, `docs/DONE.md`, active spec filenames and contents in `docs/specs/`, and exploration summaries in `docs/explorations/`; use one greater than the highest real `T####` found.

Write additions to `docs/TODO.md` under the appropriate section:

```markdown
- [ ] **T0001** — <finding description, rewritten as a task> [S/M/L]
  _From /mspc-review F<N>: <short context>_
```

After writing, report:
- Which findings became which task IDs
- Which were skipped as duplicates
- Whether any selected findings could not be converted and why

### Phase 5 — Summary

Present:
- Total findings by category and priority
- Top 3 most important things to address
- TODO items added in Phase 4, or explicitly say none were added
- Overall project health assessment in one paragraph
- Suggested next steps — which of the new TODO items to tackle first

## Rules to always apply

- Be thorough but practical.
- Be evidence-based.
- Read before judging.
- Do not fix things.
- Prioritize actionable findings.
- Respect the project's conventions.
