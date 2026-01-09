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
  response: { status: 'COMPLETED', value: 123.45 }
});

let trader: Actor;

describe('Request payload — two items', () => {
  beforeEach(() => {
    captured = [];
    trader = new Actor('Trader', fixture.app);
  });

  it('sends two items to the compute service', async () => {
    await trader.attemptsTo(
      new StartNewRequest(),
      new AddItem(itemA),
      new AddItem(itemB),
      new Compute()
    );

    expect(captured.length).toBe(1);
    const body = captured[0] as { items: Array<Record<string, unknown>> };
    expect(Array.isArray(body.items)).toBe(true);
    expect(body.items.length).toBe(2);

    expect(await trader.asks(new ResultStatus())).toBe(STATUS.COMPLETED);
    expect(await trader.asks(new ResultValue())).toBe(123.45);
  });
});
