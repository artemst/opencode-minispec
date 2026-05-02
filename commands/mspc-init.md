---
description: Safely add minispec structure and workflow guidance to a project
agent: build
---

# Minispec Init

You are adding the minispec workflow to the current workspace. The workspace may be a brand-new project, an existing project with code and docs, or a project that already has partial minispec files.

The goal is safe bootstrap, not deep repository analysis. Create missing structure, seed only what is known, and preserve existing project files. Recommend `/mspc-sync` after init only for existing/adopted projects or later doc drift.

## Interaction rules

When user input is needed, prefer the `question` tool when it fits; otherwise ask a numbered list with one question per item.

Read `$ARGUMENTS` as optional project intent. The argument can be:
- A path to a markdown file (for example `IDEA.md` or `path/to/idea.md`) - read the file contents.
- An inline idea description written directly in the prompt.
- Empty - allowed for existing projects; inspect the workspace enough to bootstrap safely.

To distinguish a file path: if `$ARGUMENTS` matches an existing file, read it. If it is a single path-like token (ends in `.md` or contains `/`), treat it as a path and stop if missing. Otherwise, treat `$ARGUMENTS` as the idea description.

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

If the idea has contradictions or missing essentials that would make contentful docs unreliable, ask the Step 7 clarification questions before writing those sections. It is okay to create directories and placeholder shells first.

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

_Implemented behavior only. Planned features belong in CONCEPT.md. Updated by `/mspc-task-accept` and `/mspc-sync`._

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

_Actual technical architecture and implementation details. See CONCEPT.md for vision. Updated by `/mspc-task-accept` and `/mspc-sync`._

## Overview

_No implemented technical details captured yet._

## Technology Stack

## Project Structure

## Components

## Data Model

## Key Technical Decisions
```

**`minispec/TESTS.md`**

```markdown
---
title: "Test Cases - <project title>"
created: "<YYYY-MM-DD>"
---

# Regression Test Cases

_Automated and manual regression checks. Updated by `/mspc-task-accept` and `/mspc-sync`._

## Automated Tests

## Manual Tests
```

**`minispec/DONE.md`**

```markdown
---
title: "Completed Tasks - <project title>"
created: "<YYYY-MM-DD>"
---

# Completed Tasks

_Minispec-tracked work completed via `/mspc-task-accept` or `/mspc-task-quick`. Do not reconstruct historical tasks during adoption._
```

**`minispec/LESSONS.md`**

```markdown
---
title: "Lessons - <project title>"
created: "<YYYY-MM-DD>"
---

# Lessons

_Durable, non-obvious insights only: abandoned approaches, reversals, gotchas, surprises. Not a ship log._

## Lessons

_Populated by `/mspc-task-accept` or `/mspc-task-quick` after user confirmation._
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

````markdown
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
- At natural pauses, summarize what is understood, what remains open, and what recommendation follows.
- Normal discussion is conversational by default. Do not create docs or backlog items from ordinary chat unless the user asks, or the interaction is explicitly promoted to `/mspc-explore`.
- If a conversation produces durable decisions, clarified vision, or actionable backlog items, suggest `/mspc-explore` so the outcome is captured in `minispec/summaries/` and linked back into project docs.

### Files

- `minispec/CONCEPT.md` - vision and planned direction; may describe future work.
- `minispec/REQS.md`, `minispec/TECH.md`, `minispec/TESTS.md` - implemented, verified reality only.
- `minispec/TODO.md`, `minispec/DONE.md` - backlog and completed task archive.
- `minispec/LESSONS.md` - durable non-obvious insights, not a diary.
- `minispec/specs/` - temporary task specs; deleted by `/mspc-task-accept`.
- `minispec/summaries/` - exploration and sync summaries.

### Workflow

```text
/mspc-init
  -> /mspc-sync      existing/adopted/drifted projects only
  -> /mspc-explore   decisions and open questions
  -> /mspc-task-new -> /mspc-task-impl -> /mspc-task-accept -> repeat

Trivial changes: /mspc-task-quick (the only no-spec path, still updates living docs when needed)
Doc sync:        /mspc-sync (repeatable reconciliation of docs with current code/docs)
Health review:   /mspc-review (read-only findings for bugs, risks, missing tests, and quality issues)
```

<!-- minispec:end -->
````

---

## Step 7 - Light clarification round

Only ask questions needed to make the initial files internally consistent. Run this before writing contentful sections if ambiguity would otherwise cause guessing. Do not conduct a full product or architecture deep-dive.

For greenfield projects with an idea, ask about:
- Contradictions within the idea description
- Statements too vague to classify as core vs future feature
- Core concept unclear enough that `minispec/CONCEPT.md` cannot be populated accurately
- Platform, language, or domain that is unstated but assumed

For existing projects, ask only if needed to avoid unsafe writes or resolve an `AGENTS.md` merge conflict. Do not ask the user to explain the whole codebase; `/mspc-sync` will inspect it.

Ask all clarification questions in one message. If there are no genuine ambiguities, skip this step.

After the user answers, write or update affected docs on disk.

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
