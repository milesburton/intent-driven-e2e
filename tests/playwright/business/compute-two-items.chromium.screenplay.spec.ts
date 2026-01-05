import { expect, test } from 'vitest';
import { createChromiumFixture } from '../fixtures/chromium.fixture';
import { itemA, itemB } from '../../shared/fixtures/items';
import { Actor } from '../../screenplay/core';
import { StartNewRequest, AddItem, Compute } from '../../screenplay/tasks';
import { ResultStatus, ResultValue } from '../../screenplay/questions';

let seenPayload: unknown | null = null;
const fixture = createChromiumFixture({
  expectedUrl: 'http://service.local/compute',
  onRequest: (payload: unknown) => {
    seenPayload = payload;
  },
  response: { status: 'PRICED', pv: 123.45 }
});

test('compute two items (Screenplay, chromium adapter)', async () => {
  const trader = new Actor('Trader', fixture.app);

  await trader.attemptsTo(
    new StartNewRequest(),
    new AddItem(itemA),
    new AddItem(itemB),
    new Compute()
  );

  expect(await trader.asks(new ResultStatus())).toBe('PRICED');
  expect(await trader.asks(new ResultValue())).toBe(123.45);
  expect(seenPayload).toEqual({ items: [itemA, itemB] });
});
