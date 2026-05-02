# Changelog

All notable changes to this project will be documented in this file.

## 0.2.0 - Unreleased

### Changed

- Rename the generated minispec document workspace from `docs/` to `minispec/` to avoid conflicts with user-owned documentation directories.
- Remove the fixed generated `impl/` codebase directory requirement. minispec now owns only `minispec/` docs plus generated root `AGENTS.md`; project code and tests can use any layout.

## 0.1.0

### Added

- Initial release of `opencode-minispec` with the core minispec workflow commands.
