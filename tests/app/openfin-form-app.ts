import type { Browser, Page } from 'playwright';
import { chromium } from 'playwright';
import type { RequestFormApp } from '../domain/request-form-app.interface';
import type { RequestItem, ComputeResult } from '../domain/models';
import { FormPage } from '../page-objects/form-page';

export class OpenFinFormApp implements RequestFormApp {
  private readonly cdpUrl: string;
  private form: FormPage | null = null;
  private page: Page | null = null;
  private browser: Browser | null = null;

  public constructor(
    private readonly baseUrl: string,
    cdpUrl?: string
  ) {
    const defaultCdpUrl =
      process.platform === 'linux' ? 'http://host.docker.internal:9222' : 'http://localhost:9222';
    this.cdpUrl = cdpUrl ?? process.env.OPENFIN_CDP_URL ?? defaultCdpUrl;
  }

  public async init(): Promise<void> {
    const browser = await chromium.connectOverCDP(this.cdpUrl);
    this.browser = browser;

    // Find a page that matches our baseUrl; otherwise open a new one.
    const allPages = browser.contexts().flatMap((c) => c.pages());
    let page: Page | undefined = allPages.find((p) => p.url().startsWith(this.baseUrl));

    if (!page) {
      const defaultContext = browser.contexts()[0];
      if (!defaultContext) throw new Error('No browser context available in OpenFin connection');
      page = await defaultContext.newPage();
      await page.goto(this.baseUrl, { waitUntil: 'domcontentloaded' });
    }

    this.page = page ?? null;
    this.form = new FormPage(page!);
    await this.form.goto(this.baseUrl);
  }

  public async startNewRequest(): Promise<void> {
    if (!this.form) throw new Error('Not initialized');
    await this.form.startNewRequest();
  }

  public async addItem(item: RequestItem): Promise<void> {
    if (!this.form) throw new Error('Not initialized');
    const index = await this.form.items.addItem();
    await this.form.items.fillItem(index, item);
  }

  public async compute(): Promise<ComputeResult> {
    if (!this.form) throw new Error('Not initialized');
    await this.form.clickCompute();
    return await this.form.results.read();
  }

  public async dispose(): Promise<void> {
    await this.browser?.close();
    this.browser = null;
    this.page = null;
    this.form = null;
  }
}
