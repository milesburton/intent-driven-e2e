#!/usr/bin/env bash
set -euo pipefail

# Ensure we run from the repo root
cd "$(git rev-parse --show-toplevel)"

if [[ "${OPENFIN_PRECOMMIT:-1}" == "0" ]]; then
  echo "[pre-commit][openfin] disabled via OPENFIN_PRECOMMIT=0"
  exit 0
fi

echo "[pre-commit][openfin] checking availability..."

# If OPENFIN_CDP_URL is preset and a ws:// URL, prefer it
if [[ -n "${OPENFIN_CDP_URL:-}" && ( "$OPENFIN_CDP_URL" == ws://* || "$OPENFIN_CDP_URL" == wss://* ) ]]; then
  WS_URL="$OPENFIN_CDP_URL"
else
  WS_URL=$(node scripts/detect-openfin-cdp.mjs || true)
fi
if [[ -z "${WS_URL:-}" ]]; then
  echo "[pre-commit][openfin] not available, skipping OpenFin tests"
  exit 0
fi

echo "[pre-commit][openfin] detected DevTools endpoint: $WS_URL"
export OPENFIN=1
if [[ "$WS_URL" == ws://* || "$WS_URL" == wss://* ]]; then
  export OPENFIN_CDP_URL="$WS_URL"
else
  echo "[pre-commit][openfin] DevTools responded but no ws:// URL; skipping to avoid false failures"
  exit 0
fi

# Run only the OpenFin specs to keep hook fast
pnpm -s vitest run --dir tests tests/openfin/business/*.openfin.spec.ts
