import type { RequestItem, ComputeResult } from "./models";

export interface RequestFormApp {
  startNewRequest(): Promise<void>;
  addItem(_item: RequestItem): Promise<void>;
  removeItem(index: number): Promise<void>;
  compute(): Promise<ComputeResult>;
}
