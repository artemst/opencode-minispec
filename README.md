# opencode-minispec

[Русская версия](README.ru.md)

> Under active development. Commands, document formats, and workflow details may still change.

`opencode-minispec` is an OpenCode plugin for running a document-driven software development workflow across many sessions.

Rather than holding project state in the context window or a plan-mode document, minispec keeps it in files: concept, requirements, technical details, backlog, completed tasks, specs, explorations, sync reports, and lessons.
Each task is specified in writing, implemented from that spec, and distilled back into the living docs when accepted.
The next session starts from the files, not from memory.

## Installation

Add the plugin package to your OpenCode config:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["opencode-minispec"]
}
```

Restart OpenCode after updating `opencode.json`.

OpenCode custom commands live in a flat namespace, so minispec prefixes every command with `mspc-` to avoid collisions with built-ins like `/init`.

## Workflow

minispec follows an iterative cycle:

```text
/mspc-init              Safely add minispec to the project
    |
/mspc-sync              Sync docs with current code/docs (repeat anytime)
    |
/mspc-explore           Explore decisions and open questions (repeat anytime)
    |
    v
/mspc-task-new  ->  /mspc-task-impl  ->  /mspc-task-accept
      (spec)            (implement)          (distill & archive)
    ^                                       |
    └───────────────────────────────────────┘
                    repeat

/mspc-task-quick       One-shot trivial change (no spec)
/mspc-review           Health/risk review; can add selected findings to TODO
```

### Command Responsibilities

| Command | Reads | Writes | Main Goal |
|---|---|---|---|
| `/mspc-init` | User idea if provided; existing workspace enough to avoid overwrites | Missing minispec files; created or merged `AGENTS.md` | Add minispec safely |
| `/mspc-sync` | Code, tests, configs, README/docs, minispec docs | `CONCEPT.md`, `REQS.md`, `TECH.md`, `TESTS.md`, `TODO.md`, sync report | Reconcile docs with current reality |
| `/mspc-explore` | Minispec docs, prior explorations, relevant project context | Exploration summary, `CONCEPT.md`, `TODO.md` | Understand or decide before planning work |
| `/mspc-task-new` | `TODO.md`, living docs, relevant code/docs | Temporary spec in `minispec/specs/`, maybe new TODO entry | Define exactly what one task should implement |
| `/mspc-task-impl` | Task spec, living docs, relevant code/tests | Code, tests, implementation updates | Satisfy the accepted spec |
| `/mspc-task-accept` | Completed spec, implementation, verification results | `REQS.md`, `TECH.md`, `TESTS.md`, `DONE.md`, `TODO.md`, maybe `CONCEPT.md`/`LESSONS.md`; deletes spec | Distill completed work into durable project knowledge |
| `/mspc-task-quick` | Current docs/code around a trivial change | Code/docs plus living-doc updates if needed; `DONE.md` | Complete a tiny safe change without a spec |
| `/mspc-review` | Code, tests, docs, active specs | Usually nothing; selected findings may become TODO tasks | Find bugs, risks, missing tests, and actionable issues |

**Phase 1 - Bootstrap.** Run `/mspc-init` to add minispec safely. For a new project, pass an idea or idea file so it can seed `CONCEPT.md` and `TODO.md`. For an existing project, it creates missing structure and merges `AGENTS.md` without overwriting existing guidance.

**Phase 2 - Sync.** Run `/mspc-sync` to reconcile minispec docs with current code, tests, configs, README/docs, and existing minispec docs. This is repeatable and useful for adopting existing projects, after refactors, before planning, or whenever docs drift.

**Phase 3 - Explore.** Use `/mspc-explore` anytime to explore ideas, open questions, tradeoffs, or new directions. It saves a summary to `minispec/explorations/` and updates project docs when the exploration changes them.

`minispec/TODO.md` is the working backlog. It can grow in five ways:
- `/mspc-init` can seed initial items from a greenfield idea
- `/mspc-sync` adds tasks or questions when code/docs drift needs action
- `/mspc-explore` adds tasks, questions, or exploration items when actionable work emerges
- `/mspc-review` can promote selected findings into `minispec/TODO.md`
- `/mspc-task-new <description>` can create a new task entry before writing its spec

Because the backlog is file-based, you can also edit `minispec/TODO.md` directly when that is simpler.

**Phase 4 - Implement.** Once a backlog item is ready, pick its task ID from `minispec/TODO.md` and run:
1. `/mspc-task-new T0001` - writes a detailed spec in `minispec/specs/`
2. `/mspc-task-impl T0001` - implements the spec, runs tests, verifies acceptance criteria
3. `/mspc-task-accept T0001` - distills the spec into `minispec/REQS.md`, `minispec/TECH.md`, `minispec/TESTS.md`, archives the task, and removes the spec

**Phase 5 - Review.** Run `/mspc-review` periodically to find bugs, risks, missing tests, stale assumptions, and actionable quality issues. If the main problem is documentation drift, run `/mspc-sync`.

### Project Structure Created By Minispec

minispec owns the generated `minispec/` directory. Root `AGENTS.md` is user-owned: minispec creates it when absent, or adds/updates a managed minispec section when it already exists. Source code, tests, docs, and all other project files remain user-owned.

```text
AGENTS.md                   Project guidance for OpenCode
minispec/
  CONCEPT.md                Vision & north star (may describe future features)
  REQS.md                   Implemented requirements only
  TECH.md                   Actual technical architecture only
  TESTS.md                  Test registry (automated + manual)
  TODO.md                   Backlog with task IDs (T0001, T0002, ...)
  DONE.md                   Completed task archive
  LESSONS.md                Non-obvious insights: abandoned approaches, reversals, gotchas
  specs/                    Temporary per-task specifications
  explorations/             Exploration summaries and sync reports
