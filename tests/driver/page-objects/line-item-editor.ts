import type { Page } from 'playwright';
import type { RequestItem } from '../../domain/models';

export class LineItemEditor {
  public constructor(private readonly page: Page) {}

  public async addItem(): Promise<number> {
    const before = await this.page.locator('[data-testid="items-body"] tr').count();
    await this.page.locator('[data-testid="add-item"]').click();
    const newIndex = before;
    await this.page.locator(`[data-testid="item-row-${newIndex}"]`).waitFor();
    return newIndex;
  }

  public async fillItem(index: number, item: RequestItem): Promise<void> {
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

  public async removeItem(index: number): Promise<void> {
    const row = this.page.locator(`[data-testid="item-row-${index}"]`);
    await this.page.locator(`[data-testid="item-remove-${index}"]`).click();
    await row.waitFor({ state: 'detached' });
  }
}
