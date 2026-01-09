export type Direction = 'IN' | 'OUT';
export type Kind = 'A' | 'B';

export interface RequestItem {
  side: Direction;
  type: Kind;
  strike: number;
  expiry: string;
  quantity: number;
}

export interface ComputeResult {
  status: 'IDLE' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  value?: number;
  error?: string;
}

export const STATUS = {
  IDLE: 'IDLE' as const,
  PROCESSING: 'PROCESSING' as const,
  COMPLETED: 'COMPLETED' as const,
  FAILED: 'FAILED' as const
};

export const ERRORS = {
  NO_ITEMS: 'No items' as const,
  INVALID_RESPONSE: 'Invalid response' as const,
  INVALID_STATUS: 'Invalid response status' as const,
  UNKNOWN: 'Unknown error' as const,
  MISSING_PV: 'Missing pv' as const
};
