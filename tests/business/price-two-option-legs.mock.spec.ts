import { expect, test } from 'vitest';
import { MockTradeTicketApp } from '../app/mock-trade-ticket-app';
import { buyCall, sellCall } from '../fixtures/legs';

test('price two option legs (mock adapter)', async () => {
  const app = new MockTradeTicketApp();

  await app.startNewTicket();
  await app.addOptionLeg(buyCall);
  await app.addOptionLeg(sellCall);

  const result = await app.price();

  expect(result.status).toBe('PRICED');
  expect(result.pv).toBeCloseTo(-5, 6);
});
