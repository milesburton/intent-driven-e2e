import { describe, it, expect } from 'vitest';
import { parsePricingResult } from '../../app/src/utils/pricing';

describe('parsePricingResult', () => {
  it('returns FAILED for non-object payload', () => {
    expect(parsePricingResult(null)).toEqual({ status: 'FAILED', error: 'Invalid response' });
    expect(parsePricingResult(123)).toEqual({ status: 'FAILED', error: 'Invalid response' });
  });

  it('returns FAILED for invalid status', () => {
    expect(parsePricingResult({ status: 'UNKNOWN' })).toEqual({
      status: 'FAILED',
      error: 'Invalid response status'
    });
  });

  it('returns FAILED with error message when status is FAILED', () => {
    expect(parsePricingResult({ status: 'FAILED', error: 'Boom' })).toEqual({
      status: 'FAILED',
      error: 'Boom'
    });
  });

  it('returns FAILED with Unknown error when status is FAILED without message', () => {
    expect(parsePricingResult({ status: 'FAILED' })).toEqual({
      status: 'FAILED',
      error: 'Unknown error'
    });
  });

  it('returns FAILED when pv is missing or not a finite number', () => {
    expect(parsePricingResult({ status: 'PRICED' })).toEqual({
      status: 'FAILED',
      error: 'Missing pv'
    });
    expect(parsePricingResult({ status: 'PRICED', pv: 'NaN' })).toEqual({
      status: 'FAILED',
      error: 'Missing pv'
    });
  });

  it('returns PRICED with pv when valid', () => {
    expect(parsePricingResult({ status: 'PRICED', pv: 123.45 })).toEqual({
      status: 'PRICED',
      pv: 123.45
    });
  });
});
