import { describe, it, expect } from 'vitest';
import { parseComputeResult } from '../../app/src/utils/compute';

describe('parseComputeResult', () => {
  it('returns FAILED for non-object payload', () => {
    expect(parseComputeResult(null)).toEqual({ status: 'FAILED', error: 'Invalid response' });
    expect(parseComputeResult(123)).toEqual({ status: 'FAILED', error: 'Invalid response' });
  });

  it('returns FAILED for invalid status', () => {
    expect(parseComputeResult({ status: 'UNKNOWN' })).toEqual({
      status: 'FAILED',
      error: 'Invalid response status'
    });
  });

  it('returns FAILED with error message when status is FAILED', () => {
    expect(parseComputeResult({ status: 'FAILED', error: 'Boom' })).toEqual({
      status: 'FAILED',
      error: 'Boom'
    });
  });

  it('returns FAILED with Unknown error when status is FAILED without message', () => {
    expect(parseComputeResult({ status: 'FAILED' })).toEqual({
      status: 'FAILED',
      error: 'Unknown error'
    });
  });

  it('returns FAILED when pv is missing or not a finite number', () => {
    expect(parseComputeResult({ status: 'PRICED' })).toEqual({
      status: 'FAILED',
      error: 'Missing pv'
    });
    expect(parseComputeResult({ status: 'PRICED', pv: 'NaN' })).toEqual({
      status: 'FAILED',
      error: 'Missing pv'
    });
  });

  it('returns PRICED with pv when valid', () => {
    expect(parseComputeResult({ status: 'PRICED', pv: 123.45 })).toEqual({
      status: 'PRICED',
      pv: 123.45
    });
  });
});
