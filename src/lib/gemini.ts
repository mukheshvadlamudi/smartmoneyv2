import { GoogleGenAI, Type } from "@google/genai";

// Lazy-loaded Gemini client
let aiClient: GoogleGenAI | null = null;

export function getGemini(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key === "MY_GEMINI_API_KEY") {
       throw new Error("GEMINI_API_KEY is missing or invalid. Please add your Gemini API Key in the Settings > Secrets panel.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Fallback response for mock-intelligence mode if key is missing
export function getOfflineFallback(prompt: string, context: string): string {
  if (context === "council") {
    return JSON.stringify({
      optimist: "This is a great opportunity to accelerate your wealth! Compounding ₹15,000 monthly in dynamic mutual funds would grow your portfolio aggressively and speed up your vacation timeline by months.",
      critic: "Wait! You have HDFC card outstanding and a weak emergency runway. Clear all high-interest liability immediately before chasing market returns. Capital preservation is priority one.",
      moneyGod: "The optimal strategy is a hybrid: dedicate ₹10,000 to clear high-interest card debts within 2 months, while automating a smaller ₹5,000 SIP. This builds investing momentum while systematically de-risking your liability profile."
    });
  }
  if (context === "simulate") {
    return JSON.stringify({
      savingsImpact: "Projected annual savings improvement of +₹45,000.",
      goalImpact: "Accelerates your 'Europe Travel' timeline by 38 days.",
      runwayMonths: 14,
      stressLevel: "Safe (Minimized financial tension)",
      summary: "This strategy significantly enhances your cash buffer. Halting daily food orders routes liquid capital directly into your high-yield goals, maintaining flexible liquidity controls.",
      milestoneDate: "Mid September",
      recommendation: "Automate this ₹3,750 monthly surplus into your dedicated Travel Goal sub-account immediately."
    });
  }
  if (context === "debt") {
    return JSON.stringify({
      advice: "Based on your current debt profile, focusing on the highest-interest liability first (Avalanche method) would save you approximately ₹12,000 in interest over the next 12 months. Consider directing any surplus income beyond your essential spending towards this debt. At your current EMI rate, you could clear your primary debt within 18-24 months with an additional ₹5,000 monthly contribution."
    });
  }
  if (context === "investment") {
    return JSON.stringify({
      advice: "Your portfolio shows a healthy diversification across asset classes. Consider rebalancing towards a 60-30-10 split between equity, fixed income, and alternatives. With your current savings rate, automating a ₹10,000 monthly SIP into a Nifty 50 index fund would compound significantly over 5-7 years, potentially growing to ₹10-12 lakhs."
    });
  }
  return "You are in offline simulation mode. Please configure your GEMINI_API_KEY in the Settings > Secrets panel to unlock full-stack live AI capability.";
}
