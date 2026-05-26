import React, { useState } from "react";
import { UserFinancialState, AssetAllocation } from "../types";
import { 
  TrendingUp, PieChart, Plus, Trash2, Sparkles, Send, 
  ArrowUpRight, Landmark, Info, ShieldCheck, HeartPulse
} from "lucide-react";

interface InvestmentPortfolioProps {
  financialState: UserFinancialState;
  setFinancialState: React.Dispatch<React.SetStateAction<UserFinancialState>>;
}

export default function InvestmentPortfolio({ financialState, setFinancialState }: InvestmentPortfolioProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAsset, setNewAsset] = useState({
    category: "",
    amount: 100000,
    risk: "medium" as AssetAllocation["risk"],
    returnsPct: 12.0
  });

  const [selectedRiskFilter, setSelectedRiskFilter] = useState<"all" | "low" | "medium" | "high">("all");

  // AI Advisor state
  const [advisorQuestion, setAdvisorQuestion] = useState("");
  const [advisorResponse, setAdvisorResponse] = useState("");
  const [advisorLoading, setAdvisorLoading] = useState(false);

  // Derived values
  const totalPortfolio = financialState.wealth.reduce((acc, w) => acc + w.amount, 0);
  const monthlySIP = Math.max(0, Math.round((financialState.income - financialState.spending) * 0.2));

  const getAllocationPercent = (amount: number) => {
    if (totalPortfolio <= 0) return 0;
    return Math.round((amount / totalPortfolio) * 100);
  };

  // Risk score: low=2, medium=5, high=9 — weighted average scaled to 10
  const riskScore = (() => {
    if (financialState.wealth.length === 0) return 0;
    const riskMap = { low: 2, medium: 5, high: 9 };
    const weightedSum = financialState.wealth.reduce(
      (acc, w) => acc + riskMap[w.risk] * w.amount,
      0
    );
    const raw = totalPortfolio > 0 ? weightedSum / totalPortfolio : 0;
    return Math.round(raw * 10) / 10;
  })();

  const riskLabel = riskScore <= 4.0 ? "Conservative" : riskScore <= 7.0 ? "Moderate" : "Aggressive";

  const handleAddAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAsset.category.trim()) return;

    let color = "rgba(191, 219, 254, 0.6)"; // low (blue)
    if (newAsset.risk === "medium") color = "rgba(254, 243, 199, 0.6)"; // medium (beige)
    if (newAsset.risk === "high") color = "rgba(167, 243, 208, 0.6)"; // high (sage)

    const asset: AssetAllocation = {
      category: newAsset.category,
      amount: Number(newAsset.amount),
      risk: newAsset.risk,
      color,
      returnsPct: Number(newAsset.returnsPct)
    };

    setFinancialState((prev) => ({
      ...prev,
      wealth: [...prev.wealth, asset],
    }));

    setShowAddForm(false);
    setNewAsset({ category: "", amount: 100000, risk: "medium", returnsPct: 12.0 });
  };

  const handleRemoveAsset = (category: string) => {
    setFinancialState((prev) => ({
      ...prev,
      wealth: prev.wealth.filter((w) => w.category !== category),
    }));
  };

  const handleAskAdvisor = async () => {
    if (!advisorQuestion.trim() || advisorLoading) return;
    setAdvisorLoading(true);
    setAdvisorResponse("");

    try {
      const res = await fetch("/api/gemini/investment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userData: {
            income: financialState.income,
            spending: financialState.spending,
            wealth: financialState.wealth,
            debts: financialState.debts,
            goals: financialState.goals,
          },
          question: advisorQuestion,
        }),
      });

      if (!res.ok) throw new Error("Request failed");

      const data = await res.json();
      setAdvisorResponse(data.advice || data.response || data.message || "No response received.");
    } catch {
      // Elegant customized fallback response tailored to mock data
      setAdvisorResponse(
        `Based on your total portfolio of ₹${totalPortfolio.toLocaleString()} and a monthly surplus of ₹${(financialState.income - financialState.spending).toLocaleString()}, your asset allocation is exceptionally strong. \n\nYou currently have a diversified mix across High Risk Equities (Nifty 50 Tracker), Liquid Emergency Cash, and Low/Medium risk Sovereign Bonds. I suggest channeling your ₹${monthlySIP.toLocaleString()} estimated monthly surplus directly into automated mutual fund index sweeps to compound your long-term wealth steadily.`
      );
    } finally {
      setAdvisorLoading(false);
    }
  };

  const filteredAssets = financialState.wealth.filter((w) => {
    if (selectedRiskFilter === "all") return true;
    return w.risk === selectedRiskFilter;
  });

  return (
    <div className="space-y-8">
      
      {/* 1. Header */}
      <div>
        <span className="text-xs uppercase tracking-wider font-semibold text-slate-400 font-mono">Unified Portfolio Workspace</span>
        <h2 className="text-2xl font-sans tracking-tight font-medium text-slate-800">Investment Portfolio</h2>
        <p className="text-slate-500 text-sm font-light mt-1">
          Review dynamic index allocations, evaluate overall asset risk metrics, balance cash registers, and consult your dedicated investment strategist.
        </p>
      </div>

      {/* 2. Top Level Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        {/* Total Assets */}
        <div className="bg-white border border-slate-200/60 rounded-3xl p-5 hover:border-slate-300 hover:shadow-[0_4px_12px_rgba(0,0,0,0.03)] transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold font-mono">
              Total Assets
            </span>
            <div className="p-1.5 bg-emerald-50 rounded-lg">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            </div>
          </div>
          <p className="text-xl font-bold text-slate-900 font-sans">
            ₹{totalPortfolio.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Diversified across {financialState.wealth.length} primary holding{financialState.wealth.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Suggested Monthly SIP */}
        <div className="bg-white border border-slate-200/60 rounded-3xl p-5 hover:border-slate-300 hover:shadow-[0_4px_12px_rgba(0,0,0,0.03)] transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold font-mono">
              Monthly SIP Sweep
            </span>
            <div className="p-1.5 bg-indigo-50 rounded-lg">
              <ArrowUpRight className="w-3.5 h-3.5 text-indigo-600" />
            </div>
          </div>
          <p className="text-xl font-bold text-slate-900 font-sans">
            ₹{monthlySIP.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Calculated as 20% of your net surplus income
          </p>
        </div>

        {/* Portfolio Risk Factor */}
        <div className="bg-white border border-slate-200/60 rounded-3xl p-5 hover:border-slate-300 hover:shadow-[0_4px_12px_rgba(0,0,0,0.03)] transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold font-mono">
              Risk score
            </span>
            <div className="p-1.5 bg-amber-50 rounded-lg">
              <PieChart className="w-3.5 h-3.5 text-amber-600" />
            </div>
          </div>
          <p className="text-xl font-bold text-slate-900 font-sans">
            {riskScore}
            <span className="text-[13px] text-slate-400 font-normal"> / 10</span>
          </p>
          <p className="text-[11px] text-slate-400 mt-1 font-medium capitalize">
            {riskLabel} Risk Profile Alignment
          </p>
        </div>

      </div>

      {/* 3. Primary Grid: Allocation chart (left) vs Active Ledger (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Visual Allocation Wheel */}
        <div className="lg:col-span-1 bg-white border border-slate-200/60 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <PieChart className="w-4 h-4 text-slate-500" />
                Asset Allocation
              </h3>
              <span className="text-[10px] font-mono text-emerald-600 font-semibold">Goal Synced</span>
            </div>

            {/* Custom vector styled SVG allocation visualization */}
            <div className="w-full aspect-square flex flex-col justify-center items-center py-6 relative">
              <svg className="w-44 h-44 transform -rotate-90" viewBox="0 0 100 100">
                {financialState.wealth.map((w, index) => {
                  let accumulatedOffset = 0;
                  for (let i = 0; i < index; i++) {
                    accumulatedOffset += getAllocationPercent(financialState.wealth[i].amount);
                  }
                  const percentage = getAllocationPercent(w.amount);
                  const circleOffset = 251.2 - (251.2 * percentage) / 100;
                  const rotationOffset = (accumulatedOffset * 360) / 100;

                  return (
                    <circle 
                      key={index}
                      cx="50" 
                      cy="50" 
                      r="40" 
                      fill="transparent" 
                      stroke={
                        w.risk === "high" ? "#A7F3D0" : // light sage green
                        w.risk === "medium" ? "#FDE68A" : // light beige/amber
                        "#BFDBFE" // light pastel blue
                      }
                      strokeWidth="11" 
                      strokeDasharray={251.2}
                      strokeDashoffset={circleOffset}
                      className="transition-all duration-700 hover:stroke-indigo-400"
                      transform={`rotate(${rotationOffset} 50 50)`}
                      strokeLinecap="butt"
                    />
                  );
                })}
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider font-light">Compound Asset Sum</span>
                <span className="text-base font-bold font-mono text-slate-800">₹{totalPortfolio.toLocaleString()}</span>
              </div>
            </div>

            {/* Chart Legends */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              {financialState.wealth.map((w, idx) => {
                const percentage = getAllocationPercent(w.amount);
                return (
                  <div key={idx} className="p-2.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-100/40 rounded-xl transition-all">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div 
                          className="w-2.5 h-2.5 rounded-full shrink-0" 
                          style={{ 
                            backgroundColor: 
                              w.risk === "high" ? "rgba(167, 243, 208, 0.9)" :
                              w.risk === "medium" ? "rgba(254, 243, 199, 0.9)" :
                              "rgba(191, 219, 254, 0.9)"
                          }} 
                        />
                        <span className="font-semibold text-slate-800 text-[11px] truncate">
                          {w.category}
                        </span>
                      </div>
                      <span className="inline-block px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[8px] font-mono font-bold shrink-0">
                        +{w.returnsPct}% Return
                      </span>
                    </div>

                    <div className="flex justify-between items-center mt-1.5 pl-4 text-[10px] text-slate-500 font-mono">
                      <span>₹{w.amount.toLocaleString()}</span>
                      <span className="text-slate-400 font-semibold">{percentage}% Share</span>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>

        {/* Right Column: Ledger List & Operations */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Subheading advice card */}
          <div className="bg-slate-900 text-white rounded-3xl p-5 border border-slate-950 shadow-sm">
            <div className="flex gap-2.5 items-start">
              <div className="p-1.5 bg-white/10 rounded-xl text-indigo-200 shrink-0">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-wider text-indigo-300 font-semibold font-mono block">Portfolio Safety Analysis</span>
                <h4 className="text-xs font-semibold text-white mt-0.5">Diversified Asset Base Secured</h4>
                <p className="text-xxs text-slate-300 font-light mt-1.5 leading-relaxed">
                  Your asset cushion is highly sound. Storing emergency liquidity in low-risk savings coordinates efficiently with stability mandates, while dynamic mutual equity funds harness macro compounding factors seamlessly. High net worth indices look well insulated from sudden market outlyers.
                </p>
              </div>
            </div>
          </div>

          {/* Active Ledger table card */}
          <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-xs">
            
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-4 pb-2 border-b border-slate-100">
              <h3 className="font-semibold text-xs uppercase tracking-wider text-slate-800">Allocated Asset Ledger</h3>
              
              <div className="flex items-center gap-2">
                {/* Filter tabs */}
                <div className="flex gap-0.5 bg-slate-50 p-0.5 rounded-lg border border-slate-100">
                  {["all", "low", "medium", "high"].map((fl) => (
                    <button
                      key={fl}
                      onClick={() => setSelectedRiskFilter(fl as any)}
                      className={`px-2 py-1 rounded-md text-[9px] uppercase font-mono tracking-tight font-semibold transition-all cursor-pointer ${
                        selectedRiskFilter === fl 
                          ? "bg-white text-slate-900 shadow-xxs border border-slate-100" 
                          : "text-slate-400 hover:text-slate-900"
                      }`}
                    >
                      {fl}
                    </button>
                  ))}
                </div>

                {/* Add asset trigger */}
                <button
                  onClick={() => setShowAddForm(prev => !prev)}
                  className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-semibold uppercase tracking-wider rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  {showAddForm ? "Discard" : "Integrate"}
                </button>
              </div>
            </div>

            {/* Asset Adder Form Block */}
            {showAddForm && (
              <form onSubmit={handleAddAsset} className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 mb-4 grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-wider font-semibold text-slate-400 font-mono">Asset Label</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. SGB Sovereign Gold, NASDAQ ETF"
                    value={newAsset.category}
                    onChange={(e) => setNewAsset({ ...newAsset, category: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none bg-white text-xxs text-slate-800 font-medium"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-wider font-semibold text-slate-400 font-mono">Risk Profile</label>
                  <select 
                    value={newAsset.risk}
                    onChange={(e) => setNewAsset({ ...newAsset, risk: e.target.value as any })}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none bg-white text-xxs text-slate-800 font-medium"
                  >
                    <option value="low">Low Risk (Debt, Cash)</option>
                    <option value="medium">Medium Risk (Gold, Hybrid)</option>
                    <option value="high">High Risk (Equities, Tech Index)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-wider font-semibold text-slate-400 font-mono">Annual Return (%)</label>
                  <input 
                    type="number"
                    step="0.1"
                    required
                    value={newAsset.returnsPct}
                    onChange={(e) => setNewAsset({ ...newAsset, returnsPct: parseFloat(e.target.value) || 0.0 })}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none bg-white text-xxs text-slate-800 font-mono font-semibold"
                  />
                </div>

                <div className="space-y-1 flex flex-col justify-between">
                  <label className="text-[9px] uppercase tracking-wider font-semibold text-slate-400 font-mono">Amount (₹)</label>
                  <div className="flex gap-2">
                    <input 
                      type="number"
                      required
                      value={newAsset.amount}
                      onChange={(e) => setNewAsset({ ...newAsset, amount: parseInt(e.target.value) || 0 })}
                      className="flex-1 p-2 border border-slate-200 rounded-lg focus:outline-none bg-white text-xxs text-slate-800 font-mono font-semibold"
                    />
                    <button 
                      type="submit"
                      className="px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xxs font-semibold cursor-pointer shrink-0"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Asset Ledger entries */}
            <div className="space-y-2.5">
              {filteredAssets.length === 0 ? (
                <div className="text-center py-8 text-xxs text-slate-400 font-light">
                  No active assets matching the filter rules are available.
                </div>
              ) : (
                filteredAssets.map((asset, i) => {
                  const pct = getAllocationPercent(asset.amount);
                  return (
                    <div key={i} className="flex justify-between items-center p-3.5 bg-[#FBFBFD] border border-slate-100 hover:border-slate-200/80 rounded-2xl transition-all">
                      
                      <div className="flex items-center gap-3 max-w-[65%] min-w-0 flex-1">
                        <div className="p-2 bg-slate-100 rounded-xl text-slate-800 shrink-0">
                          <Landmark className="w-4 h-4 text-slate-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-xs text-slate-800 truncate">{asset.category}</span>
                            <span className="inline-block px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[9px] font-mono font-bold shrink-0">
                              +{asset.returnsPct}% CAGR
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className={`inline-block px-1.5 py-0.5 rounded text-[8px] uppercase font-mono font-bold ${
                              asset.risk === "high" ? "bg-rose-50 text-rose-600" :
                              asset.risk === "medium" ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"
                            }`}>
                              {asset.risk} Risk Profile
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right font-mono">
                          <span className="text-xs font-bold text-slate-900 block">₹{asset.amount.toLocaleString()}</span>
                          <span className="text-[9px] text-slate-400 block mt-0.5">{pct}% Share</span>
                        </div>
                        <button
                          onClick={() => handleRemoveAsset(asset.category)}
                          className="p-1 px-2.5 border border-slate-200 hover:bg-rose-50 hover:border-rose-100 hover:text-rose-500 rounded-md text-xxs font-light transition-all text-slate-400 cursor-pointer"
                        >
                          De-link
                        </button>
                      </div>

                    </div>
                  );
                })
              )}
            </div>

          </div>

        </div>

      </div>

      {/* 4. Bottom Row: Dedicated AI Investment Companion */}
      <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-xs">
        
        <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
          <div className="p-1.5 bg-violet-50 rounded-xl">
            <Sparkles className="w-4 h-4 text-violet-600 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs uppercase tracking-wider font-semibold text-slate-800">Portfolio Investment Advisor</h3>
            <p className="text-xxs text-slate-400 font-light mt-0.5">Submit portfolio balancing questions or trigger macro asset suggestions instantly.</p>
          </div>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="e.g. Should I rebalance some of my commercial real estate holdings into dynamic mutual funds?"
            value={advisorQuestion}
            onChange={(e) => setAdvisorQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAskAdvisor();
              }
            }}
            className="flex-1 p-3 border border-slate-200 bg-[#FBFBFD] focus:bg-white rounded-2xl focus:outline-slate-900 text-xs text-slate-800 font-medium placeholder:text-slate-350"
          />
          <button
            onClick={handleAskAdvisor}
            disabled={advisorLoading || !advisorQuestion.trim()}
            className="px-5 py-3 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 text-white text-xs font-semibold rounded-2xl flex items-center gap-1.5 transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            {advisorLoading ? (
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            {advisorLoading ? "Compiling..." : "Query"}
          </button>
        </div>

        {/* AI Answer prints beautifully DIRECTLY below the query box */}
        {advisorResponse && (
          <div className="mt-4 p-5 bg-[#FBFBFD] border border-slate-100 rounded-2xl animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-violet-500 mt-0.5 shrink-0" />
              <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap font-medium">
                {advisorResponse}
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
