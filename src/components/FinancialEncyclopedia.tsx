import React, { useState } from "react";
import { 
  ShieldCheck, TrendingUp, Landmark, Award, Home, Compass, 
  HeartPulse, FileText, ChevronDown, ChevronRight, BookOpen, Search
} from "lucide-react";

interface Topic {
  title: string;
  definition: string;
  example: string;
}

interface Category {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  topics: Topic[];
}

export default function FinancialEncyclopedia() {
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>("protection");
  const [activeTopicIndex, setActiveTopicIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState("");

  const categories: Category[] = [
    {
      id: "protection",
      name: "Protection",
      icon: ShieldCheck,
      topics: [
        {
          title: "Term Insurance",
          definition: "A pure protection plan that pays a set sum to your family if you pass away during the policy term. It has no maturity value, making it extremely cost-effective.",
          example: "Paying ₹1,000 monthly for a ₹1 Crore term plan ensures your family is financially secure if you are no longer there."
        },
        {
          title: "Co-Payment (Co-Pay)",
          definition: "The percentage of a medical bill you must pay out-of-pocket, while the insurance company pays the rest.",
          example: "If your policy has a 10% co-pay and your hospital bill is ₹1,00,000, you pay ₹10,000, and the insurer pays ₹90,000."
        },
        {
          title: "Deductible",
          definition: "An initial amount you must pay yourself before your insurance coverage starts kicking in to pay anything.",
          example: "With a ₹5,000 deductible, if a medical claim is ₹25,000, you pay the first ₹5,000, and the insurer covers the remaining ₹20,000."
        },
        {
          title: "No Claim Bonus (NCB)",
          definition: "A reward or discount given by insurers for not making any claims during the policy year. It increases cover or reduces premiums.",
          example: "Having no claims on your health policy this year earns you a 20% increase in your sum insured for next year at no extra cost."
        },
        {
          title: "Waiting Period",
          definition: "A specified duration of time that must pass before you can file claims for specific conditions (like pre-existing diseases).",
          example: "A 3-year waiting period on diabetes means diabetic treatments are only covered after the policy completes 3 full years."
        },
        {
          title: "Super Top-up Policy",
          definition: "An extra insurance layer that pays for medical bills once they cross a certain limit (deductible), offering high coverage at low rates.",
          example: "If you have a basic plan of ₹5 Lakhs and a ₹15 Lakhs Super Top-up with a ₹5 Lakh deductible, a ₹12 Lakh bill is covered: ₹5 Lakh by the basic plan, and ₹7 Lakh by the Super Top-up."
        }
      ]
    },
    {
      id: "equity",
      name: "Equity & Stocks",
      icon: TrendingUp,
      topics: [
        {
          title: "Index Mutual Funds",
          definition: "A mutual fund that mirrors a specific market index (like Nifty 50), automatically investing in the index's constituent companies.",
          example: "Investing in a Nifty 50 Index Fund buys you a tiny fraction of India's top 50 companies, matching the overall market's average growth."
        },
        {
          title: "Dividend Yield",
          definition: "A ratio showing how much a company pays out in dividends each year relative to its current share price.",
          example: "If a stock costs ₹100 and pays a ₹4 yearly dividend, its dividend yield is 4%. It is regular passive income from stock holdings."
        },
        {
          title: "Systematic Investment Plan (SIP)",
          definition: "A disciplined investing method where you invest a fixed amount of money into mutual funds at regular, automated intervals.",
          example: "Automating ₹5,000 on the 5th of every month into an equity mutual fund helps you average out market highs and lows over time."
        },
        {
          title: "Compounding Growth",
          definition: "Earning returns on your initial investment and also earning returns on the prior accumulated earnings over time.",
          example: "Investing ₹10,000 that grows at 10% gives you ₹11,000 in year one. In year two, you earn 10% on ₹11,000, not just the original ₹10,000."
        },
        {
          title: "Rupee Cost Averaging",
          definition: "Investing fixed amounts regularly so you buy more mutual fund units when prices are low and fewer units when prices are high.",
          example: "With your monthly ₹2,000 SIP, if mutual fund prices drop this month, your ₹2,000 automatically buys more units, lowering your average cost."
        }
      ]
    },
    {
      id: "fixed_income",
      name: "Fixed Income & Debt",
      icon: Landmark,
      topics: [
        {
          title: "Fixed Deposits (FD)",
          definition: "A low-risk banking instrument where you lock in a sum of money for a set period at a guaranteed interest rate.",
          example: "Depositing ₹1,00,000 for 1 year at a guaranteed 7% interest yields exactly ₹1,07,000 at maturity, safe from market swings."
        },
        {
          title: "Liquid Funds",
          definition: "Debt mutual funds that invest in highly secure, short-term debt instruments, allowing you to withdraw your money almost instantly.",
          example: "Parking your emergency fund in a Liquid Fund earns a slightly higher interest than a savings account while keeping funds accessible."
        },
        {
          title: "Corporate Bonds",
          definition: "Debt securities issued by companies to raise capital. Investors receive regular interest payments in exchange for lending their money.",
          example: "Buying a Tata Group corporate bond at 8.5% annual interest means you receive ₹8,500 yearly for every ₹1,00,000 invested until maturity."
        },
        {
          title: "PPF (Public Provident Fund)",
          definition: "A government-backed, tax-free savings scheme with a 15-year lock-in, offering secure compound interest.",
          example: "Investing in PPF lets you save tax under Section 80C while earning guaranteed interest that is completely tax-free upon withdrawal."
        },
        {
          title: "Debt Mutual Funds",
          definition: "Mutual funds that invest in fixed-income securities like government bonds, treasury bills, and high-quality corporate debt.",
          example: "Instead of volatile stocks, a debt fund invests in government loans, offering stable returns with lower risk profiles."
        },
        {
          title: "Sovereign Gold Bonds (SGB)",
          definition: "Government securities denominated in grams of gold. They track gold prices and pay a secure 2.5% annual interest on the initial value.",
          example: "Instead of physical gold, buying SGBs gets you gold value appreciation, tax-free capital gains at maturity, plus interest income."
        },
        {
          title: "Treasury Bills (T-Bills)",
          definition: "Short-term debt instruments issued by the government to manage short-term cash flows, typically issued for 91, 182, or 364 days.",
          example: "Buying a 91-day T-Bill guarantees repayment from the central government, representing the safest possible cash equivalent."
        },
        {
          title: "YTM (Yield to Maturity)",
          definition: "The total rate of return anticipated on a bond if it is held until the very end of its lifetime.",
          example: "A bond with a nominal rate of 7% bought at a discount might have a YTM of 7.8% because of the capital gain at maturity."
        },
        {
          title: "Credit Risk",
          definition: "The danger that a bond issuer or borrowing company will default on their debt obligations, failing to pay interest or principal.",
          example: "A low-rated company offers a high 12% interest rate to compensate investors for the credit risk that the company might go bankrupt."
        },
        {
          title: "Duration",
          definition: "A measure of how sensitive a bond fund's price is to changes in interest rates.",
          example: "If a bond fund has a duration of 5 years and interest rates rise by 1%, the fund's price will generally fall by approximately 5%."
        }
      ]
    },
    {
      id: "gold",
      name: "Gold & Commodities",
      icon: Award,
      topics: [
        {
          title: "Digital Gold",
          definition: "A modern method to purchase physical gold digitally starting at just ₹1. The gold is safely stored in secure, insured vaults.",
          example: "Buying ₹500 of Digital Gold via your app adds 0.08 grams of gold to your virtual locker, fully backed by real, certified gold bullion."
        },
        {
          title: "Sovereign Gold Bonds (SGB)",
          definition: "Government-backed gold securities tracking real gold prices, paying an extra 2.5% interest rate annually on the investment amount.",
          example: "Holding SGBs for 8 years allows you to cash out tax-free while getting a guaranteed ₹2,500 yearly payout on every ₹1,00,000 invested."
        },
        {
          title: "Gold ETFs",
          definition: "Mutual fund units representing physical gold, traded on stock exchanges like standard shares.",
          example: "Buying units of a Gold ETF allows you to track gold price changes instantly in your demat account without locker storage worries."
        },
        {
          title: "Commodity Derivatives",
          definition: "Contracts to buy or sell commodities like crude oil, silver, or wheat at a set price on a future date.",
          example: "A farmer locking in a price for wheat today protects against a future drop in prices when harvest season begins."
        },
        {
          title: "Physical Gold Margins",
          definition: "The extra making charges and taxes added to physical gold jewelry that do not contribute to its actual melting gold value.",
          example: "Jewelry with a 15% making charge plus 3% GST means you instantly lose 18% of your asset value upon exiting the store."
        }
      ]
    },
    {
      id: "real_estate",
      name: "Real Estate",
      icon: Home,
      topics: [
        {
          title: "REITs (Real Estate Investment Trusts)",
          definition: "Companies that own, operate, or finance income-producing commercial real estate, letting individuals invest in large properties.",
          example: "Buying ₹10,000 of an Embassy REIT gives you a share of rental income from major IT tech parks, distributed as regular dividends."
        },
        {
          title: "Rental Yield",
          definition: "The annual rental income generated by a property expressed as a percentage of the property's total purchase price.",
          example: "A house costing ₹1 Crore renting for ₹25,000 monthly (₹3 Lakhs annually) has a rental yield of 3%. It shows property efficiency."
        },
        {
          title: "Fractional Ownership",
          definition: "A method where multiple investors pool funds to co-own a premium commercial property, splitting acquisition costs and rental income.",
          example: "Investing ₹25 Lakhs with other co-owners to purchase a ₹10 Crore grade-A warehouse yields a monthly rental share."
        },
        {
          title: "Capital Appreciation",
          definition: "The increase in the market value of your property over time relative to its original purchase price.",
          example: "A plot of land purchased for ₹30 Lakhs in 2018 that is valued at ₹50 Lakhs today has experienced ₹20 Lakhs of capital appreciation."
        }
      ]
    },
    {
      id: "alternatives",
      name: "Alternative Investments",
      icon: Compass,
      topics: [
        {
          title: "P2P Lending (Peer-to-Peer)",
          definition: "Online platforms that match individual lenders directly with borrowers, removing traditional bank intermediaries.",
          example: "Lending ₹50,000 on a P2P platform to verified individuals at a 12% interest rate generates high returns, though with high default risk."
        },
        {
          title: "Venture Capital (VC)",
          definition: "Pooled investment funds directed into early-stage, high-growth startup companies in exchange for equity ownership.",
          example: "A VC fund investing ₹2 Crore in a young AI startup aims for a massive 10x exit return if the company goes public in 7 years."
        },
        {
          title: "Asset Backed Leasing",
          definition: "Investing in physical assets (like delivery bikes or medical equipment) that are leased to companies in exchange for monthly rentals.",
          example: "Leasing electric vehicles to delivery platforms generates stable, asset-backed monthly returns for investors."
        },
        {
          title: "Crypto Leverage",
          definition: "Using borrowed funds to trade volatile cryptocurrencies, multiplying potential gains but also multiplying potential losses.",
          example: "Using 5x leverage on a ₹10,000 capital means a tiny 20% drop in Bitcoin price wipes out your entire capital instantly."
        },
        {
          title: "Invoice Discounting",
          definition: "Providing short-term loans to companies backed by their unpaid customer invoices, typically repayable within 30 to 90 days.",
          example: "Funding a vendor's ₹10 Lakh unpaid invoice for a top brand gets you your principal back plus a 12% annualized return in 60 days."
        }
      ]
    },
    {
      id: "savings",
      name: "Savings & Emergency",
      icon: HeartPulse,
      topics: [
        {
          title: "Emergency Runway",
          definition: "A dedicated cash reserve set aside exclusively for unexpected events (like job losses or health emergencies), measured in months of living expenses.",
          example: "If your monthly expenses are ₹40,000, holding ₹2,40,000 in liquid savings gives you a secure 6-month emergency runway."
        },
        {
          title: "Safe-to-Spend Allowance",
          definition: "The amount of money you can spend today without disrupting your savings targets, debt EMIs, or monthly bills.",
          example: "With an income of ₹90,000, after allocating for FDs, PPF, rent, and card EMIs, your daily safe-to-spend allowance is exactly ₹500."
        },
        {
          title: "Sweep-In Savings Accounts",
          definition: "A bank account feature that automatically sweeps cash exceeding a set limit into higher-interest fixed deposits, keeping it fully liquid.",
          example: "Setting a ₹25,000 limit sweeps any surplus above it into a 7% FD. If you swipe your card for ₹30,000, the swept FD instantly breaks to cover the bill."
        },
        {
          title: "High-Yield Savings Account",
          definition: "A savings account that offers significantly higher interest rates than the standard banking average, often with certain balance criteria.",
          example: "Moving liquid capital from a standard 3% bank account to a high-yield 7% digital account increases your risk-free passive growth."
        }
      ]
    },
    {
      id: "liabilities",
      name: "Loans & Liabilities",
      icon: FileText,
      topics: [
        {
          title: "Debt Avalanche",
          definition: "A debt payoff strategy where you prioritize clearing the debt with the highest interest rate first, saving the most money on interest.",
          example: "Focusing extra cash on a 15% credit card balance while paying only minimum EMIs on an 8.5% education loan."
        },
        {
          title: "Debt Snowball",
          definition: "A payoff strategy where you prioritize clearing the smallest debt balance first, creating quick psychological wins to build momentum.",
          example: "Focusing extra cash to pay off a minor ₹5,000 personal loan before tackling a larger ₹3,00,000 education loan."
        },
        {
          title: "EMI (Equated Monthly Installment)",
          definition: "A fixed payment amount made by a borrower to a lender at a specified date each calendar month to clear debt over time.",
          example: "A monthly EMI of ₹12,000 on your car loan systematically covers both the interest charge and the outstanding principal."
        },
        {
          title: "Credit Card Debt Trap",
          definition: "Paying only the 'minimum due amount' on your credit card statement, which rolls over the main balance at extremely high compound interest rates (36-45% annually).",
          example: "Paying only ₹2,000 of a ₹40,000 card bill rolls over the remaining ₹38,000 at a high 40% rate, compounding debt rapidly."
        },
        {
          title: "CIBIL / Credit Score",
          definition: "A 3-digit number assessing your creditworthiness based on your loan payment history, outstanding debts, and credit duration.",
          example: "Clearing card dues on time maintains a 780 CIBIL score, ensuring you get approved for low-interest home loans easily."
        },
        {
          title: "Prepayment Penalty",
          definition: "A fee charged by a bank or lender if you pay off your loan early, protecting their expected interest income.",
          example: "A bank charging a 2% penalty fee if you pay off your ₹10 Lakh car loan 2 years before the official maturity schedule."
        }
      ]
    }
  ];

  // Filtering topics based on search
  const getFilteredCategories = () => {
    if (!searchQuery.trim()) return categories;
    
    return categories.map(cat => {
      const filteredTopics = cat.topics.filter(
        t => t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
             t.definition.toLowerCase().includes(searchQuery.toLowerCase())
      );
      return { ...cat, topics: filteredTopics };
    }).filter(cat => cat.topics.length > 0);
  };

  const filteredCategories = getFilteredCategories();

  const handleCategoryClick = (catId: string) => {
    setActiveCategoryId(catId === activeCategoryId ? null : catId);
    setActiveTopicIndex(0); // Reset selected topic to the first one in the category
  };

  const selectedCategory = categories.find(c => c.id === activeCategoryId);
  const selectedTopic = selectedCategory?.topics[activeTopicIndex ?? 0];

  return (
    <div className="space-y-6">
      
      {/* Intro section */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h2 className="text-xl font-sans font-semibold text-slate-800 tracking-tight">Financial Encyclopedia</h2>
        <p className="text-[13px] text-slate-500 leading-relaxed">
          Tap any asset category to understand complex financial terminology in plain language. No complicated jargon, no confusion — just clear, honest definitions and real-life examples.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-md mx-auto relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-slate-400" />
        </div>
        <input
          type="text"
          placeholder="Search topics (e.g. SIP, SGB, Co-pay)..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            // Auto open the first category that matches
            const filtered = getFilteredCategories();
            if (filtered.length > 0) {
              setActiveCategoryId(filtered[0].id);
              setActiveTopicIndex(0);
            }
          }}
          className="w-full pl-9 pr-4 py-2.5 border border-slate-200 bg-white rounded-xl text-[13px] focus:outline-slate-900 transition-colors shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
        />
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: 8 Category Accordions */}
        <div className="lg:col-span-1 space-y-2.5">
          {filteredCategories.map((cat) => {
            const IconComponent = cat.icon;
            const isOpen = cat.id === activeCategoryId;
            return (
              <div 
                key={cat.id} 
                className={`border rounded-2xl transition-all duration-200 ${
                  isOpen ? "border-slate-300 bg-slate-50/50 shadow-[0_2px_8px_rgba(0,0,0,0.04)]" : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                {/* Accordion Header */}
                <button
                  onClick={() => handleCategoryClick(cat.id)}
                  className="w-full flex items-center justify-between p-4 text-left cursor-pointer focus:outline-none"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl shrink-0 ${isOpen ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700"}`}>
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="font-medium text-[13px] text-slate-800 block leading-tight">{cat.name}</span>
                      <span className="text-[11px] text-slate-400 mt-0.5 block">{cat.topics.length} topics</span>
                    </div>
                  </div>
                  {isOpen ? <ChevronDown className="h-4 w-4 text-slate-600" /> : <ChevronRight className="h-4 w-4 text-slate-400" />}
                </button>

                {/* Mobile/Expanded quick list of topics inside the accordion */}
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 border-t border-slate-100/50 space-y-1 block lg:hidden">
                    {cat.topics.map((t, idx) => (
                    <button
                        key={idx}
                        onClick={() => setActiveTopicIndex(idx)}
                        className={`w-full text-left p-2.5 rounded-xl text-[12px] font-medium transition-colors ${
                          activeTopicIndex === idx 
                            ? "bg-slate-900 text-white" 
                            : "text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {t.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Side: Detailed View showing selected topic definition and examples */}
        <div className="lg:col-span-2 space-y-5">
          {selectedCategory ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex flex-col md:flex-row gap-6">
              
              {/* Sidebar of topics (only visible on large screens) */}
              <div className="w-full md:w-44 shrink-0 space-y-1 hidden lg:block border-r border-slate-100 pr-4">
                <span className="text-[10px] uppercase tracking-widest text-slate-400 block mb-2 font-semibold">Topic Index</span>
                {selectedCategory.topics.map((t, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveTopicIndex(idx)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-[12px] font-medium transition-colors ${
                      activeTopicIndex === idx 
                        ? "bg-slate-900 text-white" 
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {t.title}
                  </button>
                ))}
              </div>

              {/* Core Topic Details Panel */}
              <div className="flex-1 space-y-6">
                {selectedTopic ? (
                  <div className="space-y-5">
                    
                    {/* Header */}
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                      <BookOpen className="h-4 w-4 text-indigo-500" />
                      <h3 className="text-sm font-semibold text-slate-800 tracking-tight leading-none">{selectedTopic.title}</h3>
                    </div>

                    {/* Definition box */}
                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-1.5">
                      <span className="text-[10px] uppercase tracking-widest text-slate-500 block font-semibold">Layman Explanation</span>
                      <p className="text-slate-700 text-[13px] leading-relaxed">{selectedTopic.definition}</p>
                    </div>

                    {/* Real-world example box */}
                    <div className="p-4 bg-amber-50/40 border border-amber-100/60 rounded-2xl space-y-1.5">
                      <span className="text-[10px] uppercase tracking-widest text-amber-700 block font-semibold">Real-World Case</span>
                      <p className="text-slate-700 text-[13px] leading-relaxed italic">
                        "{selectedTopic.example}"
                      </p>
                    </div>

                  </div>
                ) : (
                  <div className="text-center py-12 text-xs text-slate-600 font-light">
                    Select a topic from the index list to reveal its plain-language translation.
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center flex flex-col justify-center items-center min-h-[300px]">
              <BookOpen className="w-8 h-8 text-slate-300 animate-pulse mb-3" />
              <p className="text-[14px] font-medium text-slate-500">No active category selected</p>
              <p className="text-[13px] text-slate-400 mt-1 max-w-sm">Select a financial catalog on the left to explore learning topics.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
