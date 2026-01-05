import type { RequestItem } from '../domain/models';

export const itemA: RequestItem = {
  side: 'BUY',
  type: 'CALL',
  strike: 100,
  expiry: '2026-06-01',
  quantity: 1
};

export const itemB: RequestItem = {
  side: 'SELL',
  type: 'CALL',
  strike: 105,
  expiry: '2026-06-01',
  quantity: 1
};
