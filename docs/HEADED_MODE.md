# Playwright Headed Mode (Development Debugging Only)

## Purpose

Headed mode is **only for local development/debugging** - allowing developers to visually see what the browser is doing when developing or debugging tests.

**All actual test runs use headless mode:**
- ✅ CI/CD pipelines
- ✅ Devcontainer test execution
- ✅ `pnpm test` commands
- ✅ Pre-commit hooks

## When to Use Headed Mode

Use headed mode **only** when:
- Debugging a failing test
- Developing new test interactions
- Understanding what the browser is doing
- Verifying UI changes manually

## How to Run Headed Mode (Local Development Only)

### Option 1: From WSL2 Host (Recommended)

Since WSLg runs on the WSL2 host, run Playwright directly from WSL2 (not in the container):

```bash
# On your WSL2 terminal (outside container)
cd /path/to/domain-driven-ui-testing
pnpm install
pnpm build

# Run a single test in headed mode - browser window will appear
npx playwright test --headed tests/driver/business/compute-one-item.spec.ts

# Or use the Playwright UI mode for interactive debugging
npx playwright test --ui
```

The browser window will appear on your Windows desktop via WSLg automatically.

### Option 2: Rebuild Devcontainer with WSLg Mounts

If you want headed mode from inside the devcontainer:

1. The devcontainer.json already has WSLg mounts configured
2. Rebuild the devcontainer: Command Palette → "Dev Containers: Rebuild Container"
3. Run tests with `--headed` flag
4. Browser windows will appear on your Windows desktop

**Note:** This requires rebuilding the container, which is why Option 1 is usually faster for quick debugging.

### Option 3: macOS with XQuartz

For macOS developers:

1. Install XQuartz: `brew install --cask xquartz`
2. Configure XQuartz (see main README for details)
3. Run tests with `--headed` flag

## Default Test Execution (Headless)

All normal test commands run in **headless mode** by default:

```bash
# Headless (default) - no browser window
pnpm test
pnpm test:unit
pnpm test:e2e:chromium
pnpm test:validate

# The fixtures default to headless: true
```

The test fixtures are configured for headless:
- [chromium.fixture.ts](../tests/driver/fixtures/chromium.fixture.ts#L21-23): `headless: true`
- [app-fixture.ts](../tests/helpers/app-fixture.ts): Uses chromium.launch with `headless: true`

## CI/CD Usage

In CI/CD (GitHub Actions, etc.), tests **always run headless**:
- No X server needed
- Faster execution
- No display configuration required
- Tests run in standard Docker containers

## Playwright UI Mode (Best for Development)

For the best debugging experience, use Playwright's UI mode:

```bash
# From WSL2 host
npx playwright test --ui
```

This provides:
- Interactive test runner with visual timeline
- Step-through debugging
- Network request inspection
- Screenshot/video of test execution
- Much better than just `--headed`

## Why Not Use Headed Mode by Default?

Headed mode is **slower and requires display infrastructure**:
- ❌ Requires X server (WSLg/XQuartz/Xvfb)
- ❌ Slower test execution
- ❌ More resource intensive
- ❌ Can't run in standard CI environments
- ❌ Not needed for 99% of test runs

Headless mode is **fast and portable**:
- ✅ No display requirements
- ✅ Faster execution
- ✅ Works everywhere (CI/CD, containers, servers)
- ✅ Uses less resources
- ✅ Tests pass/fail the same way

## Summary

- **Development/Debugging**: Use headed mode from WSL2 host (or with Playwright UI mode)
- **All Other Times**: Use headless mode (the default)
- **CI/CD**: Always headless
- **Devcontainer**: Always headless (unless you specifically rebuild with WSLg for debugging)

The codebase is configured correctly - all normal test execution is headless by default. Headed mode is available when you need it for debugging, but it's an opt-in developer tool, not the default test execution mode.
