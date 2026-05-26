import React, { useState } from "react";
import { UserFinancialState } from "../types";
import { 
  ShieldCheck, HeartPulse, Percent, Landmark, ArrowUpRight, Coins, Home, Compass, PiggyBank
} from "lucide-react";

interface AICommandCenterProps {
  financialState: UserFinancialState;
  setFinancialState: React.Dispatch<React.SetStateAction<UserFinancialState>>;
  setCurrentTab?: (tab: string) => void;
}

export default function AICommandCenter({ financialState, setFinancialState, setCurrentTab }: AICommandCenterProps) {
  // Derive dynamic details
  const totalAssets = financialState.wealth.reduce((acc, w) => acc + w.amount, 0);
  const totalLiabilities = financialState.debts.reduce((acc, d) => acc + d.principal, 0);
  const netWorth = totalAssets - totalLiabilities;
  const savings = financialState.income - financialState.spending;
  const savingsRate = financialState.income > 0 ? Math.round((savings / financialState.income) * 100) : 0;

  // Static ratios based on standard mock data or calculated
  const annualPremium = financialState.policies?.reduce((acc, p) => acc + p.premium * 12, 0) || 35500;
  const lifeCover = financialState.policies?.filter(p => p.type === "life").reduce((acc, p) => acc + p.coverage, 0) || 13000000;
  const healthCover = financialState.policies?.filter(p => p.type === "health").reduce((acc, p) => acc + p.coverage, 0) || 3000000;

  const emergencyFund = financialState.wealth.find(w => w.category.toLowerCase().includes("savings"))?.amount || 312000;
  const monthsCovered = financialState.spending > 0 ? Math.round(emergencyFund / financialState.spending) : 0;

  // Dynamic asset categories allocation calculations
  const getCategoryMetrics = (catName: string, defaultVal: number, defaultPct: number, count: number, returnPct: string) => {
    const matched = financialState.wealth.filter(w => w.category.toLowerCase().includes(catName.toLowerCase()) || (catName === "Equity" && w.category.toLowerCase().includes("stocks")));
    const sum = matched.reduce((acc, w) => acc + w.amount, 0) || defaultVal;
    const share = totalAssets > 0 ? Math.round((sum / totalAssets) * 100) : defaultPct;
    return { sum, share, count, returnPct };
  };

  const assetCategories = [
    {
      name: "Equity & Stocks",
      icon: ArrowUpRight,
      color: "bg-slate-100 text-slate-800",
      ...getCategoryMetrics("equity", 758500, 13.8, 5, "+9.9%")
    },
    {
      name: "Fixed Income & Debt",
      icon: Landmark,
      color: "bg-slate-100 text-slate-800",
      ...getCategoryMetrics("fixed", 1535000, 28.0, 4, "+15.4%")
    },
    {
      name: "Gold & Commodities",
      icon: Coins,
      color: "bg-slate-100 text-slate-800",
      ...getCategoryMetrics("gold", 338000, 6.2, 2, "+35.2%")
    },
    {
      name: "Real Estate",
      icon: Home,
      color: "bg-slate-100 text-slate-800",
      ...getCategoryMetrics("real estate", 25000000, 45.6, 1, "+13.6%")
    },
    {
      name: "Alternative Investments",
      icon: Compass,
      color: "bg-slate-100 text-slate-800",
      ...getCategoryMetrics("alternative", 42000, 0.8, 1, "-16.0%")
    },
    {
      name: "Savings & Emergency",
      icon: PiggyBank,
      color: "bg-slate-100 text-slate-800",
      ...getCategoryMetrics("savings", 312000, 5.7, 1, "+4.0%")
    }
  ];

  return (
    <div className="space-y-8">
      
      {/* 1. Refined & Compact Net Worth Dashboard Panel */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-center flex flex-col items-center justify-center">
        
        <span className="text-[10px] uppercase tracking-widest text-slate-400 block font-semibold">Workspace Portfolio</span>
        <span className="text-[11px] uppercase tracking-wider text-slate-500 font-medium mt-1">Net Worth</span>
        
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 mt-1 font-sans">
          ₹{netWorth.toLocaleString()}
        </h2>

        {/* Small, clean assets & liabilities divider strip */}
        <div className="flex items-center gap-3 mt-2 text-[12px] text-slate-500 font-medium">
          <span>Assets: <span className="text-emerald-600 font-semibold">₹{totalAssets.toLocaleString()}</span></span>
          <span className="opacity-40">|</span>
          <span>Liabilities: <span className="text-rose-500 font-semibold">₹{totalLiabilities.toLocaleString()}</span></span>
        </div>

        {/* 4 neat, short indicators beneath */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 w-full max-w-xl border-t border-slate-100 pt-5 text-slate-500 text-center">
          <div>
            <span className="text-[10px] uppercase tracking-wider block text-slate-400">Monthly Income</span>
            <span className="text-[13px] font-semibold text-slate-900 block mt-0.5">₹{financialState.income.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider block text-slate-400">Spending</span>
            <span className="text-[13px] font-semibold text-slate-900 block mt-0.5">₹{financialState.spending.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider block text-slate-400">Savings Rate</span>
            <span className="text-[13px] font-semibold text-slate-900 block mt-0.5">{savingsRate}%</span>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider block text-slate-400">CAGR Return</span>
            <span className="text-[13px] font-semibold text-emerald-600 block mt-0.5">+13.8%</span>
          </div>
        </div>
      </div>

      {/* 2. Three Columns Side-by-Side Card Grid (Protection, Emergency, Tax) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Column 1: Protection */}
        <div className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex flex-col justify-between transition-all hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <ShieldCheck className="w-4 h-4 text-slate-700 shrink-0" />
              <h3 className="text-[11px] font-semibold text-slate-800 uppercase tracking-widest">Protection</h3>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[13px]">
                <span className="text-slate-500">Life Cover</span>
                <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                  <span>₹{lifeCover.toLocaleString()}</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                </div>
              </div>
              <div className="flex justify-between items-center text-[13px]">
                <span className="text-slate-500">Health Cover</span>
                <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                  <span>₹{healthCover.toLocaleString()}</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                </div>
              </div>
              <div className="flex justify-between items-center text-[13px]">
                <span className="text-slate-500">Annual Premiums</span>
                <span className="font-semibold text-slate-900">₹{annualPremium.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: Emergency Readiness */}
        <div className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex flex-col justify-between transition-all hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <HeartPulse className="w-4 h-4 text-slate-700 shrink-0" />
              <h3 className="text-[11px] font-semibold text-slate-800 uppercase tracking-widest">Emergency Readiness</h3>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[13px]">
                <span className="text-slate-500">Emergency Fund</span>
                <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                  <span>₹{emergencyFund.toLocaleString()}</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                </div>
              </div>
              <div className="flex justify-between items-center text-[13px]">
                <span className="text-slate-500">Months Covered</span>
                <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                  <span>{monthsCovered} months</span>
                  <div className={`w-1.5 h-1.5 rounded-full ${monthsCovered > 3 ? "bg-emerald-500" : "bg-rose-500"}`} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Column 3: Tax Optimization */}
        <div className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex flex-col justify-between transition-all hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Percent className="w-4 h-4 text-slate-700 shrink-0" />
              <h3 className="text-[11px] font-semibold text-slate-800 uppercase tracking-widest">Tax Optimization</h3>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[13px]">
                <span className="text-slate-500">80C Used</span>
                <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                  <span>₹1,00,000 / ₹1.5L</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                </div>
              </div>
              <div className="flex justify-between items-center text-[13px]">
                <span className="text-slate-500">80D Used</span>
                <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                  <span>₹23,500 / ₹50K</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 3. Asset Allocation Section */}
      <div className="space-y-4 pt-2">
        <h3 className="text-[11px] font-semibold text-slate-800 uppercase tracking-widest">Asset Allocation</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {assetCategories.map((c, i) => {
            const IconComponent = c.icon;
            return (
              <div 
                key={i} 
                onClick={() => setCurrentTab && setCurrentTab("investments")}
                className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] cursor-pointer transition-all flex flex-col justify-between space-y-4"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg shrink-0 ${c.color}`}>
                      <IconComponent className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-semibold text-[13px] text-slate-800 block truncate leading-none">{c.name}</span>
                  </div>
                  <span className="text-[12px] font-semibold text-emerald-600">{c.returnPct}</span>
                </div>

                <div>
                  <span className="block text-lg font-bold text-slate-900">₹{c.sum.toLocaleString()}</span>
                  <span className="block text-[11px] text-slate-500 mt-1 leading-none">
                    {c.count} holdings · {c.share}% of assets
                  </span>
                  
                  {/* Dynamic Progress indicator bar */}
                  <div className="w-full h-1 bg-slate-50 rounded-full mt-2.5 overflow-hidden">
                    <div className="h-full bg-slate-800" style={{ width: `${c.share}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
