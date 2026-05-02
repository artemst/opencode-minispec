---
description: Safely add minispec structure and workflow guidance to a project
agent: build
---

# Minispec Init

You are adding the minispec workflow to the current workspace. The workspace may be a brand-new project, an existing project with code and docs, or a project that already has partial minispec files.

The goal is safe bootstrap, not deep repository analysis. Create missing structure, seed only what is known, and preserve existing project files. For existing projects, recommend `/mspc-sync` after init to derive or refresh docs from the current codebase and existing docs.

## Interaction rules

When user input is needed, prefer the `question` tool when it fits; otherwise ask a numbered list with one question per item.

Read `$ARGUMENTS` as optional project intent. The argument can be:
- A path to a markdown file (for example `IDEA.md` or `path/to/idea.md`) - read the file contents.
- An inline idea description written directly in the prompt.
- Empty - allowed for existing projects; inspect the workspace enough to bootstrap safely.

To distinguish a file path: if `$ARGUMENTS` looks like a path (ends in `.md`, contains `/`, or matches an existing file), treat it as a file path and read it. If the file does not exist, stop and tell the user. Otherwise, treat `$ARGUMENTS` as the idea description itself.

Do not run a full codebase audit or attempt to reconstruct requirements from code. That belongs to `/mspc-sync`.

---

## Step 1 - Classify the workspace

Inspect the repository just enough to choose a safe bootstrap path:
- Does `minispec/` already exist?
- Does root `AGENTS.md` already exist?
- Are there existing source files, tests, configs, README files, or docs outside `minispec/`?
- Was an idea description provided through `$ARGUMENTS`?

Classify as one of:
- **Greenfield** - no meaningful existing code/docs and an idea was provided.
- **Existing project** - code/docs/configs already exist, with or without an idea.
- **Existing minispec project** - `minispec/` already exists.

If the workspace is greenfield and no idea was provided, stop before writing and ask the user to provide one of:
1. An inline idea description
2. A path to a markdown file containing the idea
3. Confirmation that this is an existing project and they only want the minispec structure installed

---

## Step 2 - Create missing folder structure

Create only missing directories:

```text
minispec/
minispec/specs/
minispec/summaries/
```

Never delete or replace existing directories.

---

## Step 3 - Create or preserve `minispec/CONCEPT.md`

If `minispec/CONCEPT.md` exists, preserve it. Do not overwrite it.

If absent, create it.

For greenfield projects with an idea, populate strictly from the idea description. Do not infer, invent, or expand anything not present in the source.

For existing projects without enough explicit intent, create an adoption shell and mark unknown sections as `_To be filled by /mspc-sync._` or `_Not specified._` as appropriate.

```markdown
---
title: "<extracted title, repository name, or short name>"
created: "<YYYY-MM-DD>"
status: draft
---

# <title>

## Summary

<One-paragraph distillation from the idea or existing high-level docs. If unknown: `_To be filled by /mspc-sync._`>

## Problem / Motivation

<What problem this solves. Extract from explicit sources only.>

## Core Concept

<The central mechanism or approach.>

## Key Decisions

- <Important product or technical decisions explicitly known.>

## Planned Features

_Features planned for the project. This is the vision - implementation tracks separately in REQS.md._

### Core (first iteration)

<Features for the first working version, if known.>

### Future

| Feature | Notes |
|---------|-------|
| | |

## References

<Links, docs, tools, products, or prior art explicitly mentioned.>

## Open Questions

- <Unknowns to resolve through `/mspc-explore` or `/mspc-sync`.>
```

---

## Step 4 - Create or preserve `minispec/TODO.md`

If `minispec/TODO.md` exists, preserve it. Do not overwrite it.

If absent, create it.

For greenfield projects with an idea, extract actionable items from the idea description and assign task IDs starting from `T0001`.

For existing projects, do not invent backlog from a shallow scan. Add only explicit adoption tasks if useful, such as running `/mspc-sync`.

```markdown
---
title: "TODO - <project title>"
created: "<YYYY-MM-DD>"
---

# TODO

## Backlog

### Development

- [ ] **T0001** - <description> [S/M/L]

### Open Questions

- <Questions that need research or discussion before they can become development tasks.>

### Exploration

- <Ideas that need prototyping or deeper investigation.>

## Completed -> see DONE.md
```

When creating an existing-project TODO with no explicit tasks, prefer:

```markdown
### Development

_No development tasks captured yet._

### Open Questions

- Should `/mspc-sync` derive minispec docs from the existing codebase and docs now?

### Exploration

_No exploration items captured yet._
```

---

## Step 5 - Create remaining docs if missing

For each file below: create it only if absent. If it exists, preserve it.

**`minispec/REQS.md`**

This doc tracks implemented system requirements. For greenfield projects it starts nearly empty. For existing projects it remains an adoption shell until `/mspc-sync` derives implemented behavior from code and tests.

