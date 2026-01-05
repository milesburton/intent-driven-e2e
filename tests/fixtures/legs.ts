import type { OptionLeg } from '../domain/models';

export const buyCall: OptionLeg = {
  side: 'BUY',
  type: 'CALL',
  strike: 100,
  expiry: '2026-06-01',
  quantity: 1
};

export const sellCall: OptionLeg = {
  side: 'SELL',
  type: 'CALL',
  strike: 105,
  expiry: '2026-06-01',
  quantity: 1
};
