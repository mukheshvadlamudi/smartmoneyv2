"use client";

import React, { useState, useEffect, useRef } from "react";
import LandingPage from "../components/LandingPage";
import AICommandCenter from "../components/AICommandCenter";
import SpendingIntelligence from "../components/SpendingIntelligence";
import FutureSimulator from "../components/FutureSimulator";
import WealthManagement from "../components/WealthManagement";
import ProtectionInsurance from "../components/ProtectionInsurance";
import DebtOptimization from "../components/DebtOptimization";
import AICouncil from "../components/AICouncil";
import FinancialEncyclopedia from "../components/FinancialEncyclopedia";
import InvestmentPortfolio from "../components/InvestmentPortfolio";
import Tax80COptimizer from "../components/Tax80COptimizer";
import TaxRegimeComparator from "../components/TaxRegimeComparator";
import TaxAuditor from "../components/TaxAuditor";
import TaxHarvestingAdvisor from "../components/TaxHarvestingAdvisor";
import GoalsSystem from "../components/GoalsSystem";

import { initialFinancialState } from "../mockData";
import { UserFinancialState } from "../types";
import { 
  Sparkles, Landmark, LayoutDashboard, Compass, ChevronDown, 
  ShieldCheck, Zap, BookOpen, AlertCircle, TrendingUp, PieChart, LogOut, Scale,
  Target, Bell
} from "lucide-react";

