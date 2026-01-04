import { expect, test } from 'vitest';
import type { OptionLeg } from '../domain/models';
import { createChromiumFixture } from '../fixtures/chromium.fixture';

const buyCall: OptionLeg = {
  side: 'BUY',
  type: 'CALL',
  strike: 100,
  expiry: '2026-06-01',
  quantity: 1
};

const sellCall: OptionLeg = {
  side: 'SELL',
  type: 'CALL',
  strike: 105,
  expiry: '2026-06-01',
  quantity: 1
};

test('price two option legs (chromium adapter)', async () => {
  let seenPayload: unknown | null = null;

  const fixture = createChromiumFixture({
    expectedUrl: 'http://pricing.acmibank/price',
    onRequest: (payload: unknown) => {
      seenPayload = payload;
    },
    response: { status: 'PRICED', pv: 123.45 }
  });

  await fixture.app.startNewTicket();
  await fixture.app.addOptionLeg(buyCall);
  await fixture.app.addOptionLeg(sellCall);

  const result = await fixture.app.price();

  expect(result.status).toBe('PRICED');
  expect(result.pv).toBe(123.45);
  expect(seenPayload).toEqual({ legs: [buyCall, sellCall] });
});
