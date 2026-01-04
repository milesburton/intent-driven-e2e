export type Side = 'BUY' | 'SELL';
export type OptionType = 'CALL' | 'PUT';

export interface OptionLeg {
  side: Side;
  type: OptionType;
  strike: number;
  expiry: string; // YYYY-MM-DD
  quantity: number;
}

export type PricingStatus = 'IDLE' | 'PRICING' | 'PRICED' | 'FAILED';

export interface PricingResult {
  status: PricingStatus;
  pv?: number;
  error?: string;
}
