import { expect, test } from 'vitest';
import { MockTradeTicketApp } from '../app/mock-trade-ticket-app';
import { buyCall, sellCall } from '../fixtures/legs';
import { Actor } from '../screenplay/core';
import { StartNewTicket, AddOptionLeg, Price } from '../screenplay/tasks';
import { PricingStatus, PricingPV } from '../screenplay/questions';

test('price two option legs (Screenplay, mock adapter)', async () => {
  const app = new MockTradeTicketApp();
  const trader = new Actor('Trader', app);

  await trader.attemptsTo(
    new StartNewTicket(),
    new AddOptionLeg(buyCall),
    new AddOptionLeg(sellCall),
    new Price()
  );

  expect(await trader.asks(new PricingStatus())).toBe('PRICED');
  expect(await trader.asks(new PricingPV())).toBeCloseTo(-5, 6);
});
