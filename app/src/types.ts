export type Direction = 'BUY' | 'SELL';
export type Kind = 'CALL' | 'PUT';

export interface RequestItem {
  side: Direction;
  type: Kind;
  strike: number;
  expiry: string; // YYYY-MM-DD
  quantity: number;
}

export interface ComputeResult {
  status: 'IDLE' | 'PRICING' | 'PRICED' | 'FAILED';
  pv?: number;
  error?: string;
}
