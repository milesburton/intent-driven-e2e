import { expect, test } from 'vitest';
import { createChromiumFixture } from '../fixtures/chromium.fixture';
import { buyCall, sellCall } from '../fixtures/legs';
import { Actor } from '../screenplay/core';
import { StartNewTicket, AddOptionLeg, Price } from '../screenplay/tasks';
import { PricingStatus, PricingPV } from '../screenplay/questions';

let seenPayload: unknown | null = null;
const fixture = createChromiumFixture({
  expectedUrl: 'http://pricing.acmibank/price',
  onRequest: (payload: unknown) => {
    seenPayload = payload;
  },
  response: { status: 'PRICED', pv: 123.45 }
});

test('price two option legs (Screenplay, chromium adapter)', async () => {
  const trader = new Actor('Trader', fixture.app);

  await trader.attemptsTo(
    new StartNewTicket(),
    new AddOptionLeg(buyCall),
    new AddOptionLeg(sellCall),
    new Price()
  );

  expect(await trader.asks(new PricingStatus())).toBe('PRICED');
  expect(await trader.asks(new PricingPV())).toBe(123.45);
  expect(seenPayload).toEqual({ legs: [buyCall, sellCall] });
});
