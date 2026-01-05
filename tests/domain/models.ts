export type Direction = 'BUY' | 'SELL';
export type Kind = 'CALL' | 'PUT';

export interface RequestItem {
  side: Direction;
  type: Kind;
  strike: number;
  expiry: string; // YYYY-MM-DD
  quantity: number;
}

export type ComputeStatus = 'IDLE' | 'PRICING' | 'PRICED' | 'FAILED';

export interface ComputeResult {
  status: ComputeStatus;
  pv?: number;
  error?: string;
}
