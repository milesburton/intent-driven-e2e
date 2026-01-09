import type { ComputeResult } from "../types";
import { ERRORS, STATUS } from "../types";

type JsonObject = Record<string, unknown>;

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

export function parseComputeResult(payload: unknown): ComputeResult {
  if (typeof payload !== "object" || payload === null) {
    return { status: STATUS.FAILED, error: ERRORS.INVALID_RESPONSE };
  }
  const obj = payload as JsonObject;

  const status = obj.status;
  if (status !== STATUS.COMPLETED && status !== STATUS.FAILED) {
    return { status: STATUS.FAILED, error: ERRORS.INVALID_STATUS };
  }

  if (status === STATUS.FAILED) {
    const error = obj.error;
    return { status: STATUS.FAILED, error: isString(error) ? error : ERRORS.UNKNOWN };
  }

  const value = obj.value;
  if (!isFiniteNumber(value)) {
    return { status: STATUS.FAILED, error: ERRORS.MISSING_VALUE };
  }

  return { status: STATUS.COMPLETED, value };
}
