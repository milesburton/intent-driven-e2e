import { describe, it, expect } from 'vitest';
import { createAppFixture } from '../../helpers/app-fixture';
import { itemA } from '../../shared/fixtures/items';
import { ERRORS, STATUS } from '../../../app/src/types';

// Interceptor returns PRICED without pv; app parser should convert to FAILED/MISSING_PV
const fixture = createAppFixture({
  expectedUrl: 'http://service.local/compute',
  response: { status: 'PRICED' }
});

describe('Compute — missing pv', () => {
  it('fails when pv is missing', async () => {
    await fixture.app.startNewRequest();
    await fixture.app.addItem(itemA);

    const result = await fixture.app.compute();

    expect(result.status).toBe(STATUS.FAILED);
    expect(result.error).toBe(ERRORS.MISSING_PV);
    expect(result.pv).toBeUndefined();
  });
});