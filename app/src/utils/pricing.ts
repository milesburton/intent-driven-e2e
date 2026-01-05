import type { PricingResult } from '../types';

type JsonObject = Record<string, unknown>;

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function parsePricingResult(payload: unknown): PricingResult {
  if (typeof payload !== 'object' || payload === null) {
    return { status: 'FAILED', error: 'Invalid response' };
  }
  const obj = payload as JsonObject;

  const status = obj['status'];
  if (status !== 'PRICED' && status !== 'FAILED') {
    return { status: 'FAILED', error: 'Invalid response status' };
  }

  if (status === 'FAILED') {
    const error = obj['error'];
    return { status: 'FAILED', error: isString(error) ? error : 'Unknown error' };
  }

  const pv = obj['pv'];
  if (!isFiniteNumber(pv)) {
    return { status: 'FAILED', error: 'Missing pv' };
  }

  return { status: 'PRICED', pv };
}
