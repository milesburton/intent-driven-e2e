import type { RequestFormApp } from "../shared/domain/request-form-app.interface";
import type { RequestItem, ComputeResult } from "../shared/domain/models";
import { ERRORS, STATUS } from "../../app/src/types";

function validateItem(item: RequestItem): string | null {
  if (item.strike <= 0) return "Invalid strike";
  if (item.quantity <= 0) return "Invalid quantity";
  if (!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(item.expiry)) return "Invalid expiry";
  return null;
}

export class MockFormApp implements RequestFormApp {
  private items: RequestItem[] = [];

  public async startNewRequest(): Promise<void> {
    this.items = [];
  }

  public async addItem(item: RequestItem): Promise<void> {
    const error = validateItem(item);
    if (error) throw new Error(error);
    this.items.push(item);
  }

  public async removeItem(index: number): Promise<void> {
    if (index < 0 || index >= this.items.length) return;
    this.items.splice(index, 1);
  }

  public async compute(): Promise<ComputeResult> {
    if (this.items.length === 0) {
      return { status: STATUS.FAILED, error: ERRORS.NO_ITEMS };
    }

    const value = this.items.reduce((acc, item) => {
      const sideSign = item.side === "IN" ? 1 : -1;
      const typeScale = item.type === "A" ? 1.0 : 0.9;
      return acc + sideSign * item.quantity * item.strike * typeScale;
    }, 0);

    return { status: STATUS.COMPLETED, value: Number(value.toFixed(2)) };
  }
}
