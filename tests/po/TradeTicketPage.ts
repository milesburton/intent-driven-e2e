import type { Page } from 'playwright';
import { LegEditor } from './LegEditor';
import { PricingResults } from './PricingResults';

export class TradeTicketPage {
  public readonly legs: LegEditor;
  public readonly pricing: PricingResults;

  public constructor(private readonly page: Page) {
    this.legs = new LegEditor(page);
    this.pricing = new PricingResults(page);
  }

  public async goto(baseUrl: string): Promise<void> {
    await this.page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
    await this.page.locator('[data-testid="trade-ticket"]').waitFor();
  }

  public async startNewTicket(): Promise<void> {
    await this.page.locator('[data-testid="new-ticket"]').click();
  }

  public async clickPrice(): Promise<void> {
    await this.page.locator('[data-testid="price"]').click();
  }
}
