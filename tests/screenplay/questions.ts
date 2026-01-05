import type { PricingResult } from '../domain/models';
import type { Actor, Question } from './core';

export class PricingStatus implements Question<string> {
  async answeredBy(actor: Actor): Promise<string> {
    const result = actor.recall<PricingResult>('pricingResult');
    if (!result) throw new Error('No pricing result available');
    return result.status;
  }
}

export class PricingPV implements Question<number | undefined> {
  async answeredBy(actor: Actor): Promise<number | undefined> {
    const result = actor.recall<PricingResult>('pricingResult');
    if (!result) throw new Error('No pricing result available');
    return result.pv;
  }
}
