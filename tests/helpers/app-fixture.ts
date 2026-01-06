import { beforeAll, afterAll } from 'vitest';
import { chromium, type Browser, type Page } from 'playwright';
import type { RequestFormApp } from '../shared/domain/request-form-app.interface';
import { ChromiumFormApp } from '../app/chromium-form-app';
import { OpenFinFormApp } from '../app/openfin-form-app';
import { MockFormApp } from '../app/mock-form-app';
import { startViteAppServer, type RunningServer } from '../driver/fixtures/server';
import type { PricingInterceptor } from '../shared/interfaces/pricing-interceptor';
import { STATUS_PRICED } from '../shared/domain/models';
import { resolveAdapter } from '../shared/helpers/utils';

export interface AppFixture {
  readonly app: RequestFormApp;
}

export function createAppFixture(interceptor?: PricingInterceptor): AppFixture {
  const adapter = resolveAdapter();

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
          response: { status: STATUS_PRICED, pv: 123.45 }
        }
      );
      await chromiumApp.init();
      app = chromiumApp;
    } else if (adapter === 'openfin') {
      let baseUrl = process.env.APP_BASE_URL;
      if (!baseUrl) {
        server = await startViteAppServer();
        baseUrl = server.baseUrl;
      }
      const openfinApp = new OpenFinFormApp(
        baseUrl!,
        process.env.OPENFIN_CDP_URL,
        interceptor ?? {
          expectedUrl: 'http://service.local/compute',
          response: { status: STATUS_PRICED, pv: 123.45 }
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
