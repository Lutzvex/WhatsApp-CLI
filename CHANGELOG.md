# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.2] - 2026-01-04
### Fixed
- **Critical Hotfix:** Removed `src/` from `.npmignore`. This fixes the `MODULE_NOT_FOUND` error where the published package was missing core logic files.

## [1.1.0] - 2026-01-04
### Changed
- **Major Refactoring:** Codebase restructured from a single `index.js` into a modular `src/` architecture.
- Moved configuration to `src/config/theme.js`.
- Moved UI logic to `src/ui/banner.js`.
- Moved feature logic to `src/features/chat.js`.

### Added
- Added `.editorconfig` for consistent coding style.
- Added GitHub Issue Templates and Pull Request Template.

## [1.0.1] - 2026-01-03
### Fixed
- Fixed binary execution path in `package.json` to ensure `whatsapp-cli` command works globally.

## [1.0.0] - 2026-01-03
### Added
- Initial release of WhatsApp CLI Pro (God Mode Edition).
- Features: Interactive CLI, Broadcast capability, and Real-time Chat.