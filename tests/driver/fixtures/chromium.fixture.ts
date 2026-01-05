import { chromium, type Browser, type Page } from 'playwright';
import { beforeAll, afterAll } from 'vitest';
import type { RunningServer } from './server';
import { startViteAppServer } from './server';
import { ChromiumFormApp } from '../../app/chromium-form-app';
import type { PricingInterceptor } from '../../shared/interfaces/pricing-interceptor';
import type { RequestFormApp } from '../../shared/domain/request-form-app.interface';

export interface ChromiumFixture {
  readonly app: RequestFormApp;
}

export function createChromiumFixture(interceptor: PricingInterceptor): ChromiumFixture {
  let browser: Browser | null = null;
  let page: Page | null = null;
  let server: RunningServer | null = null;
  let app: ChromiumFormApp | null = null;

  beforeAll(async () => {
    server = await startViteAppServer();
    browser = await chromium.launch({
      headless: true,
      args: ['--disable-gpu', '--disable-dev-shm-usage']
    });
    page = await browser.newPage();

    app = new ChromiumFormApp(page, server.baseUrl, interceptor);
    await app.init();
  });

  afterAll(async () => {
    if (page) await page.close();
    if (browser) await browser.close();
    if (server) await server.close();
  });

  return {
    get app(): RequestFormApp {
      if (!app) throw new Error('Chromium fixture not initialised');
      return app;
    }
  };
}
