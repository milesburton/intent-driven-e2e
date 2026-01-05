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
    // Map item values to whichever option set is present (neutral IN/OUT,A/B or legacy BUY/SELL,CALL/PUT)
    const sideSelect = this.page.locator(`[data-testid="item-side-${index}"]`);
    const sideOptions = await sideSelect.locator('option').allTextContents();
    const sideValue = sideOptions.includes(item.side)
      ? item.side
      : item.side === 'IN'
        ? 'BUY'
        : item.side === 'OUT'
          ? 'SELL'
          : item.side;
    await sideSelect.selectOption(sideValue);

    const typeSelect = this.page.locator(`[data-testid="item-type-${index}"]`);
    const typeOptions = await typeSelect.locator('option').allTextContents();
    const typeValue = typeOptions.includes(item.type)
      ? item.type
      : item.type === 'A'
        ? 'CALL'
        : item.type === 'B'
          ? 'PUT'
          : item.type;
    await typeSelect.selectOption(typeValue);
    await this.page.locator(`[data-testid="item-strike-${index}"]`).fill(String(item.strike));
    await this.page.locator(`[data-testid="item-expiry-${index}"]`).fill(item.expiry);
    await this.page.locator(`[data-testid="item-qty-${index}"]`).fill(String(item.quantity));
  }
}
