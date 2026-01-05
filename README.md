# Playwright Domain-Driven Testing Example

[![CI](https://github.com/milesburton/domain-driven-ui-testing/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/milesburton/domain-driven-ui-testing/actions/workflows/ci.yml)
[![Coverage Status](https://codecov.io/gh/milesburton/domain-driven-ui-testing/branch/main/graph/badge.svg)](https://codecov.io/gh/milesburton/domain-driven-ui-testing)
[![OpenFin (manual)](https://github.com/milesburton/domain-driven-ui-testing/actions/workflows/openfin.yml/badge.svg?branch=main)](https://github.com/milesburton/domain-driven-ui-testing/actions/workflows/openfin.yml)
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

````
Tests (express business intent)
   ↓
Typed Domain Interface (RequestFormApp)
   ↓
## OpenFin (optional)

ELIF5: From the dev container + Windows host (Git Bash only)

1. In the dev container, serve the app and manifest:

   ```bash
   # Choose one free app port, e.g. 5180, and use it everywhere
   APP_PORT=5180 pnpm preview:custom -- --port "$APP_PORT"
   APP_PORT=5180 pnpm openfin:port
   pnpm manifest:serve   # manifest on 6002
````

2. On the Windows host, launch OpenFin with the manifest URL:

   ```powershell
   # Git Bash: use RVM for reliable launches
   curl -L -o OpenFinRVM.zip https://cdn.openfin.co/release/rvm/latest
   unzip OpenFinRVM.zip -d openfin_rvm
   cmd //c "openfin_rvm\\OpenFinRVM.exe --config=http://127.0.0.1:6002/openfin.app.json"
   ```

3. Back in the dev container, run the OpenFin tests:

   ```bash
   pnpm test:e2e:openfin
   ```

Notes:

- The OpenFin adapter connects over CDP. In the dev container it defaults to `http://host.docker.internal:9222`; on Windows it defaults to `http://localhost:9222`.
- If needed, override CDP explicitly:

  ```bash
  export OPENFIN_CDP_URL=http://<windows-host-ip>:9222
  ```

## Playwright (Chromium) tests

ELIF5: Run from the dev container

```bash
pnpm test:e2e:chromium
```

Or run the full suite:

```bash
pnpm test
```

- Option A — Local file (repo on host): run from the repo folder on Windows host.

```powershell
npx openfin-cli@latest --launch --manifest-file openfin.app.json
```

- Option B — Manifest URL (no repo on host): serve the manifest from the container (on port 6002), then launch with URL.

  In the dev container:

  ```bash
  pnpm manifest:serve
  ```

  On the Windows host:

  ```powershell
  npx openfin-cli@latest --launch --manifest-url http://localhost:6002/openfin.app.json
  ```

3. Run OpenFin tests:

   ```powershell
   $env:OPENFIN = "1"
   pnpm vitest run tests/business/*.openfin.spec.ts
   ```

Notes:

- OpenFin is not supported inside the Linux dev container; use a Windows machine or CI runner.
- A dedicated Windows workflow can be added to run these tests on `windows-latest`.

### Running OpenFin from the dev container (Windows host)

If you develop inside a Linux dev container on a Windows host (WSL/Docker Desktop), run OpenFin on the host and drive it from the container over CDP:

1. In the dev container, serve the app (it binds to `0.0.0.0:6000`):

   ```bash
   pnpm preview
   ```

2. On the Windows host, launch OpenFin pointing at the manifest:

   ```powershell
   npx openfin-cli@latest --launch --manifest-file openfin.app.json
   ```

3. Back in the dev container, run the OpenFin specs. On Linux the adapter defaults CDP to `http://host.docker.internal:9222`, so you typically only need:

   ```bash
   export OPENFIN=1
   pnpm vitest run tests/business/*.openfin.spec.ts
   ```

   If needed, override explicitly:

   ```bash
   export OPENFIN=1
   export OPENFIN_CDP_URL=http://<windows-host-ip>:9222
   pnpm vitest run tests/business/*.openfin.spec.ts
   ```

```

```
