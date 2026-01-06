import type { ComputeResult } from '../domain/models';
import type { Actor, Question } from './core';

export class ResultStatus implements Question<string> {
  async answeredBy(actor: Actor): Promise<string> {
    const result = actor.recall<ComputeResult>('computeResult');
    if (!result) throw new Error('No pricing result available');
    return result.status;
  }
}

export class ResultValue implements Question<number | undefined> {
  async answeredBy(actor: Actor): Promise<number | undefined> {
    const result = actor.recall<ComputeResult>('computeResult');
    if (!result) throw new Error('No pricing result available');
    return result.pv;
  }
}

export class ResultError implements Question<string | undefined> {
  async answeredBy(actor: Actor): Promise<string | undefined> {
    const result = actor.recall<ComputeResult>('computeResult');
    if (!result) throw new Error('No pricing result available');
    return result.error;
  }
}
