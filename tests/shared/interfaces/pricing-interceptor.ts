import type { ComputeResult } from '../domain/models';
import type { STATUS_PRICED, STATUS_FAILED } from '../domain/models';

export type PricedOrFailedStatus = typeof STATUS_PRICED | typeof STATUS_FAILED;

export interface PricingInterceptor {
  expectedUrl: string;
  onRequest?: (payload: unknown) => void;
  response: Omit<ComputeResult, 'status'> & { status: PricedOrFailedStatus };
}
