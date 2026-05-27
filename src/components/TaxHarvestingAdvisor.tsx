import React, { useState, useEffect } from "react";
import { UserFinancialState, InvestmentTransaction } from "../types";
import { 
  AlertCircle, CheckCircle2, TrendingUp, Sparkles, 
  HelpCircle, ArrowRight, ShieldCheck, Scale, Info, Calendar, Sliders, Plus 
} from "lucide-react";

interface TaxHarvestingAdvisorProps {
  financialState: UserFinancialState;
  setFinancialState: React.Dispatch<React.SetStateAction<UserFinancialState>>;
}

export default function TaxHarvestingAdvisor({ financialState, setFinancialState }: TaxHarvestingAdvisorProps) {
  // Simulator State: User can simulate different seasons to trigger the alert
  const [simulationMonth, setSimulationMonth] = useState<"may" | "november">("november");
  const [realizedLtcgThisYear, setRealizedLtcgThisYear] = useState<number>(30000);
  
  const transactions = financialState.investmentTransactions || [];
  
  // Date calculations
  const referenceDateStr = "2026-05-27";
  const refDate = new Date(referenceDateStr);
  const getHoldingPeriodMonths = (dateStr: string): number => {
    const pDate = new Date(dateStr);
    const yearsDiff = refDate.getFullYear() - pDate.getFullYear();
    const monthsDiff = refDate.getMonth() - pDate.getMonth();
    return yearsDiff * 12 + monthsDiff;
  };

  // Compute total unrealized equity LTCG dynamically!
  const totalUnrealizedLtcg = transactions
    .filter(t => t.assetType === "equity" && getHoldingPeriodMonths(t.purchaseDate) > 12)
    .reduce((sum, t) => sum + (t.currentPrice - t.purchasePrice) * t.units, 0);
  
  const ltcgExemptionLimit = 125000; // Budget 2024 limit
  const remainingExemptionHeadroom = Math.max(0, ltcgExemptionLimit - realizedLtcgThisYear);

  // Harvesting Slider state: defaults to harvesting maximum possible headroom
  const [harvestAmount, setHarvestAmount] = useState<number>(0);

  // Keep slider state in sync with loaded transactions
  useEffect(() => {
    setHarvestAmount(Math.min(totalUnrealizedLtcg, remainingExemptionHeadroom));
  }, [totalUnrealizedLtcg, remainingExemptionHeadroom]);

  // Calculations
  const taxSavedNow = Math.round(harvestAmount * 0.10); // 10% tax rate
  const futureCostBasisReset = harvestAmount;

  const handleLoadDemoPortfolio = () => {
    const demoTransactions: InvestmentTransaction[] = [
      {
        id: "it1",
        assetName: "Parag Parikh Flexi Cap Fund (Equity)",
        assetType: "equity",
        purchaseDate: "2024-11-12",
        purchasePrice: 62.5,
        units: 2400,
        currentPrice: 94.8
      },
      {
        id: "it2",
        assetName: "Mirae Asset Large Cap Fund (Equity)",
        assetType: "equity",
        purchaseDate: "2025-03-05",
        purchasePrice: 110.0,
        units: 1500,
        currentPrice: 152.4
      },
      {
        id: "it3",
        assetName: "Nifty 50 Index Fund (Equity Direct)",
        assetType: "equity",
        purchaseDate: "2026-01-20",
        purchasePrice: 210.0,
        units: 1000,
        currentPrice: 228.5
      },
      {
        id: "it4",
        assetName: "HDFC Small Cap Fund (Equity)",
        assetType: "equity",
        purchaseDate: "2023-11-20",
        purchasePrice: 85.0,
        units: 1200,
        currentPrice: 142.5
      },
      {
        id: "it5",
        assetName: "ICICI Prudential Debt Direct Fund (Debt)",
        assetType: "debt",
        purchaseDate: "2024-05-10",
        purchasePrice: 100.0,
        units: 4000,
        currentPrice: 115.2
      },
      {
        id: "it6",
        assetName: "Nippon India Low Duration Fund (Debt)",
        assetType: "debt",
        purchaseDate: "2023-01-15",
        purchasePrice: 100.0,
        units: 5000,
        currentPrice: 124.6
      },
      {
        id: "it7",
        assetName: "Nippon India Gold ETF (Gold)",
        assetType: "gold",
        purchaseDate: "2024-08-15",
        purchasePrice: 50.0,
        units: 3000,
        currentPrice: 62.4
      },
      {
        id: "it8",
        assetName: "Motilal Oswal Nasdaq 100 FOF (Intl)",
        assetType: "intl",
        purchaseDate: "2024-10-02",
        purchasePrice: 100.0,
        units: 2000,
        currentPrice: 110.8
      }
    ];

    setFinancialState(prev => ({
      ...prev,
      investmentTransactions: demoTransactions
    }));
  };

  const handleAddSampleTrade = () => {
    const sampleTrade: InvestmentTransaction = {
      id: "it_sample_" + Date.now(),
      assetName: "Axis Long Term Equity Fund (ELSS Equity)",
      assetType: "equity",
      purchaseDate: "2024-12-05",
      purchasePrice: 80.0,
      units: 1000,
      currentPrice: 118.5
    };

    setFinancialState(prev => ({
      ...prev,
      investmentTransactions: [...(prev.investmentTransactions || []), sampleTrade]
    }));
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500 font-bold bg-slate-100 px-2.5 py-1 rounded-md">
            AI Tax Suite
          </span>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight mt-2">
            Tax Harvesting Advisor
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-light max-w-xl">
            Saves you money by booking up to ₹1.25 Lakhs of tax-free capital gains each year, immediately reinvesting to reset your cost basis.
          </p>
        </div>

        {/* Season Simulator Toggle */}
        <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200 shrink-0">
          <button
            type="button"
            onClick={() => setSimulationMonth("may")}
            className={`px-3 py-1.5 text-[10px] font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
              simulationMonth === "may" ? "bg-white text-slate-900 shadow-xxs" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <Calendar className="w-3 h-3 text-slate-400" />
            May 27 (Planning)
          </button>
          <button
            type="button"
            onClick={() => setSimulationMonth("november")}
            className={`px-3 py-1.5 text-[10px] font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
              simulationMonth === "november" ? "bg-white text-slate-900 shadow-xxs" : "text-slate-550"
            }`}
          >
            <Sparkles className="w-3 h-3 text-amber-500 animate-pulse" />
            Nov 15 (Harvesting Season!)
          </button>
        </div>
      </div>

      {/* Harvesting Content or Clean Slate Option */}
      {transactions.length === 0 ? (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-8 md:p-10 shadow-[0_2px_12px_rgba(0,0,0,0.03)] text-center space-y-6 max-w-xl mx-auto">
          <div className="w-16 h-16 bg-slate-50 text-slate-700 rounded-full flex items-center justify-center mx-auto border border-slate-100 shadow-xxs">
            <Sliders className="w-7 h-7 text-amber-500 animate-pulse" />
          </div>
          
          <div className="space-y-2">
            <h3 className="font-sans font-bold text-sm text-slate-800 uppercase tracking-wider">
              No Investment Transactions Loaded
            </h3>
            <p className="text-xxs text-slate-555 max-w-md mx-auto leading-relaxed font-light">
              Your AI Tax Harvesting Advisor computes tax-free profit booking parameters from your transaction history. To see it in action, you can instantly populate a sample ledger or add a sample trade manually!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3.5 justify-center">
            <button
              onClick={handleLoadDemoPortfolio}
              className="px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-amber-350 animate-bounce" />
              Load Sample Demo Portfolio
            </button>
            <button
              onClick={handleAddSampleTrade}
              className="px-5 py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-xxs"
            >
              <Plus className="w-4 h-4 text-slate-555" />
              Add Sample Trade
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Advisor Notification Alert Banner */}
          {simulationMonth === "november" ? (
            <div className="bg-slate-900 text-white rounded-3xl p-6 relative overflow-hidden shadow-sm border border-slate-850">
              <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl" />
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-2xl shrink-0 mt-0.5 border border-amber-500/10">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </div>
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-amber-400">
                      Active Advisor Alert: Tax Harvesting Window Open
                    </h4>
                    <span className="bg-amber-400 text-slate-950 text-[8px] px-1.5 py-0.5 font-bold rounded uppercase">
                      Action Prompt
                    </span>
                  </div>
                  <p className="text-xxs text-slate-350 leading-relaxed font-light">
                    We are currently in the mid-fiscal harvesting window (October/November). You have accumulated <strong>₹{totalUnrealizedLtcg.toLocaleString("en-IN")}</strong> in unrealized LTCG gains. Since you have only booked ₹{realizedLtcgThisYear.toLocaleString("en-IN")} in capital gains so far, you have <strong>₹{remainingExemptionHeadroom.toLocaleString("en-IN")}</strong> in tax-free exemption headroom remaining before March 31.
                    <br />
                    <span className="font-semibold text-white">Recommended Action:</span> Sell and immediately buy back (reinvest) <strong>₹{Math.min(totalUnrealizedLtcg, remainingExemptionHeadroom).toLocaleString("en-IN")}</strong> of your Parag Parikh Flexi Cap or Mirae Asset holdings. This resets your cost basis to today's price, escaping tax on current gains entirely and protecting future appreciation from taxation!
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 text-slate-900 rounded-3xl p-6 relative overflow-hidden shadow-xxs">
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-slate-100 text-slate-555 rounded-2xl shrink-0 mt-0.5">
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-slate-500">
                      Tax Harvesting Season: Quiet Planning Phase
                    </h4>
                    <span className="bg-slate-100 text-slate-500 text-[8px] px-1.5 py-0.5 font-bold rounded uppercase">
                      Inactive
                    </span>
                  </div>
                  <p className="text-xxs text-slate-500 leading-relaxed font-light">
                    We are currently in May. Capital gains harvesting transactions are normally timed around October/November to let your compounding assets run maximum velocity before evaluating margins. No immediate selling action is required. We will alert you in October when the harvesting season begins!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Aggregate Metrics Panel */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-xxs">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold">Unrealized Equity LTCG</span>
              <p className="text-lg font-bold text-slate-900 mt-2">₹{totalUnrealizedLtcg.toLocaleString("en-IN")}</p>
              <span className="text-[9px] text-slate-450 mt-4 block">
                Long-term compounding gains (held &gt; 12 mo)
              </span>
            </div>

            <div className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-xxs">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold">Already Realized Gains</span>
              <p className="text-lg font-bold text-slate-850 mt-2">₹{realizedLtcgThisYear.toLocaleString("en-IN")}</p>
              <div className="space-y-1.5 mt-3">
                <label className="text-[8px] text-slate-450 font-mono uppercase block">Adjust realized gains (₹)</label>
                <input 
                  type="range"
                  min={0}
                  max={150000}
                  step={10000}
                  value={realizedLtcgThisYear}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setRealizedLtcgThisYear(val);
                    setHarvestAmount(Math.min(totalUnrealizedLtcg, Math.max(0, ltcgExemptionLimit - val)));
                  }}
                  className="w-full accent-slate-900 cursor-pointer h-0.5 bg-slate-200 rounded-lg appearance-none"
                />
              </div>
            </div>

            <div className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-xxs">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold">Remaining Exemption Headroom</span>
              <p className="text-lg font-bold text-emerald-650 mt-2">₹{remainingExemptionHeadroom.toLocaleString("en-IN")}</p>
              <span className="text-[9px] text-slate-450 mt-4 block">
                Exemption limit: ₹1,25,000/yr (Budget 2024)
              </span>
            </div>
          </div>

          {/* Simulator Slider Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Interactive Card (7 cols) */}
            <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-3xl p-5 md:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-6">
              <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100">
                <Sliders className="w-4 h-4 text-slate-700" />
                <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-slate-800">
                  Interactive Harvesting Simulator
                </h3>
              </div>

              <div className="space-y-4">
                <p className="text-xxs text-slate-500 font-light leading-relaxed">
                  Drag the slider to choose how much unrealized LTCG you wish to harvest (book profits & reinvest). This simulates the exact tax savings today and shows how much your future purchase cost basis is adjusted.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between bg-slate-50 border border-slate-200/60 p-3 rounded-2xl">
                    <span className="text-xs font-medium text-slate-500">Unrealized LTCG to Harvest:</span>
                    <span className="text-sm font-bold text-slate-900">₹{harvestAmount.toLocaleString("en-IN")}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={Math.min(totalUnrealizedLtcg, remainingExemptionHeadroom)}
                    step={5000}
                    value={harvestAmount}
                    onChange={(e) => setHarvestAmount(Number(e.target.value))}
                    className="w-full accent-slate-900 cursor-pointer h-1 bg-slate-200 rounded-lg appearance-none"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>₹0 (No harvest)</span>
                    <span>₹{Math.round(Math.min(totalUnrealizedLtcg, remainingExemptionHeadroom) / 2).toLocaleString("en-IN")}</span>
                    <span>₹{Math.min(totalUnrealizedLtcg, remainingExemptionHeadroom).toLocaleString("en-IN")} (Max Optimal)</span>
                  </div>
                </div>
              </div>

              {/* Action Simulation Output Card */}
              <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-4 border border-slate-800">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 font-mono">
                  Simulation Results (Active Harvesting)
                </h4>
                
                <div className="grid grid-cols-2 gap-4 text-xs font-sans">
                  <div className="space-y-1">
                    <span className="text-[9px] text-slate-400 block font-mono uppercase">Immediate Tax Saved Today</span>
                    <span className="text-base font-extrabold text-emerald-400">₹{taxSavedNow.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] text-slate-400 block font-mono uppercase">Future Cost Basis Bump-up</span>
                    <span className="text-base font-extrabold text-slate-200">+ ₹{futureCostBasisReset.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                <p className="text-[9px] text-slate-400 leading-relaxed font-light">
                  By selling ₹{harvestAmount.toLocaleString("en-IN")} in profits and immediately rebuying, you lock in a higher cost basis. Because this gain falls under your annual tax-free ₹1.25L exemption, you pay <strong>₹0 tax on it today</strong>, saving you <strong>₹{taxSavedNow.toLocaleString("en-IN")}</strong> in future capital gains taxes!
                </p>
              </div>
            </div>

            {/* Right Explanation Card (5 cols) */}
            <div className="lg:col-span-5 bg-white border border-slate-200/60 rounded-3xl p-5 shadow-xxs space-y-4">
              <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-slate-800">
                What is Tax Harvesting?
              </h4>
              
              <div className="space-y-4 text-xxs text-slate-500 font-light leading-relaxed">
                <p>
                  Under Indian tax laws, Equity Long-Term Capital Gains (LTCG) are tax-free up to ₹1.25 Lakhs per financial year. 
                </p>
                <div>
                  <span className="font-bold text-slate-800 block">The Harvesting Strategy:</span>
                  <p className="mt-0.5">
                    If you have unrealized long-term gains, they are "locked" on paper. If you hold them and sell them years later in a single lump sum, the gains will likely breach the ₹1.25L threshold, attracting a 10% tax.
                  </p>
                </div>
                <div>
                  <span className="font-bold text-slate-800 block">How it works:</span>
                  <p className="mt-0.5">
                    Each October/November, you sell a portion of your funds to "realize" up to the tax-free limit (₹1.25L minus any other realized gains). You immediately buy the same fund back. Your holding stays the same, but your cost basis is reset to the current higher price, legally avoiding future tax!
                  </p>
                </div>
              </div>
            </div>

          </div>
        </>
      )}

      {/* SEBI Compliance Disclaimer Callout */}
      <div className="p-4 bg-amber-55/35 border border-amber-200/50 rounded-2xl flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-[10px] text-amber-800 font-light leading-relaxed">
          <strong className="font-semibold">Educational Disclaimer:</strong> This tax harvesting advisor acts as a mock simulation tool to demonstrate how cost-basis adjustments function under standard Section 112A capital gains structures. Actual harvesting needs to factor in exit loads (charged by mutual funds for redemptions within 1 year), brokerages, buy-sell spreads, and other assets sold during the fiscal year. Date-level trade settlements must occur properly. Consult a certified Chartered Accountant (CA) or tax professional before initiating actual buy-back trades.
        </p>
      </div>

    </div>
  );
}
