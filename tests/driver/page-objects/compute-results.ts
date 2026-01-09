import type { Page } from 'playwright';
import type { ComputeResult, ComputeStatus } from '../../shared/domain/models';

export class ComputeResults {
  public constructor(private readonly page: Page) {}

  public async read(): Promise<ComputeResult> {
    const statusText =
      (await this.page.locator('[data-testid="result-status"]').textContent()) ?? '';
    const status = this.parseStatus(statusText.trim());

    const valueText = (
      (await this.page.locator('[data-testid="result-value"]').textContent()) ?? ''
    ).trim();
    const errorText = (
      (await this.page.locator('[data-testid="result-error"]').textContent()) ?? ''
    ).trim();

    const value = valueText.length > 0 ? Number(valueText) : undefined;
    const error = errorText.length > 0 ? errorText : undefined;

    return { status, value: Number.isFinite(value ?? NaN) ? value : undefined, error };
  }

  private parseStatus(value: string): ComputeStatus {
    switch (value) {
      case 'IDLE':
      case 'PROCESSING':
      case 'COMPLETED':
      case 'FAILED':
        return value;
      default:
        throw new Error(`Unexpected status: "${value}"`);
    }
  }

  public async waitForResult(timeoutMs = 30000): Promise<ComputeResult> {
    await this.page
      .locator('[data-testid="result-status"]')
      .filter({ hasText: /^(COMPLETED|FAILED)$/ })
      .waitFor({ timeout: timeoutMs });
    return this.read();
  }
}
