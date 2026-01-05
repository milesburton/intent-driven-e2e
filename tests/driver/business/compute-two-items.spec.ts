import { expect, test } from 'vitest';
import { createAppFixture } from '../../helpers/appFixture';
import { itemA, itemB } from '../../shared/fixtures/items';

const fixture = createAppFixture();

test('compute two items', async () => {
  await fixture.app.startNewRequest();
  await fixture.app.addItem(itemA);
  await fixture.app.addItem(itemB);

  const result = await fixture.app.compute();

  expect(result.status).toBe('PRICED');
  expect(result.pv).toBe(123.45);
});
