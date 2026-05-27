import { NextResponse } from "next/server";
import { getGemini, getOfflineFallback } from "@/src/lib/gemini";
import { Type } from "@google/genai";

export async function POST(req: Request) {
  try {
    const { userData, scenarioText, variables } = await req.json();

    try {
      const ai = getGemini();
      const prompt = `Solve and simulate this financial scenario for the user: "${scenarioText}"
Current financials:
- Monthly Income: ${userData.income}
- Monthly Spending: ${userData.spending}
- Specific variables applied: ${JSON.stringify(variables)}

Calculate the realistic projections and impact. Return a JSON structure representing:
1. savingsImpact (estimated monthly change in cash, e.g., "+₹12,000" or "-₹8,000")
2. goalImpact (how much faster or slower goals are achieved, e.g., "Saves 18 days on Europe trip")
3. runwayMonths (how many months current savings cover complete expenses)
4. stressLevel (Stress level label: "Minimal", "Low", "Moderate", "High", "Critical")
5. summary (A precise, premium paragraph summarizing the outcome)
6. milestoneDate (When they can make the key transition or milestone purchase, e.g., "October 2026")
7. recommendation (A creative actionable recommendation by the AI Council)`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              savingsImpact: { type: Type.STRING },
              goalImpact: { type: Type.STRING },
              runwayMonths: { type: Type.INTEGER },
              stressLevel: { type: Type.STRING },
              summary: { type: Type.STRING },
              milestoneDate: { type: Type.STRING },
              recommendation: { type: Type.STRING }
            },
            required: ["savingsImpact", "goalImpact", "runwayMonths", "stressLevel", "summary", "milestoneDate", "recommendation"]
          }
        }
      });

      const text = response.text || "{}";
      return NextResponse.json(JSON.parse(text));
    } catch (err: any) {
      console.warn("Using offline fallback mode for Simulation:", err.message);
      return NextResponse.json(JSON.parse(getOfflineFallback(scenarioText, "simulate")));
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
