import { describe, it, expect } from 'vitest';
import { createAppFixture } from '../../helpers/app-fixture';
import { itemA } from '../../shared/fixtures/items';
import { STATUS } from '../../../app/src/types';

const fixture = createAppFixture({
  expectedUrl: 'http://service.local/compute',
  response: { status: 'PRICED', pv: 42 }
});

describe('Pricing a single item', () => {
  it('returns PRICED with custom pv', async () => {
    await fixture.app.startNewRequest();
    await fixture.app.addItem(itemA);

    const result = await fixture.app.compute();

    expect(result.status).toBe(STATUS.PRICED);
    expect(result.pv).toBe(42);
  });
});