export default function Page() {
  const [onboarded, setOnboarded] = useState<boolean>(false);
  const [financialState, setFinancialState] = useState<UserFinancialState>(initialFinancialState);
  const [currentTab, setCurrentTab] = useState<string>("dashboard"); // "dashboard", "insights", "simulator", "debt", "protection", "advisors", "learn"
  const [isApiLive, setIsApiLive] = useState(false);
  const [showStory, setShowStory] = useState(true);
  const [mounted, setMounted] = useState(false);
  
  // Hover states for dropdown menus
  const [hoveredFolder, setHoveredFolder] = useState<string | null>(null);

  // Mobile Bottom Navigation Drawers/Sheets
  const [activeMobileSheet, setActiveMobileSheet] = useState<"optimize" | "analyze" | "tax" | null>(null);

  // Unified Floating AI Chatbot states
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "user" | "ai"; text: string }>>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // Avoid hydration mismatch by waiting until mounted
  useEffect(() => {
    setMounted(true);
    const savedOnboarded = localStorage.getItem("smart_money_onboarded");
    if (savedOnboarded === "true") {
      setOnboarded(true);
    }
    const savedState = localStorage.getItem("smart_money_financial_state");
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        // Force upgrade old low-income cached states to show the new ₹45 Lakhs / ₹3.6 Cr profile
        if (!parsed.income || parsed.income < 300000) {
          setFinancialState(initialFinancialState);
          localStorage.setItem("smart_money_financial_state", JSON.stringify(initialFinancialState));
        } else {
          // Merge default investment transactions if they do not exist in the cached state schema
          if (!parsed.investmentTransactions) {
            parsed.investmentTransactions = initialFinancialState.investmentTransactions;
          }
          setFinancialState(parsed);
        }
      } catch (err) {
        setFinancialState(initialFinancialState);
      }
    } else {
      setFinancialState(initialFinancialState);
    }
  }, []);

  // Sync state to localStorage
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("smart_money_financial_state", JSON.stringify(financialState));
    localStorage.setItem("smart_money_onboarded", onboarded ? "true" : "false");
  }, [financialState, onboarded, mounted]);

  // Check server health
  useEffect(() => {
    fetch("/api/health")
      .then(r => r.json())
      .then(data => {
        setIsApiLive(data.hasApiKey);
      })
      .catch(() => setIsApiLive(false));
  }, []);

  // Archetype Sandbox loaders
  const loadRohanProfile = () => {
    setFinancialState({
      income: 90000,
      spending: 75000,
      savingStreak: 3,
      healthScore: 68,
      safeSpendDaily: 500,
      safeSpendWeekly: 3500,
      goals: [
        {
          id: "rohan_goal_1",
          name: "Emergency Safety Net (6M)",
          type: "emergency",
          targetAmount: 300000,
          currentAmount: 85000,
          monthlySavings: 15000,
          targetDate: "2026-12-31",
          category: "Safety"
        },
        {
          id: "rohan_goal_2",
          name: "Latest iPhone Upgrade Fund",
          type: "gadget",
          targetAmount: 120000,
          currentAmount: 30000,
          monthlySavings: 8000,
          targetDate: "2026-10-01",
          category: "Experiences"
        }
      ],
      debts: [
        {
          id: "rohan_debt_1",
          name: "HDFC High Interest Credit Card",
          principal: 45000,
          interestRate: 42.0,
          emi: 4500,
          remainingMonths: 12,
          category: "credit-card"
        }
      ],
      policies: [
        {
          id: "rohan_pol_1",
          name: "Corporate Group Health Cover",
          type: "health",
          coverage: 300000,
          premium: 0,
          premiumFrequency: "annually",
          deductible: 10000,
          coPay: 15,
          jargonKeyTerms: [
            { term: "Co-Payment Ratio", explanation: "You pay 15% of final bills yourself." }
          ],
          lapsedStatus: false
        }
      ],
      wealth: [
        {
          category: "Nifty 50 ELSS Mutual Fund",
          amount: 80000,
          risk: "high",
          color: "rgba(167, 243, 208, 0.6)",
          returnsPct: 15.2
        },
        {
          category: "Liquid Cash Register",
          amount: 15000,
          risk: "low",
          color: "rgba(191, 219, 254, 0.6)",
          returnsPct: 3.5
        }
      ],
      transactions: [
        {
          id: "rt1",
          date: "2026-05-26",
          merchant: "Swiggy Gourmet Dinner",
          category: "Food & Dining",
          amount: 680,
          emotionalContext: "stress-spending",
          paymentMethod: "GPay"
        },
        {
          id: "rt2",
          date: "2026-05-25",
          merchant: "Local Tea Tapri (Vendor)",
          category: "Food & Dining",
          amount: 250,
          emotionalContext: "normal",
          paymentMethod: "Cash"
        },
        {
          id: "rt3",
          date: "2026-05-24",
          merchant: "Auto Commute Rickshaw",
          category: "Transport",
          amount: 350,
          emotionalContext: "planned",
          paymentMethod: "Cash"
        },
        {
          id: "rt4",
          date: "2026-05-23",
          merchant: "Starbucks Office Winddown",
          category: "Food & Dining",
          amount: 450,
          emotionalContext: "stress-spending",
          paymentMethod: "GPay"
        },
        {
          id: "rt5",
          date: "2026-05-22",
          merchant: "Street Food & Snacks Corner",
          category: "Food & Dining",
          amount: 550,
          emotionalContext: "impulse",
          paymentMethod: "Cash"
        },
        {
          id: "rt6",
          date: "2026-05-20",
          merchant: "Suburban Railway Ticket Pass",
          category: "Transport",
          amount: 1200,
          emotionalContext: "planned",
          paymentMethod: "GPay"
        },
        {
          id: "rt7",
          date: "2026-05-18",
          merchant: "Untracked Miscellaneous Cash Leakage",
          category: "Self Care",
          amount: 6000,
          emotionalContext: "impulse",
          paymentMethod: "Cash"
        }
      ],
      notifications: [
        {
          id: "rohan_n_1",
          title: "Mumbai Youth Profile Loaded (Rohan)",
          body: "Income ₹90k. Warning: high untracked Cash Leakage (40% Cash vs GPay). Explore Spending tab to audit leakages!",
          type: "success",
          time: "Just now"
        },
        {
          id: "rohan_n_2",
          title: "Untracked Cash Leakage Detected",
          body: "₹6,000 cash went missing this month. UPI GPay conversion or manual logging suggested.",
          type: "warning",
          time: "1 hour ago"
        }
      ],
      investmentTransactions: [],
      isDemo: true
    });
    setCurrentTab("dashboard");
  };

  const loadVikramProfile = () => {
    setFinancialState({
      income: 110000,
      spending: 65000,
      savingStreak: 8,
      healthScore: 78,
      safeSpendDaily: 1500,
      safeSpendWeekly: 10500,
      goals: [
        {
          id: "vikram_goal_1",
          name: "Emergency PG Rent Buffer",
          type: "emergency",
          targetAmount: 150000,
          currentAmount: 150000,
          monthlySavings: 20000,
          targetDate: "2026-08-31",
          category: "Safety"
        },
        {
          id: "vikram_goal_2",
          name: "Niece's Future Fund (Wishlist)",
          type: "education",
          targetAmount: 1000000,
          currentAmount: 25000,
          monthlySavings: 3000,
          targetDate: "2041-05-27",
          category: "Personal Growth"
        }
      ],
      debts: [
        {
          id: "vikram_debt_1",
          name: "SBI Sister's Wedding Support Loan",
          principal: 180000,
          interestRate: 10.5,
          emi: 12000,
          remainingMonths: 18,
          category: "personal-loan"
        }
      ],
      policies: [
        {
          id: "vikram_pol_1",
          name: "HDFC Life Term Cover (Family Remittance)",
          type: "life",
          coverage: 10000000,
          premium: 950,
          premiumFrequency: "monthly",
          deductible: 0,
          coPay: 0,
          jargonKeyTerms: [
            { term: "Claim Settlement", explanation: "99.2% of claims settled in prior years." }
          ],
          lapsedStatus: false
        }
      ],
      wealth: [
        {
          category: "Public Provident Fund (PPF)",
          amount: 250000,
          risk: "low",
          color: "rgba(191, 219, 254, 0.6)",
          returnsPct: 7.1
        },
        {
          category: "Dynamic Index SIP Funds",
          amount: 60000,
          risk: "high",
          color: "rgba(167, 243, 208, 0.6)",
          returnsPct: 14.8
        }
      ],
      transactions: [
        {
          id: "vt1",
          date: "2026-05-26",
          merchant: "Paid Guest PG Rent Payment",
          category: "Transport",
          amount: 18000,
          emotionalContext: "planned",
          paymentMethod: "GPay"
        },
        {
          id: "vt2",
          date: "2026-05-25",
          merchant: "Family Remittance to Parents",
          category: "Self Care",
          amount: 5000,
          emotionalContext: "planned",
          paymentMethod: "GPay"
        },
        {
          id: "vt3",
          date: "2026-05-24",
          merchant: "Niece's Newborn Gift Basket",
          category: "Entertainment",
          amount: 2200,
          emotionalContext: "planned",
          paymentMethod: "GPay"
        },
        {
          id: "vt4",
          date: "2026-05-20",
          merchant: "PG Mess food subscription",
          category: "Food & Dining",
          amount: 6000,
          emotionalContext: "normal",
          paymentMethod: "GPay"
        }
      ],
      notifications: [
        {
          id: "vikram_n_1",
          title: "PG Tenant Profile Loaded (Vikram)",
          body: "Remitting ₹5k to parents, paying ₹18k PG rent, and starting a dedicated maturing Niece's wishlist fund! Check Target Goals to inspect runway.",
          type: "success",
          time: "Just now"
        },
        {
          id: "vikram_n_2",
          title: "Niece Wishlist Fund Activated",
          body: " maturies fully in 2041. Dynamic compounding calculator is projecting velocity splits.",
          type: "info",
          time: "1 hour ago"
        }
      ],
      investmentTransactions: [],
      isDemo: true
    });
    setCurrentTab("dashboard");
  };

  const getAssistantContext = () => {
    switch (currentTab) {
      case "investments":
        return {
          name: "Investment Co-Pilot",
          icon: "📈",
          desc: "Direct context: Investment Portfolio assets & allocations.",
          suggestions: [
            "Should I shift cash registers to dynamic mutual funds?",
            "Analyze my overall CAGR returns & asset risk split.",
            "How do Sovereign Gold Bonds compound my wealth?"
          ],
          apiEndpoint: "/api/gemini/chat",
          systemPrompt: "You are the premium Smart Money Investment Co-Pilot. Use the active wealth state data to suggest optimal rebalancing shifts, PPF/SIP allocations, or gold splits."
        };
      case "insights":
        return {
          name: "Expense Auditor",
          icon: "📊",
          desc: "Direct context: Emotional patterns & Cash Leakage tracking.",
          suggestions: [
            "Where can I cut costs this month?",
            "Analyze my Cash vs GPay leakage ratio.",
            "Are my specialty coffee Swiggy outlays draining me?"
          ],
          apiEndpoint: "/api/gemini/chat",
          systemPrompt: "You are the premium Expense Auditor. Analyze emotional spikes, impulse buys, and cash leaks to plug savings gaps instantly."
        };
      case "goals":
        return {
          name: "Milestone Strategist",
          icon: "🎯",
          desc: "Direct context: Milestone plans & dynamic runway predictions.",
          suggestions: [
            "How can I reach my premium EV SUV goal faster?",
            "Review the runway timeline for my EMERGENCY fund.",
            "Start a custom mature wishlist fund for my niece."
          ],
          apiEndpoint: "/api/gemini/chat",
          systemPrompt: "You are the Milestone Strategist. Help user optimize goal velocity. Free up cash to accelerate emergency buffers or luxury gadgets."
        };
      case "debt":
        return {
          name: "Debt Freedom Catalyst",
          icon: "⚡",
          desc: "Direct context: Outstanding liabilities, rates, and early payoff strategies.",
          suggestions: [
            "Should I prioritize Avalanche or Snowball method?",
            "What interest will I save if I sweep ₹15,000 extra?",
            "How fast can I fully clear my HDFC loan?"
          ],
          apiEndpoint: "/api/gemini/chat",
          systemPrompt: "You are the Debt Freedom Catalyst. Guide the user in early repayment pathways. Compare Avalanche vs Snowball math using their real loan balances."
        };
      case "protection":
        return {
          name: "Risk & Protection Underwriter",
          icon: "🛡️",
          desc: "Direct context: active health, life, gadget covers & claims translation.",
          suggestions: [
            "Audit my medical cover for severe coverage gaps.",
            "Translate premium co-pay deductible clauses.",
            "Explain the exact out-of-network claims workflow."
          ],
          apiEndpoint: "/api/gemini/chat",
          systemPrompt: "You are the Risk & Protection Underwriter. Demystify healthcare insurance jargon, identify policy voids, and lay out clean claims procedures."
        };
      case "tax-80c":
      case "tax-regime":
      case "tax-auditor":
      case "tax-harvest":
        return {
          name: "Tax Efficiency Strategist",
          icon: "⚖️",
          desc: "Direct context: Indian Income Tax Slabs, 80C optimizations & LTCG laws.",
          suggestions: [
            "Old vs New Regime: which saves me more tax?",
            "Maximize my ₹1.5L exemption under Section 80C.",
            "Am I eligible for LTCG tax harvesting before March?"
          ],
          apiEndpoint: "/api/gemini/chat",
          systemPrompt: "You are the premium Tax Efficiency Strategist. Assess HRA rent payments, EPF/PPF splits, and post-Budget 2024 capital gains to save user significant tax."
        };
      case "learn":
        return {
          name: "Wealth Educator",
          icon: "📚",
          desc: "Direct context: Financial Encyclopedia & financial terminology.",
          suggestions: [
            "Explain debt mutual fund slab rate rules (Section 50AA).",
            "What is LTCG tax harvesting indexation?",
            "Contrast HRA exemptions against home loan interest."
          ],
          apiEndpoint: "/api/gemini/chat",
          systemPrompt: "You are the Wealth Educator. Explain complex legal tax acts and personal wealth structures in simple terms."
        };
      default:
        return {
          name: "Overview Advisor",
          icon: "🤖",
          desc: "Direct context: Overall Smart Money workspace dashboard.",
          suggestions: [
            "Give me a complete audit of my financial health score.",
            "How can I compound extra savings in my current phase?",
            "What is my next priority checklist action?"
          ],
          apiEndpoint: "/api/gemini/chat",
          systemPrompt: "You are the premium Smart Money Overview Advisor. Assess savings streaks, debt levels, wealth assets, and overall health scores to deliver strategic wealth coaching."
        };
    }
  };

  const getDynamicWeeklyStory = () => {
    const hasGoals = financialState.goals.length > 0;
    const hasDebts = financialState.debts.length > 0;
    
    if (financialState.isDemo) {
      return (
        <>
          You stayed under budget, cleared <span className="font-semibold text-emerald-600">₹5,000</span> off your HDFC card liability, and moved <span className="font-semibold text-emerald-600">4% closer</span> to your Japan Cherry Blossom vacation goal.
        </>
      );
    }
    
    if (!hasGoals && !hasDebts) {
      return (
        <>
          Welcome to your clean financial dashboard! Start by adding your active milestone goals and outstanding liabilities under the <span className="font-semibold text-slate-800">Optimization</span> dropdown menu above.
        </>
      );
    }
    
    let storyText = "You are tracking well this week! ";
    let details: React.ReactNode[] = [];
    if (hasDebts) {
      const primaryDebt = financialState.debts[0];
      details.push(
        <span key="debt">
          Paying your ₹{primaryDebt.emi.toLocaleString()}/mo EMI on {primaryDebt.name} keeps you on track.{" "}
        </span>
      );
    }
    if (hasGoals) {
      const primaryGoal = financialState.goals[0];
      details.push(
        <span key="goal">
          Your planned monthly savings are steadily moving you closer to your {primaryGoal.name}.
        </span>
      );
    }
    return <>{storyText}{details}</>;
  };

  const triggerDailyAudit = () => {
    const newNotifications = [];
    const surplus = financialState.income - financialState.spending;
    const hasGoals = financialState.goals.length > 0;
    const hasDebts = financialState.debts.length > 0;

    // Rule 1: High Spending Outlay Alert
    if (financialState.spending > financialState.income * 0.75) {
      const pct = Math.round((financialState.spending / financialState.income) * 100);
      newNotifications.push({
        id: "audit_spend_" + Date.now(),
        title: "High Spending Outlay Warning",
        body: `Your spending consumes ${pct}% of your income. Consider restricting discretionary outlays to protect your runway.`,
        type: "warning" as const,
        time: "Just now"
      });
    }

    // Rule 2: Goal Drift Alert
    if (hasGoals) {
      financialState.goals.forEach((g) => {
        if (g.currentAmount < g.targetAmount && g.monthlySavings > surplus) {
          newNotifications.push({
            id: `audit_goal_${g.id}_` + Date.now(),
            title: `Goal Drift Alert: ${g.name}`,
            body: `Your current surplus (₹${surplus.toLocaleString()}/mo) cannot cover your ₹${g.monthlySavings.toLocaleString()}/mo planned target. Timeline will drift.`,
            type: "warning" as const,
            time: "Just now"
          });
        }
      });
    }

    // Rule 3: High Interest Debt Alert
    if (hasDebts) {
      financialState.debts.forEach((d) => {
        if (d.interestRate > 25) {
          newNotifications.push({
            id: `audit_debt_${d.id}_` + Date.now(),
            title: `High Interest Debt Warning`,
            body: `${d.name} carries a very high interest rate of ${d.interestRate}%. Target prepaying this immediately to release interest leakage.`,
            type: "warning" as const,
            time: "Just now"
          });
        }
      });
    }

    // Rule 4: Streak Milestone celebration
    if (financialState.savingStreak >= 3) {
      newNotifications.push({
        id: "audit_streak_" + Date.now(),
        title: "Savings Streak Landmark",
        body: `Excellent resilience! Your active saving streak is at ${financialState.savingStreak} months. Dynamic runway indicators are fully optimized.`,
        type: "success" as const,
        time: "Just now"
      });
    }

    // Rule 5: Protection covers gaps
    if (!financialState.policies || financialState.policies.length === 0) {
      newNotifications.push({
        id: "audit_policy_void_" + Date.now(),
        title: "Protection Gaps Audited",
        body: "Critical warning: You have ₹0 active term life or healthcare coverage. Protect your asset base against emergency outlays.",
        type: "info" as const,
        time: "Just now"
      });
    }

    // Rule 6: Gold allocation
    const goldWealth = financialState.wealth.find(w => w.category.toLowerCase().includes("gold"));
    if (!goldWealth && !financialState.isDemo) {
      newNotifications.push({
        id: "audit_gold_lack_" + Date.now(),
        title: "Asset Allocation Recommendation",
        body: "Gold ETF or Sovereign Gold Bonds are missing from your wealth matrix. We recommend keeping 5-10% in gold for inflation hedge.",
        type: "info" as const,
        time: "Just now"
      });
    }

    // Prepend new notifications
    if (newNotifications.length > 0) {
      setFinancialState(prev => ({
        ...prev,
        notifications: [...newNotifications, ...prev.notifications]
      }));
    } else {
      // General generic healthy alert
      setFinancialState(prev => ({
        ...prev,
        notifications: [
          {
            id: "audit_healthy_" + Date.now(),
            title: "Dynamic Smart Audit Completed",
            body: "Your cash outlays, debt interest metrics, and goal runways are highly stable. Continue tracking daily outlays.",
            type: "success" as const,
            time: "Just now"
          },
          ...prev.notifications
        ]
      }));
    }
  };

  const handleSendChatQuery = async (queryText?: string) => {
    const textToSend = queryText || chatInput;
    if (!textToSend.trim() || chatLoading) return;

    const userMsg = { sender: "user" as const, text: textToSend };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput("");
    setChatLoading(true);

    const ctx = getAssistantContext();

    try {
      const bodyPayload = {
        userData: {
          income: financialState.income,
          spending: financialState.spending,
          wealth: financialState.wealth,
          debts: financialState.debts,
          goals: financialState.goals,
          policies: financialState.policies
        },
        currentTab: currentTab,
        question: textToSend
      };

      const res = await fetch(ctx.apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyPayload)
      });

      if (!res.ok) throw new Error("CHAT QUERY ERROR");

      const data = await res.json();
      const answerText = data.response || data.advice || data.message || "No response compiled.";

      setChatMessages(prev => [...prev, { sender: "ai", text: answerText }]);
    } catch {
      setTimeout(() => {
        let fallbackMsg = "";
        const queryLower = textToSend.toLowerCase();
        const surplus = financialState.income - financialState.spending;

        if (currentTab === "goals") {
          if (queryLower.includes("minimize") || queryLower.includes("increase") || queryLower.includes("travel") || queryLower.includes("emergency") || queryLower.includes("change")) {
            fallbackMsg = `🎯 **Milestone Strategist - Goal Reallocation Analysis**\n\nThat is an exceptionally logical question. Let's analyze reallocating your monthly savings velocity:\n\n1. **Travel Fund De-escalation**: Minimizing your *International Luxury Travel Fund* monthly savings from ₹40,000 to ₹15,000 frees up **₹25,000** in monthly surplus cash flow.\n2. **Emergency Net Acceleration**: Shifting this ₹25,000 sweep directly into your *Emergency Safety Net* increases its velocity to **₹75,000/mo**.\n\n📈 **Outcome Timeline Impact**:\n- **Emergency Net**: Your target is achieved **2.4 months earlier** (fully funded in under 4 months instead of 6!).\n- **Travel Goal**: Delay is minimal. Compounding at lower velocity still matures the travel target by late 2027.\n\n💡 **Arbiter Verdict**: System highly recommends this shift. Establishing a bulletproof emergency cushion first de-risks all investment variables and secures a solid runway.`;
          } else {
            fallbackMsg = `Regarding your target objectives: staying on the current SIP sweep speed gets you to your EV SUV goal fully by 2027. Adjusting variable dining outlays speeds up the timeline by 22 days!`;
          }
        } else if (currentTab === "investments") {
          fallbackMsg = `Based on your allocated assets of ₹${financialState.wealth.reduce((acc,w)=>acc+w.amount, 0).toLocaleString()}, I advise consolidating mutual funds. With your current ₹${financialState.income.toLocaleString()}/mo wage flow, automate a larger ₹10k SIP Sweep directly into standard dynamic ETFs for long-term compound growth.`;
        } else if (currentTab === "insights") {
          fallbackMsg = `Analyzing cash registry outlays: untracked cash leakages constitutes a high saving threat. Try substituting street cash registers for GPay dynamic alerts, which immediately channels an extra ₹5,000 monthly surplus into early safety buffers.`;
        } else if (currentTab === "debt") {
          fallbackMsg = `Your total outstanding debts are ₹${financialState.debts.reduce((acc,d)=>acc+d.principal,0).toLocaleString()}. Mathematically, directing a ₹15k Early Payoff surplus onto your credit card/loans saves outstanding interest and advances your wage freedom date by 8 months.`;
        } else if (currentTab === "protection") {
          fallbackMsg = `For your active healthcare buffers: save original bills, secure diagnosis slips immediately, and file within 7 days. Audit showed high co-pay splits, suggesting a ₹500/mo upgrade to avoid out-of-pocket leakage.`;
        } else {
          fallbackMsg = `Overall financial health audit: Your Health Score stands solid at ${financialState.healthScore}/100. System recommends clearing your Credit Card liability first (42% rate drain) before locking surplus cash in long-term index mutual funds.`;
        }
        setChatMessages(prev => [...prev, { sender: "ai", text: fallbackMsg }]);
      }, 1000);
    } finally {
      setChatLoading(false);
    }
  };

  // Welcome message contextual triggers
  useEffect(() => {
    if (!mounted) return;
    const ctx = getAssistantContext();
    setChatMessages([
      {
        sender: "ai",
        text: `Welcome! I am your **${ctx.name}**. I have direct access to your ${currentTab === "dashboard" ? "overall financial health registers" : currentTab + " workspace context"}.\n\nHow can I assist you today?`
      }
    ]);
  }, [currentTab, mounted]);

  const handleCompleteOnboarding = (data: {
    name: string;
    goals: string[];
    risk: string;
    income: number;
    expenses: number;
    debts: number;
    priority: string;
    isDemo?: boolean;
  }) => {
    if (data.isDemo) {
      setFinancialState(initialFinancialState);
    } else {
      // Calculate dynamic goals based on selected keys
      const customGoals = data.goals.map((gKey) => {
        if (gKey === "emergency") {
          return {
            id: "g_emergency",
            name: "Emergency Safety Net (12M)",
            type: "emergency" as const,
            targetAmount: data.expenses * 12,
            currentAmount: 0, // starts completely clean!
            monthlySavings: Math.round((data.income - data.expenses) * 0.4),
            targetDate: "2027-05-31",
            category: "Safety"
          };
        }
        if (gKey === "vacation") {
          return {
            id: "g_vacation",
            name: "Luxury Vacation Fund",
            type: "vacation" as const,
            targetAmount: 300000,
            currentAmount: 0,
            monthlySavings: Math.round((data.income - data.expenses) * 0.2),
            targetDate: "2027-04-15",
            category: "Experiences"
          };
        }
        if (gKey === "vehicle") {
          return {
            id: "g_vehicle",
            name: "Premium EV Car Purchase",
            type: "vehicle" as const,
            targetAmount: 2500000,
            currentAmount: 0,
            monthlySavings: Math.round((data.income - data.expenses) * 0.3),
            targetDate: "2027-12-15",
            category: "Asset Creation"
          };
        }
        if (gKey === "debt") {
          return {
            id: "g_debt",
            name: "Debt Freedom Reserve",
            type: "emergency" as const,
            targetAmount: data.debts,
            currentAmount: 0,
            monthlySavings: Math.round((data.income - data.expenses) * 0.3),
            targetDate: "2027-09-30",
            category: "Stability"
          };
        }
        return {
          id: "g_retirement",
          name: "Retirement Compound Net",
          type: "retirement" as const,
          targetAmount: 5000000,
          currentAmount: 0,
          monthlySavings: Math.round((data.income - data.expenses) * 0.3),
          targetDate: "2046-12-31",
          category: "Long-term Wealth"
        };
      });

      // Calculate dynamic loan entry if debts > 0
      const customDebts = data.debts > 0 ? [
        {
          id: "d_user_loan",
          name: "Outstanding Personal Loan",
          principal: data.debts,
          interestRate: 9.5,
          emi: Math.round(data.debts * 0.015),
          remainingMonths: 120,
          category: "personal-loan" as const
        }
      ] : [];

      // Completely clean slate: zero preloaded wealth/assets! The user can add them later manually.
      const customWealth: any[] = [];

      // Completely clean slate: zero preloaded transaction logs!
      const customTransactions: any[] = [];

      const scoreMultiplier = data.priority === "stability" ? 82 : (data.priority === "reduceDebt" ? 64 : 70);

      setFinancialState({
        income: data.income,
        spending: data.expenses,
        savingStreak: 1,
        healthScore: scoreMultiplier,
        safeSpendDaily: Math.round((data.income - data.expenses) / 30),
        safeSpendWeekly: Math.round((data.income - data.expenses) / 4),
        goals: customGoals,
        debts: customDebts,
        policies: [], // Starts with clean slate policies
        wealth: customWealth,
        transactions: customTransactions,
        investmentTransactions: [], // Completely clean ledger, loaded dynamically or manually inside dashboards
        notifications: [
          {
            id: "onb_notif",
            title: `Welcome, ${data.name}! Smart Money Setup Completed`,
            body: `Your profile priority is set to [${data.priority}]. Dynamic safe-spending calculations and personalized advisor suggestions are prepared.`,
            type: "success",
            time: "Just now"
          }
        ],
        isDemo: false
      });
    }
    setOnboarded(true);
    setCurrentTab("dashboard");
  };

  const handleResetApplication = () => {
    localStorage.removeItem("smart_money_financial_state");
    localStorage.removeItem("smart_money_onboarded");
    setFinancialState(initialFinancialState);
    setOnboarded(false);
    setCurrentTab("dashboard");
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#FBFBFD] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-slate-900 animate-spin" />
      </div>
    );
  }

  if (!onboarded) {
    return <LandingPage onCompleteOnboarding={handleCompleteOnboarding} />;
  }

  // Get human readable active tab name
  const getActiveTabLabel = () => {
    switch(currentTab) {
      case "dashboard": return "Overview Dashboard";
      case "insights": return "Spending & Anomalies";
      case "simulator": return "Scenario Runways";
      case "debt": return "Debt Payoff Strategies";
      case "protection": return "Protection & Claims";
      case "advisors": return "AI Board of Advisors";
      case "learn": return "Financial Encyclopedia";
      case "investments": return "Investment Portfolio";
      case "wealth": return "Wealth Management";
      case "tax-80c": return "80C Tax Optimizer";
      case "tax-regime": return "Old vs New Tax Regime";
      case "tax-auditor": return "LTCG/STCG Tax Auditor";
      case "tax-harvest": return "Tax Harvesting Advisor";
      case "goals": return "Target Goals System";
      default: return "Dashboard";
    }
  };

  return (
    <div id="smart-money-root" className="min-h-screen bg-[#FBFBFD] text-[#1D1D1F] flex flex-col font-sans selection:bg-slate-200">
      
      {/* Centered Top Nav Shell - Apple UI/UX styled dropdown header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50 px-8 py-3 flex justify-between items-center shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        
        {/* Left Branding: Restored Clickable Logo Button to return home */}
        <button
          onClick={() => { setCurrentTab("dashboard"); setHoveredFolder(null); }}
          className="flex items-center gap-2.5 text-left bg-transparent border-0 cursor-pointer p-1 rounded-xl hover:bg-slate-50 transition-colors focus:outline-none"
        >
          <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white shrink-0 shadow-sm">
            <Landmark className="w-4.5 h-4.5" />
          </div>
          <div>
            <h1 className="font-sans font-semibold text-[13px] tracking-wide text-slate-900 leading-none">Smart Money</h1>
            <span className="text-[9px] text-slate-500 font-bold tracking-wider mt-0.5 block uppercase">by FutureLab Studios</span>
          </div>
        </button>

        {/* Center Dropdown Folder Navigation */}
        <nav className="hidden lg:flex items-center gap-0.5">
          
          {/* Item 1: Dashboard Home */}
          <button
            onClick={() => { setCurrentTab("dashboard"); setHoveredFolder(null); }}
            className={`px-4 py-2 rounded-lg text-[13px] font-medium transition-all cursor-pointer ${
              currentTab === "dashboard"
                ? "bg-slate-900 text-white shadow-sm" 
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/70"
            }`}
          >
            Dashboard
          </button>

          {/* Item 2: Investments (Direct Click, 2nd place in NavBar) */}
          <button
            onClick={() => { setCurrentTab("investments"); setHoveredFolder(null); }}
            className={`px-4 py-2 rounded-lg text-[13px] font-medium transition-all cursor-pointer ${
              currentTab === "investments"
                ? "bg-slate-900 text-white shadow-sm" 
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/70"
            }`}
          >
            Investments
          </button>

          {/* Item 3: Optimization Command */}
          <div 
            className="relative"
            onMouseEnter={() => setHoveredFolder("optimization")}
            onMouseLeave={() => setHoveredFolder(null)}
          >
            <button
              className={`px-4 py-2 rounded-lg text-[13px] font-medium transition-all cursor-pointer flex items-center gap-1 ${
                currentTab === "debt" || currentTab === "protection" || currentTab === "goals"
                  ? "bg-slate-100 text-slate-900" 
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/70"
              }`}
            >
              Optimization
              <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${hoveredFolder === "optimization" ? "rotate-180" : ""}`} />
            </button>

            {hoveredFolder === "optimization" && (
              <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2">
                <div className="w-56 bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-xl py-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
                  <button
                    onClick={() => { setCurrentTab("debt"); setHoveredFolder(null); }}
                    className="w-full text-left px-4 py-2.5 text-[13px] font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors flex items-center gap-2.5 cursor-pointer rounded-lg mx-0"
                  >
                    <Zap className="w-4 h-4 text-amber-400" />
                    Debt Optimization
                  </button>
                  <button
                    onClick={() => { setCurrentTab("protection"); setHoveredFolder(null); }}
                    className="w-full text-left px-4 py-2.5 text-[13px] font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors flex items-center gap-2.5 cursor-pointer rounded-lg mx-0"
                  >
                    <ShieldCheck className="w-4 h-4 text-blue-400" />
                    Protection Cover
                  </button>
                  <button
                    onClick={() => { setCurrentTab("goals"); setHoveredFolder(null); }}
                    className="w-full text-left px-4 py-2.5 text-[13px] font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors flex items-center gap-2.5 cursor-pointer rounded-lg mx-0"
                  >
                    <Target className="w-4 h-4 text-emerald-500" />
                    Target Goals
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Item 4: Analytics (Swapped to place of Investments, with dropdown submenu) */}
          <div 
            className="relative"
            onMouseEnter={() => setHoveredFolder("analytics")}
            onMouseLeave={() => setHoveredFolder(null)}
          >
            <button
              className={`px-4 py-2 rounded-lg text-[13px] font-medium transition-all cursor-pointer flex items-center gap-1 ${
                currentTab === "insights" || currentTab === "simulator"
                  ? "bg-slate-100 text-slate-900" 
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/70"
              }`}
            >
              Analytics
              <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${hoveredFolder === "analytics" ? "rotate-180" : ""}`} />
            </button>

            {hoveredFolder === "analytics" && (
              <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2">
                <div className="w-56 bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-xl py-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
                  <button
                    onClick={() => { setCurrentTab("insights"); setHoveredFolder(null); }}
                    className="w-full text-left px-4 py-2.5 text-[13px] font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors flex items-center gap-2.5 cursor-pointer rounded-lg mx-0"
                  >
                    <Compass className="w-4 h-4 text-slate-400" />
                    Spending Insights
                  </button>
                  <button
                    onClick={() => { setCurrentTab("simulator"); setHoveredFolder(null); }}
                    className="w-full text-left px-4 py-2.5 text-[13px] font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors flex items-center gap-2.5 cursor-pointer rounded-lg mx-0"
                  >
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    Future Simulator
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Item 5: Advisors - Direct link (single subsection) */}
          <button
            onClick={() => { setCurrentTab("advisors"); setHoveredFolder(null); }}
            className={`px-4 py-2 rounded-lg text-[13px] font-medium transition-all cursor-pointer ${
              currentTab === "advisors"
                ? "bg-slate-100 text-slate-900" 
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/70"
            }`}
          >
            Advisors
          </button>

          {/* Item 5.5: Tax Suite */}
          <div 
            className="relative"
            onMouseEnter={() => setHoveredFolder("tax")}
            onMouseLeave={() => setHoveredFolder(null)}
          >
            <button
              className={`px-4 py-2 rounded-lg text-[13px] font-medium transition-all cursor-pointer flex items-center gap-1 ${
                currentTab.startsWith("tax-")
                  ? "bg-slate-900 text-white shadow-sm" 
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/70"
              }`}
            >
              Tax Suite
              <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${hoveredFolder === "tax" ? "rotate-180" : ""}`} />
            </button>

            {hoveredFolder === "tax" && (
              <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2">
                <div className="w-56 bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-xl py-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
                  <button
                    onClick={() => { setCurrentTab("tax-80c"); setHoveredFolder(null); }}
                    className="w-full text-left px-4 py-2.5 text-[13px] font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors flex items-center gap-2.5 cursor-pointer rounded-lg mx-0"
                  >
                    <Sparkles className="w-4 h-4 text-emerald-500" />
                    80C Tax Optimizer
                  </button>
                  <button
                    onClick={() => { setCurrentTab("tax-regime"); setHoveredFolder(null); }}
                    className="w-full text-left px-4 py-2.5 text-[13px] font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors flex items-center gap-2.5 cursor-pointer rounded-lg mx-0"
                  >
                    <Scale className="w-4 h-4 text-indigo-500" />
                    Old vs New Regime
                  </button>
                  <button
                    onClick={() => { setCurrentTab("tax-auditor"); setHoveredFolder(null); }}
                    className="w-full text-left px-4 py-2.5 text-[13px] font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors flex items-center gap-2.5 cursor-pointer rounded-lg mx-0"
                  >
                    <PieChart className="w-4 h-4 text-rose-500" />
                    LTCG/STCG Auditor
                  </button>
                  <button
                    onClick={() => { setCurrentTab("tax-harvest"); setHoveredFolder(null); }}
                    className="w-full text-left px-4 py-2.5 text-[13px] font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors flex items-center gap-2.5 cursor-pointer rounded-lg mx-0"
                  >
                    <TrendingUp className="w-4 h-4 text-amber-500" />
                    Tax Harvesting
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Item 6: Academy - Direct link (single subsection) */}
          <button
            onClick={() => { setCurrentTab("learn"); setHoveredFolder(null); }}
            className={`px-4 py-2 rounded-lg text-[13px] font-medium transition-all cursor-pointer ${
              currentTab === "learn"
                ? "bg-slate-100 text-slate-900" 
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/70"
            }`}
          >
            Academy
          </button>

        </nav>

        {/* Right Area: Interactive Sign Out / Logout button */}
        <div className="flex items-center gap-3 relative">
          
          {/* Elegant Notification Bell Trigger */}
          <button
            onClick={() => setIsNotificationOpen(prev => !prev)}
            className={`p-2 rounded-xl border transition-all cursor-pointer relative focus:outline-none ${
              isNotificationOpen 
                ? "bg-slate-900 text-white border-slate-900 shadow-sm" 
                : "border-slate-200 hover:bg-slate-50 text-slate-650 hover:text-slate-900"
            }`}
            title="Notification Center"
          >
            <Bell className="w-4 h-4" />
            {financialState.notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#E11D48] text-white text-[9px] font-bold rounded-full flex items-center justify-center border border-white">
                {financialState.notifications.length}
              </span>
            )}
          </button>

          {/* Premium Notification Center Popover Dropdown */}
          {isNotificationOpen && (
            <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white/95 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.08)] z-50 overflow-hidden flex flex-col max-h-[360px] animate-in fade-in slide-in-from-top-3 duration-200">
              
              {/* Popover Header */}
              <div className="p-3 bg-slate-900 text-white flex justify-between items-center shrink-0">
                <div className="flex items-center gap-2">
                  <Bell className="w-3.5 h-3.5 text-slate-300" />
                  <span className="text-[9px] uppercase tracking-wider font-extrabold font-sans">Notifications</span>
                </div>
                
                <div className="flex gap-2">
                  {financialState.notifications.length > 0 && (
                    <button
                      onClick={() => {
                        setFinancialState(prev => ({ ...prev, notifications: [] }));
                      }}
                      className="text-[8px] uppercase tracking-wider font-bold text-slate-300 hover:text-white transition-colors cursor-pointer border border-white/20 px-1.5 py-0.5 rounded"
                    >
                      Clear all
                    </button>
                  )}
                  <button
                    onClick={() => setIsNotificationOpen(false)}
                    className="text-[8px] uppercase tracking-wider font-bold text-slate-350 hover:text-white transition-colors font-mono cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Dynamic Interactive Daily Audit Trigger */}
              <div className="p-2.5 bg-gradient-to-r from-slate-50 to-indigo-50/20 border-b border-slate-100 flex justify-between items-center gap-3 shrink-0 text-left">
                <div>
                  <span className="text-[8px] uppercase tracking-wider font-bold text-indigo-650 font-mono block">Behavioral Analysis</span>
                  <span className="text-[9px] text-slate-500 font-light block leading-tight">Run dynamic checks over outlays, debts & milestones.</span>
                </div>
                <button
                  onClick={triggerDailyAudit}
                  className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-white text-[8.5px] font-bold uppercase tracking-wider rounded transition-colors cursor-pointer shrink-0 shadow-xxs flex items-center gap-1"
                >
                  <Sparkles className="w-2.5 h-2.5 text-indigo-300" />
                  Audit
                </button>
              </div>

              {/* Popover Feed Ledger */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
                {financialState.notifications.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 space-y-1">
                    <span className="text-lg block">📭</span>
                    <p className="text-[11px] font-semibold text-slate-650">Empty Center</p>
                    <p className="text-[9px] text-slate-400 max-w-[180px] mx-auto leading-normal">Click Audit above to run dynamic checks over your financial indicators.</p>
                  </div>
                ) : (
                  financialState.notifications.map((notif) => {
                    let indicatorBg = "bg-slate-100 text-slate-700";
                    if (notif.type === "warning") indicatorBg = "bg-rose-50 border border-rose-100 text-rose-600";
                    if (notif.type === "success") indicatorBg = "bg-emerald-50 border border-emerald-100 text-emerald-600";
                    if (notif.type === "info") indicatorBg = "bg-blue-50 border border-blue-100 text-blue-600";

                    return (
                      <div 
                        key={notif.id}
                        className={`p-2.5 rounded-xl text-left transition-all border flex gap-2.5 ${
                          notif.type === "warning" ? "bg-rose-50/20 border-rose-100/50" : "bg-[#FBFBFD] border-slate-100"
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-[9px] font-semibold ${indicatorBg}`}>
                          {notif.type === "warning" && "⚠️"}
                          {notif.type === "success" && "🎉"}
                          {notif.type === "info" && "💡"}
                        </div>
                        
                        <div className="min-w-0 flex-1 space-y-0.5">
                          <div className="flex justify-between items-start gap-2">
                            <h5 className="font-semibold text-slate-800 text-[11px] leading-snug truncate">{notif.title}</h5>
                            <button
                              onClick={() => {
                                setFinancialState(prev => ({
                                  ...prev,
                                  notifications: prev.notifications.filter(n => n.id !== notif.id)
                                }));
                              }}
                              className="text-slate-350 hover:text-slate-500 font-mono text-[8px] cursor-pointer"
                              title="Dismiss"
                            >
                              ✕
                            </button>
                          </div>
                          
                          <p className="text-slate-550 text-[9.5px] leading-relaxed font-light">{notif.body}</p>
                          <span className="text-[7px] font-mono text-slate-400 block font-semibold">{notif.time}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

            </div>
          )}

          <button
            onClick={handleResetApplication}
            className="px-3 py-2 sm:px-3.5 sm:py-2 border border-slate-200 hover:bg-rose-50 hover:border-rose-200 rounded-xl text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-700 hover:text-rose-600 transition-all cursor-pointer flex items-center gap-1.5 focus:outline-none"
            title="Sign Out of Smart Money"
          >
            <LogOut className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>

      </header>

      {/* Main Workspace Frame */}
      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full overflow-y-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
        
        {/* Minimized Weekly Financial Story Banner Strip */}
        {showStory && currentTab === "dashboard" && (
          <div className="bg-white border border-slate-200 text-slate-800 rounded-2xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex gap-3 items-center">
              <div className="p-2 bg-slate-100 rounded-xl text-slate-700 shrink-0">
                <Sparkles className="w-4 h-4 animate-bounce" />
              </div>
              <p className="text-[13px] text-slate-600 leading-relaxed text-left">
                <span className="text-slate-900 font-semibold mr-1">Weekly Story:</span>
                {getDynamicWeeklyStory()}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button 
                onClick={() => setCurrentTab("learn")}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-[12px] font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap shadow-sm font-semibold"
              >
                Learn strategies
              </button>
              <button 
                onClick={() => setShowStory(false)}
                className="text-[12px] text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Tab Routing Content Workspace */}
        <div className="transition-all duration-300">
          
          {/* TAB 1: Dashboard Overview (Completely isolated, no stacking!) */}
          {currentTab === "dashboard" && (
            <AICommandCenter 
              financialState={financialState} 
              setFinancialState={setFinancialState} 
            />
          )}

          {/* TAB 2: Spending Insights */}
          {currentTab === "insights" && (
            <SpendingIntelligence 
              financialState={financialState}
              setFinancialState={setFinancialState}
            />
          )}

          {/* TAB 3: Future Simulator */}
          {currentTab === "simulator" && (
            <FutureSimulator financialState={financialState} />
          )}

          {/* TAB 4: Debt Optimization Command */}
          {currentTab === "debt" && (
            <DebtOptimization 
              financialState={financialState}
              setFinancialState={setFinancialState}
            />
          )}

          {/* TAB 5: Protection & Health Policy claims */}
          {currentTab === "protection" && (
            <ProtectionInsurance 
              financialState={financialState}
              setFinancialState={setFinancialState}
            />
          )}

          {/* TAB 6: Advisors Council Chamber */}
          {currentTab === "advisors" && (
            <AICouncil financialState={financialState} />
          )}

          {/* TAB 7: Academy Financial Encyclopedia */}
          {currentTab === "learn" && (
            <FinancialEncyclopedia />
          )}

          {/* TAB 8: Investment Portfolio */}
          {currentTab === "investments" && (
            <InvestmentPortfolio 
              financialState={financialState}
              setFinancialState={setFinancialState}
            />
          )}

          {/* TAB 9: Wealth Management Overview */}
          {currentTab === "wealth" && (
            <WealthManagement 
              financialState={financialState}
              setFinancialState={setFinancialState}
            />
          )}

          {/* TAB 10: 80C Tax Optimizer */}
          {currentTab === "tax-80c" && (
            <Tax80COptimizer financialState={financialState} />
          )}

          {/* TAB 11: Old vs New Tax Regime Comparator */}
          {currentTab === "tax-regime" && (
            <TaxRegimeComparator financialState={financialState} />
          )}

          {/* TAB 12: LTCG/STCG Tax Auditor */}
          {currentTab === "tax-auditor" && (
            <TaxAuditor financialState={financialState} setFinancialState={setFinancialState} />
          )}

          {/* TAB 13: Tax Harvesting Advisor */}
          {currentTab === "tax-harvest" && (
            <TaxHarvestingAdvisor financialState={financialState} setFinancialState={setFinancialState} />
          )}

          {/* TAB 14: Target Goals System */}
          {currentTab === "goals" && (
            <GoalsSystem 
              financialState={financialState}
              setFinancialState={setFinancialState}
            />
          )}

        </div>

      </main>

      {/* Footer Settings reset panel */}
      <footer className="bg-white border-t border-slate-200/60 py-5 px-10 mb-16 lg:mb-0 flex flex-col sm:flex-row justify-between items-center gap-4 text-[12px] text-slate-400">
        <div>
          <span>Smart Money — Designed for </span>
          <span className="font-medium text-slate-600">FutureLab Studios</span>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleResetApplication}
            className="text-[12px] text-rose-400 hover:text-rose-600 transition-colors font-medium cursor-pointer"
          >
            Reset Application
          </button>
        </div>
      </footer>

      {/* Unified Context-Aware AI Chatbot Floating Capsule */}
      {(() => {
        const ctx = getAssistantContext();
        return (
          <>
            {/* Pulsing Floating Capsule Trigger */}
            <button
              onClick={() => setIsChatOpen(prev => !prev)}
              className="fixed bottom-24 right-6 lg:bottom-6 lg:right-6 z-50 px-4 py-3 bg-slate-900/95 backdrop-blur-xl border border-slate-800 text-white rounded-full flex items-center gap-2.5 shadow-[0_12px_40px_rgba(0,0,0,0.15)] hover:bg-slate-800 hover:scale-105 active:scale-95 transition-all cursor-pointer group"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-sm font-sans">{ctx.icon}</span>
              <span className="text-[10px] font-sans font-extrabold uppercase tracking-widest">{ctx.name}</span>
            </button>

            {/* Expandable Glassmorphism Chat Panel */}
            {isChatOpen && (
              <div className="fixed bottom-36 right-6 lg:bottom-20 lg:right-6 z-50 w-[350px] sm:w-[400px] h-[520px] max-h-[75vh] bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.12)] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
                
                {/* Chat Panel Header */}
                <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
                  <div className="flex items-center gap-2.5 text-left">
                    <span className="text-lg shrink-0">{ctx.icon}</span>
                    <div className="min-w-0">
                      <h4 className="font-semibold text-xs leading-none uppercase tracking-wider text-slate-100 truncate">{ctx.name}</h4>
                      <span className="text-[9px] text-slate-400 mt-1 block truncate">{ctx.desc}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsChatOpen(false)}
                    className="p-1 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer text-xs font-mono shrink-0 ml-2"
                  >
                    ✕
                  </button>
                </div>

                {/* Direct link context tracker */}
                <div className="bg-slate-50 border-b border-slate-100 py-1.5 px-4 text-left text-[9px] font-mono text-slate-500 flex items-center gap-1.5 uppercase font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></span>
                  Workspace Context: {currentTab}
                </div>

                {/* Chat Message Ledger */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3.5 flex flex-col">
                  {chatMessages.map((msg, idx) => (
                    <div 
                      key={idx} 
                      className={`max-w-[85%] p-3 rounded-2xl text-[12px] leading-relaxed text-left whitespace-pre-wrap shadow-xxs ${
                        msg.sender === "user" 
                          ? "bg-slate-900 text-slate-100 self-end rounded-tr-none" 
                          : "bg-slate-50 border border-slate-150 text-slate-700 self-start rounded-tl-none font-medium"
                      }`}
                    >
                      {msg.text}
                    </div>
                  ))}
                  {chatLoading && (
                    <div className="bg-slate-50 border border-slate-100 text-slate-400 p-3 rounded-2xl rounded-tl-none text-xxs self-start font-mono flex items-center gap-2">
                      <div className="w-3 h-3 border border-slate-350 border-t-slate-900 rounded-full animate-spin shrink-0" />
                      <span>Co-pilot runs dynamic wealth models...</span>
                    </div>
                  )}
                </div>

                {/* Active Suggestion pills */}
                <div className="px-4 py-2 border-t border-slate-100 bg-[#FBFBFD] space-y-1.5">
                  <span className="text-[9px] font-mono text-slate-400 block text-left uppercase font-bold tracking-tight">Suggestions</span>
                  <div className="flex flex-wrap gap-1.5">
                    {ctx.suggestions.map((sug, i) => (
                      <button
                        key={i}
                        onClick={() => handleSendChatQuery(sug)}
                        disabled={chatLoading}
                        className="px-2 py-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-650 hover:text-slate-900 text-[10px] text-left font-medium transition-all rounded-lg cursor-pointer"
                      >
                        "{sug}"
                      </button>
                    ))}
                  </div>
                </div>

                {/* Chat inputs */}
                <div className="p-3 border-t border-slate-100 bg-white flex gap-2">
                  <input
                    type="text"
                    placeholder={`Ask about ${currentTab} audit...`}
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleSendChatQuery();
                      }
                    }}
                    disabled={chatLoading}
                    className="flex-1 p-2.5 border border-slate-200 focus:border-slate-800 focus:outline-none rounded-xl text-xs text-slate-800 placeholder:text-slate-400 bg-slate-50/50 focus:bg-white"
                  />
                  <button
                    onClick={() => handleSendChatQuery()}
                    disabled={chatLoading || !chatInput.trim()}
                    className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-100 text-white disabled:text-slate-400 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
                  >
                    Ask
                  </button>
                </div>

              </div>
            )}
          </>
        );
      })()}

      {/* Mobile Bottom Navigation Bar (iOS design) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200/60 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 py-2.5 flex justify-around items-center">
        
        {/* Tab 1: Home */}
        <button
          onClick={() => { setCurrentTab("dashboard"); setActiveMobileSheet(null); }}
          className={`flex flex-col items-center gap-1.5 px-3 py-1 cursor-pointer transition-colors border-0 bg-transparent ${
            currentTab === "dashboard" ? "text-slate-900 font-semibold font-bold" : "text-slate-400 hover:text-slate-900"
          }`}
        >
          <LayoutDashboard className="w-5 h-5 shrink-0" />
          <span className="text-[9px] uppercase tracking-wider font-mono">Home</span>
        </button>

        {/* Tab 2: Portfolio */}
        <button
          onClick={() => { setCurrentTab("investments"); setActiveMobileSheet(null); }}
          className={`flex flex-col items-center gap-1.5 px-3 py-1 cursor-pointer transition-colors border-0 bg-transparent ${
            currentTab === "investments" ? "text-slate-900 font-semibold font-bold" : "text-slate-400 hover:text-slate-900"
          }`}
        >
          <TrendingUp className="w-5 h-5 shrink-0" />
          <span className="text-[9px] uppercase tracking-wider font-mono">Portfolio</span>
        </button>

        {/* Tab 3: Optimize */}
        <button
          onClick={() => { setActiveMobileSheet(activeMobileSheet === "optimize" ? null : "optimize"); }}
          className={`flex flex-col items-center gap-1.5 px-3 py-1 cursor-pointer transition-colors border-0 bg-transparent ${
            currentTab === "debt" || currentTab === "protection" || currentTab === "goals"
              ? "text-indigo-650 font-bold" : "text-slate-400 hover:text-slate-900"
          }`}
        >
          <Zap className="w-5 h-5 shrink-0" />
          <span className="text-[9px] uppercase tracking-wider font-mono">Optimize</span>
        </button>

        {/* Tab 4: Analyze */}
        <button
          onClick={() => { setActiveMobileSheet(activeMobileSheet === "analyze" ? null : "analyze"); }}
          className={`flex flex-col items-center gap-1.5 px-3 py-1 cursor-pointer transition-colors border-0 bg-transparent ${
            currentTab === "insights" || currentTab === "simulator"
              ? "text-indigo-650 font-bold" : "text-slate-400 hover:text-slate-900"
          }`}
        >
          <Compass className="w-5 h-5 shrink-0" />
          <span className="text-[9px] uppercase tracking-wider font-mono">Analyze</span>
        </button>

        {/* Tab 5: Tax Suite */}
        <button
          onClick={() => { setActiveMobileSheet(activeMobileSheet === "tax" ? null : "tax"); }}
          className={`flex flex-col items-center gap-1.5 px-3 py-1 cursor-pointer transition-colors border-0 bg-transparent ${
            currentTab.startsWith("tax-")
              ? "text-indigo-650 font-bold" : "text-slate-400 hover:text-slate-900"
          }`}
        >
          <Scale className="w-5 h-5 shrink-0" />
          <span className="text-[9px] uppercase tracking-wider font-mono">Tax Suite</span>
        </button>

      </div>

      {/* Mobile Drawer Sheet Overlays */}
      {activeMobileSheet && (
        <div 
          className="lg:hidden fixed inset-0 z-35 bg-slate-950/20 backdrop-blur-xxs flex flex-col justify-end"
          onClick={() => setActiveMobileSheet(null)}
        >
          <div 
            className="bg-white rounded-t-3xl border-t border-slate-200/80 p-5 pb-8 space-y-4 animate-in slide-in-from-bottom-10 duration-200 shadow-[0_-10px_30px_rgba(0,0,0,0.08)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-2"></div>
            
            {activeMobileSheet === "optimize" && (
              <div className="space-y-2 text-left">
                <span className="text-[9px] uppercase font-mono tracking-wider font-bold text-slate-400">Optimization Workspace</span>
                <button
                  onClick={() => { setCurrentTab("debt"); setActiveMobileSheet(null); }}
                  className="w-full p-3 hover:bg-slate-50 border border-slate-100/50 text-xs font-semibold text-slate-800 rounded-xl transition-all text-left flex items-center gap-2.5 cursor-pointer bg-transparent"
                >
                  <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                  Debt Early Payoff Optimizer
                </button>
                <button
                  onClick={() => { setCurrentTab("protection"); setActiveMobileSheet(null); }}
                  className="w-full p-3 hover:bg-slate-50 border border-slate-100/50 text-xs font-semibold text-slate-800 rounded-xl transition-all text-left flex items-center gap-2.5 cursor-pointer bg-transparent"
                >
                  <ShieldCheck className="w-4 h-4 text-blue-500 shrink-0" />
                  Protection Healthcare Cover
                </button>
                <button
                  onClick={() => { setCurrentTab("goals"); setActiveMobileSheet(null); }}
                  className="w-full p-3 hover:bg-slate-50 border border-slate-100/50 text-xs font-semibold text-slate-800 rounded-xl transition-all text-left flex items-center gap-2.5 cursor-pointer bg-transparent"
                >
                  <Target className="w-4 h-4 text-emerald-500 shrink-0" />
                  Target Milestone Goals
                </button>
              </div>
            )}

            {activeMobileSheet === "analyze" && (
              <div className="space-y-2 text-left">
                <span className="text-[9px] uppercase font-mono tracking-wider font-bold text-slate-400">Behavioral Analytics</span>
                <button
                  onClick={() => { setCurrentTab("insights"); setActiveMobileSheet(null); }}
                  className="w-full p-3 hover:bg-slate-50 border border-slate-100/50 text-xs font-semibold text-slate-800 rounded-xl transition-all text-left flex items-center gap-2.5 cursor-pointer bg-transparent"
                >
                  <Compass className="w-4 h-4 text-slate-500 shrink-0" />
                  Spending Patterns & Cash Leaks
                </button>
                <button
                  onClick={() => { setCurrentTab("simulator"); setActiveMobileSheet(null); }}
                  className="w-full p-3 hover:bg-slate-50 border border-slate-100/50 text-xs font-semibold text-slate-800 rounded-xl transition-all text-left flex items-center gap-2.5 cursor-pointer bg-transparent"
                >
                  <Sparkles className="w-4 h-4 text-indigo-500 shrink-0 animate-bounce" />
                  Predictive Future Simulator
                </button>
              </div>
            )}

            {activeMobileSheet === "tax" && (
              <div className="space-y-2 text-left">
                <span className="text-[9px] uppercase font-mono tracking-wider font-bold text-slate-400">Tax Efficiency Suite</span>
                <button
                  onClick={() => { setCurrentTab("tax-80c"); setActiveMobileSheet(null); }}
                  className="w-full p-3 hover:bg-slate-50 border border-slate-100/50 text-xs font-semibold text-slate-800 rounded-xl transition-all text-left flex items-center gap-2.5 cursor-pointer bg-transparent"
                >
                  <Sparkles className="w-4 h-4 text-emerald-500 shrink-0" />
                  80C Tax Optimizer
                </button>
                <button
                  onClick={() => { setCurrentTab("tax-regime"); setActiveMobileSheet(null); }}
                  className="w-full p-3 hover:bg-slate-50 border border-slate-100/50 text-xs font-semibold text-slate-800 rounded-xl transition-all text-left flex items-center gap-2.5 cursor-pointer bg-transparent"
                >
                  <Scale className="w-4 h-4 text-indigo-500 shrink-0" />
                  Old vs New Regime Comparator
                </button>
                <button
                  onClick={() => { setCurrentTab("tax-auditor"); setActiveMobileSheet(null); }}
                  className="w-full p-3 hover:bg-slate-50 border border-slate-100/50 text-xs font-semibold text-slate-800 rounded-xl transition-all text-left flex items-center gap-2.5 cursor-pointer bg-transparent"
                >
                  <PieChart className="w-4 h-4 text-rose-500 shrink-0" />
                  LTCG / STCG Capital Gains Auditor
                </button>
                <button
                  onClick={() => { setCurrentTab("tax-harvest"); setActiveMobileSheet(null); }}
                  className="w-full p-3 hover:bg-slate-50 border border-slate-100/50 text-xs font-semibold text-slate-800 rounded-xl transition-all text-left flex items-center gap-2.5 cursor-pointer bg-transparent"
                >
                  <TrendingUp className="w-4 h-4 text-amber-500 shrink-0" />
                  Tax Harvesting profit booking advisor
                </button>
              </div>
            )}
            
            <button
              onClick={() => setActiveMobileSheet(null)}
              className="w-full py-2.5 border border-slate-200 text-slate-500 text-xxs font-semibold tracking-wide uppercase rounded-xl hover:bg-slate-50 transition-all cursor-pointer bg-transparent"
            >
              Close Menu
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
