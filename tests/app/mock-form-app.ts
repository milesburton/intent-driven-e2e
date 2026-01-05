import type { RequestFormApp } from '../domain/request-form-app.interface';
import type { OptionLeg, PricingResult } from '../domain/models';

function validateLeg(leg: OptionLeg): string | null {
  if (leg.strike <= 0) return 'Invalid strike';
  if (leg.quantity <= 0) return 'Invalid quantity';
  if (!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(leg.expiry)) return 'Invalid expiry';
  return null;
}

export class MockFormApp implements RequestFormApp {
  private legs: OptionLeg[] = [];

  public async startNewTicket(): Promise<void> {
    this.legs = [];
  }

  public async addOptionLeg(leg: OptionLeg): Promise<void> {
    const error = validateLeg(leg);
    if (error) throw new Error(error);
    this.legs.push(leg);
  }

  public async price(): Promise<PricingResult> {
    if (this.legs.length === 0) {
      return { status: 'FAILED', error: 'No legs' };
    }

    const pv = this.legs.reduce((acc, leg) => {
      const sideSign = leg.side === 'BUY' ? 1 : -1;
      const typeScale = leg.type === 'CALL' ? 1.0 : 0.9;
      return acc + sideSign * leg.quantity * leg.strike * typeScale;
    }, 0);

    return { status: 'PRICED', pv: Number(pv.toFixed(2)) };
  }
}
