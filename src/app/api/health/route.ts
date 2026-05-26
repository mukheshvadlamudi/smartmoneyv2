import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY;
  const hasApiKey = !!apiKey && apiKey !== "MY_GEMINI_API_KEY";
  return NextResponse.json({
    status: "ok",
    hasApiKey,
  });
}
