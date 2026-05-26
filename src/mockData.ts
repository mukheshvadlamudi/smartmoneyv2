import { UserFinancialState } from "./types";

export const initialFinancialState: UserFinancialState = {
  income: 375000, // Monthly salary (~45 Lakhs per annum)
  spending: 120000,
  savingStreak: 12, // 12-month streak
  healthScore: 88, // scale of 100
  safeSpendDaily: 3500,
  safeSpendWeekly: 25000,
  goals: [
    {
      id: "goal1",
      name: "Emergency Safety Net (12M)",
      type: "emergency",
      targetAmount: 1500000,
      currentAmount: 1500000, // Fully funded emergency cushion!
      monthlySavings: 50000,
      targetDate: "2026-12-31",
      category: "Safety"
    },
    {
      id: "goal2",
      name: "Premium EV SUV Purchase",
      type: "vehicle",
      targetAmount: 4500000,
      currentAmount: 1800000,
      monthlySavings: 75000,
      targetDate: "2027-06-15",
      category: "Asset Creation"
    },
    {
      id: "goal3",
      name: "International Luxury Travel Fund",
      type: "vacation",
      targetAmount: 1200000,
      currentAmount: 750000,
      monthlySavings: 40000,
      targetDate: "2026-11-01",
      category: "Experiences"
    }
  ],
  debts: [
    {
      id: "debt1",
      name: "HDFC Premium Home Loan",
      principal: 3300000, // 33 Lakhs remaining
      interestRate: 8.4,
      emi: 55000,
      remainingMonths: 60,
      category: "personal-loan"
    },
    {
      id: "debt2",
      name: "SBI Luxury EV Car Loan",
      principal: 200000, // 2 Lakhs remaining
      interestRate: 9.0,
      emi: 15000,
      remainingMonths: 10,
      category: "car-loan"
    }
  ],
  policies: [
    {
      id: "pol1",
      name: "Max Bupa Health Companion Premium",
      type: "health",
      coverage: 3000000, // 30 Lakhs coverage
      premium: 2450,
      premiumFrequency: "monthly",
      deductible: 10000,
      coPay: 10,
      jargonKeyTerms: [
        { term: "Deductible", explanation: "The amount you must pay out-of-pocket before insurance active coverage starts covering expenses." },
        { term: "Co-Payment", explanation: "A flat 10% share of the hospital bill you agree to split for medical treatments." },
        { term: "Pre-existing Disease Wait Period", explanation: "A 36-month clause where pre-existing illnesses aren't eligible for claims." }
      ],
      lapsedStatus: false
    },
    {
      id: "pol2",
      name: "HDFC Life Click 2 Protect Optima",
      type: "life",
      coverage: 15000000, // 1.5 Cr coverage
      premium: 1500,
      premiumFrequency: "monthly",
      deductible: 0,
      coPay: 0,
      jargonKeyTerms: [
        { term: "Term Assurance", explanation: "Pure life coverage paying out full sum assured in case of critical events." },
        { term: "Rider Benefits", explanation: "Additional premium clauses covering accidental disability or critical illness payouts." }
      ],
      lapsedStatus: false
    }
  ],
  wealth: [
    {
      category: "Equity & Mutual Funds (Nifty 50 Index)",
      amount: 21500000, // 2.15 Cr
      risk: "high",
      color: "rgba(167, 243, 208, 0.6)" // Soft pastel sage
    },
    {
      category: "Liquid Emergency Cash (HDFC Savings)",
      amount: 5000000, // 50 Lakhs
      risk: "low",
      color: "rgba(191, 219, 254, 0.6)" // Soft pastel blue
    },
    {
      category: "Sovereign Gold Bonds (RBI Series)",
      amount: 3000000, // 30 Lakhs
      risk: "medium",
      color: "rgba(254, 243, 199, 0.6)" // Soft beige
    },
    {
      category: "Commercial Real Estate Fund (Reit Index)",
      amount: 10000000, // 1.0 Crore
      risk: "medium",
      color: "rgba(233, 213, 255, 0.6)" // Soft muted lavender
    }
  ],
  transactions: [
    {
      id: "t1",
      date: "2026-05-25",
      merchant: "Starbucks Specialty Coffee",
      category: "Food & Dining",
      amount: 480,
      emotionalContext: "stress-spending"
    },
    {
      id: "t2",
      date: "2026-05-24",
      merchant: "Blinkit Late Night Snacks",
      category: "Groceries",
      amount: 850,
      emotionalContext: "weekend-spikes"
    },
    {
      id: "t3",
      date: "2026-05-23",
      merchant: "Swiggy Gourmet Dinner",
      category: "Food & Dining",
      amount: 1520,
      emotionalContext: "weekend-spikes"
    },
    {
      id: "t4",
      date: "2026-05-22",
      merchant: "Steam Games - Autumn Sale",
      category: "Entertainment",
      amount: 2499,
      emotionalContext: "impulse"
    },
    {
      id: "t5",
      date: "2026-05-20",
      merchant: "SGS Auto Monthly Fuel refill",
      category: "Transport",
      amount: 3500,
      emotionalContext: "planned"
    },
    {
      id: "t6",
      date: "2026-05-18",
      merchant: "Gym Membership Installment",
      category: "Health & Fitness",
      amount: 2200,
      emotionalContext: "normal"
    },
    {
      id: "t7",
      date: "2026-05-15",
      merchant: "Urban Company Bedside Massage",
      category: "Self Care",
      amount: 1999,
      emotionalContext: "stress-spending"
    }
  ],
  notifications: [
    {
      id: "n1",
      title: "Emotional spending pattern alert",
      body: "Late night food purchases coordinate with periods of high stress spending. Consider a 10-minute wind down instead.",
      type: "warning",
      time: "10h ago"
    },
    {
      id: "n2",
      title: "Education Loan Optimization Suggestion",
      body: "Paying ₹22,000 extra on Loan A this month saves ₹42,000 interest and releases 4 months of runway.",
      type: "info",
      time: "1 day ago"
    },
    {
      id: "n3",
      title: "Vacation Milestone Achievement",
      body: "Your saving streak achieved 11% faster velocity for Japan Cherry Blossom 2027 plan!",
      type: "success",
      time: "3 days ago"
    }
  ]
};
