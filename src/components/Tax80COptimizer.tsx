import React, { useState } from "react";
import { UserFinancialState } from "../types";
import { 
  Sparkles, CheckCircle2, AlertCircle, HelpCircle, 
  TrendingUp, Shield, BarChart3, ArrowRight, RotateCcw 
} from "lucide-react";

interface Tax80COptimizerProps {
  financialState: UserFinancialState;
}

export default function Tax80COptimizer({ financialState }: Tax80COptimizerProps) {
  // 4 Onboarding Questions State
  const [step, setStep] = useState<number>(1);
  const [grossIncome, setGrossIncome] = useState<number>(financialState.income * 12);
  const [alreadyInvested, setAlreadyInvested] = useState<number>(75000);
  const [riskProfile, setRiskProfile] = useState<"conservative" | "balanced" | "aggressive">("balanced");
  const [monthsRemaining, setMonthsRemaining] = useState<number>(10);
  
  // Results / active tab state inside optimizer
  const [submitted, setSubmitted] = useState<boolean>(false);

  const max80CLimit = 150000;
  const remaining80C = Math.max(0, max80CLimit - alreadyInvested);
  const monthlySavingsNeeded = Math.round(remaining80C / Math.max(1, monthsRemaining));

  // Additional NPS Section 80CCD(1B) savings
  const npsAdditionalLimit = 50000;
  // Estimate tax bracket based on income: if income > 15L, 30% slab
  const taxBracket = grossIncome > 1500000 ? 0.30 : (grossIncome > 1000000 ? 0.15 : (grossIncome > 700000 ? 0.10 : 0.05));
  const estimatedNpsSavings = npsAdditionalLimit * taxBracket;
  const standard80CSavings = remaining80C * taxBracket;
  const totalTaxSaved = standard80CSavings + estimatedNpsSavings;

  const handleNext = () => {
    if (step < 4) {
      setStep(prev => prev + 1);
    } else {
      setSubmitted(true);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    }
  };

  const handleReset = () => {
    setStep(1);
    setAlreadyInvested(75000);
    setRiskProfile("balanced");
    setMonthsRemaining(10);
    setSubmitted(false);
  };

  // Recommendations generator
  const getRecommendations = () => {
    switch (riskProfile) {
      case "aggressive":
        return [
          {
            name: "Equity Linked Savings Scheme (ELSS)",
            pct: 70,
            amount: Math.round(remaining80C * 0.70),
            lockIn: "3 Years (Shortest among 80C)",
            expectedReturn: "14% - 16% CAGR",
            risk: "High Risk",
            color: "emerald",
            desc: "Tax-saving diversified mutual funds investing in equity markets. Highest wealth creation potential but comes with market volatility."
          },
          {
            name: "National Pension System (NPS - Tier I)",
            pct: 30,
            amount: Math.round(remaining80C * 0.30),
            lockIn: "Till age 60 (With partial exit clauses)",
            expectedReturn: "10% - 12% CAGR",
            risk: "Medium-High Risk",
            color: "indigo",
            desc: "Government-backed retirement instrument. Blends equity and debt. Best for long-term compound security."
          }
        ];
      case "conservative":
        return [
          {
            name: "Public Provident Fund (PPF)",
            pct: 60,
            amount: Math.round(remaining80C * 0.60),
            lockIn: "15 Years (Partial withdrawals after 7 yrs)",
            expectedReturn: "7.1% (Tax-Free Guaranteed)",
            risk: "Risk-Free",
            color: "blue",
            desc: "Sovereign-backed risk-free compounding. Entire interest is 100% tax-free at maturity under Exempt-Exempt-Exempt (EEE) status."
          },
          {
            name: "National Savings Certificate (NSC) or Tax-Saving FD",
            pct: 25,
            amount: Math.round(remaining80C * 0.25),
            lockIn: "5 Years",
            expectedReturn: "7.0% - 7.7% (Taxable Interest)",
            risk: "Risk-Free",
            color: "amber",
            desc: "Post-office or bank guaranteed deposits. Locked for 5 years, interest earned is taxable according to your tax slab."
          },
          {
            name: "NPS (Conservative Auto Choice - LC25)",
            pct: 15,
            amount: Math.round(remaining80C * 0.15),
            lockIn: "Till age 60",
            expectedReturn: "8% - 9% Expected",
            risk: "Low-Medium Risk",
            color: "indigo",
            desc: "Retirement asset allocated heavily (75%+) towards safe sovereign and corporate debt instruments."
          }
        ];
      case "balanced":
      default:
        return [
          {
            name: "Equity Linked Savings Scheme (ELSS)",
            pct: 45,
            amount: Math.round(remaining80C * 0.45),
            lockIn: "3 Years",
            expectedReturn: "14% - 16% CAGR",
            risk: "High Risk",
            color: "emerald",
            desc: "Equity fund exposure to capture primary index compounding returns, minimizing locking period to just 3 years."
          },
          {
            name: "Public Provident Fund (PPF)",
            pct: 35,
            amount: Math.round(remaining80C * 0.35),
            lockIn: "15 Years",
            expectedReturn: "7.1% (Tax-Free Guaranteed)",
            risk: "Risk-Free",
            color: "blue",
            desc: "Guaranteed stable base that cushions the equity downside while compounding tax-free over the long horizon."
          },
          {
            name: "National Pension System (NPS - Active Allocation)",
            pct: 20,
            amount: Math.round(remaining80C * 0.20),
            lockIn: "Till age 60",
            expectedReturn: "10% - 11% Expected",
            risk: "Medium Risk",
            color: "indigo",
            desc: "A balanced 50:50 allocation of equity and safe government securities to secure tax exemption and retirement safety."
          }
        ];
    }
  };

  const recommendations = getRecommendations();

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500 font-bold bg-slate-100 px-2.5 py-1 rounded-md">
            AI Tax Suite
          </span>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight mt-2">
            Section 80C Tax Optimizer
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-light max-w-xl">
            Evaluate your remaining 80C limit, analyze your risk parameters, and receive customized tax-saving allocations to maximize net salary compound yield.
          </p>
        </div>

        {submitted && (
          <button
            onClick={handleReset}
            className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all focus:outline-none"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Recalculate Optimizer
          </button>
        )}
      </div>

      {/* 4-Step Questionnaire Wizard */}
      {!submitted ? (
        <div className="max-w-2xl mx-auto bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[10px] uppercase font-mono font-bold text-slate-400">
              <span>Questionnaire Step {step} of 4</span>
              <span>{Math.round((step / 4) * 100)}% Complete</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-slate-900 transition-all duration-300"
                style={{ width: `${(step / 4) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Contents */}
          <div className="min-h-[160px] flex flex-col justify-center py-4">
            {step === 1 && (
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-slate-800">
                  1. What is your Gross Annual Income (Salary & other sources)?
                </label>
                <p className="text-xxs text-slate-500 font-light leading-relaxed">
                  We use this to estimate your marginal tax bracket and show accurate post-tax rupee savings.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-slate-50 border border-slate-200/60 p-3 rounded-2xl">
                    <span className="text-xs font-medium text-slate-500">Gross Income:</span>
                    <span className="text-sm font-bold text-slate-900">₹{(grossIncome / 100000).toFixed(2)} Lakhs / year</span>
                  </div>
                  <input
                    type="range"
                    min={300000}
                    max={10000000}
                    step={100000}
                    value={grossIncome}
                    onChange={(e) => setGrossIncome(Number(e.target.value))}
                    className="w-full accent-slate-900 cursor-pointer h-1 bg-slate-200 rounded-lg appearance-none"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>₹3L</span>
                    <span>₹50L</span>
                    <span>₹1Cr</span>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-slate-800">
                  2. How much have you already invested under 80C this fiscal year?
                </label>
                <p className="text-xxs text-slate-500 font-light leading-relaxed">
                  Include EPF (Employee Provident Fund salary deductions), PPF, ELSS, home loan principal prepayments, child tuition fees, or life insurance premiums.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-slate-50 border border-slate-200/60 p-3 rounded-2xl">
                    <span className="text-xs font-medium text-slate-500">Already Invested:</span>
                    <span className="text-sm font-bold text-slate-900">₹{alreadyInvested.toLocaleString("en-IN")}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={150000}
                    step={5000}
                    value={alreadyInvested}
                    onChange={(e) => setAlreadyInvested(Number(e.target.value))}
                    className="w-full accent-slate-900 cursor-pointer h-1 bg-slate-200 rounded-lg appearance-none"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>₹0</span>
                    <span>₹75,000</span>
                    <span>₹1,50,000 (Fully Utilized)</span>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-slate-800">
                  3. Select your tax-saving investment risk profile
                </label>
                <p className="text-xxs text-slate-500 font-light leading-relaxed font-light">
                  Tax-saving vehicles carry varying risk profiles. Higher risk (ELSS) can yields far higher wealth, while Conservative (PPF) yields stability.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Conservative Card */}
                  <button
                    type="button"
                    onClick={() => setRiskProfile("conservative")}
                    className={`p-4 rounded-2xl border text-left flex flex-col space-y-2 cursor-pointer transition-all ${
                      riskProfile === "conservative"
                        ? "border-blue-500 bg-blue-50/20 shadow-xxs"
                        : "border-slate-200 hover:border-slate-350 bg-transparent"
                    }`}
                  >
                    <Shield className={`w-5 h-5 ${riskProfile === "conservative" ? "text-blue-500" : "text-slate-400"}`} />
                    <span className="text-xs font-bold text-slate-850 block mt-1">Conservative</span>
                    <span className="text-[10px] text-slate-500 font-light leading-relaxed">
                      Prefers guaranteed returns. Allocate mainly to government PPF & FDs. Low market risk.
                    </span>
                  </button>

                  {/* Balanced Card */}
                  <button
                    type="button"
                    onClick={() => setRiskProfile("balanced")}
                    className={`p-4 rounded-2xl border text-left flex flex-col space-y-2 cursor-pointer transition-all ${
                      riskProfile === "balanced"
                        ? "border-indigo-500 bg-indigo-50/20 shadow-xxs"
                        : "border-slate-200 hover:border-slate-350 bg-transparent"
                    }`}
                  >
                    <BarChart3 className={`w-5 h-5 ${riskProfile === "balanced" ? "text-indigo-500" : "text-slate-400"}`} />
                    <span className="text-xs font-bold text-slate-850 block mt-1">Balanced</span>
                    <span className="text-[10px] text-slate-500 font-light leading-relaxed">
                      Prefers hybrid gains. Split capital across equity indices (ELSS) & stable PPF. Moderate risk.
                    </span>
                  </button>

                  {/* Aggressive Card */}
                  <button
                    type="button"
                    onClick={() => setRiskProfile("aggressive")}
                    className={`p-4 rounded-2xl border text-left flex flex-col space-y-2 cursor-pointer transition-all ${
                      riskProfile === "aggressive"
                        ? "border-emerald-500 bg-emerald-50/20 shadow-xxs"
                        : "border-slate-200 hover:border-slate-350 bg-transparent"
                    }`}
                  >
                    <TrendingUp className={`w-5 h-5 ${riskProfile === "aggressive" ? "text-emerald-500" : "text-slate-400"}`} />
                    <span className="text-xs font-bold text-slate-850 block mt-1">Aggressive</span>
                    <span className="text-[10px] text-slate-500 font-light leading-relaxed">
                      Seeks maximum returns. Heavily allocate to ELSS mutual funds. High market risk.
                    </span>
                  </button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-slate-800">
                  4. How many months remain in this financial year to invest?
                </label>
                <p className="text-xxs text-slate-500 font-light leading-relaxed">
                  We use this to structure a monthly tax SIP allocation model, making the investment bite-sized rather than a lump sum burden.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-slate-50 border border-slate-200/60 p-3 rounded-2xl">
                    <span className="text-xs font-medium text-slate-500">Remaining Months:</span>
                    <span className="text-sm font-bold text-slate-900">{monthsRemaining} Months (till March 31)</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={12}
                    step={1}
                    value={monthsRemaining}
                    onChange={(e) => setMonthsRemaining(Number(e.target.value))}
                    className="w-full accent-slate-900 cursor-pointer h-1 bg-slate-200 rounded-lg appearance-none"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>1 Month (Emergency booking)</span>
                    <span>6 Months</span>
                    <span>12 Months (Full tax calendar)</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={handleBack}
              disabled={step === 1}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 disabled:text-slate-300 disabled:border-slate-100 rounded-xl text-xs font-semibold cursor-pointer disabled:cursor-not-allowed transition-colors"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"
            >
              {step === 4 ? "Optimize & Submit" : "Next Question"}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        /* Results View */
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-xxs">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold">80C Target Gap</span>
              <p className="text-lg font-bold text-slate-900 mt-2">₹{remaining80C.toLocaleString("en-IN")}</p>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-3.5">
                <div 
                  className="bg-slate-900 h-full" 
                  style={{ width: `${(alreadyInvested / max80CLimit) * 100}%` }}
                />
              </div>
              <span className="text-[9px] text-slate-450 mt-1.5 block">
                ₹{alreadyInvested.toLocaleString("en-IN")} utilized ({Math.round((alreadyInvested/max80CLimit)*100)}%)
              </span>
            </div>

            <div className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-xxs">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold">Monthly Tax SIP Needed</span>
              <p className="text-lg font-bold text-indigo-650 mt-2">₹{monthlySavingsNeeded.toLocaleString("en-IN")}/mo</p>
              <span className="text-[9px] text-slate-450 mt-4 block">
                Automated over remaining {monthsRemaining} months
              </span>
            </div>

            <div className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-xxs">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold">Estimated Marginal Tax Saved</span>
              <p className="text-lg font-bold text-emerald-650 mt-2">₹{Math.round(totalTaxSaved).toLocaleString("en-IN")}</p>
              <span className="text-[9px] text-slate-450 mt-4 block">
                Assumes your estimated tax bracket: {(taxBracket*100).toFixed(0)}%
              </span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xxs text-white">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-450 font-bold text-indigo-300">NPS Pro Hack</span>
              <p className="text-lg font-bold mt-2">₹{estimatedNpsSavings.toLocaleString("en-IN")} Saved</p>
              <span className="text-[9px] text-slate-300 mt-4 block leading-relaxed">
                Using additional ₹50k NPS Section 80CCD(1B) deduction
              </span>
            </div>
          </div>

          {/* Allocation Breakdown Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left 2 Columns: Investment Suggestions */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-slate-850">
                  Targeted Tax Allocation Recommendations ({riskProfile} profile)
                </h3>
              </div>

              {remaining80C === 0 ? (
                <div className="p-6 bg-emerald-50/20 border border-emerald-100 rounded-3xl text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                  <h4 className="text-xs font-bold text-emerald-850">Your 80C Limit is Fully Exhausted!</h4>
                  <p className="text-xxs text-slate-650 max-w-md mx-auto leading-relaxed">
                    Amazing! You have fully utilized your ₹1.5 Lakhs tax deduction limit. Move on to the NPS Section 80CCD(1B) additional optimizer below.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recommendations.map((rec, i) => {
                    const colorStyles = 
                      rec.color === "emerald" ? { bg: "bg-emerald-50/40 text-emerald-600 border-emerald-100/50", label: "text-emerald-800 bg-emerald-100/40", marker: "bg-emerald-500" } :
                      rec.color === "blue" ? { bg: "bg-blue-50/40 text-blue-600 border-blue-100/50", label: "text-blue-800 bg-blue-100/40", marker: "bg-blue-500" } :
                      rec.color === "indigo" ? { bg: "bg-indigo-50/40 text-indigo-650 border-indigo-100/50", label: "text-indigo-850 bg-indigo-100/40", marker: "bg-indigo-600" } :
                      { bg: "bg-amber-50/40 text-amber-600 border-amber-100/50", label: "text-amber-800 bg-amber-100/40", marker: "bg-amber-500" };

                    return (
                      <div 
                        key={i}
                        className={`bg-white border border-slate-200/80 rounded-3xl p-5 hover:shadow-xxs transition-all relative overflow-hidden flex flex-col md:flex-row gap-4 justify-between`}
                      >
                        <div className="space-y-3 max-w-md">
                          <div className="flex items-center gap-2">
                            <span className={`w-2.5 h-2.5 rounded-full ${colorStyles.marker}`} />
                            <h4 className="font-sans font-bold text-xs text-slate-900">{rec.name}</h4>
                            <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${colorStyles.label}`}>
                              {rec.pct}% split
                            </span>
                          </div>
                          
                          <p className="text-slate-650 text-xxs leading-relaxed font-light">
                            {rec.desc}
                          </p>

                          <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[9px] text-slate-500 font-mono">
                            <span>Lock-in: <strong className="text-slate-700 font-bold">{rec.lockIn}</strong></span>
                            <span>Est. Return: <strong className="text-slate-700 font-bold">{rec.expectedReturn}</strong></span>
                            <span>Risk: <strong className="text-slate-700 font-bold">{rec.risk}</strong></span>
                          </div>
                        </div>

                        <div className="md:text-right shrink-0 flex flex-row md:flex-col justify-between items-center md:items-end border-t md:border-t-0 border-slate-100 pt-3.5 md:pt-0">
                          <div>
                            <span className="text-[9px] text-slate-400 uppercase tracking-wider block font-mono">Target Investment</span>
                            <span className="text-sm font-bold text-slate-850">₹{rec.amount.toLocaleString("en-IN")}</span>
                          </div>
                          
                          <div className="mt-0 md:mt-4">
                            <span className="text-[8px] text-slate-400 uppercase tracking-wider block font-mono">Monthly Installment</span>
                            <span className="text-xs font-semibold text-slate-600">₹{Math.round(rec.amount / Math.max(1, monthsRemaining)).toLocaleString("en-IN")}/mo</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* NPS Additional Optimization Hack Banner */}
              <div className="bg-slate-900 text-white rounded-3xl p-6 relative overflow-hidden shadow-xs border border-slate-850">
                <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl" />
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-indigo-500/20 text-indigo-300 rounded-xl shrink-0 mt-0.5">
                    <Sparkles className="w-4.5 h-4.5" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-sans font-bold text-xs text-indigo-300 uppercase tracking-wider">
                        AI Wealth Strategy: The Section 80CCD(1B) Arbitrage
                      </h4>
                      <span className="bg-indigo-650 text-white text-[8px] px-1.5 py-0.5 font-bold rounded">
                        Highly Recommended
                      </span>
                    </div>
                    <p className="text-xxs text-slate-350 leading-relaxed font-light">
                      Most taxpayers stop at the ₹1.5L 80C limit. However, the Indian Income Tax Act permits an **additional deduction of up to ₹50,000** for investments in NPS (Tier-I accounts) under Section 80CCD(1B). Since your estimated salary puts you in the <strong>{(taxBracket*100).toFixed(0)}% tax bracket</strong>, depositing ₹50,000 into NPS will immediately save you an additional <strong>₹{estimatedNpsSavings.toLocaleString("en-IN")} in tax</strong>.
                    </p>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex justify-between items-center text-xs mt-4">
                      <div>
                        <span className="text-[9px] text-slate-400 block font-mono uppercase">Optimal NPS Top-up</span>
                        <span className="font-bold text-slate-200">₹50,000 (Lump sum or ₹{Math.round(50000/Math.max(1, monthsRemaining)).toLocaleString("en-IN")}/mo)</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] text-slate-400 block font-mono uppercase">Net Extra Cash Back</span>
                        <span className="font-bold text-emerald-400">₹{estimatedNpsSavings.toLocaleString("en-IN")} Saved</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Breakdown & Educational Glossary */}
            <div className="space-y-6">
              {/* Allocation Chart card */}
              <div className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-xxs space-y-4">
                <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-slate-800">
                  Target Allocation Mix
                </h4>
                
                {remaining80C > 0 ? (
                  <div className="space-y-4">
                    <div className="flex h-6 rounded-xl overflow-hidden border border-slate-100 shadow-xxs">
                      {recommendations.map((rec, i) => (
                        <div
                          key={i}
                          className={`h-full text-center text-white text-[9px] font-bold flex items-center justify-center transition-all ${
                            rec.color === "emerald" ? "bg-emerald-500" :
                            rec.color === "blue" ? "bg-blue-500" :
                            rec.color === "indigo" ? "bg-indigo-650" : "bg-amber-500"
                          }`}
                          style={{ width: `${rec.pct}%` }}
                          title={`${rec.name}: ${rec.pct}%`}
                        >
                          {rec.pct}%
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2 pt-2">
                      {recommendations.map((rec, i) => (
                        <div key={i} className="flex justify-between items-center text-[10px]">
                          <div className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${
                              rec.color === "emerald" ? "bg-emerald-500" :
                              rec.color === "blue" ? "bg-blue-500" :
                              rec.color === "indigo" ? "bg-indigo-600" : "bg-amber-500"
                            }`} />
                            <span className="text-slate-650 font-light truncate max-w-[140px]">{rec.name}</span>
                          </div>
                          <span className="font-bold text-slate-800">₹{rec.amount.toLocaleString("en-IN")}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-xxs text-slate-500 font-light text-center py-6">
                    Allocations completed. Limit utilized!
                  </p>
                )}
              </div>

              {/* Tax Jargon Helper */}
              <div className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-xxs space-y-4">
                <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-slate-800">
                  Core Tax Definitions
                </h4>
                <div className="space-y-3.5">
                  <div>
                    <span className="text-[10px] font-bold text-slate-800 block">ELSS (Equity Linked Savings Scheme)</span>
                    <p className="text-xxs text-slate-500 leading-relaxed mt-0.5 font-light">
                      Mutual funds that invest at least 80% in equities. Eligible for tax benefits under Section 80C. Carries the shortest lock-in period (3 years) of all 80C products.
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-800 block">PPF (Public Provident Fund)</span>
                    <p className="text-xxs text-slate-500 leading-relaxed mt-0.5 font-light">
                      A long-term government savings scheme offering risk-free guaranteed interest. Enjoys EEE status (investment, interest, and withdrawals are all tax exempt).
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-800 block">Section 80CCD(1B)</span>
                    <p className="text-xxs text-slate-500 leading-relaxed mt-0.5 font-light">
                      An exclusive sub-section dedicated to retirement savings. Allows individuals to claim deductions on voluntary NPS investments up to ₹50,000, outside 80C.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* SEBI Compliance Disclaimer Callout */}
      <div className="p-4 bg-amber-55/35 border border-amber-200/50 rounded-2xl flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-[10px] text-amber-800 font-light leading-relaxed">
          <strong className="font-semibold">Educational Disclaimer:</strong> This tax optimization dashboard is provided purely for mock educational and scenario demonstration purposes. It does not constitute formal tax planning, financial planning, or professional Chartered Accountancy (CA) advice. Slabs, exemptions, and deductions vary based on individual circumstances and changing fiscal regulations. Verify and audit calculations with an authorized Chartered Accountant (CA) or certified tax professional before finalizing investments or filing income tax returns.
        </p>
      </div>

    </div>
  );
}
