# Playwright Domain-Driven Testing Example

## Overview

This repository demonstrates a pragmatic approach to end-to-end testing of an OpenFin trade ticket using Playwright **without coupling tests to UI structure**. This implements the Driver Pattern (ref: https://www.testmanagement.com/blog/2023/06/the-driver-pattern/).

Our objective is to abstract the user's intent, placing a trade for example, from the underlying implementation such as clicking a button. With a suitable abstraction it shouldn't matter what is under test, whether that be a web app, desktop GUI or a Bloomberg terminal.

In this example we have a mock webapp which is presented within an OpenFin container. The tests use a Page Object to interact with the page, but we do not want to expose the underlying implementation to the test author.

We achieve this by introducing a **typed domain interface** that represents the capabilities of the application under test. Playwright and UI concerns are isolated behind that interface.

## Architecture

```
Tests (express business intent)
   ↓
Typed Domain Interface (TradeTicketApp)
   ↓
Driver (Playwright implementation)
   ↓
Page Objects (selectors, waits, retries)
```

Only the driver layer knows Playwright exists.

## The application under test

A minimal but realistic trade ticket UI is included under `app/` (Vite + TypeScript). It models:

- Creating a new ticket
- Adding option legs (BUY/SELL, CALL/PUT, strike, expiry, quantity)
- Pricing the ticket via an external POST request:
  - `http://pricing.acmibank/price`

The pricing endpoint is intentionally fake. Tests intercept the POST request and provide a controlled response.

## Test example

Tests depend on the domain interface:

```ts
export interface TradeTicketApp {
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

- Node.js 20+
- pnpm 9+
- Playwright browsers installed:
  - `pnpm exec playwright install --with-deps chromium`

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

## CI (GitHub Actions)

The workflow installs dependencies, installs Chromium for Playwright, and runs Vitest.
