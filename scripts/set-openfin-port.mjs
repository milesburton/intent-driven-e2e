#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const argPort = process.argv[2];
const envPort = process.env.PORT || process.env.APP_PORT;
const port = Number(argPort || envPort || 5173);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  console.error(`Invalid port: ${argPort ?? envPort ?? ''}`);
  process.exit(1);
}

const manifestPath = resolve(__dirname, '..', 'openfin.app.json');
const raw = readFileSync(manifestPath, 'utf8');
const json = JSON.parse(raw);

const key = json.startup_app ? 'startup_app' : json.startupApp ? 'startupApp' : null;
if (!key) {
  console.error('No startup_app/startupApp section found in manifest');
  process.exit(1);
}

const startup = json[key];
try {
  const u = new URL(startup.url);
  u.host = `127.0.0.1:${port}`;
  startup.url = u.toString();
} catch {
  // If not a valid URL, fallback to simple replacement
  startup.url = `http://127.0.0.1:${port}`;
}

writeFileSync(manifestPath, JSON.stringify(json, null, 2) + '\n', 'utf8');
console.log(`Updated OpenFin startup URL to port ${port}`);