```markdown
---
title: "Requirements - <project title>"
created: "<YYYY-MM-DD>"
status: draft
---

# System Requirements

_This document tracks implemented system behavior. See CONCEPT.md for planned features._
_Updated via `/mspc-task-accept` as tasks are completed and via `/mspc-sync` when docs are reconciled with existing code._

## Functional Requirements

_Populated as implemented behavior is accepted or synced._

## Non-Functional Requirements

### Performance
### Security & Privacy
### Platform Constraints

## Glossary
```

**`minispec/TECH.md`**

This doc tracks actual technical details of what is built. For greenfield projects it starts as a reality-only shell. For existing projects it remains an adoption shell until `/mspc-sync` derives the actual architecture from code, configs, and tests.

```markdown
---
title: "Technical Details - <project title>"
created: "<YYYY-MM-DD>"
---

# Technical Details

_This document tracks the actual technical architecture and implementation details._
_See CONCEPT.md for the overall vision. Updated via `/mspc-task-accept` as tasks are completed and via `/mspc-sync` when docs are reconciled with existing code._

## Overview

_No implemented technical details captured yet._

## Technology Stack

_Populated as technology choices become part of the implementation or are synced from existing code._

## Project Structure

_Populated as the implemented codebase takes shape or is synced from existing code._

## Components

_Populated as components are implemented or synced from existing code._

## Data Model

_Populated as data structures are implemented or synced from existing code._

## Key Technical Decisions

_Populated as technical decisions are implemented or synced from existing code._
```

**`minispec/TESTS.md`**

```markdown
---
title: "Test Cases - <project title>"
created: "<YYYY-MM-DD>"
---

# Regression Test Cases

_This document tracks test cases for regression testing._
_Updated via `/mspc-task-accept` as tasks are completed and via `/mspc-sync` when test coverage is reconciled with existing tests._

## Automated Tests

_Test cases that are covered by automated tests._

## Manual Tests

_Test cases that require manual verification._
```

**`minispec/DONE.md`**

```markdown
---
title: "Completed Tasks - <project title>"
created: "<YYYY-MM-DD>"
---

# Completed Tasks

_Tasks moved here from TODO.md after acceptance via `/mspc-task-accept` or completion via `/mspc-task-quick`._
_Do not reconstruct historical tasks during adoption; use this file for minispec-tracked work going forward._
```

**`minispec/LESSONS.md`**

```markdown
---
title: "Lessons - <project title>"
created: "<YYYY-MM-DD>"
---

# Lessons

_Non-obvious knowledge captured during task work: abandoned approaches, reversed decisions, gotchas, and surprises._
_Not a log of what shipped (see DONE.md) or what exists (see REQS.md / TECH.md) - only durable insights a future reader could not infer from the code or docs._

## How to use

- **Add** a lesson when a task revealed something that will save future work. Capture it via `/mspc-task-accept` or `/mspc-task-quick` when the user confirms a lesson emerged.
- **Skip** if the task had no surprises. Most tasks will not produce lessons. An empty acceptance is fine.
- **Update** an existing lesson if later work refined or contradicted it - do not just append a correction.
- **Remove** obsolete lessons when the underlying reality changes.

## Lessons

_Populated as tasks are accepted. Each entry references the task ID where the lesson was learned._
```

---

## Step 6 - Create or merge `AGENTS.md`

Root `AGENTS.md` is user-owned. Never overwrite existing guidance.

If no root `AGENTS.md` exists, create it with the full template below.

If root `AGENTS.md` exists:
1. Preserve all existing content outside the minispec managed section.
2. If a section between `<!-- minispec:start -->` and `<!-- minispec:end -->` exists, update only that section.
3. If no managed section exists, append the minispec managed section to the end of the file.
4. If existing instructions outside the managed section appear to conflict with minispec guidance, do not rewrite them. Report the conflict in the summary and ask the user how to resolve it.

Use this template for a new file, or use only the managed section when merging into an existing file:

