import type { OptionLeg, PricingResult } from './models';

export interface RequestFormApp {
  startNewTicket(): Promise<void>;
  addOptionLeg(_leg: OptionLeg): Promise<void>;
  price(): Promise<PricingResult>;
}
