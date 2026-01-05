import { expect, test } from 'vitest';
import { createChromiumFixture } from '../fixtures/chromium.fixture';
import { ERRORS, STATUS } from '../../../app/src/types';
import { MockFormApp } from '../../app/mock-form-app';
import { Actor } from '../../screenplay/core';
import { StartNewRequest, Compute } from '../../screenplay/tasks';
import { ResultStatus, ResultValue } from '../../screenplay/questions';

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

test('compute with no items returns FAILED (Actor pattern)', async () => {
  const trader = new Actor('Trader', fixture.app);
  await trader.attemptsTo(new StartNewRequest(), new Compute());

  expect(await trader.asks(new ResultStatus())).toBe(STATUS.FAILED);
  expect(await trader.asks(new ResultValue())).toBeUndefined();
});

test('compute with no items returns FAILED (MockFormApp)', async () => {
  const app = new MockFormApp();
  await app.startNewRequest();
  const result = await app.compute();

  expect(result.status).toBe(STATUS.FAILED);
  expect(result.error).toBe(ERRORS.NO_ITEMS);
  expect(result.pv).toBeUndefined();
});
