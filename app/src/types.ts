export type Direction = 'IN' | 'OUT';
export type Kind = 'A' | 'B';

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

// Shared status constants for use across app and tests
export const STATUS = {
  IDLE: 'IDLE' as const,
  PRICING: 'PRICING' as const,
  PRICED: 'PRICED' as const,
  FAILED: 'FAILED' as const
};
