import { expect, test } from 'vitest';
import { MockFormApp } from '../../app/mock-form-app';
import { ERRORS, STATUS } from '../../../app/src/types';

test('compute with no items returns FAILED (mock adapter)', async () => {
  const app = new MockFormApp();
  await app.startNewRequest();
  const result = await app.compute();

  expect(result.status).toBe(STATUS.FAILED);
  expect(result.error).toBe(ERRORS.NO_ITEMS);
  expect(result.pv).toBeUndefined();
});
