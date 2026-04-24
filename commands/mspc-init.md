---
description: Bootstrap a minispec workspace from an idea description or markdown file
agent: build
---

# Minispec Init

You are bootstrapping a new project workspace from an initial idea description. The goal is to create a clean, minimal project structure with a distilled vision document (`CONCEPT.md`), an initial backlog (`TODO.md`), and project guidance (`AGENTS.md`).

## Interaction rules

When user input is needed, prefer the `question` tool when it fits; otherwise ask a numbered list with one question per item.

Read the idea from `$ARGUMENTS`. The argument can be either:
- A path to a markdown file (for example `IDEA.md` or `path/to/idea.md`) — read the file contents.
- An inline idea description written directly in the prompt.

If `$ARGUMENTS` is empty or whitespace-only, stop before doing any work. Ask the user to provide one of:
1. An inline idea description
2. A path to a markdown file containing the idea

To distinguish: if `$ARGUMENTS` looks like a file path (ends in `.md`, contains `/`, or matches an existing file), treat it as a file path and read it. If the file does not exist, stop and tell the user. Otherwise, treat `$ARGUMENTS` as the idea description itself.

Do not ask any questions yet. Work through Steps 1–6 silently, then begin Step 7.

---

## Step 1 — Read the idea

Extract everything explicitly stated from the idea (file or inline description). Do not infer, invent, or expand anything not present in the source.

---

## Step 2 — Create folder structure

```text
docs/
docs/specs/
docs/explorations/
impl/
```

---

## Step 3 — Create `docs/CONCEPT.md`

This is the project's north star — a permanent vision memo. It can describe things that are not built yet. It captures the full picture of what the project is about and key decisions made.

Populate strictly from the idea description. Use `_Not specified._` for sections with no relevant source content.

```markdown
---
title: "<extracted title or short name>"
created: "<YYYY-MM-DD>"
status: draft
---

# <title>

## Summary

<One-paragraph distillation of the idea. What is this project and why does it exist?>

## Problem / Motivation

<What problem does this solve, or what opportunity does it address? Extract from idea description only.>

## Core Concept

<The central mechanism or approach. What makes this idea distinct?>

## Key Decisions

<Bullet list of important product and technical decisions mentioned in the idea description. Each should state the decision and the rationale if given.>

-

## Planned Features

_Features planned for the project. This is the vision — implementation tracks separately in REQS.md._

### Core (first iteration)

<Features for the first working version. Extract from idea if stated; otherwise `_To be defined._`>

### Future

<Features explicitly noted as later / future / nice-to-have.>

| Feature | Notes |
|---------|-------|
| | |

## References

<Any links, papers, tools, products, or prior art mentioned in the idea description.>

## Open Questions

<Things that are unclear, contradictory, or missing from the idea description. These become the agenda for Step 7.>

-
```

---

## Step 4 — Create `docs/TODO.md`

Extract actionable items from the idea description and organize them into the backlog. Assign task IDs starting from `T0001`.

```markdown
---
title: "TODO — <project title>"
created: "<YYYY-MM-DD>"
---

# TODO

## Backlog

### Development

<Development tasks extracted from the idea. Each task should deliver testable value.>

- [ ] **T0001** — <description> [S/M/L]

### Open Questions

<Questions that need research or discussion before they can become development tasks.>

### Exploration

<Ideas that need prototyping or deeper investigation.>

## Completed -> see DONE.md
```

---

## Step 5 — Create remaining docs

**`docs/REQS.md`**

This doc tracks implemented system requirements. It starts nearly empty and is populated incrementally through `/mspc-task-accept`.

```markdown
---
title: "Requirements — <project title>"
created: "<YYYY-MM-DD>"
status: draft
---

# System Requirements

_This document tracks implemented system behavior. See CONCEPT.md for planned features._
_Updated via `/mspc-task-accept` as tasks are completed and verified._

## Functional Requirements

_Populated as tasks are accepted._

## Non-Functional Requirements

### Performance
### Security & Privacy
### Platform Constraints

## Glossary
```

**`docs/TECH.md`**

This doc tracks actual technical details of what is built. It starts as a reality-only shell and is populated incrementally through `/mspc-task-accept`.

