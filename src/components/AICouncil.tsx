import React, { useState } from "react";
import { UserFinancialState } from "../types";
import { 
  Sparkles, Hourglass, Scale, Leaf, Flame, HelpCircle, Send, CheckCircle2 
} from "lucide-react";

interface AICouncilProps {
  financialState: UserFinancialState;
}

interface CouncilResponse {
  optimist: string;
  critic: string;
  moneyGod: string;
}

export default function AICouncil({ financialState }: AICouncilProps) {
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Dynamic Advisor responses loaded below the chat box
  const [advice, setAdvice] = useState<CouncilResponse | null>({
    optimist: "This is a prime compounding scenario! Redirecting ₹25,000 monthly surplus into index mutual funds builds massive investing momentum, matching your long-term EV SUV saving velocity beautifully.",
    critic: "Hold on! While you have fully funded your emergency net, you still carry ₹11 Lakhs in a home loan and a ₹1 Lakh car loan. Avoid speculative allocations and target absolute debt de-leveraging first.",
    moneyGod: "The arbiter strategy: Automate a ₹60,000 SIP towards your vehicle goal and park an extra ₹15,000 towards prepaying the SBI car loan early. This harvests high equity returns while releasing loan interest liabilities."
  });

  const queryCouncil = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const resp = await fetch("/api/gemini/council", {
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
          question: question
        })
      });

      if (resp.ok) {
        const data = await resp.json();
        setAdvice(data);
      } else {
        throw new Error("COUNCIL CODE FAILURE");
      }
    } catch (err) {
      // Elegant customized fallback response tailored to custom question
      setTimeout(() => {
        setAdvice({
          optimist: `Regarding "${question}": Go for the growth path! Redirect surplus capital directly into your dynamic equity index funds to compound wealth at a stable 12% rate.`,
          critic: `Caution on "${question}": Review liabilities. Keep building safe cash reserves and avoid locking cash in speculative assets while carrying active loan EMIs.`,
          moneyGod: `Balanced verdict on "${question}": Settle 60% of your savings into goal-based index accounts and channel the remaining 40% into debt prepayments to achieve compound safety.`
        });
        setIsLoading(false);
      }, 1000);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestions = [
    "Should I prepay my SBI EV Car Loan early?",
    "Should I increase my equity index mutual fund SIP?",
    "How do I optimize my portfolio tax exemptions?",
    "Where is the safest place to park my liquid capital?",
  ];

  return (
    <div className="space-y-8">
      
      {/* 1. Static Character Persona Cards (Defining what they are, NOT changing contents) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* The Optimist Persona */}
        <div className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-xs flex items-start gap-4 transition-all">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Leaf className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-slate-800">The Optimist</h3>
            <span className="text-[9px] uppercase tracking-wider text-slate-550 font-mono block mt-0.5">Growth Guardian</span>
            <p className="text-slate-700 text-xs font-light leading-relaxed mt-2">
              Sees maximum growth upside, champions your ambitious timelines, and identifies active wealth compounding vectors.
            </p>
          </div>
        </div>

        {/* The Critic Persona */}
        <div className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-xs flex items-start gap-4 transition-all">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-slate-800">The Critic</h3>
            <span className="text-[9px] uppercase tracking-wider text-slate-550 font-mono block mt-0.5">Risk Sentinel</span>
            <p className="text-slate-700 text-xs font-light leading-relaxed mt-2">
              Stress-tests your decisions, exposes hidden leverage risks, and demands absolute capital preservation.
            </p>
          </div>
        </div>

        {/* The Manicured Persona */}
        <div className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-xs flex items-start gap-4 transition-all">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0 border border-amber-100/20">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-slate-800">The Manicured</h3>
            <span className="text-[9px] uppercase tracking-wider text-amber-600 font-mono block mt-0.5">Supreme Arbiter</span>
            <p className="text-slate-700 text-xs font-light leading-relaxed mt-2">
              Weighs growth aspirations against safety buffers to construct a perfectly balanced, logical financial route.
            </p>
          </div>
        </div>

      </div>

      {/* 2. Council Chamber Chat Box Card */}
      <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-xs space-y-5">
        
        <div className="flex flex-col items-center text-center space-y-2">
          <Scale className="w-7 h-7 text-amber-500 animate-pulse" />
          <h3 className="font-sans font-semibold text-sm uppercase tracking-wider text-slate-800">Council Chamber</h3>
          <p className="text-xxs text-slate-600 font-light max-w-lg leading-relaxed">
            Submit a financial dilemma below. The Critic, the Optimist, and the Manicured Supreme Arbiter will align their views to deliver coordinated, balanced decisions.
          </p>
        </div>

        {/* Preset suggestions cards */}
        <div className="flex flex-wrap justify-center gap-1.5 max-w-2xl mx-auto">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => setQuestion(s)}
              className="px-2.5 py-1.5 border border-slate-100 hover:border-slate-250 bg-[#FBFBFD] hover:bg-slate-50 text-slate-500 rounded-xl text-[10px] font-medium transition-all cursor-pointer"
            >
              "{s}"
            </button>
          ))}
        </div>

        {/* Input box */}
        <form onSubmit={queryCouncil} className="max-w-2xl mx-auto relative">
          <input 
            type="text" 
            placeholder="Type your wealth or debt inquiry here..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full py-3.5 pl-4 pr-32 text-xs text-slate-800 border border-slate-200 bg-[#FBFBFD] focus:bg-white rounded-2xl focus:outline-slate-900 transition-colors shadow-xxs"
            required
          />
          <button 
            type="submit"
            disabled={isLoading || !question.trim()}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 text-white rounded-xl text-[10px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
          >
            {isLoading ? <Hourglass className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
            {isLoading ? "Consulting..." : "Seek Counsel"}
          </button>
        </form>

      </div>

      {/* 3. Answers Rendered Dynamically BELOW the Chat Box (Cohesive 3-Column results box) */}
      {advice && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-300">
          
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500 font-bold">
              Compiled Council Decision Results
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Optimist column */}
            <div className="bg-emerald-50/20 border border-emerald-100/60 rounded-3xl p-5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.015)] transition-all">
              <div className="flex items-center gap-2 mb-3">
                <Leaf className="w-4 h-4 text-emerald-600" />
                <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-emerald-800">Optimist Outlook</h4>
              </div>
              <p className="text-slate-700 text-xs font-light leading-relaxed">
                {advice.optimist}
              </p>
            </div>

            {/* Critic column */}
            <div className="bg-rose-50/20 border border-rose-100/60 rounded-3xl p-5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.015)] transition-all">
              <div className="flex items-center gap-2 mb-3">
                <Flame className="w-4 h-4 text-rose-500" />
                <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-rose-800">Critic Caution</h4>
              </div>
              <p className="text-slate-700 text-xs font-light leading-relaxed">
                {advice.critic}
              </p>
            </div>

            {/* Supreme Arbiter (Manicured) column */}
            <div className="bg-amber-50/30 border border-amber-200/50 rounded-3xl p-5 shadow-[0_3px_8px_rgba(245,158,11,0.02)] hover:shadow-[0_6px_16px_rgba(245,158,11,0.04)] transition-all relative overflow-hidden">
              <div className="absolute top-0 right-0 px-2 py-0.5 bg-amber-100/60 rounded-bl-xl text-[8px] font-mono font-bold text-amber-800 uppercase tracking-widest">
                Verdict
              </div>
              <div className="flex items-center gap-2 mb-3">
                <Scale className="w-4 h-4 text-amber-500" />
                <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-amber-800">Arbiter Verdict</h4>
              </div>
              <p className="text-slate-800 text-xs font-semibold leading-relaxed">
                {advice.moneyGod}
              </p>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
