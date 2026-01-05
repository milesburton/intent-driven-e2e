import type { Page, Route, Request } from 'playwright';
import type { RequestFormApp } from '../domain/request-form-app.interface';
import type { OptionLeg, PricingResult } from '../domain/models';
import { TradeTicketPage } from '../page-objects/trade-ticket-page';

export interface PricingInterceptor {
  expectedUrl: string;
  onRequest?: (payload: unknown) => void;
  response: { status: 'PRICED' | 'FAILED'; pv?: number; error?: string };
}

function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return { parseError: true };
  }
}

export class ChromiumFormApp implements RequestFormApp {
  private readonly ticket: TradeTicketPage;

  public constructor(
    private readonly page: Page,
    private readonly baseUrl: string,
    private readonly pricingInterceptor: PricingInterceptor
  ) {
    this.ticket = new TradeTicketPage(page);
  }

  public async init(): Promise<void> {
    await this.installPricingInterceptor();
    await this.ticket.goto(this.baseUrl);
  }

  public async startNewTicket(): Promise<void> {
    await this.ticket.startNewTicket();
  }

  public async addOptionLeg(leg: OptionLeg): Promise<void> {
    const index = await this.ticket.legs.addLeg();
    await this.ticket.legs.fillLeg(index, leg);
  }

  public async price(): Promise<PricingResult> {
    await this.ticket.clickPrice();

    await this.page.waitForFunction(() => {
      const el = document.querySelector('[data-testid="pricing-status"]');
      const t = el?.textContent?.trim();
      return t === 'PRICED' || t === 'FAILED';
    });

    return await this.ticket.pricing.read();
  }

  private async installPricingInterceptor(): Promise<void> {
    const expected = this.pricingInterceptor.expectedUrl;

    await this.page.route(expected, async (route: Route, request: Request) => {
      if (request.method() !== 'POST') {
        await route.fallback();
        return;
      }

      const postData = request.postData() ?? '';
      const payload: unknown = safeJsonParse(postData);

      this.pricingInterceptor.onRequest?.(payload);

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(this.pricingInterceptor.response)
      });
    });
  }
}
