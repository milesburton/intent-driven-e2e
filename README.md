# Playwright Domain-Driven Testing Example

[![CI](https://github.com/milesburton/domain-driven-ui-testing/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/milesburton/domain-driven-ui-testing/actions/workflows/ci.yml)
[![Coverage Status](https://codecov.io/gh/milesburton/domain-driven-ui-testing/branch/main/graph/badge.svg)](https://codecov.io/gh/milesburton/domain-driven-ui-testing)
[![OpenFin (manual)](https://github.com/milesburton/domain-driven-ui-testing/actions/workflows/openfin.yml/badge.svg?branch=main)](https://github.com/milesburton/domain-driven-ui-testing/actions/workflows/openfin.yml)
![Node](https://img.shields.io/badge/node-22.x-43853d?logo=node.js&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-9.x-f69220?logo=pnpm&logoColor=white)
![ESLint](https://img.shields.io/badge/eslint-enabled-4B32C3?logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)

## Overview

This repository demonstrates domain-driven UI testing with Playwright where tests express business intent rather than UI mechanics. It showcases two complementary patterns, Driver and Screenplay, implemented against the same typed domain interface.

- Driver pattern: https://www.testmanagement.com/blog/2023/06/the-driver-pattern/
- Screenplay pattern: https://serenity-js.org/handbook/design/screenplay-pattern/

The goal is to separate “what the user wants to achieve” (start a request, add items, compute) from “how the UI is clicked.” With a suitable abstraction, the same tests can target a web app, a desktop shell or other front-ends.

We achieve this by introducing a **typed domain interface** that represents the capabilities of the application under test. Playwright and UI concerns (selectors, waits) are isolated behind that interface.

## Architecture

- Tests express business intent against a domain interface.
- The domain interface (`RequestFormApp`) defines capabilities like `startNewRequest()`, `addItem()`, `compute()`.
- Implementations adapt those capabilities to the UI using Playwright:
  - Driver uses small focused page objects internally and exposes domain methods.
  - Screenplay uses `Actor`, `Tasks`, and `Questions` composed over the same domain.

Only the adapter layer “knows” about Playwright’s selectors, waits and retries. Tests remain UI-agnostic.

## Design Rationale

- Coexistence: Driver and Screenplay both target the same typed domain interface so teams can choose the style that best fits the scope and audience of a test while keeping behaviour consistent.
- Driver: Minimal, pragmatic, and fast to write. Domain methods map directly to UI actions via small page objects hidden behind the adapter. Great for unit-like business flows and lean suites.
- Screenplay: Composable and expressive. `Actor`, `Tasks`, and `Questions` improve readability at scale and encourage reuse of intent-focused actions. Ideal when scenarios grow, when many roles exist, or when you want richer reporting semantics.
- Guidance: Start with Driver for most flows; adopt Screenplay where composition and readability offer clear benefits. Both remain thin veneers over the same capabilities (`startNewRequest()`, `addItem()`, `compute()`).
- Page Objects: Used internally by adapters only. Tests never depend on selectors or widget vocabulary, keeping them resilient to UI reshuffles.
- Determinism: Network interception returns controlled results to keep tests fast and predictable while still exercising full user flows.

## The application under test

A minimal but realistic request form UI is included under `app/` (Vite + TypeScript). It models:

- Starting a new request
- Adding items (side, type, strike, expiry, quantity)
- Computing a result via an external POST request to `http://service.local/compute`

Why the network interception exists: the UI depends on an external compute service to produce results. In tests, we intercept that POST call and return a controlled payload. This keeps tests deterministic, fast, and isolated from real backends while still exercising the full user flow (clicks, waits, rendering).

## Test examples

Driver (intent-focused):

```ts
await app.startNewRequest();
await app.addItem(itemA);
await app.addItem(itemB);
const result = await app.compute();
```

Screenplay (actor/tasks/questions):

```ts
const trader = new Actor('Trader', fixture.app);
await trader.attemptsTo(
  new StartNewRequest(),
  new AddItem(itemA),
  new AddItem(itemB),
  new Compute()
);
expect(await trader.asks(new ResultStatus())).toBe('PRICED');
```

## Running locally

### Prerequisites

- Node.js 22+
- pnpm 9+
- Playwright browsers installed: `pnpm exec playwright install --with-deps chromium`

### Commands

Install:

```bash
pnpm install
```

Run tests:

```bash
pnpm test
```

## Dev Container

This project is designed to run inside a Dev Container.

### Headed vs headless execution

- Headless mode works inside the Dev Container by default.
- Headed mode does not, unless:
  - You are running on macOS and executing on the host machine, or
  - You provide an X server on the host and forward X11.

If you need headed mode, run Playwright on the host machine.

The Dev Container forwards the X11 port (`6000`) and passes through `DISPLAY`, but does not include an X server.

## Tests and environments

Tests are written against a single domain interface and run identically across environments. Choose the environment via `APP_ADAPTER`.

- `chromium` (default): launches a local dev server and runs Playwright Chromium.
- `openfin`: connects over CDP to an existing OpenFin runtime and page.
- `mock`: runs against a pure in-memory implementation (no browser).

### Quick start

- Chromium business suites:

```bash
pnpm test:e2e:chromium
```

- OpenFin business suites (see OpenFin section below first):

```bash
pnpm test:e2e:openfin
```

- Full suite (unit + business on Chromium):

```bash
pnpm test
```

## OpenFin (manual)

OpenFin is not supported inside the Linux dev container; run OpenFin on a supported host (e.g., Windows). Tests connect to OpenFin via the Chrome DevTools Protocol (CDP).

### Setup

1. Serve the app (inside the dev container or host):

```bash
pnpm preview
```

2. Launch OpenFin with remote debugging enabled (e.g., `--remote-debugging-port=9222`) and open the app URL you’re serving (e.g., http://127.0.0.1:5500).

3. Run the tests from the dev container. The script will auto-detect `OPENFIN_CDP_URL` and set `APP_ADAPTER=openfin`:

```bash
pnpm test:e2e:openfin
```

You can also run manually:

```bash
APP_ADAPTER=openfin APP_BASE_URL=http://127.0.0.1:5500 OPENFIN_CDP_URL=ws://<host>:9222/devtools/browser/<id> pnpm vitest run tests/driver/business/*.spec.ts tests/screenplay/business/*.spec.ts
```

## CI (GitHub Actions)

The workflow installs dependencies, installs Chromium for Playwright, and runs Vitest.

## Project layout

- Business tests (pattern-first):
  - Driver: [tests/driver/business](tests/driver/business)
  - Screenplay: [tests/screenplay/business](tests/screenplay/business)
- Adapters and fixtures:
  - Chromium adapter: [tests/app/chromium-form-app.ts](tests/app/chromium-form-app.ts)
  - OpenFin adapter: [tests/app/openfin-form-app.ts](tests/app/openfin-form-app.ts)
  - Unified fixture: [tests/helpers/app-fixture.ts](tests/helpers/app-fixture.ts)
  - Page objects: [tests/driver/page-objects](tests/driver/page-objects)
- Shared domain model:
  - Domain types and status constants: [app/src/types.ts](app/src/types.ts)
  - Test-side domain and interceptor interface: [tests/shared/domain/models.ts](tests/shared/domain/models.ts), [tests/shared/interfaces/pricing-interceptor.ts](tests/shared/interfaces/pricing-interceptor.ts)

## Network interception

Tests exercise the full user flow and intercept the UI’s POST to `http://service.local/compute` via a shared interface.

- Chromium: wired in [installPricingInterceptor()](tests/app/chromium-form-app.ts#L57)
- OpenFin: wired in [installPricingInterceptor()](tests/app/openfin-form-app.ts#L93-L121)

Provide `expectedUrl`, `response`, and optional `onRequest(payload)` to the unified fixture. The same interceptor config is used across environments.
