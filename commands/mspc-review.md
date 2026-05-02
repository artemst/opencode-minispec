---
description: Review code, tests, docs, and specs for bugs, risks, gaps, and actionable issues
agent: plan
---

# Minispec Review

You are conducting a risk-focused project review. The goal is to surface bugs, behavioral risks, security issues, quality problems, missing tests, stale assumptions, and actionable gaps that should be fixed or planned.

This is not the main documentation synchronization command. If the main issue is that minispec docs are stale or incomplete, report that and suggest `/mspc-sync`. Do not rewrite docs during review.

This is read-only except for one explicit exception: Phase 4 may write new task entries to `minispec/TODO.md`, but only for findings the user explicitly selects.

## Process (follow in order)

### Phase 1 - Read Context

Read enough project context to review accurately:

1. Read `AGENTS.md` if present.
2. Read `minispec/CONCEPT.md`.
3. Read `minispec/REQS.md`.
4. Read `minispec/TECH.md`.
5. Read `minispec/TODO.md`.
6. Read `minispec/DONE.md`.
7. Read `minispec/TESTS.md`.
8. Read `minispec/LESSONS.md` if present.
9. Read all active specs in `minispec/specs/`.
10. Read recent exploration and sync summaries in `minispec/summaries/` when relevant.
11. Read project code outside `minispec/`, identifying source locations from the actual layout.
12. Identify and read test files from the actual layout.
13. Read build, lint, package, and CI configs if present.

### Phase 2 - Review for Findings

Prioritize actionable problems over completeness.

Bug and behavior risks:
- Incorrect behavior relative to `minispec/REQS.md`, specs, README/docs, tests, or obvious user expectations.
- Edge cases that appear unhandled.
- Broken flows, inconsistent state, swallowed errors, data loss risks, or race conditions.
- Incomplete implementation of active specs.

Security, privacy, and safety:
- Secret handling problems, unsafe input handling, injection risks, insecure defaults, excessive permissions, privacy leaks.

Code quality and maintainability:
- Dead code, excessive duplication, unclear ownership, naming drift, brittle abstractions, hidden coupling, dependency risks.
- Stray `TODO` / `FIXME` / `HACK` comments that should become tracked tasks.

Test coverage:
- Critical paths without automated tests or clear manual checks.
- Documented behavior that lacks test coverage.
- Tests that are stale, misleading, too broad to catch regressions, or not reproducible.

Docs/spec risk:
- Docs or active specs that cause wrong implementation decisions.
- Major doc/code drift that blocks planning or verification.
- If the main fix is documentation reconciliation, suggest `/mspc-sync` instead of drafting doc edits here.

### Phase 3 - Report

Present findings first, ordered by severity. Every finding gets a flat, unique number (`F1`, `F2`, `F3`, ...) that runs across all sections in the order they appear.

```markdown
## Review Results

### Critical Issues

- **F1** - <what is wrong>. _Where:_ <file + section/line>. _Impact:_ <why it matters>. _Fix:_ <suggestion>. _Priority:_ high

### Bugs / Behavior Risks

- **F2** - ...

### Security / Privacy

### Code Quality

### Testing Gaps

### Docs / Spec Risks

### Suggestions
```

For each finding:
- Assign the next `F<N>` identifier.
- State what is wrong.
- State where it is.
- State the impact.
- Suggest a fix or next step.
- Rate priority: high, medium, or low.

If no findings are discovered, state that explicitly and list any residual risks from incomplete source coverage.

### Phase 4 - Triage to `minispec/TODO.md`

After the report, offer to add selected findings to `minispec/TODO.md` as new tasks. Prompt the user:

> Which findings should become TODO items? Reply with a list of Fs (for example `F1, F3, F7`), or `all high`, or `none`.

Before writing, for each selected finding:
- Check whether a matching task already exists in `minispec/TODO.md`.
- Decide the TODO category.
- Assign the next task ID by scanning `minispec/TODO.md`, `minispec/DONE.md`, active spec filenames and contents in `minispec/specs/`, and exploration summaries plus sync reports in `minispec/summaries/`; use one greater than the highest real `T####` found.

Write additions to `minispec/TODO.md` under the appropriate section:

```markdown
- [ ] **T0001** - <finding description, rewritten as a task> [S/M/L]
  _From /mspc-review F<N>: <short context>_
```

After writing, report:
- Which findings became which task IDs
- Which were skipped as duplicates
- Whether any selected findings could not be converted and why

### Phase 5 - Summary

Present:
- Total findings by category and priority
- Top 3 most important things to address
- TODO items added in Phase 4, or explicitly say none were added
- Whether `/mspc-sync` is recommended for doc reconciliation
- Overall project health assessment in one paragraph
- Suggested next steps - which of the new TODO items to tackle first

## Rules to always apply

- Findings first. Keep overview secondary.
- Be evidence-based and cite locations.
- Do not fix things.
- Do not synchronize docs; suggest `/mspc-sync` when doc reconciliation is the main need.
- Prioritize actionable risks and gaps.
- Respect the project's conventions.
