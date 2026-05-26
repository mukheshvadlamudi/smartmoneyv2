import { NextResponse } from "next/server";
import { getGemini } from "@/src/lib/gemini";

export async function POST(req: Request) {
  try {
    const { policy, userQuestion } = await req.json();

    try {
      const ai = getGemini();
      const prompt = `You are a simple-language insurance AI guide. Translate tricky policy terms into simple human instructions.
Policy: ${JSON.stringify(policy)}
Question: "${userQuestion}"
Explain clearly and objectively, with high supportive clarity:
1. Translating policy jargon
2. Potential coverage gaps
3. Step-by-step claims advice.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You represent a warm, calm, intelligent Insurance AI advisor. Avoid long academic definitions; give simple bullet lists and support."
        }
      });

      return NextResponse.json({ answer: response.text || "" });
    } catch (err: any) {
      return NextResponse.json({
        answer: `To help understand your **${policy.name}** cover better:\n\n1. **Simplifying the rule**: Your deductible is ₹${policy.deductible}. This means you cover pre-costs first, then the policy pays the remainder up to the ₹${policy.coverage.toLocaleString()} limit.\n2. **Action plan**: Save all original invoices, request a certificate of treatment/diagnosis immediately, and submit within 7 days via the portal. Since this is an offline run, please configure your \`GEMINI_API_KEY\` to enable dynamic policy policy extraction and coverage gap assessment.`
      });
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
