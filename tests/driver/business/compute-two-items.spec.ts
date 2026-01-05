import { expect, test } from 'vitest';
import { createChromiumFixture } from '../fixtures/chromium.fixture';
import { itemA, itemB } from '../../shared/fixtures/items';
import { MockFormApp } from '../../app/mock-form-app';
import { Actor } from '../../screenplay/core';
import { StartNewRequest, AddItem, Compute } from '../../screenplay/tasks';
import { ResultStatus, ResultValue } from '../../screenplay/questions';

let seenPayload: unknown | null = null;

const fixture = createChromiumFixture({
  expectedUrl: 'http://service.local/compute',
  onRequest: (payload: unknown) => {
    seenPayload = payload;
  },
  response: { status: 'PRICED', pv: 123.45 }
});

test('compute two items (chromium adapter)', async () => {
  await fixture.app.startNewRequest();
  await fixture.app.addItem(itemA);
  await fixture.app.addItem(itemB);

  const result = await fixture.app.compute();

  expect(result.status).toBe('PRICED');
  expect(result.pv).toBe(123.45);
  expect(seenPayload).toEqual({ items: [itemA, itemB] });
});

test('compute two items (Actor pattern)', async () => {
  const trader = new Actor('Trader', fixture.app);

  await trader.attemptsTo(
    new StartNewRequest(),
    new AddItem(itemA),
    new AddItem(itemB),
    new Compute()
  );

  expect(await trader.asks(new ResultStatus())).toBe('PRICED');
  expect(await trader.asks(new ResultValue())).toBe(123.45);
  expect(seenPayload).toEqual({ items: [itemA, itemB] });
});

test('compute two items (MockFormApp)', async () => {
  const app = new MockFormApp();

  await app.startNewRequest();
  await app.addItem(itemA);
  await app.addItem(itemB);

  const result = await app.compute();

  expect(result.status).toBe('PRICED');
  expect(result.pv).toBeCloseTo(-5, 6);
});
