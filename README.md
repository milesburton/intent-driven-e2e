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

- Creating a new ticket
- Adding option legs (BUY/SELL, CALL/PUT, strike, expiry, quantity)
- Pricing the ticket via an external POST request to `http://pricing.acmibank/price`

The pricing endpoint is intentionally fake. Tests intercept the POST request and provide a controlled response.

## Test example

Tests depend on the domain interface:

```ts
export interface RequestFormApp {
  startNewTicket(): Promise<void>;
  addOptionLeg(leg: OptionLeg): Promise<void>;
  price(): Promise<PricingResult>;
}
```

A test reads like intent:

```ts
await app.startNewTicket();
await app.addOptionLeg(buyCall);
await app.addOptionLeg(sellCall);
const result = await app.price();
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
pnpm exec playwright install --with-deps chromium
```

Run tests:

```bash
pnpm test
```

Run the app manually:

```bash
pnpm dev
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

## Playwright (Chromium) tests

ELI5: Run from the dev container

```bash
pnpm test:e2e:chromium
```

Or run the full suite:

```bash
pnpm test
```

## OpenFin (optional)

OpenFin is not supported inside the Linux dev container; use a Windows machine or CI runner.

### Running the end-to-end tests using OpenFin

**Step 1.** In the dev container, serve the app and manifest:

```bash
pnpm preview
pnpm manifest:serve
```

**Step 2.** Download and run the script directly from the dev container (manifest server on 6002):

```bash
curl -sL http://127.0.0.1:6002/scripts/openfin-launch.sh | bash
```

**Step 3.** Back in the dev container, run the OpenFin tests:

```bash
pnpm test:e2e:openfin
```

## CI (GitHub Actions)

The workflow installs dependencies, installs Chromium for Playwright, and runs Vitest.
