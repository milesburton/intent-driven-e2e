import { expect, test } from 'vitest';
import { createChromiumFixture } from '../fixtures/chromium.fixture';
import { Actor } from '../screenplay/core';
import { StartNewRequest, Compute } from '../screenplay/tasks';
import { ResultStatus, ResultValue } from '../screenplay/questions';

const fixture = createChromiumFixture({
  expectedUrl: 'http://service.local/compute',
  response: { status: 'PRICED', pv: 999 }
});

test('compute with no items returns FAILED (Screenplay, chromium adapter)', async () => {
  const trader = new Actor('Trader', fixture.app);
  await trader.attemptsTo(new StartNewRequest(), new Compute());

  expect(await trader.asks(new ResultStatus())).toBe('FAILED');
  expect(await trader.asks(new ResultValue())).toBeUndefined();
});
