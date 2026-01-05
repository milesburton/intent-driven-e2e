# Playwright Domain-Driven Testing Example

[![CI](https://github.com/milesburton/domain-driven-ui-testing/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/milesburton/domain-driven-ui-testing/actions/workflows/ci.yml)
[![Coverage Status](https://codecov.io/gh/milesburton/domain-driven-ui-testing/branch/main/graph/badge.svg)](https://codecov.io/gh/milesburton/domain-driven-ui-testing)
![Node](https://img.shields.io/badge/node-22.x-43853d?logo=node.js&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-9.x-f69220?logo=pnpm&logoColor=white)
![ESLint](https://img.shields.io/badge/eslint-enabled-4B32C3?logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)

## Overview

This repository demonstrates a pragmatic approach to end-to-end testing of a generic request form using Playwright **without coupling tests to UI structure**. This implements the Driver Pattern (ref: https://www.testmanagement.com/blog/2023/06/the-driver-pattern/).

Our objective is to abstract the user's intent, placing a trade for example, from the underlying implementation such as clicking a button. With a suitable abstraction it shouldn't matter what is under test, whether that be a web app, desktop GUI or a Bloomberg terminal.

In this example we have a mock web app. The tests use a Page Object or Screenplay-style Tasks to interact with the page, but we do not expose the underlying implementation to the test author.

We achieve this by introducing a **typed domain interface** that represents the capabilities of the application under test. Playwright and UI concerns are isolated behind that interface.

## Architecture

```
Tests (express business intent)
   ↓
Typed Domain Interface (RequestFormApp)
   ↓
Driver (Playwright implementation)
   ↓
Page Objects (selectors, waits, retries)
```

Only the driver layer knows Playwright exists.

## The application under test

A minimal request UI is included under `app/` (Vite + TypeScript). It models:

- Creating a new request
- Adding items (side/kind/value fields)
- Computing a result via an external POST request:
  - `http://service.local/compute`

The compute endpoint is intentionally fake. Tests intercept the POST request and provide a controlled response.

## Test example

Tests depend on the domain interface:

```ts
export interface RequestFormApp
```

A test reads like intent:
await app.addItem(itemB);
const result = await app.compute();

```

### Page Object Driver

- **Pros:** Simple mental model; direct mapping from intent to driver actions.
- **Example:** [Chromium spec](tests/business/price-two-option-legs.chromium.spec.ts) and [Mock spec](tests/business/price-two-option-legs.mock.spec.ts).

### Screenplay Pattern

- **What:** An `Actor` performs `Tasks` and answers `Questions` using the same `RequestFormApp`.
This repo demonstrates two complementary styles that both preserve business intent and hide UI specifics behind the `RequestFormApp` interface.
- **How:** Compose tasks like `StartNewRequest`, `AddItem`, `Compute`; query results via `ResultStatus`, `ResultValue`.
- **Pros:** Encourages reusability and a richer vocabulary of intent; easy to extend with abilities and memory.
- **Example:** [Chromium screenplay spec](tests/business/price-two-option-legs.chromium.screenplay.spec.ts) and [Mock screenplay spec](tests/business/price-two-option-legs.mock.screenplay.spec.ts).

### Comparison

- Both styles isolate UI details via `RequestFormApp` and keep tests at the business level.
- Page Object Driver suits small to medium suites; Screenplay scales better when you want reusable, composable tasks.
- You can mix both approaches in one repo; choose based on team preference and test complexity.

### Headed vs headless execution

- Headless mode works inside the Dev Container by default.
- Headed mode does not, unless:
  - You are running on macOS and executing on the host machine, or
  - You provide an X server on the host and forward X11.

If you need headed mode, run Playwright on the host machine.

The Dev Container forwards the X11 port (`6000`) and passes through `DISPLAY`, but does not include an X server.
```
