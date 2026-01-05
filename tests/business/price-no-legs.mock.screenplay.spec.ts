import { expect, test } from 'vitest';
import { MockFormApp } from '../app/mock-form-app';
import { Actor } from '../screenplay/core';
import { StartNewRequest, Compute } from '../screenplay/tasks';
import { ResultStatus, ResultValue } from '../screenplay/questions';

test('compute with no items returns FAILED (Screenplay, mock adapter)', async () => {
  const app = new MockFormApp();
  const trader = new Actor('Trader', app);
  await trader.attemptsTo(new StartNewRequest(), new Compute());

  expect(await trader.asks(new ResultStatus())).toBe('FAILED');
  expect(await trader.asks(new ResultValue())).toBeUndefined();
});
