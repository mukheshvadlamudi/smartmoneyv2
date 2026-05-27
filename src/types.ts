export interface Goal {
  id: string;
  name: string;
  type: "emergency" | "vacation" | "home" | "vehicle" | "education" | "retirement" | "gadget";
  targetAmount: number;
  currentAmount: number;
  monthlySavings: number;
  targetDate: string;
  category: string;
}

export interface Debt {
  id: string;
  name: string;
  principal: number;
  interestRate: number; // yearly, e.g. 11.5
  emi: number; // monthly installment
  remainingMonths: number;
  category: "credit-card" | "education-loan" | "personal-loan" | "car-loan";
}

export interface InsurancePolicy {
  id: string;
  name: string;
  type: "health" | "life" | "gadget" | "travel";
  coverage: number;
  premium: number; // monthly/annual premium
  premiumFrequency: "monthly" | "annually";
  deductible: number;
  coPay: number; // percentage
  jargonKeyTerms: { term: string; explanation: string }[];
  lapsedStatus: boolean;
}

export interface AssetAllocation {
  category: string; // e.g., "Mutual Funds (Equity)", "Emergency Cash", "Fixed Deposit", "Gold", "Crypto (Muted)"
  amount: number;
  risk: "low" | "medium" | "high";
  color: string;
  returnsPct: number; // Annualized CAGR, e.g. 14.8
}

export interface Transaction {
  id: string;
  date: string;
  merchant: string;
  category: string;
  amount: number;
  emotionalContext?: "stress-spending" | "impulse" | "normal" | "planned" | "weekend-spikes";
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  type: "warning" | "success" | "info";
  time: string;
}

export interface InvestmentTransaction {
  id: string;
  assetName: string;
  assetType: "equity" | "debt" | "gold" | "intl";
  purchaseDate: string; // YYYY-MM-DD
  purchasePrice: number;
  units: number;
  currentPrice: number;
}

export interface UserFinancialState {
  income: number;
  spending: number;
  savingStreak: number;
  healthScore: number;
  safeSpendDaily: number;
  safeSpendWeekly: number;
  goals: Goal[];
  debts: Debt[];
  policies: InsurancePolicy[];
  wealth: AssetAllocation[];
  transactions: Transaction[];
  notifications: Notification[];
  investmentTransactions: InvestmentTransaction[];
}


export interface SimulationResult {
  savingsImpact: string;
  goalImpact: string;
  runwayMonths: number;
  stressLevel: string;
  summary: string;
  milestoneDate: string;
  recommendation: string;
}
