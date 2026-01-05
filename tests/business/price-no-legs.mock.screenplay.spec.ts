import { expect, test } from 'vitest';
import { MockFormApp } from '../app/mock-form-app';
import { Actor } from '../screenplay/core';
import { StartNewTicket, Price } from '../screenplay/tasks';
import { PricingStatus, PricingPV } from '../screenplay/questions';

test('price with no legs returns FAILED (Screenplay, mock adapter)', async () => {
  const app = new MockFormApp();
  const trader = new Actor('Trader', app);
  await trader.attemptsTo(new StartNewTicket(), new Price());

  expect(await trader.asks(new PricingStatus())).toBe('FAILED');
  expect(await trader.asks(new PricingPV())).toBeUndefined();
});
