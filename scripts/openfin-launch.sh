#!/usr/bin/env bash

# Install OpenFin if not already installed
if [ ! -f "$LOCALAPPDATA/OpenFin/OpenFinRVM.exe" ]; then
  curl -sL -o "$TEMP/OpenFinRVM.zip" https://cdn.openfin.co/release/rvm/latest && \
  unzip -oq "$TEMP/OpenFinRVM.zip" -d "$TEMP/openfin_rvm"
fi

# Clear cache and launch
rm -rf "$LOCALAPPDATA/OpenFin/apps" "$LOCALAPPDATA/OpenFin/cache"
"${LOCALAPPDATA}/OpenFin/OpenFinRVM.exe" --config="http://127.0.0.1:6002/openfin.app.json" 2>/dev/null || \
"$TEMP/openfin_rvm/OpenFinRVM.exe" --config="http://127.0.0.1:6002/openfin.app.json"
