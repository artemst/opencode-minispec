# Changelog

All notable changes to this project will be documented in this file.

## 0.2.0 - Unreleased

### Changed

- Add repeatable `/mspc-sync` for reconciling minispec docs with existing code, tests, configs, and project docs.
- Reframe `/mspc-init` as safe bootstrap for both greenfield and existing projects, including non-destructive `AGENTS.md` merge behavior.
- Reframe `/mspc-review` around bugs, risks, quality issues, and missing tests; documentation drift now routes primarily through `/mspc-sync`.
- Add Reads/Writes/Main Goal responsibility tables for every command in the README files.
- Rename the generated minispec document workspace from `docs/` to `minispec/` to avoid conflicts with user-owned documentation directories.
- Remove the fixed generated `impl/` codebase directory requirement. minispec now owns `minispec/` docs and a managed minispec section in root `AGENTS.md`; project code, tests, and other docs can use any layout.

## 0.1.0

### Added

- Initial release of `opencode-minispec` with the core minispec workflow commands.
