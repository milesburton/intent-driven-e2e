import type { Page } from 'playwright';
import type { OptionLeg } from '../domain/models';

export class LineItemEditor {
  public constructor(private readonly page: Page) {}

  public async addItem(): Promise<number> {
    const before = await this.page.locator('[data-testid="legs-body"] tr').count();
    await this.page.locator('[data-testid="add-leg"]').click();
    const after = await this.page.locator('[data-testid="legs-body"] tr').count();
    if (after !== before + 1) {
      throw new Error(`Expected item count to increment. Before=${before} After=${after}`);
    }
    return after - 1;
  }

  public async fillItem(index: number, item: OptionLeg): Promise<void> {
    await this.page.locator(`[data-testid="leg-side-${index}"]`).selectOption(item.side);
    await this.page.locator(`[data-testid="leg-type-${index}"]`).selectOption(item.type);
    await this.page.locator(`[data-testid="leg-strike-${index}"]`).fill(String(item.strike));
    await this.page.locator(`[data-testid="leg-expiry-${index}"]`).fill(item.expiry);
    await this.page.locator(`[data-testid="leg-qty-${index}"]`).fill(String(item.quantity));
  }
}