```

## Commands

### `/mspc-init`

Safely add minispec structure and workflow guidance to a project.

| Reads | Writes | Main Goal |
|---|---|---|
| User idea if provided; existing workspace enough to avoid overwrites | Missing minispec files; created or merged `AGENTS.md` | Add minispec safely |

```text
/mspc-init
/mspc-init I want to build a CLI tool that converts CSV files to JSON with streaming support
/mspc-init path/to/idea-file.md
```

For a new project, this command can seed `CONCEPT.md` and `TODO.md` from the idea. For an existing project, it creates only missing files, preserves existing minispec docs, and merges root `AGENTS.md` through a managed minispec section instead of overwriting existing guidance.

After init in an existing project, run `/mspc-sync` to derive docs from current code, tests, configs, README/docs, and existing project docs.

### `/mspc-sync`

Synchronize minispec docs with current project reality.

| Reads | Writes | Main Goal |
|---|---|---|
| Code, tests, configs, README/docs, minispec docs | `CONCEPT.md`, `REQS.md`, `TECH.md`, `TESTS.md`, `TODO.md`, sync report | Reconcile docs with current reality |

```text
/mspc-sync
/mspc-sync focus on API and test coverage
/mspc-sync docs-only
```

Use this command when adopting minispec into an existing repo, after large manual changes, before planning new work, or whenever docs may have drifted.

Source-of-truth policy:
- Code, tests, configs, and build metadata define implemented technical reality.
- README/docs define documented intent, public promises, usage, and planned direction.
- `CONCEPT.md` may include planned or future direction.
- `REQS.md`, `TECH.md`, and `TESTS.md` must describe implemented or directly verifiable reality only.
- Uncertain claims become open questions or TODO items, not silent guesses.

The command also writes a sync report to `minispec/explorations/`.

### `/mspc-explore`

Explore, investigate, and brainstorm at any project phase.

| Reads | Writes | Main Goal |
|---|---|---|
| Minispec docs, prior explorations, relevant project context | Exploration summary, `CONCEPT.md`, `TODO.md` | Understand or decide before planning work |

```text
/mspc-explore [topic or question]
```

The session produces:
- A summary file in `minispec/explorations/<date>-<topic>.md`
- Updates to `minispec/CONCEPT.md` if the vision changed
- New items in `minispec/TODO.md` if actionable work emerged

Outside `/mspc-explore`, the generated `AGENTS.md` still encourages structured discussions: numbered question batches, a quick reframe check, explicit assumptions and tradeoffs, and concise summaries. `/mspc-explore` remains the explicit path for durable artifacts and doc updates.

### `/mspc-task-new`

Bootstrap a task with a detailed specification.

| Reads | Writes | Main Goal |
|---|---|---|
| `TODO.md`, living docs, relevant code/docs | Temporary spec in `minispec/specs/`, maybe new TODO entry | Define exactly what one task should implement |

```text
/mspc-task-new T0001
/mspc-task-new T0001 add user authentication with OAuth
/mspc-task-new add dark mode support
```

Takes a task ID from `minispec/TODO.md` or a new description. Routes by task type:
- **Development task** - generates a spec at `minispec/specs/SPEC-T0001.md` using zero-padded task IDs (`T0001`, `T0002`, ...)
- **Open question / Exploration** - routes you to `/mspc-explore`

If you pass a new description instead of an existing task ID, minispec checks for duplicates, assigns the next task ID, confirms the right `minispec/TODO.md` section, and adds the item before continuing.

If the work is truly trivial, use `/mspc-task-quick` instead.

### `/mspc-task-impl`

Implement a task from its spec.

| Reads | Writes | Main Goal |
|---|---|---|
| Task spec, living docs, relevant code/tests | Code, tests, implementation updates | Satisfy the accepted spec |

```text
/mspc-task-impl T0001
```

Reads the spec and implements it:
1. Plans the implementation - files to create or modify, order of operations, tests needed, and any open ambiguities
2. Writes code following the spec strictly
3. Writes tests alongside the code
4. Verifies every acceptance criterion - runs tests, checks build, runs lint or format steps, and lists manual checks when needed
5. Reports verification results and lists any manual checks needed

If no spec exists for the task, it suggests running `/mspc-task-new` first.

### `/mspc-task-accept`

Accept a completed task and distill its spec into living docs.

| Reads | Writes | Main Goal |
|---|---|---|
| Completed spec, implementation, verification results | `REQS.md`, `TECH.md`, `TESTS.md`, `DONE.md`, `TODO.md`, maybe `CONCEPT.md`/`LESSONS.md`; deletes spec | Distill completed work into durable project knowledge |

```text
/mspc-task-accept T0001
```

Run this after you have tested the implementation yourself. The command:
1. Extracts requirements from the spec into `minispec/REQS.md`
2. Extracts technical details into `minispec/TECH.md`
3. Extracts test cases into `minispec/TESTS.md`
4. Archives the task in `minispec/DONE.md`
5. Removes the task from `minispec/TODO.md`
6. Updates `minispec/CONCEPT.md` if implementation changed the vision
7. Captures any durable insight in `minispec/LESSONS.md` when one actually emerged and the user confirms it
8. Removes the spec file

### `/mspc-task-quick`

One-shot flow for trivial changes - no spec file.

| Reads | Writes | Main Goal |
|---|---|---|
| Current docs/code around a trivial change | Code/docs plus living-doc updates if needed; `DONE.md` | Complete a tiny safe change without a spec |

```text
/mspc-task-quick T0014
/mspc-task-quick fix typo in README
```

For changes too small to justify the full `/mspc-task-new -> /mspc-task-impl -> /mspc-task-accept` cycle: one-line bugfixes, copy tweaks, isolated renames. If the change touches multiple components, has unclear acceptance, or needs a design decision, it refuses and redirects to `/mspc-task-new`.

### `/mspc-review`

Review the project for bugs, risks, quality issues, missing tests, and actionable gaps.

| Reads | Writes | Main Goal |
|---|---|---|
| Code, tests, docs, active specs | Usually nothing; selected findings may become TODO tasks | Find bugs, risks, missing tests, and actionable issues |

```text
/mspc-review
```

Reads docs, code, tests, configs, and active specs, then reports findings by severity:
- **Bugs / behavior risks** - incorrect behavior, edge cases, broken flows, incomplete active specs
- **Security / privacy** - unsafe input handling, secrets, insecure defaults, privacy leaks
- **Code quality** - dead code, duplication, unclear ownership, brittle abstractions, stray tracked-work comments
- **Testing gaps** - missing, stale, misleading, or unreproducible tests
- **Docs / spec risks** - stale docs or specs that could cause wrong implementation decisions

Findings are reported by severity with flat `F<N>` identifiers. After the report, the command can promote selected findings into `minispec/TODO.md` as new tasks. If documentation drift is the main issue, run `/mspc-sync`.
