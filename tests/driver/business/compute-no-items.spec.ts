import { expect, test } from 'vitest';
import { createAppFixture } from '../../helpers/appFixture';
import { ERRORS, STATUS } from '../../../app/src/types';

const fixture = createAppFixture();

test('compute with no items returns FAILED', async () => {
  await fixture.app.startNewRequest();
  const result = await fixture.app.compute();

  expect(result.status).toBe(STATUS.FAILED);
  expect(result.error).toBe(ERRORS.NO_ITEMS);
  expect(result.pv).toBeUndefined();
});
