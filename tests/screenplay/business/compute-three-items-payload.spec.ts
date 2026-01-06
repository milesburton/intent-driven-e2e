import { describe, it, beforeEach, expect } from 'vitest';
import { createAppFixture } from '../../helpers/app-fixture';
import { itemA, itemB } from '../../shared/fixtures/items';
import { Actor } from '../core';
import { StartNewRequest, AddItem, Compute } from '../tasks';
import { ResultStatus, ResultValue } from '../questions';
import { STATUS } from '../../../app/src/types';

let captured: unknown[] = [];

const fixture = createAppFixture({
  expectedUrl: 'http://service.local/compute',
  onRequest: (payload: unknown) => {
    captured.push(payload);
  },
  response: { status: 'PRICED', pv: 200 }
});

let trader: Actor;

describe('Compute — three items payload', () => {
  beforeEach(() => {
    captured = [];
    trader = new Actor('Trader', fixture.app);
  });

  it('posts three items to compute service', async () => {
    await trader.attemptsTo(
      new StartNewRequest(),
      new AddItem(itemA),
      new AddItem(itemB),
      new AddItem(itemA),
      new Compute()
    );

    expect(captured.length).toBe(1);
    const body = captured[0] as { items: Array<Record<string, unknown>> };
    expect(Array.isArray(body.items)).toBe(true);
    expect(body.items.length).toBe(3);

    expect(await trader.asks(new ResultStatus())).toBe(STATUS.PRICED);
    expect(await trader.asks(new ResultValue())).toBe(200);
  });
});