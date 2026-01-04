# Playwright Domain-Driven Testing Example (Trade Ticket)

## Overview

This repository demonstrates a pragmatic approach to end-to-end testing of a Chromium/OpenFin-style trade ticket using Playwright **without coupling business tests to UI structure**.

The key constraint is simple:

- Page Objects are necessary.
- Page Objects should not appear in business tests.
- Tests should express **business intent**, not UI mechanics.

This is achieved by introducing a **typed domain interface** that represents the capabilities of the application under test. Playwright and UI concerns are isolated behind that interface.

## Architecture

```
Business Tests
   ↓
Typed Domain Interface (TradeTicketApp)
   ↓
Application Adapter (Playwright implementation)
   ↓
Page Objects (selectors, waits, retries)
```

Only the adapter layer knows Playwright exists.

## The application under test

A minimal but realistic trade ticket UI is included under `app/` (Vite + TypeScript). It models:

- Creating a new ticket
- Adding option legs (BUY/SELL, CALL/PUT, strike, expiry, quantity)
- Pricing the ticket via an external POST request:
  - `http://pricing.acmibank/price`

The pricing endpoint is intentionally fake. Tests intercept the POST request and provide a controlled response.

## Business-level test example

Business tests depend on the domain interface:

```ts
export interface TradeTicketApp {
  startNewTicket(): Promise<void>;
  addOptionLeg(leg: OptionLeg): Promise<void>;
  price(): Promise<PricingResult>;
}
```

A business test reads like intent:

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
