import { expect, test } from 'vitest';
import { createChromiumFixture } from '../fixtures/chromium.fixture';
import { itemA, itemB } from '../../shared/fixtures/items';

let seenPayload: unknown | null = null;

const fixture = createChromiumFixture({
  expectedUrl: 'http://service.local/compute',
  onRequest: (payload: unknown) => {
    seenPayload = payload;
  },
  response: { status: 'PRICED', pv: 123.45 }
});

test('compute two items (chromium adapter)', async () => {
  await fixture.app.startNewRequest();
  await fixture.app.addItem(itemA);
  await fixture.app.addItem(itemB);

  const result = await fixture.app.compute();

  expect(result.status).toBe('PRICED');
  expect(result.pv).toBe(123.45);
  expect(seenPayload).toEqual({ items: [itemA, itemB] });
});
