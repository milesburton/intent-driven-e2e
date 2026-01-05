import { expect, test } from 'vitest';
import type { OptionLeg } from '../domain/models';
import { MockTradeTicketApp } from '../app/mock-trade-ticket-app';

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

test('price two option legs (mock adapter)', async () => {
  const app = new MockTradeTicketApp();

  await app.startNewTicket();
  await app.addOptionLeg(buyCall);
  await app.addOptionLeg(sellCall);

  const result = await app.price();

  expect(result.status).toBe('PRICED');
  expect(result.pv).toBeCloseTo(-5, 6);
});
