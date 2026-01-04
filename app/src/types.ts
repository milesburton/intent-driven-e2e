export type Side = 'BUY' | 'SELL';
export type OptionType = 'CALL' | 'PUT';

export interface OptionLeg {
  side: Side;
  type: OptionType;
  strike: number;
  expiry: string; // YYYY-MM-DD
  quantity: number;
}

export interface PricingResult {
  status: 'IDLE' | 'PRICING' | 'PRICED' | 'FAILED';
  pv?: number;
  error?: string;
}
