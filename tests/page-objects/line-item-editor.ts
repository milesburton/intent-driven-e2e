import type { Page } from 'playwright';
import type { RequestItem } from '../domain/models';

export class LineItemEditor {
  public constructor(private readonly page: Page) {}

  public async addItem(): Promise<number> {
    const before = await this.page.locator('[data-testid="items-body"] tr').count();
    await this.page.locator('[data-testid="add-item"]').click();
    const after = await this.page.locator('[data-testid="items-body"] tr').count();
    if (after !== before + 1) {
      throw new Error(`Expected item count to increment. Before=${before} After=${after}`);
    }
    return after - 1;
  }

  public async fillItem(index: number, item: RequestItem): Promise<void> {
    await this.page.locator(`[data-testid="item-side-${index}"]`).selectOption(item.side);
    await this.page.locator(`[data-testid="item-type-${index}"]`).selectOption(item.type);
    await this.page.locator(`[data-testid="item-strike-${index}"]`).fill(String(item.strike));
    await this.page.locator(`[data-testid="item-expiry-${index}"]`).fill(item.expiry);
    await this.page.locator(`[data-testid="item-qty-${index}"]`).fill(String(item.quantity));
  }
}
