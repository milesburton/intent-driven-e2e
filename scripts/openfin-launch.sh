#!/usr/bin/env bash
set -euo pipefail

echo "[openfin] preparing host environment"

# Resolve TEMP and LOCALAPPDATA fallbacks for Git Bash
LOCALAPPDATA=${LOCALAPPDATA:-"/c/Users/$(whoami)/AppData/Local"}
TEMP=${TEMP:-${TMP:-"$LOCALAPPDATA/Temp"}}

MANIFEST_URL="http://127.0.0.1:6002/openfin.app.json"
RVM_LOCAL_EXE="$LOCALAPPDATA/OpenFin/OpenFinRVM.exe"
RVM_TEMP_DIR="$TEMP/openfin_rvm"
RVM_TEMP_ZIP="$TEMP/OpenFinRVM.zip"
RVM_TEMP_EXE="$RVM_TEMP_DIR/OpenFinRVM.exe"

echo "[openfin] checking manifest at $MANIFEST_URL"
if ! curl -fsS "$MANIFEST_URL" >/dev/null; then
  echo "[openfin] ERROR: cannot reach manifest at $MANIFEST_URL"
  echo "[openfin] ensure 'pnpm manifest:serve' is running in dev container (port 6002)"
  exit 1
fi

if [ -f "$RVM_LOCAL_EXE" ]; then
  echo "[openfin] found installed RVM: $RVM_LOCAL_EXE"
else
  echo "[openfin] downloading OpenFin RVM to $RVM_TEMP_ZIP"
  curl -fsSL -o "$RVM_TEMP_ZIP" https://cdn.openfin.co/release/rvm/latest
  echo "[openfin] extracting to $RVM_TEMP_DIR"
  mkdir -p "$RVM_TEMP_DIR"
  unzip -oq "$RVM_TEMP_ZIP" -d "$RVM_TEMP_DIR"
fi

echo "[openfin] clearing local cache"
rm -rf "$LOCALAPPDATA/OpenFin/apps" "$LOCALAPPDATA/OpenFin/cache" || true

echo "[openfin] launching OpenFin RVM with manifest"
"$RVM_LOCAL_EXE" --config="$MANIFEST_URL" 2>/dev/null || "$RVM_TEMP_EXE" --config="$MANIFEST_URL"

echo "[openfin] done (RVM launched). If tests cannot attach, verify DevTools on port 9222."
