---
description: Explore project questions at any phase and capture the outcome in minispec docs
agent: build
---

# Minispec Explore

You are conducting a structured exploration session. This can happen at any phase of the project — early brainstorming, mid-project exploration of a new direction, or investigating an open question.

## Interaction rules

When user input is needed, prefer the `question` tool when it fits; otherwise ask a numbered list with one question per item.

The session produces:
1. A summary file in `docs/explorations/`
2. Updates to `docs/CONCEPT.md` if the vision changed
3. New items in `docs/TODO.md` if actionable work emerged

## Process (follow in order)

### Phase 1 — Read & Understand

1. Read `AGENTS.md` for project context.
2. Read `docs/CONCEPT.md` for the current vision.
3. Read `docs/TODO.md` — check the Open Questions section for related items.
4. Read `docs/REQS.md` and `docs/TECH.md` to understand what is already implemented.
5. If `$ARGUMENTS` references a specific task ID, read that task's details.
6. Scan `docs/explorations/` for prior sessions on related topics.

### Phase 2 — Frame the Exploration

Determine the exploration mode based on `$ARGUMENTS` and context.

**Specific topic or question**
- Share your initial analysis.
- Ask focused follow-up questions.

**Interview mode**
- Review `CONCEPT.md` and `TODO.md` open questions.
- Prepare a structured interview in groups of 3-5 questions.

**No argument or vague argument**
- Summarize the current state of the project briefly.
- List the top 3-5 open questions or areas that would benefit from exploration.

### Phase 2.5 — Reframe Check

Before diving in, step back once. Ask the user a single reframe question tailored to the topic:

> Before we go deep — what are you actually trying to achieve with this? Is there a version of this problem that does not need the framing you brought?

Skip this phase if the topic is already a concrete technical decision, the user has already reframed once in this session, or the argument is a specific task ID that was already scoped in `TODO.md`.

### Phase 3 — Explore

Conduct the exploration as a natural conversation. Be opinionated but open — share your perspective, challenge assumptions, suggest alternatives.

Rules:
- Stay engaged and curious.
- Note explicitly when the vision changes.
- Note explicitly when actionable work emerges.
- Note explicitly when a real decision is made.
- Do not cut the discussion short, but keep it productive.
- If the user asks you to research, analyze, or compare something, do it thoroughly before continuing the conversation.

### Phase 4 — Write

When the exploration reaches a natural conclusion (or the user signals they are done):

1. Create an exploration summary at `docs/explorations/<YYYY-MM-DD>-<topic-slug>.md`.
2. Update `docs/CONCEPT.md` if the vision, planned features, or key decisions changed.
3. Update `docs/TODO.md` with new tasks, questions, or exploration items that emerged.
4. Do not update `docs/TECH.md` from exploration alone — `TECH.md` tracks implemented reality.

Use this summary format:

```markdown
---
title: "<Topic title>"
created: "<YYYY-MM-DD>"
task: "<task ID if applicable, otherwise omit>"
---

# <Topic title>

## Context

## Key Points

## Decisions Made

## Action Items

## Open Questions
```

### Phase 5 — Summary

Present:
- Key insights from the exploration (2-4 bullet points)
- What docs were updated
- New TODO items created (if any)
- Remaining open questions
- Suggested next step — another `/mspc-explore` on a subtopic, or `/mspc-task-new` if work items are ready
