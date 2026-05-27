import React, { useState } from "react";
import { 
  PiggyBank, ArrowRight, ShieldCheck, TrendingUp, Sparkles, 
  HelpCircle, Lightbulb, Compass, Zap, Layers, Landmark 
} from "lucide-react";
import { motion } from "motion/react";

interface OnboardingData {
  goals: string[];
  risk: string;
  income: number;
  expenses: number;
  debts: number;
  priority: string;
  name: string;
  isDemo?: boolean;
}

interface LandingPageProps {
  onCompleteOnboarding: (data: OnboardingData) => void;
}

export default function LandingPage({ onCompleteOnboarding }: LandingPageProps) {
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingData>({
    name: "Mukhesh",
    goals: ["emergency", "vacation"],
    risk: "balanced",
    income: 375000,
    expenses: 120000,
    debts: 3500000,
    priority: "stability"
  });

  const handleStartOnboarding = () => {
    setIsOnboarding(true);
    setStep(1);
  };

  // Skip Onboarding directly loads with premium default mock values (Demo Mode)
  const handleSkipOnboarding = () => {
    onCompleteOnboarding({
      name: "Mukhesh",
      goals: ["emergency", "vacation"],
      risk: "balanced",
      income: 375000,
      expenses: 120000,
      debts: 3500000,
      priority: "stability",
      isDemo: true
    });
  };

  const nextStep = () => {
    if (step < 8) {
      setStep(prev => prev + 1);
    } else {
      onCompleteOnboarding({ ...formData, isDemo: false });
    }
  };

  const prevStep = () => {
    if (step > 1) setStep(prev => prev - 1);
  };

  const goalsList = [
    { key: "emergency", label: "Build a 12-month Emergency Fund", desc: "Keep critical cash reserves safe" },
    { key: "vacation", label: "Plan a Luxury Family Vacation", desc: "Save for travel without guilt" },
    { key: "vehicle", label: "Buy a Premium EV SUV", desc: "Allocate capital for asset creation" },
    { key: "debt", label: "Settle outstanding Loans", desc: "Clear liabilities to lock in financial freedom" },
    { key: "retirement", label: "Start compound investing", desc: "Leverage steady long-term mutual growth" }
  ];

  return (
    <div className="relative min-h-screen bg-[#FBFBFD] text-[#1D1D1F] overflow-x-hidden transition-colors duration-500 font-sans">
      
      {/* Landing Page Branding Header (by Futurelab Studios) */}
      {!isOnboarding && (
        <header className="absolute top-0 left-0 right-0 px-8 py-5 flex justify-between items-center z-20 max-w-5xl mx-auto w-full">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white shrink-0 shadow-sm">
              <Landmark className="w-4 h-4" />
            </div>
            <div>
              <h1 className="font-sans font-semibold text-[12px] tracking-wide text-slate-900 leading-none">Smart Money</h1>
              <span className="text-[8px] text-slate-500 font-bold tracking-wider mt-0.5 block uppercase">by FutureLab Studios</span>
            </div>
          </div>
        </header>
      )}

      {/* Background radial soft light gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-[#EDF2F7] to-transparent opacity-40 blur-3xl pointer-events-none" />

      {/* Hero content */}
      {!isOnboarding ? (
        <div className="flex flex-col items-center justify-center min-h-[92vh] max-w-5xl mx-auto px-6 text-center z-10 relative pt-16">
          
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200/60 shadow-sm text-xs font-medium text-slate-650 mb-8"
          >
            <Sparkles className="w-3.5 h-3.5 text-slate-700 animate-pulse" />
            <span>Smart wealth tracking and predictive projections</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-sans tracking-tight text-slate-900 font-medium leading-[1.1] mb-6"
          >
            Manage your money. <br />
            <span className="font-semibold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500 bg-clip-text text-transparent">Simply and beautifully.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-base sm:text-lg text-slate-550 max-w-2xl mx-auto mb-12 font-light leading-relaxed"
          >
            Track your investments, project your future cash runways, simulate major expense decisions, and consult the three-person advice board in a clean, quiet dashboard.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 justify-center"
          >
            <button 
              onClick={handleStartOnboarding}
              className="group px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-full font-medium transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2 border border-slate-950 text-xs uppercase tracking-wider font-semibold"
            >
              Get Started
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
            
            <button 
              onClick={handleSkipOnboarding}
              className="px-8 py-4 text-slate-600 hover:text-slate-900 transition-colors bg-white hover:bg-slate-50 border border-slate-200 rounded-full font-semibold text-xs uppercase tracking-wider"
            >
              Skip to Dashboard (Demo)
            </button>
          </motion.div>

          {/* Core Previews */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mt-24 text-left border-t border-slate-200/60 pt-16">
            <div className="p-6 bg-white border border-slate-200/50 rounded-2xl shadow-xs">
              <Compass className="w-8 h-8 text-indigo-500/80 mb-4" />
              <h3 className="font-semibold text-sm mb-2 text-slate-800 uppercase tracking-wider">1. Future Simulator</h3>
              <p className="text-slate-500 text-xs font-light leading-relaxed">Simulate salary hikes, variable spending reductions, and investment leaps. View direct impacts on cash runway timelines instantly.</p>
            </div>
            <div className="p-6 bg-white border border-slate-200/50 rounded-2xl shadow-xs">
              <Layers className="w-8 h-8 text-emerald-500/80 mb-4" />
              <h3 className="font-semibold text-sm mb-2 text-slate-800 uppercase tracking-wider">2. Personal Asset Ledger</h3>
              <p className="text-slate-500 text-xs font-light leading-relaxed">Organize your dynamic Nifty index funds, SGB gold bonds, and emergency cash holdings under a single cohesive, visual workspace.</p>
            </div>
            <div className="p-6 bg-white border border-slate-200/50 rounded-2xl shadow-xs">
              <ShieldCheck className="w-8 h-8 text-amber-500/80 mb-4" />
              <h3 className="font-semibold text-sm mb-2 text-slate-800 uppercase tracking-wider">3. Three-Person Council</h3>
              <p className="text-slate-500 text-xs font-light leading-relaxed">Submit core queries to the advisory suite. Get balanced, constructive feedback split across the Critic, the Optimist, and the Arbiter.</p>
            </div>
          </div>
        </div>
      ) : (
        /* Onboarding Interactive Flow */
        <div className="flex items-center justify-center min-h-[92vh] px-6 py-12">
          <div className="w-full max-w-xl bg-white border border-slate-200 rounded-3xl shadow-xl p-8 sm:p-10 relative">
            
            {/* Skip Option in Onboarding Card Header */}
            <div className="absolute right-6 top-6">
              <button 
                onClick={handleSkipOnboarding}
                className="text-[10px] uppercase font-mono tracking-wider text-slate-400 hover:text-slate-700 font-bold border border-slate-200/60 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
              >
                Skip Onboarding
              </button>
            </div>

            {/* Steps indicator */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100 pr-24">
              <span className="text-[10px] font-mono font-medium text-slate-400">Step {step} of 8</span>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div 
                    key={i} 
                    className={`h-1.5 rounded-full transition-all duration-300 ${i <= step ? "w-4 bg-slate-950" : "w-1.5 bg-slate-200"}`} 
                  />
                ))}
              </div>
            </div>

            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="text-xl font-sans tracking-tight font-medium text-slate-800 mb-2">Welcome to Smart Money setup.</h2>
                <p className="text-slate-500 text-xs font-light mb-6">Let's configure your basic wealth parameters. What name should we call you?</p>
                
                <div className="space-y-4">
                  <label className="text-xxs font-semibold text-slate-500 uppercase tracking-wider">Your Name</label>
                  <input 
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-3.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1.5 focus:ring-slate-900 transition-shadow text-sm text-slate-800 font-medium bg-[#FBFBFD]"
                    placeholder="Enter name..."
                  />
                  <p className="text-[10px] text-slate-450 leading-relaxed font-light">Your name will be used to personalize labels and greetings inside your daily feed.</p>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="text-xl font-sans tracking-tight font-medium text-slate-800 mb-2">Select your financial goals.</h2>
                <p className="text-slate-500 text-xs font-light mb-6">These help us categorize your safety margins, investing tips, and debt payoff reminders.</p>
                
                <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
                  {goalsList.map((g) => (
                    <button
                      key={g.key}
                      onClick={() => {
                        const nextGoals = formData.goals.includes(g.key)
                          ? formData.goals.filter(item => item !== g.key)
                          : [...formData.goals, g.key];
                        setFormData({ ...formData, goals: nextGoals });
                      }}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all duration-200 ${
                        formData.goals.includes(g.key)
                          ? "border-slate-900 bg-slate-50/50 ring-1 ring-slate-900"
                          : "border-slate-200 hover:border-slate-350 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-slate-800">{g.label}</span>
                        <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-colors ${
                          formData.goals.includes(g.key) ? "bg-slate-950 border-slate-950" : "border-slate-300"
                        }`}>
                          {formData.goals.includes(g.key) && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-500 font-light mt-0.5">{g.desc}</p>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="text-xl font-sans tracking-tight font-medium text-slate-800 mb-2">Select your investment style.</h2>
                <p className="text-slate-500 text-xs font-light mb-6">This sets the tone of your advisory panel and compounds your long-term wealth calculations.</p>
                
                <div className="grid grid-cols-1 gap-2.5">
                  {[
                    { key: "conservative", title: "Safe & Conservative", desc: "Prioritizes safety reserves and fixed cash. Avoids short-term drops in value." },
                    { key: "balanced", title: "Moderate & Balanced", desc: "Combines safe cash savings and stable index funds for steady growth." },
                    { key: "growth", title: "Aggressive Growth", desc: "Invests heavily in equity and mutual funds, maximizing long-term returns over safety." }
                  ].map((riskOpt) => (
                    <button
                      key={riskOpt.key}
                      onClick={() => setFormData({ ...formData, risk: riskOpt.key })}
                      className={`text-left p-3.5 rounded-xl border transition-all duration-200 ${
                        formData.risk === riskOpt.key
                          ? "border-slate-900 bg-slate-50/50 ring-1 ring-slate-900"
                          : "border-slate-200 hover:border-slate-350 bg-white"
                      }`}
                    >
                      <span className="block font-semibold text-xs text-slate-800">{riskOpt.title}</span>
                      <span className="block text-[10px] text-slate-500 font-light mt-0.5 leading-relaxed">{riskOpt.desc}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="text-xl font-sans tracking-tight font-medium text-slate-800 mb-2">Enter your monthly take-home salary.</h2>
                <p className="text-slate-500 text-xs font-light mb-6">This benchmark is used to calculate daily safety spending meters and loan payoffs.</p>
                
                <div className="space-y-4">
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                    <input 
                      type="number"
                      value={formData.income}
                      onChange={(e) => setFormData({ ...formData, income: parseInt(e.target.value) || 0 })}
                      className="w-full pl-8 pr-4 py-3.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1.5 focus:ring-slate-900 transition-shadow text-base font-semibold text-slate-850 bg-[#FBFBFD] font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[150000, 250000, 375000].map((v) => (
                      <button
                        key={v}
                        onClick={() => setFormData({ ...formData, income: v })}
                        className="py-2 text-[10px] font-semibold uppercase tracking-wider border border-slate-200 hover:border-slate-300 text-slate-600 rounded-lg transition-colors bg-white hover:bg-slate-50 font-mono"
                      >
                        ₹{v.toLocaleString()}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-450 leading-relaxed font-light">This provides a starting target. You can adjust your income details inside the profile settings at any time.</p>
                </div>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="text-xl font-sans tracking-tight font-medium text-slate-800 mb-2">Enter your estimated monthly spending.</h2>
                <p className="text-slate-500 text-xs font-light mb-6">This helps us calculate your monthly savings capacity and emergency cash runway duration.</p>
                
                <div className="space-y-4">
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                    <input 
                      type="number"
                      value={formData.expenses}
                      onChange={(e) => setFormData({ ...formData, expenses: parseInt(e.target.value) || 0 })}
                      className="w-full pl-8 pr-4 py-3.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1.5 focus:ring-slate-900 transition-shadow text-base font-semibold text-slate-850 bg-[#FBFBFD] font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[50000, 80000, 120000].map((v) => (
                      <button
                        key={v}
                        onClick={() => setFormData({ ...formData, expenses: v })}
                        className="py-2 text-[10px] font-semibold uppercase tracking-wider border border-slate-200 hover:border-slate-300 text-slate-600 rounded-lg transition-colors bg-white hover:bg-slate-50 font-mono"
                      >
                        ₹{v.toLocaleString()}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-450 leading-relaxed font-light">Includes bills, rent, food, transport, and variable spending.</p>
                </div>
              </motion.div>
            )}

            {step === 6 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="text-xl font-sans tracking-tight font-medium text-slate-800 mb-2">Enter your total outstanding liabilities.</h2>
                <p className="text-slate-500 text-xs font-light mb-6">Enter your outstanding home loans, education loans, car loans, or credit card debts.</p>
                
                <div className="space-y-4">
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                    <input 
                      type="number"
                      value={formData.debts}
                      onChange={(e) => setFormData({ ...formData, debts: parseInt(e.target.value) || 0 })}
                      className="w-full pl-8 pr-4 py-3.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1.5 focus:ring-slate-900 transition-shadow text-base font-semibold text-slate-850 bg-[#FBFBFD] font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[1000000, 2000000, 3500000].map((v) => (
                      <button
                        key={v}
                        onClick={() => setFormData({ ...formData, debts: v })}
                        className="py-2 text-[10px] font-semibold uppercase tracking-wider border border-slate-200 hover:border-slate-300 text-slate-600 rounded-lg transition-colors bg-white hover:bg-slate-50 font-mono"
                      >
                        ₹{v.toLocaleString()}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-450 leading-relaxed font-light">Leaving this blank represents a debt-free profile. Outstanding amounts will populate your optimization ledger.</p>
                </div>
              </motion.div>
            )}

            {step === 7 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="text-xl font-sans tracking-tight font-medium text-slate-800 mb-2">Set your primary capital focus.</h2>
                <p className="text-slate-500 text-xs font-light mb-6">Which of these represents your most immediate target to tackle?</p>
                
                <div className="grid grid-cols-1 gap-2.5">
                  {[
                    { key: "stability", label: "Secure liquid emergency reserves first", icon: PiggyBank },
                    { key: "growth", label: "Maximize compound wealth investments", icon: TrendingUp },
                    { key: "reduceDebt", label: "Prepay and clear loans early", icon: Zap }
                  ].map((pOpt) => {
                    const IconComp = pOpt.icon;
                    return (
                      <button
                        key={pOpt.key}
                        onClick={() => setFormData({ ...formData, priority: pOpt.key })}
                        className={`flex items-center gap-3.5 text-left p-3.5 rounded-xl border transition-all duration-200 ${
                          formData.priority === pOpt.key
                            ? "border-slate-900 bg-slate-50/50 ring-1 ring-slate-900"
                            : "border-slate-200 hover:border-slate-350 bg-white"
                        }`}
                      >
                        <div className="p-2 rounded-lg bg-slate-100 text-slate-700 shrink-0">
                          <IconComp className="w-4.5 h-4.5" />
                        </div>
                        <span className="font-semibold text-xs text-slate-800">{pOpt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {step === 8 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="text-center py-4">
                <div className="w-14 h-14 bg-slate-950 text-white rounded-full flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </div>
                <h2 className="text-xl font-sans tracking-tight font-medium text-slate-800 mb-2">Aligning wealth parameters.</h2>
                <p className="text-slate-500 text-xs font-light max-w-sm mx-auto mb-6">
                  Smart Money is building your personalized workspace using your priority settings.
                </p>

                <div className="p-4 bg-slate-50 rounded-2xl text-left border border-slate-200/50 space-y-2 mb-6 max-w-xs mx-auto">
                  <div className="flex justify-between text-xxs font-semibold">
                    <span className="text-slate-400 uppercase tracking-wider font-mono">Owner</span>
                    <span className="text-slate-800">{formData.name}</span>
                  </div>
                  <div className="flex justify-between text-xxs font-semibold">
                    <span className="text-slate-400 uppercase tracking-wider font-mono">Salary</span>
                    <span className="text-slate-800 font-mono">₹{formData.income.toLocaleString()} / mo</span>
                  </div>
                  <div className="flex justify-between text-xxs font-semibold">
                    <span className="text-slate-400 uppercase tracking-wider font-mono">Expenses</span>
                    <span className="text-slate-800 font-mono">₹{formData.expenses.toLocaleString()} / mo</span>
                  </div>
                  <div className="flex justify-between text-xxs font-semibold">
                    <span className="text-slate-400 uppercase tracking-wider font-mono">Total Debts</span>
                    <span className="text-slate-850 font-mono">₹{formData.debts.toLocaleString()}</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step navigation buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
              <button
                onClick={prevStep}
                disabled={step === 1}
                className={`px-5 py-2.5 rounded-full text-xxs font-bold uppercase tracking-wider border border-slate-200 transition-colors ${
                  step === 1 ? "opacity-30 cursor-not-allowed text-slate-350" : "hover:bg-slate-50 text-slate-600"
                }`}
              >
                Back
              </button>
              <button
                onClick={nextStep}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-full text-xxs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                {step === 8 ? "Boot Workspace" : "Continue"}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
