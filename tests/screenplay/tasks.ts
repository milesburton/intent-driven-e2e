import type { RequestItem, ComputeResult } from '../domain/models';
import type { Actor, Task } from './core';

export class StartNewRequest implements Task {
  async performAs(actor: Actor): Promise<void> {
    await actor.app.startNewRequest();
  }
}

export class AddItem implements Task {
  constructor(private readonly item: RequestItem) {}
  async performAs(actor: Actor): Promise<void> {
    await actor.app.addItem(this.item);
  }
}

export class Compute implements Task {
  async performAs(actor: Actor): Promise<void> {
    const result: ComputeResult = await actor.app.compute();
    actor.remember('computeResult', result);
  }
}

export class RemoveItem implements Task {
  constructor(private readonly index: number) {}
  async performAs(actor: Actor): Promise<void> {
    await actor.app.removeItem(this.index);
  }
}
