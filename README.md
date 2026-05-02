# opencode-minispec

> Under active development. Commands, document formats, and workflow details may still change.

`opencode-minispec` is an OpenCode plugin for agentic AI software development in a document-driven way.

Instead of keeping project state in the model's context window, minispec stores it in files: vision, implemented requirements, technical reality, backlog, completed tasks, task specs, summaries, and lessons.
Each task is specified, implemented, verified, and then distilled back into the living docs. The next session starts from files, not model memory.

## Installation

Add the plugin package to your OpenCode config:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["opencode-minispec"]
}
```

Restart OpenCode after updating `opencode.json`.

OpenCode custom commands use a flat namespace, so minispec prefixes every command with `mspc-` to avoid collisions with built-ins like `/init`.

## Workflow

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
    +---------------------------------------+
                    repeat

/mspc-task-quick       One-shot trivial change (no spec)
/mspc-review           Read-only quality review; recommends add/fix/ignore follow-up
```

### Phases

1. **Bootstrap** - run `/mspc-init` once to create missing minispec files and add or merge root `AGENTS.md` without overwriting user guidance. For a new project, pass an idea or idea file to seed `CONCEPT.md` and `TODO.md`.
2. **Sync** - after `/mspc-init`, run `/mspc-sync` for existing repositories so minispec can derive docs from current code, tests, configs, README/docs, and existing minispec files. For a newly created project with no existing implementation, this step is unnecessary. Later, `/mspc-sync` is optional and repeatable whenever docs may have drifted.
3. **Explore** - run `/mspc-explore` when an idea, open question, tradeoff, or direction needs discussion before it becomes implementation work. It saves the outcome in `minispec/summaries/` and updates project docs when decisions change them.
4. **Implement** - pick a `T####` item from `minispec/TODO.md`, then run `/mspc-task-new T0001`, `/mspc-task-impl T0001`, and `/mspc-task-accept T0001`. The spec is temporary: it is created in `minispec/specs/`, used for implementation, distilled into living docs, archived in `DONE.md`, and deleted.
5. **Review** - run `/mspc-review` periodically to find bugs, risks, missing tests, stale assumptions, and actionable quality issues. It is read-only; switch to build mode to add selected findings to TODO or fix them. If the main problem is documentation drift, run `/mspc-sync` instead.

`minispec/TODO.md` is the working backlog. It can be seeded by `/mspc-init`, reconciled by `/mspc-sync`, expanded by `/mspc-explore`, populated from selected review findings after `/mspc-review`, or appended by `/mspc-task-new <description>`. You can also edit it directly when that is simpler.

### Command Responsibilities

| Command | Reads | Writes | Main Goal |
|---|---|---|---|
| `/mspc-init` | User idea if provided; existing workspace enough to avoid overwrites | Missing minispec files; created or merged `AGENTS.md` | Add minispec to the project |
| `/mspc-sync` | Code, tests, configs, README/docs, minispec docs | `CONCEPT.md`, `REQS.md`, `TECH.md`, `TESTS.md`, `TODO.md`, sync report | Reconcile docs with current reality |
| `/mspc-explore` | Minispec docs, prior summaries, relevant project context | Exploration summary, `CONCEPT.md`, `TODO.md` | Understand or decide before planning work |
| `/mspc-task-new` | `TODO.md`, living docs, relevant code/docs | Temporary spec in `minispec/specs/`, maybe new TODO entry | Define exactly what one task should implement |
| `/mspc-task-impl` | Task spec, living docs, relevant code/tests | Code, tests, implementation updates | Satisfy the task spec |
| `/mspc-task-accept` | Completed spec, implementation, verification results | `REQS.md`, `TECH.md`, `TESTS.md`, `DONE.md`, `TODO.md`, maybe `CONCEPT.md`/`LESSONS.md`; deletes spec | Distill completed work into durable project knowledge |
| `/mspc-task-quick` | Current docs/code around a trivial change | Code/docs plus living-doc updates if needed; `DONE.md` | Complete a tiny safe change without a spec |
| `/mspc-review` | Code, tests, docs, active specs | Nothing; read-only triage recommendations | Find bugs, risks, missing tests, and actionable issues |

## Commands

### `/mspc-init`

Safely adds minispec structure and workflow guidance.

```text
/mspc-init
/mspc-init I want to build a CLI tool that converts CSV files to JSON with streaming support
/mspc-init path/to/idea-file.md
```

For a greenfield project, it can seed `CONCEPT.md` and `TODO.md` from an inline idea or markdown file. For an existing project, it creates only missing files, preserves existing minispec docs, and merges root `AGENTS.md` through a managed minispec section instead of overwriting existing guidance.

After init in an existing project, run `/mspc-sync` to derive docs from current code, tests, configs, README/docs, and existing project docs. For a newly created project, skip sync until there is implementation or external documentation to reconcile.

