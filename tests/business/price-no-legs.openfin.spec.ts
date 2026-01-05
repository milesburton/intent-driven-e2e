import { describe, test, expect } from 'vitest';
import { OpenFinFormApp } from '../app/openfin-form-app';

const isWindows = process.platform === 'win32';
const enabled = isWindows && process.env.OPENFIN === '1';

(enabled ? describe : describe.skip)('OpenFin adapter', () => {
  test('compute with no items returns FAILED (openfin adapter)', async () => {
    const baseUrl = 'http://127.0.0.1:6000';
    const app = new OpenFinFormApp(baseUrl);
    await app.init();

    await app.startNewRequest();
    const result = await app.compute();

    expect(result.status).toBe('FAILED');
    expect(result.error).toBeDefined();

    await app.dispose();
  });
});
