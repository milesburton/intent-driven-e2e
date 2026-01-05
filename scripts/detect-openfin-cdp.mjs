#!/usr/bin/env node
// Detect OpenFin DevTools websocket URL and print it to stdout.
// Tries common endpoints and hosts; exits 0 with URL on success, 2 on not found, 1 on unexpected error.

import http from 'node:http';

function getJson(url, timeoutMs = 400) {
  return new Promise((resolve, reject) => {
    const req = http.get(url, (res) => {
      const { statusCode } = res;
      const contentType = res.headers['content-type'] || '';
      let raw = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => (raw += chunk));
      res.on('end', () => {
        if (statusCode !== 200) return resolve({ ok: false, status: statusCode });
        try {
          const data = contentType.includes('application/json') ? JSON.parse(raw) : JSON.parse(raw);
          resolve({ ok: true, data });
        } catch (e) {
          resolve({ ok: false, status: statusCode });
        }
      });
    });
    req.on('error', (err) => resolve({ ok: false, error: err }));
    req.setTimeout(timeoutMs, () => {
      req.destroy(new Error('timeout'));
    });
  });
}

async function detect() {
  const isLinux = process.platform === 'linux';
  const hosts = [process.env.OPENFIN_HOST || (isLinux ? 'host.docker.internal' : '127.0.0.1')];
  const port = process.env.OPENFIN_PORT || '9222';
  const url = `http://${hosts[0]}:${port}/json/version`;
  const res = await getJson(url);
  if (res.ok && res.data?.webSocketDebuggerUrl) return res.data.webSocketDebuggerUrl;
  return null;
}

detect()
  .then((url) => {
    if (url) {
      process.stdout.write(String(url));
      process.exit(0);
    } else {
      process.exit(2);
    }
  })
  .catch(() => process.exit(1));