### `/mspc-sync`

Synchronizes minispec docs with current project reality.

```text
/mspc-sync
/mspc-sync focus on API and test coverage
/mspc-sync docs-only
```

Run it immediately after `/mspc-init` when adopting minispec into an existing repo. For brand-new projects it is unnecessary until there is code or external documentation to reconcile. After adoption, use it optionally after large manual changes, before planning new work, or whenever docs may have drifted.

Source-of-truth rules:
- Code, tests, configs, and build metadata define implemented technical reality.
- README/docs define documented intent, public promises, usage, and planned direction.
- `CONCEPT.md` may include planned or future direction.
- `REQS.md`, `TECH.md`, and `TESTS.md` must describe implemented or directly verifiable reality only.
- Uncertain claims become open questions or TODO items, not silent guesses.

The command also writes a sync report to `minispec/summaries/`.

### `/mspc-explore`

Explores ideas, open questions, tradeoffs, or new directions at any phase.

```text
/mspc-explore [topic or question]
```

The session produces an exploration summary in `minispec/summaries/`, updates `CONCEPT.md` if the vision changed, and adds TODO items if actionable work emerged. Outside `/mspc-explore`, normal discussion stays conversational by default; this command is the explicit path for durable exploration artifacts.

### `/mspc-task-new`

Creates or updates a task specification.

```text
/mspc-task-new T0001
/mspc-task-new T0001 add user authentication with OAuth
/mspc-task-new add dark mode support
```

Pass a task ID from `minispec/TODO.md` or a new description. Development tasks produce `minispec/specs/SPEC-T0001.md` using zero-padded IDs (`T0001`, `T0002`, ...). Open questions and exploration items are routed to `/mspc-explore` instead.

If you pass a new description, minispec checks for duplicates, assigns the next task ID, confirms the right `TODO.md` section, and adds the item before writing the spec. If the work is truly trivial, use `/mspc-task-quick` instead.

### `/mspc-task-impl`

Implements a task from its written spec.

```text
/mspc-task-impl T0001
```

The command reads `minispec/specs/SPEC-T0001.md`, plans the implementation, writes code and tests, verifies each acceptance criterion, runs relevant test/build/lint/format checks, and reports anything that still needs manual verification. If no spec exists, run `/mspc-task-new T0001` first.

The spec is the source of truth. If implementation reveals ambiguity or requires a scope change, the spec should be updated before continuing.

### `/mspc-task-accept`

Accepts completed work and distills it into living docs.

```text
/mspc-task-accept T0001
```

Run this after you have tested the implementation yourself. It updates `REQS.md` with implemented behavior, `TECH.md` with actual technical details, `TESTS.md` with automated and manual checks, `DONE.md` with an archive entry, and `TODO.md` by removing the completed task. It may update `CONCEPT.md` if the implementation changed the vision, and may add to `LESSONS.md` only when a durable non-obvious lesson emerged and the user confirms it.

After distillation, it deletes the temporary spec file.

### `/mspc-task-quick`

Handles a tiny safe change without creating a spec.

```text
/mspc-task-quick T0014
/mspc-task-quick fix typo in README
```

This is the only intentional no-spec path. Use it for one-line bugfixes, copy tweaks, isolated renames, or similarly obvious work. The change should touch at most 1-2 files or a uniform mechanical set, require no design decision, add no dependency or data model change, and fit in a short focused session.

If the work is larger or unclear, the command refuses and redirects to `/mspc-task-new`. Even quick tasks are verified and archived in `DONE.md`; living docs are updated only when the change actually affects them.

### `/mspc-review`

Reviews the project for bugs, behavior risks, security issues, quality problems, missing tests, and actionable gaps.

```text
/mspc-review
```

The command reads docs, code, tests, configs, and active specs, then reports findings by severity with flat `F<N>` identifiers. It is read-only and recommends what to add to TODO, fix now, or ignore/defer. Switch to build mode to act on selected findings. If documentation drift is the main issue, use `/mspc-sync`.

## Project Files

minispec owns the generated `minispec/` directory. Root `AGENTS.md` is user-owned: minispec creates it when absent, or adds/updates a managed minispec section when it already exists. Source code, tests, docs, and all other project files remain user-owned.

```text
AGENTS.md                   Project guidance for OpenCode
minispec/
  CONCEPT.md                Vision and north star; may describe future features
  REQS.md                   Implemented requirements only
  TECH.md                   Actual technical architecture only
  TESTS.md                  Test registry: automated and manual
  TODO.md                   Backlog with task IDs (T0001, T0002, ...)
  DONE.md                   Completed task archive
  LESSONS.md                Non-obvious insights: abandoned approaches, reversals, gotchas
  specs/                    Temporary per-task specifications
  summaries/                Exploration summaries and sync reports
```
