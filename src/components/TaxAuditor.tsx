import React from "react";
import { UserFinancialState, InvestmentTransaction } from "../types";
import { 
  AlertTriangle, CheckCircle2, TrendingUp, HelpCircle, 
  ArrowRight, ShieldCheck, Scale, Info, PieChart, Sparkles, AlertCircle, Plus 
} from "lucide-react";

interface TaxAuditorProps {
  financialState: UserFinancialState;
  setFinancialState: React.Dispatch<React.SetStateAction<UserFinancialState>>;
}

export default function TaxAuditor({ financialState, setFinancialState }: TaxAuditorProps) {
  const transactions = financialState.investmentTransactions || [];

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
  
  // Reference date: May 27, 2026
  const referenceDateStr = "2026-05-27";
  const refDate = new Date(referenceDateStr);

  // Helper to calculate difference in months
  const getHoldingPeriodMonths = (dateStr: string): number => {
    const pDate = new Date(dateStr);
    const yearsDiff = refDate.getFullYear() - pDate.getFullYear();
    const monthsDiff = refDate.getMonth() - pDate.getMonth();
    return yearsDiff * 12 + monthsDiff;
  };

  // Tax calculations per transaction
  const auditResults = transactions.map((t) => {
    const holdingMonths = getHoldingPeriodMonths(t.purchaseDate);
    const purchaseValue = t.purchasePrice * t.units;
    const currentValue = t.currentPrice * t.units;
    const gain = currentValue - purchaseValue;
    
    let taxCategory: "LTCG" | "STCG" | "Slab-Rate" | "Indexation-LTCG" = "STCG";
    let taxRateStr = "";
    let estimatedTax = 0;
    let explanation = "";
    let warningFlag = false;

    if (t.assetType === "equity") {
      if (holdingMonths > 12) {
        taxCategory = "LTCG";
        taxRateStr = "10% above ₹1.25L";
        explanation = "Held > 12 months. Taxed at 10% on cumulative equity LTCG gains exceeding ₹1.25 Lakhs.";
      } else {
        taxCategory = "STCG";
        taxRateStr = "20%";
        estimatedTax = Math.max(0, gain * 0.20);
        explanation = "Held <= 12 months. Taxed at a flat rate of 20% under Budget 2024 rules.";
      }
    } else if (t.assetType === "debt") {
      // Bought after April 1, 2023 (Section 50AA)
      if (t.purchaseDate >= "2023-04-01") {
        taxCategory = "Slab-Rate";
        taxRateStr = "Slab Rate (30%)";
        estimatedTax = Math.max(0, gain * 0.30); // Assumed 30% slab rate for ₹45L income profile
        explanation = "Bought after April 1, 2023. Under Section 50AA, all gains are treated as short-term and taxed at your slab rate, regardless of holding period.";
        warningFlag = true;
      } else {
        // Bought before April 1, 2023 and held > 36 months
        taxCategory = "Indexation-LTCG";
        taxRateStr = "20% with Indexation";
        // Estimate tax with nominal indexation benefit (say effective 12% tax)
        estimatedTax = Math.max(0, gain * 0.12);
        explanation = "Bought before April 1, 2023 and held > 36 months. Qualifies for indexation benefits taxed at 20% post-indexation.";
      }
    } else if (t.assetType === "gold" || t.assetType === "intl") {
      // Post-April 2023 rule under Section 50AA applies if equity exposure <= 35%
      if (t.purchaseDate >= "2023-04-01") {
        taxCategory = "Slab-Rate";
        taxRateStr = "Slab Rate (30%)";
        estimatedTax = Math.max(0, gain * 0.30);
        explanation = `Bought after April 1, 2023. Gains on Gold ETFs & Intl Mutual Funds are taxed at slab rate (${t.assetType === "gold" ? "Gold ETF" : "International FOF"} Post-April 2023 Section 50AA).`;
        warningFlag = true;
      } else {
        taxCategory = "STCG"; // fallback
        taxRateStr = "Slab Rate";
        estimatedTax = Math.max(0, gain * 0.30);
        explanation = "Taxed at slab rate.";
      }
    }

    return {
      ...t,
      holdingMonths,
      purchaseValue,
      currentValue,
      gain,
      taxCategory,
      taxRateStr,
      estimatedTax,
      explanation,
      warningFlag
    };
  });

  // Calculate Aggregates
  const totalCost = auditResults.reduce((sum, item) => sum + item.purchaseValue, 0);
  const totalValue = auditResults.reduce((sum, item) => sum + item.currentValue, 0);
  const totalGains = totalValue - totalCost;

  // Split equity LTCG to apply the ₹1.25L exemption limit
  const cumulativeEquityLtcg = auditResults
    .filter(item => item.assetType === "equity" && item.taxCategory === "LTCG")
    .reduce((sum, item) => sum + item.gain, 0);

  const equityLtcgExemption = 125000;
  const taxableEquityLtcg = Math.max(0, cumulativeEquityLtcg - equityLtcgExemption);
  const equityLtcgTax = taxableEquityLtcg * 0.10;

  // Cumulative other taxes
  const equityStcgTax = auditResults
    .filter(item => item.assetType === "equity" && item.taxCategory === "STCG")
    .reduce((sum, item) => sum + item.estimatedTax, 0);

  const slabTaxes = auditResults
    .filter(item => item.taxCategory === "Slab-Rate")
    .reduce((sum, item) => sum + item.estimatedTax, 0);

  const indexationLtcgTaxes = auditResults
    .filter(item => item.taxCategory === "Indexation-LTCG")
    .reduce((sum, item) => sum + item.estimatedTax, 0);

  const totalEstimatedTax = equityLtcgTax + equityStcgTax + slabTaxes + indexationLtcgTaxes;

  // Count items flagged as "slab rate debt trap"
  const flaggedGainsDebt = auditResults
    .filter(item => item.assetType === "debt" && item.warningFlag)
    .reduce((sum, item) => sum + item.gain, 0);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500 font-bold bg-slate-100 px-2.5 py-1 rounded-md">
          AI Tax Suite
        </span>
        <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight mt-2">
          LTCG/STCG Portfolio Tax Auditor
        </h2>
        <p className="text-xs text-slate-500 mt-1 font-light max-w-xl">
          Evaluate capital gains in your mutual funds and stocks. Your AI Auditor applies post-Budget 2024 rules and flags tax slabs on post-April 2023 debt assets.
        </p>
      </div>

      {/* Aggregate Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-xxs">
          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold">Total Portfolio Cost</span>
          <p className="text-lg font-bold text-slate-850 mt-2">₹{Math.round(totalCost).toLocaleString("en-IN")}</p>
          <span className="text-[9px] text-slate-450 mt-4 block">
            Original capital purchase basis
          </span>
        </div>

        <div className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-xxs">
          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold">Current Portfolio Value</span>
          <p className="text-lg font-bold text-slate-900 mt-2">₹{Math.round(totalValue).toLocaleString("en-IN")}</p>
          <span className="text-[9px] text-emerald-600 font-semibold mt-4 block">
            Unrealized gains: +₹{Math.round(totalGains).toLocaleString("en-IN")}
          </span>
        </div>

        <div className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-xxs">
          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold">Equity LTCG Exemption Headroom</span>
          <p className="text-lg font-bold text-indigo-650 mt-2">
            ₹{Math.max(0, equityLtcgExemption - cumulativeEquityLtcg).toLocaleString("en-IN")}
          </p>
          <span className="text-[9px] text-slate-450 mt-4 block leading-snug">
            ₹{cumulativeEquityLtcg.toLocaleString("en-IN")} LTCG accumulated (₹1.25L max free)
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xxs text-white">
          <span className="text-[10px] uppercase font-mono tracking-wider text-indigo-300 font-bold">Estimated Gains Tax Liability</span>
          <p className="text-lg font-bold text-emerald-400 mt-2">₹{Math.round(totalEstimatedTax).toLocaleString("en-IN")}</p>
          <span className="text-[9px] text-slate-350 mt-4 block">
            Aggregated post-Budget 2024 liability
          </span>
        </div>
      </div>

      {/* Debt Mutual Fund Slab Trap AI Warning Banner */}
      {flaggedGainsDebt > 0 && (
        <div className="bg-rose-50/30 border border-rose-200/60 text-slate-900 rounded-3xl p-6 relative overflow-hidden shadow-xxs">
          <div className="absolute right-0 top-0 w-32 h-32 bg-rose-500/5 rounded-full blur-2xl" />
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-rose-100 text-rose-600 rounded-2xl shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
            </div>
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-rose-800">
                  AI Auditor Warning: Specified Specified Debt Mutual Fund Slab Trap (Section 50AA)
                </h4>
                <span className="bg-rose-100 text-rose-800 text-[8px] px-1.5 py-0.5 font-bold rounded uppercase">
                  Audit Flag
                </span>
              </div>
              <p className="text-xxs text-slate-700 leading-relaxed font-light">
                Your portfolio contains <strong>₹{flaggedGainsDebt.toLocaleString("en-IN")}</strong> in unrealized gains from debt mutual funds purchased after April 1, 2023. Many investors assume these gains qualify for indexation benefits after 3 years, but **Section 50AA taxes these gains at your highest slab rate (30% for your salary bracket)**. This will incur an estimated tax of <strong>₹{Math.round(flaggedGainsDebt * 0.30).toLocaleString("en-IN")}</strong>. 
                <br />
                <span className="font-medium text-rose-800">Recommendation:</span> Consider timing redemptions in lower-income years, or allocate future debt investments towards Tax-Free Bonds or Arbitrage Mutual Funds (which are taxed as equity) to escape the slab trap!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Gains Ledger Table or Clean Slate Option */}
      {transactions.length === 0 ? (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-8 md:p-10 shadow-[0_2px_12px_rgba(0,0,0,0.03)] text-center space-y-6 max-w-xl mx-auto">
          <div className="w-16 h-16 bg-slate-50 text-slate-700 rounded-full flex items-center justify-center mx-auto border border-slate-100 shadow-xxs">
            <PieChart className="w-7 h-7 text-indigo-500 animate-pulse" />
          </div>
          
          <div className="space-y-2">
            <h3 className="font-sans font-bold text-sm text-slate-800 uppercase tracking-wider">
              No Investment Transactions Loaded
            </h3>
            <p className="text-xxs text-slate-550 max-w-md mx-auto leading-relaxed font-light">
              Your capital gains auditor uses date math and transaction histories to calculate LTCG/STCG, applying post-Budget 2024 thresholds. To test the system, you can instantly populate a sample ledger or add a sample trade manually!
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
        /* Gains Ledger Table */
        <div className="bg-white border border-slate-200/80 rounded-3xl shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-center gap-2">
              <PieChart className="w-4.5 h-4.5 text-slate-700" />
              <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-slate-800">
                Portfolio Assets & Gains Ledger
              </h3>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              Reference Date: May 27, 2026
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[9px] uppercase tracking-wider text-slate-400 font-mono">
                  <th className="py-3 px-5">Asset Name & Type</th>
                  <th className="py-3 px-4">Buy Date</th>
                  <th className="py-3 px-4 text-center">Holding Period</th>
                  <th className="py-3 px-4 text-right">Purchase Cost</th>
                  <th className="py-3 px-4 text-right">Current Value</th>
                  <th className="py-3 px-4 text-right">Unrealized Gain</th>
                  <th className="py-3 px-5 text-center">Tax Category & Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {auditResults.map((rec) => {
                  const assetTypeLabel = 
                    rec.assetType === "equity" ? "Equity Fund" :
                    rec.assetType === "debt" ? "Debt Fund" :
                    rec.assetType === "gold" ? "Gold ETF" : "Intl FOF";

                  const categoryColor = 
                    rec.taxCategory === "LTCG" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                    rec.taxCategory === "STCG" ? "bg-amber-50 text-amber-700 border-amber-100" :
                    rec.taxCategory === "Indexation-LTCG" ? "bg-blue-50 text-blue-700 border-blue-100" :
                    "bg-rose-50 text-rose-700 border-rose-100";

                  return (
                    <tr key={rec.id} className="hover:bg-slate-50/50 transition-colors">
                      {/* Name & Type */}
                      <td className="py-3.5 px-5">
                        <div className="font-semibold text-slate-855">{rec.assetName}</div>
                        <div className="text-[9px] text-slate-450 mt-0.5 font-mono uppercase">{assetTypeLabel}</div>
                      </td>
                      
                      {/* Buy Date */}
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">
                        {rec.purchaseDate}
                      </td>

                      {/* Holding Period */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="font-semibold text-slate-700 font-mono">{rec.holdingMonths}</span>
                        <span className="text-[10px] text-slate-400 font-light ml-0.5">mo</span>
                      </td>

                      {/* Cost */}
                      <td className="py-3.5 px-4 text-right font-mono text-slate-600">
                        ₹{Math.round(rec.purchaseValue).toLocaleString("en-IN")}
                      </td>

                      {/* Value */}
                      <td className="py-3.5 px-4 text-right font-mono text-slate-800 font-semibold">
                        ₹{Math.round(rec.currentValue).toLocaleString("en-IN")}
                      </td>

                      {/* Unrealized Gain */}
                      <td className={`py-3.5 px-4 text-right font-mono font-bold ${
                        rec.gain >= 0 ? "text-emerald-600" : "text-rose-600"
                      }`}>
                        {rec.gain >= 0 ? "+" : ""}
                        {Math.round(rec.gain).toLocaleString("en-IN")}
                      </td>

                      {/* Tax Category */}
                      <td className="py-3.5 px-5 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className={`px-2 py-0.5 border text-[9px] font-bold rounded-md ${categoryColor}`}>
                            {rec.taxCategory} ({rec.taxRateStr})
                          </span>
                          {rec.warningFlag && (
                            <span className="text-[8px] text-rose-500 font-semibold flex items-center gap-0.5">
                              <AlertTriangle className="w-2.5 h-2.5 shrink-0" />
                              Section 50AA Slab Trap
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tax Slabs Reference & Educational Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tax Law Summary */}
        <div className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-xxs space-y-4">
          <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <Scale className="w-4 h-4 text-indigo-500" />
            Capital Gains Rules (Post-Budget 2024)
          </h4>
          <ul className="space-y-2 text-xxs text-slate-500 font-light leading-relaxed">
            <li>
              <strong className="text-slate-700 font-bold">Equity LTCG:</strong> Gains on holding period &gt; 12 months. Taxed at <strong className="text-slate-700">10%</strong>. Exemption limit is <strong className="text-indigo-600 font-semibold">₹1.25 Lakhs per year</strong>.
            </li>
            <li>
              <strong className="text-slate-700 font-bold">Equity STCG:</strong> Gains on holding period &lt;= 12 months. Taxed at <strong className="text-slate-700">20%</strong>. No exemption threshold exists.
            </li>
            <li>
              <strong className="text-slate-700 font-bold">Debt Mutual Funds (Post-2023):</strong> Purchased on or after April 1, 2023. Under Section 50AA, 100% of gains are taxed at your <strong className="text-rose-600 font-bold">income slab rate (e.g. 30%)</strong>, fully losing indexation.
            </li>
            <li>
              <strong className="text-slate-700 font-bold">Debt Mutual Funds (Pre-2023):</strong> Purchased before April 1, 2023. Taxed at <strong className="text-slate-700">20% with indexation benefits</strong> if held over 3 years (36 months).
            </li>
          </ul>
        </div>

        {/* AI Tax Advice */}
        <div className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-xxs space-y-4">
          <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            AI Tax Auditor Strategy Advice
          </h4>
          <div className="space-y-3.5 text-xxs text-slate-550 leading-relaxed font-light">
            <div>
              <span className="font-bold text-slate-800 block">1. Leverage Arbitrage Funds</span>
              <p className="mt-0.5">
                Arbitrage mutual funds invest in stock-futures price differentials. They are classified as <span className="font-semibold text-emerald-600">Equity Assets</span> for tax purposes. They return returns similar to liquid debt funds (6.5% - 7.5%) but are taxed at only 10% (LTCG) instead of your 30% slab rate!
              </p>
            </div>
            <div>
              <span className="font-bold text-slate-800 block">2. Offset STCG with Harvesting Losses</span>
              <p className="mt-0.5">
                If you have short term capital losses in equity, you can offset them against equity short term capital gains to reduce your STCG liability during filing.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SEBI Compliance Disclaimer Callout */}
      <div className="p-4 bg-amber-55/35 border border-amber-200/50 rounded-2xl flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-[10px] text-amber-800 font-light leading-relaxed">
          <strong className="font-semibold">Educational Disclaimer:</strong> This capital gains auditor demonstrates the application of date math algorithms against mock investment records under standard Indian Income Tax provisions (including post-Budget 2024 schedules and Section 50AA guidelines). Actual tax outcomes during filing depend on multiple parameters (including Grandfathering clauses for assets bought before Jan 31, 2018, exact indexation indexes published by the IT department, and set-off boundaries). Surcharges are excluded. Always consult a licensed Chartered Accountant (CA) or certified tax specialist before filing or executing redemptions.
        </p>
      </div>

    </div>
  );
}
