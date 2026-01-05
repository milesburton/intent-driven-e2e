import type { OptionLeg, PricingResult } from '../domain/models';
import type { Actor, Task } from './core';

export class StartNewTicket implements Task {
  async performAs(actor: Actor): Promise<void> {
    await actor.app.startNewTicket();
  }
}

export class AddOptionLeg implements Task {
  constructor(private readonly leg: OptionLeg) {}
  async performAs(actor: Actor): Promise<void> {
    await actor.app.addOptionLeg(this.leg);
  }
}

export class Price implements Task {
  async performAs(actor: Actor): Promise<void> {
    const result: PricingResult = await actor.app.price();
    actor.remember('pricingResult', result);
  }
}
