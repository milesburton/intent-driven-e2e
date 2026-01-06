import { describe, it, expect } from 'vitest';
import { createAppFixture } from '../../helpers/app-fixture';
import { itemA } from '../../shared/fixtures/items';
import { ERRORS, STATUS } from '../../../app/src/types';

const fixture = createAppFixture({
  expectedUrl: 'http://service.local/compute',
  response: { status: 'UNKNOWN' as any }
});

describe('Compute — invalid status', () => {
  it('fails with INVALID_STATUS when server returns unknown status', async () => {
    await fixture.app.startNewRequest();
    await fixture.app.addItem(itemA);

    const result = await fixture.app.compute();

    expect(result.status).toBe(STATUS.FAILED);
    expect(result.error).toBe(ERRORS.INVALID_STATUS);
    expect(result.pv).toBeUndefined();
  });
});