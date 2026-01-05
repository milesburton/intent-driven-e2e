#!/usr/bin/env bash
set -euo pipefail

echo "[pre-commit][openfin] checking availability..."
WS_URL=$(node scripts/detect-openfin-cdp.mjs || true)
if [[ -z "${WS_URL:-}" ]];
then
  echo "[pre-commit][openfin] not available, skipping OpenFin tests"
  exit 0
fi

echo "[pre-commit][openfin] detected DevTools: $WS_URL"
export OPENFIN=1
export OPENFIN_CDP_URL="$WS_URL"

# Run only the OpenFin specs to keep hook fast
pnpm -s vitest run "tests/business/*.openfin.spec.ts"
