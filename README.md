# Playwright Domain-Driven Testing Example

[![CI](https://github.com/milesburton/domain-driven-ui-testing/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/milesburton/domain-driven-ui-testing/actions/workflows/ci.yml)
[![Coverage Status](https://codecov.io/gh/milesburton/domain-driven-ui-testing/branch/main/graph/badge.svg)](https://codecov.io/gh/milesburton/domain-driven-ui-testing)
[![OpenFin (manual)](https://github.com/milesburton/domain-driven-ui-testing/actions/workflows/openfin.yml/badge.svg?branch=main)](https://github.com/milesburton/domain-driven-ui-testing/actions/workflows/openfin.yml)
![Node](https://img.shields.io/badge/node-22.x-43853d?logo=node.js&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-9.x-f69220?logo=pnpm&logoColor=white)
![ESLint](https://img.shields.io/badge/eslint-enabled-4B32C3?logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)

## Overview

This repository demonstrates a pragmatic approach to end-to-end testing of a generic request form using Playwright **without coupling tests to UI structure**. This implements the Driver Pattern (ref: https://www.testmanagement.com/blog/2023/06/the-driver-pattern/) and includes Screenplay pattern examples using the same abstraction.

Our objective is to abstract the user's intent, placing a trade for example, from the underlying implementation such as clicking a button. With a suitable abstraction it shouldn't matter what is under test, whether that be a web app, desktop GUI or a Bloomberg terminal.

In this example we have a mock web app. The tests use a Page Object or Screenplay-style Tasks to interact with the page, but we do not expose the underlying implementation to the test author.

We achieve this by introducing a **typed domain interface** that represents the capabilities of the application under test. Playwright and UI concerns are isolated behind that interface.

## Architecture

    Tests (express business intent)
       ↓
    Typed Domain Interface (RequestFormApp)
       ↓
    Driver / Screenplay Tasks (Playwright implementation)
       ↓
    Page Objects (selectors, waits, retries)

Only the driver layer knows Playwright exists.

## The application under test

A minimal but realistic request form UI is included under `app/` (Vite + TypeScript). It models:

- Starting a new request
- Adding items (side, type, strike, expiry, quantity)
- Computing a result via an external POST request to `http://service.local/compute`

Why the network interception exists: the UI depends on an external compute service to produce results. In tests, we intercept that POST call and return a controlled payload. This keeps tests deterministic, fast, and isolated from real backends while still exercising the full user flow (clicks, waits, rendering).

## Test example

Tests depend on the domain interface:

```ts
export interface RequestFormApp {
  startNewRequest(): Promise<void>;
  addItem(item: RequestItem): Promise<void>;
  compute(): Promise<ComputeResult>;
}
```

A test reads like intent:

```ts
await app.startNewRequest();
await app.addItem(itemA);
await app.addItem(itemB);
const result = await app.compute();
```

No selectors. No UI widget vocabulary.

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
  - Unified fixture: [tests/helpers/appFixture.ts](tests/helpers/appFixture.ts)
  - Page objects: [tests/driver/page-objects](tests/driver/page-objects)
- Shared domain types and constants: [app/src/types.ts](app/src/types.ts)

## Network interception

Tests exercise the full user flow and intercept the UI’s POST to `http://service.local/compute` via a shared interface:

- Chromium: wired in [installPricingInterceptor()](tests/app/chromium-form-app.ts#L57)
- OpenFin: wired in [installPricingInterceptor()](tests/app/openfin-form-app.ts#L93-L121)

Provide `expectedUrl`, `response`, and optional `onRequest(payload)` to the unified fixture. The same interceptor config is used across environments.
