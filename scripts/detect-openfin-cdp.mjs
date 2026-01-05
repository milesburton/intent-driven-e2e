#!/usr/bin/env node
// Detect OpenFin DevTools websocket URL and print it to stdout.
// Order: honor OPENFIN_CDP_URL if provided, else probe common hosts/endpoints.
// Exits 0 with URL on success, 2 on not found, 1 on unexpected error.
import http from 'node:http';
import dns from 'node:dns/promises';

async function resolveHost(host) {
  // If already an IP, return as-is
  if (/^\d+\.\d+\.\d+\.\d+$/.test(host)) return host;
  try {
    const { address } = await dns.lookup(host);
    return address;
  } catch {
    return null;
  }
}

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
  // If user already provided a ws URL, trust and return it
  const provided = process.env.OPENFIN_CDP_URL;
  if (provided && (provided.startsWith('ws://') || provided.startsWith('wss://'))) {
    return provided;
  }
  const isLinux = process.platform === 'linux';
  const hosts = [
    process.env.OPENFIN_HOST || (isLinux ? 'host.docker.internal' : '127.0.0.1'),
    '127.0.0.1'
  ];
  const port = process.env.OPENFIN_PORT || '9222';
  const endpoints = ['json/version', 'json'];

  for (const host of hosts) {
    // Resolve hostname to IP to avoid Chrome's Host header rejection
    const ip = await resolveHost(host);
    if (!ip) continue;

    let anyHttp = false;
    for (const ep of endpoints) {
      const url = `http://${ip}:${port}/${ep}`;
      const res = await getJson(url);
      if (res.ok) {
        const body = res.data;
        if (ep === 'json/version' && body?.webSocketDebuggerUrl) {
          // Replace localhost/hostname in wsUrl with the resolved IP
          return body.webSocketDebuggerUrl.replace(/ws:\/\/[^:/]+/, `ws://${ip}`);
        }
        if (ep === 'json' && Array.isArray(body) && body[0]?.webSocketDebuggerUrl) {
          return body[0].webSocketDebuggerUrl.replace(/ws:\/\/[^:/]+/, `ws://${ip}`);
        }
        anyHttp = true;
      } else if (typeof res.status === 'number') {
        anyHttp = true;
      }
    }
    if (anyHttp) {
      return `http://${ip}:${port}`;
    }
  }
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