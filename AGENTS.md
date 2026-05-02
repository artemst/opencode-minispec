# Repository Guidelines

## Product Surface

- This `AGENTS.md` is maintainer guidance for this plugin repo. It is not the project-level `AGENTS.md` that minispec generates inside user workspaces.
- This repo ships one OpenCode plugin, `opencode-minispec`. The real product is `commands/*.md`; `index.js` is only the loader.
- Keep prompt changes aligned across `commands/*.md`, `README.md`, `README.ru.md`, and `PUBLISH.md`. The docs repeat the workflow and command names, so drift is easy to introduce.
- Shipped commands are intentionally flat `mspc-*` names: `mspc-init`, `mspc-sync`, `mspc-explore`, `mspc-task-new`, `mspc-task-impl`, `mspc-task-accept`, `mspc-task-quick`, `mspc-review`. Do not introduce dotted or colon-style namespaces.
- `package.json` is public surface too: it publishes `index.js`, `commands/`, `README.md`, and `README.ru.md`.

## Loader Constraints

- Command names come from the markdown filename relative to `commands/`; nested paths would be converted to hyphenated command names.
- `index.js` only forwards frontmatter keys `description`, `agent`, `model`, and `subtask`. Keep command metadata in simple one-line `key: value` form; this is not a full YAML parser.
- `subtask` is the only typed frontmatter field. It becomes a boolean only when written as literal `true` or `false`.
- The loader skips any command name already present in `config.command`, so this plugin does not override existing user-defined commands.

## Minispec Invariants

- `minispec/CONCEPT.md` may describe planned work. `minispec/REQS.md` and `minispec/TECH.md` must describe implemented reality only.
- `/mspc-sync` is the repeatable doc reconciliation path for existing code/docs; `/mspc-review` may report doc drift but should stay focused on bugs, risks, quality issues, and missing tests.
- `minispec/specs/SPEC-T####.md` is temporary: create it in `/mspc-task-new`, implement from it in `/mspc-task-impl`, distill it and delete it in `/mspc-task-accept`.
- `minispec/LESSONS.md` stays sparse. Only durable, non-obvious lessons belong there, and `/mspc-task-accept` or `/mspc-task-quick` should confirm with the user before writing one.
- `/mspc-task-quick` is a hard trivial-change path. If the work needs design decisions, touches more than a tiny surface, or grows during verification, stop and route to `/mspc-task-new`.
- `/mspc-review` is read-only except for findings the user explicitly chooses to promote into `minispec/TODO.md`.

## Verification

- There is no automated test suite or CI workflow in this repo. Verification is package sanity plus manual Markdown consistency checks.
- Run `npm run check` after editing `index.js`.
- Run `python3 -m json.tool package.json` after editing package metadata.
- Run `npm run pack:dry-run` when the published surface changes: `package.json`, `index.js`, `commands/*`, or `README*`.
- Run `git diff --check` before finishing.
- After editing prompts or docs, re-read the changed Markdown for stale slash commands, zero-padded task/spec IDs (`T0001`, `SPEC-T0001`), and workflow drift between prompts and READMEs.

## Interaction Rules

- **Think before writing.** Surface assumptions and tradeoffs explicitly. Ask clarifying questions before starting implementation.
- When user input is needed, prefer the `question` tool when it fits; otherwise ask a numbered list with one question per item.
- In deeper discussions, ask one batch at a time, usually no more than 3-5 questions before waiting for answers.
- Surface assumptions, constraints, and tradeoffs explicitly instead of silently choosing a path.
- At natural pauses, summarize what is understood, what remains open, and what recommendation follows.
- When reporting information to me, be extremely concise and sacrifice grammar for the sake of concision.
