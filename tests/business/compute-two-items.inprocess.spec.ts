import { expect, test } from 'vitest';
import { MockFormApp } from '../app/mock-form-app';
import { itemA, itemB } from '../fixtures/items';

test('compute two items (mock adapter)', async () => {
  const app = new MockFormApp();

  await app.startNewRequest();
  await app.addItem(itemA);
  await app.addItem(itemB);

  const result = await app.compute();

  expect(result.status).toBe('PRICED');
  expect(result.pv).toBeCloseTo(-5, 6);
});
