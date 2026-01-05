export type Direction = 'IN' | 'OUT';
export type Kind = 'A' | 'B';

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
