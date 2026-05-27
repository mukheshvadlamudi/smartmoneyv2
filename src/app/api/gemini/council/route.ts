import { NextResponse } from "next/server";
import { getGemini, getOfflineFallback } from "@/src/lib/gemini";
import { Type } from "@google/genai";

export async function POST(req: Request) {
  try {
    const { userData, question } = await req.json();

    try {
      const ai = getGemini();
      const systemPrompt = `You are a group of three distinct financial advisors assessing a user's financial profile.
The user profile is:
Income: ${userData.income}
Monthly Spending: ${userData.spending}
Debts: ${JSON.stringify(userData.debts)}
Goals: ${JSON.stringify(userData.goals)}
Asset Allocation: ${JSON.stringify(userData.wealth)}

Your three advisors are:
1. "optimist": A growth-oriented advisor who sees the upside, champions the user's ambitions, and finds aggressive, strategic pathways to expand wealth.
2. "critic": A defensive risk assessor who stress-tests the user's decisions, exposes hidden risks, demands that they face hard truths, and prioritizes absolute safety and liquidity.
3. "moneyGod": A supreme arbiter of wealth who weighs both the optimist's and the critic's perspectives, balances risk against potential rewards, and delivers a final, balanced, and authoritative verdict.

Produce exactly a JSON object with these 3 keys: "optimist", "critic", "moneyGod".
Each value must be a concise (2-4 sentences) analytical, premium, tone-compatible piece of advice addressing the user's current scenario or the specific question: "${question || "What should I focus on right now to optimize my financial life?"}".
Do not return any markdown formatting outside the JSON block. Let the JSON output map strictly to the specified structure.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: "Advise based on my financial profile.",
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              optimist: { type: Type.STRING, description: "Upside and growth-focused advice from the Optimist" },
              critic: { type: Type.STRING, description: "Risk-mitigation and warning advice from the Critic" },
              moneyGod: { type: Type.STRING, description: "Balanced arbiter final verdict from the Money God" },
            },
            required: ["optimist", "critic", "moneyGod"]
          }
        }
      });

      const text = response.text || "{}";
      return NextResponse.json(JSON.parse(text));
    } catch (err: any) {
      console.warn("Using offline fallback mode for Council Advice:", err.message);
      return NextResponse.json(JSON.parse(getOfflineFallback(question, "council")));
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
