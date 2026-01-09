# Running Playwright in Headed Mode

## Quick Start (From WSL2 Terminal)

Open a **new WSL2 terminal** (not the VS Code devcontainer) and run:

```bash
# Navigate to the project
cd ~/domain-driven-ui-testing  # or wherever your project is

# Ensure dependencies are installed
pnpm install

# Build the app
pnpm build

# Run a single test in HEADED mode - browser will appear!
npx playwright test --headed tests/driver/business/compute-one-item.spec.ts
```

The Chromium browser window will appear on your Windows desktop thanks to WSLg! You'll see:
- ✅ **"Compute" button** (not "Price")
- ✅ **"COMPLETED" status** (not "PRICED")
- ✅ All generic terminology

## Interactive UI Mode (Even Better)

For the best debugging experience:

```bash
npx playwright test --ui
```

This opens an interactive UI where you can:
- Select which test to run
- See a visual timeline
- Step through the test
- Inspect network requests
- View screenshots/videos

## Running from the Devcontainer

If you want to run headed mode from inside the devcontainer:

1. **Rebuild the container** with the WSLg mounts:
   - Press `Ctrl+Shift+P` in VS Code
   - Type "Dev Containers: Rebuild Container"
   - Select and wait for rebuild

2. **Run headed tests**:
   ```bash
   npx playwright test --headed tests/driver/business/compute-one-item.spec.ts
   ```

## What You'll See

When the browser opens, you'll observe:

1. **Initial page loads** with three buttons:
   - "New request"
   - "Add item"
   - **"Compute"** ← Changed from "Price"

2. **Test clicks "Add item"** twice
   - Two rows appear in the table

3. **Test clicks "Compute"**
   - Results section updates

4. **Result shows**:
   - Status: **COMPLETED** ← Changed from "PRICED"
   - Value: 123.45
   - Error: (empty)

All terminology is now generic - no pricing/finance terms!

## Verify the Changes

To see the refactoring in action, compare:

**Before (old code):**
- Button: "Price"
- Status: "PRICED"
- Interface: `PricingInterceptor`
- Function: `price()`

**After (new code):**
- Button: "Compute"
- Status: "COMPLETED"
- Interface: `ComputeInterceptor`
- Function: `compute()`

## Remember

Headed mode is **only for development/debugging**. All normal test runs (CI/CD, `pnpm test`, etc.) use headless mode by default, which is faster and doesn't require a display.
