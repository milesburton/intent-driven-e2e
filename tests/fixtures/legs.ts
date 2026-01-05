import type { OptionLeg } from '../domain/models';

export const itemA: OptionLeg = {
  side: 'BUY',
  type: 'CALL',
  strike: 100,
  expiry: '2026-06-01',
  quantity: 1
};

export const itemB: OptionLeg = {
  side: 'SELL',
  type: 'CALL',
  strike: 105,
  expiry: '2026-06-01',
  quantity: 1
};
