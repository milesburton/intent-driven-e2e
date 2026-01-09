export type Direction = "IN" | "OUT";
export type Kind = "A" | "B";

export interface RequestItem {
  side: Direction;
  type: Kind;
  strike: number;
  expiry: string;
  quantity: number;
}

export type ComputeStatus = "IDLE" | "PROCESSING" | "COMPLETED" | "FAILED";

export interface ComputeResult {
  status: ComputeStatus;
  value?: number;
  error?: string;
}

export const STATUS_COMPLETED = "COMPLETED" as const;
export const STATUS_FAILED = "FAILED" as const;
