import type { RequestItem } from '../domain/models';

export const itemA: RequestItem = {
  side: 'IN',
  type: 'A',
  strike: 100,
  expiry: '2026-06-01',
  quantity: 1
};

export const itemB: RequestItem = {
  side: 'OUT',
  type: 'A',
  strike: 105,
  expiry: '2026-06-01',
  quantity: 1
};

export const items = {
  itemA,
  itemB
};
