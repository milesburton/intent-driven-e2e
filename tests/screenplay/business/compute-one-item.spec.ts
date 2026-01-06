import { describe, it, beforeEach, expect } from 'vitest';
import { createAppFixture } from '../../helpers/app-fixture';
import { itemA } from '../../shared/fixtures/items';
import { Actor } from '../core';
import { StartNewRequest, AddItem, Compute } from '../tasks';
import { ResultStatus, ResultValue } from '../questions';
import { STATUS } from '../../../app/src/types';

const fixture = createAppFixture({
  expectedUrl: 'http://service.local/compute',
  response: { status: 'PRICED', pv: 77.7 }
});

let trader: Actor;

describe('Pricing a single item', () => {
  beforeEach(() => {
    trader = new Actor('Trader', fixture.app);
  });

  it('returns PRICED with custom pv', async () => {
    await trader.attemptsTo(
      new StartNewRequest(),
      new AddItem(itemA),
      new Compute()
    );

    expect(await trader.asks(new ResultStatus())).toBe(STATUS.PRICED);
    expect(await trader.asks(new ResultValue())).toBe(77.7);
  });
});