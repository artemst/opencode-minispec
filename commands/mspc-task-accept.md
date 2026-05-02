---
description: Distill a completed minispec task into living docs and archive it
agent: build
---

# Minispec Task Accept

The user has tested a task implementation and is ready to accept it. This command distills all valuable information from the spec into the living docs (`minispec/REQS.md`, `minispec/TECH.md`, `minispec/TESTS.md`), archives the task, and removes the spec.

Read the task ID from `$ARGUMENTS`. If no argument is provided, stop and ask the user which task to accept.

## Process (follow in order)

### Phase 1 — Read & Gather

1. Read the spec file at `minispec/specs/SPEC-T0001.md`, using the actual zero-padded task ID. If it does not exist, stop and tell the user.
2. Read `minispec/REQS.md` — current implemented requirements.
3. Read `minispec/TECH.md` — current technical details.
4. Read `minispec/TESTS.md` — current test cases.
5. Read `minispec/TODO.md` — find the task entry.
6. Read `minispec/DONE.md` — understand the archive format.
7. Read `minispec/CONCEPT.md` — check whether implementation changed the vision.
8. Read `minispec/LESSONS.md` — so you can update existing entries instead of adding parallel ones.
9. Read the actual implementation code to understand what was built, not just what was planned in the spec.

### Phase 2 — Distill to `minispec/REQS.md`

Extract system requirements from the spec and implementation. Add them to `minispec/REQS.md` under the appropriate section.

What to extract:
- Functional requirements — what the system now does
- Non-functional requirements — performance characteristics, security measures, platform constraints that were implemented
- Edge case handling — how the system behaves at boundaries

How to write:
- Requirements describe current behavior, not planned behavior.
- Each requirement should be testable.
- Group by feature area, consistent with existing `minispec/REQS.md` structure.
- Reference the task ID for traceability.
- Do not duplicate what is already in `minispec/REQS.md`.

### Phase 3 — Distill to `minispec/TECH.md`

Extract technical details from the spec and implementation. Add them to `minispec/TECH.md`.

What to extract:
- New components created — their responsibility and boundaries
- Data model changes — new entities, schemas, relationships
- Technical patterns used — architecture patterns, key algorithms
- Integration points — how new code connects to existing components
- Configuration — new settings, defaults, environment variables

How to write:
- Describe what exists now, not what was planned.
- Stay conceptual — describe components and their relationships, not every function signature.
- Update existing sections rather than creating parallel ones.
- If the implementation introduced a new architectural pattern, document it so future tasks follow it.

### Phase 4 — Distill to `minispec/TESTS.md`

Extract test cases from the spec's verification section and the actual tests written. Add them to `minispec/TESTS.md`.

Automated tests:
- List test cases covered by automated tests.
- Include the test description and what it verifies.
- Note the test file or location for reference.

Manual tests:
- List test cases that require manual verification.
- Include step-by-step instructions.
- Note expected outcomes.

### Phase 5 — Archive the Task Record

1. Remove the task from `minispec/TODO.md`.
2. Add it to `minispec/DONE.md` using this format:

```markdown
## T0001 — <description>

- **Completed**: <YYYY-MM-DD>
- **Spec**: SPEC-T0001 (removed after distillation)
- **Summary**: <one-sentence summary of what was delivered>
- **Files**: <key files created or modified>
```

Do not delete the spec yet. Later phases may still need it while updating `minispec/CONCEPT.md` or `minispec/LESSONS.md`.

### Phase 6 — Update `minispec/CONCEPT.md` if needed

Check whether the implementation changed the vision:
- Did the implementation reveal that a planned feature works differently than envisioned?
- Did a decision made during implementation affect the core concept?
- Should any key decisions be updated?

If so, update `minispec/CONCEPT.md`. If not, skip this step.

### Phase 6.5 — Capture Lessons if any

Lessons belong in `minispec/LESSONS.md` only when the task produced non-obvious, durable knowledge a future reader could not infer from code, `minispec/REQS.md`, or `minispec/TECH.md` alone.

Typical signals:
- an abandoned approach and why it failed
- a mid-task reversal and what triggered it
- a surprise or gotcha the next person would likely hit
- a hidden constraint not encoded elsewhere

Do not use `minispec/LESSONS.md` for what shipped, routine technical choices already captured in `minispec/TECH.md`, or isolated bug fixes with no broader implication.

Process:
1. Scan the spec, implementation, and session for a qualifying lesson.
2. If none exists, skip this phase.
3. If one or more qualify, list them for the user and only write what they confirm.
4. Update an existing adjacent lesson instead of adding a parallel one when possible.

Entry format in `minispec/LESSONS.md`:

```markdown
### <Short takeaway — one line, the thing a future reader needs to know>

- **Learned in**: T0001 — <task summary>
- **Context**: <what we were trying to do, in one line>
- **Insight**: <the non-obvious thing — what you did not know going in>
- **Implication**: <what future work should do differently, or watch for>
```

### Phase 7 — Remove the Spec

After all distillation, archive, `minispec/CONCEPT.md`, and `minispec/LESSONS.md` updates are complete, delete `minispec/specs/SPEC-T0001.md` for the actual zero-padded task ID.

### Phase 8 — Summary

Present:
- What was distilled and where:
  - Requirements added to `minispec/REQS.md`
  - Technical details added to `minispec/TECH.md`
  - Test cases added to `minispec/TESTS.md`
- Task archived in `minispec/DONE.md`
- Spec removed
- Any `minispec/CONCEPT.md` updates
- Any `minispec/LESSONS.md` entries added, or explicitly say no lesson was captured
- Suggested next step — typically the next task in `minispec/TODO.md`: "Next task is T0001. Run `/mspc-task-new T0001` with the actual zero-padded task ID to start."

## Rules to always apply

- Reality over plan. Distill from the actual implementation, not just the spec.
- Do not lose information. The spec is about to be deleted.
- Keep docs coherent. Each doc should read as a coherent whole, not a patchwork of task-by-task additions.
- Preserve traceability with task IDs.
- Do not add speculative content. `minispec/CONCEPT.md` holds the vision; `minispec/REQS.md` and `minispec/TECH.md` hold the truth.
