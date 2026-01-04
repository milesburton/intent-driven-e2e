import { chromium, type Browser, type Page } from 'playwright';
import { beforeAll, afterAll } from 'vitest';
import type { RunningServer } from './server';
import { startViteAppServer } from './server';
import { ChromiumTradeTicketApp, type PricingInterceptor } from '../app/ChromiumTradeTicketApp';
import type { TradeTicketApp } from '../domain/TradeTicketApp';

export interface ChromiumFixture {
  readonly app: TradeTicketApp;
}

export function createChromiumFixture(interceptor: PricingInterceptor): ChromiumFixture {
  let browser: Browser | null = null;
  let page: Page | null = null;
  let server: RunningServer | null = null;
  let app: ChromiumTradeTicketApp | null = null;

  beforeAll(async () => {
    server = await startViteAppServer();
    browser = await chromium.launch({ headless: true });
    page = await browser.newPage();

    app = new ChromiumTradeTicketApp(page, server.baseUrl, interceptor);
    await app.init();
  });

  afterAll(async () => {
    if (page) await page.close();
    if (browser) await browser.close();
    if (server) await server.close();
  });

  return {
    get app(): TradeTicketApp {
      if (!app) throw new Error('Chromium fixture not initialised');
      return app;
    }
  };
}
