import { expect, test } from 'vitest';
import { createChromiumFixture } from '../fixtures/chromium.fixture';

const fixture = createChromiumFixture({
  expectedUrl: 'http://service.local/compute',
  response: { status: 'PRICED', pv: 999 } // Irrelevant, no request is sent without legs
});

test('compute with no items returns FAILED (chromium adapter)', async () => {
  await fixture.app.startNewRequest();
  const result = await fixture.app.compute();

  expect(result.status).toBe('FAILED');
  expect(result.error).toBe('No items');
  expect(result.pv).toBeUndefined();
});
