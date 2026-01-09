import { describe, it, expect } from 'vitest';
import { createAppFixture } from '../../helpers/app-fixture';
import { itemA, itemB } from '../../shared/fixtures/items';
import { STATUS } from '../../../app/src/types';

const fixture = createAppFixture();

describe('Compute two items', () => {
  it('returns COMPLETED with expected value', async () => {
    await fixture.app.startNewRequest();
    await fixture.app.addItem(itemA);
    await fixture.app.addItem(itemB);

    const result = await fixture.app.compute();

    expect(result.status).toBe(STATUS.COMPLETED);
    expect(result.value).toBe(123.45);
  });
});
