import type { TradeTicketApp } from '../domain/trade-ticket-app.interface';

export interface Task {
  performAs(actor: Actor): Promise<void>;
}

export interface Question<T> {
  answeredBy(actor: Actor): Promise<T>;
}

export class Actor {
  private memory = new Map<string, unknown>();
  public constructor(
    public readonly name: string,
    public readonly app: TradeTicketApp
  ) {}

  public async attemptsTo(...tasks: Task[]): Promise<void> {
    for (const t of tasks) {
      await t.performAs(this);
    }
  }

  public async asks<T>(question: Question<T>): Promise<T> {
    return question.answeredBy(this);
  }

  public remember<T>(key: string, value: T): void {
    this.memory.set(key, value);
  }

  public recall<T>(key: string): T | undefined {
    return this.memory.get(key) as T | undefined;
  }
}
