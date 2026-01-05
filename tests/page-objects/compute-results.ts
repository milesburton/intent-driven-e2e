import type { Page } from 'playwright';
import type { ComputeResult, ComputeStatus } from '../domain/models';

export class ComputeResults {
  public constructor(private readonly page: Page) {}

  public async read(): Promise<ComputeResult> {
    const statusText =
      (await this.page.locator('[data-testid="result-status"]').textContent()) ?? '';
    const status = this.parseStatus(statusText.trim());

    const pvText = (
      (await this.page.locator('[data-testid="result-value"]').textContent()) ?? ''
    ).trim();
    const errorText = (
      (await this.page.locator('[data-testid="result-error"]').textContent()) ?? ''
    ).trim();

    const pv = pvText.length > 0 ? Number(pvText) : undefined;
    const error = errorText.length > 0 ? errorText : undefined;

    return { status, pv: Number.isFinite(pv ?? NaN) ? pv : undefined, error };
  }

  private parseStatus(value: string): ComputeStatus {
    switch (value) {
      case 'IDLE':
      case 'PRICING':
      case 'PRICED':
      case 'FAILED':
        return value;
      default:
        throw new Error(`Unexpected status: "${value}"`);
    }
  }
}
