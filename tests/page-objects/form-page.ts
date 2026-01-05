import type { Page } from 'playwright';
import { LineItemEditor } from './line-item-editor';
import { ComputeResults } from './compute-results';

export class FormPage {
  public readonly items: LineItemEditor;
  public readonly results: ComputeResults;

  public constructor(private readonly page: Page) {
    this.items = new LineItemEditor(page);
    this.results = new ComputeResults(page);
  }

  public async goto(baseUrl: string): Promise<void> {
    await this.page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
    await this.page.locator('[data-testid="trade-ticket"]').waitFor();
  }

  public async startNewRequest(): Promise<void> {
    await this.page.locator('[data-testid="new-ticket"]').click();
  }

  public async clickCompute(): Promise<void> {
    await this.page.locator('[data-testid="price"]').click();
  }
}
