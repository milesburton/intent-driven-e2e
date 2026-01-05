import { expect, test } from 'vitest';
import { MockFormApp } from '../app/mock-form-app';
import { itemA, itemB } from '../fixtures/legs';

test('price two option legs (mock adapter)', async () => {
  const app = new MockFormApp();

  await app.startNewTicket();
  await app.addOptionLeg(itemA);
  await app.addOptionLeg(itemB);

  const result = await app.price();

  expect(result.status).toBe('PRICED');
  expect(result.pv).toBeCloseTo(-5, 6);
});
