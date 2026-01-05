import type { OptionLeg, PricingResult } from './models';

export interface TradeTicketApp {
  startNewTicket(): Promise<void>;
  addOptionLeg(_leg: OptionLeg): Promise<void>;
  price(): Promise<PricingResult>;
}
