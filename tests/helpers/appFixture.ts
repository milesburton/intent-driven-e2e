import { beforeAll, afterAll } from 'vitest';
import { chromium, type Browser, type Page } from 'playwright';
import type { RequestFormApp } from '../shared/domain/request-form-app.interface';
import { ChromiumFormApp } from '../app/chromium-form-app';
import { OpenFinFormApp } from '../app/openfin-form-app';
import { MockFormApp } from '../app/mock-form-app';
import { startViteAppServer, type RunningServer } from '../driver/fixtures/server';

export interface AppFixture {
  readonly app: RequestFormApp;
}

type Adapter = 'chromium' | 'openfin' | 'mock';

function getAdapter(): Adapter {
  const raw = (process.env.APP_ADAPTER || '').toLowerCase();
  if (raw === 'openfin' || raw === 'mock') return raw as Adapter;
  return 'chromium';
}

export function createAppFixture(interceptor?: {
  expectedUrl: string;
  onRequest?: (payload: unknown) => void;
  response: { status: 'PRICED' | 'FAILED'; pv?: number; error?: string };
}): AppFixture {
  const adapter = getAdapter();

  let browser: Browser | null = null;
  let page: Page | null = null;
  let server: RunningServer | null = null;
  let app: RequestFormApp | null = null;

  beforeAll(async () => {
    if (adapter === 'chromium') {
      server = await startViteAppServer();
      browser = await chromium.launch({
        headless: true,
        args: ['--disable-gpu', '--disable-dev-shm-usage']
      });
      page = await browser.newPage();
      const chromiumApp = new ChromiumFormApp(
        page,
        server.baseUrl,
        interceptor ?? {
          expectedUrl: 'http://service.local/compute',
          response: { status: 'PRICED', pv: 123.45 }
        }
      );
      await chromiumApp.init();
      app = chromiumApp;
    } else if (adapter === 'openfin') {
      let baseUrl = process.env.APP_BASE_URL;
      if (!baseUrl) {
        // Fallback to local dev server if a base URL isn't provided
        server = await startViteAppServer();
        baseUrl = server.baseUrl;
      }
      const openfinApp = new OpenFinFormApp(
        baseUrl!,
        process.env.OPENFIN_CDP_URL,
        interceptor ?? {
          expectedUrl: 'http://service.local/compute',
          response: { status: 'PRICED', pv: 123.45 }
        }
      );
      await openfinApp.init();
      app = openfinApp;
    } else {
      app = new MockFormApp();
    }
  });

  afterAll(async () => {
    if (page) await page.close();
    if (browser) await browser.close();
    if (server) await server.close();
  });

  return {
    get app(): RequestFormApp {
      if (!app) throw new Error('App fixture not initialised');
      return app;
    }
  };
}
