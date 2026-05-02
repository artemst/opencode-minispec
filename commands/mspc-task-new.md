---
description: Create a minispec task spec or route open questions and exploration to mspc-explore
agent: build
---

# Minispec Task New

You are bootstrapping a new task. Depending on the task type, this either produces a spec document (for development tasks) or routes the task to `/mspc-explore` (for open questions or exploration tasks).

Read the task reference from `$ARGUMENTS`. This can be:
- A task ID from `TODO.md`
- A task ID with additional context
- A new task description without an ID

If no argument is provided, stop and ask the user which task to work on.

Task IDs are always zero-padded four digits (`T0001`, `T0002`, ...). Matching spec files use the form `docs/specs/SPEC-T0001.md`.

When assigning a new task ID, scan all existing task-bearing artifacts before choosing the number:
- `docs/TODO.md`
- `docs/DONE.md`
- active spec filenames and contents in `docs/specs/`
- exploration summaries in `docs/explorations/`

Assign one greater than the highest real `T####` found. If no real task IDs exist, start at `T0001`. Do not reuse IDs after tasks have moved from `TODO.md` to `DONE.md`.

## Interaction rules

When user input is needed, prefer the `question` tool when it fits; otherwise ask a numbered list with one question per item.

## Process (follow in order)

### Phase 1 — Read & Understand

1. Read `AGENTS.md` for project context and conventions.
2. Read `docs/CONCEPT.md` for the vision and planned features.
3. Read `docs/TODO.md` to find or place the task.
4. Read `docs/REQS.md` to understand what is already implemented.
5. Read `docs/TECH.md` to understand the current technical state.
6. Read existing code in `impl/` to understand what exists.
7. Scan `docs/specs/` for active specs.
8. Read `docs/DONE.md` for completed task context and task ID allocation.

### Phase 2 — Resolve the Task

If a task ID was given:
- Find it in `TODO.md`. If it does not exist, stop and tell the user.
- Read the task description and category.

If a new description was given:
- Check whether a matching task already exists in `TODO.md`.
- If not, assign the next zero-padded task ID using the global task ID rule above, then choose the appropriate `TODO.md` section.
- Confirm the new task text and section with the user before writing anything.
- After confirmation, add it to `TODO.md`.

### Phase 3 — Route by Task Type

Determine the task type from its `TODO.md` category and description.

**Development task**
Proceed to Phase 4. Before writing a spec, check whether the work fits `/mspc-task-quick`'s triviality gate. If it does, stop and redirect there.

**Open question**
Tell the user this task needs exploration, not a spec. Suggest running `/mspc-explore T0001` with the actual zero-padded task ID.

**Exploration**
Tell the user this task needs exploration, not a spec. Suggest running `/mspc-explore T0001` with the actual zero-padded task ID.

### Phase 4 — Write Spec

For development tasks, create an implementation specification that gives the implementer everything needed in one place.

Gather information from:
- `CONCEPT.md`
- `REQS.md`
- `TECH.md`
- The codebase
- `TODO.md`

Choose the authoring mode:
- **Direct mode** for low-ambiguity, well-scoped tasks.
- **Sectioned mode** for broader or ambiguous tasks.

Sectioned mode order:
1. Overview + Scope
2. Requirements
3. Technical Context
4. Implementation Plan + Verification

After each section in sectioned mode, present it and ask for confirmation before moving on. If the user revises an earlier section, redraft downstream sections to stay consistent.

In direct mode, draft the full spec, review it for completeness, and write it. If ambiguities remain, batch all clarifying questions in one message before writing.

If `docs/specs/SPEC-T0001.md` already exists, treat it as the current draft. Update it in place; do not overwrite an active spec silently.

Write or update the full spec at `docs/specs/SPEC-T0001.md`, replacing `T0001` with the task's actual zero-padded ID.

```markdown
---
title: "SPEC-T0001 — <task description>"
task: T0001
created: "<YYYY-MM-DD>"
status: draft
---

# SPEC-T0001 — <task description>

## Task Reference

- **Task**: T0001 — <description> [S/M/L]
- **Depends on**: <dependencies or "none">

## Overview

## Requirements

### User Scenarios

### Acceptance Criteria

- [ ] <criterion 1>

### Edge Cases

- <edge case> -> <expected behavior>

## Technical Context

### Current State

### Components Involved

### Data Model Changes

## Implementation Plan

### Steps

1. <step>

### Key Considerations

## Verification

### Automated Tests

### Manual Checks

## Scope

### Includes
- <what this task delivers>

### Excludes
- <what is explicitly out of scope>
```

### Phase 5 — Summary

Present:
- Task type and how it was routed
- For specs: file location, what the task delivers, key implementation steps, acceptance criteria count
- For redirects: why the task belongs in `/mspc-explore` or `/mspc-task-quick`
- Any risks or open questions
- Suggested next step — `/mspc-task-impl T0001` for specs using the actual zero-padded task ID, or the appropriate `/mspc-explore` or `/mspc-task-quick` command for redirects
