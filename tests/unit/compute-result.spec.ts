import { describe, it, expect } from 'vitest';
import { parseComputeResult } from '../../app/src/utils/compute';
import { ERRORS, STATUS } from '../../app/src/types';

describe('parseComputeResult', () => {
  it('returns FAILED for non-object payload', () => {
    expect(parseComputeResult(null)).toEqual({
      status: STATUS.FAILED,
      error: ERRORS.INVALID_RESPONSE
    });
    expect(parseComputeResult(123)).toEqual({
      status: STATUS.FAILED,
      error: ERRORS.INVALID_RESPONSE
    });
  });

  it('returns FAILED for invalid status', () => {
    expect(parseComputeResult({ status: 'UNKNOWN' })).toEqual({
      status: STATUS.FAILED,
      error: ERRORS.INVALID_STATUS
    });
  });

  it('returns FAILED with error message when status is FAILED', () => {
    expect(parseComputeResult({ status: STATUS.FAILED, error: 'Boom' })).toEqual({
      status: STATUS.FAILED,
      error: 'Boom'
    });
  });

  it('returns FAILED with Unknown error when status is FAILED without message', () => {
    expect(parseComputeResult({ status: STATUS.FAILED })).toEqual({
      status: STATUS.FAILED,
      error: ERRORS.UNKNOWN
    });
  });

  it('returns FAILED when pv is missing or not a finite number', () => {
    expect(parseComputeResult({ status: STATUS.PRICED })).toEqual({
      status: STATUS.FAILED,
      error: ERRORS.MISSING_PV
    });
    expect(parseComputeResult({ status: STATUS.PRICED, pv: 'NaN' })).toEqual({
      status: STATUS.FAILED,
      error: ERRORS.MISSING_PV
    });
  });

  it('returns PRICED with pv when valid', () => {
    expect(parseComputeResult({ status: STATUS.PRICED, pv: 123.45 })).toEqual({
      status: STATUS.PRICED,
      pv: 123.45
    });
  });
});
