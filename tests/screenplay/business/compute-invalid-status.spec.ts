import { describe, it, beforeEach, expect } from 'vitest';
import { createAppFixture } from '../../helpers/app-fixture';
import { itemA } from '../../shared/fixtures/items';
import { Actor } from '../core';
import { StartNewRequest, AddItem, Compute } from '../tasks';
import { ResultStatus } from '../questions';
import { ERRORS, STATUS } from '../../../app/src/types';

const fixture = createAppFixture({
  expectedUrl: 'http://service.local/compute',
  response: { status: 'FAILED' }
});

let trader: Actor;

describe('Server returns failure without error', () => {
  beforeEach(() => {
    trader = new Actor('Trader', fixture.app);
  });

  it('maps to FAILED with UNKNOWN error', async () => {
    await trader.attemptsTo(new StartNewRequest(), new AddItem(itemA), new Compute());
    expect(await trader.asks(new ResultStatus())).toBe(STATUS.FAILED);
  });
});