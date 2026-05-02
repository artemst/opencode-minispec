# opencode-minispec

[Русская версия](README.ru.md)

> Under active development. Commands, document formats, and workflow details may still change.

`opencode-minispec` is an OpenCode plugin for running a document-driven software development workflow across many sessions.

Rather than holding project state in the context window or a plan-mode document, minispec keeps it in files: concept, requirements, technical details, backlog, completed tasks, specs, and lessons.  
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
/mspc-init              Bootstrap the project
    |
/mspc-explore           Explore (use anytime)
    |
    v
/mspc-task-new  ->  /mspc-task-impl  ->  /mspc-task-accept
      (spec)            (implement)          (distill & archive)
    ^                                       |
    └───────────────────────────────────────┘
                    repeat

/mspc-task-quick       One-shot trivial change (no spec)
/mspc-review           Health check — can add findings to TODO
```

**Phase 1 — Bootstrap.** Run `/mspc-init` with an idea or idea file. It creates the minispec document structure, project guidance, core docs, and the first version of `minispec/TODO.md` from the idea.

**Phase 2 — Explore.** Use `/mspc-explore` anytime to explore ideas, open questions, tradeoffs, or new directions. It saves a summary to `minispec/explorations/` and updates project docs when the exploration changes them. In practice, this is the main way new backlog items are added or refined after bootstrap.

`minispec/TODO.md` is the working backlog. It can grow in four ways:
- `/mspc-init` seeds the initial items
- `/mspc-explore` adds tasks, questions, or exploration items when actionable work emerges
- `/mspc-review` can promote findings into `minispec/TODO.md`
- `/mspc-task-new <description>` can create a new task entry before writing its spec

Because the backlog is file-based, you can also edit `minispec/TODO.md` directly when that is simpler.

**Phase 3 — Implement.** Once a backlog item is ready, pick its task ID from `minispec/TODO.md` and run:
1. `/mspc-task-new T0001` — writes a detailed spec in `minispec/specs/`
2. `/mspc-task-impl T0001` — implements the spec, runs tests, verifies acceptance criteria
3. `/mspc-task-accept T0001` — distills the spec into `minispec/REQS.md`, `minispec/TECH.md`, `minispec/TESTS.md`, archives the task, and removes the spec

**Phase 4 — Review.** Run `/mspc-review` periodically to audit docs, code, tests, and active specs for inconsistencies.

### Project structure created by minispec

minispec owns the generated `minispec/` directory and root `AGENTS.md`. Source code, tests, and all other project files are user-owned and can use whatever layout fits the project.

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
  explorations/             Exploration & brainstorming artifacts
```

## Commands

### `/mspc-init`

Bootstrap a new project from an idea description.

```text
/mspc-init I want to build a CLI tool that converts CSV files to JSON with streaming support
/mspc-init path/to/idea-file.md
```

This command creates the minispec structure above and seeds:
- `minispec/CONCEPT.md` — distilled vision, motivation, core concept, key decisions, planned features, open questions
- `minispec/TODO.md` — initial backlog organized into Development, Open Questions, and Exploration sections
- `minispec/REQS.md`, `minispec/TESTS.md`, `minispec/DONE.md`, `minispec/LESSONS.md` — living docs shells
- `minispec/TECH.md` — reality-only shell, populated later by `/mspc-task-accept`
- `AGENTS.md` — project snapshot, principles, document philosophy, workflow guidance, and structured discussion guidance for normal OpenCode conversations

### `/mspc-explore`

Explore, investigate, and brainstorm at any project phase.

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

```text
/mspc-task-new T0001
/mspc-task-new T0001 add user authentication with OAuth
/mspc-task-new add dark mode support
```

Takes a task ID from `minispec/TODO.md` or a new description. Routes by task type:
- **Development task** — generates a spec at `minispec/specs/SPEC-T0001.md` using zero-padded task IDs (`T0001`, `T0002`, ...)
- **Open question / Exploration** — routes you to `/mspc-explore`

If you pass a new description instead of an existing task ID, minispec checks for duplicates, assigns the next task ID, confirms the right `minispec/TODO.md` section, and adds the item before continuing.

If the work is truly trivial, use `/mspc-task-quick` instead.

### `/mspc-task-impl`

Implement a task from its spec.

```text
/mspc-task-impl T0001
```

Reads the spec and implements it:
1. Plans the implementation — files to create or modify, order of operations, tests needed, and any open ambiguities
2. Writes code following the spec strictly
3. Writes tests alongside the code
4. Verifies every acceptance criterion — runs tests, checks build, runs lint or format steps, and lists manual checks when needed
5. Reports verification results and lists any manual checks needed

If no spec exists for the task, it suggests running `/mspc-task-new` first.

### `/mspc-task-accept`

Accept a completed task and distill its spec into living docs.

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
7. Captures any durable insight in `minispec/LESSONS.md` when one actually emerged
8. Removes the spec file

### `/mspc-task-quick`

One-shot flow for trivial changes — no spec file.

```text
/mspc-task-quick T0014
/mspc-task-quick fix typo in README
```

For changes too small to justify the full `/mspc-task-new -> /mspc-task-impl -> /mspc-task-accept` cycle: one-line bugfixes, copy tweaks, isolated renames. If the change touches multiple components, has unclear acceptance, or needs a design decision, it refuses and redirects to `/mspc-task-new`.

### `/mspc-review`

Audit the project for inconsistencies, gaps, and improvements.

```text
/mspc-review
```

Reads all docs, code, tests, and active specs, then cross-references everything:
- **Docs vs docs** — do requirements match technical components? Does `minispec/CONCEPT.md` align with `minispec/TODO.md`? Are there duplicates or contradictions?
- **Docs vs code** — are requirements implemented? Does `minispec/TECH.md` match the actual codebase? Are there undocumented behaviors?
- **Code quality** — security issues, code smells, error handling, naming drift
- **Test coverage** — are documented behaviors tested or covered by clear manual checks? Are active-spec edge cases covered? Are manual tests current?

Findings are reported by severity with flat `F<N>` identifiers. After the report, the command can promote selected findings into `minispec/TODO.md` as new tasks.
