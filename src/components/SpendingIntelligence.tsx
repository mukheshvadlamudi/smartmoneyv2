import React, { useState } from "react";
import { UserFinancialState, Transaction } from "../types";
import { 
  Sparkles, Coffee, ShoppingBag, Joystick, Moon, Heart, Compass, 
  TrendingUp, RefreshCw, PlusCircle, AlertCircle, Info, Trash2,
  Smartphone, Wallet, CheckCircle2, Home
} from "lucide-react";

interface SpendingIntelligenceProps {
  financialState: UserFinancialState;
  setFinancialState: React.Dispatch<React.SetStateAction<UserFinancialState>>;
}

export default function SpendingIntelligence({ financialState, setFinancialState }: SpendingIntelligenceProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [customCategory, setCustomCategory] = useState("");
  const [newTx, setNewTx] = useState({
    merchant: "",
    category: "Food & Dining",
    amount: 500,
    emotionalContext: "normal" as "" | Transaction["emotionalContext"],
    paymentMethod: "GPay" as "GPay" | "Cash"
  });

  const handleDeleteTransaction = (id: string) => {
    setFinancialState(prev => {
      const targetTx = prev.transactions.find(t => t.id === id);
      if (!targetTx) return prev;
      return {
        ...prev,
        transactions: prev.transactions.filter(t => t.id !== id),
        spending: Math.max(20000, prev.spending - targetTx.amount) // decrease baseline spending
      };
    });
  };

  const handleAddTransactionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTx.merchant.trim()) return;

    const finalCategory = newTx.category === "Custom Tag..." 
      ? (customCategory.trim() || "Custom Outlay") 
      : newTx.category;

    const created: Transaction = {
      id: "tx_" + Date.now(),
      date: new Date().toISOString().split("T")[0],
      merchant: newTx.merchant,
      category: finalCategory,
      amount: Number(newTx.amount),
      emotionalContext: newTx.emotionalContext || "normal",
      paymentMethod: newTx.paymentMethod
    };

    setFinancialState(prev => {
      const nextSpend = prev.spending + created.amount;
      // recalculating safe limits slightly depending on the added transactions
      const spendRatio = created.amount / 1000;
      return {
        ...prev,
        transactions: [created, ...prev.transactions],
        spending: nextSpend,
        safeSpendDaily: Math.max(200, prev.safeSpendDaily - Math.round(spendRatio * 20)),
        safeSpendWeekly: Math.max(1500, prev.safeSpendWeekly - Math.round(spendRatio * 150))
      };
    });

    setShowAddForm(false);
    setNewTx({
      merchant: "",
      category: "Food & Dining",
      amount: 500,
      emotionalContext: "normal",
      paymentMethod: "GPay"
    });
    setCustomCategory("");
  };

  const getEmotionalBadge = (context?: Transaction["emotionalContext"]) => {
    switch (context) {
      case "stress-spending":
        return <span className="px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xxs font-sans font-medium">Stress Compensated</span>;
      case "impulse":
        return <span className="px-2 py-0.5 rounded-full bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E] text-xxs font-sans font-medium">Impulse Buy</span>;
      case "weekend-spikes":
        return <span className="px-2 py-0.5 rounded-full bg-blue-50 border border-blue-100 text-blue-800 text-xxs font-sans font-medium">Weekend Surge</span>;
      case "planned":
        return <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xxs font-sans font-medium">Intentional</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full bg-slate-50 border border-slate-200 text-slate-500 text-xxs font-sans font-medium">Baseline Normal</span>;
    }
  };

  const categories = [
    { key: "Food & Dining", color: "bg-amber-100 text-amber-700 hover:bg-amber-200" },
    { key: "Groceries", color: "bg-emerald-100 text-emerald-800 hover:bg-emerald-200" },
    { key: "Rent & Housing", color: "bg-indigo-100 text-indigo-700 hover:bg-indigo-200" },
    { key: "Utilities & Bills", color: "bg-slate-100 text-slate-700 hover:bg-slate-200" },
    { key: "Entertainment", color: "bg-rose-100 text-rose-700 hover:bg-rose-200" },
    { key: "Transport", color: "bg-blue-100 text-blue-700 hover:bg-blue-200" },
    { key: "Self Care", color: "bg-purple-100 text-purple-700 hover:bg-purple-200" },
  ];

  const gpayTotal = financialState.transactions
    .filter(t => !t.paymentMethod || t.paymentMethod === "GPay")
    .reduce((acc, t) => acc + t.amount, 0);

  const cashTotal = financialState.transactions
    .filter(t => t.paymentMethod === "Cash")
    .reduce((acc, t) => acc + t.amount, 0);

  const totalSpent = gpayTotal + cashTotal;
  const cashPercent = totalSpent > 0 ? Math.round((cashTotal / totalSpent) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-slate-400 font-mono">Behavioral Intelligence</span>
          <h2 className="text-2xl font-sans tracking-tight font-medium text-slate-800">Spending Patterns & Anomalies</h2>
          <p className="text-slate-500 text-sm font-light mt-1">Smart Money classifies outlays based on emotional state profiles rather than traditional basic rigid categories.</p>
        </div>

        <button
          onClick={() => setShowAddForm(prev => !prev)}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-full flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          {showAddForm ? "Collapse Tracker" : "Log Discretionary Outlay"}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddTransactionSubmit} className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-md grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs text-slate-400 font-semibold uppercase font-mono">Merchant / Store</label>
            <input 
              type="text" 
              placeholder="e.g., Apple Store, Starbucks, Swiggy"
              value={newTx.merchant}
              onChange={(e) => setNewTx({ ...newTx, merchant: e.target.value })}
              className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-slate-900 text-xs text-slate-800 font-medium"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-slate-400 font-semibold uppercase font-mono">Outlay category</label>
            <select
              value={newTx.category}
              onChange={(e) => setNewTx({ ...newTx, category: e.target.value })}
              className="w-full p-2.5 border border-slate-200 bg-white rounded-xl focus:outline-none text-xs text-slate-750 font-semibold"
            >
              {categories.map((cat) => (
                <option key={cat.key} value={cat.key}>{cat.key}</option>
              ))}
              <option value="Custom Tag...">Custom Tag...</option>
            </select>
            {newTx.category === "Custom Tag..." && (
              <input 
                type="text" 
                placeholder="Tag name (e.g. PG fees)"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                className="w-full mt-1.5 p-2 border border-slate-250 rounded-xl focus:outline-slate-900 text-xs text-slate-800 font-medium bg-slate-50/50 animate-fadeIn"
                required
              />
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-slate-400 font-semibold uppercase font-mono">Emotional Spark Context</label>
            <select
              value={newTx.emotionalContext}
              onChange={(e) => setNewTx({ ...newTx, emotionalContext: e.target.value as Transaction["emotionalContext"] })}
              className="w-full p-2.5 border border-slate-200 bg-white rounded-xl focus:outline-none text-xs text-slate-750"
            >
              <option value="normal">Calm / Normal / Baseline</option>
              <option value="stress-spending">Stress Compending / Tired Purchase</option>
              <option value="impulse">Impulse Spend / Sudden Ad Action</option>
              <option value="weekend-spikes">Weekend Surge Outing</option>
              <option value="planned">Planned / Fully Pre-intentional</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-slate-400 font-semibold uppercase font-mono">Payment Method</label>
            <select
              value={newTx.paymentMethod}
              onChange={(e) => setNewTx({ ...newTx, paymentMethod: e.target.value as "GPay" | "Cash" })}
              className="w-full p-2.5 border border-slate-200 bg-white rounded-xl focus:outline-none text-xs text-slate-750 font-semibold"
            >
              <option value="GPay">📱 UPI / GPay</option>
              <option value="Cash">💵 Cash</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-slate-400 font-semibold uppercase font-mono">Amount (₹)</label>
            <div className="relative">
              <input 
                type="number" 
                value={newTx.amount}
                onChange={(e) => setNewTx({ ...newTx, amount: parseInt(e.target.value) || 0 })}
                className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-slate-900 text-xs text-slate-800 font-mono font-semibold"
                required
              />
              <button 
                type="submit"
                className="absolute right-1 top-1 bottom-1 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xxs font-button cursor-pointer"
              >
                Log Outlay
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Behavioral Anomaly warnings */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-950 shadow-md">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4.5 h-4.5 text-indigo-300 animate-pulse" />
              <h3 className="font-semibold text-sm tracking-tight">AI Behavior Analysis</h3>
            </div>
            
            <p className="text-xs text-slate-300 font-light leading-relaxed mb-4">
              We parsed your last 7 disbursements. A distinct **weekend outlay cluster** (approx ₹2,370 on Swiggy and Blinkit snacks) shows a high correlation with Friday/Saturday wind-down routines.
            </p>

            <div className="p-3.5 bg-white/5 border border-white/10 rounded-xl space-y-2.5">
              <div className="flex justify-between items-center text-xxs font-mono text-slate-400">
                <span>Dynamic Trigger alert</span>
                <span className="text-amber-400 font-semibold">• High</span>
              </div>
              <p className="text-slate-250 text-xxs font-light leading-relaxed">
                "Specialty Coffee outlays have risen 18% compared to the prior monthly cycle, predominantly triggered during late office stress windows."
              </p>
            </div>
          </div>

          {/* GPay vs Cash Leakage comparison */}
          <div className="bg-white border border-slate-200/60 rounded-3xl p-5 space-y-4 shadow-xs">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-800 font-mono border-b border-slate-100 pb-2 flex items-center gap-1.5">
              <Wallet className="w-3.5 h-3.5 text-slate-500" />
              Cash Leakage Audit
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 border border-slate-100/50 rounded-2xl text-left">
                <span className="text-[9px] text-slate-400 block font-mono font-semibold uppercase">📱 UPI / GPay</span>
                <span className="text-sm font-bold text-slate-800 font-mono block mt-1">₹{gpayTotal.toLocaleString()}</span>
                <span className="text-[9px] text-slate-500 font-mono mt-0.5 block">{totalSpent > 0 ? Math.round((gpayTotal / totalSpent) * 100) : 0}% share</span>
              </div>
              <div className="p-3 bg-rose-50/40 border border-rose-100/40 rounded-2xl text-left">
                <span className="text-[9px] text-rose-500 block font-mono font-semibold uppercase">💵 Untracked Cash</span>
                <span className="text-sm font-bold text-rose-600 font-mono block mt-1">₹{cashTotal.toLocaleString()}</span>
                <span className="text-[9px] text-rose-500 font-mono mt-0.5 block">{cashPercent}% share</span>
              </div>
            </div>
            
            {cashPercent > 10 ? (
              <div className="p-3 bg-rose-50 border border-rose-100 rounded-2xl flex gap-2 text-xxs text-rose-700 leading-relaxed font-light">
                <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                <p>
                  <strong>Leakage Alert:</strong> Your Cash leakage is {cashPercent}%. Small outlays (auto, local tea, street vendors) often escape tracking and drain your wallet. Use GPay or log Cash outlays instantly!
                </p>
              </div>
            ) : (
              <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-2xl flex gap-2 text-xxs text-emerald-700 leading-relaxed font-light">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <p>
                  <strong>Optimal tracking:</strong> Your Cash outlay ratio is safe at {cashPercent}%. UPI GPay tracking captured the majority of your cash flows digitally. Great job!
                </p>
              </div>
            )}
          </div>

          <div className="bg-white border border-slate-200/60 rounded-3xl p-6 space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono border-b border-slate-100 pb-2">Active Categories</h4>
            <div className="space-y-3.5">
              {[
                { label: "Food & Dining", share: 38, amount: "₹24,500", count: "12 times" },
                { label: "Groceries", share: 22, amount: "₹14,200", count: "5 times" },
                { label: "Entertainment", share: 18, amount: "₹11,600", count: "2 times" },
                { label: "Health & Fitness", share: 12, amount: "₹7,800", count: "2 times" },
                { label: "Self Care", share: 10, amount: "₹6,400", count: "1 time" },
              ].map((c, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-slate-750">{c.label}</span>
                    <span className="font-mono text-slate-500">{c.amount} ({c.share}%)</span>
                  </div>
                  <div className="w-full h-1 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                    <div className="h-full bg-slate-800" style={{ width: `${c.share}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Transactions List */}
        <div className="lg:col-span-2 bg-white border border-slate-200/60 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
              <h3 className="font-semibold text-sm text-slate-800">Linguistic Outlay Narrative Log</h3>
              <span className="text-xxs font-mono text-slate-400">7 disbursements scanned</span>
            </div>

            <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
              {financialState.transactions.map((t) => (
                <div key={t.id} className="p-3 bg-[#FBFBFD] border border-slate-100 hover:border-slate-200 rounded-xl flex items-center justify-between gap-4 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2.5 rounded-xl bg-slate-100/70 text-slate-800 shrink-0">
                      {t.category.match(/Rent|Housing|PG|Home/i) ? (
                        <Home className="w-4 h-4 text-indigo-600" />
                      ) : t.category.includes("Dining") || t.category.includes("Coffee") ? (
                        <Coffee className="w-4 h-4" />
                      ) : (
                        <ShoppingBag className="w-4 h-4" />
                      )}
                    </div>
                    <div className="truncate">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-800 block truncate text-xs">{t.merchant}</span>
                        {getEmotionalBadge(t.emotionalContext)}
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-semibold font-mono ${
                          t.paymentMethod === "Cash" ? "bg-rose-50 border border-rose-100 text-rose-700" : "bg-slate-100 border border-slate-200 text-slate-700"
                        }`}>
                          {t.paymentMethod === "Cash" ? "💵 Cash" : "📱 UPI"}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">{t.date} • {t.category}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-mono font-bold text-xs text-slate-800">₹{t.amount.toLocaleString()}</span>
                    <button 
                      onClick={() => handleDeleteTransaction(t.id)}
                      className="p-1 text-slate-350 hover:text-rose-500 rounded transition-colors"
                      title="Erase item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-xxs text-slate-400 font-light border-t border-slate-100 pt-4 mt-6 flex justify-between">
            <span>*Logging items recalculates your safe-to-spend allowances immediately to protect target limits.</span>
            <span className="font-mono">Real-time update active</span>
          </div>
        </div>

      </div>
    </div>
  );
}
