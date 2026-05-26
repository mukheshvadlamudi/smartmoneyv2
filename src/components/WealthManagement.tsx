import React, { useState } from "react";
import { UserFinancialState, AssetAllocation } from "../types";
import { 
  Sparkles, Landmark, HelpCircle, ArrowUpRight, Plus, CheckCircle2, 
  TrendingUp, Compass, Info, ShieldCheck, HeartPulse, PieChart 
} from "lucide-react";

interface WealthManagementProps {
  financialState: UserFinancialState;
  setFinancialState: React.Dispatch<React.SetStateAction<UserFinancialState>>;
}

export default function WealthManagement({ financialState, setFinancialState }: WealthManagementProps) {
  const [showAddAsset, setShowAddAsset] = useState(false);
  const [newAsset, setNewAsset] = useState({
    category: "",
    amount: 25000,
    risk: "medium" as AssetAllocation["risk"],
    color: "rgba(167, 243, 208, 0.6)",
    returnsPct: 12.0
  });

  const [selectedRiskFilter, setSelectedRiskFilter] = useState<"all" | "low" | "medium" | "high">("all");

  const totalWealth = financialState.wealth.reduce((acc, w) => acc + w.amount, 0);

  const handleCreateAssetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAsset.category.trim()) return;

    // Pick consistent color depending on risk
    let pickedColor = "rgba(191, 219, 254, 0.6)"; // low (pastel blue)
    if (newAsset.risk === "medium") pickedColor = "rgba(254, 243, 199, 0.6)"; // beige
    if (newAsset.risk === "high") pickedColor = "rgba(233, 213, 255, 0.6)"; // lavender

    const created: AssetAllocation = {
      category: newAsset.category,
      amount: Number(newAsset.amount),
      risk: newAsset.risk,
      color: pickedColor,
      returnsPct: Number(newAsset.returnsPct)
    };

    setFinancialState(prev => ({
      ...prev,
      wealth: [...prev.wealth, created]
    }));

    setShowAddAsset(false);
    setNewAsset({
      category: "",
      amount: 25000,
      risk: "medium",
      color: "",
      returnsPct: 12.0
    });
  };

  const handleEraseAsset = (category: string) => {
    setFinancialState(prev => ({
      ...prev,
      wealth: prev.wealth.filter(w => w.category !== category)
    }));
  };

  const filteredAssets = financialState.wealth.filter(w => {
    if (selectedRiskFilter === "all") return true;
    return w.risk === selectedRiskFilter;
  });

  // Calculate percentages
  const getFraction = (amt: number) => {
    if (totalWealth <= 0) return 0;
    return Math.round((amt / totalWealth) * 100);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-slate-400 font-mono">Allocation Matrix</span>
          <h2 className="text-2xl font-sans tracking-tight font-medium text-slate-800 font-sans">Compound Wealth Management</h2>
          <p className="text-slate-500 text-sm font-light mt-1">Review strategic index holdings, liquid reserve allocations, and real-time diversification quality scores.</p>
        </div>

        <button
          onClick={() => setShowAddAsset(prev => !prev)}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-full flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          {showAddAsset ? "Discard Asset Builder" : "Integrate Asset allocation"}
        </button>
      </div>

      {showAddAsset && (
        <form onSubmit={handleCreateAssetSubmit} className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-md grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs text-slate-400 font-semibold uppercase font-mono">Asset Description / Sub-Class</label>
            <input 
              type="text" 
              placeholder="e.g., Sovereign Gold Bonds, Nasdaq 100 Tech ETF"
              value={newAsset.category}
              onChange={(e) => setNewAsset({ ...newAsset, category: e.target.value })}
              className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-slate-900 text-xs text-slate-800 font-medium"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-semibold uppercase font-mono">Risk Profile Ratio</label>
              <select
                value={newAsset.risk}
                onChange={(e) => setNewAsset({ ...newAsset, risk: e.target.value as AssetAllocation["risk"] })}
                className="w-full p-2.5 border border-slate-200 bg-white rounded-xl focus:outline-none text-xs text-slate-755 font-medium"
              >
                <option value="low">Low Risk (Debt, Savings, cash)</option>
                <option value="medium">Medium Risk (Hybrid Funds, Gold)</option>
                <option value="high">High Risk (Equities, Tech Index, Crypto)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-semibold uppercase font-mono">Asset Capital Amount (₹)</label>
              <input 
                type="number" 
                value={newAsset.amount}
                onChange={(e) => setNewAsset({ ...newAsset, amount: parseInt(e.target.value) || 0 })}
                className="w-full p-2.5 border border-[#E2E8F0] rounded-xl focus:outline-slate-900 text-xs text-slate-800 font-mono font-semibold"
                required
              />
            </div>
          </div>

          <div className="md:col-span-1 flex items-end">
            <button 
              type="submit"
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold font-sans tracking-tight transition-all cursor-pointer"
            >
              Add Asset To Balance Sheets
            </button>
          </div>
        </form>
      )}

      {/* Grid: Allocation charts vs Asset lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left chart card */}
        <div className="lg:col-span-1 bg-white border border-slate-200/60 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-sm text-slate-800 flex items-center gap-1"><PieChart className="w-4 h-4" /> Allocation Overview</h3>
              <span className="text-xxs font-mono text-emerald-600 font-semibold">Goal Synchronized</span>
            </div>

            {/* Custom vector styled SVG allocation visualization */}
            <div className="w-full aspect-square flex flex-col justify-center items-center py-6 relative">
              <svg className="w-44 h-44 transform -rotate-90" viewBox="0 0 100 100">
                {financialState.wealth.map((w, index) => {
                  let accumulatedOffset = 0;
                  for (let i = 0; i < index; i++) {
                    accumulatedOffset += getFraction(financialState.wealth[i].amount);
                  }
                  const percentage = getFraction(w.amount);
                  const circleOffset = 251.2 - (251.2 * percentage) / 100;
                  const dashOffset = circleOffset;
                  const rotationOffset = (accumulatedOffset * 360) / 100;

                  return (
                    <circle 
                      key={index}
                      cx="50" 
                      cy="50" 
                      r="40" 
                      fill="transparent" 
                      stroke={w.color === "rgba(167, 243, 208, 0.6)" ? "#A7F3D0" : (w.color === "rgba(191, 219, 254, 0.6)" ? "#BFDBFE" : "#E9D5FF")}
                      strokeWidth="11" 
                      strokeDasharray={251.2}
                      strokeDashoffset={dashOffset}
                      className="transition-all duration-700 hover:stroke-indigo-400"
                      transform={`rotate(${rotationOffset} 50 50)`}
                      strokeLinecap="butt"
                    />
                  );
                })}
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xxs text-slate-400 uppercase font-mono tracking-wider font-light">Compound Sum</span>
                <span className="text-lg font-bold font-mono text-slate-800">₹{totalWealth.toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-100">
              {financialState.wealth.map((w, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: w.color }} />
                    <span className="font-light text-slate-600 truncate max-w-[160px]">{w.category}</span>
                  </div>
                  <span className="font-mono text-slate-400 font-medium">₹{w.amount.toLocaleString()} ({getFraction(w.amount)}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Asset details table representation */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-slate-900 text-white rounded-2xl p-4 border border-slate-950 shadow-sm">
            <div className="flex gap-2.5 items-start">
              <div className="p-1.5 bg-white/10 rounded-lg text-indigo-200 shrink-0"><Sparkles className="w-3.5 h-3.5 animate-pulse" /></div>
              <div>
                <span className="text-[9px] uppercase tracking-wider text-indigo-300 font-semibold font-mono">Portfolio Diversification Analysis</span>
                <h4 className="text-xs font-semibold text-white mt-0.5">Excellent Structural Safety Cushion</h4>
                <p className="text-xxs text-slate-300 font-light mt-1 leading-relaxed">
                  Your asset layout is exceptionally well insulated. Holding **₹1,80,000** in high yield liquid cash coordinates effectively with conservative emergency criteria, while your equity allocation (Nifty 50 Tracker) harvests passive dividend appreciation. No speculative crypto outlyers are overloading total leverage.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-xs">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
              <h3 className="font-semibold text-sm text-slate-800">Allocated Ledger</h3>
              <div className="flex gap-1">
                {["all", "low", "medium", "high"].map((fl) => (
                  <button
                    key={fl}
                    onClick={() => setSelectedRiskFilter(fl as any)}
                    className={`px-2 py-1 rounded-md text-[10px] uppercase font-mono ${
                      selectedRiskFilter === fl ? "bg-slate-900 text-white font-semibold" : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    {fl}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {filteredAssets.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400 font-light">
                  No active assets align with this specific risk filter.
                </div>
              ) : (
                filteredAssets.map((w, i) => (
                  <div key={i} className="flex justify-between items-center p-3.5 bg-[#FBFBFD] border border-slate-100 hover:border-slate-200 rounded-xl transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-100 rounded-xl text-slate-800">
                        <Landmark className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-semibold text-xs text-slate-800 block leading-tight">{w.category}</span>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className={`px-1.5 py-0.5 rounded text-[8px] uppercase font-mono font-semibold ${
                            w.risk === "high" ? "bg-rose-50 text-rose-600" :
                            w.risk === "medium" ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"
                          }`}>
                            {w.risk} Risk Profile
                          </span>
                          <span className="inline-block px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[8px] font-mono font-bold">
                            +{w.returnsPct}% CAGR
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="font-mono text-xs font-semibold text-slate-800 block">₹{w.amount.toLocaleString()}</span>
                        <span className="text-[9px] text-slate-400 font-mono italic block">{getFraction(w.amount)}% Share</span>
                      </div>
                      <button
                        onClick={() => handleEraseAsset(w.category)}
                        className="p-1 px-2.5 border border-slate-200 hover:bg-rose-50 hover:border-rose-100 hover:text-rose-500 rounded text-xxs font-light transition-all text-slate-500 cursor-pointer"
                      >
                        De-link
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
