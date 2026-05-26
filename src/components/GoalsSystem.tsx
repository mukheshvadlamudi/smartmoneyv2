import React, { useState } from "react";
import { UserFinancialState, Goal } from "../types";
import { 
  Sparkles, Target, Calendar, Plus, ChevronRight, CheckCircle2, 
  HelpCircle, Trash2, ArrowRightLeft, Compass, Info 
} from "lucide-react";

interface GoalsSystemProps {
  financialState: UserFinancialState;
  setFinancialState: React.Dispatch<React.SetStateAction<UserFinancialState>>;
}

export default function GoalsSystem({ financialState, setFinancialState }: GoalsSystemProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGoal, setNewGoal] = useState({
    name: "",
    type: "vacation" as Goal["type"],
    targetAmount: 50000,
    monthlySavings: 3000,
    targetDate: "2027-01-01",
    category: "Experiences"
  });

  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(financialState.goals[0]?.id || null);

  const handleDeleteGoal = (id: string) => {
    setFinancialState(prev => ({
      ...prev,
      goals: prev.goals.filter(g => g.id !== id)
    }));
    if (selectedGoalId === id) {
      setSelectedGoalId(null);
    }
  };

  const handleAddGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.name.trim()) return;

    const created: Goal = {
      id: "g_" + Date.now(),
      name: newGoal.name,
      type: newGoal.type,
      targetAmount: Number(newGoal.targetAmount),
      currentAmount: 0,
      monthlySavings: Number(newGoal.monthlySavings),
      targetDate: newGoal.targetDate,
      category: newGoal.category
    };

    setFinancialState(prev => ({
      ...prev,
      goals: [...prev.goals, created]
    }));

    setSelectedGoalId(created.id);
    setShowAddForm(false);
    setNewGoal({
      name: "",
      type: "vacation",
      targetAmount: 50000,
      monthlySavings: 3000,
      targetDate: "2027-01-01",
      category: "Experiences"
    });
  };

  const handleQuickContribute = (goalId: string, amount: number) => {
    setFinancialState(prev => {
      const updatedGoals = prev.goals.map(g => {
        if (g.id === goalId) {
          const updatedVal = Math.min(g.targetAmount, g.currentAmount + amount);
          return { ...g, currentAmount: updatedVal };
        }
        return g;
      });
      return {
        ...prev,
        goals: updatedGoals,
        spending: Math.max(20000, prev.spending - amount) // moves spending cash into goal allocations
      };
    });
  };

  const selectedGoal = financialState.goals.find(g => g.id === selectedGoalId);

  // Math metrics for selected goals
  const calculateGoalRunway = (gl: Goal) => {
    const diff = gl.targetAmount - gl.currentAmount;
    if (diff <= 0) return 0;
    const months = Math.ceil(diff / Math.max(100, gl.monthlySavings));
    return months;
  };

  const currentSelectionVelocity = selectedGoal ? Math.round((selectedGoal.currentAmount / selectedGoal.targetAmount) * 100) : 0;
  const remainingMonths = selectedGoal ? calculateGoalRunway(selectedGoal) : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-slate-400 font-mono">Milestone Plans</span>
          <h2 className="text-2xl font-sans tracking-tight font-medium text-slate-800">Target Goals System</h2>
          <p className="text-slate-500 text-sm font-light mt-1">Configure physical or experience targets, monitor automated speeds, and top up milestones dynamically.</p>
        </div>
        
        <button
          onClick={() => setShowAddForm(prev => !prev)}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-full flex items-center gap-1.5 transition-colors shadow-sm self-start sm:self-center cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          {showAddForm ? "Collapse Workspace" : "Add Target Goal"}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddGoalSubmit} className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-md grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1.5">
            <label className="text-xs text-slate-400 font-semibold uppercase font-mono">Goal Indicator / Label</label>
            <input 
              type="text" 
              placeholder="e.g., Japan Cherry Blossom, Safe Emergency Fund"
              value={newGoal.name}
              onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
              className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none text-xs text-slate-800 font-medium"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-semibold uppercase font-mono">Category Allocation</label>
              <select 
                value={newGoal.category}
                onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
                className="w-full p-3 border border-slate-200 bg-white rounded-xl focus:outline-none text-xs text-slate-750"
              >
                <option value="Safety">Safety & Emergency</option>
                <option value="Experiences">Experiences & Travel</option>
                <option value="Growth">Personal Growth</option>
                <option value="Luxury">Luxury Electronics/Goods</option>
              </select>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-semibold uppercase font-mono">Target Date</label>
              <input 
                type="date" 
                value={newGoal.targetDate}
                onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
                className="w-full p-3 border border-slate-200 rounded-xl font-mono text-xs text-slate-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-semibold uppercase font-mono">Total Target Sum (₹)</label>
              <input 
                type="number" 
                value={newGoal.targetAmount}
                onChange={(e) => setNewGoal({ ...newGoal, targetAmount: parseInt(e.target.value) || 0 })}
                className="w-full p-3 border border-slate-200 rounded-xl text-xs text-slate-800 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-semibold uppercase font-mono">Planned Monthly Savings (₹)</label>
              <input 
                type="number" 
                value={newGoal.monthlySavings}
                onChange={(e) => setNewGoal({ ...newGoal, monthlySavings: parseInt(e.target.value) || 0 })}
                className="w-full p-3 border border-slate-200 rounded-xl text-xs text-slate-800 font-mono"
              />
            </div>
          </div>

          <div className="md:col-span-3 flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button 
              type="button" 
              onClick={() => setShowAddForm(false)} 
              className="px-4 py-2 border border-slate-200 text-slate-500 hover:text-slate-800 text-xs rounded-xl"
            >
              Discard
            </button>
            <button 
              type="submit" 
              className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl"
            >
              Compile & Save Goal
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Goal list workspace navigation */}
        <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-xs space-y-4 lg:col-span-1">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono mb-2">Target Objectives</h3>
          
          <div className="space-y-3">
            {financialState.goals.map((g) => {
              const progressPct = Math.round((g.currentAmount / g.targetAmount) * 100);
              const isSelected = g.id === selectedGoalId;
              return (
                <div 
                  key={g.id}
                  onClick={() => setSelectedGoalId(g.id)}
                  className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer text-left ${
                    isSelected ? "border-slate-900 bg-slate-50/50" : "border-slate-100 hover:border-slate-200 bg-[#FBFBFD]"
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <span className="font-semibold text-xs text-slate-800 truncate block max-w-[150px]">{g.name}</span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteGoal(g.id);
                      }}
                      className="p-1 text-slate-350 hover:text-rose-500 rounded transition-colors"
                      title="Delete goal parameters"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  
                  <div className="flex justify-between text-xxs block text-slate-400 mt-1 font-mono">
                    <span>₹{g.currentAmount.toLocaleString()} / ₹{g.targetAmount.toLocaleString()}</span>
                    <span>{progressPct}% Completed</span>
                  </div>

                  <div className="w-full h-1 bg-slate-100 rounded-full mt-2 overflow-hidden">
                    <div 
                      className="h-full bg-slate-800 transition-all duration-500" 
                      style={{ width: `${Math.min(100, progressPct)}%` }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Goal Analytics Dashboard */}
        <div className="lg:col-span-2">
          {selectedGoal ? (
            <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-xs space-y-6">
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-slate-100 text-slate-800 rounded-2xl">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xxs uppercase tracking-wider text-indigo-600 font-semibold font-mono">{selectedGoal.category} Allocation</span>
                    <h3 className="text-lg font-medium text-slate-800 tracking-tight">{selectedGoal.name}</h3>
                  </div>
                </div>

                <div className="text-right sm:text-right">
                  <span className="text-xxs uppercase block text-slate-400 font-mono">Remaining Amount</span>
                  <span className="text-xl font-semibold text-slate-800 font-mono text-left">₹{(selectedGoal.targetAmount - selectedGoal.currentAmount).toLocaleString()}</span>
                </div>
              </div>

              {/* Progress and Visual stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Dial or stat */}
                <div className="p-4 bg-[#FBFBFD] border border-slate-100 rounded-2xl flex flex-col justify-center items-center text-center">
                  <span className="text-xxs text-slate-400 block mb-2 uppercase font-mono tracking-wider">Goal Strength</span>
                  <div className="relative w-20 h-20 flex-shrink-0">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f1f5f9" strokeWidth="8" />
                      <circle 
                        cx="50" 
                        cy="50" 
                        r="40" 
                        fill="transparent" 
                        stroke="#0f172a" 
                        strokeWidth="8" 
                        strokeDasharray={251.2}
                        strokeDashoffset={251.2 - (251.2 * currentSelectionVelocity) / 100}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center font-mono font-bold text-xs">
                      {currentSelectionVelocity}%
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-2">of total capital reserve</span>
                </div>

                {/* AI delay indicators */}
                <div className="p-4 bg-[#FBFBFD] border border-slate-100 rounded-2xl md:col-span-2 space-y-3.5">
                  <span className="text-xxs font-semibold uppercase tracking-wider text-indigo-600 font-mono block">AI Projections & Recommended Velocity</span>
                  
                  <div className="flex gap-3 text-xs leading-relaxed font-light">
                    <div className="p-1 bg-indigo-50 rounded-lg h-fit text-indigo-500"><Sparkles className="w-3.5 h-3.5" /></div>
                    <p className="text-slate-600">
                      Based on dynamic tracking, staying on current pace of <span className="font-semibold font-mono text-slate-800">₹{selectedGoal.monthlySavings.toLocaleString()}/mo</span>, you will successfully achieve your target by <span className="font-semibold text-slate-800 mt-0.5">{selectedGoal.targetDate || "October 2026"}</span> ({remainingMonths} months away).
                    </p>
                  </div>

                  <div className="flex gap-2 text-xxs pt-1">
                    <div className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-md font-mono">
                      Velocity Score: Optimal
                    </div>
                    <div className="px-2.5 py-1 bg-slate-100 text-slate-600 border border-slate-250/10 rounded-md font-mono">
                      Runway risk: Minimal
                    </div>
                  </div>
                </div>

              </div>

              {/* Action Buttons: Contribute / Save more */}
              <div className="border-t border-slate-150 pt-6">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono mb-3">Compulsory Actions / Allocation Controls</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { amount: 5000, label: "+₹5,000 Outlay Shift" },
                    { amount: 15000, label: "+₹15,000 Surplus Sweep" },
                    { amount: 25000, label: "+₹25,000 High Sweep" },
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuickContribute(selectedGoal.id, preset.amount)}
                      disabled={selectedGoal.currentAmount >= selectedGoal.targetAmount}
                      className="px-4 py-3 border border-slate-200 hover:border-slate-800 hover:bg-slate-50 text-slate-700 hover:text-slate-900 rounded-xl text-xs font-medium cursor-pointer transition-colors"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
                <p className="text-xxs text-slate-400 mt-3 font-light">
                  *Adding layouts redirects discretionary income from variable baseline outlays directly into the designated goal account.
                </p>
              </div>

            </div>
          ) : (
            <div className="bg-white border border-slate-200/60 rounded-3xl p-12 text-center flex flex-col justify-center items-center min-h-[300px]">
              <Target className="w-8 h-8 text-slate-300 animate-pulse mb-3" />
              <p className="text-sm font-medium text-slate-500">No Target Active</p>
              <p className="text-xs text-slate-400 mt-1 font-light max-w-sm">Create an objective target or emergency budget reserve configuration to inspect long-term predictions.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