```markdown
# AGENTS.md

This file provides guidance to OpenCode when working with code in this repository.

---

## Project snapshot

<Fill from idea description, existing high-level docs, or say `_To be filled by /mspc-sync._`>

<!-- minispec:start -->
## Minispec Workflow

### Principles

- **Think before coding.** Surface assumptions and tradeoffs explicitly. Ask clarifying questions before starting implementation.
- **Simplicity first.** Write minimal code solving only what was requested. If you write 200 lines and it could be 50, rewrite it.
- **Surgical changes.** Edit only affected code. Match existing style. Do not refactor unrelated sections.
- **Goal-driven execution.** Transform requests into verifiable success criteria. Brief multi-step plan before implementation.

### Interaction Rules

- When user input is needed, prefer the `question` tool when it fits; otherwise ask a numbered list with one question per item.
- In deeper discussions, ask one batch at a time, usually no more than 3-5 questions before waiting for answers.
- In open-ended discussions, do one quick reframe before diving deep: clarify the actual goal, and check whether the framing or proposed solution should be challenged.
- Surface assumptions, constraints, and tradeoffs explicitly instead of silently choosing a path.
- At natural pauses, summarize what is understood, what remains open, and what recommendation follows.
- Normal discussion is conversational by default. Do not create docs or backlog items from ordinary chat unless the user asks, or the interaction is explicitly promoted to `/mspc-explore`.
- If a conversation produces durable decisions, clarified vision, or actionable backlog items, suggest `/mspc-explore` so the outcome is captured in `minispec/summaries/` and linked back into project docs.

### Context files

Read these before working on any minispec task:

- `minispec/CONCEPT.md` - project vision, motivation, planned features
- `minispec/REQS.md` - system requirements tracking what is implemented
- `minispec/TECH.md` - technical details tracking what is built
- `minispec/TODO.md` - backlog: development tasks, open questions, exploration items
- `minispec/DONE.md` - completed tasks archive
- `minispec/TESTS.md` - regression test cases
- `minispec/LESSONS.md` - non-obvious insights, reversed decisions, gotchas
- `minispec/specs/` - active per-task implementation specs
- `minispec/summaries/` - exploration and sync summaries

### Document philosophy

- **CONCEPT.md** = vision and north star. Can describe things not yet built. Updated when the vision changes or when `/mspc-sync` finds documented intent.
- **REQS.md** = tracks reality. Only contains requirements for features that are implemented. Updated via `/mspc-task-accept` and `/mspc-sync`.
- **TECH.md** = tracks reality. Only contains technical details for what is built. Updated via `/mspc-task-accept` and `/mspc-sync`.
- **TESTS.md** = test registry. Tracks automated and manual checks for implemented behavior. Updated via `/mspc-task-accept` and `/mspc-sync`.
- **TODO.md** = the backlog. Tasks, questions, explorations. Updated as work is planned, reviewed, synced, and accepted.
- **LESSONS.md** = durable insight only. Abandoned approaches, reversed decisions, gotchas. Not a diary.
- **Specs** = temporary bridge documents. Created by `/mspc-task-new`, consumed by `/mspc-task-impl`, removed by `/mspc-task-accept`.

### Workflow

```text
/mspc-init  ->  /mspc-sync  ->  /mspc-explore (repeat as needed)
                         |              |
                         v              v
                 /mspc-task-new -> /mspc-task-impl -> /mspc-task-accept -> (repeat)

Trivial changes: /mspc-task-quick (the only no-spec path, still updates living docs when needed)
Doc sync:        /mspc-sync (repeatable reconciliation of docs with current code/docs)
Health review:   /mspc-review (finds bugs, risks, missing tests, and actionable issues)
```

| Command | Purpose |
|---------|---------|
| `/mspc-init` | Safely add minispec structure and workflow guidance |
| `/mspc-sync` | Reconcile minispec docs with current code, tests, configs, and docs |
| `/mspc-explore` | Explore project questions, save to summaries, update docs if needed |
| `/mspc-task-new T0001` | Create a spec for a development task, or route open questions/exploration to `/mspc-explore` |
| `/mspc-task-impl T0001` | Implement from spec, verify acceptance criteria |
| `/mspc-task-accept T0001` | Distill spec into REQS/TECH/TESTS, archive task, delete spec |
| `/mspc-task-quick [desc]` | Lightweight flow for trivial changes - no spec file |
| `/mspc-review` | Audit code, tests, docs, and specs for risks and actionable findings |
<!-- minispec:end -->
```

---

## Step 7 - Light clarification round

Only ask questions needed to make the initial files internally consistent. Do not conduct a full product or architecture deep-dive.

For greenfield projects with an idea, ask about:
- Contradictions within the idea description
- Statements too vague to classify as core vs future feature
- Core concept unclear enough that `minispec/CONCEPT.md` cannot be populated accurately
- Platform, language, or domain that is unstated but assumed

For existing projects, ask only if needed to avoid unsafe writes or resolve an `AGENTS.md` merge conflict. Do not ask the user to explain the whole codebase; `/mspc-sync` will inspect it.

Ask all clarification questions in one message. If there are no genuine ambiguities, skip this step.

After the user answers, immediately update affected docs on disk.

---

## Step 8 - Summary

Before outputting the summary, verify:
- Missing minispec directories were created.
- Existing minispec docs were preserved.
- Missing minispec docs were created with greenfield or adoption-appropriate content.
- Root `AGENTS.md` was created or merged without overwriting user guidance.
- `minispec/REQS.md` and `minispec/TECH.md` contain only implemented reality or adoption placeholders, not invented details.

Output:
- Workspace classification: greenfield, existing project, or existing minispec project.
- Files created and files preserved.
- Whether `AGENTS.md` was created, appended, or managed-section-updated.
- Any conflicts or assumptions.
- Suggested next step:
  - Existing project: "Run `/mspc-sync` to reconcile minispec docs with the current codebase and existing docs."
  - Greenfield project: "Run `/mspc-explore` to refine open questions, or `/mspc-task-new T0001` to start the first task."