```markdown
---
title: "Technical Details — <project title>"
created: "<YYYY-MM-DD>"
---

# Technical Details

_This document tracks the actual technical architecture and implementation details._
_See CONCEPT.md for the overall vision. Updated via `/mspc-task-accept` as tasks are completed._

## Overview

_No implemented technical details yet._

## Technology Stack

_Populated as technology choices become part of the implementation._

## Project Structure

_Populated as the implemented codebase takes shape._

## Components

_Populated as components are implemented._

## Data Model

_Populated as data structures are implemented._

## Key Technical Decisions

_Populated as technical decisions are implemented._
```

**`docs/TESTS.md`**

```markdown
---
title: "Test Cases — <project title>"
created: "<YYYY-MM-DD>"
---

# Regression Test Cases

_This document tracks test cases for regression testing._
_Updated via `/mspc-task-accept` as tasks are completed._

## Automated Tests

_Test cases that are covered by automated tests._

## Manual Tests

_Test cases that require manual verification._
```

**`docs/DONE.md`**

```markdown
---
title: "Completed Tasks — <project title>"
created: "<YYYY-MM-DD>"
---

# Completed Tasks

_Tasks moved here from TODO.md after acceptance via `/mspc-task-accept`._
```

**`docs/LESSONS.md`**

```markdown
---
title: "Lessons — <project title>"
created: "<YYYY-MM-DD>"
---

# Lessons

_Non-obvious knowledge captured during task work: abandoned approaches, reversed decisions, gotchas, and surprises._
_Not a log of what shipped (see DONE.md) or what exists (see REQS.md / TECH.md) — only durable insights a future reader could not infer from the code or docs._

## How to use

- **Add** a lesson when a task revealed something that will save future work. Capture it via `/mspc-task-accept` or `/mspc-task-quick` when the user confirms a lesson emerged.
- **Skip** if the task had no surprises. Most tasks will not produce lessons. An empty acceptance is fine.
- **Update** an existing lesson if later work refined or contradicted it — do not just append a correction.
- **Remove** obsolete lessons when the underlying reality changes.

## Lessons

_Populated as tasks are accepted. Each entry references the task ID where the lesson was learned._
```

---

## Step 6 — Create `AGENTS.md`

Create `AGENTS.md` in the project root. Fill **Project snapshot** immediately from the idea description.

```markdown
# AGENTS.md

This file provides guidance to OpenCode when working with code in this repository.

---

## Project snapshot

<Fill from idea description: one sentence covering what the project is, intended stack if stated, and current phase.>

## Principles

- **Think before coding.** Surface assumptions and tradeoffs explicitly. Ask clarifying questions before starting implementation.
- **Simplicity first.** Write minimal code solving only what was requested. If you write 200 lines and it could be 50, rewrite it.
- **Surgical changes.** Edit only affected code. Match existing style. Do not refactor unrelated sections.
- **Goal-driven execution.** Transform requests into verifiable success criteria. Brief multi-step plan before implementation.

## Interaction Rules

- When user input is needed, prefer the `question` tool when it fits; otherwise ask a numbered list with one question per item.
- In deeper discussions, ask one batch at a time, usually no more than 3-5 questions before waiting for answers.
- In open-ended discussions, do one quick reframe before diving deep: clarify the actual goal, and check whether the framing or proposed solution should be challenged.
- Surface assumptions, constraints, and tradeoffs explicitly instead of silently choosing a path.
- At natural pauses, summarize what is understood, what remains open, and what recommendation follows.
- Normal discussion is conversational by default. Do not create docs or backlog items from ordinary chat unless the user asks, or the interaction is explicitly promoted to `/mspc-explore`.
- If a conversation produces durable decisions, clarified vision, or actionable backlog items, suggest `/mspc-explore` so the outcome is captured in `docs/explorations/` and linked back into project docs.

## Context files

Read these before working on any task:

- `docs/CONCEPT.md` — project vision, motivation, planned features
- `docs/REQS.md` — system requirements tracking what is implemented
- `docs/TECH.md` — technical details tracking what is built
- `docs/TODO.md` — backlog: development tasks, open questions, exploration items
- `docs/DONE.md` — completed tasks archive
- `docs/TESTS.md` — regression test cases
- `docs/LESSONS.md` — non-obvious insights, reversed decisions, gotchas
- `docs/specs/` — active per-task implementation specs
- `docs/explorations/` — exploration session summaries and brainstorming artifacts

## Document philosophy

- **CONCEPT.md** = vision and north star. Can describe things not yet built. Updated when the vision changes.
- **REQS.md** = tracks reality. Only contains requirements for features that are implemented. Updated via `/mspc-task-accept`.
- **TECH.md** = tracks reality. Only contains technical details for what is built. Updated via `/mspc-task-accept`.
- **TODO.md** = the backlog. Tasks, questions, explorations. Updated as work is planned and accepted.
- **LESSONS.md** = durable insight only. Abandoned approaches, reversed decisions, gotchas. Not a diary.
- **Specs** = temporary bridge documents. Created by `/mspc-task-new`, consumed by `/mspc-task-impl`, removed by `/mspc-task-accept`.

## Workflow

```text
/mspc-init -> /mspc-explore (repeat) -> /mspc-task-new -> /mspc-task-impl -> /mspc-task-accept -> (repeat)
                                                                                               ↓
                                                                                     REQS + TECH + TESTS updated
                                                                                     LESSONS updated (if a lesson emerged)
                                                                                     spec removed

