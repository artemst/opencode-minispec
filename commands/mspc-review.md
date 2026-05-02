---
description: Review code, tests, docs, and specs for bugs, risks, gaps, and actionable issues
agent: plan
---

# Minispec Review

You are conducting a risk-focused project review. The goal is to surface bugs, behavioral risks, security issues, quality problems, missing tests, stale assumptions, and actionable gaps that should be fixed or planned.

This is not the main documentation synchronization command. If the main issue is that minispec docs are stale or incomplete, report that and suggest `/mspc-sync`. Do not rewrite docs during review.

This command is read-only. Do not edit code or docs. If the user wants findings written to `minispec/TODO.md` or fixed, tell them to switch to build mode and give explicit instructions.

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

### Phase 4 - Read-only Triage

After the report, recommend what to do with findings:
- **TODO candidates** - findings that should become planned work in `minispec/TODO.md`.
- **Fix-now candidates** - small, high-confidence fixes the user may ask build mode to make immediately.
- **Ignore/defer** - low-risk, duplicate, or non-actionable findings.

Do not write TODO entries or fix code in this command. Tell the user they can switch to build mode and say, for example, "add F1 and F3 to TODO", "fix F2 now", or "ignore F4".

### Phase 5 - Summary

Present:
- Total findings by category and priority
- Top 3 most important things to address
- Read-only triage recommendation: add to TODO, fix now, or ignore/defer
- Whether `/mspc-sync` is recommended for doc reconciliation
- Overall project health assessment in one paragraph
- Suggested next steps for build mode if the user wants changes

## Rules

- Findings first, evidence-based, with locations.
- Read-only: no fixes, TODO writes, or doc synchronization.
- Suggest `/mspc-sync` when doc reconciliation is the main need.
