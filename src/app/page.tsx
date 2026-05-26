"use client";

import React, { useState, useEffect, useRef } from "react";
import LandingPage from "../components/LandingPage";
import AICommandCenter from "../components/AICommandCenter";
import SpendingIntelligence from "../components/SpendingIntelligence";
import FutureSimulator from "../components/FutureSimulator";
import WealthManagement from "../components/WealthManagement";
import ProtectionInsurance from "../components/ProtectionInsurance";
import DebtOptimization from "../components/DebtOptimization";
import AICouncil from "../components/AICouncil";
import FinancialEncyclopedia from "../components/FinancialEncyclopedia";
import InvestmentPortfolio from "../components/InvestmentPortfolio";

import { initialFinancialState } from "../mockData";
import { UserFinancialState } from "../types";
import { 
  Sparkles, Landmark, LayoutDashboard, Compass, ChevronDown, 
  ShieldCheck, Zap, BookOpen, AlertCircle, TrendingUp, PieChart, LogOut
} from "lucide-react";

export default function Page() {
  const [onboarded, setOnboarded] = useState<boolean>(false);
  const [financialState, setFinancialState] = useState<UserFinancialState>(initialFinancialState);
  const [currentTab, setCurrentTab] = useState<string>("dashboard"); // "dashboard", "insights", "simulator", "debt", "protection", "advisors", "learn"
  const [isApiLive, setIsApiLive] = useState(false);
  const [showStory, setShowStory] = useState(true);
  const [mounted, setMounted] = useState(false);
  
  // Hover states for dropdown menus
  const [hoveredFolder, setHoveredFolder] = useState<string | null>(null);

  // Avoid hydration mismatch by waiting until mounted
  useEffect(() => {
    setMounted(true);
    const savedOnboarded = localStorage.getItem("smart_money_onboarded");
    if (savedOnboarded === "true") {
      setOnboarded(true);
    }
    const savedState = localStorage.getItem("smart_money_financial_state");
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        // Force upgrade old low-income cached states to show the new ₹45 Lakhs / ₹3.6 Cr profile
        if (!parsed.income || parsed.income < 300000) {
          setFinancialState(initialFinancialState);
          localStorage.setItem("smart_money_financial_state", JSON.stringify(initialFinancialState));
        } else {
          setFinancialState(parsed);
        }
      } catch (err) {
        setFinancialState(initialFinancialState);
      }
    } else {
      setFinancialState(initialFinancialState);
    }
  }, []);

  // Sync state to localStorage
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("smart_money_financial_state", JSON.stringify(financialState));
    localStorage.setItem("smart_money_onboarded", onboarded ? "true" : "false");
  }, [financialState, onboarded, mounted]);

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
    expenses: number;
    debts: number;
    priority: string;
  }) => {
    setFinancialState(prev => {
      let scoreMultiplier = 70;
      if (data.priority === "stability") scoreMultiplier = 82;
      if (data.priority === "reduceDebt") scoreMultiplier = 64;

      // Dynamically allocate user's liabilities inputs across existing home/car loan entries
      const adjustedDebts = prev.debts.map((d, i) => {
        if (i === 0) {
          // Home Loan principal (remaining balance)
          return { ...d, principal: Math.max(0, data.debts - 200000) };
        }
        if (i === 1) {
          // Car Loan principal
          return { ...d, principal: Math.min(data.debts, 200000) };
        }
        return d;
      });

      return {
        ...prev,
        income: data.income,
        spending: data.expenses,
        healthScore: scoreMultiplier,
        safeSpendDaily: Math.round((data.income - data.expenses) / 30),
        safeSpendWeekly: Math.round((data.income - data.expenses) / 4),
        debts: adjustedDebts,
        notifications: [
          {
            id: "onb_notif",
            title: `Welcome, ${data.name}! Smart Money Setup Completed`,
            body: `Your profile priority is set to [${data.priority}]. Dynamic safe-spending calculations and personalized advisor suggestions are prepared.`,
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

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#FBFBFD] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-slate-900 animate-spin" />
      </div>
    );
  }

  if (!onboarded) {
    return <LandingPage onCompleteOnboarding={handleCompleteOnboarding} />;
  }

  // Get human readable active tab name
  const getActiveTabLabel = () => {
    switch(currentTab) {
      case "dashboard": return "Overview Dashboard";
      case "insights": return "Spending & Anomalies";
      case "simulator": return "Scenario Runways";
      case "debt": return "Debt Payoff Strategies";
      case "protection": return "Protection & Claims";
      case "advisors": return "AI Board of Advisors";
      case "learn": return "Financial Encyclopedia";
      case "investments": return "Investment Portfolio";
      case "wealth": return "Wealth Management";
      default: return "Dashboard";
    }
  };

  return (
    <div id="smart-money-root" className="min-h-screen bg-[#FBFBFD] text-[#1D1D1F] flex flex-col font-sans selection:bg-slate-200">
      
      {/* Centered Top Nav Shell - Apple UI/UX styled dropdown header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50 px-8 py-3 flex justify-between items-center shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        
        {/* Left Branding: Restored Clickable Logo Button to return home */}
        <button
          onClick={() => { setCurrentTab("dashboard"); setHoveredFolder(null); }}
          className="flex items-center gap-2.5 text-left bg-transparent border-0 cursor-pointer p-1 rounded-xl hover:bg-slate-50 transition-colors focus:outline-none"
        >
          <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white shrink-0 shadow-sm">
            <Landmark className="w-4.5 h-4.5" />
          </div>
          <div>
            <h1 className="font-sans font-semibold text-[13px] tracking-wide text-slate-900 leading-none">Smart Money</h1>
            <span className="text-[9px] text-slate-500 font-bold tracking-wider mt-0.5 block uppercase">by FutureLab Studios</span>
          </div>
        </button>

        {/* Center Dropdown Folder Navigation */}
        <nav className="hidden lg:flex items-center gap-0.5">
          
          {/* Item 1: Dashboard Home */}
          <button
            onClick={() => { setCurrentTab("dashboard"); setHoveredFolder(null); }}
            className={`px-4 py-2 rounded-lg text-[13px] font-medium transition-all cursor-pointer ${
              currentTab === "dashboard"
                ? "bg-slate-900 text-white shadow-sm" 
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/70"
            }`}
          >
            Dashboard
          </button>

          {/* Item 2: Investments (Direct Click, 2nd place in NavBar) */}
          <button
            onClick={() => { setCurrentTab("investments"); setHoveredFolder(null); }}
            className={`px-4 py-2 rounded-lg text-[13px] font-medium transition-all cursor-pointer ${
              currentTab === "investments"
                ? "bg-slate-900 text-white shadow-sm" 
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/70"
            }`}
          >
            Investments
          </button>

          {/* Item 3: Optimization Command */}
          <div 
            className="relative"
            onMouseEnter={() => setHoveredFolder("optimization")}
            onMouseLeave={() => setHoveredFolder(null)}
          >
            <button
              className={`px-4 py-2 rounded-lg text-[13px] font-medium transition-all cursor-pointer flex items-center gap-1 ${
                currentTab === "debt" || currentTab === "protection"
                  ? "bg-slate-100 text-slate-900" 
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/70"
              }`}
            >
              Optimization
              <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${hoveredFolder === "optimization" ? "rotate-180" : ""}`} />
            </button>

            {hoveredFolder === "optimization" && (
              <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2">
                <div className="w-56 bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-xl py-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
                  <button
                    onClick={() => { setCurrentTab("debt"); setHoveredFolder(null); }}
                    className="w-full text-left px-4 py-2.5 text-[13px] font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors flex items-center gap-2.5 cursor-pointer rounded-lg mx-0"
                  >
                    <Zap className="w-4 h-4 text-amber-400" />
                    Debt Optimization
                  </button>
                  <button
                    onClick={() => { setCurrentTab("protection"); setHoveredFolder(null); }}
                    className="w-full text-left px-4 py-2.5 text-[13px] font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors flex items-center gap-2.5 cursor-pointer rounded-lg mx-0"
                  >
                    <ShieldCheck className="w-4 h-4 text-blue-400" />
                    Protection Cover
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Item 4: Analytics (Swapped to place of Investments, with dropdown submenu) */}
          <div 
            className="relative"
            onMouseEnter={() => setHoveredFolder("analytics")}
            onMouseLeave={() => setHoveredFolder(null)}
          >
            <button
              className={`px-4 py-2 rounded-lg text-[13px] font-medium transition-all cursor-pointer flex items-center gap-1 ${
                currentTab === "insights" || currentTab === "simulator"
                  ? "bg-slate-100 text-slate-900" 
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/70"
              }`}
            >
              Analytics
              <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${hoveredFolder === "analytics" ? "rotate-180" : ""}`} />
            </button>

            {hoveredFolder === "analytics" && (
              <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2">
                <div className="w-56 bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-xl py-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
                  <button
                    onClick={() => { setCurrentTab("insights"); setHoveredFolder(null); }}
                    className="w-full text-left px-4 py-2.5 text-[13px] font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors flex items-center gap-2.5 cursor-pointer rounded-lg mx-0"
                  >
                    <Compass className="w-4 h-4 text-slate-400" />
                    Spending Insights
                  </button>
                  <button
                    onClick={() => { setCurrentTab("simulator"); setHoveredFolder(null); }}
                    className="w-full text-left px-4 py-2.5 text-[13px] font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors flex items-center gap-2.5 cursor-pointer rounded-lg mx-0"
                  >
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    Future Simulator
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Item 5: Advisors - Direct link (single subsection) */}
          <button
            onClick={() => { setCurrentTab("advisors"); setHoveredFolder(null); }}
            className={`px-4 py-2 rounded-lg text-[13px] font-medium transition-all cursor-pointer ${
              currentTab === "advisors"
                ? "bg-slate-100 text-slate-900" 
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/70"
            }`}
          >
            Advisors
          </button>

          {/* Item 6: Academy - Direct link (single subsection) */}
          <button
            onClick={() => { setCurrentTab("learn"); setHoveredFolder(null); }}
            className={`px-4 py-2 rounded-lg text-[13px] font-medium transition-all cursor-pointer ${
              currentTab === "learn"
                ? "bg-slate-100 text-slate-900" 
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/70"
            }`}
          >
            Academy
          </button>

        </nav>

        {/* Right Area: Interactive Sign Out / Logout button */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleResetApplication}
            className="px-3.5 py-2 border border-slate-200 hover:bg-rose-50 hover:border-rose-200 rounded-xl text-[11px] font-bold uppercase tracking-wider text-slate-700 hover:text-rose-600 transition-all cursor-pointer flex items-center gap-1.5 focus:outline-none"
            title="Sign Out of Smart Money"
          >
            <LogOut className="w-3.5 h-3.5 shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>

      </header>

      {/* Mobile navigation notification warning (optional helper) */}
      <div className="lg:hidden bg-amber-50 border-b border-amber-200/60 py-2.5 px-6 text-center text-[12px] text-amber-800 font-medium">
        Please use a desktop browser to access the complete FutureLab dropdown navigation menus.
      </div>

      {/* Main Workspace Frame */}
      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full overflow-y-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
        
        {/* Minimized Weekly Financial Story Banner Strip */}
        {showStory && currentTab === "dashboard" && (
          <div className="bg-white border border-slate-200 text-slate-800 rounded-2xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex gap-3 items-center">
              <div className="p-2 bg-slate-100 rounded-xl text-slate-700 shrink-0">
                <Sparkles className="w-4 h-4 animate-bounce" />
              </div>
              <p className="text-[13px] text-slate-600 leading-relaxed">
                <span className="text-slate-900 font-semibold mr-1">Weekly Story:</span>
                You stayed under budget, cleared ₹5,000 off HDFC card liability, and moved <span className="text-emerald-600 font-semibold">4% closer</span> to your Japan Cherry Blossom vacation goal.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button 
                onClick={() => setCurrentTab("learn")}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-[12px] font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap shadow-sm"
              >
                Learn strategies
              </button>
              <button 
                onClick={() => setShowStory(false)}
                className="text-[12px] text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Tab Routing Content Workspace */}
        <div className="transition-all duration-300">
          
          {/* TAB 1: Dashboard Overview (Completely isolated, no stacking!) */}
          {currentTab === "dashboard" && (
            <AICommandCenter 
              financialState={financialState} 
              setFinancialState={setFinancialState} 
            />
          )}

          {/* TAB 2: Spending Insights */}
          {currentTab === "insights" && (
            <SpendingIntelligence 
              financialState={financialState}
              setFinancialState={setFinancialState}
            />
          )}

          {/* TAB 3: Future Simulator */}
          {currentTab === "simulator" && (
            <FutureSimulator financialState={financialState} />
          )}

          {/* TAB 4: Debt Optimization Command */}
          {currentTab === "debt" && (
            <DebtOptimization 
              financialState={financialState}
              setFinancialState={setFinancialState}
            />
          )}

          {/* TAB 5: Protection & Health Policy claims */}
          {currentTab === "protection" && (
            <ProtectionInsurance 
              financialState={financialState}
              setFinancialState={setFinancialState}
            />
          )}

          {/* TAB 6: Advisors Council Chamber */}
          {currentTab === "advisors" && (
            <AICouncil financialState={financialState} />
          )}

          {/* TAB 7: Academy Financial Encyclopedia */}
          {currentTab === "learn" && (
            <FinancialEncyclopedia />
          )}

          {/* TAB 8: Investment Portfolio */}
          {currentTab === "investments" && (
            <InvestmentPortfolio 
              financialState={financialState}
              setFinancialState={setFinancialState}
            />
          )}

          {/* TAB 9: Wealth Management Overview */}
          {currentTab === "wealth" && (
            <WealthManagement 
              financialState={financialState}
              setFinancialState={setFinancialState}
            />
          )}

        </div>

      </main>

      {/* Footer Settings reset panel */}
      <footer className="bg-white border-t border-slate-200/60 py-5 px-10 flex flex-col sm:flex-row justify-between items-center gap-4 text-[12px] text-slate-400">
        <div>
          <span>Smart Money — Designed for </span>
          <span className="font-medium text-slate-600">FutureLab Studios</span>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleResetApplication}
            className="text-[12px] text-rose-400 hover:text-rose-600 transition-colors font-medium cursor-pointer"
          >
            Reset Application
          </button>
        </div>
      </footer>

    </div>
  );
}
