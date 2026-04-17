import { NextRequest } from "next/server";
import { assertGeminiConfigured, getGeminiFlash } from "@/lib/gemini";

const SYSTEM_PROMPT = `You are the Chief — a wise, warm guide in a detective training app that teaches older adults to spot AI scams and phone fraud.

Answer the user's exact question directly, using the screen context to give them the specific help they need right now. For navigation questions, tell them exactly what to tap. For questions about a task or clue, explain it in plain language. For strategy questions, give the single most important thing to do next. If the user says they are lost, tell them precisely what to do based on their current screen.

Always answer in 2 to 4 spoken sentences — no more. No bullet points, no numbered lists, no markdown. Be warm, direct, and plain. Never use technical jargon. Never give a vague or generic answer.`;

const FALLBACK = "I'm having a little trouble right now. Try tapping one of the items on your screen, and I'll be ready to help in a moment.";

export async function POST(req: NextRequest) {
  try {
    const { question, screenContext } = (await req.json()) as {
      question?: unknown;
      screenContext?: unknown;
    };

    if (!question || typeof question !== "string") {
      return Response.json({ error: "Missing question" }, { status: 400 });
    }

    assertGeminiConfigured();

    const context = typeof screenContext === "string" ? screenContext : "the main screen";
    const prompt = `Current screen: ${context}\n\nUser asked: ${question}`;

    const model = getGeminiFlash(SYSTEM_PROMPT);
    const result = await model.generateContent(prompt);
    const raw = result.response.text().trim() || FALLBACK;
    const response = raw.length > 600 ? raw.slice(0, 597) + "…" : raw;

    return Response.json({ response });
  } catch (err) {
    console.error("Voice guide error:", err);
    return Response.json({ response: FALLBACK, _debug: String(err) });
  }
}
