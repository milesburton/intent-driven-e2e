import { beforeAll, afterAll } from 'vitest';
import { chromium, type Browser, type Page } from 'playwright';
import type { RequestFormApp } from '../shared/domain/request-form-app.interface';
import type { RequestItem, ComputeResult } from '../shared/domain/models';
import { ChromiumFormApp } from '../app/chromium-form-app';
import { OpenFinFormApp } from '../app/openfin-form-app';
import { MockFormApp } from '../app/mock-form-app';
import { startViteAppServer, type RunningServer } from '../driver/fixtures/server';
import type { ComputeInterceptor } from '../shared/interfaces/pricing-interceptor';
import { STATUS_COMPLETED } from '../shared/domain/models';
import { resolveAdapter } from '../shared/helpers/utils';

export interface AppFixture {
  readonly app: RequestFormApp;
}

export function createAppFixture(interceptor?: ComputeInterceptor): AppFixture {
  const adapter = resolveAdapter();

  let browser: Browser | null = null;
  let page: Page | null = null;
  let server: RunningServer | null = null;
  let app: RequestFormApp | null = null;
  class AppWrapper implements RequestFormApp {
    public constructor(
      private readonly impl: RequestFormApp,
      private readonly page: Page | null
    ) {}
    public async startNewRequest(): Promise<void> {
      return this.impl.startNewRequest();
    }
    public async addItem(item: RequestItem): Promise<void> {
      return this.impl.addItem(item);
    }
    public async compute(): Promise<ComputeResult> {
      return this.impl.compute();
    }
    public async removeItem(index: number): Promise<void> {
      const candidate: unknown = (
        this.impl as unknown as { removeItem?: (i: number) => Promise<void> }
      ).removeItem;
      if (typeof candidate === 'function') {
        return candidate.call(this.impl, index);
      }
      if (!this.page) throw new Error('Cannot remove item: no page available');
      const before = await this.page.locator('[data-testid="items-body"] tr').count();
      await this.page.locator(`[data-testid="item-remove-${index}"]`).click();
      await this.page.waitForFunction((expected: number) => {
        const body = document.querySelector('[data-testid="items-body"]');
        if (!body) return false;
        return body.querySelectorAll('tr').length === expected - 1;
      }, before);
    }
  }

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
          response: { status: STATUS_COMPLETED, value: 123.45 }
        }
      );
      await chromiumApp.init();
      app = new AppWrapper(chromiumApp, page);
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
          response: { status: STATUS_COMPLETED, value: 123.45 }
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
