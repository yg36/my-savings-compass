export type Currency = 'INR' | 'USD';

export interface Contribution {
  id: string;
  amount: number;
  date: string;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currency: Currency;
  savedAmount: number;
  contributions: Contribution[];
  createdAt: string;
}

export interface ExchangeRateData {
  rate: number;
  lastUpdated: string;
}
