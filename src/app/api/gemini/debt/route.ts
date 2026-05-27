import { NextResponse } from "next/server";
import { getGemini, getOfflineFallback } from "@/src/lib/gemini";
import { Type } from "@google/genai";

export async function POST(req: Request) {
  try {
    const { userData, question } = await req.json();

    try {
      const ai = getGemini();
      const systemPrompt = `You are an expert debt management advisor analyzing a user's financial profile.
The user profile is:
Income: ${userData.income}
Monthly Spending: ${userData.spending}
Debts: ${JSON.stringify(userData.debts)}

The user is asking: "${question}"

Provide a detailed, actionable, and empathetic response about their debt situation. Include specific numbers, timelines, and strategies when relevant. Keep your response concise (3-5 sentences) but packed with insight. Address the user directly.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: question,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              advice: { type: Type.STRING, description: "Detailed debt advice response" },
            },
            required: ["advice"]
          }
        }
      });

      const text = response.text || "{}";
      return NextResponse.json(JSON.parse(text));
    } catch (err: any) {
      console.warn("Using offline fallback for debt advice:", err.message);
      return NextResponse.json(JSON.parse(getOfflineFallback(question, "debt")));
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
