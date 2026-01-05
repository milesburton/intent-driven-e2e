import { expect, test } from 'vitest';
import { MockFormApp } from '../app/mock-form-app';

test('price with no legs returns FAILED (mock adapter)', async () => {
  const app = new MockFormApp();
  await app.startNewTicket();
  const result = await app.price();

  expect(result.status).toBe('FAILED');
  expect(result.error).toBe('No legs');
  expect(result.pv).toBeUndefined();
});
