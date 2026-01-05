import { describe, beforeAll, afterAll } from 'vitest';
import { OpenFinFormApp } from '../app/openfin-form-app';

export const OPENFIN_ENABLED = process.env.OPENFIN === '1';

export const STATUS = {
  PRICED: 'PRICED' as const,
  FAILED: 'FAILED' as const
};

export async function withOpenFinApp<T>(
  fn: (app: OpenFinFormApp) => Promise<T>,
  baseUrl = 'http://127.0.0.1:5500'
): Promise<T> {
  const app = new OpenFinFormApp(baseUrl);
  await app.init();
  try {
    return await fn(app);
  } finally {
    await app.dispose();
  }
}

/**
 * Define a suite that initializes a shared OpenFinFormApp once and disposes it after.
 * Tests receive the `app` and `STATUS` via the factory callback.
 */
export function describeOpenFin(
  name: string,
  factory: (ctx: { getApp: () => OpenFinFormApp; STATUS: typeof STATUS }) => void,
  baseUrl = 'http://127.0.0.1:5500'
): void {
  const d = OPENFIN_ENABLED ? describe : (describe.skip as typeof describe);
  d(name, () => {
    let app: OpenFinFormApp | null = null;
    beforeAll(async () => {
      const instance = new OpenFinFormApp(baseUrl);
      await instance.init();
      app = instance;
    });
    afterAll(async () => {
      if (app) {
        await app.dispose();
        app = null;
      }
    });
    const getApp = (): OpenFinFormApp => {
      if (!app) throw new Error('OpenFin app not initialized');
      return app;
    };
    factory({ getApp, STATUS });
  });
}
