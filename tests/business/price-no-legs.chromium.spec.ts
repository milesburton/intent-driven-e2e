import { expect, test } from 'vitest';
import { createChromiumFixture } from '../fixtures/chromium.fixture';

const fixture = createChromiumFixture({
  expectedUrl: 'http://pricing.acmibank/price',
  response: { status: 'PRICED', pv: 999 } // Irrelevant, no request is sent without legs
});

test('price with no legs returns FAILED (chromium adapter)', async () => {
  await fixture.app.startNewTicket();
  const result = await fixture.app.price();

  expect(result.status).toBe('FAILED');
  expect(result.error).toBe('No legs');
  expect(result.pv).toBeUndefined();
});
