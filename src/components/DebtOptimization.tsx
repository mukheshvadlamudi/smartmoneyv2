import React, { useState } from "react";
import { UserFinancialState, Debt } from "../types";
import { 
  Sparkles, ShieldCheck, Zap, Compass, Calculator, Info, Check, 
  HelpCircle, Landmark, Calendar, Percent
} from "lucide-react";

interface DebtOptimizationProps {
  financialState: UserFinancialState;
  setFinancialState: React.Dispatch<React.SetStateAction<UserFinancialState>>;
}

export default function DebtOptimization({ financialState, setFinancialState }: DebtOptimizationProps) {
  const [selectedStrategy, setSelectedStrategy] = useState<"avalanche" | "snowball">("avalanche");
  const [showAddDebt, setShowAddDebt] = useState(false);
  const [editingDebtId, setEditingDebtId] = useState<string | null>(null);
  const [newDebt, setNewDebt] = useState({
    name: "",
    principal: 80000,
    interestRate: 11.5,
    emi: 3500,
    remainingMonths: 24,
    category: "personal-loan" as Debt["category"]
  });

  const [simulationExtraRepayment, setSimulationExtraRepayment] = useState(5000);

  const handleCreateDebtSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDebt.name.trim()) return;

    if (editingDebtId) {
      setFinancialState(prev => ({
        ...prev,
        debts: prev.debts.map(d => d.id === editingDebtId ? {
          ...d,
          name: newDebt.name,
          principal: Number(newDebt.principal),
          interestRate: Number(newDebt.interestRate),
          emi: Number(newDebt.emi),
          remainingMonths: Number(newDebt.remainingMonths),
          category: newDebt.category
        } : d)
      }));
      setEditingDebtId(null);
    } else {
      const created: Debt = {
        id: "debt_" + Date.now(),
        name: newDebt.name,
        principal: Number(newDebt.principal),
        interestRate: Number(newDebt.interestRate),
        emi: Number(newDebt.emi),
        remainingMonths: Number(newDebt.remainingMonths),
        category: newDebt.category
      };

      setFinancialState(prev => ({
        ...prev,
        debts: [...prev.debts, created],
        // adjust health slightly representing new liability
        healthScore: Math.max(30, prev.healthScore - 4)
      }));
    }

    setShowAddDebt(false);
    setNewDebt({
      name: "",
      principal: 80000,
      interestRate: 11.5,
      emi: 3500,
      remainingMonths: 24,
      category: "personal-loan"
    });
  };

  const handleEraseDebt = (id: string) => {
    setFinancialState(prev => ({
      ...prev,
      debts: prev.debts.filter(d => d.id !== id),
      healthScore: Math.min(100, prev.healthScore + 3)
    }));
  };

  const totalDebtsAmount = financialState.debts.reduce((acc, d) => acc + d.principal, 0);
  const totalMonthlyEMI = financialState.debts.reduce((acc, d) => acc + d.emi, 0);

  // Math simulations for avalanche
  const highInterestDebt = [...financialState.debts].sort((a, b) => b.interestRate - a.interestRate)[0];
  const lowestPrincipalDebt = [...financialState.debts].sort((a, b) => a.principal - b.principal)[0];

  const simulatedInterestSavings = Math.round(totalDebtsAmount * (simulationExtraRepayment / 100000) * 0.18);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-slate-400 font-mono">Liability Matrix</span>
          <h2 className="text-2xl font-sans tracking-tight font-medium text-slate-800">Debt Optimization Command</h2>
          <p className="text-slate-500 text-sm font-light mt-1">Simulate early payoff margins, analyze compound debt velocity strategies, and clear liability loops mindfully.</p>
        </div>

        <button
          onClick={() => {
            if (showAddDebt) {
              setEditingDebtId(null);
              setNewDebt({
                name: "",
                principal: 80000,
                interestRate: 11.5,
                emi: 3500,
                remainingMonths: 24,
                category: "personal-loan"
              });
            }
            setShowAddDebt(prev => !prev);
          }}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-full flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
        >
          <Zap className="w-3.5 h-3.5" />
          {showAddDebt ? "Discard Debt Setup" : "Add Active Loan"}
        </button>
      </div>

      {showAddDebt && (
        <form onSubmit={handleCreateDebtSubmit} className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-md grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs text-slate-400 font-semibold uppercase font-mono">Lender / Loan Label</label>
            <input 
              type="text" 
              placeholder="e.g., SBI Education Loan, ICICI Car EMI"
              value={newDebt.name}
              onChange={(e) => setNewDebt({ ...newDebt, name: e.target.value })}
              className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-slate-900 text-xs text-slate-800 font-medium"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-semibold uppercase font-mono">Liability Category</label>
              <select
                value={newDebt.category}
                onChange={(e) => setNewDebt({ ...newDebt, category: e.target.value as Debt["category"] })}
                className="w-full p-2.5 border border-[#E2E8F0] bg-white rounded-xl focus:outline-none text-xs text-slate-750 font-medium"
              >
                <option value="education-loan">Education Loan</option>
                <option value="credit-card">Credit Card Debt</option>
                <option value="personal-loan">Personal Loan</option>
                <option value="car-loan">Transport / Car Loan</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-semibold uppercase font-mono">Outstanding Principal (₹)</label>
              <input 
                type="number" 
                value={newDebt.principal}
                onChange={(e) => setNewDebt({ ...newDebt, principal: parseInt(e.target.value) || 0 })}
                className="w-full p-2.5 border border-slate-200 rounded-xl text-xs text-slate-800 font-mono font-semibold"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-semibold uppercase font-mono">Yearly Interest %</label>
              <input 
                type="number" 
                step="0.1"
                value={newDebt.interestRate}
                onChange={(e) => setNewDebt({ ...newDebt, interestRate: parseFloat(e.target.value) || 0 })}
                className="w-full p-2.5 border border-slate-200 rounded-xl text-xs text-slate-800 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-semibold uppercase font-mono">Monthly EMI (₹)</label>
              <input 
                type="number" 
                value={newDebt.emi}
                onChange={(e) => setNewDebt({ ...newDebt, emi: parseInt(e.target.value) || 0 })}
                className="w-full p-2.5 border border-slate-200 rounded-xl text-xs text-slate-800 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-semibold uppercase font-mono font-light">Months Left</label>
              <input 
                type="number" 
                value={newDebt.remainingMonths}
                onChange={(e) => setNewDebt({ ...newDebt, remainingMonths: parseInt(e.target.value) || 0 })}
                className="w-full p-2.5 border border-slate-200 rounded-xl text-xs text-slate-800 font-mono"
              />
            </div>
          </div>

          <div className="md:col-span-3 flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button 
              type="button" 
              onClick={() => {
                setShowAddDebt(false);
                setEditingDebtId(null);
                setNewDebt({
                  name: "",
                  principal: 80000,
                  interestRate: 11.5,
                  emi: 3500,
                  remainingMonths: 24,
                  category: "personal-loan"
                });
              }}
              className="px-4 py-2 border border-slate-200 text-slate-500 hover:text-slate-800 text-xs rounded-xl animate-fadeIn"
            >
              Discard
            </button>
            <button 
              type="submit"
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold"
            >
              {editingDebtId ? "Update Debt Parameters" : "Add Liability Entry"}
            </button>
          </div>
        </form>
      )}

      {/* Grid: Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left strategies box */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-medium text-slate-800 flex items-center gap-1.5">
              <Calculator className="w-4 h-4 text-slate-500" />
              Payoff Strategy Comparison
            </h3>

            <div className="grid grid-cols-2 gap-2 bg-slate-50 p-1 rounded-xl">
              <button
                onClick={() => setSelectedStrategy("avalanche")}
                className={`py-2 text-xxs font-semibold rounded-lg uppercase tracking-wider transition-colors cursor-pointer ${
                  selectedStrategy === "avalanche" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Avalanche (Rate-first)
              </button>
              <button
                onClick={() => setSelectedStrategy("snowball")}
                className={`py-2 text-xxs font-semibold rounded-lg uppercase tracking-wider transition-colors cursor-pointer ${
                  selectedStrategy === "snowball" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Snowball (Balance-first)
              </button>
            </div>

            {selectedStrategy === "avalanche" ? (
              <div className="space-y-3.5">
                <p className="text-slate-600 text-xs font-light leading-relaxed">
                  The **Debt Avalanche** strategy prioritizes the liability with the **highest interest rate**, keeping compounding charges mathematically minimized.
                </p>
                {highInterestDebt && (
                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs">
                    <span className="text-[10px] text-indigo-600 block uppercase font-mono tracking-wider font-semibold">Priority 1 Target</span>
                    <span className="font-semibold block text-slate-800 mt-1">{highInterestDebt.name}</span>
                    <span className="text-xxs block text-slate-500 mt-0.5">Rate: {highInterestDebt.interestRate}% • Balance: ₹{highInterestDebt.principal.toLocaleString()}</span>
                  </div>
                )}
                <p className="text-xxs text-amber-600 font-semibold">• Mathematically optimal. Saves the most interest outlay over the total repayment pipeline.</p>
              </div>
            ) : (
              <div className="space-y-3.5">
                <p className="text-slate-600 text-xs font-light leading-relaxed">
                  The **Debt Snowball** strategy tackles the **smallest balance first**, establishing immediate psychological wins and freeing up monthly cash flow quickly.
                </p>
                {lowestPrincipalDebt && (
                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs">
                    <span className="text-[10px] text-emerald-600 block uppercase font-mono tracking-wider font-semibold">Priority 1 Target</span>
                    <span className="font-semibold block text-slate-800 mt-1">{lowestPrincipalDebt.name}</span>
                    <span className="text-xxs block text-slate-500 mt-0.5">Balance: ₹{lowestPrincipalDebt.principal.toLocaleString()} • Rate: {lowestPrincipalDebt.interestRate}%</span>
                  </div>
                )}
                <p className="text-xxs text-emerald-600 font-semibold">• Psychologically supreme. Releases individual due-dates and monthly obligations quickly.</p>
              </div>
            )}
          </div>
 
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs text-slate-800">
            <div className="flex gap-2 mb-2 items-center">
              <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
              <h4 className="font-semibold text-xs text-slate-900 tracking-tight">AI Early Repayment Sweep Guide</h4>
            </div>
            
            <p className="text-xs text-slate-600 font-light leading-relaxed mb-3">
              Directing a monthly extra sum reduces interest friction and cuts back total timeline delays. Adjust the slider to see simulated interests saved.
            </p>
 
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex justify-between text-xxs text-slate-500">
                <span>Extra Target Contribution</span>
                <span className="font-mono text-slate-900 font-semibold">₹{simulationExtraRepayment.toLocaleString()}</span>
              </div>
              <input 
                type="range" 
                min="1000" 
                max="30000" 
                step="1000"
                value={simulationExtraRepayment}
                onChange={(e) => setSimulationExtraRepayment(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-slate-900"
              />
              <div className="flex justify-between text-xxs font-mono text-slate-500 mt-2">
                <span>Total Interest Saved (Projected)</span>
                <span className="text-emerald-600 font-semibold">₹{simulatedInterestSavings.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Active debts lists representing the balance sheets parameters */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-xs">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
              <div>
                <h3 className="font-semibold text-sm text-slate-800">Outstanding Liabilities</h3>
                <p className="text-xxs text-slate-400 mt-0.5">Scan current loans, interests, and EMIs.</p>
              </div>
              <div className="text-right">
                <span className="text-xxs text-slate-400 block font-mono">Total Monthly EMIs</span>
                <span className="text-sm font-bold font-mono text-[#E11D48]">₹{totalMonthlyEMI.toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-3">
              {financialState.debts.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-600 font-light">
                  Congratulations! No active liabilities scanned; you maintain absolute wage freedom.
                </div>
              ) : (
                [...financialState.debts]
                  .sort((a, b) => {
                    if (selectedStrategy === "avalanche") {
                      return b.interestRate - a.interestRate; // Rate-first
                    } else {
                      return a.principal - b.principal; // Balance-first
                    }
                  })
                  .map((d, index) => (
                    <div key={d.id} className="p-4 bg-[#FBFBFD] border border-slate-100 hover:border-slate-200 rounded-xl flex items-center justify-between gap-4 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 rounded-xl text-slate-800">
                          <Landmark className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-xs text-slate-800 block leading-tight">{d.name}</span>
                            <span className={`px-1.5 py-0.5 rounded text-[8px] uppercase font-mono font-semibold ${
                              index === 0 ? "bg-amber-100 text-amber-800 font-bold" : "bg-slate-200 text-slate-700"
                            }`}>
                              Priority #{index + 1}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-600">
                            <span className="font-mono">Rate: {d.interestRate}%</span>
                            <span>•</span>
                            <span className="font-mono">{d.remainingMonths} payments left</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className="font-mono text-xs font-semibold text-slate-800 block">₹{d.principal.toLocaleString()}</span>
                          <span className="text-[10px] text-slate-600 block font-mono mt-0.5">EMI: ₹{d.emi.toLocaleString()}</span>
                        </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingDebtId(d.id);
                            setNewDebt({
                              name: d.name,
                              principal: d.principal,
                              interestRate: d.interestRate,
                              emi: d.emi,
                              remainingMonths: d.remainingMonths,
                              category: d.category
                            });
                            setShowAddDebt(true);
                          }}
                          className="px-3 py-1.5 border border-slate-200 hover:bg-indigo-50 hover:border-indigo-150 hover:text-indigo-600 rounded text-xxs font-light transition-all text-slate-500 cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleEraseDebt(d.id)}
                          className="px-3 py-1.5 border border-slate-200 hover:bg-rose-50 hover:border-rose-100 hover:text-rose-500 rounded text-xxs font-light transition-all text-slate-500 cursor-pointer"
                        >
                          Settle Line
                        </button>
                      </div>
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
