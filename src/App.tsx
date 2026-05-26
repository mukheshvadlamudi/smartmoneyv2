import React, { useState, useEffect } from "react";
import LandingPage from "./components/LandingPage";
import AICommandCenter from "./components/AICommandCenter";
import SpendingIntelligence from "./components/SpendingIntelligence";
import FutureSimulator from "./components/FutureSimulator";
import GoalsSystem from "./components/GoalsSystem";
import WealthManagement from "./components/WealthManagement";
import ProtectionInsurance from "./components/ProtectionInsurance";
import DebtOptimization from "./components/DebtOptimization";

import { initialFinancialState } from "./mockData";
import { UserFinancialState, Notification } from "./types";
import { 
  Sparkles, PiggyBank, ShieldCheck, Compass, LayoutDashboard, 
  History, Target, Milestone, Landmark, ShieldCheck as ProtectionIcon, 
  Settings, Zap, Hourglass, HelpCircle, Bell, ArrowRight, RefreshCw 
} from "lucide-react";

export default function App() {
  const [onboarded, setOnboarded] = useState<boolean>(() => {
    const saved = localStorage.getItem("smart_money_onboarded");
    return saved === "true";
  });

  const [financialState, setFinancialState] = useState<UserFinancialState>(() => {
    const savedState = localStorage.getItem("smart_money_financial_state");
    if (savedState) {
      try {
        return JSON.parse(savedState);
      } catch (err) {
        return initialFinancialState;
      }
    }
    return initialFinancialState;
  });

  const [currentTab, setCurrentTab] = useState<string>("dashboard");
  const [isApiLive, setIsApiLive] = useState(false);
  const [showStory, setShowStory] = useState(true);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem("smart_money_financial_state", JSON.stringify(financialState));
    localStorage.setItem("smart_money_onboarded", onboarded ? "true" : "false");
  }, [financialState, onboarded]);

  // Check server health
  useEffect(() => {
    fetch("/api/health")
      .then(r => r.json())
      .then(data => {
        setIsApiLive(data.hasApiKey);
      })
      .catch(() => setIsApiLive(false));
  }, []);

  const handleCompleteOnboarding = (data: {
    name: string;
    goals: string[];
    risk: string;
    income: number;
    priority: string;
  }) => {
    setFinancialState(prev => {
      // Modify mock data state dynamically based on onboarding criteria
      const adjustedGoals = prev.goals.filter(g => data.goals.includes(g.type));
      let scoreMultiplier = 70;
      if (data.priority === "stability") scoreMultiplier = 82;
      if (data.priority === "reduceDebt") scoreMultiplier = 64;

      return {
        ...prev,
        income: data.income,
        healthScore: scoreMultiplier,
        safeSpendDaily: Math.round(data.income / 90),
        safeSpendWeekly: Math.round(data.income / 12),
        spending: Math.round(data.income * 0.55),
        notifications: [
          {
            id: "onb_notif",
            title: `Welcome, ${data.name}! OS initialized`,
            body: `Your profile priority is set to [${data.priority}]. Dynamic safe-spending meters and multi-mind advisory suggestions are compiled.`,
            type: "success",
            time: "Just now"
          },
          ...prev.notifications
        ]
      };
    });
    setOnboarded(true);
    setCurrentTab("dashboard");
  };

  const handleResetApplication = () => {
    localStorage.removeItem("smart_money_financial_state");
    localStorage.removeItem("smart_money_onboarded");
    setFinancialState(initialFinancialState);
    setOnboarded(false);
    setCurrentTab("dashboard");
  };

  if (!onboarded) {
    return <LandingPage onCompleteOnboarding={handleCompleteOnboarding} />;
  }

  return (
    <div id="smart-money-root" className="min-h-screen bg-[#FBFBFD] text-[#1D1D1F] flex flex-col font-sans selection:bg-slate-200">
      
      {/* Top micro bar for API health - strictly aesthetic premium element, NO telemetry raw metrics */}
      <div className="bg-slate-900 text-white py-2 px-6 flex justify-between items-center text-xxs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
          <span className="text-slate-400">Operating System Status:</span>
          <span className="text-slate-100 font-semibold uppercase">Predictive Safe Mode</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-slate-400">AI Intelligence Link:</span>
          <span className={`font-semibold uppercase tracking-wider ${isApiLive ? "text-indigo-300" : "text-amber-400"}`}>
            {isApiLive ? "Server Gemini Mode Active" : "Adaptive Client Fallback"}
          </span>
        </div>
      </div>

      {/* Main Premium Shell Layout */}
      <div className="flex-1 flex flex-col md:flex-row">
        
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-64 bg-white border-r border-slate-200/60 p-6 flex flex-col justify-between">
          <div className="space-y-6">
            
            {/* App branding header */}
            <div className="flex items-center gap-2 px-2">
              <div className="p-2 bg-slate-950 text-white rounded-xl">
                <Landmark className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-semibold text-sm text-slate-900 tracking-tight leading-none">Smart Money</h1>
                <span className="text-[10px] text-slate-400 font-mono tracking-wider mt-1 block uppercase">Predictive Wealth OS</span>
              </div>
            </div>

            {/* Navigation options list */}
            <nav className="space-y-1 pt-4">
              {[
                { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
                { id: "insights", label: "Insights Feed", icon: History },
                { id: "simulator", label: "Future Simulator", icon: Compass },
                { id: "goals", label: "Target Goals", icon: Target },
                { id: "wealth", label: "Wealth Matrix", icon: Milestone },
                { id: "protection", label: "Protection Cover", icon: ProtectionIcon },
                { id: "debt", label: "Debt Command", icon: Zap },
                { id: "profile", label: "System Preferences", icon: Settings },
              ].map((tab) => {
                const IconComp = tab.icon;
                const isSelected = currentTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setCurrentTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all text-left cursor-pointer ${
                      isSelected 
                        ? "bg-slate-950 text-white shadow-sm font-semibold" 
                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    <IconComp className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>

          </div>

          {/* Quick companion identity credit footer - minimal & stylish */}
          <div className="pt-6 border-t border-slate-100 hidden md:block">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block font-semibold">Workspace Owner</span>
            <span className="text-xs font-semibold text-slate-700 block mt-1">Mukhesh Vadlamudi</span>
            <span className="text-xxs text-slate-400 block mt-0.5">mukheshvadlamudi@gmail.com</span>
          </div>
        </aside>

        {/* Content Workspace Area */}
        <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full overflow-y-auto space-y-8">
          
          {/* Weekly Financial Story Narrative Alert banner */}
          {showStory && currentTab === "dashboard" && (
            <div className="bg-gradient-to-r from-slate-950 to-slate-900 text-white rounded-3xl p-5 shadow-md relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="absolute -right-16 -top-16 w-48 h-48 border border-white/5 rounded-full pointer-events-none" />
              <div className="flex gap-4 items-start sm:items-center">
                <div className="p-3 bg-white/10 rounded-2xl text-amber-200">
                  <Sparkles className="w-5 h-5 animate-bounce" />
                </div>
                <div>
                  <span className="text-xxs uppercase tracking-wider text-indigo-300 font-semibold font-mono">My Weekly Financial Story</span>
                  <p className="text-sm font-medium text-slate-100 leading-relaxed mt-1">
                    "This week you stayed under your dining budget, cleared ₹5,000 off HDFC card liability, and moved <span className="text-emerald-400 font-semibold">4% closer</span> to your Japan Cherry Blossom vacation goal."
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center">
                <button 
                  onClick={() => setCurrentTab("insights")}
                  className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white text-xs font-semibold rounded-full transition-all cursor-pointer"
                >
                  Analyze insights
                </button>
                <button 
                  onClick={() => setShowStory(false)}
                  className="text-xxs text-slate-400 hover:text-white transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          {/* Module routing content */}
          <div className="transition-all duration-300">
            {currentTab === "dashboard" && (
              <AICommandCenter 
                financialState={financialState} 
                setFinancialState={setFinancialState} 
              />
            )}

            {currentTab === "insights" && (
              <SpendingIntelligence 
                financialState={financialState}
                setFinancialState={setFinancialState}
              />
            )}

            {currentTab === "simulator" && (
              <FutureSimulator 
                financialState={financialState} 
              />
            )}

            {currentTab === "goals" && (
              <GoalsSystem 
                financialState={financialState}
                setFinancialState={setFinancialState}
              />
            )}

            {currentTab === "wealth" && (
              <WealthManagement 
                financialState={financialState}
                setFinancialState={setFinancialState}
              />
            )}

            {currentTab === "protection" && (
              <ProtectionInsurance 
                financialState={financialState}
                setFinancialState={setFinancialState}
              />
            )}

            {currentTab === "debt" && (
              <DebtOptimization 
                financialState={financialState}
                setFinancialState={setFinancialState}
              />
            )}

            {currentTab === "profile" && (
              <div className="space-y-6 max-w-2xl bg-white border border-slate-200/60 rounded-3xl p-6 shadow-xs">
                <div>
                  <h3 className="text-lg font-medium text-slate-800 tracking-tight">System Workspace Preferences</h3>
                  <p className="text-xs text-slate-400 font-light mt-0.5">Manage virtual cash registers, operational parameters, or trigger setup resets.</p>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-100">
                  
                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-2">
                    <span className="text-xxs font-semibold uppercase tracking-wider text-slate-400 font-mono">Connected Email</span>
                    <p className="text-xs text-slate-700 font-medium">mukheshvadlamudi@gmail.com</p>
                    <p className="text-[10px] text-slate-400">Main Google account associated with AI Studio Build platform.</p>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="text-xxs font-semibold uppercase tracking-wider text-slate-400 font-mono block">Reset Application Data</span>
                      <p className="text-xs text-slate-700 font-light mt-1">Clears local storage buffers and loads original onboarding dialog modules.</p>
                    </div>
                    <button
                      onClick={handleResetApplication}
                      className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-[#E11D48] hover:text-rose-700 text-xs font-semibold rounded-xl border border-rose-100 transition-colors cursor-pointer"
                    >
                      Purge OS Setup
                    </button>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                    <span className="text-xxs font-medium uppercase tracking-wider text-slate-400 font-mono block">Developer Context Parameters (Nginx proxy)</span>
                    <p className="text-xxs text-slate-500 mt-1 font-light leading-relaxed">
                      This system runs in Cloud Run sandboxes. The dev server communicates exclusively via hardcoded internal routing rules, completely omitting absolute hard references.
                    </p>
                  </div>

                </div>
              </div>
            )}
          </div>

        </main>
      </div>
    </div>
  );
}
