import { expect, test } from 'vitest';
import { createChromiumFixture } from '../fixtures/chromium.fixture';
import { buyCall, sellCall } from '../fixtures/legs';

let seenPayload: unknown | null = null;

const fixture = createChromiumFixture({
  expectedUrl: 'http://pricing.acmibank/price',
  onRequest: (payload: unknown) => {
    seenPayload = payload;
  },
  response: { status: 'PRICED', pv: 123.45 }
});

test('price two option legs (chromium adapter)', async () => {
  await fixture.app.startNewTicket();
  await fixture.app.addOptionLeg(buyCall);
  await fixture.app.addOptionLeg(sellCall);

  const result = await fixture.app.price();

  expect(result.status).toBe('PRICED');
  expect(result.pv).toBe(123.45);
  expect(seenPayload).toEqual({ legs: [buyCall, sellCall] });
});
