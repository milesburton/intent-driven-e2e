import { expect, test } from 'vitest';
import { createChromiumFixture } from '../fixtures/chromium.fixture';
import { Actor } from '../screenplay/core';
import { StartNewTicket, Price } from '../screenplay/tasks';
import { PricingStatus, PricingPV } from '../screenplay/questions';

const fixture = createChromiumFixture({
  expectedUrl: 'http://pricing.acmibank/price',
  response: { status: 'PRICED', pv: 999 }
});

test('price with no legs returns FAILED (Screenplay, chromium adapter)', async () => {
  const trader = new Actor('Trader', fixture.app);
  await trader.attemptsTo(new StartNewTicket(), new Price());

  expect(await trader.asks(new PricingStatus())).toBe('FAILED');
  expect(await trader.asks(new PricingPV())).toBeUndefined();
});
