import type { OptionLeg, PricingResult } from './models';

export interface TradeTicketApp {
  startNewTicket(): Promise<void>;
  addOptionLeg(leg: OptionLeg): Promise<void>;
  price(): Promise<PricingResult>;
}
