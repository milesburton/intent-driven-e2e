import type { Browser, Page, Route, Request } from 'playwright';
import { chromium } from 'playwright';
import type { RequestFormApp } from '../shared/domain/request-form-app.interface';
import type { RequestItem, ComputeResult } from '../shared/domain/models';
import type { PricingInterceptor } from '../shared/interfaces/pricing-interceptor';
import { FormPage } from '../driver/page-objects/form-page';
import { safeJsonParse } from '../shared/helpers/utils';

export class OpenFinFormApp implements RequestFormApp {
  private readonly cdpUrl: string;
  private form: FormPage | null = null;
  private page: Page | null = null;
  private browser: Browser | null = null;

  public constructor(
    private readonly baseUrl: string,
    cdpUrl?: string,
    private readonly pricingInterceptor?: PricingInterceptor
  ) {
    const defaultCdpUrl =
      process.platform === 'linux' ? 'http://host.docker.internal:9222' : 'http://localhost:9222';
    this.cdpUrl = cdpUrl ?? process.env.OPENFIN_CDP_URL ?? defaultCdpUrl;
  }

  public async init(): Promise<void> {
    const resolvedUrl = await this.resolveCdpUrl(this.cdpUrl);
    const browser = await chromium.connectOverCDP(resolvedUrl);
    this.browser = browser;

    const allPages = browser.contexts().flatMap((c) => c.pages());
    let page: Page | undefined = allPages.find((p) => p.url().startsWith(this.baseUrl));

    if (!page) {
      const defaultContext = browser.contexts()[0];
      if (!defaultContext) throw new Error('No browser context available in OpenFin connection');
      page = await defaultContext.newPage();
    }

    this.page = page ?? null;
    this.form = new FormPage(page!);

    if (this.pricingInterceptor) {
      await this.installPricingInterceptor();
    }
    await this.form.goto(this.baseUrl);
  }

  public async startNewRequest(): Promise<void> {
    if (!this.form) throw new Error('Not initialised');
    await this.form.startNewRequest();
  }

  public async addItem(item: RequestItem): Promise<void> {
    if (!this.form) throw new Error('Not initialised');
    const index = await this.form.items.addItem();
    await this.form.items.fillItem(index, item);
  }

  public async compute(): Promise<ComputeResult> {
    if (!this.form) throw new Error('Not initialised');
    await this.form.clickCompute();
    return await this.form.results.waitForResult();
  }

  public async dispose(): Promise<void> {
    await this.browser?.close();
    this.browser = null;
    this.page = null;
    this.form = null;
  }

  private async resolveCdpUrl(cdpUrl: string): Promise<string> {
    if (cdpUrl.startsWith('ws://') || cdpUrl.startsWith('wss://')) {
      return cdpUrl;
    }

    const tryEndpoints = ['json/version', 'json', 'json/list'];
    for (const ep of tryEndpoints) {
      try {
        const url = new URL(cdpUrl);
        url.pathname = `/${ep}`;
        const res = await fetch(url, { method: 'GET' });
        if (!res.ok) continue;
        const body = await res.json();
        if (ep === 'json/version' && body?.webSocketDebuggerUrl) {
          return body.webSocketDebuggerUrl as string;
        }
        if (
          (ep === 'json' || ep === 'json/list') &&
          Array.isArray(body) &&
          body[0]?.webSocketDebuggerUrl
        ) {
          return body[0].webSocketDebuggerUrl as string;
        }
      } catch {
        continue;
      }
    }

    try {
      const res = await fetch(cdpUrl, { method: 'GET' });
      if (!res.ok) {
        throw new Error(
          `OpenFin DevTools at ${cdpUrl} returned status ${res.status}. Provide ws:// via OPENFIN_CDP_URL.`
        );
      }
    } catch {
      throw new Error(
        `Cannot reach OpenFin DevTools at ${cdpUrl}. Ensure runtime arguments include --remote-debugging-port=9222 and consider ws:// URL via OPENFIN_CDP_URL.`
      );
    }
    return cdpUrl;
  }

  private async installPricingInterceptor(): Promise<void> {
    if (!this.page || !this.pricingInterceptor) return;
    const expected = this.pricingInterceptor.expectedUrl;
    await this.page.route(expected, async (route: Route, request: Request) => {
      if (request.method() !== 'POST') {
        await route.fallback();
        return;
      }

      const postData = request.postData() ?? '';
      const payload: unknown = safeJsonParse(postData);

      this.pricingInterceptor!.onRequest?.(payload);

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(this.pricingInterceptor!.response)
      });
    });
  }
}
