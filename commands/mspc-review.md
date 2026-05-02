---
description: Audit minispec docs, code, and tests for inconsistencies, gaps, and improvements
agent: plan
---

# Minispec Review

You are conducting a comprehensive review of the project's current state. The goal is to surface inconsistencies, missing information, obsolete content, code issues, and testing gaps, then present actionable findings to the user.

This is a read-only audit of code and existing docs. You identify and report issues; you do not fix them. The one exception: Phase 4 may write new task entries to `minispec/TODO.md`, but only for findings the user explicitly selects.

## Process (follow in order)

### Phase 1 — Read Everything

1. Read `AGENTS.md`.
2. Read `minispec/CONCEPT.md`.
3. Read `minispec/REQS.md`.
4. Read `minispec/TECH.md`.
5. Read `minispec/TODO.md`.
6. Read `minispec/DONE.md`.
7. Read `minispec/TESTS.md`.
8. Read `minispec/LESSONS.md` if present.
9. Read all active specs in `minispec/specs/`.
10. Read all exploration summaries in `minispec/explorations/`.
11. Read the project code outside `minispec/`, identifying source locations from the actual layout.
12. Identify and read any test files from the actual layout.

### Phase 2 — Cross-Reference Audit

Check for consistency across all project artifacts.

Docs vs docs:
- `minispec/REQS.md`, `minispec/TECH.md`, `minispec/TESTS.md`, `minispec/CONCEPT.md`, and `AGENTS.md` do not contradict each other.
- `minispec/CONCEPT.md` planned features align with `minispec/TODO.md` backlog.
- `minispec/TODO.md` and `minispec/DONE.md` reflect task state consistently.
- Active specs reference valid `minispec/TODO.md` tasks and do not drift from living docs.

Docs vs code:
- `minispec/REQS.md` requirements are actually implemented in code.
- `minispec/TECH.md` matches the actual codebase.
- `minispec/TESTS.md` entries correspond to real automated tests or reproducible manual checks.
- No meaningful implemented behavior is undocumented, and no documented behavior is phantom.

Code quality:
- No obvious security issues, dead code, excessive duplication, naming drift, swallowed errors, or stray `TODO` / `FIXME` / `HACK` comments that belong in `minispec/TODO.md`.

Test coverage:
- Critical paths have automated coverage.
- Implemented behavior in `minispec/REQS.md` is covered by automated tests or explicit manual checks.
- Edge cases from active specs and living docs are covered appropriately.
- Manual test instructions in `minispec/TESTS.md` are current and reproducible.

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

### Phase 4 — Triage to `minispec/TODO.md`

After the report, offer to add selected findings to `minispec/TODO.md` as new tasks. Prompt the user:

> Which findings should become TODO items? Reply with a list of Fs (for example `F1, F3, F7`), or `all high`, or `none`.

Before writing, for each selected finding:
- Check whether a matching task already exists in `minispec/TODO.md`.
- Decide the TODO category.
- Assign the next task ID by scanning `minispec/TODO.md`, `minispec/DONE.md`, active spec filenames and contents in `minispec/specs/`, and exploration summaries in `minispec/explorations/`; use one greater than the highest real `T####` found.

Write additions to `minispec/TODO.md` under the appropriate section:

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
