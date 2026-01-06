import { describe, it, expect } from 'vitest';
import { createAppFixture } from '../../helpers/app-fixture';
import { itemA } from '../../shared/fixtures/items';
import { STATUS } from '../../../app/src/types';

const fixture = createAppFixture({
  expectedUrl: 'http://service.local/compute',
  response: { status: 'FAILED', error: 'Boom' }
});

describe('Compute — explicit failure', () => {
  it('returns FAILED with server-provided error', async () => {
    await fixture.app.startNewRequest();
    await fixture.app.addItem(itemA);

    const result = await fixture.app.compute();

    expect(result.status).toBe(STATUS.FAILED);
    expect(result.error).toBe('Boom');
    expect(result.pv).toBeUndefined();
  });
});