import { expect, test } from 'vitest';
import { MockFormApp } from '../app/mock-form-app';
import { itemA, itemB } from '../fixtures/legs';
import { Actor } from '../screenplay/core';
import { StartNewTicket, AddOptionLeg, Price } from '../screenplay/tasks';
import { PricingStatus, PricingPV } from '../screenplay/questions';

test('price two option legs (Screenplay, mock adapter)', async () => {
  const app = new MockFormApp();
  const trader = new Actor('Trader', app);

  await trader.attemptsTo(
    new StartNewTicket(),
    new AddOptionLeg(itemA),
    new AddOptionLeg(itemB),
    new Price()
  );

  expect(await trader.asks(new PricingStatus())).toBe('PRICED');
  expect(await trader.asks(new PricingPV())).toBeCloseTo(-5, 6);
});
