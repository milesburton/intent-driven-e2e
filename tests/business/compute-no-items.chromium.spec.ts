import { expect, test } from 'vitest';
import { createChromiumFixture } from '../fixtures/chromium.fixture';
import { ERRORS, STATUS } from '../../app/src/types';

const fixture = createChromiumFixture({
  expectedUrl: 'http://service.local/compute',
  response: { status: 'PRICED', pv: 999 } // Irrelevant, no request is sent without legs
});

test('compute with no items returns FAILED (chromium adapter)', async () => {
  await fixture.app.startNewRequest();
  const result = await fixture.app.compute();

  expect(result.status).toBe(STATUS.FAILED);
  expect(result.error).toBe(ERRORS.NO_ITEMS);
  expect(result.pv).toBeUndefined();
});
