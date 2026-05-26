import { NextResponse } from "next/server";
import { getGemini, getOfflineFallback } from "@/src/lib/gemini";
import { Type } from "@google/genai";

export async function POST(req: Request) {
  try {
    const { userData, question } = await req.json();

    try {
      const ai = getGemini();
      const systemPrompt = `You are a premium investment advisor analyzing a user's financial portfolio.
The user profile is:
Income: ${userData.income}
Monthly Spending: ${userData.spending}
Investment Portfolio: ${JSON.stringify(userData.wealth)}
Debts: ${JSON.stringify(userData.debts)}
Goals: ${JSON.stringify(userData.goals)}

The user is asking: "${question}"

Provide expert investment guidance with specific allocation suggestions, risk analysis, and actionable next steps. Keep your response concise (3-5 sentences) but insightful. Address the user directly.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: question,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              advice: { type: Type.STRING, description: "Detailed investment advice response" },
            },
            required: ["advice"]
          }
        }
      });

      const text = response.text || "{}";
      return NextResponse.json(JSON.parse(text));
    } catch (err: any) {
      console.warn("Using offline fallback for investment advice:", err.message);
      return NextResponse.json({ advice: getOfflineFallback(question, "investment") });
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
