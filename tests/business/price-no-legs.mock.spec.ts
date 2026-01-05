import { expect, test } from 'vitest';
import { MockFormApp } from '../app/mock-form-app';

test('compute with no items returns FAILED (mock adapter)', async () => {
  const app = new MockFormApp();
  await app.startNewRequest();
  const result = await app.compute();

  expect(result.status).toBe('FAILED');
  expect(result.error).toBe('No legs');
  expect(result.pv).toBeUndefined();
});
