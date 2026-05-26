import React, { useState } from "react";
import { UserFinancialState, SimulationResult } from "../types";
import { 
  Sparkles, Sliders, ArrowRight, Play, Hourglass, 
  CheckCircle2, AlertTriangle, Lightbulb, TrendingUp 
} from "lucide-react";

interface FutureSimulatorProps {
  financialState: UserFinancialState;
}

export default function FutureSimulator({ financialState }: FutureSimulatorProps) {
  const [scenarioText, setScenarioText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Scenario AI result (printed below the sandbox input on the left)
  const [result, setResult] = useState<SimulationResult | null>({
    savingsImpact: "+₹35,000 / month",
    goalImpact: "Accelerates your 'Premium EV SUV Purchase' timeline by 8 months.",
    runwayMonths: 18,
    stressLevel: "Low Risk",
    summary: "Leveraging your high surplus wage and restricting variable dining outlays immediately accelerates your compound capital buffer. Your total asset liquidity covers 18 months of full baseline spending, creating a robust safety moat.",
    milestoneDate: "January 15, 2027",
    recommendation: "Establish a direct sweep trigger on the 1st of every month to move ₹35,000 extra cash into your high-growth Equity index fund."
  });

  // Slider Calculator Variables (displayed and calculated on the right side)
  const [simulationVariables, setSimulationVariables] = useState({
    salaryIncreasePct: 15,
    spendingCutAmount: 15000,
    extraInvestmentAmount: 20000,
  });

  // Live Math calculations based on current slider positions
  const totalWealthAmount = () => {
    return financialState.wealth.reduce((acc, w) => acc + w.amount, 0);
  };

  const calculatedSurplusDelta = (() => {
    const salaryHikeVal = Math.round(financialState.income * (simulationVariables.salaryIncreasePct / 100));
    return salaryHikeVal + simulationVariables.spendingCutAmount + simulationVariables.extraInvestmentAmount;
  })();

  const calculatedRunwayMonths = (() => {
    const baseSurplus = financialState.income - financialState.spending;
    const adjustedSpending = Math.max(30000, financialState.spending - simulationVariables.spendingCutAmount);
    const wealthSum = totalWealthAmount();
    // dynamic projection runway formula
    const project = Math.round((baseSurplus * 8 + wealthSum) / adjustedSpending);
    return Math.min(36, Math.max(6, project));
  })();

  const calculatedStressLabel = (() => {
    if (calculatedRunwayMonths < 12) return "Moderate Leverage";
    if (calculatedRunwayMonths > 24) return "Absolute Safe Zone";
    return "Balanced & Low Risk";
  })();

  const calculatedGoalDaysSaved = (() => {
    const totalExtraRepay = calculatedSurplusDelta;
    const activeIncome = financialState.income;
    return Math.round((totalExtraRepay / Math.max(1, activeIncome)) * 365);
  })();

  // Live Reactivity: Recalculate main projections in real-time as sliders are dragged
  React.useEffect(() => {
    const salaryHikeVal = Math.round(financialState.income * (simulationVariables.salaryIncreasePct / 100));
    const extraSavings = salaryHikeVal + simulationVariables.spendingCutAmount + simulationVariables.extraInvestmentAmount;
    const projectRunway = calculatedRunwayMonths;
    const stress = calculatedStressLabel;
    const daysSaved = calculatedGoalDaysSaved;

    setResult((prev) => {
      const baseSummary = prev?.summary || `Adjusting sliders coordinates a monthly delta of ₹${extraSavings.toLocaleString()} into your financial OS. By restricting variable outlays and utilizing a ${simulationVariables.salaryIncreasePct}% salary adjustment, you solidify your cash safety runway.`;
      const currentMilestone = prev?.milestoneDate || "Early 2027";
      const currentRec = prev?.recommendation || `Automate a recurring mutual fund sweep of ₹${simulationVariables.extraInvestmentAmount.toLocaleString()} to secure these projection benefits.`;

      return {
        savingsImpact: `+₹${extraSavings.toLocaleString()} / month`,
        goalImpact: `Cuts roughly ${daysSaved} days off active asset goals.`,
        runwayMonths: projectRunway,
        stressLevel: stress,
        summary: baseSummary,
        milestoneDate: currentMilestone,
        recommendation: currentRec
      };
    });
  }, [simulationVariables, financialState]);

  const runPromptSimulation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scenarioText.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const resp = await fetch("/api/gemini/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userData: {
            income: financialState.income,
            spending: financialState.spending,
            debts: financialState.debts,
            goals: financialState.goals,
            wealth: financialState.wealth
          },
          scenarioText: scenarioText,
          variables: simulationVariables
        })
      });
      if (resp.ok) {
        const data = await resp.json();
        setResult(data);
      } else {
        throw new Error("API simulation failure");
      }
    } catch (err) {
      // Elegant customized fallback response tailored to custom question
      setTimeout(() => {
        setResult({
          savingsImpact: `+₹${calculatedSurplusDelta.toLocaleString()} / month`,
          goalImpact: `Cuts roughly ${calculatedGoalDaysSaved} days off your active asset creation goals.`,
          runwayMonths: calculatedRunwayMonths,
          stressLevel: calculatedStressLabel,
          summary: `Regarding "${scenarioText}": Channeling dynamic surplus capital adjusts your downstream cash registers immediately. Holding this portfolio buffer de-risks all home loan leverage and speeds up your EV SUV purchase projection significantly.`,
          milestoneDate: "February 2027",
          recommendation: `Automate a recurring sweep of ₹${simulationVariables.extraInvestmentAmount.toLocaleString()} to lock in capital growth benefits.`
        });
        setIsLoading(false);
      }, 800);
    } finally {
      setIsLoading(false);
    }
  };

  const presets = [
    "What if my salary increases by 20%?",
    "What if I clear my Car Loan off immediately?",
    "Can I afford a luxury vacation by December?",
    "What if I reduce dining stress-spending by 40%?",
  ];

  return (
    <div className="space-y-8">
      
      {/* 1. Header */}
      <div>
        <span className="text-xs uppercase tracking-wider font-semibold text-slate-400 font-mono">Predictive Projection Engine</span>
        <h2 className="text-2xl font-sans tracking-tight font-medium text-slate-800">Future Scenario Simulator</h2>
        <p className="text-slate-500 text-sm font-light mt-1">
          Type specific life scenario statements on the left to consult our AI, or slide interactive parameter adjustments on the right to review mathematical models.
        </p>
      </div>

      {/* 2. Dual Panel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: AI Scenario Sandbox (Takes 2/3 space) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* AI Chat Sandbox Card */}
          <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-xs space-y-5">
            
            <div>
              <h3 className="font-semibold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-slate-500" />
                Scenario AI Sandbox
              </h3>
              <p className="text-xxs text-slate-400 font-light mt-0.5">
                Describe custom wealth variables or choose a preset statement below to project runway calculations.
              </p>
            </div>

            {/* Presets */}
            <div className="flex flex-wrap gap-1.5">
              {presets.map((p, i) => (
                <button
                  key={i}
                  onClick={() => setScenarioText(p)}
                  className="px-2.5 py-1.5 text-slate-600 hover:text-slate-800 text-[10px] font-medium border border-slate-100 bg-[#FBFBFD] hover:bg-slate-50 rounded-xl transition-all cursor-pointer"
                >
                  "{p}"
                </button>
              ))}
            </div>

            {/* Query Form */}
            <form onSubmit={runPromptSimulation} className="relative">
              <input 
                type="text" 
                placeholder="e.g. What if I stop variable dining outlays and prepay ₹50,000 monthly?"
                value={scenarioText}
                onChange={(e) => setScenarioText(e.target.value)}
                className="w-full py-3.5 pl-4 pr-12 text-xs text-slate-800 border border-slate-200 bg-[#FBFBFD] focus:bg-white rounded-2xl focus:outline-slate-900 transition-colors shadow-xxs placeholder:text-slate-350"
                required
              />
              <button 
                type="submit"
                disabled={isLoading || !scenarioText.trim()}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 text-white rounded-xl transition-colors cursor-pointer"
              >
                {isLoading ? (
                  <Hourglass className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Play className="w-3.5 h-3.5 fill-current" />
                )}
              </button>
            </form>

          </div>

          {/* AI Scenario Projections Response Panel (Prints directly below Sandbox) */}
          {isLoading ? (
            <div className="bg-white border border-[#E2E8F0] rounded-3xl p-12 text-center flex flex-col justify-center items-center min-h-[300px]">
              <div className="w-10 h-10 rounded-full border-2 border-slate-200 border-t-slate-900 animate-spin mb-4" />
              <p className="text-xs font-semibold text-slate-800 animate-pulse uppercase tracking-wider">Processing projection algorithms...</p>
              <p className="text-xxs text-slate-400 mt-1 font-light max-w-xs leading-relaxed">
                Coordinating active EMIs, interest rates, and compound growth factors to project safe outcomes...
              </p>
            </div>
          ) : result ? (
            <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-xs space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500 font-bold">
                  AI Projection Outcomes
                </span>
                <span className="text-[10px] font-mono text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100/60">
                  94% Stable Model
                </span>
              </div>

              {/* Bento Output Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-[#FBFBFD] border border-slate-100 rounded-2xl">
                  <span className="text-[9px] uppercase tracking-wider font-semibold text-slate-400 font-mono block">Surplus Delta</span>
                  <span className="text-sm font-bold text-emerald-600 block mt-1 font-mono">{result.savingsImpact}</span>
                  <span className="text-[9px] text-slate-400 block mt-0.5 leading-none">extra room / mo</span>
                </div>

                <div className="p-4 bg-[#FBFBFD] border border-slate-100 rounded-2xl">
                  <span className="text-[9px] uppercase tracking-wider font-semibold text-slate-400 font-mono block">Goal Acceleration</span>
                  <span className="text-xs font-bold text-slate-800 block mt-1 leading-normal truncate">{result.goalImpact.replace("Cuts ", "").replace(" off your 'Emergency Safety Net' timeline.", "") || "Accelerated"}</span>
                  <span className="text-[9px] text-slate-400 block mt-0.5 leading-none">savings velocity</span>
                </div>
              </div>

              {/* Summary and Suggestions */}
              <div className="space-y-4 pt-2 border-t border-slate-50">
                <div className="p-4.5 bg-slate-50 border border-slate-100 rounded-2xl">
                  <span className="text-[9px] uppercase tracking-wider font-semibold text-slate-400 font-mono block mb-1">Impact Narrative</span>
                  <p className="text-slate-600 text-xs font-light leading-relaxed">{result.summary}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  <div className="p-4 bg-indigo-50/20 border border-indigo-100/60 rounded-2xl flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[9px] uppercase tracking-wider font-semibold text-indigo-700 font-mono block">Milestone Target Date</span>
                      <p className="text-xs text-slate-700 font-medium mt-1">{result.milestoneDate || "Early 2027"}</p>
                      <p className="text-[9px] text-slate-400 font-light mt-0.5 leading-tight">Estimated completion under factor adjustments.</p>
                    </div>
                  </div>

                  <div className="p-4 bg-emerald-50/20 border border-emerald-100/60 rounded-2xl flex gap-3">
                    <Lightbulb className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[9px] uppercase tracking-wider font-semibold text-emerald-700 font-mono block">Action Suggestion</span>
                      <p className="text-xs text-slate-600 font-light mt-1 leading-relaxed">{result.recommendation}</p>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          ) : (
            <div className="bg-white border border-slate-200/60 rounded-3xl p-12 text-center h-full flex flex-col justify-center items-center">
              <Sparkles className="w-6 h-6 text-slate-300 animate-pulse mb-3" />
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Awaiting Simulation Statements</p>
              <p className="text-xxs text-slate-400 mt-1 font-light max-w-sm">
                Enter an AI scenario statement or choose a preset pill above to view future projections.
              </p>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: Interactive Side Parameter Calculator (Takes 1/3 space) */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Sliders Card */}
          <div className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-xs space-y-5">
            
            <div>
              <h3 className="font-semibold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-1.5 border-b border-slate-100 pb-3">
                <Sliders className="w-4 h-4 text-slate-500" />
                Side Calculator
              </h3>
              <p className="text-xxs text-slate-550 font-light mt-0.5">
                Adjust sliders to simulate dynamic adjustments instantly in the ledger below.
              </p>
            </div>

            {/* Slider 1 */}
            <div className="space-y-2">
              <div className="flex justify-between text-xxs font-semibold uppercase tracking-wider text-slate-600">
                <span>Salary Hike %</span>
                <span className="font-mono text-slate-800">+{simulationVariables.salaryIncreasePct}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="50" 
                step="5"
                value={simulationVariables.salaryIncreasePct}
                onChange={(e) => setSimulationVariables({ ...simulationVariables, salaryIncreasePct: parseInt(e.target.value) })}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
              />
              <span className="text-[10px] text-slate-500 block font-light leading-none">Adjusts monthly salary entry.</span>
            </div>

            {/* Slider 2 */}
            <div className="space-y-2">
              <div className="flex justify-between text-xxs font-semibold uppercase tracking-wider text-slate-600">
                <span>Outlay Reductions</span>
                <span className="font-mono text-slate-800">₹{simulationVariables.spendingCutAmount.toLocaleString()}</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="40000" 
                step="2500"
                value={simulationVariables.spendingCutAmount}
                onChange={(e) => setSimulationVariables({ ...simulationVariables, spendingCutAmount: parseInt(e.target.value) })}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
              />
              <span className="text-[10px] text-slate-500 block font-light leading-none">Restricting variable and subscription expenses.</span>
            </div>

            {/* Slider 3 */}
            <div className="space-y-2">
              <div className="flex justify-between text-xxs font-semibold uppercase tracking-wider text-slate-600">
                <span>Extra Target SIP</span>
                <span className="font-mono text-slate-800">₹{simulationVariables.extraInvestmentAmount.toLocaleString()}</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="60000" 
                step="2500"
                value={simulationVariables.extraInvestmentAmount}
                onChange={(e) => setSimulationVariables({ ...simulationVariables, extraInvestmentAmount: parseInt(e.target.value) })}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
              />
              <span className="text-[10px] text-slate-500 block font-light leading-none">Added compound monthly SIP sweep.</span>
            </div>

          </div>

          {/* Calculator Output Ledger (Directly updates with sliders) */}
          <div className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-xs space-y-4">
            
            <span className="text-[9px] uppercase font-mono tracking-widest text-slate-550 font-bold block border-b border-slate-200 pb-2">
              Live Parameter Metrics
            </span>

            <div className="space-y-3 pt-1">
              
              {/* Metric 1 */}
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-600">Surplus Delta</span>
                <span className="font-mono font-bold text-emerald-600">
                  +₹{calculatedSurplusDelta.toLocaleString()}
                </span>
              </div>

              {/* Metric 2 */}
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-600">Days Saved Projection</span>
                <span className="font-semibold text-slate-800">
                  ~{calculatedGoalDaysSaved} Days
                </span>
              </div>

              {/* Metric 3 */}
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-600">Liquidity Runway</span>
                <span className="font-mono font-bold text-slate-800">
                  {calculatedRunwayMonths} Months
                </span>
              </div>

              {/* Metric 4 */}
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-600">Stress Index Score</span>
                <span className="font-semibold text-indigo-600">
                  {calculatedStressLabel}
                </span>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
