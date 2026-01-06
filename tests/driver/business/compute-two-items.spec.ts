import { describe, it, expect } from 'vitest';
import { createAppFixture } from '../../helpers/app-fixture';
import { itemA, itemB } from '../../shared/fixtures/items';
import { STATUS } from '../../../app/src/types';

const fixture = createAppFixture();

describe('Pricing two items', () => {
  it('returns PRICED with expected value', async () => {
    await fixture.app.startNewRequest();
    await fixture.app.addItem(itemA);
    await fixture.app.addItem(itemB);

    const result = await fixture.app.compute();

    expect(result.status).toBe(STATUS.PRICED);
    expect(result.pv).toBe(123.45);
  });
});
