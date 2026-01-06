import { describe, it, expect } from 'vitest';
import { createAppFixture } from '../../helpers/app-fixture';
import { itemA, itemB } from '../../shared/fixtures/items';
import { STATUS } from '../../../app/src/types';

let captured: unknown[] = [];

const fixture = createAppFixture({
  expectedUrl: 'http://service.local/compute',
  onRequest: (payload: unknown) => {
    captured.push(payload);
  },
  response: { status: 'PRICED', pv: 999 }
});

describe('Remove item — payload reflects deletion', () => {
  it('posts one item after removing the first', async () => {
    captured = [];
    await fixture.app.startNewRequest();
    await fixture.app.addItem(itemA);
    await fixture.app.addItem(itemB);

    await fixture.app.removeItem(0);

    const result = await fixture.app.compute();

    expect(captured.length).toBe(1);
    const body = captured[0] as { items: Array<Record<string, unknown>> };
    expect(Array.isArray(body.items)).toBe(true);
    expect(body.items.length).toBe(1);

    expect(result.status).toBe(STATUS.PRICED);
    expect(result.pv).toBe(999);
  });
});
