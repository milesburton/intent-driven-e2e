import type { ComputeResult } from "../domain/models";
import type { STATUS_COMPLETED, STATUS_FAILED } from "../domain/models";

export type CompletedOrFailedStatus = typeof STATUS_COMPLETED | typeof STATUS_FAILED;

export interface ComputeInterceptor {
  expectedUrl: string;
  onRequest?: (payload: unknown) => void;
  response: Omit<ComputeResult, "status"> & { status: CompletedOrFailedStatus };
}
