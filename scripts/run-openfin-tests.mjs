#!/usr/bin/env node
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const detectScript = resolve(__dirname, 'detect-openfin-cdp.mjs');

const cdpUrl = execSync(`node ${detectScript}`, { encoding: 'utf8' }).trim();
const args = process.argv.slice(2).join(' ');

execSync(`vitest run --dir tests ${args || 'tests/driver/business/*.spec.ts tests/screenplay/business/*.spec.ts'}`, {
  stdio: 'inherit',
  env: { ...process.env, OPENFIN_CDP_URL: cdpUrl, APP_ADAPTER: 'openfin' }
});