Trivial changes: /mspc-task-quick (the only no-spec path, still updates living docs)
Periodic audit:  /mspc-review (can add selected findings to TODO.md)
```

| Command | Purpose |
|---------|---------|
| `/mspc-init` | Bootstrap project from idea description |
| `/mspc-explore` | Explore project questions, save to explorations, update docs if needed |
| `/mspc-task-new T0001` | Create a spec for a development task, or route open questions/exploration to `/mspc-explore` |
| `/mspc-task-impl T0001` | Implement from spec, verify acceptance criteria |
| `/mspc-task-accept T0001` | Distill spec into REQS/TECH/TESTS, archive task, delete spec |
| `/mspc-task-quick [desc]` | Lightweight flow for trivial changes — no spec file |
| `/mspc-review` | Audit docs, code, tests; optionally add findings to TODO |
```

---

## Step 7 — Light clarification round

Begin a light clarification round. The goal is not a full product deep-dive — that is what `/mspc-explore` is for. Here you only resolve what is ambiguous, contradictory, or unclear in the idea description itself so the workspace is internally consistent.

Before asking anything, analyze the idea and determine what is genuinely ambiguous or missing. Focus on:
- Contradictions within the idea description
- Statements too vague to classify as core vs future feature
- Core concept unclear enough that `CONCEPT.md` sections cannot be populated accurately
- Platform, language, or domain that is unstated but assumed

Do not explore scope boundaries, edge cases, competitive positioning, or product strategy — those are `/mspc-explore` territory.

Ask all clarification questions in one message. Prefer the `question` tool when it fits; otherwise use a numbered list so each question is easy to reference. If there are no genuine ambiguities, skip this step entirely and say so.

After the user answers, immediately update `docs/CONCEPT.md` and other affected docs on disk. When a question is resolved, remove it from `## Open Questions`.

---

## Step 8 — Seed initial content

After clarification, do a focused pass:
1. `CONCEPT.md` — ensure all sections are populated with known information. Keep speculative implementation detail out.
2. `TODO.md` — ensure all actionable items are captured with appropriate categories.
3. `TECH.md` — leave it as a reality-only shell. Do not copy planned stack or architecture from the idea.
4. `AGENTS.md` — update Project snapshot if Q&A refined the understanding.
5. `impl/` — if project structure is clear from the idea, create it. Otherwise leave it flat.

---

## Step 9 — Summary

Output:
- What was extracted from the idea description and where it was placed
- What was clarified during Q&A (if any)
- Remaining open questions (ensure they are in `docs/CONCEPT.md`)
- Suggested next step — typically "Run `/mspc-explore` to dive deeper into specific aspects, or `/mspc-task-new T0001` to start working on the first task"

Before outputting the summary, verify all docs are consistent:
- `AGENTS.md`: Project snapshot has real content
- `docs/CONCEPT.md`: populated from idea, no speculative implementation details
- `docs/TECH.md`: no speculative implementation details
- `docs/TODO.md`: actionable items organized by category
- `docs/REQS.md`: nearly empty (no implementation yet)
- `docs/LESSONS.md`: seeded empty with usage guidance
