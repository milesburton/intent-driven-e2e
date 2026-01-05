import type { Page } from 'playwright';
import type { OptionLeg } from '../domain/models';

export class LegEditor {
  public constructor(private readonly page: Page) {}

  public async addLeg(): Promise<number> {
    const before = await this.page.locator('[data-testid="legs-body"] tr').count();
    await this.page.locator('[data-testid="add-leg"]').click();
    const after = await this.page.locator('[data-testid="legs-body"] tr').count();
    if (after !== before + 1) {
      throw new Error(`Expected leg count to increment. Before=${before} After=${after}`);
    }
    return after - 1;
  }

  public async fillLeg(index: number, leg: OptionLeg): Promise<void> {
    await this.page.locator(`[data-testid="leg-side-${index}"]`).selectOption(leg.side);
    await this.page.locator(`[data-testid="leg-type-${index}"]`).selectOption(leg.type);
    await this.page.locator(`[data-testid="leg-strike-${index}"]`).fill(String(leg.strike));
    await this.page.locator(`[data-testid="leg-expiry-${index}"]`).fill(leg.expiry);
    await this.page.locator(`[data-testid="leg-qty-${index}"]`).fill(String(leg.quantity));
  }
}
