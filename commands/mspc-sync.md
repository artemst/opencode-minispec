---
description: Reconcile minispec docs with current code, tests, configs, and project docs
agent: build
---

# Minispec Sync

You are synchronizing minispec documentation with the current repository reality. This command is repeatable: use it when adopting minispec into an existing project, after large manual changes, before planning new work, or whenever docs may have drifted.

The goal is doc reconciliation, not feature implementation and not a risk-focused code review. Update living docs so they accurately reflect what exists, what is claimed by project docs, and what remains uncertain.

## Interaction rules

When user input is needed, prefer the `question` tool when it fits; otherwise ask a numbered list with one question per item.

Read `$ARGUMENTS` as an optional sync focus, for example:
- `docs-only`
- `focus on API and tests`
- `sync after auth refactor`

If no argument is provided, perform a general sync.

## Source-of-truth rules

- Code, tests, configs, and build metadata define implemented technical reality.
- Existing README/docs define documented intent, public promises, usage, and planned direction.
- `minispec/CONCEPT.md` may contain planned or future work.
- `minispec/REQS.md`, `minispec/TECH.md`, and `minispec/TESTS.md` must describe implemented or directly verifiable reality only.
- Uncertain, conflicting, or unverified claims become open questions or TODO items. Do not silently guess.
- Do not reconstruct historical completed tasks into `minispec/DONE.md` during adoption or sync.
- Do not add lessons to `minispec/LESSONS.md` unless the user explicitly confirms a durable, non-obvious lesson.

## Process (follow in order)

### Phase 1 - Preconditions

1. Check whether `minispec/` exists.
2. If it does not exist, stop and tell the user to run `/mspc-init` first. Do not create minispec from sync.
3. Check for required docs: `CONCEPT.md`, `REQS.md`, `TECH.md`, `TESTS.md`, `TODO.md`, `DONE.md`, and `LESSONS.md`.
4. If some required docs are missing, create only the missing shells using the current minispec formats. Preserve existing files.

### Phase 2 - Read Current State

Read broadly enough to understand the repository and the current docs.

Minispec docs:
1. `AGENTS.md` if present
2. `minispec/CONCEPT.md`
3. `minispec/REQS.md`
4. `minispec/TECH.md`
5. `minispec/TESTS.md`
6. `minispec/TODO.md`
7. `minispec/DONE.md`
8. `minispec/LESSONS.md` if present
9. Active specs in `minispec/specs/`
10. Prior summaries in `minispec/summaries/`

Project artifacts outside `minispec/`:
- README files and docs directories
- package/build/dependency configs
- source code, following the actual project layout
- test files and test fixtures
- CI/workflow files if present
- examples, scripts, CLI entrypoints, API route definitions, schemas, migrations, or other domain-specific sources of truth

Respect ignore files and avoid generated/vendor/build output unless it is the only available source for runtime behavior.

### Phase 3 - Build a Sync Model

Create an internal model before editing:

1. **Documented intent** - project purpose, users, public promises, planned direction, roadmap claims.
2. **Implemented behavior** - user-visible behavior that can be observed in code, tests, examples, or public API.
3. **Technical reality** - stack, runtime, architecture, modules, data model, integrations, configs, commands, deployment assumptions.
4. **Test reality** - automated tests, manual testable behavior, missing or stale test documentation.
5. **Drift and conflicts** - documented-but-not-implemented claims, implemented-but-undocumented behavior, stale technical docs, TODOs that appear completed, active specs that conflict with code, unclear ownership.

Do not treat every code smell as a sync issue. Bugs, risks, security concerns, and broad quality issues belong primarily to `/mspc-review`, unless they directly affect doc accuracy.

### Phase 4 - Reconcile Living Docs

Update docs in place so each remains coherent, not a patchwork of sync notes.

#### `minispec/CONCEPT.md`

Update vision-level content from README/docs, existing CONCEPT content, and explicit user-provided sync focus.

Allowed:
- product summary and motivation
- planned or future features explicitly documented
- key product/technical decisions that define direction
- references to public docs or prior art
- open questions about intent

Do not move implementation-only details here unless they affect the concept.

#### `minispec/REQS.md`

Update implemented requirements from observed behavior.

Allowed:
- functional behavior currently implemented
- non-functional behavior supported by code/config/tests
- edge case behavior that exists now
- glossary terms needed to understand implemented behavior

Remove or rewrite stale requirements that no longer match implementation. If removal is uncertain, leave a clearly marked open question or TODO instead of pretending it is true.

#### `minispec/TECH.md`

Update actual technical details from code, configs, and tests.

Allowed:
- technology stack and runtime
- project structure
- components and boundaries
- data model and schemas
- integration points
- build/test/dev commands
- implemented technical decisions

Do not document aspirational architecture here.

#### `minispec/TESTS.md`

Update test registry from actual tests and reproducible manual checks.

Allowed:
- automated test suites and what they verify
- manual checks for implemented behavior
- known gaps when tied to documented requirements

Do not claim coverage that does not exist.

#### `minispec/TODO.md`

Add only actionable sync findings:
- documentation conflicts requiring a decision
- implemented behavior missing tests when tied to documented requirements
- documented claims not implemented
- stale TODO items that need user confirmation before removal
- follow-up work needed to make docs and code consistent

When assigning new task IDs, scan all existing task-bearing artifacts first:
- `minispec/TODO.md`
- `minispec/DONE.md`
- active spec filenames and contents in `minispec/specs/`
- exploration summaries and sync reports in `minispec/summaries/`

Assign one greater than the highest real `T####` found. If no real task IDs exist, start at `T0001`. Do not reuse IDs after tasks have moved to `DONE.md`.

Do not flood TODO with every minor observation. Prefer concise, actionable entries.

### Phase 5 - Write Sync Report

Create a report in `minispec/summaries/<YYYY-MM-DD>-sync.md` or, if `$ARGUMENTS` gives a useful focus, `minispec/summaries/<YYYY-MM-DD>-sync-<topic-slug>.md`.

If a same-day report with the same name exists, update it rather than creating duplicates unless the new sync is clearly separate.

Use this format:

```markdown
---
title: "Sync - <topic or General>"
created: "<YYYY-MM-DD>"
type: sync
---

# Sync - <topic or General>

## Scope

<General sync or focused area.>

## Sources Read

- <key docs/code/tests/configs read>

## Changes Made

- <docs updated and why>

## Reality Summary

- <implemented behavior and technical reality summarized briefly>

## Drift / Conflicts

- <conflicts found, or `_None found._`>

## TODO Items Added

- <T#### items added, or `_None._`>

## Open Questions

- <questions left unresolved, or `_None._`>
```

### Phase 6 - Summary

Present:
- Sync scope and source coverage.
- Docs updated.
- Key reality changes captured.
- Drift/conflicts found.
- TODO items added, with task IDs.
- Open questions that need user input.
- Suggested next step:
  - `/mspc-task-new T0001` if actionable work is ready.
  - `/mspc-explore <topic>` if an unresolved question needs discussion.
  - `/mspc-review` if sync revealed broader risk, code quality, or testing concerns.

## Rules to always apply

- Accuracy over completeness. It is better to leave an open question than invent certainty.
- Reality docs stay reality-only.
- Preserve user-owned docs and existing wording where it remains accurate.
- Prefer updating existing sections over appending parallel sections.
- Keep the sync report concise but traceable.
- Do not implement code changes during sync.
