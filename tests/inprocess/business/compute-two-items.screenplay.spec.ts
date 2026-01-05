import { expect, test } from 'vitest';
import { MockFormApp } from '../../app/mock-form-app';
import { itemA, itemB } from '../../shared/fixtures/items';
import { Actor } from '../../screenplay/core';
import { StartNewRequest, AddItem, Compute } from '../../screenplay/tasks';
import { ResultStatus, ResultValue } from '../../screenplay/questions';

test('compute two items (Screenplay, mock adapter)', async () => {
  const app = new MockFormApp();
  const trader = new Actor('Trader', app);

  await trader.attemptsTo(
    new StartNewRequest(),
    new AddItem(itemA),
    new AddItem(itemB),
    new Compute()
  );

  expect(await trader.asks(new ResultStatus())).toBe('PRICED');
  expect(await trader.asks(new ResultValue())).toBeCloseTo(-5, 6);
});
