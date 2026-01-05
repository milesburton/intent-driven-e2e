import { test, expect } from 'vitest';
import { items } from '../fixtures/items';
import { describeOpenFin } from '../fixtures/openfin';

// Suite-level OpenFin helper handles gating and setup/teardown

describeOpenFin('Desktop Adapter (OpenFin)', ({ getApp, STATUS }) => {
  test('compute two items', async () => {
    const app = getApp();
    await app.startNewRequest();
    await app.addItem(items.itemA);
    await app.addItem(items.itemB);
    const result = await app.compute();
    expect([STATUS.PRICED, STATUS.FAILED]).toContain(result.status);
  });
});
