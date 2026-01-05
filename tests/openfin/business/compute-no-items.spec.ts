import { test, expect } from 'vitest';
import { describeOpenFin } from '../../helpers/openfin';

describeOpenFin('Request Form – OpenFin Driver', ({ getApp, STATUS }) => {
  test('compute with no items returns FAILED', async () => {
    const app = getApp();
    await app.startNewRequest();
    const result = await app.compute();
    expect(result.status).toBe(STATUS.FAILED);
    expect(result.error).toBeDefined();
  });
});
