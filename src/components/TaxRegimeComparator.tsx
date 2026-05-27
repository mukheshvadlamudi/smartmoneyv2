import React, { useState } from "react";
import { UserFinancialState } from "../types";
import { 
  Sparkles, Scale, AlertCircle, HelpCircle, 
  ArrowRight, FileText, Share2, Copy, Check 
} from "lucide-react";

interface TaxRegimeComparatorProps {
  financialState: UserFinancialState;
}

export default function TaxRegimeComparator({ financialState }: TaxRegimeComparatorProps) {
  // Inputs
  const [grossSalary, setGrossSalary] = useState<number>(financialState.income * 12);
  const [basicSalaryPct, setBasicSalaryPct] = useState<number>(50); // basic is usually 50% of gross
  const [hraReceived, setHraReceived] = useState<number>(600000);
  const [monthlyRent, setMonthlyRent] = useState<number>(45000);
  const [isMetro, setIsMetro] = useState<boolean>(true);
  
  // Deductions
  const [sec80C, setSec80C] = useState<number>(150000);
  const [sec24b, setSec24b] = useState<number>(200000); // Home Loan Interest
  const [sec80D, setSec80D] = useState<number>(25000); // Health insurance
  const [sec80CCD, setSec80CCD] = useState<number>(50000); // NPS additional

  // UI Utilities
  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  // Computations
  const basicSalary = (grossSalary * basicSalaryPct) / 100;
  
  // HRA Exemption (under Old Regime)
  const annualRentPaid = monthlyRent * 12;
  const rentMinusTenPercentBasic = Math.max(0, annualRentPaid - (basicSalary * 0.10));
  const basicSalaryCap = basicSalary * (isMetro ? 0.50 : 0.40);
  
  const hraExemption = Math.min(
    hraReceived,
    rentMinusTenPercentBasic,
    basicSalaryCap
  );

  // Standard deductions
  const oldStandardDeduction = 50000;
  const newStandardDeduction = 75000; // Post-Budget 2024

  // Net taxable incomes
  const oldDeductionsSum = 
    hraExemption + 
    oldStandardDeduction + 
    Math.min(200000, sec24b) + 
    Math.min(150000, sec80C) + 
    Math.min(25000, sec80D) + 
    Math.min(50000, sec80CCD);

  const oldTaxableIncome = Math.max(0, grossSalary - oldDeductionsSum);
  const newTaxableIncome = Math.max(0, grossSalary - newStandardDeduction); // Standard deduction only, no other exemptions

  // Old Tax Calculation Function
  const calculateOldTax = (taxableIncome: number): number => {
    if (taxableIncome <= 250000) return 0;
    
    let tax = 0;
    
    // Slab 1: ₹2.5L to ₹5L @ 5%
    if (taxableIncome > 250000) {
      tax += Math.min(250000, taxableIncome - 250000) * 0.05;
    }
    // Slab 2: ₹5L to ₹10L @ 20%
    if (taxableIncome > 500000) {
      tax += Math.min(500000, taxableIncome - 500000) * 0.20;
    }
    // Slab 3: Above ₹10L @ 30%
    if (taxableIncome > 1000000) {
      tax += (taxableIncome - 1000000) * 0.30;
    }

    // Section 87A Tax Rebate for Old Regime if taxable income <= 5L
    if (taxableIncome <= 500000) {
      return 0;
    }

    // Add 4% Cess
    return tax * 1.04;
  };

  // New Tax Calculation Function (Post-Budget 2024 Slabs)
  const calculateNewTax = (taxableIncome: number): number => {
    // Slabs:
    // Up to 3L: Nil
    // 3L to 7L: 5%
    // 7L to 10L: 10%
    // 10L to 12L: 15%
    // 12L to 15L: 20%
    // Above 15L: 30%
    
    if (taxableIncome <= 300000) return 0;
    
    let tax = 0;
    
    // Slab 1: ₹3L to ₹7L @ 5%
    if (taxableIncome > 300000) {
      tax += Math.min(400000, taxableIncome - 300000) * 0.05;
    }
    // Slab 2: ₹7L to ₹10L @ 10%
    if (taxableIncome > 700000) {
      tax += Math.min(300000, taxableIncome - 700000) * 0.10;
    }
    // Slab 3: ₹10L to ₹12L @ 15%
    if (taxableIncome > 1000000) {
      tax += Math.min(200000, taxableIncome - 1000000) * 0.15;
    }
    // Slab 4: ₹12L to ₹15L @ 20%
    if (taxableIncome > 1200000) {
      tax += Math.min(300000, taxableIncome - 1200000) * 0.20;
    }
    // Slab 5: Above ₹15L @ 30%
    if (taxableIncome > 1500000) {
      tax += (taxableIncome - 1500000) * 0.30;
    }

    // Section 87A Tax Rebate for New Regime if taxable income <= 7L
    if (taxableIncome <= 700000) {
      return 0;
    }

    // Add 4% Cess
    return tax * 1.04;
  };

  const oldTax = Math.round(calculateOldTax(oldTaxableIncome));
  const newTax = Math.round(calculateNewTax(newTaxableIncome));
  
  const taxSavings = Math.abs(oldTax - newTax);
  const recommendedRegime = oldTax < newTax ? "Old Tax Regime" : "New Tax Regime";
  const nonRecommendedRegime = oldTax < newTax ? "New Tax Regime" : "Old Tax Regime";

  const handleCopySummary = () => {
    const summaryText = `Smart Money Tax Audit Report (FY 2026-27)
---------------------------------------
Gross Salary: ₹${(grossSalary / 100000).toFixed(2)} Lakhs
Claimed Deductions (Old): ₹${oldDeductionsSum.toLocaleString("en-IN")}
Standard Deduction (New): ₹${newStandardDeduction.toLocaleString("en-IN")}

Net Taxable Income:
- Old Regime: ₹${oldTaxableIncome.toLocaleString("en-IN")}
- New Regime: ₹${newTaxableIncome.toLocaleString("en-IN")}

Tax Liability (incl. Cess):
- Old Regime: ₹${oldTax.toLocaleString("en-IN")}
- New Regime: ₹${newTax.toLocaleString("en-IN")}

Recommendation:
👉 Invest under the ${recommendedRegime.toUpperCase()}! 
🎉 Saving ₹${taxSavings.toLocaleString("en-IN")} in annual taxes.

Audited educational tool via Smart Money by FutureLab Studios.`;

    navigator.clipboard.writeText(summaryText);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500 font-bold bg-slate-100 px-2.5 py-1 rounded-md">
          AI Tax Suite
        </span>
        <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight mt-2">
          Old vs New Tax Regime Comparator
        </h2>
        <p className="text-xs text-slate-500 mt-1 font-light max-w-xl">
          Enter salary, HRA rentals, and investments to run real-time post-Budget 2024 algorithms, comparing net liabilities side-by-side.
        </p>
      </div>

      {/* Main Grid: Left Inputs, Right Visuals */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Form Inputs (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-3xl p-5 md:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-5">
          <h3 className="font-sans font-bold text-[11px] uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2.5">
            Salary & Income Variables
          </h3>

          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-bold text-slate-700 block mb-1">Gross Annual Salary (in ₹)</label>
              <input
                type="number"
                value={grossSalary}
                onChange={(e) => setGrossSalary(Number(e.target.value))}
                className="w-full p-2.5 text-xs text-slate-800 border border-slate-200 bg-slate-50/50 rounded-xl focus:outline-slate-900 transition-all font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-700 block mb-1">Basic Salary % of Gross</label>
                <input
                  type="number"
                  min={30}
                  max={70}
                  value={basicSalaryPct}
                  onChange={(e) => setBasicSalaryPct(Number(e.target.value))}
                  className="w-full p-2.5 text-xs text-slate-800 border border-slate-200 bg-slate-50/50 rounded-xl focus:outline-slate-900 transition-all font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-700 block mb-1">HRA Component Received</label>
                <input
                  type="number"
                  value={hraReceived}
                  onChange={(e) => setHraReceived(Number(e.target.value))}
                  className="w-full p-2.5 text-xs text-slate-800 border border-slate-200 bg-slate-50/50 rounded-xl focus:outline-slate-900 transition-all font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-700 block mb-1">Monthly Rent Paid (in ₹)</label>
                <input
                  type="number"
                  value={monthlyRent}
                  onChange={(e) => setMonthlyRent(Number(e.target.value))}
                  className="w-full p-2.5 text-xs text-slate-800 border border-slate-200 bg-slate-50/50 rounded-xl focus:outline-slate-900 transition-all font-mono"
                />
              </div>
              <div className="flex flex-col justify-end">
                <label className="text-[10px] font-bold text-slate-700 block mb-2">City Category</label>
                <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setIsMetro(true)}
                    className={`flex-1 py-1 text-[10px] font-semibold rounded-md transition-colors cursor-pointer ${
                      isMetro ? "bg-white text-slate-900 shadow-xxs" : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    Metro
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsMetro(false)}
                    className={`flex-1 py-1 text-[10px] font-semibold rounded-md transition-colors cursor-pointer ${
                      !isMetro ? "bg-white text-slate-900 shadow-xxs" : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    Non-Metro
                  </button>
                </div>
              </div>
            </div>
          </div>

          <h3 className="font-sans font-bold text-[11px] uppercase tracking-wider text-slate-800 border-b border-slate-100 pt-3 pb-2.5">
            Deductions (Old Regime only)
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-slate-700 block mb-1">Section 80C (Max 1.5L)</label>
              <input
                type="number"
                max={150000}
                value={sec80C}
                onChange={(e) => setSec80C(Number(e.target.value))}
                className="w-full p-2.5 text-xs text-slate-800 border border-slate-200 bg-slate-50/50 rounded-xl focus:outline-slate-900 transition-all font-mono"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-700 block mb-1">Home Loan Int (Sec 24b)</label>
              <input
                type="number"
                value={sec24b}
                onChange={(e) => setSec24b(Number(e.target.value))}
                className="w-full p-2.5 text-xs text-slate-800 border border-slate-200 bg-slate-50/50 rounded-xl focus:outline-slate-900 transition-all font-mono"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-700 block mb-1">Health Ins (Sec 80D)</label>
              <input
                type="number"
                max={100000}
                value={sec80D}
                onChange={(e) => setSec80D(Number(e.target.value))}
                className="w-full p-2.5 text-xs text-slate-800 border border-slate-200 bg-slate-50/50 rounded-xl focus:outline-slate-900 transition-all font-mono"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-700 block mb-1">NPS extra (80CCD(1B))</label>
              <input
                type="number"
                max={50000}
                value={sec80CCD}
                onChange={(e) => setSec80CCD(Number(e.target.value))}
                className="w-full p-2.5 text-xs text-slate-800 border border-slate-200 bg-slate-50/50 rounded-xl focus:outline-slate-900 transition-all font-mono"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Visual Dashboard (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Recommendation Banner */}
          <div className="bg-slate-900 border border-slate-850 rounded-3xl p-6 text-white shadow-sm relative overflow-hidden">
            <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl" />
            
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center shrink-0">
                <Scale className="w-5 h-5" />
              </div>
              <div className="space-y-1.5 flex-1">
                <span className="text-[10px] uppercase font-mono tracking-widest text-indigo-300 font-bold">
                  Comparator Recommendation
                </span>
                
                {taxSavings > 0 ? (
                  <>
                    <h3 className="text-sm md:text-base font-bold tracking-tight text-white leading-snug">
                      Opt for the <span className="text-emerald-400 font-extrabold">{recommendedRegime}</span> and save <span className="text-emerald-400 font-extrabold">₹{taxSavings.toLocaleString("en-IN")}</span> in annual tax liability!
                    </h3>
                    <p className="text-xxs text-slate-350 font-light leading-relaxed">
                      Your deductions under Old Regime sum to <strong>₹{oldDeductionsSum.toLocaleString("en-IN")}</strong>. The {recommendedRegime} delivers a {oldTax < newTax ? "lower" : "far lower"} tax burden.
                    </p>
                  </>
                ) : (
                  <>
                    <h3 className="text-sm font-bold tracking-tight text-white leading-snug">
                      Both regimes yield equal tax liabilities!
                    </h3>
                    <p className="text-xxs text-slate-350 font-light leading-relaxed">
                      You are in the break-even zone. Consider the New Tax Regime to avoid holding investments locked or needing documentation.
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Side by Side Comparison Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Old Regime Card */}
            <div className={`bg-white border rounded-3xl p-5 shadow-xxs space-y-4 transition-all ${
              recommendedRegime === "Old Tax Regime" ? "border-slate-300 ring-1 ring-slate-200" : "border-slate-200/60"
            }`}>
              <div className="flex justify-between items-center pb-2.5 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-800">Old Tax Regime</span>
                {recommendedRegime === "Old Tax Regime" && (
                  <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 text-[8px] font-bold px-1.5 py-0.5 rounded-full">
                    Recommended
                  </span>
                )}
              </div>

              <div className="space-y-3 font-sans">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-555 font-light">Gross Income:</span>
                  <span className="font-semibold text-slate-700">₹{grossSalary.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-[11px] text-emerald-600">
                  <span className="font-light">Exemptions & Deductions:</span>
                  <span className="font-semibold">- ₹{oldDeductionsSum.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-[11px] border-t border-slate-50 pt-2 font-semibold">
                  <span className="text-slate-800 font-medium">Net Taxable Income:</span>
                  <span className="text-slate-805 text-slate-800">₹{oldTaxableIncome.toLocaleString("en-IN")}</span>
                </div>

                <div className="flex justify-between text-xs pt-3 border-t border-slate-100 font-bold">
                  <span className="text-slate-900">Final Tax Payable:</span>
                  <span className="text-slate-900 text-sm">₹{oldTax.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>

            {/* New Regime Card */}
            <div className={`bg-white border rounded-3xl p-5 shadow-xxs space-y-4 transition-all ${
              recommendedRegime === "New Tax Regime" ? "border-slate-300 ring-1 ring-slate-200" : "border-slate-200/60"
            }`}>
              <div className="flex justify-between items-center pb-2.5 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-800">New Tax Regime (2024)</span>
                {recommendedRegime === "New Tax Regime" && (
                  <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 text-[8px] font-bold px-1.5 py-0.5 rounded-full">
                    Recommended
                  </span>
                )}
              </div>

              <div className="space-y-3 font-sans">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-555 font-light">Gross Income:</span>
                  <span className="font-semibold text-slate-700">₹{grossSalary.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-[11px] text-emerald-600">
                  <span className="font-light">Standard Deduction:</span>
                  <span className="font-semibold">- ₹{newStandardDeduction.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-[11px] border-t border-slate-50 pt-2 font-semibold">
                  <span className="text-slate-800 font-medium">Net Taxable Income:</span>
                  <span className="text-slate-850 text-slate-800">₹{newTaxableIncome.toLocaleString("en-IN")}</span>
                </div>

                <div className="flex justify-between text-xs pt-3 border-t border-slate-100 font-bold">
                  <span className="text-slate-900">Final Tax Payable:</span>
                  <span className="text-slate-900 text-sm">₹{newTax.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Visual Slabs Chart */}
          <div className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-xxs space-y-4">
            <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-slate-850">
              Visual Tax Burden Comparison
            </h4>
            
            <div className="space-y-3.5">
              {/* Old tax bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>Old Regime Tax: <strong>₹{oldTax.toLocaleString("en-IN")}</strong></span>
                  <span>{((oldTax/grossSalary)*100).toFixed(1)}% Eff. Rate</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-slate-400/80 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, Math.max(2, (oldTax / Math.max(oldTax, newTax)) * 100))}%` }}
                  />
                </div>
              </div>

              {/* New tax bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>New Regime Tax: <strong>₹{newTax.toLocaleString("en-IN")}</strong></span>
                  <span>{((newTax/grossSalary)*100).toFixed(1)}% Eff. Rate</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, Math.max(2, (newTax / Math.max(oldTax, newTax)) * 100))}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Premium Shareable Report Card */}
          <div className="bg-slate-50/70 border border-slate-250/70 rounded-3xl p-5 flex flex-col md:flex-row gap-5 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white text-slate-700 border border-slate-200/50 flex items-center justify-center shrink-0 shadow-xxs">
                <FileText className="w-4.5 h-4.5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-slate-800">Share Report with Friends</h4>
                <p className="text-[10px] text-slate-500 font-light leading-snug">
                  Generate a beautifully formatted tax summary report and copy it to clipboard to share on WhatsApp or Slack.
                </p>
              </div>
            </div>
            
            <button
              onClick={handleCopySummary}
              className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-750 rounded-xl text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer shadow-xxs focus:outline-none"
            >
              {copySuccess ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              <span>{copySuccess ? "Copied Report!" : "Copy Report Summary"}</span>
            </button>
          </div>

        </div>

      </div>

      {/* SEBI Compliance Disclaimer Callout */}
      <div className="p-4 bg-amber-55/35 border border-amber-200/50 rounded-2xl flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-[10px] text-amber-800 font-light leading-relaxed">
          <strong className="font-semibold">Educational Disclaimer:</strong> This comparison calculator is provided for mock scenarios and basic education about Indian Income Tax regimes. It does not replace professional Chartered Accountancy (CA) audit or formal filing checks. Actual calculations depend on specific HRA rules (e.g. basic slab composition), local municipal taxes, professional taxes, standard deduction details, and final investments. Slabs correspond to standard Budget 2024 guidelines. Surcharges are not applied for incomes over ₹50L. Always consult a certified Chartered Accountant (CA) or certified tax specialist before selecting your regime or filing income tax returns.
        </p>
      </div>

    </div>
  );
}
