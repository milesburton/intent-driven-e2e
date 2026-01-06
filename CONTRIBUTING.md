# Contributing

Thank you for your interest in contributing! This project demonstrates domain-driven UI testing with Playwright. The goal is readable, intent-focused tests that stay resilient across environments.

## Getting Started

- Prerequisites: Node 22.x, pnpm 9.x
- Install: `pnpm install`
- Dev server (local app): `pnpm dev`
- Preview (hosted app): `pnpm preview`

## Tests

- Unit tests: `pnpm test:unit`
- Chromium e2e: `pnpm test:e2e:chromium`
- OpenFin e2e (manual CDP setup required): `pnpm test:e2e:openfin`
- All-in-one validation: `pnpm test:validate`
  - Note: `test:validate` includes OpenFin when `OPENFIN_CDP_URL` is set.

## Lint & Format

- Lint: `pnpm lint`
- Format write: `pnpm format`
- Format check: `pnpm format:check`

## Style & Patterns

- British English for wording and messages.
- Kebab-case for helper filenames.
- Tests should target the shared domain interface (`RequestFormApp`): avoid UI selectors in tests.
- Use the unified fixture and shared interceptor to keep tests deterministic.

## Commits & PRs

- Conventional commits are welcome (e.g., `feat:`, `fix:`, `docs:`). Header length is not enforced.
- Include tests for functional changes.
- Keep changes focused and avoid unrelated refactors.
- Ensure `pnpm test:validate` passes before requesting review.

## OpenFin

OpenFin tests connect via the Chrome DevTools Protocol (CDP). You must:

1. Serve the app via `pnpm preview` (default host/port documented in README).
2. Launch OpenFin with `--remote-debugging-port=9222` and open the served app URL.
3. Provide `OPENFIN_CDP_URL` to point to the DevTools endpoint, or use the helper scripts in `scripts/`.

See README for detailed steps.

## Governance

- Be respectful and collaborative.
- Follow the Code of Conduct.
- Security issues should be reported privately (see SECURITY.md).
